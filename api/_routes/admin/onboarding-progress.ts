import type { VercelRequest, VercelResponse } from '@vercel/node';
import { queryAsService } from '../../_lib/db.js';
import { getCaller } from '../../_lib/caller.js';
import { isGestorOuMaster } from '../../_lib/authz.js';
import { withErrorHandling } from '../../_lib/handle.js';

// Visão de gestor: progresso de onboarding de todo mundo.
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const caller = await getCaller(req);
  if (!caller || !isGestorOuMaster(caller.email)) return res.status(403).json({ ok: false, error: 'Sem permissão' });

  const rows = await queryAsService('select * from public.onboarding_progress');
  return res.status(200).json({ ok: true, progresso: rows });
}

export default withErrorHandling(handlerImpl);
