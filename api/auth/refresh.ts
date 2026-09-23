import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../_lib/db';
import { withErrorHandling } from '../_lib/handle';
import {
  signAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  serializeRefreshCookie,
  clearRefreshCookie,
  readRefreshCookie,
} from '../_lib/auth';

interface RefreshRow {
  id: string;
  user_id: string;
  expires_at: string;
  revoked_at: string | null;
}

async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const presented = readRefreshCookie(req);
  if (!presented) return res.status(401).json({ ok: false, error: 'Sem sessão' });

  const tokenHash = hashRefreshToken(presented);
  const rows = await query<RefreshRow>(
    'select id, user_id, expires_at, revoked_at from public.refresh_tokens where token_hash = $1',
    [tokenHash],
  );
  const row = rows[0];

  if (!row || row.revoked_at || new Date(row.expires_at) < new Date()) {
    res.setHeader('Set-Cookie', clearRefreshCookie());
    return res.status(401).json({ ok: false, error: 'Sessão expirada' });
  }

  // Rotação: revoga o token apresentado, emite um novo com a MESMA expiração
  // (preserva a janela do "lembrar de mim" original sem precisar guardar essa flag).
  await query('update public.refresh_tokens set revoked_at = now() where id = $1', [row.id]);

  const userRows = await query<{ email: string }>('select email from public.users where id = $1', [row.user_id]);
  if (!userRows[0]) {
    res.setHeader('Set-Cookie', clearRefreshCookie());
    return res.status(401).json({ ok: false, error: 'Conta não encontrada' });
  }

  const expires = new Date(row.expires_at);
  const newRefreshToken = generateRefreshToken();
  await query('insert into public.refresh_tokens (user_id, token_hash, expires_at) values ($1, $2, $3)', [
    row.user_id,
    hashRefreshToken(newRefreshToken),
    expires,
  ]);

  const accessToken = await signAccessToken({ sub: row.user_id, email: userRows[0].email });
  res.setHeader('Set-Cookie', serializeRefreshCookie(newRefreshToken, expires));
  return res.status(200).json({ ok: true, accessToken });
}

export default withErrorHandling(handlerImpl);
