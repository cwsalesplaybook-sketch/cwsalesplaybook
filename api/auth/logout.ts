import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../_lib/db';
import { hashRefreshToken, clearRefreshCookie, readRefreshCookie } from '../_lib/auth';
import { withErrorHandling } from '../_lib/handle';

async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const presented = readRefreshCookie(req);
  if (presented) {
    await query('update public.refresh_tokens set revoked_at = now() where token_hash = $1 and revoked_at is null', [
      hashRefreshToken(presented),
    ]);
  }

  res.setHeader('Set-Cookie', clearRefreshCookie());
  return res.status(200).json({ ok: true });
}

export default withErrorHandling(handlerImpl);
