// Edge function: editor-save
// Autoriza pela identidade do login Google (JWT da sessão) e grava em
// content_overrides usando service role.
//
// Convenção de setor (PREFIXO na chave — igual ao contentStore do front):
//   - SDR / Liderança: sem prefixo            (ex: "playbook.tabs")
//   - Closer:          "closer."              (ex: "closer.playbook.tabs")
//   - Parcerias:       "parcerias."
//   - Representante:   "representante."
//
// Regras de autorização:
//   - Mestre (MASTER_EMAILS): grava qualquer chave (qualquer setor).
//   - Gestor (LIDER_SETOR):   grava apenas chaves do seu setor (pelo prefixo).
//   - Fallback break-glass:   token HMAC da editor-login (tratado como mestre).
//
// ⚠️ Sincronize MASTER_EMAILS / LIDER_SETOR com a lista do front (EditorContext).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.104.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.104.0/cors";

type Setor = "sdr" | "closer" | "representante" | "parcerias";

const MASTER_EMAILS = new Set<string>([
  "ana.clara@cardapioweb.com",
  "vanessa.alencar@cardapioweb.com",
  "gabrielly.oliveira@cardapioweb.com",
  "johnnyalves@cardapioweb.com",
]);

const LIDER_SETOR: Record<string, Setor> = {
  "pedro.ferreira@cardapioweb.com": "sdr",
  "joelma.vieira@cardapioweb.com": "sdr",
  "antonio.anderson@cardapioweb.com": "sdr",
  "whenna.oliveira@cardapioweb.com": "closer",
  "hyorranes.souza@cardapioweb.com": "representante",
  "beatriz.magalhaes@cardapioweb.com": "parcerias",
};

interface Upsert { key: string; value: unknown }
interface Body {
  token?: string;
  key?: string;
  value?: unknown;
  upserts?: Upsert[];
  deletes?: string[];
  resetAll?: boolean;
}

/** Setor de uma chave a partir do PREFIXO. Sem prefixo conhecido = "sdr". */
function setorDaChave(key: string): Setor {
  if (key.startsWith("closer.")) return "closer";
  if (key.startsWith("parcerias.")) return "parcerias";
  if (key.startsWith("representante.")) return "representante";
  return "sdr";
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const [b64, sig] = token.split(".");
    if (!b64 || !sig) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const expected = await crypto.subtle.sign("HMAC", key, enc.encode(b64));
    const expectedB64 = btoa(String.fromCharCode(...new Uint8Array(expected)));
    if (expectedB64 !== sig) return false;
    const payload = JSON.parse(atob(b64));
    if (payload?.role !== "editor") return false;
    if (typeof payload?.exp !== "number") return false;
    if (Math.floor(Date.now() / 1000) > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

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
    const body: Body = await req.json().catch(() => ({}));

    // ── Identidade: 1) JWT do login Google; 2) fallback token HMAC ──
    let isMaster = false;
    let allowedSetor: Setor | null = null;

    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "").trim();
    let email = "";
    if (jwt && jwt !== SERVICE_ROLE) {
      const { data: { user } } = await supabase.auth.getUser(jwt);
      email = (user?.email ?? "").trim().toLowerCase();
    }

    if (email && MASTER_EMAILS.has(email)) {
      isMaster = true;
    } else if (email && LIDER_SETOR[email]) {
      allowedSetor = LIDER_SETOR[email];
    } else if (await verifyToken(body.token ?? "", SERVICE_ROLE)) {
      isMaster = true; // break-glass por senha mestre
    } else {
      return json({ error: "Sem permissão de edição" }, 401);
    }

    const chaveLiberada = (key: string): boolean => {
      if (isMaster) return true;
      if (allowedSetor) return setorDaChave(key) === allowedSetor;
      return false;
    };

    // ── resetAll: só mestre ──
    if (body.resetAll) {
      if (!isMaster) return json({ error: "Apenas mestre pode resetar tudo" }, 403);
      const { error } = await supabase.from("content_overrides").delete().neq("key", "");
      if (error) throw error;
      return json({ ok: true, reset: true });
    }

    // ── coleta upserts/deletes ──
    const upserts: Upsert[] = Array.isArray(body.upserts) ? body.upserts : [];
    const deletes: string[] = Array.isArray(body.deletes) ? body.deletes : [];
    if (typeof body.key === "string" && "value" in body) {
      upserts.push({ key: body.key, value: body.value });
    }
    if (upserts.length === 0 && deletes.length === 0) {
      return json({ error: "Nada para salvar" }, 400);
    }

    // ── valida escopo de setor de TODAS as chaves ──
    const todasChaves = [...upserts.map((u) => u.key), ...deletes];
    const negada = todasChaves.find((k) => !chaveLiberada(k));
    if (negada) {
      return json({ error: `Sem permissão para editar fora do seu setor (${negada})` }, 403);
    }

    if (upserts.length > 0) {
      const rows = upserts.map((u) => ({
        key: u.key,
        value: u.value as never,
        updated_by: email || (isMaster ? "master" : "gestor"),
      }));
      const { error } = await supabase.from("content_overrides").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    }
    if (deletes.length > 0) {
      const { error } = await supabase.from("content_overrides").delete().in("key", deletes);
      if (error) throw error;
    }

    return json({ ok: true, upserts: upserts.length, deletes: deletes.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return json({ error: msg }, 500);
  }
});
