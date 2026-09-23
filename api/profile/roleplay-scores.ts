import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withUser } from '../_lib/db';
import { getCaller } from '../_lib/caller';
import { withErrorHandling } from '../_lib/handle';

interface InsertBody {
  nome_exibicao: string;
  persona_id: string;
  dificuldade: string;
  pontos: number;
  rank: 'S' | 'A' | 'B' | 'C' | 'D';
  desfecho: 'vitoria' | 'parcial' | 'derrota' | 'tempo';
  raiz_revelada: boolean;
  turnos: number;
  jogadas: unknown;
}

// Placar do Roleplay. RLS: time inteiro vê tudo (ranking); cada um só cria/
// apaga a própria partida.
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  const caller = await getCaller(req);
  if (!caller) return res.status(401).json({ ok: false, error: 'Não autenticado' });

  if (req.method === 'GET') {
    const rows = await withUser(caller.sub, (client) =>
      client.query('select * from public.roleplay_scores order by pontos desc').then((r) => r.rows),
    );
    return res.status(200).json({ ok: true, scores: rows });
  }

  if (req.method === 'POST') {
    const b = (req.body ?? {}) as InsertBody;
    await withUser(caller.sub, (client) =>
      client.query(
        `insert into public.roleplay_scores
           (user_id, nome_exibicao, persona_id, dificuldade, pontos, rank, desfecho, raiz_revelada, turnos, jogadas)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          caller.sub,
          b.nome_exibicao,
          b.persona_id,
          b.dificuldade,
          b.pontos,
          b.rank,
          b.desfecho,
          Boolean(b.raiz_revelada),
          b.turnos,
          JSON.stringify(b.jogadas ?? []),
        ],
      ),
    );
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query as { id?: string };
    if (!id) return res.status(400).json({ ok: false, error: 'id obrigatório' });
    const result = await withUser(caller.sub, (client) => client.query('delete from public.roleplay_scores where id = $1', [id]));
    if (result.rowCount === 0) return res.status(403).json({ ok: false, error: 'Sem permissão ou não encontrado' });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}

export default withErrorHandling(handlerImpl);
