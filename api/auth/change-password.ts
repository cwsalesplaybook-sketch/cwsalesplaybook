import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../_lib/db';
import { getCaller } from '../_lib/caller';
import { hashPassword } from '../_lib/auth';
import { withErrorHandling } from '../_lib/handle';

const MIN_SENHA = 6;

// Troca a própria senha (ex.: depois de entrar com uma senha temporária que o
// gestor gerou). Precisa estar logado — não confirma a senha atual porque o
// "Resetar senha" do gestor já serve como recuperação nesse caso.
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const caller = await getCaller(req);
  if (!caller) return res.status(401).json({ ok: false, error: 'Não autenticado' });

  const body = (req.body ?? {}) as { password?: string };
  const senha = String(body.password ?? '');
  if (senha.length < MIN_SENHA) {
    return res.status(200).json({ ok: false, error: `A senha precisa ter pelo menos ${MIN_SENHA} caracteres.` });
  }

  const hash = await hashPassword(senha);
  await query('update public.users set password_hash = $1, updated_at = now() where id = $2', [hash, caller.sub]);
  // Derruba as outras sessões — só essa continua valendo.
  await query('update public.refresh_tokens set revoked_at = now() where user_id = $1 and revoked_at is null', [caller.sub]);

  return res.status(200).json({ ok: true });
}

export default withErrorHandling(handlerImpl);
