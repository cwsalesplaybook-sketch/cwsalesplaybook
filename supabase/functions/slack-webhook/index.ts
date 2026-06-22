// Edge function: slack-webhook
// Recebe eventos do Slack e cria avisos no dashboard quando @canal é mencionado.
//
// Setup:
//   1. Criar app Slack em https://api.slack.com/apps → Event Subscriptions
//   2. Apontar Request URL para: <supabase-url>/functions/v1/slack-webhook
//   3. Assinar o evento "message.channels" (ou "message.groups" para canais privados)
//   4. Adicionar env var SLACK_SIGNING_SECRET no projeto Supabase
//   5. Fazer deploy: supabase functions deploy slack-webhook
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.104.0";

type AvisoIcon = "BookOpen" | "Swords" | "Target" | "Megaphone" | "Calendar" | "Sparkles" | "Trophy";

interface Aviso {
  id: string;
  icon: AvisoIcon;
  badge: string;
  text: string;
}

const AVISOS_PADRAO: Aviso[] = [
  { id: "a1", icon: "BookOpen", badge: "Esta semana", text: "Cumbuca dessa semana: capítulos 7 e 8 do SPIN Selling." },
  { id: "a2", icon: "Swords", badge: "Berserker", text: "Métrica do Berserker deste mês: agendamentos realizados." },
  { id: "a3", icon: "Target", badge: "Q2", text: "Meta do trimestre: dobrar o time até o final de Q2." },
];

// Chaves de avisos para todos os setores
const AVISOS_KEYS = [
  "dashboard.avisos",
  "closer.dashboard.avisos",
  "parcerias.dashboard.avisos",
  "representante.dashboard.avisos",
];

const CORS = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };

async function verifySlackSignature(req: Request, body: string): Promise<boolean> {
  const secret = Deno.env.get("SLACK_SIGNING_SECRET");
  if (!secret) return false;

  const ts = req.headers.get("X-Slack-Request-Timestamp");
  const slackSig = req.headers.get("X-Slack-Signature");
  if (!ts || !slackSig) return false;

  // Previne replay attacks (janela de 5 min)
  if (Math.abs(Math.floor(Date.now() / 1000) - parseInt(ts, 10)) > 300) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const raw = await crypto.subtle.sign("HMAC", key, enc.encode(`v0:${ts}:${body}`));
  const hex = Array.from(new Uint8Array(raw)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `v0=${hex}` === slackSig;
}

function cleanSlackText(text: string): string {
  return text
    .replace(/<!channel>/g, "")
    .replace(/<!here>/g, "")
    .replace(/<@[A-Z0-9]+>/g, "")
    .replace(/<#[A-Z0-9]+\|([^>]+)>/g, "#$1")
    .replace(/<([^|>]+)\|([^>]+)>/g, "$2")
    .replace(/<([^>]+)>/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const bodyText = await req.text();

  const valid = await verifySlackSignature(req, bodyText);
  if (!valid) {
    return new Response(JSON.stringify({ error: "Assinatura inválida" }), { status: 401, headers: CORS });
  }

  let body: Record<string, unknown>;
  try { body = JSON.parse(bodyText); } catch {
    return new Response(JSON.stringify({ error: "JSON inválido" }), { status: 400, headers: CORS });
  }

  // Responde ao challenge de verificação do Slack
  if (body.type === "url_verification") {
    return new Response(JSON.stringify({ challenge: body.challenge }), { headers: CORS });
  }

  // Só processa eventos de mensagem sem subtipo (mensagens comuns)
  const event = body.event as Record<string, unknown> | undefined;
  if (!event || event.type !== "message" || event.subtype) {
    return new Response(JSON.stringify({ ok: true, skipped: true }), { headers: CORS });
  }

  const text = (event.text as string) ?? "";
  const hasChannelMention = text.includes("<!channel>") || text.includes("<!here>");
  if (!hasChannelMention) {
    return new Response(JSON.stringify({ ok: true, skipped: "sem @canal" }), { headers: CORS });
  }

  const cleanText = cleanSlackText(text);
  if (!cleanText) {
    return new Response(JSON.stringify({ ok: true, skipped: "mensagem vazia" }), { headers: CORS });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new Response(JSON.stringify({ error: "Supabase não configurado" }), { status: 500, headers: CORS });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  const newAviso: Aviso = {
    id: `slack-${Date.now()}`,
    icon: "Megaphone",
    badge: "Slack",
    text: cleanText,
  };

  // Lê os avisos atuais de cada setor e prepend o novo
  const { data: rows } = await supabase
    .from("content_overrides")
    .select("key, value")
    .in("key", AVISOS_KEYS);

  const existingByKey = new Map((rows ?? []).map((r: { key: string; value: unknown }) => [r.key, r.value]));

  const upserts = AVISOS_KEYS.map((key) => {
    const current = existingByKey.has(key)
      ? (existingByKey.get(key) as Aviso[])
      : AVISOS_PADRAO;
    const next = [newAviso, ...(Array.isArray(current) ? current : AVISOS_PADRAO)];
    return { key, value: next as never, updated_by: "slack-webhook" };
  });

  const { error } = await supabase.from("content_overrides").upsert(upserts, { onConflict: "key" });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: CORS });
  }

  return new Response(JSON.stringify({ ok: true, aviso: newAviso }), { headers: CORS });
});
