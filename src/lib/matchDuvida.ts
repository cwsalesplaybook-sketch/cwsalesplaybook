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

export interface DuvidaRota {
  persona: DuvidaPersona;
  item: DuvidaItem | null;
}

/** Roteia a pergunta livre do SDR pra melhor persona dentre todas, sem
 *  seleção manual prévia. Se nenhuma pergunta pré-cadastrada bater o
 *  suficiente, cai numa persona aleatória com `item: null` (fallback pro
 *  Slack dela). */
export function routeDuvida(query: string, personas: DuvidaPersona[]): DuvidaRota {
  const queryTokens = new Set(normalize(query));
  let bestPersona: DuvidaPersona | null = null;
  let bestItem: DuvidaItem | null = null;
  let bestScore = 0;

  if (queryTokens.size > 0) {
    for (const persona of personas) {
      for (const item of persona.perguntas) {
        const itemTokens = normalize([item.pergunta, ...(item.palavrasChave ?? [])].join(' '));
        let score = 0;
        for (const t of itemTokens) if (queryTokens.has(t)) score++;
        if (score > bestScore) {
          bestScore = score;
          bestPersona = persona;
          bestItem = item;
        }
      }
    }
  }

  if (bestScore >= 1 && bestPersona) {
    return { persona: bestPersona, item: bestItem };
  }
  const fallbackPersona = personas[Math.floor(Math.random() * personas.length)];
  return { persona: fallbackPersona, item: null };
}

export interface DuvidaSugestao {
  persona: DuvidaPersona;
  item: DuvidaItem;
  score: number;
}

/** "Dicas de palavra-chave": lista as perguntas pré-cadastradas mais
 *  parecidas com o que o SDR já digitou, pra ele escolher em vez de
 *  escrever a pergunta inteira. */
export function suggestDuvidas(query: string, personas: DuvidaPersona[], limit = 4): DuvidaSugestao[] {
  const queryTokens = new Set(normalize(query));
  if (queryTokens.size === 0) return [];

  const resultados: DuvidaSugestao[] = [];
  for (const persona of personas) {
    for (const item of persona.perguntas) {
      const itemTokens = normalize([item.pergunta, ...(item.palavrasChave ?? [])].join(' '));
      let score = 0;
      for (const t of itemTokens) if (queryTokens.has(t)) score++;
      if (score > 0) resultados.push({ persona, item, score });
    }
  }

  resultados.sort((a, b) => b.score - a.score);
  return resultados.slice(0, limit);
}
