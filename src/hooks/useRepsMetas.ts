/** Metas do Representante — tracker pessoal salvo no navegador (localStorage).
 *  Mesma mecânica do useCloserMetas, com storage próprio. */
import { useCallback, useEffect, useState } from 'react';
import { diasUteisRestantes } from '@/hooks/useCloserMetas';
import type { MetaModulo, MetasState, MetaCalculo, MetasComputed } from '@/hooks/useCloserMetas';

export type { MetaModulo, MetasState, MetaCalculo, MetasComputed };

const STORAGE_KEY = 'cw-reps-metas';

const EMPTY: MetasState = {
  meta1: 0,
  meta2: 0,
  meta3: 0,
  jaFechado: 0,
  diasUteis: null,
  modulos: [],
};

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function load(): MetasState {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<MetasState>;
    return {
      ...EMPTY,
      ...parsed,
      modulos: Array.isArray(parsed.modulos) ? parsed.modulos : [],
    };
  } catch {
    return EMPTY;
  }
}

function calcMeta(alvo: number, jaFechado: number, dias: number): MetaCalculo {
  const falta = Math.max(0, alvo - jaFechado);
  const progresso = alvo > 0 ? Math.min(100, (jaFechado / alvo) * 100) : 0;
  const porDia = falta > 0 && dias > 0 ? falta / dias : 0;
  return { valor: alvo, progresso, falta, porDia, batida: alvo > 0 && jaFechado >= alvo };
}

export function useRepsMetas() {
  const [state, setState] = useState<MetasState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / private mode */
    }
  }, [state]);

  const update = useCallback((patch: Partial<MetasState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const setJaFechado = useCallback((valor: number) => {
    setState((s) => ({ ...s, jaFechado: Number.isFinite(valor) ? valor : 0 }));
  }, []);

  const addModulo = useCallback((m: Omit<MetaModulo, 'id'>) => {
    setState((s) => ({
      ...s,
      modulos: [...s.modulos, { ...m, id: crypto.randomUUID() }],
    }));
  }, []);

  const updateModulo = useCallback((id: string, patch: Partial<MetaModulo>) => {
    setState((s) => ({
      ...s,
      modulos: s.modulos.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  }, []);

  const removeModulo = useCallback((id: string) => {
    setState((s) => ({ ...s, modulos: s.modulos.filter((m) => m.id !== id) }));
  }, []);

  const now = new Date();
  const dias = state.diasUteis ?? diasUteisRestantes(now);
  const metas = [state.meta1, state.meta2, state.meta3].map((alvo) =>
    calcMeta(alvo, state.jaFechado, dias),
  );
  const maiorMeta = Math.max(state.meta1, state.meta2, state.meta3);
  const diasTotais = diasUteisRestantes(new Date(now.getFullYear(), now.getMonth(), 1));
  const diasDecorridos = Math.max(1, diasTotais - dias);
  const ritmo = state.jaFechado / diasDecorridos;
  const projecao = state.jaFechado + ritmo * dias;
  const performance = maiorMeta > 0 ? (state.jaFechado / maiorMeta) * 100 : 0;

  const computed: MetasComputed = {
    ...state,
    diasUteis: state.diasUteis,
    mesLabel: MESES[now.getMonth()],
    diasRestantes: dias,
    metas,
    projecao,
    performance,
  };

  return {
    state,
    computed,
    update,
    setJaFechado,
    addModulo,
    updateModulo,
    removeModulo,
  };
}
