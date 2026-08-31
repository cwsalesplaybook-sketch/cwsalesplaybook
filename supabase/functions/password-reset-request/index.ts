// Edge function: password-reset-request
// Chamada pelo "Esqueci a senha" da tela de login. NÃO manda e-mail nem link
// para a pessoa — só avisa a gestora no Slack para ela resetar pelo Painel do
// Gestor. Sempre responde ok (não revela se a conta existe).
//
// Deploy: supabase functions deploy password-reset-request --no-verify-jwt
// Env vars (auto no Supabase): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//           Slack: SLACK_BOT_TOKEN + SLACK_CHANNEL_ID (ou SLACK_WEBHOOK_URL)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.104.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const DOMINIO = "@cardapioweb.com";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  let body: { email?: string } = {};
  try { body = await req.json(); } catch { /* ignore */ }
  const email = (body.email ?? "").trim().toLowerCase();

  const okResp = () => new Response(JSON.stringify({ ok: true }), { headers: CORS });

  if (!email.endsWith(DOMINIO)) return okResp();

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  // Tenta achar o nome da pessoa (só pra deixar o aviso mais legível)
  let nome = "";
  if (SUPABASE_URL && SERVICE_ROLE) {
    try {
      const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { autoRefreshToken: false, persistSession: false } });
      const { data } = await admin
        .from("sdr_profiles")
        .select("apelido")
        .eq("email", email)
        .maybeSingle();
      nome = (data as { apelido?: string } | null)?.apelido ?? "";
    } catch { /* ignore */ }
  }

  const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  await postSlack(
    `🔑 *Pedido de redefinição de senha*\n• ${nome ? nome + " — " : ""}${email}\n• ${agora}\n➡️ Resetar em: Painel do Gestor → aba SDRs → botão "Resetar senha"`,
  );

  return okResp();
});
