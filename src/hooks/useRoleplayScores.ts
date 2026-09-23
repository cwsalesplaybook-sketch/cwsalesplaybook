/** Placar do Roleplay — na API própria, ligado ao usuário logado de verdade
 *  (nada de nome digitado à mão). Antes de salvar ou de exibir o ranking,
 *  a pontuação é recalculada a partir da sequência de jogadas guardada
 *  (ver jogarSequencia em lib/roleplay/engine.ts), então um número editado
 *  na mão no banco não teria efeito nenhum no ranking. */
import { useCallback, useEffect, useState } from 'react';
import { apiGet, apiPost, apiDelete } from '@/lib/apiClient';
import { hasAccessToken } from '@/context/AuthContext';
import { jogarSequencia, type GameState, type Pontuacao } from '@/lib/roleplay/engine';

export interface RoleplayScore {
  id: string;
  userId: string;
  nome: string;
  personaId: string;
  dificuldade: string;
  pontos: number;
  rank: string;
  desfecho: string;
  raizRevelada: boolean;
  turnos: number;
  jogadas: string[];
  data: string;
}

function fromRow(row: {
  id: string; user_id: string; nome_exibicao: string; persona_id: string; dificuldade: string;
  pontos: number; rank: string; desfecho: string; raiz_revelada: boolean; turnos: number;
  jogadas: unknown; created_at: string;
}): RoleplayScore {
  return {
    id: row.id, userId: row.user_id, nome: row.nome_exibicao, personaId: row.persona_id,
    dificuldade: row.dificuldade, pontos: row.pontos, rank: row.rank, desfecho: row.desfecho,
    raizRevelada: row.raiz_revelada, turnos: row.turnos,
    jogadas: Array.isArray(row.jogadas) ? (row.jogadas as string[]) : [],
    data: row.created_at.slice(0, 10),
  };
}

export function useRoleplayScores() {
  const [scores, setScores] = useState<RoleplayScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    const r = await apiGet<{ scores?: Parameters<typeof fromRow>[0][]; error?: string }>('/api/profile/roleplay-scores');
    if (!r.data.ok) setError(r.data.error ?? 'Erro ao carregar');
    else setScores((r.data.scores ?? []).map(fromRow));
    setLoading(false);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  /** Recalcula a pontuação a partir da sequência de jogadas antes de gravar —
   *  o número exibido nunca é o que o cliente "diz" ter feito, é o que o
   *  motor realmente produz replayando a partida. */
  const salvar = useCallback(async (state: GameState, nome: string): Promise<{ ok: boolean; motivo?: string; pontuacao?: Pontuacao }> => {
    const replay = jogarSequencia(state.persona.id, state.jogadas);
    if (!replay || !replay.estado.fim) return { ok: false, motivo: 'Não foi possível validar a sequência da partida.' };

    if (!hasAccessToken()) return { ok: false, motivo: 'Sessão expirada — faça login de novo.' };

    const r = await apiPost<{ error?: string }>('/api/profile/roleplay-scores', {
      nome_exibicao: nome,
      persona_id: state.persona.id,
      dificuldade: state.persona.dificuldade,
      pontos: replay.pontuacao.total,
      rank: replay.pontuacao.rank.l,
      desfecho: replay.estado.fim.tipo,
      raiz_revelada: replay.estado.raizRevelada,
      turnos: replay.estado.turno,
      jogadas: state.jogadas,
    });
    if (!r.data.ok) return { ok: false, motivo: r.data.error };
    await carregar();
    return { ok: true, pontuacao: replay.pontuacao };
  }, [carregar]);

  const remover = useCallback(async (id: string) => {
    setScores((prev) => prev.filter((s) => s.id !== id));
    const r = await apiDelete<{ error?: string }>(`/api/profile/roleplay-scores?id=${encodeURIComponent(id)}`);
    if (!r.data.ok) { setError(r.data.error ?? 'Erro ao remover'); carregar(); }
  }, [carregar]);

  return { scores, loading, error, salvar, remover, recarregar: carregar };
}
