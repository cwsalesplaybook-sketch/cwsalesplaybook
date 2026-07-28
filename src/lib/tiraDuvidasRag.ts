/** Chama o RAG do Tira-dúvidas (api/tira-duvidas-rag.js) quando o
 *  matchDuvida() local não acha nada no banco curado. Retorna null se a
 *  API não tiver contexto suficiente ou der erro — nesses casos o
 *  TiraDuvidas.tsx cai no fallback de sempre (Slack da pessoa real). */
import type { DuvidaPersona } from '@/data/tiraDuvidas';

export async function askRag(pergunta: string, persona: DuvidaPersona): Promise<string | null> {
  try {
    const res = await fetch('/api/tira-duvidas-rag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pergunta,
        persona: { nome: persona.nome, cargo: persona.cargo, tema: persona.tema },
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.ok ? (json.resposta as string | null) : null;
  } catch {
    return null;
  }
}
