import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../_lib/db';
import { withErrorHandling } from '../_lib/handle';

// Leitura de content_overrides é pública (era RLS "for select using (true)" no
// Supabase) — não precisa de login, o front filtra por prefixo de setor.
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const rows = await query<{ key: string; value: unknown; updated_at: string; updated_by: string | null }>(
    'select key, value, updated_at, updated_by from public.content_overrides',
  );

  return res.status(200).json({ ok: true, overrides: rows });
}

export default withErrorHandling(handlerImpl);
