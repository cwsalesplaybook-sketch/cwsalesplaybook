/** OKRs & Metas do Squad de Representantes — alinhados em reunião de
 *  liderança (2026-08-17), independentes da Meta pessoal (Meta 1/2/3 de
 *  useRepsMetas.ts). Cada card é livremente editável (título, atual, meta,
 *  unidade, nota) e NÃO entra no cálculo de ritmo/projeção do card
 *  principal — é só um painel de acompanhamento.
 *
 *  Cada frente (cargo) dentro do papel Representante tem seu próprio
 *  conjunto de cards, guardado numa chave de storage separada — Aquisição
 *  de Canal mantém a chave original (sem sufixo) por compatibilidade com
 *  quem já tinha cards salvos antes dessa separação existir. */
import { useCallback, useEffect, useState } from 'react';

export interface OkrCard {
  id: string;
  titulo: string;
  atual?: number;
  meta?: number;
  unidade?: string;
  nota?: string;
}

const SEED_AQUISICAO: OkrCard[] = [
  { id: 'clientes-semana', titulo: 'Clientes por semana', meta: 25, unidade: 'clientes' },
  { id: 'agendamentos', titulo: 'Agendamentos', meta: 120, unidade: 'agendamentos' },
  { id: 'clientes-dia', titulo: 'Clientes por dia (ritmo)', meta: 1, atual: 26, unidade: 'clientes' },
  { id: 'ativar-reps', titulo: 'Ativar reps (OKR)', meta: 55, atual: 7, unidade: 'reps', nota: 'No ritmo, precisaríamos estar em 22 — déficit de 16' },
  { id: 'nps-certificacao', titulo: 'NPS da certificação', meta: 73, unidade: 'respostas com nota > 70' },
  { id: 'mentorias', titulo: 'Mentorias coletivas com reps', meta: 9, unidade: 'mentorias realizadas' },
  { id: 'novos-clientes-canal', titulo: 'Novos clientes — canal de representantes', meta: 81, atual: 61, unidade: 'clientes', nota: 'Objetivo maior do OKR: 376 novos clientes no total' },
  { id: 'novos-clientes-cidades-30', titulo: 'Novos clientes (cidades com base > 30)', meta: 53, atual: 26, unidade: 'clientes' },
];

// PSM ainda não teve seus OKRs de squad alinhados além da meta de ativação
// (que já tem card próprio na Meta pessoal) — começa vazio, editável na hora.
const SEED_PSM: OkrCard[] = [];

const SEEDS: Record<string, OkrCard[]> = {
  'Aquisição de Canal': SEED_AQUISICAO,
  'PSM': SEED_PSM,
};

/** IDs removidos a pedido da Gabi (2026-08-17) — filtrados também de quem já
 *  tinha o seed antigo salvo no localStorage, não só de instalações novas. */
const REMOVED_IDS = new Set(['reengajamento-marco', 'disputa-reps', 'engajar-sem-contrato', 'gap-reps-ativados']);

function storageKey(cargo: string) {
  // Aquisição de Canal usa a chave original, sem sufixo — compatibilidade
  // com quem já tinha cards salvos antes de existir separação por cargo.
  return cargo === 'Aquisição de Canal' ? 'cw-reps-okrs' : `cw-reps-okrs-${cargo.toLowerCase().replace(/\s+/g, '-')}`;
}

function load(cargo: string): OkrCard[] {
  const seed = SEEDS[cargo] ?? [];
  if (typeof window === 'undefined') return seed;
  try {
    const raw = localStorage.getItem(storageKey(cargo));
    if (!raw) return seed;
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : seed;
    return list.filter((o: OkrCard) => !REMOVED_IDS.has(o.id));
  } catch {
    return seed;
  }
}

export function useRepsOkrs(cargo: string = 'Aquisição de Canal') {
  const [okrs, setOkrs] = useState<OkrCard[]>(() => load(cargo));

  // Se o cargo mudar (ex: impersonação), recarrega do storage certo.
  useEffect(() => { setOkrs(load(cargo)); }, [cargo]);

  useEffect(() => {
    try { localStorage.setItem(storageKey(cargo), JSON.stringify(okrs)); } catch { /* ignore */ }
  }, [okrs, cargo]);

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
