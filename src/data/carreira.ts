/** Trilha de carreira, mapa de tiers e tabela salarial.
 *  Dados extraídos do "Playbook de Vendas" — aba "Progressão de carreira". */
import type { NivelCarreira } from '@/types';

/** Helper para criar faixas com mesmos critérios padrão. */
const baseElegibilidade = 'Válido a partir do mês de rampando pra novatos, ter atingido 3 metas 3 no período de 4 meses, e no mês que não for atingido meta 3, espera-se pelo menos meta 1.';

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
    ],
  },
];

export const NIVEL_ORDER = ['jr1', 'jr2', 'jr3', 'pl1', 'pl2', 'pl3', 'sr1', 'sr2', 'sr3'];

/** Helper de formatação BRL. */
export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });
