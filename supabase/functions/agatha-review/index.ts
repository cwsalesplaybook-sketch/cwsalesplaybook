// Edge function: agatha-review
// Recebe o texto de uma aba (raspado pelo navegador da dona) e pede ao Gemini
// uma revisão de escrita (erros + sugestões). Faz upsert incremental do
// resultado em content_overrides['agatha.review'].
//
// Fluxo do cliente (src/lib/agathaReview.ts):
//   1. { reset: true, progress }            -> zera o resultado, running = true
//   2. { tab, progress } (uma vez por aba)  -> revisa e mescla por route+papel
//   3. { final: true } no último            -> running = false, grava lastRun

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.104.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const REVIEW_KEY = "agatha.review";
const MAX_CHARS = 12000; // limita tokens por aba

type FindingType = "erro" | "sugestao";

interface Finding {
  type: FindingType;
  trecho: string;
  sugestao: string;
  severidade: "baixa" | "media" | "alta";
}

interface TabResult {
  papel: string;
  route: string;
  label: string;
  findings: Finding[];
}

interface ReviewState {
  lastRun: string | null;
  running: boolean;
  progress?: { atual: number; total: number; label: string };
  tabs: TabResult[];
}

interface TabInput {
  papel: string;
  route: string;
  label: string;
  text: string;
}

const SYSTEM_INSTRUCTION = `Você é a Agatha, revisora de conteúdo de um playbook de vendas em português do Brasil.
Recebe o texto visível de UMA aba do dashboard e aponta:
- "erro": erros de ortografia, gramática, concordância, pontuação ou digitação.
- "sugestao": melhorias de clareza, objetividade ou tom (apenas quando agregam de verdade).

Regras:
- NÃO invente erros. Se o texto estiver correto, retorne uma lista vazia [].
- Ignore números, valores, códigos de cupom, siglas, nomes próprios e rótulos de UI soltos (ex: botões, menus).
- "trecho" deve ser o pedaço exato do texto com o problema (curto).
- "sugestao" deve ser a correção ou a melhoria proposta.
- "severidade": "alta" para erros que mudam o sentido ou aparecem em destaque; "media" para erros claros; "baixa" para detalhes de estilo.
- Seja conservadora: prefira poucos findings de alta confiança a muitos duvidosos.`;

const RESPONSE_SCHEMA = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      type: { type: "STRING", enum: ["erro", "sugestao"] },
      trecho: { type: "STRING" },
      sugestao: { type: "STRING" },
      severidade: { type: "STRING", enum: ["baixa", "media", "alta"] },
    },
    required: ["type", "trecho", "sugestao", "severidade"],
  },
};

async function revisarComGemini(text: string, key: string, model: string): Promise<Finding[]> {
  const trimmed = text.slice(0, MAX_CHARS).trim();
  if (trimmed.length < 20) return []; // aba praticamente vazia

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents: [{ role: "user", parts: [{ text: `TEXTO DA ABA:\n\n${trimmed}` }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.2,
    },
  };

  // Retry simples para 429/503
  for (let tentativa = 0; tentativa < 3; tentativa++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 429 || res.status === 503) {
      await new Promise((r) => setTimeout(r, 1000 * (tentativa + 1)));
      continue;
    }
    if (!res.ok) {
      throw new Error(`Gemini ${res.status}: ${await res.text()}`);
    }

    const json = await res.json();
    const raw = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  throw new Error("Gemini indisponível após retries");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY");
  const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash";

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new Response(JSON.stringify({ ok: false, erro: "Supabase não configurado" }), { status: 500, headers: CORS });
  }
  if (!GEMINI_KEY) {
    return new Response(JSON.stringify({ ok: false, erro: "GEMINI_API_KEY não configurado" }), { status: 500, headers: CORS });
  }

  let payload: { tab?: TabInput; reset?: boolean; final?: boolean; progress?: ReviewState["progress"] };
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, erro: "JSON inválido" }), { status: 400, headers: CORS });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  const now = new Date().toISOString();

  // Estado atual
  const { data: current } = await supabase
    .from("content_overrides")
    .select("value")
    .eq("key", REVIEW_KEY)
    .single();

  let state: ReviewState = (current?.value as ReviewState) ?? { lastRun: null, running: false, tabs: [] };

  if (payload.reset) {
    state = { lastRun: state.lastRun, running: true, tabs: [], progress: payload.progress };
  }
  if (payload.progress) state.progress = payload.progress;

  let findings: Finding[] = [];

  if (payload.tab) {
    try {
      findings = await revisarComGemini(payload.tab.text, GEMINI_KEY, GEMINI_MODEL);
    } catch (e) {
      // Não derruba o passeio inteiro por causa de uma aba; registra erro como finding informativo
      findings = [{
        type: "sugestao",
        trecho: `(falha ao revisar "${payload.tab.label}")`,
        sugestao: String(e),
        severidade: "baixa",
      }];
    }

    const tabs = (state.tabs ?? []).filter(
      (t) => !(t.route === payload.tab!.route && t.papel === payload.tab!.papel),
    );
    tabs.push({
      papel: payload.tab.papel,
      route: payload.tab.route,
      label: payload.tab.label,
      findings,
    });
    state.tabs = tabs;
  }

  if (payload.final) {
    state.running = false;
    state.lastRun = now;
    state.progress = undefined;
  }

  await supabase
    .from("content_overrides")
    .upsert(
      { key: REVIEW_KEY, value: state as never, updated_by: "agatha-review" },
      { onConflict: "key" },
    );

  return new Response(JSON.stringify({ ok: true, findings }), { headers: CORS });
});
