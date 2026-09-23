import type { VercelRequest, VercelResponse } from '@vercel/node';
import { queryAsService } from '../_lib/db';
import { getCaller } from '../_lib/caller';
import { isGestorOuMaster } from '../_lib/authz';
import { withErrorHandling } from '../_lib/handle';

// Visão de gestor: TODAS as metas do mês, de qualquer squad (Painel do Gestor /
// Painel de Controle). Diferente de api/profile/user-metas — aqui não há RLS
// de squad, só a checagem de e-mail autorizado.
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  const caller = await getCaller(req);
  if (!caller || !isGestorOuMaster(caller.email)) return res.status(403).json({ ok: false, error: 'Sem permissão' });

  if (req.method === 'GET') {
    const { mes } = req.query as { mes?: string };
    if (!mes) return res.status(400).json({ ok: false, error: 'mes obrigatório' });
    const rows = await queryAsService('select * from public.user_metas where mes = $1', [mes]);
    return res.status(200).json({ ok: true, metas: rows });
  }

  if (req.method === 'PATCH') {
    // atualiza uma meta já existente (nunca cria — o SDR precisa ter feito a primeira vez)
    const b = (req.body ?? {}) as {
      id?: string;
      sdr_id?: string;
      meta1?: number;
      meta2?: number;
      meta3?: number;
      ajuste?: number;
      mes?: string;
    };
    if (!b.id) return res.status(400).json({ ok: false, error: 'id obrigatório' });
    await queryAsService(
      `update public.user_metas set sdr_id = $1, meta1 = $2, meta2 = $3, meta3 = $4, ajuste = $5, mes = $6, updated_at = now()
       where id = $7`,
      [b.sdr_id ?? null, b.meta1 ?? 0, b.meta2 ?? 0, b.meta3 ?? 0, b.ajuste ?? 0, b.mes ?? null, b.id],
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}

export default withErrorHandling(handlerImpl);
