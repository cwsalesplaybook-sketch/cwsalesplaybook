/** Cards culturais da seção Cultura. */

export interface CulturaCard {
  id: string;
  titulo: string;
  emoji: string;
  cor: 'orange' | 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  descricao: string;
  destaque?: string;
  badge?: string;
  fullWidth?: boolean;
  acaoLabel?: string;
  acaoTipo?: 'gritar' | 'navegar';
  acaoDestino?: string;
}

export const CULTURA_CARDS: CulturaCard[] = [
  {
    id: 'grito',
    titulo: 'Grito de Guerra',
    emoji: '🔥',
    cor: 'orange',
    fullWidth: true,
    descricao: 'Quando uma meta é batida, a buzina toca e o time inteiro grita. Isso não é frescura — é como a vitória vira memória coletiva. É como o time aprende que o esforço vale a pena.',
    destaque: 'Toca a buzina. Meta batida. É A CW QUE DOMINAAAAA! 🔥',
    acaoLabel: 'Gritar',
    acaoTipo: 'gritar',
  },
  {
    id: 'roleplay',
    titulo: 'Roleplay',
    emoji: '🎭',
    cor: 'blue',
    descricao: 'Treino faz o vendedor. O roleplay é o nosso campo de prática: aqui errar é seguro, e errar bonito é melhor que acertar com sorte.',
    destaque: 'Treine com o ChatGPT ou Claude antes para ganhar confiança.',
    badge: 'Semanal — Segunda, Quarta, Quinta, Sexta',
  },
  {
    id: 'cumbuca',
    titulo: 'Cumbuca',
    emoji: '📚',
    cor: 'green',
    descricao: 'Roda de leitura semanal. Lemos juntos, aplicamos juntos, evoluímos juntos. A teoria só vira venda quando vira prática.',
    destaque: 'A falta de leitura cancela a sessão da semana. Sem exceções.',
    badge: 'Semanal — Terças',
  },
  {
    id: 'roda',
    titulo: 'Roda de Conversa',
    emoji: '💬',
    cor: 'purple',
    descricao: 'Espaço seguro de troca. Pauta livre conforme o momento do time. O que se diz no círculo fica no círculo.',
    badge: 'Mensal',
  },
  {
    id: 'berserker',
    titulo: 'Berserker',
    emoji: '⚔️',
    cor: 'red',
    descricao: 'Inspirado nos guerreiros vikings que entravam em transe nos últimos momentos da batalha. Nos últimos 3 dias do mês, todo o ranking pode virar.',
    acaoLabel: 'Ver Berserker →',
    acaoTipo: 'navegar',
    acaoDestino: '/berserker',
  },
  {
    id: 'feedback',
    titulo: 'Feedbacks',
    emoji: '🔄',
    cor: 'yellow',
    descricao: 'Bidirecional. Construtivo. Sempre com solução. O feedback é o combustível da evolução do time — e ele anda nas duas direções.',
    destaque: 'Nunca só crítica — sempre um caminho.',
  },
  {
    id: 'metas',
    titulo: 'Bater Metas',
    emoji: '🎯',
    cor: 'orange',
    descricao: '3 níveis de meta: mínima, esperada e excelência. O sucesso de um é orgulho de todos. Comprometimento com a meta da empresa é parte da identidade do CW.',
    destaque: 'Quando um bate, todos celebram. Quando um cai, todos levantam.',
  },
];
