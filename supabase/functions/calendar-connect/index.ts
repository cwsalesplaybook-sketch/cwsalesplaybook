// Edge function: calendar-connect
// Recebe o refresh_token do Google (obtido no OAuth com escopo
// calendar.readonly + access_type=offline + prompt=consent) e guarda
// server-side, associado ao usuário do JWT da sessão. O client nunca
// lê esse token de volta — só sabe se está "conectado" via calendar-status.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.104.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.104.0/cors";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return json({ error: "Servidor não configurado" }, 500);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!jwt) return json({ error: "Sem sessão" }, 401);

    const { data: { user } } = await supabase.auth.getUser(jwt);
    if (!user) return json({ error: "Sem sessão" }, 401);

    const body = await req.json().catch(() => ({}));
    const refreshToken = typeof body?.refresh_token === "string" ? body.refresh_token.trim() : "";
    if (!refreshToken) return json({ error: "refresh_token ausente" }, 400);

    const { error } = await supabase
      .from("google_calendar_connections")
      .upsert({ user_id: user.id, refresh_token: refreshToken, connected_at: new Date().toISOString() });
    if (error) throw error;

    return json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return json({ error: msg }, 500);
  }
});
