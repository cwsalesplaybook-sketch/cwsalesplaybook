/** Tabela de preços dos planos e módulos CW. */

export type Plano   = 'Mesas' | 'Delivery' | 'Premium';
export type Periodo = 'Anual' | 'Semestral' | 'Trimestral' | 'Mensal';
export type ModuloKey = 'iFood' | 'Estoque Avançado' | 'Cupom Fiscal' | 'Roteirização de Entregas' | 'Financeiro';

export interface Preco { mensal: number; total: number; }

export const PLANOS_PRECO: Record<Plano, Record<Periodo, Preco>> = {
  Mesas: {
    Anual:      { mensal: 139.99, total: 1679.88 },
    Semestral:  { mensal: 149.99, total: 899.94  },
    Trimestral: { mensal: 159.99, total: 479.97  },
    Mensal:     { mensal: 169.99, total: 169.99  },
  },
  Delivery: {
    Anual:      { mensal: 179.99, total: 2159.88 },
    Semestral:  { mensal: 189.99, total: 1139.94 },
    Trimestral: { mensal: 199.99, total: 599.97  },
    Mensal:     { mensal: 209.99, total: 209.99  },
  },
  Premium: {
    Anual:      { mensal: 239.99, total: 2879.88 },
    Semestral:  { mensal: 249.99, total: 1499.94 },
    Trimestral: { mensal: 259.99, total: 779.97  },
    Mensal:     { mensal: 269.99, total: 269.99  },
  },
};

export const MODULOS_PRECO: Record<ModuloKey, Record<Periodo, Preco>> = {
  'iFood': {
    Anual:      { mensal: 29.99, total: 359.88 },
    Semestral:  { mensal: 29.99, total: 179.94 },
    Trimestral: { mensal: 29.99, total: 89.97  },
    Mensal:     { mensal: 29.99, total: 29.99  },
  },
  'Estoque Avançado': {
    Anual:      { mensal: 29.99, total: 359.88 },
    Semestral:  { mensal: 29.99, total: 179.94 },
    Trimestral: { mensal: 29.99, total: 89.97  },
    Mensal:     { mensal: 29.99, total: 29.99  },
  },
  'Cupom Fiscal': {
    Anual:      { mensal: 69.99, total: 839.88 },
    Semestral:  { mensal: 69.99, total: 419.94 },
    Trimestral: { mensal: 69.99, total: 209.97 },
    Mensal:     { mensal: 69.99, total: 69.99  },
  },
  'Roteirização de Entregas': {
    Anual:      { mensal: 54.99, total: 659.88 },
    Semestral:  { mensal: 54.99, total: 329.94 },
    Trimestral: { mensal: 54.99, total: 164.97 },
    Mensal:     { mensal: 54.99, total: 54.99  },
  },
  'Financeiro': {
    Anual:      { mensal: 69.99, total: 839.88 },
    Semestral:  { mensal: 69.99, total: 419.94 },
    Trimestral: { mensal: 69.99, total: 209.97 },
    Mensal:     { mensal: 69.99, total: 69.99  },
  },
};

export const MODULO_TOTEM_POR_DISPOSITIVO = 99.90;

export const PERIODO_MESES: Record<Periodo, number> = {
  Anual: 12,
  Semestral: 6,
  Trimestral: 3,
  Mensal: 1,
};

export const PLANOS: Plano[]   = ['Mesas', 'Delivery', 'Premium'];
export const PERIODOS: Periodo[] = ['Anual', 'Semestral', 'Trimestral', 'Mensal'];
export const MODULOS: ModuloKey[] = [
  'iFood',
  'Estoque Avançado',
  'Cupom Fiscal',
  'Roteirização de Entregas',
  'Financeiro',
];
