import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withErrorHandling } from './_lib/handle.js';

const NOTIFY_EMAIL = 'gabrieeellyoliveira@gmail.com';

// Avisa por e-mail a cada login (fire-and-forget do front). Não bloqueia login se falhar.
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) return res.status(500).json({ ok: false, error: 'RESEND_API_KEY não configurada' });

  const body = (req.body ?? {}) as { email?: string; name?: string };
  const email = body.email ?? 'desconhecido';
  const name = body.name ?? email;
  const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#0e0721;border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#2d1760,#1a0f2e);padding:28px 32px;text-align:center">
        <img src="https://cardapioweb.com/wp-content/uploads/2024/01/Logo-Cardapio-Web.png" alt="CW" style="height:32px;margin-bottom:16px"/>
        <h2 style="color:#fff;font-size:18px;margin:0">Login detectado</h2>
      </div>
      <div style="padding:28px 32px">
        <p style="color:#d4c0ee;font-size:14px;margin:0 0 16px">
          <strong style="color:#fff">${name}</strong> acabou de entrar no dashboard.
        </p>
        <div style="background:#1f1040;border-radius:10px;padding:14px 18px;border:1px solid #ffffff12">
          <p style="color:#7c5aa8;font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:.05em">E-mail</p>
          <p style="color:#d4c0ee;font-size:13px;margin:0">${email}</p>
        </div>
        <p style="color:#7c5aa8;font-size:11px;margin:18px 0 0">🕐 ${now}</p>
      </div>
    </div>
  `;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'onboarding@resend.dev', to: NOTIFY_EMAIL, subject: `🔑 ${name} entrou no dashboard`, html }),
  });

  if (!r.ok) return res.status(500).json({ ok: false, error: await r.text() });
  return res.status(200).json({ ok: true });
}

export default withErrorHandling(handlerImpl);
