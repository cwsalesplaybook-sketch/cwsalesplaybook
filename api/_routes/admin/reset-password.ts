import type { VercelRequest, VercelResponse } from '@vercel/node';
import { queryAsService } from '../../_lib/db.js';
import { verifyAccessToken, readBearerToken, hashPassword } from '../../_lib/auth.js';
import { isGestorOuMaster } from '../../_lib/authz.js';
import { postSlack } from '../../_lib/slack.js';
import { withErrorHandling } from '../../_lib/handle.js';

function gerarSenha(): string {
  // 10 chars, fácil de ditar: sem caracteres ambíguos
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const num = '23456789';
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  let out = '';
  for (let i = 0; i < 3; i++) out += pick(abc);
  for (let i = 0; i < 4; i++) out += pick(num);
  for (let i = 0; i < 3; i++) out += pick(abc.toLowerCase());
  return out; // ex: KptR47xqm
}

// Botão "Resetar senha" do Painel do Gestor. Gera uma senha temporária,
// aplica na conta alvo e devolve em texto pra gestora repassar.
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const bearer = readBearerToken(req);
  const payload = bearer ? await verifyAccessToken(bearer) : null;
  if (!payload || !isGestorOuMaster(payload.email)) {
    return res.status(403).json({ ok: false, error: 'Sem permissão' });
  }

  const body = (req.body ?? {}) as { email?: string; userId?: string };
  const alvoEmail = String(body.email ?? '').trim().toLowerCase();
  let alvoId = String(body.userId ?? '').trim();

  if (!alvoId && alvoEmail) {
    const rows = await queryAsService<{ id: string }>('select id from public.users where email = $1', [alvoEmail]);
    alvoId = rows[0]?.id ?? '';
  }
  if (!alvoId) return res.status(404).json({ ok: false, error: 'Conta não encontrada' });

  const novaSenha = gerarSenha();
  const hash = await hashPassword(novaSenha);
  await queryAsService('update public.users set password_hash = $1, updated_at = now() where id = $2', [hash, alvoId]);
  // Derruba qualquer sessão aberta com a senha antiga.
  await queryAsService('update public.refresh_tokens set revoked_at = now() where user_id = $1 and revoked_at is null', [
    alvoId,
  ]);

  await postSlack(`✅ Senha temporária gerada para *${alvoEmail || alvoId}* por ${payload.email}.`);

  return res.status(200).json({ ok: true, senha: novaSenha });
}

export default withErrorHandling(handlerImpl);
