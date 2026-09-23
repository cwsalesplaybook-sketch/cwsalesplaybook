import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withUser } from '../_lib/db';
import { getCaller } from '../_lib/caller';
import { withErrorHandling } from '../_lib/handle';

interface UpsertBody {
  email?: string;
  apelido?: string;
  papel?: string;
  squad?: string | null;
  squads_lideradas?: string[];
  cargo_lideranca?: string | null;
  cargo_representante?: string | null;
  onboarding_done?: boolean;
}

// Perfis (sdr_profiles). RLS decide o que cada um vê: dono, líder do squad,
// colega do mesmo squad. GET aceita ?squad=x ou ?squads=x,y (várias, pra
// líder de mais de um squad).
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  const caller = await getCaller(req);
  if (!caller) return res.status(401).json({ ok: false, error: 'Não autenticado' });

  if (req.method === 'GET') {
    const { squad, squads } = req.query as { squad?: string; squads?: string };
    const lista = squads ? squads.split(',').filter(Boolean) : squad ? [squad] : null;
    if (!lista || lista.length === 0) {
      return res.status(400).json({ ok: false, error: 'Informe squad ou squads' });
    }
    const rows = await withUser(caller.sub, (client) =>
      client
        .query('select user_id, apelido, email, papel, squad from public.sdr_profiles where squad = any($1)', [lista])
        .then((r) => r.rows),
    );
    return res.status(200).json({ ok: true, perfis: rows });
  }

  if (req.method === 'PUT') {
    // upsert completo do próprio perfil (ex.: fim do onboarding)
    const b = (req.body ?? {}) as UpsertBody;
    await withUser(caller.sub, (client) =>
      client.query(
        `insert into public.sdr_profiles
           (user_id, email, apelido, papel, squad, squads_lideradas, cargo_lideranca, cargo_representante, onboarding_done, updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9, now())
         on conflict (user_id) do update set
           email = excluded.email, apelido = excluded.apelido, papel = excluded.papel, squad = excluded.squad,
           squads_lideradas = excluded.squads_lideradas, cargo_lideranca = excluded.cargo_lideranca,
           cargo_representante = excluded.cargo_representante, onboarding_done = excluded.onboarding_done,
           updated_at = now()`,
        [
          caller.sub,
          b.email ?? caller.email,
          b.apelido ?? null,
          b.papel ?? null,
          b.squad ?? null,
          b.squads_lideradas ?? [],
          b.cargo_lideranca ?? null,
          b.cargo_representante ?? null,
          Boolean(b.onboarding_done),
        ],
      ),
    );
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'PATCH') {
    // troca só o próprio squad (ex.: SquadReassignGate)
    const { squad } = (req.body ?? {}) as { squad?: string };
    if (!squad) return res.status(400).json({ ok: false, error: 'squad obrigatório' });
    await withUser(caller.sub, (client) =>
      client.query('update public.sdr_profiles set squad = $1, updated_at = now() where user_id = $2', [
        squad,
        caller.sub,
      ]),
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}

export default withErrorHandling(handlerImpl);
