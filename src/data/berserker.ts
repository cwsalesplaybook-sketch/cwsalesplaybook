/** Dados do Berserker: leaderboard e Hall of Fame. */
import type { BerserkerEntry } from '@/types';

export const LEADERBOARD: BerserkerEntry[] = [
  { posicao: 1, nome: 'Marcos Vinicius', squad: 'Squad Águia', pontos: 47, variacao: 12 },
  { posicao: 2, nome: 'João Paulo', squad: 'Squad Lobo', pontos: 43, variacao: 8 },
  { posicao: 3, nome: 'Lara Stefanny', squad: 'Squad Águia', pontos: 38, variacao: -3 },
  { posicao: 4, nome: 'Miguel Nunes', squad: 'Squad Lobo', pontos: 35, variacao: 5 },
  { posicao: 5, nome: 'Gabrielly Oliveira', squad: 'Squad Águia', pontos: 31, variacao: 0 },
];

export interface HallEntry {
  nome: string;
  squad: string;
  mes: string;
  metrica: string;
  frase: string;
}

export const HALL_OF_FAME: HallEntry[] = [
  { nome: 'Ryan Felipe', squad: 'Squad Águia', mes: 'Mar/2025', metrica: 'Agendamentos', frase: 'De 0 a herói nos últimos 3 dias.' },
  { nome: 'Thais Giurizatto', squad: 'Squad Lobo', mes: 'Fev/2025', metrica: 'Taxa de conversão', frase: 'Consistência virou título.' },
  { nome: 'Marcos Vinicius', squad: 'Squad Águia', mes: 'Jan/2025', metrica: 'Clientes fechados', frase: 'O Berserker original.' },
];
