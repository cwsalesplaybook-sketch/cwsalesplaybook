/**
 * Engine do passeio da Agatha (revisora de conteúdo).
 *
 * Roda no navegador da dona: para cada aba-alvo, abre um <iframe> oculto em
 * modo scrape (`?agatha=scrape&papel=X`), espera o app sinalizar `__agathaReady`,
 * lê o texto renderizado de <main> e manda para a edge function `agatha-review`
 * (que chama o Gemini e persiste o resultado em content_overrides['agatha.review']).
 *
 * O "passeio" visível é justamente essa varredura sequencial, aba por aba.
 */
import { supabase } from '@/integrations/supabase/client';

export interface ReviewTarget {
  papel: string;
  route: string;
  label: string;
}

export interface ReviewProgress {
  atual: number;
  total: number;
  label: string;
}

/**
 * Abas revisadas, por setor. Rotas compartilhadas (Comece Aqui, Cultura,
 * Histórias) são revisadas uma vez só, sob papel SDR (são idênticas em todos
 * os dashboards via ForcePapel="SDR"). Lista data-driven — fácil de estender.
 */
export const REVIEW_TARGETS: ReviewTarget[] = [
  // Compartilhadas (uma vez)
  { papel: 'SDR', route: '/start', label: 'Comece Aqui' },
  { papel: 'SDR', route: '/cultura', label: 'Cultura' },
  { papel: 'SDR', route: '/historias', label: 'Histórias de Sucesso' },

  // SDR
  { papel: 'SDR', route: '/', label: 'SDR · Dashboard' },
  { papel: 'SDR', route: '/playbook', label: 'SDR · Playbook' },
  { papel: 'SDR', route: '/faq', label: 'SDR · FAQ' },
  { papel: 'SDR', route: '/regras', label: 'SDR · Regras de Conduta' },
  { papel: 'SDR', route: '/biblioteca', label: 'SDR · Biblioteca' },
  { papel: 'SDR', route: '/treinamento', label: 'SDR · Treinamento' },
  { papel: 'SDR', route: '/automacoes', label: 'SDR · Automações' },
  { papel: 'SDR', route: '/mural', label: 'SDR · Mural' },

  // Closer
  { papel: 'Closer', route: '/closer/dashboard', label: 'Closer · Dashboard' },
  { papel: 'Closer', route: '/closer/planos', label: 'Closer · Planos e Preços' },
  { papel: 'Closer', route: '/closer/templates', label: 'Closer · Templates' },
  { papel: 'Closer', route: '/closer/descontos', label: 'Closer · Descontos' },
  { papel: 'Closer', route: '/metas', label: 'Closer · Metas' },
  { papel: 'Closer', route: '/closer/objecoes', label: 'Closer · Objeções' },
  { papel: 'Closer', route: '/closer/processo', label: 'Closer · Processo de Venda' },
  { papel: 'Closer', route: '/closer/rotina', label: 'Closer · Rotina & Progressão' },
  { papel: 'Closer', route: '/closer/concorrentes', label: 'Closer · Concorrentes' },
  { papel: 'Closer', route: '/playbook/closer', label: 'Closer · Playbook' },

  // Parcerias
  { papel: 'Parcerias', route: '/', label: 'Parcerias · Dashboard' },
  { papel: 'Parcerias', route: '/playbook/parcerias', label: 'Parcerias · Playbook' },

  // Representante
  { papel: 'Representante', route: '/', label: 'Representante · Dashboard' },
  { papel: 'Representante', route: '/playbook/representantes', label: 'Representante · Playbook' },
];

const READY_TIMEOUT_MS = 9000;
const SETTLE_MS = 600;

let emAndamento = false;

/** Cria um iframe oculto, navega até a rota em modo scrape e devolve o texto de <main>. */
function rasparAba(target: ReviewTarget): Promise<string> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:1280px;height:900px;border:0;opacity:0;pointer-events:none;';
    const sep = target.route.includes('?') ? '&' : '?';
    iframe.src = `${target.route}${sep}agatha=scrape&papel=${encodeURIComponent(target.papel)}`;

    let finalizado = false;
    const finalizar = (texto: string) => {
      if (finalizado) return;
      finalizado = true;
      clearInterval(poll);
      clearTimeout(prazo);
      try { iframe.remove(); } catch { /* noop */ }
      resolve(texto);
    };

    const ler = () => {
      try {
        const main = iframe.contentDocument?.querySelector('main') as HTMLElement | null;
        return main?.innerText ?? '';
      } catch {
        return '';
      }
    };

    const poll = setInterval(() => {
      let pronto = false;
      try {
        pronto = Boolean((iframe.contentWindow as unknown as { __agathaReady?: boolean })?.__agathaReady);
      } catch { /* ainda carregando */ }
      if (pronto) {
        clearInterval(poll);
        // Pequeno settle pra animações/render assentarem antes de ler.
        setTimeout(() => finalizar(ler()), SETTLE_MS);
      }
    }, 200);

    const prazo = setTimeout(() => finalizar(ler()), READY_TIMEOUT_MS);

    document.body.appendChild(iframe);
  });
}

/**
 * Executa o passeio completo. `onProgress` é chamado a cada aba para a UI da
 * bolinha mostrar "Revisando: <label>…". Retorna ao terminar (ou em erro).
 */
export async function runAgathaReview(
  onProgress?: (p: ReviewProgress | null) => void,
): Promise<void> {
  if (emAndamento) return;
  emAndamento = true;

  const total = REVIEW_TARGETS.length;

  try {
    // Zera o resultado anterior e marca running = true.
    await supabase.functions.invoke('agatha-review', {
      body: { reset: true, progress: { atual: 0, total, label: 'Iniciando…' } },
    });

    for (let i = 0; i < REVIEW_TARGETS.length; i++) {
      const target = REVIEW_TARGETS[i];
      const progress: ReviewProgress = { atual: i + 1, total, label: target.label };
      onProgress?.(progress);

      const text = await rasparAba(target);
      const final = i === REVIEW_TARGETS.length - 1;

      await supabase.functions.invoke('agatha-review', {
        body: {
          tab: { papel: target.papel, route: target.route, label: target.label, text },
          progress,
          final,
        },
      });
    }
  } catch (e) {
    console.error('[agathaReview] falha no passeio:', e);
    // Garante que o estado não fique preso em running.
    await supabase.functions.invoke('agatha-review', { body: { final: true } }).catch(() => { /* noop */ });
  } finally {
    emAndamento = false;
    onProgress?.(null);
  }
}
