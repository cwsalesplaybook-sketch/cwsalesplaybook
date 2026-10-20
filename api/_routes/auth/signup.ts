import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query, withUser } from '../../_lib/db.js';
import {
  hashPassword,
  signAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  refreshTokenExpiry,
  serializeRefreshCookie,
} from '../../_lib/auth.js';
import { postSlack } from '../../_lib/slack.js';
import { acharSdrId } from '../../_lib/pipedrive.js';
import { withErrorHandling } from '../../_lib/handle.js';

const DOMINIO = '@cardapioweb.com';

async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const body = (req.body ?? {}) as { email?: string; password?: string; nome?: string; remember?: boolean };
  const email = String(body.email ?? '').trim().toLowerCase();
  const senha = String(body.password ?? '');
  const nome = String(body.nome ?? '').trim();

  if (!email.endsWith(DOMINIO)) return res.status(200).json({ ok: false, error: `Use seu e-mail ${DOMINIO}` });
  if (senha.length < 6) return res.status(200).json({ ok: false, error: 'A senha precisa ter pelo menos 6 caracteres.' });
  if (nome.length < 3) return res.status(200).json({ ok: false, error: 'Informe seu nome completo.' });

  const existing = await query<{ id: string }>('select id from public.users where email = $1', [email]);
  if (existing.length > 0) {
    return res.status(200).json({ ok: false, error: "Já existe uma conta com esse e-mail. Use 'Esqueci a senha'." });
  }

  const passwordHash = await hashPassword(senha);
  const [user] = await query<{ id: string }>(
    'insert into public.users (email, password_hash) values ($1, $2) returning id',
    [email, passwordHash],
  );
  const userId = user.id;

  let vinculo: string | null = null;
  try {
    await withUser(userId, async (client) => {
      await client.query(
        `insert into public.sdr_profiles (user_id, email, apelido) values ($1, $2, $3)
         on conflict (user_id) do update set email = excluded.email, apelido = excluded.apelido`,
        [userId, email, nome],
      );
      const sdr = await acharSdrId(nome);
      if (sdr) {
        const mes = new Date().toISOString().slice(0, 7);
        await client.query(
          `insert into public.user_metas (user_id, sdr_id, meta1, meta2, meta3, mega1, mega2, mega3, ajuste, mes, updated_at)
           values ($1,$2,0,0,0,0,0,0,0,$3, now())
           on conflict (user_id, mes) do update set sdr_id = excluded.sdr_id, updated_at = now()`,
          [userId, sdr.id, mes],
        );
        vinculo = sdr.label;
      }
    });
  } catch (e) {
    // conta já foi criada em public.users — não desfaz, só loga; perfil pode ser corrigido depois
    console.error('signup: falha ao criar perfil/vínculo', e);
  }

  await postSlack(
    `🆕 *Nova conta no dashboard*\n• ${nome} (${email})\n• Vínculo Pipedrive: ${vinculo ? `✅ ${vinculo}` : '⚠️ não encontrado pelo nome — conferir na Meta do Mês'}`,
  );

  const accessToken = await signAccessToken({ sub: userId, email });
  const refreshToken = generateRefreshToken();
  const expires = refreshTokenExpiry(Boolean(body.remember));
  await query('insert into public.refresh_tokens (user_id, token_hash, expires_at) values ($1, $2, $3)', [
    userId,
    hashRefreshToken(refreshToken),
    expires,
  ]);

  res.setHeader('Set-Cookie', serializeRefreshCookie(refreshToken, expires));
  return res.status(200).json({ ok: true, accessToken, vinculo });
}

export default withErrorHandling(handlerImpl);
