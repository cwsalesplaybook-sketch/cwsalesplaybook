// Edge function: editor-login
// Valida senha mestre (EDITOR_MASTER_PASSWORD) e devolve um token de sessão
// assinado por HMAC com o service role key. Token usado pelo editor-save.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.104.0/cors";

const TOKEN_TTL_SECONDS = 60 * 60 * 8; // 8h

async function sign(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function makeToken(secret: string): Promise<string> {
  const payload = JSON.stringify({
    role: "editor",
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    nonce: crypto.randomUUID(),
  });
  const b64 = btoa(payload);
  const sig = await sign(b64, secret);
  return `${b64}.${sig}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const MASTER = Deno.env.get("EDITOR_MASTER_PASSWORD");
    const SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!MASTER || !SECRET) {
      return new Response(
        JSON.stringify({ error: "Servidor não configurado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const password = typeof body?.password === "string" ? body.password : "";

    if (password !== MASTER) {
      // Pequeno atraso para mitigar brute-force.
      await new Promise((r) => setTimeout(r, 600));
      return new Response(
        JSON.stringify({ ok: false, error: "Senha incorreta" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const token = await makeToken(SECRET);
    return new Response(
      JSON.stringify({ ok: true, token, expiresIn: TOKEN_TTL_SECONDS }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
