import type { VercelRequest, VercelResponse } from '@vercel/node';
import { signEditorToken } from '../_lib/auth';
import { withErrorHandling } from '../_lib/handle';

const TOKEN_TTL_SECONDS = 60 * 60 * 8; // 8h

function esperar(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Login "break-glass" do editor: senha mestre única (não é conta de usuário),
// pra quando quem vai editar o conteúdo não tem/usa login normal. Devolve um
// JWT de curta duração usado pelo /api/content/save.
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const master = process.env.EDITOR_MASTER_PASSWORD;
  if (!master) return res.status(500).json({ ok: false, error: 'Servidor não configurado' });

  const body = (req.body ?? {}) as { password?: string };
  const password = typeof body.password === 'string' ? body.password : '';

  if (password !== master) {
    await esperar(600); // mitiga brute-force
    return res.status(401).json({ ok: false, error: 'Senha incorreta' });
  }

  const token = await signEditorToken();
  return res.status(200).json({ ok: true, token, expiresIn: TOKEN_TTL_SECONDS });
}

export default withErrorHandling(handlerImpl);
