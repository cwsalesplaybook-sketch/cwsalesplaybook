/** RAG do Tira-dúvidas — usado quando o matchDuvida() local (banco curado
 *  de perguntas, ver src/lib/matchDuvida.ts) não encontra nada. Busca os
 *  trechos mais relevantes em rag_chunks (Confluence + Google Sheets +
 *  Central de Ajuda + docs da API, ver scripts/rag-ingest/) por full-text
 *  search do Postgres (função match_rag_chunks — sem custo/cota de IA
 *  nenhuma pra busca), e gera a resposta com o prompt da ClarIA adaptado
 *  (api/_lib/claria-prompt.js). Se não achar contexto bom o suficiente,
 *  retorna resposta: null — o frontend cai no fallback de sempre (Slack
 *  da pessoa real). */
import { createClient } from '@supabase/supabase-js';
import { CLARIA_BASE_PROMPT } from './_lib/claria-prompt.js';

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
const MATCH_COUNT = 6;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') return res.status(405).json({ ok: false, erro: 'Método não permitido' });
  if (!GEMINI_KEY) return res.status(500).json({ ok: false, erro: 'GEMINI_API_KEY não configurado' });
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ ok: false, erro: 'Supabase não configurado' });

  const { pergunta, persona } = req.body || {};
  if (!pergunta || typeof pergunta !== 'string') return res.status(400).json({ ok: false, erro: 'pergunta obrigatória' });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data: chunks, error } = await supabase.rpc('match_rag_chunks', {
      query_text: pergunta,
      match_count: MATCH_COUNT,
    });
    if (error) throw new Error(error.message);

    if (!chunks || chunks.length === 0) {
      return res.status(200).json({ ok: true, resposta: null });
    }

    const contexto = chunks
      .map((c, i) => `[Fonte ${i + 1}: ${c.title || c.source_url}]\n${c.content}`)
      .join('\n\n---\n\n');

    const personaFlavor = persona?.nome
      ? `\n\nVocê está respondendo como a versão IA de ${persona.nome} (${persona.cargo}), cujo foco temático é "${persona.tema}". Mesmo assim, você tem acesso à base de conhecimento inteira da Cardápio Web e pode responder qualquer dúvida de produto, objeção ou processo comercial, não só do seu tema.`
      : '';

    const prompt = `${CLARIA_BASE_PROMPT}${personaFlavor}

CONTEXTO RECUPERADO (use isso pra responder; se não bastar pra responder com segurança, siga a REGRA DE DESCONHECIMENTO):

${contexto}

PERGUNTA DO SDR:
${pergunta}`;

    const genRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4 },
        }),
      },
    );
    const genJson = await genRes.json();
    if (!genRes.ok) return res.status(502).json({ ok: false, erro: genJson?.error?.message || 'Erro na API do Gemini' });

    const texto = (genJson?.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
    if (!texto || texto.toUpperCase().startsWith('SEM_CONTEXTO')) {
      return res.status(200).json({ ok: true, resposta: null });
    }

    res.status(200).json({ ok: true, resposta: texto });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
