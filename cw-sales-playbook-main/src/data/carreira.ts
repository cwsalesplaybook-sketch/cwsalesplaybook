/** Trilha de carreira, mapa de tiers e tabela salarial.
 *  Dados extraídos do "Playbook de Vendas" — aba "Progressão de carreira". */
import type { NivelCarreira } from '@/types';

/** Helper para criar faixas com mesmos critérios padrão. */
const baseElegibilidade = '- Ramp-up concluído (em caso de novato entrando e rampando)\n- Meta 3 nos últimos 2 meses';
const estrelaElegibilidade = 'Bater Meta 3 (1 mês — no mês vigente)';
const estrelaDesclassificacao = 'Não bater Meta 3 na faixa Estrela → desce para o nível anterior.';

export const NIVEIS: NivelCarreira[] = [
  {
    id: 'jr1', nome: 'JR 1', baseSalarial: 1809.51,
    faixas: [
      {
        nome: 'Faixa 1 — Base', criterioElegibilidade: baseElegibilidade,
        meta1: { percentual: 0.20, valor: 361.90, ote: 2171.41 },
        meta2: { percentual: 0.25, valor: 452.38, ote: 2261.89 },
        meta3: { percentual: 0.30, valor: 542.85, ote: 2352.36 },
      },
      {
        nome: 'Faixa 2 — Estrela ⭐', criterioElegibilidade: estrelaElegibilidade, criterioDesclassificacao: estrelaDesclassificacao,
        meta1: { percentual: 0.30, valor: 542.85, ote: 2352.36 },
        meta2: { percentual: 0.35, valor: 633.33, ote: 2442.84 },
        meta3: { percentual: 0.40, valor: 723.80, ote: 2533.31 },
      },
    ],
  },
  {
    id: 'jr2', nome: 'JR 2', baseSalarial: 1988.48,
    faixas: [
      {
        nome: 'Faixa 1 — Base', criterioElegibilidade: baseElegibilidade,
        meta1: { percentual: 0.20, valor: 397.70, ote: 2386.18 },
        meta2: { percentual: 0.25, valor: 497.12, ote: 2485.60 },
        meta3: { percentual: 0.30, valor: 596.54, ote: 2585.02 },
      },
      {
        nome: 'Faixa 2 — Estrela ⭐', criterioElegibilidade: estrelaElegibilidade, criterioDesclassificacao: estrelaDesclassificacao,
        meta1: { percentual: 0.30, valor: 596.54, ote: 2585.02 },
        meta2: { percentual: 0.35, valor: 695.97, ote: 2684.45 },
        meta3: { percentual: 0.40, valor: 795.39, ote: 2783.87 },
      },
    ],
  },
  {
    id: 'jr3', nome: 'JR 3', baseSalarial: 2185.14,
    faixas: [
      {
        nome: 'Faixa 1 — Base', criterioElegibilidade: baseElegibilidade,
        meta1: { percentual: 0.20, valor: 437.03, ote: 2622.17 },
        meta2: { percentual: 0.25, valor: 546.29, ote: 2731.43 },
        meta3: { percentual: 0.30, valor: 655.54, ote: 2840.68 },
      },
      {
        nome: 'Faixa 2 — Estrela ⭐', criterioElegibilidade: estrelaElegibilidade, criterioDesclassificacao: estrelaDesclassificacao,
        meta1: { percentual: 0.30, valor: 655.54, ote: 2840.68 },
        meta2: { percentual: 0.35, valor: 764.80, ote: 2949.94 },
        meta3: { percentual: 0.40, valor: 874.06, ote: 3059.20 },
      },
    ],
  },
  {
    id: 'pl1', nome: 'PL 1', baseSalarial: 2401.25,
    faixas: [
      {
        nome: 'Faixa 1 — Base', criterioElegibilidade: baseElegibilidade,
        meta1: { percentual: 0.25, valor: 600.31, ote: 3001.56 },
        meta2: { percentual: 0.30, valor: 720.38, ote: 3121.63 },
        meta3: { percentual: 0.45, valor: 1080.56, ote: 3481.81 },
      },
      {
        nome: 'Faixa 2 — Estrela ⭐', criterioElegibilidade: estrelaElegibilidade, criterioDesclassificacao: estrelaDesclassificacao,
        meta1: { percentual: 0.30, valor: 720.38, ote: 3121.63 },
        meta2: { percentual: 0.35, valor: 840.44, ote: 3241.69 },
        meta3: { percentual: 0.50, valor: 1200.63, ote: 3601.88 },
      },
    ],
  },
  {
    id: 'pl2', nome: 'PL 2', baseSalarial: 2617.36,
    faixas: [
      {
        nome: 'Faixa 1 — Base', criterioElegibilidade: baseElegibilidade,
        meta1: { percentual: 0.25, valor: 654.34, ote: 3271.70 },
        meta2: { percentual: 0.30, valor: 785.21, ote: 3402.57 },
        meta3: { percentual: 0.45, valor: 1177.81, ote: 3795.17 },
      },
      {
        nome: 'Faixa 2 — Estrela ⭐', criterioElegibilidade: estrelaElegibilidade, criterioDesclassificacao: estrelaDesclassificacao,
        meta1: { percentual: 0.30, valor: 785.21, ote: 3402.57 },
        meta2: { percentual: 0.35, valor: 916.08, ote: 3533.44 },
        meta3: { percentual: 0.50, valor: 1308.68, ote: 3926.04 },
      },
    ],
  },
  {
    id: 'pl3', nome: 'PL 3', baseSalarial: 2852.93,
    faixas: [
      {
        nome: 'Faixa 1 — Base', criterioElegibilidade: baseElegibilidade,
        meta1: { percentual: 0.25, valor: 713.23, ote: 3566.16 },
        meta2: { percentual: 0.30, valor: 855.88, ote: 3708.81 },
        meta3: { percentual: 0.45, valor: 1283.82, ote: 4136.75 },
      },
      {
        nome: 'Faixa 2 — Estrela ⭐', criterioElegibilidade: estrelaElegibilidade, criterioDesclassificacao: estrelaDesclassificacao,
        meta1: { percentual: 0.30, valor: 855.88, ote: 3708.81 },
        meta2: { percentual: 0.35, valor: 998.53, ote: 3851.46 },
        meta3: { percentual: 0.50, valor: 1426.47, ote: 4279.40 },
      },
    ],
  },
  {
    id: 'sr1', nome: 'SR 1', baseSalarial: 3109.69,
    faixas: [
      {
        nome: 'Faixa 1 — Base', criterioElegibilidade: baseElegibilidade,
        meta1: { percentual: 0.25, valor: 777.42, ote: 3887.11 },
        meta2: { percentual: 0.30, valor: 932.91, ote: 4042.60 },
        meta3: { percentual: 0.45, valor: 1399.36, ote: 4509.05 },
      },
      {
        nome: 'Faixa 2 — Estrela ⭐', criterioElegibilidade: estrelaElegibilidade, criterioDesclassificacao: estrelaDesclassificacao,
        meta1: { percentual: 0.30, valor: 932.91, ote: 4042.60 },
        meta2: { percentual: 0.35, valor: 1088.39, ote: 4198.08 },
        meta3: { percentual: 0.50, valor: 1554.85, ote: 4664.54 },
      },
    ],
  },
  {
    id: 'sr2', nome: 'SR 2', baseSalarial: 3389.56,
    faixas: [
      {
        nome: 'Faixa 1 — Base', criterioElegibilidade: baseElegibilidade,
        meta1: { percentual: 0.25, valor: 847.39, ote: 4236.95 },
        meta2: { percentual: 0.30, valor: 1016.87, ote: 4406.43 },
        meta3: { percentual: 0.45, valor: 1525.30, ote: 4914.86 },
      },
      {
        nome: 'Faixa 2 — Estrela ⭐', criterioElegibilidade: estrelaElegibilidade, criterioDesclassificacao: estrelaDesclassificacao,
        meta1: { percentual: 0.30, valor: 1016.87, ote: 4406.43 },
        meta2: { percentual: 0.35, valor: 1186.35, ote: 4575.91 },
        meta3: { percentual: 0.50, valor: 1694.78, ote: 5084.34 },
      },
    ],
  },
  {
    id: 'sr3', nome: 'SR 3', baseSalarial: 3694.62,
    faixas: [
      {
        nome: 'Faixa 1 — Base', criterioElegibilidade: baseElegibilidade,
        meta1: { percentual: 0.25, valor: 923.66, ote: 4618.28 },
        meta2: { percentual: 0.30, valor: 1108.39, ote: 4803.01 },
        meta3: { percentual: 0.45, valor: 1662.58, ote: 5357.20 },
      },
      {
        nome: 'Faixa 2 — Estrela ⭐', criterioElegibilidade: estrelaElegibilidade, criterioDesclassificacao: estrelaDesclassificacao,
        meta1: { percentual: 0.30, valor: 1108.39, ote: 4803.01 },
        meta2: { percentual: 0.35, valor: 1293.12, ote: 4987.74 },
        meta3: { percentual: 0.50, valor: 1847.31, ote: 5541.93 },
      },
    ],
  },
];

