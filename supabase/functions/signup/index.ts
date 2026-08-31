// Edge function: signup
// Cria conta com e-mail + senha (só domínio @cardapioweb.com), já confirmada
// (sem e-mail de confirmação — o Auth do Supabase free é instável). No mesmo
// passo: cria a linha em sdr_profiles e tenta vincular a pessoa ao Pipedrive
// (casa o nome com as opções do campo "[QUAL] SDR/BDR" e grava user_metas.sdr_id
// do mês atual) — assim a Meta do Mês já conta os fechamentos sem a pessoa
// precisar confirmar o vínculo manualmente.
//
// Deploy: supabase functions deploy signup --no-verify-jwt
// Env vars: PIPEDRIVE_API_TOKEN (pro vínculo); SUPABASE_URL/SERVICE_ROLE_KEY são
//           automáticos; Slack: SLACK_BOT_TOKEN + SLACK_CHANNEL_ID (ou SLACK_WEBHOOK_URL)
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

const DOMINIO = "@cardapioweb.com";
const SDR_FIELD = "ce39d035fad6c74095053ffe04bdb9bbc9ae2a53"; // campo "[QUAL] SDR/BDR"

function normalizar(s: string): string {
  return (s ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Acha o id da opção do Pipedrive que casa com o nome informado. */
async function acharSdrId(nome: string): Promise<{ id: string; label: string } | null> {
  const token = Deno.env.get("PIPEDRIVE_API_TOKEN");
  if (!token || !nome) return null;
  try {
    const r = await fetch(`https://api.pipedrive.com/v1/dealFields?api_token=${token}`);
    const json = await r.json();
    if (!json.success) return null;
    const campo = (json.data || []).find((f: { key: string }) => f.key === SDR_FIELD);
    const options: { id: number; label: string }[] = campo?.options || [];
    const alvo = normalizar(nome);
    // 1) match exato
    let hit = options.find((o) => normalizar(o.label) === alvo);
    // 2) match por primeiro+último nome (labels do Pipedrive às vezes têm nome do meio)
    if (!hit) {
      const partes = alvo.split(" ");
      if (partes.length >= 2) {
        const pn = partes[0], un = partes[partes.length - 1];
        hit = options.find((o) => {
          const l = normalizar(o.label);
          return l.startsWith(pn + " ") && l.endsWith(" " + un);
        });
      }
    }
    return hit ? { id: String(hit.id), label: hit.label } : null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new Response(JSON.stringify({ ok: false, error: "Servidor não configurado" }), { status: 500, headers: CORS });
  }

  let body: { email?: string; password?: string; nome?: string } = {};
  try { body = await req.json(); } catch { /* ignore */ }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const nome = (body.nome ?? "").trim();

  if (!email.endsWith(DOMINIO)) {
    return new Response(JSON.stringify({ ok: false, error: `Use seu e-mail ${DOMINIO}` }), { headers: CORS });
  }
  if (password.length < 6) {
    return new Response(JSON.stringify({ ok: false, error: "A senha precisa ter pelo menos 6 caracteres" }), { headers: CORS });
  }
  if (nome.length < 3) {
    return new Response(JSON.stringify({ ok: false, error: "Informe seu nome completo" }), { headers: CORS });
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { autoRefreshToken: false, persistSession: false } });

  // Cria o usuário já confirmado
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: nome, name: nome },
  });

  if (createErr || !created?.user) {
    const msg = /already/i.test(createErr?.message ?? "")
      ? "Já existe uma conta com esse e-mail. Use 'Esqueci a senha'."
      : (createErr?.message ?? "Não foi possível criar a conta");
    return new Response(JSON.stringify({ ok: false, error: msg }), { headers: CORS });
  }

  const userId = created.user.id;

  // Perfil (idempotente)
  await admin.from("sdr_profiles").upsert(
    { user_id: userId, email, apelido: nome },
    { onConflict: "user_id" },
  );

  // Vínculo Pipedrive → user_metas do mês atual
  let vinculo: string | null = null;
  const sdr = await acharSdrId(nome);
  if (sdr) {
    const mes = new Date().toISOString().slice(0, 7);
    const { error: metaErr } = await admin.from("user_metas").upsert(
      {
        user_id: userId,
        sdr_id: sdr.id,
        meta1: 0, meta2: 0, meta3: 0, mega1: 0, mega2: 0, mega3: 0, ajuste: 0,
        mes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,mes" },
    );
    if (!metaErr) vinculo = sdr.label;
  }

  await postSlack(
    `🆕 *Nova conta no dashboard*\n• ${nome} (${email})\n• Vínculo Pipedrive: ${vinculo ? `✅ ${vinculo}` : "⚠️ não encontrado pelo nome — conferir na Meta do Mês"}`,
  );

  return new Response(JSON.stringify({ ok: true, vinculo }), { headers: CORS });
});
