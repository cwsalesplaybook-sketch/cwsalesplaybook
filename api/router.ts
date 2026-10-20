import type { VercelRequest, VercelResponse } from '@vercel/node';

import adminListarUsuarios from './_routes/admin/listar-usuarios.js';
import adminOnboardingProgress from './_routes/admin/onboarding-progress.js';
import adminResetPassword from './_routes/admin/reset-password.js';
import adminSdrProfiles from './_routes/admin/sdr-profiles.js';
import adminUserMetas from './_routes/admin/user-metas.js';
import authChangePassword from './_routes/auth/change-password.js';
import authEditorLogin from './_routes/auth/editor-login.js';
import authGoogleCallback from './_routes/auth/google/callback.js';
import authGoogleStart from './_routes/auth/google/start.js';
import authLogin from './_routes/auth/login.js';
import authLogout from './_routes/auth/logout.js';
import authMe from './_routes/auth/me.js';
import authPasswordResetRequest from './_routes/auth/password-reset-request.js';
import authRefresh from './_routes/auth/refresh.js';
import authSignup from './_routes/auth/signup.js';
import contentList from './_routes/content/list.js';
import contentSave from './_routes/content/save.js';
import profileOnboardingProgress from './_routes/profile/onboarding-progress.js';
import profilePromocoes from './_routes/profile/promocoes.js';
import profileRoleplayScores from './_routes/profile/roleplay-scores.js';
import profileSdrProfiles from './_routes/profile/sdr-profiles.js';
import profileSquadKpis from './_routes/profile/squad-kpis.js';
import profileTeamMetas from './_routes/profile/team-metas.js';
import profileUserMetas from './_routes/profile/user-metas.js';

/**
 * Roteador único para /api/auth/*, /api/admin/*, /api/profile/* e /api/content/*.
 *
 * O plano Hobby da Vercel aceita no máximo 12 funções por deploy e cada arquivo
 * em api/ conta como uma. Por isso as rotas moram em api/_routes/ (o "_" faz a
 * Vercel não publicá-las como função) e o vercel.json reescreve
 * /api/<área>/<rota> para /api/router?__route=<área>/<rota>. As URLs públicas
 * não mudam: o front continua chamando /api/auth/me, /api/profile/user-metas etc.
 */
type Handler = (req: VercelRequest, res: VercelResponse) => unknown | Promise<unknown>;

const ROUTES: Record<string, Handler> = {
  'admin/listar-usuarios': adminListarUsuarios,
  'admin/onboarding-progress': adminOnboardingProgress,
  'admin/reset-password': adminResetPassword,
  'admin/sdr-profiles': adminSdrProfiles,
  'admin/user-metas': adminUserMetas,
  'auth/change-password': authChangePassword,
  'auth/editor-login': authEditorLogin,
  'auth/google/callback': authGoogleCallback,
  'auth/google/start': authGoogleStart,
  'auth/login': authLogin,
  'auth/logout': authLogout,
  'auth/me': authMe,
  'auth/password-reset-request': authPasswordResetRequest,
  'auth/refresh': authRefresh,
  'auth/signup': authSignup,
  'content/list': contentList,
  'content/save': contentSave,
  'profile/onboarding-progress': profileOnboardingProgress,
  'profile/promocoes': profilePromocoes,
  'profile/roleplay-scores': profileRoleplayScores,
  'profile/sdr-profiles': profileSdrProfiles,
  'profile/squad-kpis': profileSquadKpis,
  'profile/team-metas': profileTeamMetas,
  'profile/user-metas': profileUserMetas,
};

export default function router(req: VercelRequest, res: VercelResponse) {
  const raw = req.query.__route;
  const route = (Array.isArray(raw) ? raw[0] : raw ?? '').replace(/^\/+|\/+$/g, '');
  delete req.query.__route;

  const handler = ROUTES[route];
  if (!handler) return res.status(404).json({ ok: false, error: 'Rota não encontrada' });
  return handler(req, res);
}
