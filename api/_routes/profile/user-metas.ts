import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withUser } from '../../_lib/db.js';
import { getCaller } from '../../_lib/caller.js';
import { withErrorHandling } from '../../_lib/handle.js';

interface FullUpsertBody {
  sdr_id?: string;
  meta1?: number;
  meta2?: number;
  meta3?: number;
  mega1?: number;
  mega2?: number;
  mega3?: number;
  ajuste?: number;
  dias_uteis?: number;
  mes: string;
}

// user_metas. RLS: SDR só a própria; líder lê/edita a do squad que lidera;
// colega de squad lê. GET com ?userIds=a,b,c faz leitura em lote (a própria
// visibilidade de cada linha continua sendo decidida pelo RLS).
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  const caller = await getCaller(req);
  if (!caller) return res.status(401).json({ ok: false, error: 'Não autenticado' });

  if (req.method === 'GET') {
    const { mes, userIds } = req.query as { mes?: string; userIds?: string };
    if (!mes) return res.status(400).json({ ok: false, error: 'mes obrigatório' });

    if (userIds) {
      const ids = userIds.split(',').filter(Boolean);
      const rows = await withUser(caller.sub, (client) =>
        client.query('select * from public.user_metas where mes = $1 and user_id = any($2)', [mes, ids]).then((r) => r.rows),
      );
      return res.status(200).json({ ok: true, metas: rows });
    }

    const rows = await withUser(caller.sub, (client) =>
      client.query('select * from public.user_metas where user_id = $1 and mes = $2', [caller.sub, mes]).then((r) => r.rows),
    );
    return res.status(200).json({ ok: true, meta: rows[0] ?? null });
  }

  if (req.method === 'PUT') {
    // upsert completo — o próprio SDR configurando/ajustando a própria meta
    const b = (req.body ?? {}) as FullUpsertBody;
    if (!b.mes) return res.status(400).json({ ok: false, error: 'mes obrigatório' });
    await withUser(caller.sub, (client) =>
      client.query(
        `insert into public.user_metas
           (user_id, sdr_id, meta1, meta2, meta3, mega1, mega2, mega3, ajuste, dias_uteis, mes, updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, now())
         on conflict (user_id, mes) do update set
           sdr_id = excluded.sdr_id, meta1 = excluded.meta1, meta2 = excluded.meta2, meta3 = excluded.meta3,
           mega1 = excluded.mega1, mega2 = excluded.mega2, mega3 = excluded.mega3, ajuste = excluded.ajuste,
           dias_uteis = excluded.dias_uteis, updated_at = now()`,
        [
          caller.sub,
          b.sdr_id ?? null,
          b.meta1 ?? 0,
          b.meta2 ?? 0,
          b.meta3 ?? 0,
          b.mega1 ?? 0,
          b.mega2 ?? 0,
          b.mega3 ?? 0,
          b.ajuste ?? 0,
          b.dias_uteis ?? null,
          b.mes,
        ],
      ),
    );
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'PATCH') {
    // líder define meta1/2/3 de um membro do squad (upsert parcial, RLS via lidero_o_usuario)
    const b = (req.body ?? {}) as { userId?: string; sdrId?: string; mes?: string; meta1?: number; meta2?: number; meta3?: number };
    if (!b.userId || !b.mes) return res.status(400).json({ ok: false, error: 'userId e mes obrigatórios' });
    await withUser(caller.sub, (client) =>
      client.query(
        `insert into public.user_metas (user_id, sdr_id, mes, meta1, meta2, meta3, updated_at)
         values ($1,$2,$3,$4,$5,$6, now())
         on conflict (user_id, mes) do update set
           sdr_id = excluded.sdr_id, meta1 = excluded.meta1, meta2 = excluded.meta2, meta3 = excluded.meta3, updated_at = now()`,
        [b.userId, b.sdrId ?? null, b.mes, b.meta1 ?? 0, b.meta2 ?? 0, b.meta3 ?? 0],
      ),
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}

export default withErrorHandling(handlerImpl);
