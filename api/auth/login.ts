import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../_lib/db';
import { withErrorHandling } from '../_lib/handle';
import {
  verifyPassword,
  signAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  refreshTokenExpiry,
  serializeRefreshCookie,
} from '../_lib/auth';

async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const body = (req.body ?? {}) as { email?: string; password?: string; remember?: boolean };
  const email = String(body.email ?? '').trim().toLowerCase();
  const senha = String(body.password ?? '');

  const rows = await query<{ id: string; password_hash: string | null }>(
    'select id, password_hash from public.users where email = $1',
    [email],
  );
  const user = rows[0];
  if (!user || !user.password_hash || !(await verifyPassword(senha, user.password_hash))) {
    return res.status(200).json({ ok: false, error: 'E-mail ou senha incorretos.' });
  }

  const accessToken = await signAccessToken({ sub: user.id, email });
  const refreshToken = generateRefreshToken();
  const expires = refreshTokenExpiry(Boolean(body.remember));
  await query('insert into public.refresh_tokens (user_id, token_hash, expires_at) values ($1, $2, $3)', [
    user.id,
    hashRefreshToken(refreshToken),
    expires,
  ]);

  res.setHeader('Set-Cookie', serializeRefreshCookie(refreshToken, expires));
  return res.status(200).json({ ok: true, accessToken });
}

export default withErrorHandling(handlerImpl);
