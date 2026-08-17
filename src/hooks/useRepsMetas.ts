/** Meta do Mês de Aquisição de Canal — tracker pessoal salvo no navegador
 *  (localStorage), sem integração com Pipedrive. Mesma mecânica de cálculo
 *  do MetaMes.tsx do SDR (dias úteis, ritmo, projeção), com um único
 *  indicador (Representantes Cadastrados) em 3 tiers — Meta 1/2/3 ⭐,
 *  igual ao padrão de metas do SDR/Closer — e SEM divisão por squad: a meta
 *  é individual (2026-08-17, Gabi passou a acompanhar só a própria meta). */
import { useCallback, useEffect, useState } from 'react';

export interface RepsMetasState {
  /** Três tiers da mesma meta (Representantes Cadastrados), como no SDR: Meta 3 é a referência "oficial" (⭐), Meta 1/2 são checkpoints no caminho. */
  meta1: number;
  meta2: number;
  meta3: number;
  cadastros: number;
  /** null = cálculo automático (dias úteis restantes no mês). */
  diasUteis: number | null;
}

const STORAGE_KEY = 'cw-reps-metas';

const EMPTY: RepsMetasState = {
  meta1: 18,
  meta2: 20,
  meta3: 22,
  cadastros: 0,
  diasUteis: null,
};

/** Dias úteis (seg-sex) do mês corrente, já passados/restantes — mesma
 *  conta usada pelo Meta do Mês do SDR (src/components/meta/MetaMes.tsx). */
function calcularDiasUteis() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mesNum = hoje.getMonth();
  const primeiroDia = new Date(ano, mesNum, 1);
  const ultimoDia = new Date(ano, mesNum + 1, 0);
  let diasUteisTotal = 0, diasPassados = 0, diasRestantes = 0;
  for (let d = new Date(primeiroDia); d <= ultimoDia; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;
    diasUteisTotal++;
    if (d < hoje) diasPassados++;
    else diasRestantes++;
  }
  return { diasUteisTotal, diasPassados, diasRestantes };
}

export interface MetricCalc {
  meta: number;
  atual: number;
  progresso: number;   // 0–100 (%)
  falta: number;
  porDia: number;
  batida: boolean;
  projecao: number;
  noRitmo: boolean;
  ritmoHojeValor: number;
  ritmoHojePct: number;
  noRitmoHoje: boolean;
}

function calcMetric(meta: number, atual: number, diasPassados: number, diasUteisTotal: number, diasRestantes: number): MetricCalc {
  const falta = Math.max(0, meta - atual);
  const progresso = meta > 0 ? Math.min(100, (atual / meta) * 100) : 0;
  const porDia = diasRestantes > 0 ? Math.ceil(falta / diasRestantes) : 0;
  const batida = meta > 0 && atual >= meta;
  const projecao = diasPassados > 0 ? Math.round((atual / diasPassados) * diasUteisTotal) : 0;
  const ritmoNecessario = diasUteisTotal > 0 ? meta / diasUteisTotal : 0;
  const noRitmo = !meta || !diasPassados ? true : (atual / diasPassados) >= ritmoNecessario * 0.9;
  const ritmoHojeValor = meta > 0 && diasPassados > 0 ? (diasPassados / diasUteisTotal) * meta : 0;
  const ritmoHojePct = meta > 0 ? Math.min((ritmoHojeValor / meta) * 100, 99) : 0;
  const noRitmoHoje = atual >= ritmoHojeValor;
  return { meta, atual, progresso, falta, porDia, batida, projecao, noRitmo, ritmoHojeValor, ritmoHojePct, noRitmoHoje };
}

function load(): RepsMetasState {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<RepsMetasState>;
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

export function useRepsMetas() {
  const [state, setState] = useState<RepsMetasState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / private mode */
    }
  }, [state]);

  const update = useCallback((patch: Partial<RepsMetasState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const ajustarCadastros = useCallback((delta: number) => {
    setState((s) => ({ ...s, cadastros: Math.max(0, s.cadastros + delta) }));
  }, []);

  const definirCadastros = useCallback((valor: number) => {
    setState((s) => ({ ...s, cadastros: Math.max(0, Number.isFinite(valor) ? valor : 0) }));
  }, []);

  const { diasUteisTotal, diasPassados, diasRestantes: diasRestantesCalc } = calcularDiasUteis();
  const diasRestantes = state.diasUteis ?? diasRestantesCalc;

  // Meta de referência pro progresso geral: a mais alta definida (Meta 3 > Meta 2 > Meta 1),
  // igual ao SDR — Meta 3 é o alvo "oficial" (⭐), 1/2 são checkpoints no caminho.
  const metaReferencia = state.meta3 || state.meta2 || state.meta1;
  const cadastro = calcMetric(metaReferencia, state.cadastros, diasPassados, diasUteisTotal, diasRestantes);

  return {
    state,
    update,
    ajustarCadastros,
    definirCadastros,
    diasRestantes,
    diasUteisTotal,
    metaReferencia,
    cadastro,
  };
}
