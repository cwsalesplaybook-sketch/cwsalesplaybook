import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withUser } from '../_lib/db';
import { getCaller } from '../_lib/caller';
import { withErrorHandling } from '../_lib/handle';

interface Body {
  checked_ids?: string[];
  done_items?: number;
  total_items?: number;
  percent?: number;
}

// Progresso do onboarding — só o próprio usuário grava o dele (RLS garante isso).
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  const caller = await getCaller(req);
  if (!caller) return res.status(401).json({ ok: false, error: 'Não autenticado' });

  if (req.method === 'GET') {
    const rows = await withUser(caller.sub, (client) =>
      client.query('select * from public.onboarding_progress where user_id = $1', [caller.sub]).then((r) => r.rows),
    );
    return res.status(200).json({ ok: true, progress: rows[0] ?? null });
  }

  if (req.method === 'PUT') {
    const body = (req.body ?? {}) as Body;
    await withUser(caller.sub, (client) =>
      client.query(
        `insert into public.onboarding_progress (user_id, checked_ids, done_items, total_items, percent, updated_at)
         values ($1, $2, $3, $4, $5, now())
         on conflict (user_id) do update set
           checked_ids = excluded.checked_ids, done_items = excluded.done_items,
           total_items = excluded.total_items, percent = excluded.percent, updated_at = now()`,
        [caller.sub, body.checked_ids ?? [], body.done_items ?? 0, body.total_items ?? 0, body.percent ?? 0],
      ),
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}

export default withErrorHandling(handlerImpl);