export interface TierInfo {
  id: string;
  nome: string;
  cor: string;
  perfilLead: string;
  sdrs: string[];
}

export const TIERS: TierInfo[] = [
  {
    id: 'parcerias',
    nome: 'TIER PARCERIAS',
    cor: 'from-purple-500/30 to-purple-700/10 border-purple-500/40',
    perfilLead: 'Contas estratégicas, redes e parcerias institucionais. Ciclos longos, ticket alto.',
    sdrs: ['João Paulo', 'Miguel Nunes', 'Thais Giurizatto'],
  },
  {
    id: 't1-2',
    nome: 'TIER 1 & 2',
    cor: 'from-cw-orange/30 to-cw-orange/5 border-cw-orange/40',
    perfilLead: 'Restaurantes premium e contas de maior porte. Operação madura, decisor presente.',
    sdrs: ['Marcos Vinicius', 'Lara Stefanny', 'Gabrielly Oliveira', 'Caique Silva', 'Luis Lincoln'],
  },
  {
    id: 't3',
    nome: 'TIER 3',
    cor: 'from-blue-500/30 to-blue-700/10 border-blue-500/40',
    perfilLead: 'Restaurantes de médio porte. Volume saudável, ciclo equilibrado.',
    sdrs: ['Ana Alice', 'Ryan Felipe', 'Tatyanna Freitas', 'Islene Santos', 'Matheus Cunha', 'Jonas Sobreira', 'Raissa Fonseca', 'Karol Santos', 'Kailane Carvalho', 'Raissa Cristina', 'José Guilherme'],
  },
  {
    id: 't4-5',
    nome: 'TIER 4 & 5',
    cor: 'from-green-500/30 to-green-700/10 border-green-500/40',
    perfilLead: 'Lojas pequenas e leads automatizados. Volume alto, ciclo curto.',
    sdrs: ['Clara IA'],
  },
];

export const NIVEL_ORDER = ['jr1', 'jr2', 'jr3', 'pl1', 'pl2', 'pl3', 'sr1', 'sr2', 'sr3'];

/** Helper de formatação BRL. */
export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });
