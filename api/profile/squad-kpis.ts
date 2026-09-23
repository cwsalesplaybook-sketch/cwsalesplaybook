import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withUser } from '../_lib/db';
import { getCaller } from '../_lib/caller';
import { withErrorHandling } from '../_lib/handle';

// KPIs do squad. Mesmo modelo de acesso do team-metas (RLS: membro lê, líder edita).
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  const caller = await getCaller(req);
  if (!caller) return res.status(401).json({ ok: false, error: 'Não autenticado' });

  if (req.method === 'GET') {
    const { squad, mes } = req.query as { squad?: string; mes?: string };
    if (!squad || !mes) return res.status(400).json({ ok: false, error: 'squad e mes obrigatórios' });
    const rows = await withUser(caller.sub, (client) =>
      client.query('select * from public.squad_kpis where squad = $1 and mes = $2', [squad, mes]).then((r) => r.rows),
    );
    return res.status(200).json({ ok: true, kpis: rows[0] ?? null });
  }

  if (req.method === 'PUT') {
    const b = (req.body ?? {}) as {
      squad?: string;
      mes?: string;
      meta_clientes?: number;
      meta_clientes_dia?: number;
      meta_agendamentos_dia?: number;
      meta_ltr?: number;
      meta_no_show?: number;
    };
    if (!b.squad || !b.mes) return res.status(400).json({ ok: false, error: 'squad e mes obrigatórios' });
    await withUser(caller.sub, (client) =>
      client.query(
        `insert into public.squad_kpis
           (squad, mes, meta_clientes, meta_clientes_dia, meta_agendamentos_dia, meta_ltr, meta_no_show, updated_by, updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8, now())
         on conflict (squad, mes) do update set
           meta_clientes = excluded.meta_clientes, meta_clientes_dia = excluded.meta_clientes_dia,
           meta_agendamentos_dia = excluded.meta_agendamentos_dia, meta_ltr = excluded.meta_ltr,
           meta_no_show = excluded.meta_no_show, updated_by = excluded.updated_by, updated_at = now()`,
        [
          b.squad,
          b.mes,
          b.meta_clientes ?? 0,
          b.meta_clientes_dia ?? 0,
          b.meta_agendamentos_dia ?? 0,
          b.meta_ltr ?? 0,
          b.meta_no_show ?? 0,
          caller.email,
        ],
      ),
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}

export default withErrorHandling(handlerImpl);
