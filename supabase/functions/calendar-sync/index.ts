// Edge function: calendar-sync
// Puxa os eventos do Google Calendar do usuário logado (janela de -7 a
// +60 dias) e cria/atualiza cards no kanban_reunioes. Nunca sobrescreve
// a etapa de um card já existente (progresso manual do SDR é preservado)
// — só cria novo card pra evento novo e atualiza horário/contato/notas.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.104.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.104.0/cors";

const DIAS_PASSADO = 7;
const DIAS_FUTURO = 60;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

interface GEvent {
  id: string;
  status?: string;
  summary?: string;
  description?: string;
  start?: { dateTime?: string; date?: string };
}

async function trocarPorAccessToken(refreshToken: string, clientId: string, clientSecret: string) {
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!resp.ok) {
    const detalhe = await resp.text().catch(() => "");
    throw new Error(`Falha ao renovar token do Google (${resp.status}): ${detalhe}`);
  }
  const data = await resp.json();
  return data.access_token as string;
}

async function buscarEventos(accessToken: string) {
  const timeMin = new Date(Date.now() - DIAS_PASSADO * 86400_000).toISOString();
  const timeMax = new Date(Date.now() + DIAS_FUTURO * 86400_000).toISOString();
  const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
  url.searchParams.set("timeMin", timeMin);
  url.searchParams.set("timeMax", timeMax);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("maxResults", "250");

  const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!resp.ok) {
    const detalhe = await resp.text().catch(() => "");
    throw new Error(`Falha ao ler Google Calendar (${resp.status}): ${detalhe}`);
  }
  const data = await resp.json();
  return (data.items ?? []) as GEvent[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
    const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return json({ error: "Servidor não configurado" }, 500);
    }
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return json({ error: "GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET não configurados nas secrets da função" }, 500);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!jwt) return json({ error: "Sem sessão" }, 401);

    const { data: { user } } = await supabase.auth.getUser(jwt);
    if (!user) return json({ error: "Sem sessão" }, 401);

    const { data: conexao, error: erroConexao } = await supabase
      .from("google_calendar_connections")
      .select("refresh_token")
      .eq("user_id", user.id)
      .maybeSingle();
    if (erroConexao) throw erroConexao;
    if (!conexao) return json({ error: "Google Calendar não conectado" }, 400);

    const accessToken = await trocarPorAccessToken(conexao.refresh_token, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
    const eventos = await buscarEventos(accessToken);

    const { data: cardsExistentes, error: erroCards } = await supabase
      .from("kanban_reunioes")
      .select("id, google_event_id")
      .eq("user_id", user.id)
      .not("google_event_id", "is", null);
    if (erroCards) throw erroCards;
    const idPorEvento = new Map((cardsExistentes ?? []).map((c) => [c.google_event_id as string, c.id as string]));

    let criados = 0;
    let atualizados = 0;
    for (const evento of eventos) {
      if (evento.status === "cancelled") continue;
      const horario = evento.start?.dateTime ?? evento.start?.date ?? null;
      const contato = evento.summary?.trim() || "Sem título";
      const notas = evento.description?.slice(0, 500) ?? null;
      const existenteId = idPorEvento.get(evento.id);

      if (existenteId) {
        const { error } = await supabase
          .from("kanban_reunioes")
          .update({ contato, horario, notas, updated_at: new Date().toISOString() })
          .eq("id", existenteId);
        if (error) throw error;
        atualizados++;
      } else {
        const { error } = await supabase
          .from("kanban_reunioes")
          .insert({ user_id: user.id, contato, horario, notas, google_event_id: evento.id });
        if (error) throw error;
        criados++;
      }
    }

    await supabase
      .from("google_calendar_connections")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("user_id", user.id);

    return json({ ok: true, criados, atualizados });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return json({ error: msg }, 500);
  }
});
