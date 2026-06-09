export type ChangelogType = 'feature' | 'fix' | 'update' | 'breaking';

export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  postedBy: string;
  type: ChangelogType;
}

export const CHANGELOG_PADRAO: ChangelogEntry[] = [
  // ── 08/06/2026 ──────────────────────────────────────────────────────────────
  {
    id: 'cw-080626-a',
    version: '—',
    date: '08/06/2026',
    title: 'Filtro por status no mapa de entregas',
    description: 'O header do mapa na logística de entrega agora funciona como filtro interativo. Cada status — em preparação, pronto, em rota e entregue — pode ser marcado ou desmarcado para controlar quais pedidos aparecem no mapa. Ajuda a focar no que importa, como ver só os pedidos prontos sem poluição visual dos já entregues.',
    postedBy: 'Cardápio Web',
    type: 'feature',
  },
  {
    id: 'cw-080626-b',
    version: '—',
    date: '08/06/2026',
    title: 'Agrupamento por responsável pela entrega na Análise de Vendas',
    description: 'Na tela de Análise de Vendas, agora é possível agrupar e filtrar pedidos pelo Responsável pela entrega. Exibe faturamento, quantidade de pedidos e ticket médio por: Entrega própria, iFood, iFood Entrega, Foody Delivery, Bee Delivery, Mottu, 99Food, Aiqfome e Keeta.',
    postedBy: 'Cardápio Web',
    type: 'feature',
  },
  {
    id: 'cw-080626-c',
    version: '—',
    date: '08/06/2026',
    title: 'Nova etiqueta "Oferta" e badge de desconto percentual',
    description: 'Agora é possível marcar produtos e complementos com a etiqueta Oferta no cadastro do cardápio — aparece no cardápio digital e no totem. Além disso, produtos com preço promocional ativo passam a exibir um badge "-X%" calculado automaticamente.',
    postedBy: 'Cardápio Web',
    type: 'feature',
  },
  {
    id: 'cw-080626-d',
    version: '—',
    date: '08/06/2026',
    title: 'Transferência parcial de itens entre mesas e comandas',
    description: 'Agora é possível transferir apenas parte da quantidade de um item ao mover produtos entre mesas ou comandas abertas. Ao usar Transferir em itens com quantidade maior que 1 (ou vendidos por peso/volume), o sistema exibe a opção de editar a quantidade. A divisão é proporcional entre origem e destino.',
    postedBy: 'Cardápio Web',
    type: 'feature',
  },
  {
    id: 'cw-080626-e',
    version: '—',
    date: '08/06/2026',
    title: 'Permissões separadas para taxas e descontos em Mesas/Comandas',
    description: 'A permissão "Alterar taxas e descontos" foi dividida em duas independentes: Alterar taxas e Alterar descontos. Agora é possível conceder acesso só a taxas, só a descontos ou aos dois, conforme a função do colaborador. Usuários com a permissão antiga receberam as duas novas automaticamente.',
    postedBy: 'Cardápio Web',
    type: 'update',
  },
  {
    id: 'cw-080626-f',
    version: '—',
    date: '08/06/2026',
    title: 'Ordenamento inteligente no KDS — Modo Despacho',
    description: 'No modo despacho, pedidos com todos os itens prontos aparecem primeiro. Entre os 100% prontos, prioriza quem ficou pronto há mais tempo. Pedidos em andamento ficam depois, ordenados pelos mais próximos de ficar prontos. Cada "leva" de mesa é tratada separadamente.',
    postedBy: 'Cardápio Web',
    type: 'update',
  },
  {
    id: 'cw-080626-g',
    version: '—',
    date: '08/06/2026',
    title: 'Novos parceiros: Natural Bot e Gototem',
    description: 'Cardápio Web exibe agora na tela de Integrações as parcerias com Natural Bot (copiloto de IA para atendimento via WhatsApp) e Gototem (soluções de autoatendimento com totens e cardápio digital). As integrações foram desenvolvidas pelos próprios parceiros.',
    postedBy: 'Cardápio Web',
    type: 'feature',
  },
  {
    id: 'cw-080626-h',
    version: '—',
    date: '08/06/2026',
    title: 'Aviso de estorno manual no cancelamento via totem (cartão)',
    description: 'Ao cancelar um pedido pago via cartão pelo totem, o modal de cancelamento exibe um aviso informando que o estorno não é automático e deve ser feito manualmente na maquininha ou portal do banco. O operador precisa confirmar ciência marcando um checkbox antes de prosseguir.',
    postedBy: 'Cardápio Web',
    type: 'breaking',
  },
  // ── 05/06/2026 ──────────────────────────────────────────────────────────────
  {
    id: 'cw-050626-a',
    version: '—',
    date: '05/06/2026',
    title: 'Integração com balança Toledo Prix 3 Fit',
    description: 'Lançada integração com balanças para pesagem direta de produtos no sistema. A balança deve ser configurada com protocolo PRT1, velocidade 2400 baud (C14/C15/C16). A conexão é feita via cabo USB serial compatible (chipset PL2303, FTDI ou CH340). Ativação em Configurações › Integrações › Balança.',
    postedBy: 'Cardápio Web',
    type: 'feature',
  },
  // ── 22/05/2026 ──────────────────────────────────────────────────────────────
  {
    id: 'cw-220526-a',
    version: '—',
    date: '22/05/2026',
    title: 'Módulo Totem de Autoatendimento — lançamento',
    description: 'Novo módulo que permite cadastrar e gerenciar múltiplos totens no mesmo estabelecimento. Cada totem tem configuração própria de dispositivo, terminal de pagamento (Smart TEF) e formas de pagamento (Dinheiro, Pix automático, Crédito, Débito). Suporte a mídias de chamariz e banners. Funciona em qualquer touchscreen com navegador. Custo: R$ 99,99/dispositivo.',
    postedBy: 'Cardápio Web',
    type: 'feature',
  },
  // ── Playbook interno ─────────────────────────────────────────────────────────
  {
    id: 'cl1',
    version: '1.3',
    date: '08/06/2026',
    title: 'Widget de busca rápida no Playbook',
    description: 'Botão ⚡ fixo no canto inferior direito em todas as páginas. Digite uma palavra-chave para navegar direto para a aba correta do Playbook ou FAQ.',
    postedBy: 'CW Sales Playbook',
    type: 'feature',
  },
  {
    id: 'cl2',
    version: '1.2',
    date: '05/06/2026',
    title: 'FAQ e Mural de Avisos',
    description: 'FAQ como página própria com 19 perguntas em 3 categorias (Totem, Planos, Produto). Mural de Avisos com sino de notificações e leitura individual.',
    postedBy: 'CW Sales Playbook',
    type: 'feature',
  },
  {
    id: 'cl3',
    version: '1.1',
    date: '30/05/2026',
    title: 'Ranking dinâmico via Pipedrive',
    description: 'Top Guerreiros agora busca dados reais do Pipedrive em tempo real. Exibe top 5 com negócios ganhos no mês e destaca o SDR logado.',
    postedBy: 'CW Sales Playbook',
    type: 'update',
  },
];
