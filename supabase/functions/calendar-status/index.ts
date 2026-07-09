// Edge function: calendar-status
// Diz pro front se o usuário logado já conectou o Google Calendar,
// sem nunca expor o refresh_token (a tabela não tem policy de SELECT
// pro client — só service role lê).
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

    const { data, error } = await supabase
      .from("google_calendar_connections")
      .select("connected_at, last_synced_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;

    return json({
      connected: !!data,
      connectedAt: data?.connected_at ?? null,
      lastSyncedAt: data?.last_synced_at ?? null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return json({ error: msg }, 500);
  }
});
