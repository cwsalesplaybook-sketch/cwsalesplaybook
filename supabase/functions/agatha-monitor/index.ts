// Edge function: agatha-monitor
// Consulta a API do Vercel para verificar o status do último deploy.
// Deve ser agendada via cron (a cada hora).
// Grava resultado em content_overrides['agatha.status'] e envia e-mail em caso de erro.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.104.0";

const CORS = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
const NOTIFY_EMAIL = "gabrieeellyoliveira@gmail.com";
const VERCEL_PROJECT_ID = "prj_9KWsBGIwTQnCqoKF1vUJbEALQAlK";
const VERCEL_TEAM_ID = "team_YegHke4FVgwe4x88y5ucmco1";

type Severity = "error" | "warning" | "ok";

interface Finding {
  id: string;
  severity: Severity;
  message: string;
  at: string;
}

interface AgentStatus {
  lastCheck: string;
  status: "ok" | "warning" | "error";
  findings: Finding[];
}

interface VercelDeployment {
  uid: string;
  name: string;
  state: string;
  readyState: string;
  errorMessage?: string;
  url: string;
  created: number;
  meta?: { githubCommitMessage?: string };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const RESEND_KEY = Deno.env.get("RESEND_API_KEY");
  const VERCEL_TOKEN = Deno.env.get("VERCEL_TOKEN");

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new Response(JSON.stringify({ error: "Supabase não configurado" }), { status: 500, headers: CORS });
  }
  if (!VERCEL_TOKEN) {
    return new Response(JSON.stringify({ error: "VERCEL_TOKEN não configurado" }), { status: 500, headers: CORS });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  const now = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  // Busca os 5 últimos deploys do projeto
  const deploysRes = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&teamId=${VERCEL_TEAM_ID}&limit=5`,
    { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
  );

  if (!deploysRes.ok) {
    const err = await deploysRes.text();
    return new Response(JSON.stringify({ error: `Vercel API: ${err}` }), { status: 500, headers: CORS });
  }

  const { deployments } = await deploysRes.json() as { deployments: VercelDeployment[] };

  // Lê findings anteriores para não duplicar
  const { data: current } = await supabase
    .from("content_overrides")
    .select("value")
    .eq("key", "agatha.status")
    .single();

  const currentStatus = (current?.value ?? { lastCheck: now, status: "ok", findings: [] }) as AgentStatus;
  const prevFindings: Finding[] = Array.isArray(currentStatus.findings) ? currentStatus.findings : [];
  const prevIds = new Set(prevFindings.map(f => f.id));

  const newFindings: Finding[] = [];

  for (const d of deployments) {
    const state = d.readyState ?? d.state ?? "";
    if ((state === "ERROR" || state === "CANCELED") && !prevIds.has(d.uid)) {
      const msg = d.errorMessage
        ? `Deploy falhou: ${d.errorMessage}`
        : `Deploy com estado "${state}"${d.meta?.githubCommitMessage ? ` — "${d.meta.githubCommitMessage}"` : ""}`;

      newFindings.push({
        id: d.uid,
        severity: "error",
        message: msg + ` (${d.url})`,
        at: new Date(d.created).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
      });
    }
  }

  // Último deploy com sucesso — adiciona finding ok se não era ok antes
  const latest = deployments[0];
  if (latest && (latest.readyState === "READY") && !prevIds.has(`ok-${latest.uid}`)) {
    newFindings.push({
      id: `ok-${latest.uid}`,
      severity: "ok",
      message: `Último deploy concluído com sucesso${latest.meta?.githubCommitMessage ? `: "${latest.meta.githubCommitMessage}"` : ""}.`,
      at: new Date(latest.created).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
    });
  }

  const allFindings = [...newFindings, ...prevFindings].slice(0, 20);
  const status: "ok" | "error" = allFindings.some(f => f.severity === "error") ? "error" : "ok";

  await supabase
    .from("content_overrides")
    .upsert(
      { key: "agatha.status", value: { lastCheck: now, status, findings: allFindings } as never, updated_by: "agatha-monitor" },
      { onConflict: "key" }
    );

  // Envia e-mail apenas para findings novos de erro
  const errorFindings = newFindings.filter(f => f.severity === "error");
  if (errorFindings.length > 0 && RESEND_KEY) {
    const items = errorFindings.map(f =>
      `<div style="background:#1f1040;border-radius:10px;padding:14px 18px;border:1px solid #ef444430;margin-bottom:12px">
        <p style="color:#fca5a5;font-size:13px;margin:0 0 4px">${f.message}</p>
        <p style="color:#7c5aa8;font-size:11px;margin:0">🕐 ${f.at}</p>
      </div>`
    ).join("");

    const html = `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#0e0721;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#2d1760,#1a0f2e);padding:28px 32px;text-align:center">
          <img src="https://cardapioweb.com/wp-content/uploads/2024/01/Logo-Cardapio-Web.png" alt="CW" style="height:32px;margin-bottom:16px"/>
          <h2 style="color:#ef4444;font-size:18px;margin:0">⚠️ Agatha detectou ${errorFindings.length} erro${errorFindings.length > 1 ? "s" : ""}</h2>
        </div>
        <div style="padding:28px 32px">${items}</div>
      </div>
    `;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: NOTIFY_EMAIL,
        subject: `🚨 Agatha: ${errorFindings.length} erro${errorFindings.length > 1 ? "s" : ""} no deploy`,
        html,
      }),
    }).catch(() => { /* fire-and-forget */ });
  }

  return new Response(
    JSON.stringify({ ok: true, status, newFindings: newFindings.length, total: allFindings.length }),
    { headers: CORS }
  );
});
