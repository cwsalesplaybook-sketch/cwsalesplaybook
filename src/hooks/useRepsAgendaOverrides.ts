/** Correções manuais e reuniões avulsas da Agenda de Reuniões (Representantes) —
 *  Supabase em vez de localStorage, pra Gabrielly e Hyorranes verem as mesmas
 *  correções (útil já que o Pipedrive mistura os dois perfis). Uma linha com
 *  `pipedriveActivityId` corrige uma reunião existente (data/responsavel/hora
 *  sempre voltam completos, mesmo mudando só um campo); sem ele, é uma reunião
 *  só cadastrada aqui (retroativo que o Pipedrive não tem certo). */
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { TablesUpdate } from '@/integrations/supabase/types';

export interface AgendaOverrideRow {
  id: string;
  pipedriveActivityId: number | null;
  leadNome: string | null;
  leadTelefone: string | null;
  leadEmail: string | null;
  responsavel: string;
  data: string;
  hora: string | null;
  agendadaEm: string;
  presenca: 'compareceu' | 'nao_compareceu' | null;
}

function fromRow(row: any): AgendaOverrideRow {
  return {
    id: row.id,
    pipedriveActivityId: row.pipedrive_activity_id,
    leadNome: row.lead_nome,
    leadTelefone: row.lead_telefone,
    leadEmail: row.lead_email,
    responsavel: row.responsavel,
    data: row.data,
    hora: row.hora,
    agendadaEm: row.agendada_em,
    presenca: row.presenca,
  };
}

export function useRepsAgendaOverrides() {
  const [rows, setRows] = useState<AgendaOverrideRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.from('reps_agenda_reunioes').select('*');
    if (err) setError(err.message);
    else setRows((data ?? []).map(fromRow));
    setLoading(false);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  /** Corrige (ou marca presença de) uma reunião que já existe no Pipedrive.
   *  Sempre manda o estado completo — data/hora/responsavel/presença — pra
   *  não perder valores que não mudaram nessa chamada. */
  const salvarOverride = useCallback(async (
    pipedriveActivityId: number,
    patch: { responsavel: string; data: string; hora: string | null; agendadaEm: string; presenca?: 'compareceu' | 'nao_compareceu' | null },
  ) => {
    const { data: { session } } = await supabase.auth.getSession();
    const existente = rows.find(r => r.pipedriveActivityId === pipedriveActivityId);
    const { data, error: err } = await supabase
      .from('reps_agenda_reunioes')
      .upsert({
        ...(existente ? { id: existente.id } : {}),
        pipedrive_activity_id: pipedriveActivityId,
        responsavel: patch.responsavel,
        data: patch.data,
        hora: patch.hora,
        agendada_em: patch.agendadaEm, // sempre o add_time original do Pipedrive, nunca corrigido
        presenca: patch.presenca !== undefined ? patch.presenca : existente?.presenca ?? null,
        created_by: session?.user.id,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'pipedrive_activity_id' })
      .select()
      .single();
    if (err) { setError(err.message); return; }
    setRows(prev => [...prev.filter(r => r.pipedriveActivityId !== pipedriveActivityId), fromRow(data)]);
  }, [rows]);

  /** Adiciona uma reunião retroativa que não tem (ou tem errada) correspondência no Pipedrive. */
  const adicionarManual = useCallback(async (entrada: {
    leadNome: string; leadTelefone: string | null; leadEmail: string | null;
    responsavel: string; data: string; hora: string | null; agendadaEm: string;
  }) => {
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error: err } = await supabase
      .from('reps_agenda_reunioes')
      .insert({
        lead_nome: entrada.leadNome,
        lead_telefone: entrada.leadTelefone,
        lead_email: entrada.leadEmail,
        responsavel: entrada.responsavel,
        data: entrada.data,
        hora: entrada.hora,
        agendada_em: entrada.agendadaEm,
        created_by: session?.user.id,
      })
      .select()
      .single();
    if (err) { setError(err.message); return; }
    setRows(prev => [...prev, fromRow(data)]);
  }, []);

  /** Atualiza uma linha pelo id — usado pra reuniões manuais (presença,
   *  edição completa), que não têm pipedrive_activity_id pra casar por upsert. */
  const atualizar = useCallback(async (id: string, patch: Partial<{
    responsavel: string; data: string; hora: string | null; agendadaEm: string;
    presenca: 'compareceu' | 'nao_compareceu' | null;
    leadNome: string; leadTelefone: string | null; leadEmail: string | null;
  }>) => {
    const dbPatch: TablesUpdate<'reps_agenda_reunioes'> = { updated_at: new Date().toISOString() };
    if (patch.responsavel !== undefined) dbPatch.responsavel = patch.responsavel;
    if (patch.data !== undefined) dbPatch.data = patch.data;
    if (patch.hora !== undefined) dbPatch.hora = patch.hora;
    if (patch.agendadaEm !== undefined) dbPatch.agendada_em = patch.agendadaEm;
    if (patch.presenca !== undefined) dbPatch.presenca = patch.presenca;
    if (patch.leadNome !== undefined) dbPatch.lead_nome = patch.leadNome;
    if (patch.leadTelefone !== undefined) dbPatch.lead_telefone = patch.leadTelefone;
    if (patch.leadEmail !== undefined) dbPatch.lead_email = patch.leadEmail;

    const { data, error: err } = await supabase
      .from('reps_agenda_reunioes')
      .update(dbPatch)
      .eq('id', id)
      .select()
      .single();
    if (err) { setError(err.message); return; }
    setRows(prev => prev.map(r => (r.id === id ? fromRow(data) : r)));
  }, []);

  const remover = useCallback(async (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
    const { error: err } = await supabase.from('reps_agenda_reunioes').delete().eq('id', id);
    if (err) { setError(err.message); carregar(); }
  }, [carregar]);

  return { rows, loading, error, salvarOverride, adicionarManual, atualizar, remover, recarregar: carregar };
}
