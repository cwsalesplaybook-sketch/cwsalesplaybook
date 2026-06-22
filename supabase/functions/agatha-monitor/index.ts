// Edge function: agatha-monitor
// Recebe webhooks de deployment do Vercel.
// Em caso de erro, salva em content_overrides['agatha.status'] e envia e-mail.
//
// Setup no Vercel:
//   Project → Settings → Git → Deploy Hooks (ou Webhooks)
//   Apontar para: <supabase-url>/functions/v1/agatha-monitor

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.104.0";

const CORS = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
const NOTIFY_EMAIL = "gabrieeellyoliveira@gmail.com";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const RESEND_KEY = Deno.env.get("RESEND_API_KEY");

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new Response(JSON.stringify({ error: "Supabase não configurado" }), { status: 500, headers: CORS });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  const now = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  // Lê o status atual para manter histórico (máx 20 findings)
  const { data: current } = await supabase
    .from("content_overrides")
    .select("value")
    .eq("key", "agatha.status")
    .single();

  const currentStatus = (current?.value ?? { lastCheck: now, status: "ok", findings: [] }) as AgentStatus;

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* ignore */ }

  const type = (body.type as string) ?? "";
  const deployment = body.deployment as Record<string, unknown> | undefined;

  let newFinding: Finding | null = null;

  // Vercel envia: deployment.error, deployment-ready, deployment.canceled, etc.
  if (type === "deployment.error" || (type === "deployment-ready" && deployment?.readyState === "ERROR")) {
    const url = (deployment?.url as string) ?? "desconhecido";
    const errorMessage = (deployment?.errorMessage as string) ?? "Erro desconhecido no deploy";
    const deployId = (deployment?.id as string) ?? `deploy-${Date.now()}`;

    newFinding = {
      id: deployId,
      severity: "error",
      message: `Deploy falhou: ${errorMessage} (${url})`,
      at: now,
    };
  } else if (type === "deployment-ready" && deployment?.readyState === "READY") {
    newFinding = {
      id: `ok-${Date.now()}`,
      severity: "ok",
      message: `Deploy concluído com sucesso.`,
      at: now,
    };
  }

  if (!newFinding) {
    return new Response(JSON.stringify({ ok: true, skipped: type }), { headers: CORS });
  }

  const prevFindings: Finding[] = Array.isArray(currentStatus.findings) ? currentStatus.findings : [];
  const findings = [newFinding, ...prevFindings].slice(0, 20);
  const status: "ok" | "warning" | "error" = findings.some(f => f.severity === "error") ? "error" : "ok";

  await supabase
    .from("content_overrides")
    .upsert(
      { key: "agatha.status", value: { lastCheck: now, status, findings } as never, updated_by: "agatha-monitor" },
      { onConflict: "key" }
    );

  // Envia e-mail apenas em caso de erro
  if (newFinding.severity === "error" && RESEND_KEY) {
    const html = `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#0e0721;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#2d1760,#1a0f2e);padding:28px 32px;text-align:center">
          <img src="https://cardapioweb.com/wp-content/uploads/2024/01/Logo-Cardapio-Web.png" alt="CW" style="height:32px;margin-bottom:16px"/>
          <h2 style="color:#ef4444;font-size:18px;margin:0">⚠️ Agatha detectou um erro</h2>
        </div>
        <div style="padding:28px 32px">
          <div style="background:#1f1040;border-radius:10px;padding:14px 18px;border:1px solid #ef444430;margin-bottom:16px">
            <p style="color:#7c5aa8;font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:.05em">Problema</p>
            <p style="color:#fca5a5;font-size:13px;margin:0">${newFinding.message}</p>
          </div>
          <p style="color:#7c5aa8;font-size:11px;margin:0">🕐 ${now}</p>
        </div>
      </div>
    `;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: NOTIFY_EMAIL,
        subject: `🚨 Agatha: Deploy falhou`,
        html,
      }),
    }).catch(() => { /* fire-and-forget */ });
  }

  return new Response(JSON.stringify({ ok: true, finding: newFinding }), { headers: CORS });
});
