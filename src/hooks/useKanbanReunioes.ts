/** CRUD do Kanban de reuniões — board pessoal, um card por reunião marcada. */
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const ETAPAS = [
  'reuniao_marcada', 'confirmacao_1', 'confirmacao_2', 'no_show',
  'em_atendimento', 'link_pagamento', 'contratou', 'nao_contratou',
] as const;

export type Etapa = typeof ETAPAS[number];

export const ETAPA_LABEL: Record<Etapa, string> = {
  reuniao_marcada: 'Reunião Marcada',
  confirmacao_1: 'Confirmação 1',
  confirmacao_2: 'Confirmação 2',
  no_show: 'No-show',
  em_atendimento: 'Em Atendimento',
  link_pagamento: 'Link de Pagamento',
  contratou: 'Contratou',
  nao_contratou: 'Não Contratou',
};

export interface KanbanCard {
  id: string;
  contato: string;
  horario: string | null;
  etapa: Etapa;
  notas: string | null;
  closer: string | null;
  googleEventId: string | null;
}

function fromRow(row: any): KanbanCard {
  return {
    id: row.id,
    contato: row.contato,
    horario: row.horario,
    etapa: row.etapa,
    notas: row.notas,
    closer: row.closer,
    googleEventId: row.google_event_id,
  };
}

export function useKanbanReunioes() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('kanban_reunioes')
      .select('*')
      .order('horario', { ascending: true, nullsFirst: false });
    if (err) setError(err.message);
    else setCards((data ?? []).map(fromRow));
    setLoading(false);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const criar = useCallback(async (contato: string, horario: string | null, notas: string, closer: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data, error: err } = await supabase
      .from('kanban_reunioes')
      .insert({ user_id: session.user.id, contato, horario, notas: notas || null, closer: closer.trim() || null })
      .select()
      .single();
    if (err) { setError(err.message); return; }
    setCards((prev) => [...prev, fromRow(data)]);
  }, []);

  const moverEtapa = useCallback(async (id: string, etapa: Etapa) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, etapa } : c)));
    const { error: err } = await supabase
      .from('kanban_reunioes')
      .update({ etapa, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (err) { setError(err.message); carregar(); }
  }, [carregar]);

  const atualizarCloser = useCallback(async (id: string, closer: string) => {
    const valor = closer.trim() || null;
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, closer: valor } : c)));
    const { error: err } = await supabase
      .from('kanban_reunioes')
      .update({ closer: valor, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (err) { setError(err.message); carregar(); }
  }, [carregar]);

  const remover = useCallback(async (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    const { error: err } = await supabase.from('kanban_reunioes').delete().eq('id', id);
    if (err) { setError(err.message); carregar(); }
  }, [carregar]);

  return { cards, loading, error, criar, moverEtapa, atualizarCloser, remover, recarregar: carregar };
}
