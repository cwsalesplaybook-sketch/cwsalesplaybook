// Edge function: rafael-monitor
// Verifica a integridade do conteúdo dos 4 dashboards no Supabase.
// Deve ser agendada via cron (a cada hora).
// Grava resultado em content_overrides['rafael.status'].

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.104.0";

const CORS = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };

const SECTOR_KEYS: Record<string, string[]> = {
  SDR: [
    "dashboard.avisos",
    "playbook.tabs",
    "playbook.hero.title",
    "dashboard.meta",
  ],
  Closer: [
    "closer.dashboard.avisos",
    "closer.playbook.tabs",
    "closer.playbook.hero.title",
  ],
  Parcerias: [
    "parcerias.dashboard.avisos",
    "parcerias.playbook.tabs",
    "parcerias.playbook.hero.title",
  ],
  Representante: [
    "representante.dashboard.avisos",
    "representante.playbook.tabs",
    "representante.playbook.hero.title",
  ],
};

type Severity = "error" | "warning" | "ok";

interface Finding {
  id: string;
  severity: Severity;
  message: string;
  at: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new Response(JSON.stringify({ error: "Supabase não configurado" }), { status: 500, headers: CORS });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  const { data: rows, error } = await supabase
    .from("content_overrides")
    .select("key, value");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: CORS });
  }

  const existing = new Set((rows ?? []).map((r: { key: string }) => r.key));
  const now = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const findings: Finding[] = [];

  for (const [sector, keys] of Object.entries(SECTOR_KEYS)) {
    const missing = keys.filter(k => !existing.has(k));
    if (missing.length === keys.length) {
      findings.push({
        id: `${sector}-empty`,
        severity: "warning",
        message: `Dashboard ${sector} sem nenhum override configurado.`,
        at: now,
      });
    } else {
      for (const k of missing) {
        findings.push({
          id: k,
          severity: "warning",
          message: `Chave ausente: ${k}`,
          at: now,
        });
      }
    }
  }

  // Verifica se avisos tem itens vazios (array vazio)
  for (const row of (rows ?? []) as { key: string; value: unknown }[]) {
    if (row.key.endsWith("dashboard.avisos") && Array.isArray(row.value) && row.value.length === 0) {
      findings.push({
        id: `${row.key}-empty-avisos`,
        severity: "warning",
        message: `Mural de avisos vazio: ${row.key}`,
        at: now,
      });
    }
  }

  const status = findings.some(f => f.severity === "error")
    ? "error"
    : findings.some(f => f.severity === "warning")
      ? "warning"
      : "ok";

  const result = { lastCheck: now, status, findings };

  await supabase
    .from("content_overrides")
    .upsert({ key: "rafael.status", value: result as never, updated_by: "rafael-monitor" }, { onConflict: "key" });

  return new Response(JSON.stringify({ ok: true, status, findingsCount: findings.length }), { headers: CORS });
});
