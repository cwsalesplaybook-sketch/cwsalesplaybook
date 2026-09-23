import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withUser } from '../_lib/db';
import { getCaller } from '../_lib/caller';
import { withErrorHandling } from '../_lib/handle';

// Promoções. RLS: dono vê/conclui a própria; líder gerencia a dos usuários
// que lidera (squads_lideradas). GET com ?userIds=a,b lê em lote (líder);
// sem parâmetro lê a própria pendente.
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  const caller = await getCaller(req);
  if (!caller) return res.status(401).json({ ok: false, error: 'Não autenticado' });

  if (req.method === 'GET') {
    const { userIds } = req.query as { userIds?: string };
    if (userIds) {
      const ids = userIds.split(',').filter(Boolean);
      const rows = await withUser(caller.sub, (client) =>
        client
          .query('select user_id, novo_papel, status from public.promocoes where user_id = any($1)', [ids])
          .then((r) => r.rows),
      );
      return res.status(200).json({ ok: true, promocoes: rows });
    }
    const rows = await withUser(caller.sub, (client) =>
      client
        .query(
          `select novo_papel, novo_squad, promovido_por, status from public.promocoes
           where user_id = $1 and status = 'pendente'`,
          [caller.sub],
        )
        .then((r) => r.rows),
    );
    return res.status(200).json({ ok: true, promocao: rows[0] ?? null });
  }

  if (req.method === 'PUT') {
    // líder cria/reemite uma promoção pendente pra um membro do squad
    const b = (req.body ?? {}) as { userId?: string; novoPapel?: string; novoSquad?: string | null; promovidoPor?: string };
    if (!b.userId || !b.novoPapel) return res.status(400).json({ ok: false, error: 'userId e novoPapel obrigatórios' });
    await withUser(caller.sub, (client) =>
      client.query(
        `insert into public.promocoes (user_id, novo_papel, novo_squad, promovido_por, status, created_at, concluida_at)
         values ($1,$2,$3,$4,'pendente', now(), null)
         on conflict (user_id) do update set
           novo_papel = excluded.novo_papel, novo_squad = excluded.novo_squad, promovido_por = excluded.promovido_por,
           status = 'pendente', created_at = now(), concluida_at = null`,
        [b.userId, b.novoPapel, b.novoSquad ?? null, b.promovidoPor || caller.email],
      ),
    );
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'PATCH') {
    // dono confirma a própria promoção: atualiza sdr_profiles + marca concluída
    const b = (req.body ?? {}) as { novoPapel?: string; novoSquad?: string | null };
    if (!b.novoPapel) return res.status(400).json({ ok: false, error: 'novoPapel obrigatório' });
    await withUser(caller.sub, async (client) => {
      await client.query('update public.sdr_profiles set papel = $1, squad = $2, updated_at = now() where user_id = $3', [
        b.novoPapel,
        b.novoSquad ?? null,
        caller.sub,
      ]);
      await client.query(
        `update public.promocoes set status = 'concluida', concluida_at = now() where user_id = $1`,
        [caller.sub],
      );
    });
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    // líder cancela uma promoção pendente
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ ok: false, error: 'userId obrigatório' });
    await withUser(caller.sub, (client) => client.query('delete from public.promocoes where user_id = $1', [userId]));
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}

export default withErrorHandling(handlerImpl);
