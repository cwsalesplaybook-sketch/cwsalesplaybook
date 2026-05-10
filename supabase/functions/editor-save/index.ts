// Edge function: editor-save
// Recebe { token, key, value } ou { token, deletes: string[], upserts: {key,value}[] }
// Valida token (HMAC com service role key) e grava em content_overrides usando service role.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.104.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.104.0/cors";

interface Upsert { key: string; value: unknown }
interface Body {
  token?: string;
  // single-key
  key?: string;
  value?: unknown;
  // batch
  upserts?: Upsert[];
  deletes?: string[];
  resetAll?: boolean;
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return new Response(JSON.stringify({ error: "Servidor não configurado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body: Body = await req.json().catch(() => ({}));
    const token = body.token ?? "";
    if (!(await verifyToken(token, SERVICE_ROLE))) {
      return new Response(JSON.stringify({ error: "Token inválido ou expirado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // resetAll: apaga tudo
    if (body.resetAll) {
      const { error } = await supabase.from("content_overrides").delete().neq("key", "");
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true, reset: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // batch upserts/deletes
    const upserts: Upsert[] = Array.isArray(body.upserts) ? body.upserts : [];
    const deletes: string[] = Array.isArray(body.deletes) ? body.deletes : [];
    if (typeof body.key === "string" && "value" in body) {
      upserts.push({ key: body.key, value: body.value });
    }

    if (upserts.length === 0 && deletes.length === 0) {
      return new Response(JSON.stringify({ error: "Nada para salvar" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (upserts.length > 0) {
      const rows = upserts.map((u) => ({ key: u.key, value: u.value as never, updated_by: "editor" }));
      const { error } = await supabase.from("content_overrides").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    }
    if (deletes.length > 0) {
      const { error } = await supabase.from("content_overrides").delete().in("key", deletes);
      if (error) throw error;
    }

    return new Response(JSON.stringify({ ok: true, upserts: upserts.length, deletes: deletes.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
