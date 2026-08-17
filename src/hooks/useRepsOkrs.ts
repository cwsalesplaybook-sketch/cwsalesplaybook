/** OKRs & Metas do Squad de Representantes — alinhados em reunião de
 *  liderança (2026-08-17), independentes da Meta pessoal (Meta 1/2/3 de
 *  Representantes Cadastrados em useRepsMetas.ts). Cada card é livremente
 *  editável (título, atual, meta, unidade, nota) e NÃO entra no cálculo
 *  de ritmo/projeção do card principal — é só um painel de acompanhamento. */
import { useCallback, useEffect, useState } from 'react';

export interface OkrCard {
  id: string;
  titulo: string;
  atual?: number;
  meta?: number;
  unidade?: string;
  nota?: string;
}

const STORAGE_KEY = 'cw-reps-okrs';

const SEED: OkrCard[] = [
  { id: 'clientes-semana', titulo: 'Clientes por semana', meta: 25, unidade: 'clientes' },
  { id: 'agendamentos', titulo: 'Agendamentos', meta: 120, unidade: 'agendamentos' },
  { id: 'clientes-dia', titulo: 'Clientes por dia (ritmo)', meta: 1, atual: 26, unidade: 'clientes' },
  { id: 'gap-reps-ativados', titulo: 'Gap de reps ativados', meta: 4, unidade: 'reps até o fim da semana' },
  { id: 'ativar-reps', titulo: 'Ativar reps (OKR)', meta: 55, atual: 7, unidade: 'reps', nota: 'No ritmo, precisaríamos estar em 22 — déficit de 16' },
  { id: 'nps-certificacao', titulo: 'NPS da certificação', meta: 73, unidade: 'respostas com nota > 70' },
  { id: 'mentorias', titulo: 'Mentorias coletivas com reps', meta: 9, unidade: 'mentorias realizadas' },
  { id: 'novos-clientes-canal', titulo: 'Novos clientes — canal de representantes', meta: 81, atual: 61, unidade: 'clientes', nota: 'Objetivo maior do OKR: 376 novos clientes no total' },
  { id: 'novos-clientes-cidades-30', titulo: 'Novos clientes (cidades com base > 30)', meta: 53, atual: 26, unidade: 'clientes' },
  { id: 'reengajamento-marco', titulo: 'Marco — desengajado', nota: 'Precisa de reengajamento' },
  { id: 'disputa-reps', titulo: 'Disputa de reps — reengajar', meta: 81, unidade: 'reps na disputa' },
  { id: 'engajar-sem-contrato', titulo: 'Engajar reps sem contrato', nota: 'Fazer a galera sem contrato vender' },
];

function load(): OkrCard[] {
  if (typeof window === 'undefined') return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED;
  } catch {
    return SEED;
  }
}

export function useRepsOkrs() {
  const [okrs, setOkrs] = useState<OkrCard[]>(load);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(okrs)); } catch { /* ignore */ }
  }, [okrs]);

  const updateOkr = useCallback((id: string, patch: Partial<OkrCard>) => {
    setOkrs(list => list.map(o => o.id === id ? { ...o, ...patch } : o));
  }, []);

  const addOkr = useCallback(() => {
    const id = `okr-${Date.now()}`;
    setOkrs(list => [...list, { id, titulo: 'Novo card' }]);
    return id;
  }, []);

  const removeOkr = useCallback((id: string) => {
    setOkrs(list => list.filter(o => o.id !== id));
  }, []);

  return { okrs, updateOkr, addOkr, removeOkr };
}
