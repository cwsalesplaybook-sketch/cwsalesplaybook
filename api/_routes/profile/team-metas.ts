import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withUser } from '../../_lib/db.js';
import { getCaller } from '../../_lib/caller.js';
import { withErrorHandling } from '../../_lib/handle.js';

// Meta do squad. RLS: membro lê a do próprio squad; líder edita a(s) do(s)
// squad(s) que lidera (escrita direta é bloqueada pra todo mundo que não seja
// líder — a policy "Escrita da meta do time só por service role" nega o resto).
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  const caller = await getCaller(req);
  if (!caller) return res.status(401).json({ ok: false, error: 'Não autenticado' });

  if (req.method === 'GET') {
    const { squad, mes } = req.query as { squad?: string; mes?: string };
    if (!squad || !mes) return res.status(400).json({ ok: false, error: 'squad e mes obrigatórios' });
    const rows = await withUser(caller.sub, (client) =>
      client.query('select * from public.team_metas where squad = $1 and mes = $2', [squad, mes]).then((r) => r.rows),
    );
    return res.status(200).json({ ok: true, meta: rows[0] ?? null });
  }

  if (req.method === 'PUT') {
    const b = (req.body ?? {}) as {
      squad?: string;
      mes?: string;
      meta1?: number;
      meta2?: number;
      meta3?: number;
      mega1?: number;
      mega2?: number;
      mega3?: number;
    };
    if (!b.squad || !b.mes) return res.status(400).json({ ok: false, error: 'squad e mes obrigatórios' });
    await withUser(caller.sub, (client) =>
      client.query(
        `insert into public.team_metas (squad, mes, meta1, meta2, meta3, mega1, mega2, mega3, updated_by, updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9, now())
         on conflict (squad, mes) do update set
           meta1 = excluded.meta1, meta2 = excluded.meta2, meta3 = excluded.meta3,
           mega1 = excluded.mega1, mega2 = excluded.mega2, mega3 = excluded.mega3,
           updated_by = excluded.updated_by, updated_at = now()`,
        [b.squad, b.mes, b.meta1 ?? 0, b.meta2 ?? 0, b.meta3 ?? 0, b.mega1 ?? 0, b.mega2 ?? 0, b.mega3 ?? 0, caller.email],
      ),
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}

export default withErrorHandling(handlerImpl);
