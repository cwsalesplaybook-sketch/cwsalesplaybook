/** Aba Concorrentes — diferenciais CW vs principais players do mercado. */
import { useState } from 'react';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const CW_DIFERENCIAIS = [
  'Ferramenta completa: automação + aumento de vendas + gestão em um único plano',
  'Suporte humanizado 7 dias por semana (não terceirizado)',
  'Disparador de WhatsApp com filtros avançados e agendamento',
  'Programa de fidelidade nativo (sem módulo extra na maioria dos planos)',
  'ChatBot com IA incluso no plano Delivery e Premium',
  'Parcerias com agências e gestores de tráfego: integração com Pixel, catálogo e API de conversões',
  'Cardápio de alta conversão — pensado para tráfego pago',
  'Crescimento junto ao cliente: quanto mais o restaurante vende, mais a CW cresce',
];

const CONCORRENTES = [
  {
    nome: 'Anota Aí',
    site: 'anota.ai',
    resumo: 'Comprado pelo iFood. Cresceu com promoções agressivas, mas trouxe problemas de suporte (terceirizado). Chatbot em múltiplos canais, mas pouca gestão.',
    pontos: [
      'Cardápio comprado pelo iFood — dependência estratégica',
      'Chatbot opera em WhatsApp, Facebook e Instagram',
      'Crescimento via promoções do iFood (suporte sobrecarregado)',
      'Suporte terceirizado com qualidade inconsistente',
      'Não foca em gestão operacional',
    ],
    vs: 'Nossa vantagem: independência do iFood, suporte próprio 7 dias, gestão completa no mesmo plano.',
    tag: 'Concorrente direto',
    tagCor: 'bg-red-50 text-red-600 border-red-200',
  },
  {
    nome: 'Saipos',
    site: 'saipos.com',
    resumo: 'Sistema focado em gestão para grandes empresas e franquias. Tem integração com a CW. Foco muito maior em ERP do que em cardápio digital e vendas diretas.',
    pontos: [
      'Foco em gestão — ótimo ERP, fraco em cardápio',
      'Muito usado por franquias e redes',
      'Não foca em automação de atendimento',
      'Temos integração com eles (parceria)',
      'Plano caro para o que entrega em marketing/vendas',
    ],
    vs: 'Nossa vantagem: somos Commerce First — priorizamos venda direta e aumento de GMV, não só gestão interna.',
    tag: 'Integração disponível',
    tagCor: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    nome: 'Consumer / Menu Dino',
    site: 'consumer.com.br',
    resumo: 'Consumer é sistema de gestão; Menu Dino é o cardápio digital (comprado). Precisa instalar software para atualizar cardápio — não funciona bem no celular. Cardápio com bugs, especialmente para tráfego pago.',
    pontos: [
      'Precisa instalar software para atualizar o cardápio',
      'Cardápio do Menu Dino com bugs em tráfego pago',
      'Sistema difícil de usar e pouco intuitivo',
      'Plano grátis até 200 pedidos, cobranças extras depois',
      'Tomada de decisão: requer PC, não mobile',
    ],
    vs: 'Nossa vantagem: cardápio 100% online, sem instalação, otimizado para conversão e tráfego pago.',
    tag: 'Ponto fraco: cardápio',
    tagCor: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    nome: 'Goomer',
    site: 'goomer.com.br',
    resumo: 'Ferramenta conhecida, foca muito em totens de mesa. Cardápio digital com fluxo difícil para o cliente finalizar pedido. Falta ferramentas de marketing. Plano grátis até 30 pedidos.',
    pontos: [
      'Foco principal em totens de autoatendimento',
      'Cardápio digital com UX ruim para conversão',
      'Falta ferramentas de marketing e tráfego',
      'Plano grátis até 30 pedidos — gatilho de lead frio',
      'Histórico salvo por apenas 7 dias no gratuito',
    ],
    vs: 'Nossa vantagem: cardápio de alta conversão, integração nativa com ferramentas de anúncio, programa de fidelidade.',
    tag: 'Foco em totens',
    tagCor: 'bg-cw-purple/10 text-cw-purple border-cw-purple/20',
  },
  {
    nome: 'WhatsMenu',
    site: 'whatsmenu.com.br',
    resumo: 'Ferramenta relativamente completa com bom custo-benefício. Cardápio de usabilidade ruim. Controle de motoboy (não rotas reais). Disparador por SMS — arcaico.',
    pontos: [
      'Cardápio com usabilidade ruim — UX fraca',
      '"Disparador" via SMS, não WhatsApp',
      'Controle de motoboy sem gestão real de rotas',
      'Precisa de módulo extra para gestão de entregadores',
      'Custo-benefício razoável, mas limitações técnicas',
    ],
    vs: 'Nossa vantagem: disparador via WhatsApp com filtros avançados, gestão de rotas real, cardápio de alta conversão.',
    tag: 'SMS ao invés de WhatsApp',
    tagCor: 'bg-red-50 text-red-600 border-red-200',
  },
  {
    nome: 'Instadelivery',
    site: 'instadelivery.com.br',
    resumo: 'Focado em automação de delivery, não em mesas. Sem grande foco em gestão. Valor elevado pelo que oferece. Cresceu por preços agressivos.',
    pontos: [
      'Foco em delivery — não atende mesas',
      'Sem foco em gestão operacional',
      'Valor elevado comparado às funcionalidades',
      'Preço agressivo como principal diferencial',
    ],
    vs: 'Nossa vantagem: plataforma completa para qualquer formato de food service, não só delivery.',
    tag: 'Só delivery',
    tagCor: 'bg-amber-50 text-amber-600 border-amber-200',
  },
];

function ConcorrenteCard({ c }: { c: typeof CONCORRENTES[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cw-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-cw-elevated transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-bold text-sm text-cw-text">{c.nome}</p>
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', c.tagCor)}>{c.tag}</span>
          </div>
          <p className="text-xs text-cw-muted truncate">{c.site}</p>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-cw-muted shrink-0 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-cw-border">
          <p className="text-xs text-cw-text/80 leading-relaxed mt-3 mb-3">{c.resumo}</p>
          <ul className="space-y-1 mb-3">
            {c.pontos.map(p => (
              <li key={p} className="flex items-start gap-2 text-xs text-cw-muted">
                <span className="text-cw-red shrink-0 mt-0.5">•</span>
                {p}
              </li>
            ))}
          </ul>
          <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
            <ShieldCheck className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
            <p className="text-xs text-green-700 font-medium">{c.vs}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function PlaybookConcorrentes() {
  return (
    <div className="space-y-6">

      {/* Nossos diferenciais */}
      <div className="cw-card p-5">
        <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">Nossos diferenciais no mercado</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {CW_DIFERENCIAIS.map(d => (
            <div key={d} className="flex items-start gap-2 bg-cw-purple/5 border border-cw-purple/15 rounded-xl px-3 py-2.5">
              <ShieldCheck className="h-3.5 w-3.5 text-cw-purple shrink-0 mt-0.5" />
              <p className="text-xs text-cw-text/85">{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Concorrentes */}
      <div>
        <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">Principais concorrentes — clique para expandir</p>
        <div className="space-y-2">
          {CONCORRENTES.map(c => <ConcorrenteCard key={c.nome} c={c} />)}
        </div>
      </div>

      <p className="text-[11px] text-cw-muted text-center pb-2">
        Lembre: não construímos produto para um nicho restrito. Somos infraestrutura para qualquer food service que venda direto ao consumidor. — Memorando CW
      </p>
    </div>
  );
}
