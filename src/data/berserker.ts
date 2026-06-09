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
  /** Frase de destaque exibida no lugar da data */
  destaque: string;
  metrica: string;
  frase: string;
  foto?: string;
}

export const HALL_OF_FAME: HallEntry[] = [
  {
    nome: 'Lara Stefanny',
    squad: 'Squad Águia',
    destaque: 'A guerreira que não parou até fechar.',
    metrica: 'Berserker do Mês',
    frase: 'Pressão é combustível. Eu acelero quando os outros freiam.',
    foto: '/team/lara-stefanny.jpg',
  },
  {
    nome: 'Luis Lincon',
    squad: 'Squad Lobo',
    destaque: 'Virada épica nos últimos 3 dias.',
    metrica: 'Berserker do Mês',
    frase: 'Todo mês eu lembro que desistir nunca foi uma opção.',
    foto: '/team/luis-lincon.jpg',
  },
  {
    nome: 'Marcos Telles',
    squad: 'Squad Águia',
    destaque: 'Consistência que virou conquista.',
    metrica: 'Berserker do Mês',
    frase: 'Não é sorte, é preparo encontrando a oportunidade.',
    foto: '/team/marcos-telles.jpg',
  },
  {
    nome: 'Karoline Rodrigues',
    squad: 'Squad Lobo',
    destaque: 'Dominando o jogo com estratégia e garra.',
    metrica: 'Berserker do Mês',
    frase: 'Quem domina o processo, domina o resultado.',
    foto: '/team/karoline-rodrigues.jpg',
  },
];
