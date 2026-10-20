import type { VercelRequest, VercelResponse } from '@vercel/node';
import { queryAsService } from '../../_lib/db.js';
import { postSlack } from '../../_lib/slack.js';
import { withErrorHandling } from '../../_lib/handle.js';

const DOMINIO = '@cardapioweb.com';

// "Esqueci a senha" — não manda e-mail/link pra pessoa (nunca revela se a conta
// existe); só avisa a gestora no Slack pra ela resetar pelo Painel do Gestor.
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const body = (req.body ?? {}) as { email?: string };
  const email = String(body.email ?? '').trim().toLowerCase();
  const okResp = () => res.status(200).json({ ok: true });

  if (!email.endsWith(DOMINIO)) return okResp();

  let nome = '';
  try {
    const rows = await queryAsService<{ apelido: string | null }>(
      'select apelido from public.sdr_profiles where email = $1 limit 1',
      [email],
    );
    nome = rows[0]?.apelido ?? '';
  } catch {
    /* ignore */
  }

  const agora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  await postSlack(
    `🔑 *Pedido de redefinição de senha*\n• ${nome ? nome + ' — ' : ''}${email}\n• ${agora}\n➡️ Resetar em: Painel do Gestor → aba SDRs → botão "Resetar senha"`,
  );

  return okResp();
}

export default withErrorHandling(handlerImpl);
