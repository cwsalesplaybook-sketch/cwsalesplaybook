import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomBytes } from 'crypto';
import { withErrorHandling } from '../../_lib/handle';

const STATE_COOKIE = 'cw_oauth_state';

function baseUrl(req: VercelRequest): string {
  if (process.env.APP_URL) return process.env.APP_URL;
  const proto = (req.headers['x-forwarded-proto'] as string) ?? 'https';
  return `${proto}://${req.headers.host}`;
}

function handlerImpl(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).json({ ok: false, error: 'GOOGLE_CLIENT_ID não configurado' });

  const state = randomBytes(16).toString('base64url');
  const redirectUri = `${baseUrl(req)}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });

  // Cookie de curta duração só pra validar o callback (proteção CSRF do fluxo OAuth).
  res.setHeader(
    'Set-Cookie',
    `${STATE_COOKIE}=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api/auth/google; Max-Age=600`,
  );
  res.writeHead(302, { Location: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
  res.end();
}

export default withErrorHandling(handlerImpl);
