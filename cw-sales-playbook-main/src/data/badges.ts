/** Badges desbloqueáveis ao longo do onboarding. */
import type { Badge } from '@/types';
import { ONBOARDING } from './onboarding';

const allOfDay = (dia: string) => (checked: Record<string, boolean>) =>
  ONBOARDING.filter((i) => i.dia === dia).every((i) => checked[i.id]);

const countOf = (predicate: (id: string) => boolean, min: number) =>
  (checked: Record<string, boolean>) =>
    ONBOARDING.filter((i) => predicate(i.id) && checked[i.id]).length >= min;

export const BADGES: Badge[] = [
  {
    id: 'primeiro-dia',
    nome: 'Primeiro Dia',
    emoji: '🌱',
    descricao: 'Concluiu todos os itens do Dia 1 — você está dentro!',
    regra: allOfDay('Dia 1'),
  },
  {
    id: 'estudioso',
    nome: 'Estudioso',
    emoji: '📚',
    descricao: 'Leu todos os artigos de SPIN, BANT, ICP e Rapport.',
    regra: countOf((id) => id.startsWith('d5-') && Number(id.split('-')[1]) <= 4, 4),
  },
  {
    id: 'roleplayer',
    nome: 'Roleplayer',
    emoji: '🎭',
    descricao: 'Concluiu 5 roleplays do programa.',
    regra: (checked) =>
      ONBOARDING.filter((i) => i.tipo === 'roleplay' && checked[i.id]).length >= 5,
  },
  {
    id: 'mestre-sandbox',
    nome: 'Mestre do Sandbox',
    emoji: '⚙️',
    descricao: 'Concluiu todos os itens práticos do Dia 8.',
    regra: allOfDay('Dia 8'),
  },
  {
    id: 'pronto-pra-voar',
    nome: 'Pronto para Voar',
    emoji: '🚀',
    descricao: 'Avaliação final concluída — operação liberada.',
    regra: allOfDay('Dia 11'),
  },
  {
    id: 'cardapinho-completo',
    nome: 'Cardapinho Completo',
    emoji: '🏆',
    descricao: '100% do onboarding concluído. Bem-vindo(a) ao time, oficialmente.',
    regra: (checked) => ONBOARDING.every((i) => checked[i.id]),
  },
];
