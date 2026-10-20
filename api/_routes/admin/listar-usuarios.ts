import type { VercelRequest, VercelResponse } from '@vercel/node';
import { queryAsService } from '../../_lib/db.js';
import { verifyAccessToken, readBearerToken } from '../../_lib/auth.js';
import { isGestorOuMaster } from '../../_lib/authz.js';
import { withErrorHandling } from '../../_lib/handle.js';

interface Row {
  user_id: string;
  email: string;
  apelido: string | null;
  papel: string | null;
  squad: string | null;
  onboarding_done: boolean | null;
  created_at: string;
  tem_perfil: boolean;
}

// Lista TODO MUNDO que já criou conta (não só quem terminou o onboarding) —
// usada pelo "Usuários" do Modo Gestor. Só mestre/gestor de setor pode chamar.
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const bearer = readBearerToken(req);
  const payload = bearer ? await verifyAccessToken(bearer) : null;
  if (!payload || !isGestorOuMaster(payload.email)) {
    return res.status(403).json({ ok: false, error: 'Sem permissão' });
  }

  const rows = await queryAsService<Row>(`
    select u.id as user_id, u.email, p.apelido, p.papel, p.squad, p.onboarding_done,
           u.created_at, (p.user_id is not null) as tem_perfil
    from public.users u
    left join public.sdr_profiles p on p.user_id = u.id
  `);

  const usuarios = rows
    .map((r) => ({
      userId: r.user_id,
      email: r.email,
      apelido: r.apelido || r.email.split('@')[0],
      papel: r.papel,
      squad: r.squad,
      onboardingDone: Boolean(r.onboarding_done),
      temPerfil: r.tem_perfil,
      criadoEm: r.created_at,
    }))
    .sort((a, b) => a.apelido.localeCompare(b.apelido, 'pt-BR'));

  return res.status(200).json({ ok: true, usuarios });
}

export default withErrorHandling(handlerImpl);
