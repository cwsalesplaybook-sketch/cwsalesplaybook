import type { VercelRequest, VercelResponse } from '@vercel/node';
import { queryAsService } from '../_lib/db';
import { getCaller } from '../_lib/caller';
import { isGestorOuMaster } from '../_lib/authz';
import { withErrorHandling } from '../_lib/handle';

// Visão de gestor: todos os perfis com papel = SDR, de qualquer squad.
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const caller = await getCaller(req);
  if (!caller || !isGestorOuMaster(caller.email)) return res.status(403).json({ ok: false, error: 'Sem permissão' });

  const rows = await queryAsService(
    `select * from public.sdr_profiles where papel = 'SDR' order by created_at desc`,
  );
  return res.status(200).json({ ok: true, perfis: rows });
}

export default withErrorHandling(handlerImpl);
