import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { query, withUser } from '../../../_lib/db.js';
import {
  generateRefreshToken,
  hashRefreshToken,
  refreshTokenExpiry,
  serializeRefreshCookie,
  readCookie,
} from '../../../_lib/auth.js';
import { postSlack } from '../../../_lib/slack.js';
import { acharSdrId } from '../../../_lib/pipedrive.js';
import { withErrorHandling } from '../../../_lib/handle.js';

const STATE_COOKIE = 'cw_oauth_state';
const DOMINIO = '@cardapioweb.com';
const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

function baseUrl(req: VercelRequest): string {
  if (process.env.APP_URL) return process.env.APP_URL;
  const proto = (req.headers['x-forwarded-proto'] as string) ?? 'https';
  return `${proto}://${req.headers.host}`;
}

function redirectToLogin(res: VercelResponse, erro: string) {
  res.writeHead(302, { Location: `/login?erro=${encodeURIComponent(erro)}` });
  res.end();
}

async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return redirectToLogin(res, 'Login com Google não configurado no servidor.');
  }

  const { code, state } = req.query as { code?: string; state?: string };
  const expectedState = readCookie(req, STATE_COOKIE);
  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectToLogin(res, 'Sessão de login expirada, tente de novo.');
  }

  const redirectUri = `${baseUrl(req)}/api/auth/google/callback`;

  // 1) Troca o code pelos tokens do Google
  const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  const tokenJson = (await tokenResp.json()) as { id_token?: string; error?: string };
  if (!tokenResp.ok || !tokenJson.id_token) {
    return redirectToLogin(res, 'Não foi possível confirmar o login com o Google.');
  }

  // 2) Verifica o id_token (assinatura + issuer + audience) contra as chaves públicas do Google
  let claims: { email?: string; email_verified?: boolean; sub?: string; name?: string };
  try {
    const { payload } = await jwtVerify(tokenJson.id_token, GOOGLE_JWKS, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: clientId,
    });
    claims = payload as typeof claims;
  } catch {
    return redirectToLogin(res, 'Token do Google inválido.');
  }

  const email = (claims.email ?? '').trim().toLowerCase();
  const googleSub = claims.sub ?? '';
  const nome = (claims.name ?? '').trim();

  if (!claims.email_verified || !email.endsWith(DOMINIO)) {
    return redirectToLogin(res, `Use uma conta Google ${DOMINIO}.`);
  }

  // 3) Acha ou cria a conta. Se já existia por e-mail (ex.: criada por senha antes), vincula o google_sub.
  const existing = await query<{ id: string; google_sub: string | null }>(
    'select id, google_sub from public.users where email = $1 or google_sub = $2',
    [email, googleSub],
  );

  let userId: string;
  let isNovo = false;

  if (existing[0]) {
    userId = existing[0].id;
    if (!existing[0].google_sub) {
      await query('update public.users set google_sub = $1, updated_at = now() where id = $2', [googleSub, userId]);
    }
  } else {
    isNovo = true;
    const [created] = await query<{ id: string }>(
      'insert into public.users (email, google_sub) values ($1, $2) returning id',
      [email, googleSub],
    );
    userId = created.id;
  }

  let vinculo: string | null = null;
  if (isNovo) {
    try {
      await withUser(userId, async (client) => {
        await client.query(
          `insert into public.sdr_profiles (user_id, email, apelido) values ($1, $2, $3)
           on conflict (user_id) do update set email = excluded.email, apelido = excluded.apelido`,
          [userId, email, nome],
        );
        const sdr = await acharSdrId(nome);
        if (sdr) {
          const mes = new Date().toISOString().slice(0, 7);
          await client.query(
            `insert into public.user_metas (user_id, sdr_id, meta1, meta2, meta3, mega1, mega2, mega3, ajuste, mes, updated_at)
             values ($1,$2,0,0,0,0,0,0,0,$3, now())
             on conflict (user_id, mes) do update set sdr_id = excluded.sdr_id, updated_at = now()`,
            [userId, sdr.id, mes],
          );
          vinculo = sdr.label;
        }
      });
    } catch (e) {
      console.error('google callback: falha ao criar perfil/vínculo', e);
    }
    await postSlack(
      `🆕 *Nova conta no dashboard (Google)*\n• ${nome} (${email})\n• Vínculo Pipedrive: ${vinculo ? `✅ ${vinculo}` : '⚠️ não encontrado pelo nome — conferir na Meta do Mês'}`,
    );
  }

  // 4) Sessão própria (mesmo padrão do login por senha) — "lembrar de mim" sempre ligado aqui,
  // já que não há uma tela intermediária pra perguntar.
  const refreshToken = generateRefreshToken();
  const expires = refreshTokenExpiry(true);
  await query('insert into public.refresh_tokens (user_id, token_hash, expires_at) values ($1, $2, $3)', [
    userId,
    hashRefreshToken(refreshToken),
    expires,
  ]);

  res.setHeader('Set-Cookie', [
    serializeRefreshCookie(refreshToken, expires),
    // limpa o cookie de state, não serve mais
    'cw_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/api/auth/google; Max-Age=0',
  ]);

  // O front pega o access token chamando POST /api/auth/refresh ao carregar /start
  // (o refresh token já está no cookie httpOnly) — nada de token na URL.
  res.writeHead(302, { Location: '/start' });
  res.end();
}

export default withErrorHandling(handlerImpl);
