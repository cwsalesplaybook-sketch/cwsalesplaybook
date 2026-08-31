// Edge function: listar-usuarios
// Devolve TODOS os usuários que já criaram conta (auth.users), mesclados com o
// perfil (sdr_profiles) quando existe. Usada pelo "Usuários" do Modo Gestor pra
// listar todo mundo — não só quem já fez o onboarding.
// Só quem está em GESTOR_EMAILS ou MASTER_EMAILS pode chamar.
//
// Deploy: supabase functions deploy listar-usuarios  (verify_jwt LIGADO)
// Env vars: SUPABASE_URL / SERVICE_ROLE_KEY / ANON_KEY são automáticos.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.104.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

// Sincronizar com o front (EditorContext GESTOR_EMAILS + MASTER_EMAILS,
// UserContext MASTER_EMAILS).
const AUTORIZADOS = new Set<string>([
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
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new Response(JSON.stringify({ ok: false, error: "Servidor não configurado" }), { status: 500, headers: CORS });
  }

  // Quem está chamando?
  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const asUser = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: { user: caller } } = await asUser.auth.getUser();
  const callerEmail = (caller?.email ?? "").toLowerCase();
  if (!caller || !AUTORIZADOS.has(callerEmail)) {
    return new Response(JSON.stringify({ ok: false, error: "Sem permissão" }), { status: 403, headers: CORS });
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { autoRefreshToken: false, persistSession: false } });

  // Todos os perfis (mapa por user_id)
  const { data: perfis } = await admin
    .from("sdr_profiles")
    .select("user_id, email, apelido, papel, squad, onboarding_done");
  const perfilPorId = new Map(
    (perfis ?? []).map((p: Record<string, unknown>) => [p.user_id as string, p]),
  );

  // Todos os usuários do auth
  const usuarios: Record<string, unknown>[] = [];
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data?.users?.length) break;
    for (const u of data.users) {
      const p = perfilPorId.get(u.id) as Record<string, unknown> | undefined;
      const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
      usuarios.push({
        userId: u.id,
        email: u.email ?? "",
        apelido: (p?.apelido as string) || (meta.apelido as string) || (meta.full_name as string) || (u.email ?? "").split("@")[0],
        papel: (p?.papel as string) || (meta.papel as string) || null,
        squad: (p?.squad as string) ?? (meta.squad as string) ?? null,
        onboardingDone: Boolean(p?.onboarding_done ?? meta.onboarding_done ?? false),
        temPerfil: Boolean(p),
        criadoEm: u.created_at,
      });
    }
    if (data.users.length < 200) break;
  }

  usuarios.sort((a, b) => String(a.apelido).localeCompare(String(b.apelido), "pt-BR"));

  return new Response(JSON.stringify({ ok: true, usuarios }), { headers: CORS });
});
