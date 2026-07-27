/** Motor de busca do Tira-dúvidas — casa a pergunta livre do SDR com a
 *  pergunta pré-cadastrada mais próxima dentro da persona selecionada.
 *  Sem IA generativa: é só sobreposição de palavras-chave normalizadas. */
import type { DuvidaItem, DuvidaPersona } from '@/data/tiraDuvidas';

const STOPWORDS = new Set([
  'de', 'da', 'do', 'das', 'dos', 'um', 'uma', 'uns', 'umas', 'o', 'a', 'os', 'as',
  'que', 'pra', 'para', 'com', 'sem', 'por', 'em', 'no', 'na', 'nos', 'nas',
  'e', 'ou', 'é', 'eh', 'foi', 'ser', 'tem', 'tenho', 'tá', 'ta', 'tô', 'to',
  'me', 'meu', 'minha', 'seu', 'sua', 'você', 'voce', 'vc', 'eu', 'ele', 'ela',
  'isso', 'essa', 'esse', 'esta', 'este', 'sobre', 'como', 'qual', 'quais', 'quando',
  'aqui', 'lá', 'la', 'já', 'ja', 'não', 'nao', 'sim', 'muito', 'mais', 'mas',
]);

// Remove marcas diacríticas (acentos) após normalizar em NFD.
const DIACRITICS_RE = /[̀-ͯ]/g;

function normalize(text: string): string[] {
  return text
    .normalize('NFD')
    .replace(DIACRITICS_RE, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/** Retorna a pergunta pré-cadastrada com maior sobreposição de termos, ou
 *  null se nenhuma bater o suficiente pra valer a pena mostrar. */
export function matchDuvida(query: string, persona: DuvidaPersona): DuvidaItem | null {
  const queryTokens = new Set(normalize(query));
  if (queryTokens.size === 0) return null;

  let best: DuvidaItem | null = null;
  let bestScore = 0;

  for (const item of persona.perguntas) {
    const itemTokens = normalize([item.pergunta, ...(item.palavrasChave ?? [])].join(' '));
    let score = 0;
    for (const t of itemTokens) if (queryTokens.has(t)) score++;
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  return bestScore >= 1 ? best : null;
}
