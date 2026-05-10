/** Tipos globais do CW Sales Playbook. */

export type Categoria = 'performance' | 'desenvolvimento' | 'cultura' | 'gestao';

export interface Ritual {
  id: string;
  nome: string;
  categoria: Categoria;
  frequencia: string;
  horario?: string;
  duracao: string;
  participantes: 'SDR' | 'Closer' | 'Ambos';
  squad?: 'A' | 'B' | 'Ambos';
  responsavel: string;
  objetivo: string;
  comoFunciona: string;
  regrasDeOuro: string[];
  oQueEsperado: string;
  paraNovatos: string;
  metricaDeSucesso: string;
  diasDaSemana?: number[];
  horarioInicio?: number;
  horarioFim?: number;
  cor: string;
}

export type OnboardingTipo = 'leitura' | 'video' | 'pratica' | 'roleplay' | 'link' | 'tarefa';

export interface OnboardingItem {
  id: string;
  dia: string;
  macrotopico: string;
  descricao?: string;
  atividade: string;
  acao?: string;
  tipo?: OnboardingTipo;
  link?: string;
}

export interface FaixaComissao {
  /** Percentual sobre a meta (ex.: 0.2 = 20%) */
  percentual: number;
  /** Valor R$ da comissão na meta */
  valor: number;
  /** OTE (On-Target Earnings) = base + comissão */
  ote: number;
}

export interface FaixaCarreira {
  nome: string;
  criterioElegibilidade: string;
  criterioDesclassificacao?: string;
  /** Percentual / valor / OTE para Meta 1, 2 e 3 */
  meta1?: FaixaComissao;
  meta2?: FaixaComissao;
  meta3?: FaixaComissao;
}

export interface NivelCarreira {
  id: string;
  nome: string;
  /** Salário base mensal R$ */
  baseSalarial?: number;
  faixas: FaixaCarreira[];
}

export interface BerserkerEntry {
  posicao: number;
  nome: string;
  squad: string;
  pontos: number;
  variacao: number;
}

export interface Badge {
  id: string;
  nome: string;
  emoji: string;
  descricao: string;
  /** Função que recebe o estado de checks do onboarding e devolve true se desbloqueado */
  regra: (checked: Record<string, boolean>) => boolean;
}

export interface Pessoa {
  id: string;
  nome: string;
  cargo: string;
  squad?: string;
  slack?: string;
  bio?: string;
  foto?: string;
}

export interface GlossarioTermo {
  termo: string;
  definicao: string;
  categoria?: string;
}

export interface MarcoTimeline {
  ano: string;
  titulo: string;
  descricao: string;
}
