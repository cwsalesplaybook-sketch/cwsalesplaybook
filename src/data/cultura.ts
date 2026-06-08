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
