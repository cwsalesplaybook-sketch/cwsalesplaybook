/** Meta do Mês de Aquisição de Canal — tracker pessoal salvo no navegador
 *  (localStorage), sem integração com Pipedrive. Mesma mecânica de cálculo
 *  do MetaMes.tsx do SDR (dias úteis, ritmo, projeção), mas com DOIS
 *  indicadores independentes em vez de um: Agendamentos (reuniões marcadas)
 *  e Representantes Cadastrados. A meta de cadastro é do SQUAD (dividida
 *  entre as pessoas que recrutam representantes, ex: você + Hyorranes). */
import { useCallback, useEffect, useState } from 'react';

export interface RepsMetasState {
  agendamentoMeta: number;
  agendamentos: number;
  /** Meta TOTAL do squad de aquisição (ex: 46), dividida por `squadPessoas`. */
  cadastroMetaTotal: number;
  squadPessoas: number;
  cadastros: number;
  /** null = cálculo automático (dias úteis restantes no mês). */
  diasUteis: number | null;
}

const STORAGE_KEY = 'cw-reps-metas';

const EMPTY: RepsMetasState = {
  agendamentoMeta: 0,
  agendamentos: 0,
  cadastroMetaTotal: 46,
  squadPessoas: 2,
  cadastros: 0,
  diasUteis: null,
};

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

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

  const ajustar = useCallback((campo: 'agendamentos' | 'cadastros', delta: number) => {
    setState((s) => ({ ...s, [campo]: Math.max(0, s[campo] + delta) }));
  }, []);

  const definirTotal = useCallback((campo: 'agendamentos' | 'cadastros', valor: number) => {
    setState((s) => ({ ...s, [campo]: Math.max(0, Number.isFinite(valor) ? valor : 0) }));
  }, []);

  const now = new Date();
  const { diasUteisTotal, diasPassados, diasRestantes: diasRestantesCalc } = calcularDiasUteis();
  const diasRestantes = state.diasUteis ?? diasRestantesCalc;

  const cadastroMetaIndividual = state.squadPessoas > 0
    ? Math.round((state.cadastroMetaTotal / state.squadPessoas) * 10) / 10
    : state.cadastroMetaTotal;

  const agendamento = calcMetric(state.agendamentoMeta, state.agendamentos, diasPassados, diasUteisTotal, diasRestantes);
  const cadastro = calcMetric(cadastroMetaIndividual, state.cadastros, diasPassados, diasUteisTotal, diasRestantes);

  return {
    state,
    update,
    ajustar,
    definirTotal,
    mesLabel: MESES[now.getMonth()],
    diasUteisTotal,
    diasPassados,
    diasRestantes,
    cadastroMetaIndividual,
    agendamento,
    cadastro,
  };
}
