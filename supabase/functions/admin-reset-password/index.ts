// Edge function: admin-reset-password
// Usada pelo botão "Resetar senha" no Painel do Gestor. Só quem está na lista
// MASTER_EMAILS pode chamar. Gera uma senha temporária, aplica na conta alvo e
// devolve a senha em texto pra gestora repassar. A pessoa entra com ela e troca
// depois em "Trocar senha".
//
// Deploy: supabase functions deploy admin-reset-password
//   (verify_jwt fica LIGADO — a checagem de master é feita aqui dentro)
// Env vars: SUPABASE_URL / SERVICE_ROLE_KEY / ANON_KEY são automáticos.
//           Slack: SLACK_BOT_TOKEN + SLACK_CHANNEL_ID (ou SLACK_WEBHOOK_URL)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.104.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

/** Posta no Slack via bot (doguinho) ou webhook. Nunca lança. */
async function postSlack(text: string): Promise<void> {
  const botToken = Deno.env.get("SLACK_BOT_TOKEN");
  const channel = Deno.env.get("SLACK_CHANNEL_ID");
  const webhook = Deno.env.get("SLACK_WEBHOOK_URL");
  try {
    if (botToken && channel) {
      await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", Authorization: `Bearer ${botToken}` },
        body: JSON.stringify({ channel, text, unfurl_links: false }),
      });
      return;
    }
    if (webhook) {
      await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
    }
  } catch { /* fire-and-forget */ }
}

// Masters + gestores de setor podem resetar senha (sincronizar com o front:
// EditorContext GESTOR_EMAILS/MASTER_EMAILS e UserContext MASTER_EMAILS).
const AUTORIZADOS = [
  // masters
  "gabrielly.oliveira@cardapioweb.com",
  "vanessa.alencar@cardapioweb.com",
  "johnnyalves@cardapioweb.com",
  "glauton@cardapioweb.com",
  "matheus.lessa@cardapioweb.com",
  // gestores de setor
  "pedro.ferreira@cardapioweb.com",
  "joelma.vieira@cardapioweb.com",
  "vithoria.pinheiro@cardapioweb.com",
  "ana.clara@cardapioweb.com",
  "whenna.oliveira@cardapioweb.com",
  "antonio.anderson@cardapioweb.com",
  "hyorranes.souza@cardapioweb.com",
  "beatriz.magalhaes@cardapioweb.com",
];

function gerarSenha(): string {
  // 10 chars, fácil de ditar: sem caracteres ambíguos
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const num = "23456789";
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  let out = "";
  for (let i = 0; i < 3; i++) out += pick(abc);
  for (let i = 0; i < 4; i++) out += pick(num);
  for (let i = 0; i < 3; i++) out += pick(abc.toLowerCase());
  return out; // ex: KptR47xqm
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new Response(JSON.stringify({ ok: false, error: "Servidor não configurado" }), { status: 500, headers: CORS });
  }

  // Quem está chamando?
  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "");
  const asUser = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: { user: caller }, error: callerErr } = await asUser.auth.getUser();
  const callerEmail = (caller?.email ?? "").toLowerCase();
  if (callerErr || !caller || !AUTORIZADOS.includes(callerEmail)) {
    return new Response(JSON.stringify({ ok: false, error: "Sem permissão" }), { status: 403, headers: CORS });
  }

  let body: { email?: string; userId?: string } = {};
  try { body = await req.json(); } catch { /* ignore */ }
  const alvoEmail = (body.email ?? "").trim().toLowerCase();
  let alvoId = (body.userId ?? "").trim();

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { autoRefreshToken: false, persistSession: false } });

  // Resolve o id pelo e-mail se não veio
  if (!alvoId && alvoEmail) {
    for (let page = 1; page <= 20 && !alvoId; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error || !data?.users?.length) break;
      const hit = data.users.find((u) => (u.email ?? "").toLowerCase() === alvoEmail);
      if (hit) alvoId = hit.id;
      if (data.users.length < 200) break;
    }
  }

  if (!alvoId) {
    return new Response(JSON.stringify({ ok: false, error: "Conta não encontrada" }), { status: 404, headers: CORS });
  }

  const novaSenha = gerarSenha();
  const { error: updErr } = await admin.auth.admin.updateUserById(alvoId, { password: novaSenha });
  if (updErr) {
    return new Response(JSON.stringify({ ok: false, error: updErr.message }), { status: 500, headers: CORS });
  }

  await postSlack(`✅ Senha temporária gerada para *${alvoEmail || alvoId}* por ${callerEmail}.`);

  return new Response(JSON.stringify({ ok: true, senha: novaSenha }), { headers: CORS });
});
