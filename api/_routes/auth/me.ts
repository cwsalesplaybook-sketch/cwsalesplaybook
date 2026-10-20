import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withUser } from '../../_lib/db.js';
import { verifyAccessToken, readBearerToken } from '../../_lib/auth.js';
import { withErrorHandling } from '../../_lib/handle.js';

interface MeRow {
  id: string;
  email: string;
  apelido: string | null;
  papel: string | null;
  squad: string | null;
  squads_lideradas: string[] | null;
  cargo_lideranca: string | null;
  cargo_representante: string | null;
  onboarding_done: boolean | null;
}

async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const token = readBearerToken(req);
  const payload = token ? await verifyAccessToken(token) : null;
  if (!payload) return res.status(401).json({ ok: false, error: 'Não autenticado' });

  const rows = await withUser(payload.sub, (client) =>
    client
      .query<MeRow>(
        `select u.id, u.email, p.apelido, p.papel, p.squad, p.squads_lideradas,
                p.cargo_lideranca, p.cargo_representante, p.onboarding_done
         from public.users u
         left join public.sdr_profiles p on p.user_id = u.id
         where u.id = $1`,
        [payload.sub],
      )
      .then((r) => r.rows),
  );

  const row = rows[0];
  if (!row) return res.status(401).json({ ok: false, error: 'Conta não encontrada' });

  return res.status(200).json({ ok: true, user: row });
}

export default withErrorHandling(handlerImpl);
