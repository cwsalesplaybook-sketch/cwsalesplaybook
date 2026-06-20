/** Dados do Playbook de Closer.
 *  Conteúdo extraído do guia de closers da Cardápio Web.
 *  Bloco 1: Planos & Preços, Franquias, Objeções.
 *  Bloco 2: Etapas da reunião, Critérios, Follow-up, Funis, SPIN, Progressão, Hora Ouro, Concorrentes.
 */

/* ------------------------------------------------------------------ */
/* PLANOS & PREÇOS                                                     */
/* ------------------------------------------------------------------ */

export interface PlanoValor {
  fidelidade: string;
  total: string;
  mensal: string;
}

export interface PlanoCloser {
  nome: string;
  popular?: boolean;
  funcionalidades: string[];
  valores: PlanoValor[];
}

export const CLOSER_PLANOS: PlanoCloser[] = [
  {
    nome: 'Plano Delivery',
    funcionalidades: [
      'Um Cardápio Web para delivery, balcão e visualização.',
      'Adição de pedidos manualmente pelo sistema.',
      'Sistema de caixa.',
      'Controle de estoque simplificado.',
      'Integração com Facebook Pixels.',
      'Gestão de clientes.',
      'Histórico de pedidos e relatórios.',
      'Sistema para atualização do cardápio.',
      'Definição de horários de funcionamento.',
      'Taxas de entrega variáveis por bairro ou por km.',
      'Gestão de cupons.',
      'Criação de avisos.',
      'Criação de usuários com permissões diferentes.',
      'Impressão automática de comandas.',
      'Gerenciamento de múltiplas impressoras.',
      'Controle de entregadores.',
      'Possibilidade de pedidos agendados.',
      'Módulo extra para avaliação de pedidos.',
      'Pagamento online.',
      'Sistema de fidelidade.',
      'Integração com Google Analytics e Google Tag Manager.',
      'Integração com domínio próprio.',
      'WhatsFácil: Extensão de navegador para WhatsApp.',
      'ChatBot de WhatsApp.',
    ],
    valores: [
      { fidelidade: 'Anual', total: 'R$ 2.159,88', mensal: 'R$ 179,99' },
      { fidelidade: 'Semestral', total: 'R$ 1.139,94', mensal: 'R$ 189,99' },
      { fidelidade: 'Trimestral', total: 'R$ 599,97', mensal: 'R$ 199,99' },
      { fidelidade: 'Mensal', total: 'R$ 209,99', mensal: 'R$ 209,99' },
    ],
  },
  {
    nome: 'Plano Mesas',
    funcionalidades: [
      'Um Cardápio Web para visualização e balcão.',
      'Um Cardápio Web para mesas com possibilidade de pedidos.',
      'Controle de mesas e garçons.',
      'Adição de pedidos manualmente pelo sistema.',
      'Sistema de caixa.',
      'Controle de estoque simplificado.',
      'Gestão de clientes.',
      'Histórico de pedidos e relatórios.',
      'Sistema para atualização do cardápio.',
      'Definição de horários de funcionamento.',
      'Taxas de entrega variáveis por bairro ou por km.',
      'Gestão de cupons.',
      'Criação de avisos.',
      'Criação de usuários com permissões diferentes.',
      'Gerenciamento de múltiplas impressoras.',
      'Impressão automática de comandas.',
      'Integração com Google Analytics e Google Tag Manager.',
      'Integração com domínio próprio.',
      'WhatsFácil: Extensão de navegador para WhatsApp.',
      'ChatBot de WhatsApp.',
    ],
    valores: [
      { fidelidade: 'Anual', total: 'R$ 1.679,88', mensal: 'R$ 139,99' },
      { fidelidade: 'Semestral', total: 'R$ 899,94', mensal: 'R$ 149,99' },
      { fidelidade: 'Trimestral', total: 'R$ 479,97', mensal: 'R$ 159,99' },
      { fidelidade: 'Mensal', total: 'R$ 169,99', mensal: 'R$ 169,99' },
    ],
  },
  {
    nome: 'Plano Premium',
    popular: true,
    funcionalidades: [
      'Um Cardápio Web para delivery, visualização e balcão.',
      'Um Cardápio Web para mesas com possibilidade de pedidos.',
      'Controle de mesas e garçons.',
      'Adição de pedidos manualmente pelo sistema (delivery + mesas).',
      'Sistema de caixa.',
      'Controle de estoque simplificado.',
      'Integração com Facebook Pixels.',
      'Gestão de clientes.',
      'Histórico de pedidos e relatórios.',
      'Sistema para atualização do cardápio.',
      'Definição de horários de funcionamento.',
      'Taxas de entrega variáveis por bairro ou por km.',
      'Gestão de cupons.',
      'Criação de avisos.',
      'Criação de usuários com permissões diferentes.',
      'Impressão automática de comandas.',
      'Gerenciamento de múltiplas impressoras.',
      'Controle de entregadores.',
      'Possibilidade de pedidos agendados.',
      'Módulo extra para avaliação de pedidos.',
      'Pagamento online.',
      'Integração com Google Analytics e Google Tag Manager.',
      'Integração com domínio próprio.',
      'WhatsFácil: Extensão de navegador para WhatsApp.',
      'ChatBot de WhatsApp.',
    ],
    valores: [
      { fidelidade: 'Anual', total: 'R$ 2.879,88', mensal: 'R$ 239,99' },
      { fidelidade: 'Semestral', total: 'R$ 1.499,94', mensal: 'R$ 249,99' },
      { fidelidade: 'Trimestral', total: 'R$ 779,97', mensal: 'R$ 259,99' },
      { fidelidade: 'Mensal', total: 'R$ 269,99', mensal: 'R$ 269,99' },
    ],
  },
];

export interface ModuloCloser {
  nome: string;
  valores: PlanoValor[];
  obs?: string;
}

export const CLOSER_MODULOS: ModuloCloser[] = [
  {
    nome: 'Módulo iFood',
    valores: [
      { fidelidade: 'Anual', total: 'R$ 359,88', mensal: 'R$ 29,99' },
      { fidelidade: 'Semestral', total: 'R$ 179,94', mensal: 'R$ 29,99' },
      { fidelidade: 'Trimestral', total: 'R$ 89,97', mensal: 'R$ 29,99' },
      { fidelidade: 'Mensal', total: 'R$ 29,99', mensal: 'R$ 29,99' },
    ],
  },
  {
    nome: 'Módulo Estoque Avançado',
    valores: [
      { fidelidade: 'Anual', total: 'R$ 359,88', mensal: 'R$ 29,99' },
      { fidelidade: 'Semestral', total: 'R$ 179,94', mensal: 'R$ 29,99' },
      { fidelidade: 'Trimestral', total: 'R$ 89,97', mensal: 'R$ 29,99' },
      { fidelidade: 'Mensal', total: 'R$ 29,99', mensal: 'R$ 29,99' },
    ],
  },
  {
    nome: 'Módulo Cupom Fiscal',
    valores: [
      { fidelidade: 'Anual', total: 'R$ 839,88', mensal: 'R$ 69,99' },
      { fidelidade: 'Semestral', total: 'R$ 419,94', mensal: 'R$ 69,99' },
      { fidelidade: 'Trimestral', total: 'R$ 209,97', mensal: 'R$ 69,99' },
      { fidelidade: 'Mensal', total: 'R$ 69,99', mensal: 'R$ 69,99' },
    ],
  },
  {
    nome: 'Módulo Entregadores',
    obs: 'Por pedido — Até 500 pedidos: R$ 0,00 · De 501 a 1500: R$ 0,08 · Acima de 1500: R$ 0,06',
    valores: [
      { fidelidade: 'Anual', total: 'R$ 659,88', mensal: 'R$ 54,99' },
      { fidelidade: 'Semestral', total: 'R$ 329,94', mensal: 'R$ 54,99' },
      { fidelidade: 'Trimestral', total: 'R$ 164,97', mensal: 'R$ 54,99' },
      { fidelidade: 'Mensal', total: 'R$ 54,99', mensal: 'R$ 54,99' },
    ],
  },
  {
    nome: 'Módulo Financeiro',
    valores: [
      { fidelidade: 'Anual', total: 'R$ 839,88', mensal: 'R$ 69,99' },
      { fidelidade: 'Semestral', total: 'R$ 419,94', mensal: 'R$ 69,99' },
      { fidelidade: 'Trimestral', total: 'R$ 209,97', mensal: 'R$ 69,99' },
      { fidelidade: 'Mensal', total: 'R$ 69,99', mensal: 'R$ 69,99' },
    ],
  },
];

export interface CupomLinha {
  /** Rótulo da primeira coluna (fidelidade ou plano). */
  rotulo: string;
  desconto: string;
  valorDesc: string;
  totalDesc: string;
  mensalDesc: string;
  codigo: string;
}

export interface CupomGrupo {
  titulo: string;
  descricao: string;
  /** Cabeçalho da primeira coluna: "Fidelidade" ou "Plano". */
  colunaRotulo: string;
  linhas: CupomLinha[];
}

export const CLOSER_CUPONS_OBS =
  'Os cupons são aplicados apenas nos planos, não incluem os módulos. Válido apenas na primeira contratação.';

export const CLOSER_CUPONS: CupomGrupo[] = [
  {
    titulo: 'Cupom de parcerias',
    descricao: 'Para todos os planos.',
    colunaRotulo: 'Fidelidade',
    linhas: [
      { rotulo: 'Anual', desconto: '5,00%', valorDesc: 'R$ 83,99', totalDesc: 'R$ 1.595,89', mensalDesc: 'R$ 132,99', codigo: '900EF3D3A86238EB' },
      { rotulo: 'Semestral', desconto: '7,00%', valorDesc: 'R$ 63,00', totalDesc: 'R$ 836,94', mensalDesc: 'R$ 139,49', codigo: 'B52B290E090401E7' },
      { rotulo: 'Trimestral', desconto: '9,00%', valorDesc: 'R$ 43,20', totalDesc: 'R$ 436,77', mensalDesc: 'R$ 145,59', codigo: '62CB0EB46475F3EF' },
      { rotulo: 'Mensal', desconto: '15,00%', valorDesc: 'R$ 25,50', totalDesc: 'R$ 144,49', mensalDesc: 'R$ 144,49', codigo: 'AC3A6F506A252932' },
    ],
  },
  {
    titulo: 'Cupom de negociação',
    descricao: 'Aplicável para todos os clientes que queiram negociar — para todos os planos.',
    colunaRotulo: 'Fidelidade',
    linhas: [
      { rotulo: 'Trimestral', desconto: '7,00%', valorDesc: 'R$ 33,60', totalDesc: 'R$ 446,37', mensalDesc: 'R$ 148,79', codigo: 'F49DC7508FDCC54B' },
    ],
  },
  {
    titulo: 'Cupom de 20% para clientes de reopen',
    descricao:
      'Três primeiros meses. O cálculo é feito na base mensal (ex: Delivery = R$ 209,99 × 3 = R$ 629,97 − 20%). No portal, crie o plano sendo trimestral.',
    colunaRotulo: 'Plano',
    linhas: [
      { rotulo: 'Plano Mesas', desconto: '20,00%', valorDesc: 'R$ 101,99', totalDesc: 'R$ 407,98', mensalDesc: 'R$ 135,99', codigo: 'F30F4BE7B3F92196' },
      { rotulo: 'Plano Delivery', desconto: '20,00%', valorDesc: 'R$ 125,99', totalDesc: 'R$ 503,98', mensalDesc: 'R$ 167,99', codigo: 'C0BC88C26C8B0848' },
      { rotulo: 'Plano Premium', desconto: '20,00%', valorDesc: 'R$ 161,99', totalDesc: 'R$ 647,98', mensalDesc: 'R$ 215,99', codigo: 'C7DEFB0D5E9F4645' },
    ],
  },
  {
    titulo: 'Cupom de 30% para clientes de reopen',
    descricao:
      'Três primeiros meses. O cálculo é feito na base mensal (ex: Delivery = R$ 209,99 × 3 = R$ 629,97 − 30%). No portal, crie o plano sendo trimestral.',
    colunaRotulo: 'Plano',
    linhas: [
      { rotulo: 'Plano Mesas', desconto: '30,00%', valorDesc: 'R$ 152,99', totalDesc: 'R$ 356,98', mensalDesc: 'R$ 118,99', codigo: 'F4BF6D770148E97D' },
      { rotulo: 'Plano Delivery', desconto: '30,00%', valorDesc: 'R$ 188,99', totalDesc: 'R$ 440,98', mensalDesc: 'R$ 146,99', codigo: '7BACDCC2DBB61431' },
      { rotulo: 'Plano Premium', desconto: '30,00%', valorDesc: 'R$ 242,99', totalDesc: 'R$ 566,98', mensalDesc: 'R$ 188,99', codigo: '74DA47E9F367979B' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* FRANQUIAS                                                           */
/* ------------------------------------------------------------------ */

export const CLOSER_FRANQUIAS_INTRO =
  'Nesta aba, encontram-se dados sobre a negociação com franquias, condições e informações importantes.';
export const CLOSER_FRANQUIAS_OBS =
  'O desconto de franquia é vitalício e não inclui módulos extras. Para uso, solicite à liderança direta o código do cupom.';

export interface FranquiaLinha {
  unidades: string;
  mensalDesc: string;
  mensalValor: string;
  trimestralDesc: string;
  trimestralValor: string;
  semestralDesc: string;
  semestralValor: string;
  anualDesc: string;
  anualValor: string;
}

export interface FranquiaTabela {
  plano: string;
  linhas: FranquiaLinha[];
}

export const CLOSER_FRANQUIAS: FranquiaTabela[] = [
  {
    plano: 'Franquias — Plano Delivery',
    linhas: [
      { unidades: '1 a 30', mensalDesc: '10%', mensalValor: 'R$ 188,99', trimestralDesc: '7%', trimestralValor: 'R$ 185,99', semestralDesc: '5%', semestralValor: 'R$ 180,49', anualDesc: '3%', anualValor: 'R$ 174,59' },
      { unidades: '31 a 50', mensalDesc: '15%', mensalValor: 'R$ 178,49', trimestralDesc: '12%', trimestralValor: 'R$ 175,99', semestralDesc: '10%', semestralValor: 'R$ 170,99', anualDesc: '5%', anualValor: 'R$ 170,99' },
      { unidades: '51 a 80', mensalDesc: '20%', mensalValor: 'R$ 167,99', trimestralDesc: '15%', trimestralValor: 'R$ 169,99', semestralDesc: '12%', semestralValor: 'R$ 167,19', anualDesc: '7%', anualValor: 'R$ 167,39' },
      { unidades: '81 a 100', mensalDesc: '25%', mensalValor: 'R$ 157,49', trimestralDesc: '20%', trimestralValor: 'R$ 159,99', semestralDesc: '15%', semestralValor: 'R$ 161,49', anualDesc: '10%', anualValor: 'R$ 161,99' },
      { unidades: '101 a 150', mensalDesc: '30%', mensalValor: 'R$ 146,99', trimestralDesc: '25%', trimestralValor: 'R$ 149,99', semestralDesc: '20%', semestralValor: 'R$ 151,99', anualDesc: '15%', anualValor: 'R$ 152,99' },
    ],
  },
  {
    plano: 'Franquias — Plano Premium',
    linhas: [
      { unidades: '1 a 30', mensalDesc: '10%', mensalValor: 'R$ 242,99', trimestralDesc: '7%', trimestralValor: 'R$ 241,79', semestralDesc: '5%', semestralValor: 'R$ 237,49', anualDesc: '3%', anualValor: 'R$ 232,79' },
      { unidades: '31 a 50', mensalDesc: '15%', mensalValor: 'R$ 229,49', trimestralDesc: '12%', trimestralValor: 'R$ 228,79', semestralDesc: '10%', semestralValor: 'R$ 224,99', anualDesc: '5%', anualValor: 'R$ 227,99' },
      { unidades: '51 a 80', mensalDesc: '20%', mensalValor: 'R$ 215,99', trimestralDesc: '15%', trimestralValor: 'R$ 220,99', semestralDesc: '12%', semestralValor: 'R$ 219,99', anualDesc: '7%', anualValor: 'R$ 223,19' },
      { unidades: '81 a 100', mensalDesc: '25%', mensalValor: 'R$ 202,49', trimestralDesc: '20%', trimestralValor: 'R$ 207,99', semestralDesc: '15%', semestralValor: 'R$ 212,49', anualDesc: '10%', anualValor: 'R$ 215,99' },
      { unidades: '101 a 150', mensalDesc: '30%', mensalValor: 'R$ 188,99', trimestralDesc: '25%', trimestralValor: 'R$ 194,99', semestralDesc: '20%', semestralValor: 'R$ 199,99', anualDesc: '15%', anualValor: 'R$ 203,99' },
    ],
  },
  {
    plano: 'Franquias — Plano Mesas',
    linhas: [
      { unidades: '1 a 30', mensalDesc: '10%', mensalValor: 'R$ 152,99', trimestralDesc: '7%', trimestralValor: 'R$ 148,79', semestralDesc: '5%', semestralValor: 'R$ 142,49', anualDesc: '3%', anualValor: 'R$ 135,79' },
      { unidades: '31 a 50', mensalDesc: '15%', mensalValor: 'R$ 144,49', trimestralDesc: '12%', trimestralValor: 'R$ 140,79', semestralDesc: '10%', semestralValor: 'R$ 134,99', anualDesc: '5%', anualValor: 'R$ 132,99' },
      { unidades: '51 a 80', mensalDesc: '20%', mensalValor: 'R$ 135,99', trimestralDesc: '15%', trimestralValor: 'R$ 135,99', semestralDesc: '12%', semestralValor: 'R$ 131,99', anualDesc: '7%', anualValor: 'R$ 130,19' },
      { unidades: '81 a 100', mensalDesc: '25%', mensalValor: 'R$ 127,49', trimestralDesc: '20%', trimestralValor: 'R$ 127,99', semestralDesc: '15%', semestralValor: 'R$ 127,49', anualDesc: '10%', anualValor: 'R$ 125,99' },
      { unidades: '101 a 150', mensalDesc: '30%', mensalValor: 'R$ 118,99', trimestralDesc: '25%', trimestralValor: 'R$ 119,99', semestralDesc: '20%', semestralValor: 'R$ 119,99', anualDesc: '15%', anualValor: 'R$ 118,99' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* OBJEÇÕES                                                            */
/* ------------------------------------------------------------------ */

export type ObjecaoCategoria =
  | 'Objeção de dispensa'
  | 'Objeção de valores'
  | 'Objeção de concorrentes'
  | 'Objeção resposta de reflexo'
  | 'Objeção com relação ao produto'
  | 'Objeção de ceticismo/confiança';

export type ObjecaoFase = 'Fase de apresentação' | 'Fase de negociação' | 'Fase de follow-up';

export interface ObjecaoCloser {
  categoria: ObjecaoCategoria;
  fase: ObjecaoFase;
  titulo: string;
  contorno: string;
}

export const CLOSER_OBJECOES_CATEGORIAS: ObjecaoCategoria[] = [
  'Objeção de dispensa',
  'Objeção de valores',
  'Objeção de concorrentes',
  'Objeção resposta de reflexo',
  'Objeção com relação ao produto',
  'Objeção de ceticismo/confiança',
];

export const CLOSER_OBJECOES: ObjecaoCloser[] = [
  {
    categoria: 'Objeção de dispensa',
    fase: 'Fase de apresentação',
    titulo: 'Estou sem tempo. Você pode ir direto para valores?',
    contorno:
      'Closer: Fernando, eu entendo que você esteja precisando saber direto os valores e eu vou passar para você. Mas preciso garantir que vai te atender e tirar suas dúvidas. Imagina se você contrata e não atende, posso pegar 30 minutos do seu tempo para tirar as dúvidas e passar o melhor plano para você?',
  },
  {
    categoria: 'Objeção de dispensa',
    fase: 'Fase de negociação',
    titulo: 'Lead disse que vai fechar, só que apenas na próxima semana (ou próximo mês)',
    contorno:
      'Lead: Show, eu quero fechar! Mas só posso pagar na próxima segunda feira!\n\nCloser: Perfeito, Fernando. Entendo que segunda-feira parece mais viável pra você. Só que deixa eu te contar uma coisa rápida: quando alguém me diz que quer fechar depois, na maioria dos casos eles não retornam — não por mal, mas porque o dia a dia é corrido.\n\nPelo que a gente conversou, ficou claro que a nossa solução consegue gerenciar melhor a sua operação, automatizar seu pedidos e aumentar suas vendas, certo? (aguarda o \'sim\')\n\nPor isso eu te pergunto: qual o real motivo da gente não poder fechar agora??\n\nLead: Cara, preciso falar com meu sócio antes.',
  },
  {
    categoria: 'Objeção de valores',
    fase: 'Fase de negociação',
    titulo: 'QUANDO TIVER PROMOÇÃO: Lead diz que quando acabar o período da promoção ele vai voltar a pagar o valor cheio.',
    contorno:
      'Lead: Esse valor de agora está ótimo, mas é complicado porque após o período da promoção eu vou ter que pagar mais caro, que é o valor original de vocês.\n\nCloser: Sim, Fernando, realmente nossos valores voltam ao padrão. É por isso que essa promoção é uma oportunidade excelente para você alavancar seu negócio e conseguir ter lucro já pagando um valor a menos. Nesse período você pode ver se de fato, vai conseguir lucrar com ela. Vamos supor aqui o seu lucro inicial com base apenas no disparador de mensagem. Hoje quantos clientes tem na sua base?\n\nLead: Em torno de 500 clientes.\n\nCloser: Geralmente, o retorno do disparador é de até 2%, se você fizer um disparo desses por semana para toda sua base, já serão 10 clientes a mais que não comprariam. Hoje qual seu ticket médio?\n\nLead: Hoje é de R$ 50,00\n\nCloser: Só com essa ferramenta você vai garantir R$ 500,00 a mais no bolso. Consegue entender?\n\nLead: Faz sentido...\n\nCloser: E nesse período promocional você aproveita para ver se de fato vai lucrar o suficiente para manter a ferramenta e ganhar com ela. Podemos seguir para você aproveitar a oferta?',
  },
  {
    categoria: 'Objeção de valores',
    fase: 'Fase de negociação',
    titulo: 'Estou começando agora, queria algo mais em conta.',
    contorno:
      'Closer: Eu entendo que está na fase inicial e faz sentido se preocupar, deve estar investindo em bastante coisa. Mas Fernando, você pensa em iniciar sem sistema?\n\nLead: Sim, até conseguir pagar vou ficar atendendo de forma manual e utilizando planilhas.\n\nCloser: Fernando, vou assumir aqui a posição de especialista. Já vi em diversos negócios isso acontecer: você inicia um negócio, começa a atender e nem se dá conta que a demanda cresce, nesse momento você corre o risco de não dar conta.',
  },
  {
    categoria: 'Objeção de concorrentes',
    fase: 'Fase de negociação',
    titulo: 'Encontrei plataformas que entregam essas mesmas coisas com o valor mais em conta.',
    contorno:
      'Closer: Fernando, é muito comum que diversas ferramentas se apresentem como completas, mas com base no que você viu aqui, a gente de fato te atende?\n\nLead: Sim, consegue atender sim!\n\nCloser: Então, Fernando! Eu te mostrei na prática como atendemos e além de ter tudo que você precisa ainda trazemos a qualidade como você viu, além da confiança de quase 1000 agências parcerias e 15.000 clientes. Mas nada melhor do que testando na prática para comprovar o que estou falando, eu te proponho contratar pelo período de 3 meses inicialmente, assim você testa o sistema e comprova, vamos seguir dessa forma?',
  },
  {
    categoria: 'Objeção de dispensa',
    fase: 'Fase de negociação',
    titulo: 'Me manda no WhatsApp que olho e te dou um retorno',
    contorno:
      'Closer: Fernando, acontece de alguns clientes me pedirem para o whatsapp e prometem que vão dar um retorno e acabam não conseguindo. Então gostaria de saber: o que impede de você fechar comigo aqui na reunião?\n\nLead: Ah, é por causa do meu sócio [Vá para o contorno de objeção que ele trouxe]',
  },
  {
    categoria: 'Objeção de concorrentes',
    fase: 'Fase de follow-up',
    titulo: 'Lead que diz que tá analisando entre nossa plataforma e uma outra pra decidir (follow-up)',
    contorno:
      '[Tente ter o máximo de informações da pesquisa: qual ferramenta, qual o motivo de pesquisar outra ferramenta]\n\nCloser: Qual ferramenta você está pesquisando no momento?\n\nLead: Anota aí, olaclick...\n\nCloser: Entendi, Fernando! E me diz uma coisa, o que você procura em uma ferramenta para decidir?\n\nLead: É mais com relação ao preço mesmo!\n\nCloser: Nesse momento, é muito importante você comparar o preço e ferramentas, dessas que você pesquisou, qual delas te atende 100% sem olhar para valor?\n\nLead: Ainda não consegui decidir.\n\nCloser: Com base em nossa reunião, você precisava [cite a necessidade do lead, tenha isso no CRM], e a gente consegue te atender, o que quero sugerir para você é para nós darmos continuidade em sua contratação, assim você não perde tempo, e eu te libero 30 dias de garantia no plano anual. Desse modo, você já consegue testar o sistema, e caso não goste, te reembolsamos o valor completo e você pode contratar uma outra ferramenta. Podemos seguir?',
  },
  {
    categoria: 'Objeção de concorrentes',
    fase: 'Fase de negociação',
    titulo: 'Lead que diz que tá analisando entre nossa plataforma e uma outra pra decidir (negociação)',
    contorno:
      'Closer: Entendi, Fernando! Você consegue me falar que outras plataformas você está pesquisando?\n\nLead: Anota aí, Ola click...\n\nCloser: Olha só, eu vou aqui te falar como especialista. Falo todos os dias com inúmeros clientes que assim como você estão pesquisando e é importante estar pesquisando. [Cite todas as principais desvantagens do concorrente ligando isso aos problemas do lead que nós podemos resolver] Me diz uma coisa, com base no que você viu aqui comigo, a Cardápio Web, consegue resolver o seu problema?\n\nLead: Cara, consegue sim!\n\nCloser: O que podemos fazer: Você pode continuar pesquisando, mas já deixa a Cardápio Web contratada, porque isso vai te ajudar a não perder tempo enquanto pesquisa. Contratando o plano anual aqui comigo, eu te dou 30 dias de garantia, se você encontrar uma ferramenta melhor, nesse período, a gente devolve todo o seu dinheiro, caso não encontre, que é o que eu acredito que vai acontecer, você já vai ter toda a ferramenta montada e pode utilizar sem grandes problemas, podemos seguir?',
  },
  {
    categoria: 'Objeção de valores',
    fase: 'Fase de negociação',
    titulo: 'O SDR que me atendeu antes passou um valor menor.',
    contorno:
      'Closer: Fernando, geralmente o consultor que te atende inicialmente tenta sondar o máximo que você precisa. Você chegou a explanar mais suas necessidades?\n\nLead: Foi uma conversa rápida.\n\nCloser: Pois é, mas quando você chega aqui, a gente personaliza o plano que mais vai te dá retorno. Por exemplo, você adicionou (cite os módulos adicionados e os benefícios deles) Vendo assim, esse valor faz sentido para você?\n\nLead: Faz, podemos seguir.',
  },
  {
    categoria: 'Objeção de dispensa',
    fase: 'Fase de follow-up',
    titulo: 'Posso falar depois das 18h?',
    contorno:
      '[Lead está enrolando para contratar, você fez um follow-up e ele pediu para ligar mais tarde]\n\nCloser: Claro, Fernando! 18h é a hora que estou saindo geralmente, mas vou deixar agendado para uma conversa de 5 minutos, vou deixar registrado em sua agenda também.\n\n[Registre na agenda dele, e retorne no horário, entenda a objeção real.]',
  },
  {
    categoria: 'Objeção resposta de reflexo',
    fase: 'Fase de apresentação',
    titulo: 'Cliente que já chega falando sobre teste grátis',
    contorno:
      'Closer: Fernando, acredito que tenha conversado com o consultor, mas até te explicando, hoje nós não trabalhamos com teste grátis por ser uma ferramenta que requer a personalização e o trabalho da equipe para criar o cardápio e fazer as ativações necessárias. Mas trabalhamos com a garantia de satisfação, você pode utilizar o sistema e caso não esteja de acordo com o que espera, em 10 dias fazemos o estorno do valor. Desse modo, poderia seguir?\n\nLead: Sim!',
  },
  {
    categoria: 'Objeção de valores',
    fase: 'Fase de negociação',
    titulo: 'Minhas vendas estão fracas',
    contorno:
      'Closer: Realmente entendo, e estou do seu lado! Vamos lá, Fernando. Um dos nossos principais pilares é justamente o aumento de vendas. Nós vamos trabalhar com ferramentas para aumentar suas vendas e você não ter esse problema, mas você precisa investir para fazer o negócio acontecer. Me diz uma coisa, hoje quantos clientes tem em sua base?\n\nLead: Em torno de 200\n\nCloser: E esses clientes possuem recorrência com você?\n\nLead: Na verdade não, eles compram as vezes, alguns não retornam.\n\nCloser: A gente vai trabalhar sua base com o disparador de mensagem. Qual valor médio que cada cliente gasta por compra?\n\nLead: Uns R$ 40,00\n\nCloser: Olha só, segundo nossos dados, ao fazer um disparo você tem um retorno de 2% a 5%, colocando aqui 3% de retorno para sua base de 200 clientes, você teria 6 clientes que você induziu a comprar de forma automática. A um valor médio de R$ 40,00 você iria ter R$ 240,00 no caixa a mais, já paga o plano delivery e sobra para um módulo... Faz sentido?\n\nLead: Faz sentido!\n\nCloser: Eu te falei uma forma de trabalhar com a sua base interna de clientes, você também consegue atrair clientes por meio de divulgação de cupons de descontos.',
  },
  {
    categoria: 'Objeção de valores',
    fase: 'Fase de negociação',
    titulo: 'Quando for renovar vai ser com esse mesmo valor?',
    contorno:
      'Lead: Na renovação, vou pagar o mesmo valor?\n\nCloser: Fernando, os valores mudam anualmente, acompanhando a inflação, mas junto a isso, também mantemos o sistema atualizado, sempre entregando o melhor possível para justificar o valor que você vai pagar. E é até melhor você começar hoje, para o quanto antes, a ferramenta começar a se pagar. Podemos continuar?',
  },
  {
    categoria: 'Objeção de valores',
    fase: 'Fase de negociação',
    titulo: 'Eu tenho que contratar 12 meses de uma vez',
    contorno:
      'Closer: Isso, Fernando! Isso acontece para garantir a segurança de que seu plano vai continuar ativo, assim como a própria segurança e manutenção da empresa.',
  },
  {
    categoria: 'Objeção resposta de reflexo',
    fase: 'Fase de negociação',
    titulo: 'Lead disse que precisa pensar antes de dar uma resposta',
    contorno:
      'Lead: Eu preciso pensar a respeito.\n\nCloser: Entendi, Fernando, tô do seu lado. Mas numa escala de 0 a 10, sendo 10 "vamos começar agora" e 0 "eu não pegaria nem que fosse de graça", aonde estamos?\n\nLead: 5\n\nCloser: E o que nos levaria ao 10?\n\nLead: Se fosse de graça\n\nCloser: Se fosse de graça haha então é uma questão orçamentária?\n\nLead: Eu não sei se vai funcionar\n\nCloser: Entendo, Fernando. Eu já lidei com centenas de outros empresários aqui dentro e essa é dúvida mais comum que eles têm: será que meus clientes vão se adaptar? E se não funcionar para mim? E a resposta para isso é, com certeza vai funcionar! Mas para saber disso, antes você precisa botar a mão na massa e colocar para rodar.\n\nCloser: Eu reconheço sua preocupação, e para isso, acho que a gente pode chegar num consenso, 30 dias de garantia para você pedir seu dinheiro de volta tá bom? Assim você pode testar o quanto quiser durante um mês inteiro e se realmente não fizer sentido para você, nós devolvemos seu dinheiro, 0 risco.\n\nLead: Agora parece mais interessante.',
  },
  {
    categoria: 'Objeção de dispensa',
    fase: 'Fase de negociação',
    titulo: 'Lead disse que vai fechar, só que apenas na próxima semana (ou próximo mês) - com sócio/esposa',
    contorno:
      'Lead: Show, eu quero fechar! Mas só posso pagar na próxima segunda feira!\n\nCloser: Perfeito, Fernando. Entendo que segunda-feira parece mais viável pra você. Só que deixa eu te contar uma coisa rápida: quando alguém me diz que quer fechar depois, na maioria dos casos eles não retornam — não por mal, mas porque o dia a dia é corrido.\n\nCloser: Pelo que a gente conversou, ficou claro que a nossa solução consegue gerenciar melhor a sua operação, automatizar seu pedidos e aumentar suas vendas, certo? (aguarda o \'sim\')\n\nPor isso eu te pergunto: qual o real motivo da gente não poder fechar agora??\n\nLead: Cara, preciso falar com a minha esposa antes.',
  },
  {
    categoria: 'Objeção de dispensa',
    fase: 'Fase de negociação',
    titulo: 'Lead disse que precisa consultar alguém antes de dar uma resposta (esposa/sócio)',
    contorno:
      'Lead: Cara, preciso falar com a minha esposa antes.\n\nCloser: Perfeito, entendo o seu lado. Se você quer consultar sua esposa eu imagino que você queira uma opinião dela para saber se a ferramenta funciona para vocês, mas deixa eu te perguntar uma coisa: você concorda comigo que é impossível a gente saber se algo funciona sem nunca ter usado?\n\nLead: Sim, faz sentido.\n\nCloser: Então você concorda comigo que, independente da conclusão que vocês chegarem, vai ser uma opinião totalmente baseada em hipóteses, correto?\n\nLead: Sim, a gente vai analisar nosso cenário e entender se de fato precisamos da ferramenta.\n\nCloser: Perfeito, e eu entendo você! É sempre uma preocupação se comprometer com algo e acabar não sendo aquilo que você esperava. Mas se você concorda comigo que para saber se algo realmente funciona é preciso de prática e independente da conclusão que vocês chegarem, é impossível saber o que de fato vai acontecer, então eu vou te falar qual o meu trabalho: é te fazer fechar esse acordo comigo, de preferência neste exato momento, então eu tô disposto a te fazer uma oferta que resolve justamente essa dúvida que você está tendo, o que você acha?\n\nLead: Pode falar.\n\nCloser: Se você realmente precisar conversar com a sua esposa antes de fechar, tudo bem. Mas como falei, a melhor forma é testar na prática para ter uma certeza. Se você fechar comigo agora no plano semestral ou anual, consigo te liberar nossa garantia de satisfação ainda maior que a nossa padrão, de 10 dias, podemos estender para 30 dias. Vocês vão poder usar juntos por um mês inteiro, testar a ferramenta na prática e decidir com base em experiência real, não em suposição. Isso faria mais sentido pra você?\n\nLead: Faz sentido.\n\nCloser: Como vai ficar melhor, no plano mensal ou anual?\n\nLead: anual',
  },
  {
    categoria: 'Objeção de valores',
    fase: 'Fase de negociação',
    titulo: 'Lead disse que não pode fechar porque está sem dinheiro (ou cartão sem limite)',
    contorno:
      '[Caso esteja falando com um lead que quer contratar semestral/anual]\n\nLead: Nesse momento eu tô sem limite no cartão, só posso fechar na segunda feira.\n\nCloser: Entendi, Fernando! Então deixa eu te perguntar uma coisa, você tem certeza absoluta que vai fechar comigo nessa segunda feira?\n\nLead: Sim, eu tenho.\n\nCloser: Perfeito, e se fosse para a gente fechar agora, quanto você estaria disposto a pagar só para a gente começar ainda hoje e você manter a garantia de 30 dias?\n\nLead: Cara, uns R$100.\n\nCloser: Então eu tenho uma ideia para manter o benefício de 30 dias de garantia e você já começar a produção do seu cardápio agora, eu vou gerar um pagamento de apenas R$100, e a gente faz o pagamento da licença em 2 parcelas, uma agora para a garantir esses 30 dias e já começar o cadastro do cardápio, e outra na próxima segunda feira. Vou te mandar pelo WhatsApp agora para a gente começar!\n\nLead: Então tudo bem!\n\n[Caso esteja falando com um lead que quer contratar mensal/trimestral]\n\nCloser: Fernando, eu entendo que essa questão do cartão seja um ponto para você. Me diz uma coisa, com base no que conversamos aqui, faz sentido você utilizar o sistema para resolver esses problemas [CITE OS PROBLEMAS DO LEAD] correto?\n\nLead: Sim, só não consigo hoje!\n\nCloser: E a única questão é o seu limite, correto?\n\nLead: Isso mesmo!\n\nCloser: O que eu quero te propor, é que para resolver tudo isso, a gente consiga já começar a montagem do cardápio, me diz uma coisa, hoje qual limite você tem no cartão?\n\nLead: R$ 100,00\n\nCloser: O que a gente pode fazer é que nesse mês, você possa pagar em duas vezes, uma agora, e já começamos a montar e daqui a dez dias você paga o restante, nos meses seguintes você paga de forma normal em parcelas únicas. Fazendo isso, a gente já consegue iniciar a montagem do seu cardápio. Podemos fazer dessa forma?',
  },
  {
    categoria: 'Objeção de dispensa',
    fase: 'Fase de negociação',
    titulo: 'Lead disse que precisa pensar antes de dar uma resposta (dispensa)',
    contorno:
      'Lead: Eu preciso pensar a respeito\n\nCloser: Entendi, Fernando, tô do seu lado. Mas numa escala de 0 a 10, sendo 10 "vamos começar agora" e 0 "eu não pegaria nem que fosse de graça", aonde estamos?\n\nLead: 5\n\nCloser: E o que nos levaria ao 10?\n\nLead: Se fosse de graça\n\nCloser: Se fosse de graça haha então é uma questão orçamentária?\n\nLead: Eu não sei se vai funcionar\n\nCloser: Entendo, Fernando. Eu já lidei com centenas de outros empresários aqui dentro e essa é dúvida mais comum que eles têm: será que meus clientes vão se adaptar? E se não funcionar para mim? E a resposta para isso é, com certeza vai funcionar! Mas para saber disso, antes você precisa botar a mão na massa e colocar para rodar.\n\nCloser: Eu reconheço sua preocupação, e para isso, acho que a gente pode chegar num consenso, 30 dias de garantia para você pedir seu dinheiro de volta tá bom? Assim você pode testar o quanto quiser durante um mês inteiro e se realmente não fizer sentido para você, nós devolvemos seu dinheiro, 0 risco.\n\nLead: Agora parece mais interessante.',
  },
  {
    categoria: 'Objeção de dispensa',
    fase: 'Fase de negociação',
    titulo: 'Quero fechar ano que vem',
    contorno:
      'Lead: Vou deixar para ver isso ano que vem\n\nCloser: Entendi, Fernando! Você prefere deixar passar as festas de fim de ano antes de pensar em um novo investimento. Mas deixa eu te explicar o porque eu acho que seria uma boa você já contratar antes da virada do ano.\n\nCloser: Normalmente quando se inicia um novo ano, os preços dos planos costumam aumentar, é uma época comum de acontecer esses aumentos. Então se você pudesse se precaver e contratar logo a ferramenta, eu conseguiria segurar esses preços para você. Se for o caso, talvez a gente possa inclusive fechar agora e começar a contar o seu início de operação apenas em janeiro, assim você ganha alguns dias. Já que é uma prioridade para você e você já sabe que precisa da nossa ferramenta, então essa me parece a opção mais inteligente nesse momento, o que você me diz?\n\nLead: De fato, vendo por esse lado, faz sentido mesmo!',
  },
  {
    categoria: 'Objeção de concorrentes',
    fase: 'Fase de negociação',
    titulo: 'Lead já tem contrato com outra empresa, e se sair perde o dinheiro pago',
    contorno:
      'Lead: Eu quero fechar com vocês, mas eu já tenho um contrato com outra empresa até o final desse ano.\n\nCloser: Entendo, Fernando! E você fica receoso que esteja gastando com algo que não vai usar. Mas você concorda comigo que se você tá procurando outra ferramenta é porque essa que você tá usando não tá te atendendo?\n\nLead: Sim, faz sentido.\n\nCloser: E o que essa plataforma não tem que é essencial para você?\n\nLead: Meus clientes não estão se adaptando ao cardápio digital que eu tô usando.\n\nCloser: Entendi, você concorda comigo que se os seus clientes não estão se adaptando, então você continua com o mesmo problema de sempre, ou seja, seus atendimentos manuais continuam necessários e junto com isso os erros que um atendimento manual ocasionam. Se você parar para analisar comigo, os gastos que você têm ao não resolver esse problema são bem altos.\n\nCloser: Quantos pedidos você tem em um dia de muito movimento?\n\nLead: Cerca de 40.\n\nCloser: Perfeito, vamos supor que você tenha dois dias de muito movimento por semana e que, sabendo que o seu sistema atual não está funcionando, você ainda precisa recorrer ao atendimento manual. Primeira coisa que você gasta é com um atendente, vamos colocar R$1000,00 reais que você gasta com esse atendente para a sua operação. Além disso, sabendo que o atendimento manual causa problemas de perda de vendas e de clientes, então vamos supor que, em um dia de 40 pedidos, você perca apenas 2 pedidos por noite. Como você tem 2 noites movimentadas, então isso equivale a 4 pedidos por fim de semana, com um mês de 4 semanas, ficam 16 pedidos perdidos. A ticket médio de 50 reais, é o equivalente a 800 reais em pedidos perdidos. Agora me responde, quanto seria o custo mensal da sua plataforma atualmente?\n\nLead: 80 reais.\n\nCloser: Então você concorda comigo que se você contratar a nossa ferramenta e a gente realmente fizer o que eu tô te propondo, esses 80 reais não vão fazer tanta diferença frente ao que a gente vai trazer pro seu negócio, não é?\n\nLead: É, faz sentido!\n\nCloser: Então é isso, eu não vejo como isso pode ser um empecilho porque matematicamente falando, a conta fecha com sobra, então eu diria que mesmo tendo esse custo da outra ferramenta, o que você tem a ganhar aqui é muito maior.',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'E não tem o risco do meu chip ser bloqueado?',
    contorno:
      'Lead: E não tem o risco do meu chip ser bloqueado?\n\nCloser: Excelente pergunta! É comum essa dúvida, mas deixa eu te explicar: a nossa ferramenta de disparo é integrada diretamente com o seu WhatsApp, então você continua usando o seu número normalmente, sem nenhuma mudança de chip ou risco imediato.\n\nAlém disso, a gente disponibiliza um manual de boas práticas, com todas as orientações para garantir que seus envios sejam feitos de forma segura e evitem qualquer tipo de bloqueio. Ficou claro pra você até aqui?\n\nLead: Sim, ficou claro! Mas tem limite na quantidade de mensagens que posso enviar?\n\nCloser: Ótima pergunta também! Não existe um limite fixo de quantidade. O ideal é ir aumentando a quantidade de mensagens aos poucos, até pra diminuir as chances de bloqueio, de forma natural, para o WhatsApp entender que é uma operação legítima. Um ponto que quero te lembrar é que cada disparo pode ser feito para 2.000 pessoas, mas supondo que você tem uma base maior, pode ir quebrando esses disparos.\n\nOu seja: dá pra mandar muita mensagem, sim — desde que siga as orientações certas. E o nosso time está aqui justamente pra te ajudar com isso, Tranquilo?\n\nLead: Perfeito!',
  },
  {
    categoria: 'Objeção de valores',
    fase: 'Fase de negociação',
    titulo: 'Indicação achando que vai pagar ainda o valor antigo',
    contorno:
      'Lead: Mas o meu amigo que indicou vocês disse que ele pagava R$ 119,90\n\nCloser: Entendo, Fernando! É porque ele é um cliente antigo e paga o preço que a gente cobrava a alguns meses atrás. Houve esse reajuste e estamos fazendo a alteração de valores para os clientes da base aos poucos, primeiro informando e seguindo um processo. Mas a nossa plataforma continua tendo o melhor custo benefício que você vai encontrar no mercado com uma das interfaces mais fáceis de usar que você vai encontrar, existem até estudos acadêmicos comprovando que a usabilidade do Cardápio Web é a melhor imaginável, que é o nível máximo na análise de usabilidade. Isso garante para você uma rápida adesão dos seus clientes. Além disso, normalmente o investimento que você faz no nosso sistema já se paga no primeiro mês, pois além de automatizar seu atendimento, a gente oferece ferramentas para que você aumente as suas vendas.',
  },
  {
    categoria: 'Objeção de valores',
    fase: 'Fase de negociação',
    titulo: 'Lead diz que tá caro.',
    contorno:
      'Lead: Tô achando muito caro.\n\nCloser: Entendo, Fernando. Você não vê o valor que essa ferramenta pode trazer pro seu negócio ou é uma questão orçamentária?\n\nLead: Realmente pra mim não faz tanta diferença.\n\nCloser: Vamos fazer um cálculo simples, quais dias da semana você tem pico de vendas?\n\nLead: Na sexta-feira e no Sábado.\n\nCloser: Pega esses 2 dias que você falou e vamos supor que você perca 3 vendas por dia, dando um total de 6 pedidos por semana por demora no atendimento. Com um ticket médio de 50 reais, então você tá perdendo 300 reais por fim de semana, com um mês de 4 semanas dá 1200 reais por mês. Esse valor faz diferença para você?\n\nLead: Faz sim!\n\nCloser: Agora vamos continuar, dessas vendas que você perdeu, você já parou para analisar quantos clientes nunca mais pediram depois de ficarem esperando? Hoje nossa ferramenta se propõe a te ajudar a não perder esse valor. Com a automação e ferramentas de gestão. Isso faz sentido para você?\n\nLead: Sim.\n\nCloser: Podemos partir pro fechamento?\n\nLead: Podemos!\n\nCASO QUEIRA OFERECER O PLANO ANUAL, ESTE É UM BOM EXEMPLO (Delivery)\n\nCloser: Somente até amanhã, ao invés de você pagar R$ 2.519,88 (mensal x12), eu tenho uma promoção que vai te oferecer o Cardápio Web pelo ano inteiro por apenas R$ 2159,88 (plano anual), você vai economizar praticamente 500,00 reais se fechar comigo hoje, então eu quero saber, vamo fechar esse negócio?\n\nLead: VAMOS!',
  },
  {
    categoria: 'Objeção de dispensa',
    fase: 'Fase de follow-up',
    titulo: 'Problema pessoal',
    contorno:
      'Lead: Não posso fechar agora porque estou com um problema pessoal.\n\n1ª Opção\n\nCloser: Nossa, Fernando, tem algo que eu possa fazer para te ajudar?\n\nLead: Não, é algo de família.\n\nCloser: Entendi, tudo certo! Mas Fernando, deixa eu te contar uma história. A um tempo atrás eu também passei por um problema familiar e eu deixei que isso impactasse a minha vida profissional, como a gente aqui na Cardápio Web ganha por comissão, isso acabou baixando a minha produtividade e eu recebi bem menos do que eu tô acostumado, então eu acabei ficando foi com 2 problemas. Então me responde uma coisa, independente desse problema que você está passando, pelo que a gente conversou, parece que a ferramenta tem potencial para alavancar suas vendas e te deixar muito mais tranquilo sem se preocupar com atendimento, isso é algo que realmente você não tem como conciliar agora? Porque a cada semana que passa sem fazer isso, você tá deixando tempo e dinheiro na mesa.\n\nLead: Faz sentido, vamos prosseguir.\n\n2ª Opção\n\nCloser: Então vamos fazer o seguinte, a gente pode pausar a nossa negociação por enquanto e retomar quando você tiver com mais disponibilidade, o que você acha?\n\nLead: Boa ideia.\n\nCloser: Perfeito, você acha que na próxima semana eu posso tá entrando em contato de novo?\n\nLead: Sim.',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Eu não tenho impressora ainda',
    contorno:
      'Closer: Fernando, eu te sugiro, ir acompanhando por hora no gestor de pedidos que é prático. Além disso, você consegue enviar informações do pedido no whatsapp do cliente e se necessário, do entregador, dessa forma te atende?\n\nLead: Atende sim',
  },
  {
    categoria: 'Objeção resposta de reflexo',
    fase: 'Fase de negociação',
    titulo: 'Cliente disse que só vai começar a operar no próximo mês.',
    contorno:
      'Lead: Eu só vou começar a operar no próximo mês.\n\nCloser: Perfeito, entendi! Nesse caso, posso até te ajudar com isso. Se você topar garantir a condição especial hoje, eu consigo liberar a extensão da fatura, ou seja: você realiza o pagamento agora, mas a contagem só começa a valer a partir do momento que você iniciar a operação, no próximo mês.\n\nAssim, você não perde a condição de hoje e ainda tem tranquilidade pra começar no seu tempo, tudo certo e planejado. Faz sentido pra você dessa forma?\n\nLead: Entendido.',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Integração com marketplaces (ex.: aiqfome, rappi..)',
    contorno:
      'Lead: Vocês têm integração com marketplaces como Rappi?\n\nCloser: Hoje temos integração com a Aiqfome disponível com o módulo de integração com marketplaces, que inclui ifood, keeta e 99food também. Por hora, não temos integração com a Rappi, mas temos a API aberta e podemos disponibilizar a chave para que eles integrem. Ou, como opção, você pode manter os gestores abertos e concentrar a maior parte da sua operação com a gente, e a parte relacionada a Rappi você faz separadamente, faz sentido seguir?\n\nLead: Perfeito, vamos seguir!\n\n[Caso o lead diga que precisa da integração com a Rappi para controlar a parte relacionada a dados, sugira o MÓDULO FINANCEIRO, como alternativa para ele cadastrar as contas a receber]',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'O Cardápio Web não vai integrar com o meu sistema de gestão?',
    contorno:
      '[CASO 1: O lead cita um sistema de gestão que não integramos e é essencial que ele utilize esse sistema]\n\nLead: O Cardápio Web não vai integrar com o meu sistema de gestão?\n\nCloser: Não, nós não costumamos fazer integração com outros sistemas de gestão porque a gente já oferece todos os módulos de gestão que você precisa para controlar o seu negócio. Essa integração é essencial para você?\n\nLead: Sim, sou de uma franquia que nos obriga a usar.\n\nCloser: Entendo, tenho alguns clientes em uma situação parecida e o que eles fazem é utilizar o sistema da franquia para o salão, e fazem o delivery pela nossa ferramenta, devido a todos os benefícios que oferecemos, como um cardápio mais intuitivo e próprio para o marketing, nesse caso, você teria interesse em otimizar a parte do delivery com a gente e com relação ao salão você mantém no sistema da franquia?\n\nLead: Acho que podemos fazer assim...\n\n[Caso o lead pareça não estar certo, sugira ele fazer uma contratação de um período menor como 1 mês ou 3 meses para conseguir ter certeza]\n\n[CASO 2: O lead não é obrigado a utilizar o sistema]\n\nCloser: Fernando, hoje nós somos um sistema bem completo, temos desde o atendimento até a gestão e com qualidade, como te mostrei, gestão de estoque, módulo financeiro, emissão de cupons fiscais e gestão de dados... Ou seja, podemos fazer tudo que seu sistema já faz hoje\n\nLead: Mas eu já estou acostumado com meu sistema.\n\nCloser: Entendo, Fernando. Você não acha que seria melhor deixar todo o seu negócio centralizado numa única ferramenta capaz de integrar a sua gestão, seu cardápio digital e até mesmo seus disparos de mensagem no WhatsApp?\n\nLead: Sim, parece melhor.\n\nCloser: Então, é isso que a gente oferece para você, uma plataforma capaz de unir tudo que você precisa em um só lugar e você ainda pode fazer a migração dos dados do seu sistema atual para o nosso. O que você me diz?\n\nLead: Gostei.',
  },
  {
    categoria: 'Objeção de ceticismo/confiança',
    fase: 'Fase de apresentação',
    titulo: 'Vocês fazem visita presencial?',
    contorno:
      'Lead: Vocês fazem visita presencial?\n\nCloser: No caso, como a nossa operação é nacional, nós não fazemos visita presencial. Somos especialistas em trabalho remoto e a nossa plataforma é 100% online, por isso você não precisa de ninguém visitando seu estabelecimento para ter o sistema funcionando, porque a gente já deixa tudo configurado para você usar de qualquer lugar, seja celular ou computador, você consegue trabalhar até de casa se quiser. E o bom disso é que o nosso suporte fica disponível para você a qualquer momento e sem precisar esperar ninguém ir no seu local de trabalho, você já resolve tudo ali pelo whatsapp ou por chat no sistema, e se quiser um treinamento para você ou para a sua equipe, basta solicitar à nossa equipe, porque a gente oferece treinamentos ilimitados para você. Faz sentido pra você?\n\nLead: Entendi, faz sim!',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Mas vocês não fornecem entregadores?',
    contorno:
      'Lead: Mas vocês não fornecem entregadores?\n\nCloser: Na verdade, a gente não fornece entregadores por uma razão bem estratégica: o objetivo é que você lucre mais e tenha controle total sobre sua operação de delivery. Usar entregadores próprios ou fazer parcerias diretas é o caminho que os especialistas mais recomendam — e isso barateia muito a entrega, agiliza o serviço e aumenta seu lucro.\n\nMas caso você ainda não tenha um entregador, a plataforma continua funcionando normalmente. Você pode:\n- Utilizar entregadores avulsos de apps como Ifood, Food Delivery, Mottu...\n- Ou fazer parcerias diretas com entregadores da sua região, pagando por entrega feita.\n\nOu seja, a gente não fornece o entregador, mas te dá liberdade para escolher a opção mais vantajosa pro seu negócio. Como fica melhor para você?\n\nLead: Quero utilizar os entregadores aqui da Mottu',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Meu atendimento é o diferencial aqui, meus clientes gostam desse contato.',
    contorno:
      'Lead: Mas meu atendimento é o diferencial aqui, meus clientes gostam desse contato.\n\nCloser: Claro, e é ótimo saber que você valoriza isso. Só pra confirmar: hoje você mesmo que responde os pedidos no WhatsApp, né? Show. E você acaba repetindo muita informação? Tipo preço, taxa de entrega, sabores…\n\nLead: Realmente repito demais os valores e disponibilidade.\n\nCloser: Então, é aí que o cardápio digital entra. A ideia não é substituir seu atendimento, mas tirar o peso das tarefas repetitivas. Você continua dando boas-vindas, perguntando se gostou, mantendo o relacionamento… Mas o cliente faz o pedido direto, sem precisar esperar resposta. Consegue ver como isso te ajuda a ganhar tempo sem perder a proximidade?\n\nLead: Consigo sim. Agora ficou claro!\n\nCloser: E mais: quando seu volume aumentar, vai ser difícil manter esse atendimento 100% manual. Então quanto antes acostumar seu público com o digital, melhor pra escalar seu negócio. Hoje nosso chatbot tem uma IA de atendimento, em que você consegue até mesmo personalizar com mais autonomia e deixar o atendimento ainda mais humanizado. Ficou alguma dúvida ou podemos seguir?\n\nLead: Podemos.',
  },
  {
    categoria: 'Objeção de dispensa',
    fase: 'Fase de follow-up',
    titulo: 'Não tenho interesse',
    contorno:
      'Lead: Não tenho interesse.\n\nCloser: Tranquilo! Só pra eu entender rapidinho e não tomar mais do seu tempo: você diz que não tem interesse porque já tem algo parecido ou porque ainda não viu valor no que eu falei até agora?\n\n(Silêncio – espera o lead responder. Aqui você identifica se é uma objeção real ou apenas reflexo.)\n\nSe o lead responder algo como "já tenho algo":\nCloser: Entendo! Só por curiosidade, o que você está usando hoje?\n(Seguindo da comparação com funcionalidades e benefícios da sua solução.)\n\nSe o lead responder "ainda não vi valor" ou "tô sem tempo":\nCloser: Totalmente justo. Prometo ser breve: posso só te mostrar em 1 minuto como a gente está ajudando centenas de restaurantes a automatizar pedidos, economizar tempo e aumentar o faturamento? Se ainda assim não fizer sentido, a gente encerra por aqui, sem problema nenhum. Fechado?',
  },
  {
    categoria: 'Objeção de dispensa',
    fase: 'Fase de negociação',
    titulo: 'Quero usar a plataforma antes de indicar pra alguém',
    contorno:
      'Lead: Eu quero usar a plataforma antes de indicar pra alguém.\n\nCloser: Super justo! E eu entendo totalmente esse cuidado — afinal, é o seu nome que vai estar em jogo, né?\n\nMas deixa eu te trazer um ponto importante: a nossa plataforma tem ajudado milhares de restaurantes no Brasil inteiro, e justamente por isso criamos um programa de indicações onde quem indica, só ganha se a pessoa realmente fechar com a gente. Ou seja, você não precisa se preocupar em convencer ninguém, é só compartilhar, e se a pessoa ver valor, você ganha uma recompensa por isso.\n\nO que você acha de já garantir as primeiras indicações enquanto seu sistema está sendo implantado? Assim você já começa ganhando. Faz sentido pra você?\n\nLead: Faz sim. Tenho 2 pessoas pra indicar.',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'O sistema de vocês é 100% online? E se a internet cair?',
    contorno:
      'Lead: O sistema de vocês é 100% online?\n\nCloser: Sim, o nosso sistema é 100% online, o que traz várias vantagens, como atualizações automáticas, acesso de qualquer lugar e segurança das informações.\n\nLead: Se a internet cai?\n\nCloser: Caso aconteça de a internet cair, você não fica na mão: dá pra usar o celular de forma provisória para continuar recebendo os pedidos normalmente. Assim, você garante a operação funcionando mesmo em situações fora do previsto. Esse plano B costuma resolver bem nesses momentos. Ficou claro pra você como funciona?\n\nLead: Ficou sim',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'O sistema já caiu alguma vez?',
    contorno:
      'Lead: O sistema já caiu alguma vez?\n\nCloser: Ótima pergunta. Raramente acontece, mas qualquer sistema é passível de passar por quedas, até o WhatsApp cai, então independente da ferramenta que você contratar, em algum momento ela pode ter instabilidade. Mas no nosso caso, isso muito raramente acontece, porque nós investimos muito no servidor para evitar problemas, inclusive a gente paga o dobro do valor no servidor só para ter um servidor reserva, que só entra em cena caso o primeiro caia, então é super seguro.',
  },
  {
    categoria: 'Objeção de dispensa',
    fase: 'Fase de negociação',
    titulo: 'Preciso falar com o pessoal do financeiro',
    contorno:
      'Closer: Entendo, Fernando. Conhecendo o seu financeiro, qual seria o plano que contrataria?\n\nLead: O anual\n\nCloser: O que podemos fazer aqui: Você me disse que o ideal para o seu financeiro é o anual e você havia falado que o trimestral era o que se encaixava. O que você acha de falar com o seu financeiro agora por telefone?\n\nLead: Preciso ver aqui...\n\nCloser: Você consegue ligar agora para o seu financeiro?\n\nLead: Por que ligar agora?\n\nCloser: Porque se conseguir falar com o financeiro, consigo dar um desconto de 5% no anual. Você consegue ligar agora?\n\nLead: Posso sim\n\n[Em caso de negativa]\n\nLead: Vou precisar desligar e falar depois.\n\nCloser: Então você conseguiria falar com o seu financeiro até às 13h e se comprometer a realizar o pagamento nesse horário?\n\nLead: Até às 13h não consigo realizar, acho que até às 15h consigo.\n\nCloser: Vamos fazer o seguinte: vou conseguir segurar para você até 15h. E vou marcar esse retorno na sua agenda, pode ser?\n\nLead: Pode sim!',
  },
  {
    categoria: 'Objeção de dispensa',
    fase: 'Fase de negociação',
    titulo: 'Preciso ter uma reunião com outra plataforma para tomar a decisão',
    contorno:
      'Lead: Preciso ver o que o Anotaí (concorrente) tem a oferecer na reunião que marquei com eles.\n\nCloser: Entendo o seu lado, Fernando. Agora, sendo bem direto com você: o Anotaí nem está na mesma prateleira. A gente atende vários clientes que vieram de lá. Eles tinham exatamente esse cenário: sistema travando, suporte demorado e muita limitação no cardápio digital. Depois que migraram pra nossa plataforma, começaram a ganhar tempo, melhorar a experiência do cliente e até vender mais, porque conseguimos integrar tudo de forma fluida.\n\nFernando, posso te fazer uma pergunta rápida?\n\nLead: Pode sim!\n\nCloser: Você quer um sistema pra economizar no início ou uma solução que realmente resolva sua operação e ajude a crescer?\n\nLead: Que ajude.\n\nCloser: Se for pra comparar, vale a pena comparar o que cada um entrega de fato, não só o preço. Concorda?\n\nLead: Faz sentido. Quero o mensal.',
  },
  {
    categoria: 'Objeção de valores',
    fase: 'Fase de negociação',
    titulo: 'Estou esperando meu cartão virar',
    contorno:
      'Closer: Entendi, Fernando! Quando seu cartão vira?\n\nLead: Dia 30 (caso ele diga algo que falta no máximo 10 dias)\n\nCloser: Vamos fazer o seguinte... Hoje quanto você tem disponível em dinheiro que poderia pagar?\n\nLead: R$ 100,00\n\nCloser: Cara, eu posso fazer o seguinte: você paga os R$ 100,00 agora, e no dia 30 você paga o restante, desse modo, nesse período já começamos a montagem do seu cardápio, podemos seguir assim?\n\nLead: Assim podemos!',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'O Anota AI não cobra pela integração e vocês cobram R$19,90',
    contorno:
      'É verdade que o Anota Aí não cobra pela integração, mas isso acontece porque ele foi comprado pelo iFood e hoje é parte do ecossistema deles. Na prática, o foco acaba sendo puxar os pedidos pro iFood e não para o seu negócio direto.\n\nAlém disso, muitos clientes nos relataram que o Anota Aí começa com um valor mais baixo, mas depois o custo aumenta consideravelmente. Aqui na Cardápio Web, preferimos ser transparentes desde o início: você sabe exatamente quanto vai pagar, sem surpresas.\n\nPor R$19,90, você tem uma integração estável, com suporte e controle do lado da sua operação, integrando até 9 lojas do ifood.\n\nQueremos que você cresça com previsibilidade e segurança. Vamos seguir com a ativação?',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Já tenho tudo automatizado dentro do iFood, já imprime e tenho tudo lá',
    contorno:
      'Entendo, Fernando. Hoje o iFood realmente oferece algumas automações. Mas o ponto é: toda essa estrutura está presa dentro da plataforma deles, o que limita o controle do seu próprio negócio.\n\nCom a Cardápio Web, você centraliza pedidos de todos os canais (inclusive o iFood), possui o próprio chat do ifood em nosso painel e ainda tem dados e controle financeiro nas suas mãos, sem depender do marketplace.\n\nOu seja, ao invés de depender 100% do iFood, você passa a usar ele a seu favor, mantendo a autonomia da sua operação.\n\nPodemos ativar esse módulo para você testar na prática?',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Vendo pouco no iFood',
    contorno:
      'Justamente por isso a integração é estratégica, ela ajuda a organizar e melhorar o fluxo dos pedidos, mesmo que sejam poucos. E quando suas vendas crescerem, você já estará preparado. Vamos deixar isso pronto agora?',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Não tenho tempo para alimentar o estoque',
    contorno:
      'Muito bom ter falado sobre isso. O tempo investido agora vira economia depois. Vários clientes relatam que, após organizar o estoque, pararam de perder produtos e de comprar sem necessidade. E você não estará sozinho: nosso suporte está pronto pra te orientar nessa primeira etapa. Acha que faz sentido o que falei?',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Não faço esse controle tão preciso na operação',
    contorno:
      'Justamente por isso esse módulo pode transformar sua rotina. Ele facilita o controle do que entra e sai, mesmo que você ainda não tenha esse hábito. Com o uso diário, você passa a ter mais previsibilidade e reduz perdas sem complicação.\n\nVamos ativar esse módulo no seu plano e dar esse próximo passo juntos?',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Preciso que o estoque atualize direto pela entrada em nota',
    contorno:
      'Entendo, Fernando. Essa automação realmente parece prática. Mas ela pode gerar inconsistências no estoque se a nota fiscal não refletir exatamente o que chegou, o que é muito comum.\n\nNa Cardápio Web, priorizamos um controle confiável, onde você tem a segurança de validar as informações antes de afetar seu estoque, evitando surpresas como falta de produto ou sobras. Acha que faz sentido?',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Minha cidade é pequena, os motoboys já conhecem tudo',
    contorno:
      'Compreendo, Fernando. Mesmo em cidades pequenas, o módulo ajuda a organizar as rotas, priorizar entregas e reduzir o tempo de espera. Motoboys experientes também se beneficiam quando a distribuição dos pedidos é mais inteligente. Dessa forma você consegue economizar o tempo e trazer mais satisfação para os clientes diminuindo o tempo de entrega.',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Não quero pagar pelos excedentes',
    contorno:
      'Alguns clientes relatam o mesmo, Fernando. Isso só acontece quando o restaurante passa de 500 pedidos no mês, o que já indica um ótimo resultado.\n\nNesse volume, o retorno compensa esse valor extra, que pode até ser diluído na entrega. O módulo também traz agilidade, mais pedidos com menos esforço e mais controle da operação. Ou seja, é um investimento que se paga com o crescimento do restaurante.\n\nVamos ativar o módulo?',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Ter que configurar o módulo fiscal dá muito trabalho',
    contorno:
      'Entendo totalmente essa preocupação, Fernando, e ela é bem comum no início. A boa notícia é que você não precisa enfrentar isso sozinho: nossa equipe de suporte está preparada para te orientar em cada etapa da configuração fiscal. Embora o preenchimento dos dados seja responsabilidade do cliente, justamente para garantir que as informações estejam 100% corretas e evitar qualquer erro no cálculo dos impostos, vamos estar ao seu lado para esclarecer dúvidas e garantir que você se sinta seguro durante todo o processo.',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Já faço as emissões por fora',
    contorno:
      'Entendo, Fernando. O importante é que você já está regular com as emissões. O diferencial de usar o módulo fiscal integrado ao Cardápio Web é justamente ganhar tempo e reduzir retrabalho. Em vez de ter que lançar tudo manualmente depois das vendas, você já faz tudo direto pelo sistema: vende, emite nota e já deixa registrado automaticamente. Isso evita erros, melhora o controle do financeiro e deixa tudo pronto para o contador com poucos cliques.',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Não faço emissões ainda',
    contorno:
      'Então esse é o melhor momento pra já deixar tudo pronto. Quando deixar pra depois, pode sair mais caro e dar mais trabalho, né! rsrs. Com o módulo fiscal, você já organiza tudo e evita dor de cabeça no futuro. Faz sentido aproveitar agora que está começando?',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Consigo controlar isso com minha planilha',
    contorno:
      'Entendo, Fernando. A planilha funciona até certo ponto, mas com o crescimento da operação, ela acaba ficando limitada. Nosso módulo financeiro automatiza o fluxo de entradas e saídas, separa por categoria e facilita o controle sem digitação manual. Vamos testar a nossa solução financeira?',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Não tem DRE?',
    contorno:
      'Entendo, Fernando. Mesmo sem o DRE completo ainda, já entregamos relatórios financeiros que dão visão de lucratividade e ajudam na tomada de decisão. O DRE está no nosso roadmap e será liberado sem custo adicional.',
  },
  {
    categoria: 'Objeção com relação ao produto',
    fase: 'Fase de apresentação',
    titulo: 'Não sei se vou usar porque estou acostumado com a planilha',
    contorno:
      'Eu entendo, Fernando! Mas te trazendo uma visão de especialista. Hoje, você gasta quanto tempo fazendo o gerenciamento manual?\n\nLead: Gasto bastante tempo...\n\nCloser: O que quero te propor aqui, é economizar esse tempo e ter controle total dos seus dados. Eu imagino que você já tenha também perdido dados nesse processo, não é?\n\nLead: Sim, vira e mexe eu perco algum dado.\n\nCloser: O módulo de gestão financeira é totalmente integrado e automatizado. Os lançamentos que você precisar fazer, serão mais ágeis. Você vai conseguir facilitar esse processo. Vamos fechar com a contratação dele?',
  },
  {
    categoria: 'Objeção de dispensa',
    fase: 'Fase de negociação',
    titulo: 'Vou verificar com meu sócio',
    contorno:
      'Closer: Eu entendo, Fernando, faz sentido consultar ele. O que acontece é que muitas pessoas não conseguem passar 100% dos benefícios da ferramenta. Afinal, aqui eu consegui te apresentar o sistema, mas você não vai ter o sistema em mãos para apresentar. Concorda?\n\nFernando: Sim\n\nCloser: O que quero te propor: vamos fechar negócio, você ganha 10 dias de garantia no plano mensal. Teu sócio vai ver na prática de como funciona, e você tem uma garantia. Podemos seguir?\n\nFernando: Vamos seguir',
  },
];

/* ------------------------------------------------------------------ */
/* ETAPAS DA REUNIÃO                                                    */
/* ------------------------------------------------------------------ */

export interface EtapaReuniao {
  topico: string;
  tempo: string;
  detalhes: string;
  avaliacao: string;
  exemplo: string;
  criterios: string;
}

export const CLOSER_ETAPAS_REUNIAO: EtapaReuniao[] = [
  {
    topico: 'Abertura',
    tempo: '2 minutos',
    detalhes: 'Fazer uma abertura se apresentando, trazendo autoridade e rapport.',
    avaliacao:
      'Fez uma abertura se apresentando como especialista;\nGerou rapport encontrando algum ponto em comum ou algum ponto que faça o lead se conectar para além de fechar negócio. Além disso, alinhou as expectativas com relação ao tempo da reunião.',
    exemplo:
      'Closer: Olá, Fernando, como vai? Eu sou o Closer da Cardápio Web, já atendi milhares de deliveries e restaurantes em todo o Brasil. Pelo que vi aqui no seu DDD você é de Fortaleza né? Já vou conhecer teu restaurante esse final de semana, você fica em qual bairro?',
    criterios: 'Autoridade, alinhamento de expectativa e rapport',
  },
  {
    topico: 'Passagem de bastão + S',
    tempo: '3 minutos',
    detalhes: 'Traz contexto com base no que o SDR falou, já entendendo a situação do lead, a fim de ir para o próximo passo.',
    avaliacao:
      'Deve ser falado o que o SDR anotou e finalizar com uma pergunta de situação. Muitas vezes a pergunta de situação não é necessária, por exemplo, quando o SDR já traz um contexto bom. Levar esse contexto pode fazer o Lead concordar e você pode seguir para as perguntas de problema.',
    exemplo:
      'Closer: Fernando, o SDR falou com você anteriormente me passou que hoje você busca uma solução para atender toda a parte do delivery e mesas, e que hoje utiliza um sistema que não te atende, correto?\n\nLead: Isso mesmo, hoje estou com o anota aí\n\nCloser: Entendi, Fernando, me fala mais um pouco da tua operação, além desse ponto do anota aí, você tem garçons, atende de que modo?',
    criterios: 'Passagem de bastão, situação e domínio de mercado',
  },
  {
    topico: 'PI',
    tempo: '4 minutos',
    detalhes: 'Faz uma ou duas perguntas de problema, indo para a pergunta de implicação logo em seguida.',
    avaliacao:
      'Nesta etapa são feitas duas perguntas: uma de problema e uma de implicação.\nNa pergunta de problema deve iniciar a encontrar a dor do lead, e na pergunta de implicação deve-se metrificar o impacto dessa dor.',
    exemplo:
      'Closer: Hoje, Fernando, utilizar um sistema que mais te atrapalha que ajuda pode te gerar algumas perdas. Você sente que o sistema atrapalha o fluxo das operações?\n\nLead: Sim, com certeza!\n\nCloser: E esses problemas já te fizeram perder vendas ou até mesmo dados de vendas? Pensa comigo, se você perde R$ 100,00 na semana com esse tipo de situação, no mês daria já R$ 400,00.\n\nLead: Sim, eu nunca tinha pensado por este lado...',
    criterios: 'Problema, implicação e domínio de mercado',
  },
  {
    topico: 'N + Demonstração',
    tempo: '7 minutos',
    detalhes:
      'As perguntas de necessidade serão validações feitas na apresentação do sistema, com foco na principal dor do lead. E apresentando de forma superficial os módulos extras e validando a necessidade.',
    avaliacao:
      'A demonstração deve ter por foco a dor do lead. Por exemplo: se o problema é aumentar as vendas, deve ser mostradas ferramentas que possuem por objetivo melhorar as vendas, tais como o disparador de mensagens, cupom de desconto e programa de fidelidade.\n\nA cada ciclo de três funcionalidades apresentadas, faça as perguntas de curva de engajamento:\nPergunta N° 1: Resolve seu problema?\nPergunta N° 2: Qual o impacto?\nPergunta N° 3: Como você se imagina usando?',
    exemplo:
      'Closer: Validando contigo, você me falou que seu maior problema é atendimento tanto mesas quanto delivery e o que vai te ajudar a resolver isso realmente vai ser toda a parte de automação. (comece a mostrar o cardápio) Este é o cardápio do delivery bem similar ao de mesas... aqui o lead faz todo o fluxo de pedidos. Dessa forma que estou mostrando, você acredita que resolve seu problema?\n\nLead: Sim, eu acho que sim.\n\nCloser: Qual seria o impacto de ter esse sistema aqui no seu negócio? Daria pra economizar quanto no atendimento?\n\nLead: Cara, com certeza daria pra economizar bastante, precisaria de menos atendentes.',
    criterios: 'Necessidade, demonstração e engajamento do lead',
  },
  {
    topico: 'Tira dúvidas',
    tempo: '4 minutos',
    detalhes: 'Momento de validar alguma dúvida do lead.',
    avaliacao: 'Deve ser feita uma checagem de tira dúvidas com o lead.',
    exemplo: 'Closer: Agora apenas checando contigo, ficou alguma dúvida?',
    criterios: '',
  },
  {
    topico: 'Negociação',
    tempo: '10 minutos',
    detalhes: 'Parte mais importante para a apresentação. Serão apresentados planos e módulos, com objetivo de fazer o lead levar um plano maior e com mais módulos.',
    avaliacao:
      'Deve ser apresentado planos e módulos, bem como calculadora de planos. O objetivo é fazer o lead levar um plano maior (em tempo de contratação) e com mais módulos.',
    exemplo:
      'Closer: Fernando, pelo que entendi, o plano que mais faz sentido para você é o plano delivery anual com o módulo de ifood, estoque avançado e fiscal.',
    criterios: 'Contorno de objeção, fechamento de portas, fechamento e next step',
  },
];

/* ------------------------------------------------------------------ */
/* CRITÉRIOS DE AVALIAÇÃO                                              */
/* ------------------------------------------------------------------ */

export interface CriterioAvaliacao {
  criterio: string;
  descricao: string;
  peso: number;
  isBonus?: boolean;
}

export const CLOSER_CRITERIOS_PRINCIPAIS: CriterioAvaliacao[] = [
  { criterio: 'Autoridade', peso: 6, descricao: 'Como o closer se apresenta e passa uma sensação de segurança. Envolvendo a apresentação de cases de sucesso, parceiros e do próprio Closer como especialista.' },
  { criterio: 'Alinhamento de expectativa', peso: 6, descricao: 'Forma como o Closer apresenta a agenda da reunião e alinha o objetivo principal desse momento, perguntando para o lead se existe algo a mais que ele gostaria de acrescentar.' },
  { criterio: 'Passagem de bastão', peso: 7, descricao: 'Como o closer contextualiza o que foi coletado pelo pré-vendedor e apresenta isso para o lead.' },
  { criterio: 'Rapport', peso: 9, descricao: 'Como o closer cria conexão e deixa o lead a vontade durante a reunião.' },
  { criterio: 'Domínio de mercado', peso: 8, descricao: 'Conhecimento do mercado de delivery e restaurante. Quando o lead citar algo com relação ao mercado, o closer interage apresentando um case ou um dado interessante.' },
  { criterio: 'Situação (S)', peso: 7, descricao: 'O closer entende a situação do cliente, a partir da passagem de bastão bem feita. Uma boa pergunta de situação faz o lead falar bastante do seu negócio e abre brecha para uma pergunta de problema.' },
  { criterio: 'Problema (P)', peso: 8, descricao: 'Uma boa pergunta de problema deve ser feita de modo a identificar o que incomoda o lead, feita de forma estratégica para identificar uma dor que faça o lead querer mudar sua situação.' },
  { criterio: 'Implicação (I)', peso: 9, descricao: 'A pergunta de implicação intensifica o problema. Uma boa implicação ocorre com: quantificação de perda ou ganho; lead fala por pelo menos 30 segundos sobre uma situação ocorrida; ou declaração explícita de querer mudar a situação atual.' },
  { criterio: 'Necessidade (N)', peso: 9, descricao: 'A necessidade é obtida com a demonstração da ferramenta e verificações se resolve o problema citado. O closer deve verificar principalmente nas ferramentas de acordo com o que foi abordado.' },
  { criterio: 'Demonstração do cronograma', peso: 6, descricao: 'Como o cronograma é explicado para o lead, de forma clara e concisa, para que entenda o que acontece depois que ele vira cliente.' },
  { criterio: 'Contorno de objeção', peso: 9, descricao: 'Bons contornos de objeção se baseiam na matriz de objeções e como o closer consegue aplicar as estratégias da matriz durante a reunião.' },
  { criterio: 'Formato de apresentação', peso: 4, descricao: 'O jeito que a tela está sendo apresentada, sem mostrar guias e deixando o lead fixado apenas naquilo que o closer busca apresentar.' },
  { criterio: 'Foco no cliente', peso: 8, descricao: 'Direcionamento da apresentação para focar nas necessidades do cliente: demonstração focada no que foi conversado com o lead e fechamento referenciando informações da negociação.' },
  { criterio: 'Domínio da ferramenta', peso: 10, descricao: 'O quão familiarizado o closer está com a ferramenta e consegue transparecer isso para o lead, além de não repassar informações incorretas.' },
  { criterio: 'Demonstração de produto', peso: 10, descricao: 'Como o closer apresenta a solução com base nas informações coletadas e como engaja o lead durante a apresentação, fazendo as perguntas de curva de engajamento e perguntas de necessidade (verificação).' },
  { criterio: 'Perguntas de fechamento', peso: 8, descricao: 'Ao demonstrar a ferramenta, o closer pergunta ao lead se a solução atende ao que ele precisa e se está disposto a contratar. Em caso negativo, tenta entender e contornar a objeção trazida.' },
  { criterio: 'Cross Sell', peso: 8, descricao: 'Como o Closer cria valor para que o lead tenha interesse em contratar os módulos extras, recomendando ativamente os módulos com argumentação clara.' },
  { criterio: 'Engajamento do lead', peso: 10, descricao: 'Como o closer apresenta a solução com base nas informações coletadas, engajando o lead durante toda a apresentação da solução.' },
  { criterio: 'Comunicação do Closer', peso: 8, descricao: 'Uma boa comunicação é composta por clareza, dicção, didática, expressões, simpatia, oratória, tom de voz, calma e comunicação corporal.' },
  { criterio: 'Fechamento de portas', peso: 9, descricao: 'Como o closer prepara o terreno para realizar o fechamento, sem deixar brechas para o lead jogar objeções.' },
  { criterio: 'Fechamento', peso: 10, descricao: 'Como o Closer apresenta os planos e preços da ferramenta. Um bom fechamento envolve explicações claras dos planos, uso de calculadoras para comparar os valores e planilhas de simulação.' },
  { criterio: 'Next step', peso: 8, descricao: 'Como o closer combina o próximo passo após a reunião com o lead, normalmente através de um retorno sobre a proposta enviada.' },
];

export const CLOSER_CRITERIOS_BONUS: CriterioAvaliacao[] = [
  { criterio: 'Influência na venda de módulos', peso: 7, isBonus: true, descricao: 'O closer contornou uma objeção relacionada ao módulo, ou fez uma oferta sobre o módulo que foi aceita. Teve influência direta na venda do módulo.' },
  { criterio: 'Influência na venda de planos maiores', peso: 7, isBonus: true, descricao: 'O closer contornou uma objeção ou argumentou de modo a convencer o lead a contratar um plano trimestral, semestral ou anual.' },
  { criterio: 'Pagamento na reunião', peso: 7, isBonus: true, descricao: 'Quando o Closer é capaz de fazer o lead pagar durante a própria reunião.' },
  { criterio: 'Comprometimento emocional', peso: 7, isBonus: true, descricao: 'Quando o Closer consegue fazer o lead focar em algo além do negócio: histórias sobre sua vida, cidade, experiências, ou qualquer coisa que crie conexão além da venda.' },
  { criterio: 'Domínio sobre o concorrente', peso: 7, isBonus: true, descricao: 'Domínio sobre o principal concorrente do lead, entendendo os diferenciais e sabendo argumentar de forma precisa.' },
];

/* ------------------------------------------------------------------ */
/* SPIN                                                                 */
/* ------------------------------------------------------------------ */

export interface SpinDialogue {
  speaker: 'closer' | 'lead' | 'intro';
  text: string;
}

export interface SpinExemplo {
  id: number;
  categoria: string;
  dialogues: SpinDialogue[];
}

export const CLOSER_SPIN: SpinExemplo[] = [
  {
    id: 1,
    categoria: 'Automação do atendimento',
    dialogues: [
      { speaker: 'intro', text: 'O (cite o nome do SDR) me informou que hoje você busca um sistema para (cite o que o SDR trouxe que pode instigar o lead a falar mais a respeito do seu negócio) e a partir disso, entenda a situação para gerar as demais perguntas do SPIN.' },
      { speaker: 'closer', text: 'Como funciona o atendimento do seu estabelecimento hoje?' },
      { speaker: 'lead', text: 'Hoje trabalhamos com duas atendentes, mas o volume de pedidos pelo WhatsApp é grande e elas não conseguem dar conta.' },
      { speaker: 'closer', text: 'Entendi. E quando elas não conseguem responder todos os pedidos, o que costuma acontecer?' },
      { speaker: 'lead', text: 'A gente perde pedido. Já aconteceu de cliente mandar mensagem e a gente não ver, aí o cliente vai pedir em outro lugar.' },
      { speaker: 'closer', text: 'E você consegue calcular quanto você perde por mês com isso? Pensando em pedido médio, por exemplo...' },
      { speaker: 'lead', text: 'É difícil saber ao certo, mas deve ser uns R$ 2.000 a R$ 3.000 por mês facilmente.' },
      { speaker: 'closer', text: 'Então, se você tivesse uma solução que atendesse automaticamente pelo WhatsApp 24h, sem perder nenhum pedido, qual seria o impacto disso no seu faturamento?' },
      { speaker: 'lead', text: 'Seria enorme. Daria pra recuperar bastante desse valor perdido.' },
    ],
  },
  {
    id: 2,
    categoria: 'Aumento de vendas',
    dialogues: [
      { speaker: 'closer', text: 'Então Fernando, hoje você está com um gestor de tráfego que indicou a gente. Me conta uma coisa, como atualmente vocês andam captando clientes?' },
      { speaker: 'lead', text: 'Hoje utilizamos um Cardápio do anota aí. Mas meu gestor comentou que para os dados não é tão interessante.' },
      { speaker: 'closer', text: 'Entendi, Fernando! Seu gestor sabe do que tá falando. Cara, hoje você investe no cardápio e no gestor de tráfego, correto?' },
      { speaker: 'lead', text: 'Correto, faço esses dois investimentos.' },
      { speaker: 'closer', text: 'E seu gestor te apontou que você não tem tantos dados de vendas e clientes. Como vocês conseguem saber se as campanhas estão valendo a pena?' },
      { speaker: 'lead', text: 'É, hoje não temos essa noção.' },
      { speaker: 'closer', text: 'Você entende que pode estar deixando dinheiro na mesa?' },
      { speaker: 'lead', text: 'Como assim?' },
      { speaker: 'closer', text: 'Se você calcular quanto gasta com sistema + gestor de tráfego e não consegue medir o retorno, às vezes você tem cliente que compraria mais, produtos que poderiam vender mais… mas como você não enxerga isso, acaba não aproveitando essas oportunidades. Se você fosse chutar hoje, acha que tá perdendo pouco ou uma grana relevante com isso?' },
      { speaker: 'lead', text: 'Acho que uma grana relevante…' },
      { speaker: 'closer', text: 'Pois é. Agora imagina ter um sistema que te mostra exatamente isso: quem compra, quanto compra e o que mais dá resultado… Que diferença faria pra você conseguir tomar decisão com base nisso?' },
      { speaker: 'lead', text: 'Acho que melhoraria meu resultado… e eu teria mais controle.' },
    ],
  },
  {
    id: 3,
    categoria: 'Gestão',
    dialogues: [
      { speaker: 'closer', text: 'Fernando, deixa eu te entender melhor… hoje como você controla suas vendas e seus clientes?' },
      { speaker: 'lead', text: 'Hoje a gente usa o cardápio do Anota Aí.' },
      { speaker: 'closer', text: 'Boa. E com ele você consegue ver, por exemplo, quem são seus melhores clientes, quanto cada um compra ou o que mais sai no seu negócio?' },
      { speaker: 'lead', text: 'Não muito…' },
      { speaker: 'closer', text: 'Entendi. Então hoje você vende, mas não tem muita clareza do que tá funcionando melhor no seu negócio, certo?' },
      { speaker: 'lead', text: 'É, basicamente isso.' },
      { speaker: 'closer', text: 'E me diz uma coisa — sem essa visão, como você decide o que manter, o que melhorar ou até o que parar de fazer?' },
      { speaker: 'lead', text: 'É… meio no feeling.' },
      { speaker: 'closer', text: 'Justo. Só que aí mora um risco… Se você não tem esses dados, pode estar deixando dinheiro na mesa sem nem perceber.' },
      { speaker: 'lead', text: 'Como assim?' },
      { speaker: 'closer', text: 'Às vezes você tem cliente que compraria mais, produtos que poderiam vender mais… mas como você não enxerga isso, acaba não aproveitando essas oportunidades. Que diferença faria ter essa visão completa do seu negócio?' },
      { speaker: 'lead', text: 'Acho que melhoraria meu resultado… e eu teria mais controle.' },
    ],
  },
  {
    id: 4,
    categoria: 'Automação do atendimento',
    dialogues: [
      { speaker: 'closer', text: 'Hoje você tem quantos cardápios para cada mesa no presencial?' },
      { speaker: 'lead', text: 'Tenho uns 15 cardápios físicos distribuídos nas mesas.' },
      { speaker: 'closer', text: 'E você sente alguma dificuldade em trabalhar com cardápios físicos? Atualização de preço, ficar rotacionando cardápio nas mesas...' },
      { speaker: 'lead', text: 'Sim, toda vez que mudo um preço tenho que reimprimir tudo.' },
      { speaker: 'closer', text: 'Você concorda que isso gera um custo e uma demora que poderiam ser evitados?' },
      { speaker: 'lead', text: 'Com certeza, é bem trabalhoso.' },
      { speaker: 'closer', text: 'E além disso, com o nosso programa de fidelidade, você ainda consegue aumentar a retenção do seu cliente dentro da sua empresa, quanto mais tempo seu cliente fica com você, mais longevidade tem o seu negócio e, obviamente, mais dinheiro no seu bolso! Você concorda comigo?' },
      { speaker: 'lead', text: 'Com certeza, faz muito sentido!' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* PROGRESSÃO DE CARREIRA                                              */
/* ------------------------------------------------------------------ */

export interface NivelCarreira {
  nome: string;
  tempo: string;
  cor: string;
}

export const CLOSER_PROGRESSAO: NivelCarreira[] = [
  { nome: 'Júnior 1', tempo: '—', cor: 'bg-cw-surface text-cw-muted' },
  { nome: 'Júnior 2', tempo: '4 meses', cor: 'bg-cw-surface text-cw-muted' },
  { nome: 'Júnior 3', tempo: '7 meses', cor: 'bg-cw-surface text-cw-muted' },
  { nome: 'Pleno 1', tempo: '10 meses', cor: 'bg-cw-purple/10 text-cw-purple' },
  { nome: 'Pleno 2', tempo: '13 meses', cor: 'bg-cw-purple/10 text-cw-purple' },
  { nome: 'Pleno 3', tempo: '16 meses', cor: 'bg-cw-purple/10 text-cw-purple' },
  { nome: 'Sênior 1', tempo: '19 meses', cor: 'bg-cw-yellow/15 text-cw-yellow' },
  { nome: 'Sênior 2', tempo: '22 meses', cor: 'bg-cw-yellow/15 text-cw-yellow' },
  { nome: 'Sênior 3', tempo: '25 meses', cor: 'bg-cw-yellow/15 text-cw-yellow' },
];

/* ------------------------------------------------------------------ */
/* FOLLOW-UP                                                            */
/* ------------------------------------------------------------------ */

export interface FollowUpVersion {
  label: string;
  kommoTag: string;
  template: string;
}

export interface FollowUpStep {
  step: number;
  titulo: string;
  descricao: string;
  etapa?: string;
  versions: FollowUpVersion[];
}

export const CLOSER_FOLLOWUP_VIDEO: FollowUpStep[] = [
  {
    step: 1,
    titulo: 'Champion Letter',
    descricao: 'Alinhamento de expectativas (depois da reunião). Envie esse prompt para o ChatGPT, atualize com as informações coletadas na reunião e envie no WhatsApp.',
    versions: [
      {
        label: 'Sem envio da proposta junto',
        kommoTag: '',
        template:
          'Pilar mais importante: automação de atendimento\n\nProblema: Atendimento no whatsapp travado\n\nImplicação: Perda de vendas por causa do whatsapp lotado\n\nPrazo para retorno sobre a proposta apresentada: [DATA]\n\nNecessidades do lead: cardápio digital, chatbot, ferramentas de cupons no sistema, disparador de whatsapp\n\nSuponha que você é um Closer de uma empresa chamada Cardápio Web e você precisa criar um texto bem feito e de fácil compreensão com base nos tópicos acima para ser enviado após uma reunião com um lead. O texto deve ter um caráter de resumo do que foi conversado nessa reunião e deve incluir um próximo passo que deixe claro para o lead que o Closer vai acompanhá-lo até ele tomar uma decisão, esse acompanhamento vai acontecer por WhatsApp, ligação e email até que o lead esteja seguro sobre sua decisão. Também precisamos ressaltar no email o prazo determinado alinhado com o lead para um retorno sobre a proposta que foi apresentada durante a reunião.',
      },
      {
        label: 'Com envio da proposta junto',
        kommoTag: '',
        template:
          'Pilar mais importante: automação de atendimento\n\nProblema: Atendimento no whatsapp travado\n\nImplicação: Perda de vendas por causa do whatsapp lotado\n\nPrazo para retorno sobre a proposta apresentada: [DATA]\n\nNecessidades do lead: cardápio digital, chatbot, ferramentas de cupons no sistema, disparador de whatsapp\n\nSuponha que você é um Closer de uma empresa chamada Cardápio Web e você precisa criar um texto bem feito e de fácil compreensão com base nos tópicos acima para ser enviado após uma reunião com um lead. O texto deve ter um caráter de resumo do que foi conversado nessa reunião, com a proposta em anexo, e deve incluir um próximo passo claro.',
      },
    ],
  },
  {
    step: 2,
    titulo: 'Data anterior à data prometida do retorno',
    descricao: 'Lead ficou de dar um retorno sobre a proposta depois da reunião ou ficou responsável por passar os detalhes para construir a proposta, você já enviou a champion letter. Envie um dia antes da data combinada de retorno.',
    versions: [
      {
        label: 'Exemplo 1',
        kommoTag: '[CLO][FUP 2] Mensagem de lembrete',
        template: 'Olá, Fernando! Como vai?\n\nAqui é o CLOSER da Cardápio Web. Combinamos de falar amanhã sobre a contratação, que horas posso falar com você?',
      },
      {
        label: 'Exemplo 2 (data distante)',
        kommoTag: '[CLO][FUP 2] Mensagem de lembrete',
        template: 'Olá, Fernando! Como vai? Aqui é o CLOSER da Cardápio Web. Tudo certo com a data que combinamos para o retorno?',
      },
    ],
  },
  {
    step: 3,
    titulo: 'Data combinada de retorno',
    descricao: 'Ligue e mande uma mensagem no dia combinado com o lead.',
    versions: [
      {
        label: 'Generalista',
        kommoTag: '[CLO][FUP 3] Dia do retorno',
        template: 'Fala, Fernando! Sou o CLOSER da Cardápio Web. Combinamos de nos falar hoje, você tá podendo agora?',
      },
    ],
  },
  {
    step: 4,
    titulo: 'Prova Social + Consistência',
    descricao: 'Caso o lead não tenha dado retorno na data combinada. Mande uma mensagem de educação para o lead com foco no nicho que ele demonstrou interesse.',
    versions: [
      {
        label: 'Automação de atendimento',
        kommoTag: '[CLO] Prova Social / Automação',
        template:
          'Oi, [nome]! Tudo bem?\n\nTava pensando na conversa que a gente teve e lembrei que eu não te mandei um exemplo de alguém que usou nosso sistema focado na parte de automação de atendimento.\n\nA Renata, por exemplo, encontrou na Cardápio Web uma solução para melhorar a gestão da operação dela. Vou deixar o depoimento aqui embaixo para você dar uma olhada:\n\nhttps://www.youtube.com/watch?v=Nx3E2S8UHBE\n\nPela minha experiência, a gente consegue fazer algo parecido para o seu negócio! Você conseguiu dar uma olhada na proposta que enviei?',
      },
      {
        label: 'Aumento de vendas',
        kommoTag: '[CLO] prova social - aumento de vendas',
        template: 'Oi, [nome]! Tudo bem?\n\nTava pensando na nossa conversa e lembrei de um cliente que também estava buscando aumentar as vendas com um sistema integrado. O resultado foi incrível!\n\nVou deixar o depoimento aqui embaixo:\n\nhttps://www.youtube.com/watch?v=Nx3E2S8UHBE\n\nVocê conseguiu dar uma olhada na proposta?',
      },
      {
        label: 'Gestão',
        kommoTag: '[CLO] Prova social / gestão',
        template: 'Oi, [nome]! Tudo bem?\n\nTava pensando na nossa conversa e lembrei de um case de gestão que acho que vai fazer sentido pra você. Deixa eu te mostrar o que a Cardápio Web fez por esse cliente:\n\nhttps://www.youtube.com/watch?v=Nx3E2S8UHBE\n\nVocê conseguiu dar uma olhada na proposta?',
      },
    ],
  },
  {
    step: 5,
    titulo: 'Prova Social + Consistência',
    descricao:
      '1 — Vídeo do Youtube (ou artigo) para alimentar o desejo do lead (prova social focada no nicho do lead)\n2 — Lembrar o lead sobre o momento que deixou claro para o retorno sobre a parceria/próximo passo.\n3 — Para casos que o lead não te deu o retorno como prometido.',
    versions: [
      {
        label: 'Automação de atendimento',
        kommoTag: '[CLO] Prova Social / Automação',
        template:
          'Oi, [nome]! Tudo bem?\n\nTava pensando na conversa que a gente teve e lembrei que eu não te mandei um exemplo de alguém que usou nosso sistema focado na parte de automação de atendimento.\n\nA Renata, por exemplo, encontrou na Cardápio Web uma solução para melhorar a gestão da operação dela. Vou deixar o depoimento aqui embaixo para você dar uma olhada:\n\nhttps://www.youtube.com/watch?v=Nx3E2S8UHBE\n\nPela minha experiência, a gente consegue fazer algo parecido para o seu negócio! Você conseguiu dar uma olhada na proposta que enviei?',
      },
      {
        label: 'Aumento de vendas',
        kommoTag: '[CLO] prova social - aumento de vendas',
        template: 'Oi, [nome]! Tudo bem?\n\nTava pensando na nossa conversa e lembrei de um cliente que também estava buscando aumentar as vendas com um sistema integrado. O resultado foi incrível!\n\nVou deixar o depoimento aqui embaixo:\n\nhttps://www.youtube.com/watch?v=Nx3E2S8UHBE\n\nVocê conseguiu dar uma olhada na proposta?',
      },
      {
        label: 'Gestão',
        kommoTag: '[CLO] Prova social / gestão',
        template: 'Oi, [nome]! Tudo bem?\n\nTava pensando na nossa conversa e lembrei de um case de gestão que acho que vai fazer sentido pra você:\n\nhttps://www.youtube.com/watch?v=Nx3E2S8UHBE\n\nVocê conseguiu dar uma olhada na proposta?',
      },
    ],
  },
  {
    step: 6,
    titulo: 'Chamado para ação',
    descricao:
      '1 — Você dá a liberdade para o lead dizer não para você naquele momento, e está tudo bem.\n2 — Use um gatilho de escassez para trazer aquele lead de volta à vida.',
    versions: [
      {
        label: 'Retomada',
        kommoTag: '[CLO][FUP 5] Mensagem de retomada',
        template:
          'Olá, Fernando! Aqui é o CLOSER, da Cardápio Web.\n\nAinda não tive um retorno nos últimos dias. Gostaria de saber se conseguiremos seguir com a contratação, ou se deseja me passar uma data que fica melhor para você?',
      },
      {
        label: 'Financeiro',
        kommoTag: '[CLO][FUP 5.1] Financeiro',
        template:
          'Oi, Fernando! Tudo bem? Sou eu, o CLOSER, da Cardápio Web.\nEm nosso último contato, você comentou que precisava organizar algumas questões financeiras antes de avançarmos. Gostaria de saber se já conseguiu resolver e se faz sentido a gente seguir com o próximo passo?',
      },
      {
        label: 'Sócio',
        kommoTag: '[CLO][FUP 5.2] Sócio',
        template:
          'Oi, Fernando! Tudo bem? Sou eu, o CLOSER, da Cardápio Web.\nNa nossa última conversa você comentou que precisava falar com seu sócio antes de avançar. Ele já teve a chance de ver? O que ele achou?',
      },
      {
        label: 'Cartão',
        kommoTag: '[CLO][FUP 5.3] Cartão',
        template:
          'Oi, Fernando! Tudo bem? Sou eu, o CLOSER, da Cardápio Web.\nNa nossa última conversa você comentou que estava organizando o cartão para finalizar. Conseguiu resolver? Posso te ajudar a concluir agora?',
      },
    ],
  },
  {
    step: 7,
    titulo: 'Perdemos você? (pré break-up)',
    descricao: 'Caso o lead não responda as mensagens anteriores, enviar uma mensagem para saber se é o momento certo para a nossa solução.',
    versions: [
      {
        label: 'Generalista',
        kommoTag: '[CLO][FUP 6] Pré break-up',
        template:
          'Olá, Fernando! Aqui é o CLOSER da Cardápio Web.\n\nTentei te contatar algumas vezes nos últimos dias e não consegui retorno. Quero entender se esse é o momento certo pra gente avançar, ou se prefere deixar para um outro momento. Pode me dar um retorno?',
      },
    ],
  },
  {
    step: 8,
    titulo: 'Break up',
    descricao: 'Faça a última ligação e mande a mensagem para o lead, não dê perdido imediatamente, há um próximo passo antes de perder o lead.',
    versions: [
      {
        label: 'Generalista',
        kommoTag: '[CLO][FUP 7] Break-up',
        template:
          'Olá, Fernando! Aqui é o CLOSER da Cardápio Web.\n\nComo não consegui retorno, vou encerrar o acompanhamento por enquanto. Se em algum momento fizer sentido retomar, pode me chamar! Estarei disponível.',
      },
    ],
  },
  {
    step: 9,
    titulo: 'Consistência + Educação',
    descricao: 'Caso o lead não tenha respondido o break up, enviar uma mensagem mostrando ao lead que ele não cumpriu o que prometeu, com algum conteúdo que possa fazer ele retomar.',
    versions: [
      {
        label: 'Automação de atendimento',
        kommoTag: '[CLO] Consistência + Educação / Automação do atendimento',
        template:
          'Olá, Fernando! Passando para deixar um conteúdo que pode ser útil para o seu negócio, mesmo que a gente não esteja mais em contato ativo no momento.\n\nEsse vídeo mostra como restaurantes estão usando automação de atendimento para não perder pedidos:\n\nhttps://www.youtube.com/watch?v=Nx3E2S8UHBE\n\nQualquer coisa, pode me chamar!',
      },
      {
        label: 'Aumento de vendas',
        kommoTag: '[CLO] Consistência + Educação / Aumento de vendas',
        template:
          'Olá, Fernando! Passando para deixar um conteúdo sobre estratégias de aumento de vendas para restaurantes. Mesmo que não seja o momento agora, espero que ajude!\n\nhttps://www.youtube.com/watch?v=Nx3E2S8UHBE\n\nQualquer coisa, pode me chamar!',
      },
      {
        label: 'Gestão',
        kommoTag: '[CLO] Consistência + Educação / Gestão',
        template:
          'Olá, Fernando! Passando para deixar um conteúdo sobre gestão de restaurantes. Mesmo que não seja o momento agora, espero que ajude!\n\nhttps://www.youtube.com/watch?v=Nx3E2S8UHBE\n\nQualquer coisa, pode me chamar!',
      },
    ],
  },
];

export const CLOSER_FOLLOWUP_EXCLUSIVOS: FollowUpStep[] = [
  {
    step: 1,
    titulo: 'Recepção do lead',
    descricao: 'Alinhamento de planos e módulos extras, confirme todas as informações necessárias.',
    etapa: 'Conexão',
    versions: [
      {
        label: 'Planos',
        kommoTag: '[CLO][CONFIRMAÇÃO] Planos',
        template:
          'Olá, Fernando! Tudo bem? Sou CLOSER.\n\nFico feliz que você deseja contratar a Cardápio Web.\nPara agilizar o processo, vou te enviar abaixo os planos disponíveis\n\n📌 Plano Mesas (destinado para quem atende apenas em salão)\n• Mensal: R$ 169,99\n• Trimestral: R$ 479,97 (R$ 159,99/mês)\n• Semestral: R$ 899,94 (R$ 149,99/mês)\n• Anual: R$ 1.679,88 (R$ 139,99/mês)\n\n📌 Plano Delivery (destinado para quem atende em delivery e balcão)\n• Mensal: R$ 209,99\n• Trimestral: R$ 599,97 (R$ 199,99/mês)\n• Semestral: R$ 1.139,94 (R$ 189,99/mês)\n• Anual: R$ 2.159,88 (R$ 179,99/mês)\n\n📌 Plano Premium (destinado para quem atende em delivery, salão e balcão)\n• Mensal: R$ 269,99\n• Trimestral: R$ 779,97 (R$ 259,99/mês)\n• Semestral: R$ 1.499,94 (R$ 249,99/mês)\n• Anual: R$ 2.879,88 (R$ 239,99/mês)\n\nTemos também alguns módulos extras, ficou alguma dúvida?',
      },
      {
        label: 'Módulos',
        kommoTag: '[CLO][CONFIRMAÇÃO] Módulos',
        template:
          'Abaixo seguem os módulos extras disponíveis:\n\n📌 Módulo iFood\n• Mensal: R$ 49,99/mês\n• Trimestral: R$ 149,97 (R$ 49,99/mês)\n• Semestral: R$ 299,94 (R$ 49,99/mês)\n• Anual: R$ 599,88 (R$ 49,99/mês)\n\n📌 Módulo Estoque Avançado\n• Mensal: R$ 29,99/mês\n• Anual: R$ 359,88 (R$ 29,99/mês)\n\n📌 Módulo Cupom Fiscal\n• Mensal: R$ 69,99/mês\n• Anual: R$ 839,88 (R$ 69,99/mês)\n\n📌 Módulo Entregadores\n• Mensal: R$ 54,99/mês\n• Anual: R$ 659,88 (R$ 54,99/mês)\n\n📌 Módulo Financeiro\n• Mensal: R$ 69,99/mês\n• Anual: R$ 839,88 (R$ 69,99/mês)\n\nFicou alguma dúvida sobre os planos e módulos?',
      },
      {
        label: 'Confirmação Delivery',
        kommoTag: '[CLO] Confirmação / delivery',
        template:
          'Olha, Fernando, abaixo vou te explicar o que vem no plano delivery:\nVocê tem um cardápio web que funciona tanto para delivery, balcão e visualização, adição manual de pedidos, sistema de caixa, controle de estoque, gestão de clientes, histórico de pedidos e relatórios. Além disso, já inclui Chatbot de WhatsApp, WhatsFácil e integrações com Google Analytics.',
      },
      {
        label: 'Confirmação Mesas',
        kommoTag: '[CLO] Confirmação / mesas',
        template:
          'Olha, Fernando, abaixo vou te explicar o que vem no plano mesas:\nVocê tem um cardápio web para visualização e balcão, cardápio para mesas com possibilidade de pedidos, controle de mesas e garçons, sistema de caixa, gestão de clientes e histórico de pedidos.',
      },
      {
        label: 'Confirmação Premium',
        kommoTag: '[CLO] Confirmação / premium',
        template:
          'Olha, Fernando, abaixo vou te explicar o que vem no plano premium:\nEle une delivery, balcão e mesas em um único sistema. Você tem cardápio web para delivery e balcão, cardápio para mesas com pedidos, controle de mesas, garçons e caixa, tudo integrado. O plano já inclui chatbot de WhatsApp e WhatsFácil, gestão de clientes, cupons e programa de fidelidade.',
      },
    ],
  },
  {
    step: 2,
    titulo: 'Chamada de atenção',
    descricao: 'Envie essa mensagem caso o lead tenha sumido.',
    etapa: 'Negociação, Pré-finalização ou Finalização',
    versions: [
      {
        label: 'Generalista',
        kommoTag: '[CLO][FUP 2][DIR] Você ainda está aí?',
        template: 'Oi, Fernando! Tudo bem? Sou o CLOSER da Cardápio Web.\n\nPassando para verificar se você ainda tem interesse em avançar com a nossa solução. Pode me dar um retorno?',
      },
    ],
  },
  {
    step: 3,
    titulo: 'Combinando um próximo passo',
    descricao: 'Caso o lead tenha sumido, faça uma oferta de vídeo chamada.',
    versions: [
      {
        label: 'Generalista',
        kommoTag: '[CLO][FUP 3][DIR] Vamos agendar uma reunião?',
        template:
          'Oi, Fernando! Sou o CLOSER da Cardápio Web.\n\nQue tal a gente marcar uma reunião rápida de 15 minutos para eu te mostrar o sistema na prática e tirar todas as suas dúvidas? Posso te passar o link agora mesmo!',
      },
    ],
  },
  {
    step: 4,
    titulo: 'Prova Social + Consistência',
    descricao: 'Mande uma mensagem de educação para o lead. Decida o envio de acordo com as necessidades que ele demonstrou durante o contato.',
    versions: [
      {
        label: 'Automação de atendimento',
        kommoTag: '[CLO] Prova Social / Automação',
        template:
          'Oi, [nome]! Tudo bem?\n\nTava pensando na conversa que a gente teve e lembrei de um exemplo de alguém que usou nosso sistema focado em automação de atendimento.\n\nhttps://www.youtube.com/watch?v=Nx3E2S8UHBE\n\nPela minha experiência, conseguimos fazer algo parecido para o seu negócio! Você conseguiu olhar nossa proposta?',
      },
      {
        label: 'Aumento de vendas',
        kommoTag: '[CLO] prova social - aumento de vendas',
        template:
          'Oi, [nome]! Tudo bem?\n\nTava pensando na nossa conversa e lembrei de um cliente que também queria aumentar as vendas. O resultado foi incrível!\n\nhttps://www.youtube.com/watch?v=Nx3E2S8UHBE\n\nVocê conseguiu olhar nossa proposta?',
      },
      {
        label: 'Gestão',
        kommoTag: '[CLO] Prova social / gestão',
        template:
          'Oi, [nome]! Tudo bem?\n\nTava pensando na nossa conversa e lembrei de um case de gestão que acho que vai fazer sentido pra você:\n\nhttps://www.youtube.com/watch?v=Nx3E2S8UHBE\n\nVocê conseguiu olhar nossa proposta?',
      },
    ],
  },
  {
    step: 5,
    titulo: 'Chamado para ação',
    descricao:
      '1 — Você dá a liberdade para o lead dizer não.\n2 — Use um gatilho de escassez para trazer aquele lead de volta à vida.',
    etapa: 'Negociação, Pré-finalização, Finalização ou Negócio Fechado',
    versions: [
      {
        label: 'Retomada',
        kommoTag: '[CLO][FUP 5] Mensagem de retomada',
        template:
          'Olá, Fernando! Aqui é o CLOSER, da Cardápio Web.\n\nAinda não tive um retorno nos últimos dias. Gostaria de saber se conseguiremos seguir com a contratação, ou se deseja me passar uma data que fica melhor para você?',
      },
      {
        label: 'Financeiro',
        kommoTag: '[CLO][FUP 5.1] Financeiro',
        template:
          'Oi, Fernando! Tudo bem? Sou eu, o CLOSER, da Cardápio Web.\nVocê comentou que precisava organizar questões financeiras antes de avançar. Conseguiu resolver?',
      },
      {
        label: 'Sócio',
        kommoTag: '[CLO][FUP 5.2] Sócio',
        template:
          'Oi, Fernando! Tudo bem? Sou eu, o CLOSER, da Cardápio Web.\nVocê comentou que precisava falar com seu sócio. Ele já teve a chance de ver? O que ele achou?',
      },
      {
        label: 'Cartão',
        kommoTag: '[CLO][FUP 5.3] Cartão',
        template:
          'Oi, Fernando! Tudo bem? Sou eu, o CLOSER, da Cardápio Web.\nVocê estava organizando o cartão para finalizar. Conseguiu resolver?',
      },
    ],
  },
  {
    step: 6,
    titulo: 'Perdemos você? (break up)',
    descricao: 'Caso o lead não responda as mensagens anteriores, enviar uma mensagem para saber se é o momento certo.',
    etapa: 'Negociação, Pré-finalização, Finalização ou Negócio Fechado',
    versions: [
      {
        label: 'Generalista',
        kommoTag: '[CLO][FUP 6] Pré break-up',
        template:
          'Olá, Fernando! Aqui é o CLOSER da Cardápio Web.\n\nTentei te contatar algumas vezes e não consegui retorno. Quero entender se esse é o momento certo pra gente avançar. Pode me dar um retorno?',
      },
    ],
  },
  {
    step: 7,
    titulo: 'Break up',
    descricao: 'Faça a última ligação e mande a mensagem para o lead.',
    etapa: 'Negociação, Pré-finalização, Finalização ou Negócio Fechado',
    versions: [
      {
        label: 'Generalista',
        kommoTag: '[CLO][FUP 7] Break-up',
        template:
          'Olá, Fernando! Aqui é o CLOSER da Cardápio Web.\n\nComo não consegui retorno, vou encerrar o acompanhamento por enquanto. Se em algum momento fizer sentido retomar, pode me chamar!',
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* FUNIS DE VENDAS                                                      */
/* ------------------------------------------------------------------ */

export interface FunilEtapa {
  id: number;
  nome: string;
  descricao: string;
  importante: string;
  acoes: string;
}

export const CLOSER_FUNIS: FunilEtapa[] = [
  {
    id: 1,
    nome: 'Reunião marcada',
    descricao: 'Nesta etapa, o lead já teve sua reunião agendada pelo SDR/BDR. Ao realizar o agendamento pelo Meetime, o card é criado automaticamente nesta etapa do funil.',
    importante: 'O lead deve vir com a atividade de reunião.',
    acoes: 'Conferir os horários das reuniões e se há algum erro na agenda. Se for lead de whatsapp, mover para conexão e criar uma atividade de feedback até ter um contato com o lead para responder a esse feedback.',
  },
  {
    id: 2,
    nome: 'Conexão',
    descricao: 'Etapa destinada aos leads que já confirmaram a reunião com o closer e estão no momento de conexão inicial, antes da realização da reunião.',
    importante: 'Confirmar que o lead recebeu o link da reunião e verificar se vai comparecer. Para leads de WhatsApp, garantir o contato inicial e criar atividade de follow-up.',
    acoes: 'Conferir se o lead vai participar da reunião ou seguir com a contratação para os casos de whatsapp.',
  },
  {
    id: 3,
    nome: 'Negociação',
    descricao: 'Nesta terceira etapa ficam os leads que estão em reunião com o closer ou cuja reunião ainda não foi totalmente encerrada, sem definição de plano ou prazo.',
    importante: 'Verificar se o feedback de oportunidade foi respondido após a reunião e mover o lead para a etapa correta de acordo com o resultado da reunião.',
    acoes: 'Verificar se o feedback foi respondido e seguir com o follow-up.',
  },
  {
    id: 4,
    nome: 'Pré-finalização',
    descricao: 'Na etapa de Pré-Finalização ficam os leads que já passaram por todas as etapas da reunião, possuem o plano definido, mas ainda não estabeleceram um prazo para decisão. A proposta ainda não foi enviada, pois é encaminhada apenas quando o lead tem certeza da contratação.',
    importante: 'Definir e registrar o plano e módulos combinados durante a reunião. Criar proposta apenas quando o lead confirmar interesse, evitando envio precipitado.',
    acoes: 'Seguir a frequência de feedback.',
  },
  {
    id: 5,
    nome: 'Finalização',
    descricao: 'Lead recebeu a proposta do plano escolhido e enviou os dados para a conta ser criada. Ou apenas está com a proposta e data para criação da conta agendada.',
    importante: 'O lead deve estar com a proposta em mãos, e deve haver um valor atribuído ao seu card como consequência.',
    acoes: 'Criar a proposta e fazer uma segunda verificação de feedback de oportunidade.',
  },
  {
    id: 6,
    nome: 'Negócio Fechado',
    descricao: 'Conta foi criada e lead está com o link de pagamento.',
    importante: 'Verificar todos os dados pois o lead vai para o time de implementação.',
    acoes: 'Dar ganho no lead.',
  },
];

/* ------------------------------------------------------------------ */
/* HORA OURO                                                            */
/* ------------------------------------------------------------------ */

export interface HoraOuroGrupo {
  grupo: string;
  items: string[];
}

export const CLOSER_HORA_OURO_DEF =
  'A "Hora de Ouro" (Golden Hour), conceito do livro Prospecção Fanática de Jeb Blount, refere-se ao período comercial de maior produtividade, dedicado exclusivamente a atividades de alto impacto — especialmente follow-ups — com foco total e sem distrações.\n\nDentro do time de closers, a hora ouro pode variar a depender do objetivo: foco em ligações ou mensagens. O time é dividido em grupos que fazem reuniões por diferentes durações, o que exige adaptar a hora ouro para cada perfil.';

export const CLOSER_HORA_OURO_ROTINA: HoraOuroGrupo[] = [
  {
    grupo: 'Closers com reunião de 30 minutos',
    items: [
      '9:00 - 9:30 — Preencher planilha e responder às mensagens de leads do dia anterior',
      '9:30 - 11:00 — Rotina geral de reuniões/treinamento',
      '11:00 - 11:30 — Hora ouro de ligações',
      '11:30 - 12:00 — Rotina geral de reuniões/treinamento',
      '13:00 - 13:30 — Roleplay/cumbuca/call review',
      '13:30 - 15:00 — Rotina geral de reuniões/treinamento',
      '15:00 - 15:45 — Hora ouro geral',
      '15:45 - 16:45 — Rotina geral de reuniões/treinamento',
      '16:45 - 17:15 — Hora ouro geral e foco em responder feedbacks não respondidos',
      '17:15 - 18:45 — Rotina geral de reuniões/treinamento',
    ],
  },
  {
    grupo: 'Closers com reunião de 45 minutos',
    items: [
      '9:00 - 9:15 — Preencher planilha',
      '9:15 - 12:00 — Rotina geral de reuniões/treinamento',
      '13:00 - 13:30 — Roleplay/cumbuca/call review',
      '13:30 - 15:00 — Rotina geral de reuniões/treinamento',
      '15:00 - 15:45 — Hora ouro geral (foco em ligações)',
      '15:45 - 18:45 — Rotina geral de reuniões/treinamento',
    ],
  },
];

export const CLOSER_HORA_OURO_PRATICAS: string[] = [
  'Todos os leads da etapa de negócio fechado devem receber contato todos os dias. Os leads em pré-finalização devem receber contato, no máximo, a cada dois dias.',
  'A hora ouro de ligação deve ser focada em realizar essas ligações.',
  'Você pode editar ou reagendar atividades de mensagem quando necessário, mas não deve substituir uma atividade de ligação por uma mensagem.',
  'Caso finalize o dia sem concluir todas as atividades planejadas, elas deverão ser realizadas no dia seguinte, priorizando que não fiquem atrasadas.',
  'O relatório de ligações está disponível no Pipedrive — acompanhe e preencha a planilha diariamente.',
  'Realize pelo menos 2 ligações para o lead; caso não atenda, envie uma mensagem.',
  'Revisar o histórico do lead antes de ligar.',
  'Registrar imediatamente o resultado da ligação.',
];

export const CLOSER_HORA_OURO_CRM: string[] = [
  'Abrir Pipedrive para iniciar atualização.',
  'Inicie pelos funis onde ficam os leads mais quentes: da esquerda (a partir do negócio fechado) para a direita.',
  'Passe o mouse pelo ícone "ver próxima atividade".',
  'Faça a atividade indicada.',
  'Clique no ícone "ver próxima atividade" e marque como feita.',
  'Crie a próxima atividade de acordo com o que foi realizado.',
  'Caso o lead dê um retorno, faça a atualização.',
];

export const CLOSER_HORA_OURO_CRM_OBS =
  'Essa atualização é importante e definitiva para os próximos passos do próprio closer ou de outro closer que venha atender o lead.';

/* ------------------------------------------------------------------ */
/* CONCORRENTES                                                         */
/* ------------------------------------------------------------------ */

export type ConcorrenteValor = 'yes' | 'no' | 'partial';

export interface ConcorrenteFeature {
  nome: string;
  valores: ConcorrenteValor[];
}

export interface ConcorrenteCategoria {
  categoria: string;
  features: ConcorrenteFeature[];
}

export const CLOSER_CONCORRENTES_HEADERS: string[] = [
  'Cardápio Web', 'Anota ai', 'Brendi', 'Saipos', 'Instadelivery', 'Consumer (Menu Dino)',
  'Goomer', 'Yooga', 'OlaClick', 'WhatsMenu', 'Multipedidos', 'Delivery Direto',
  'Linx', 'Neemo', 'Alloy', 'Accon', 'Takeat', 'EasyAssist', 'BigDim', 'Ecta',
  'Suitable', 'BeeFood', 'Cardápio Ai', 'Omie', 'GrandChef', 'Jotajá', 'Sischef', 'Deli',
];

export const CLOSER_CONCORRENTES: ConcorrenteCategoria[] = [
  {
    categoria: 'Automação de Atendimento',
    features: [
      { nome: 'Cardápio digital para delivery', valores: ['yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','no','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','partial','yes'] },
      { nome: 'Cardápio digital para mesas', valores: ['yes','yes','no','yes','yes','yes','yes','partial','yes','yes','partial','yes','no','yes','yes','no','yes','yes','yes','yes','yes','yes','yes','yes','yes','no','partial','partial'] },
      { nome: 'ChatBot de WhatsApp', valores: ['yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','partial','partial','no','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','no','partial','yes','no','yes'] },
      { nome: 'Pagamento Online', valores: ['yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','no','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes'] },
    ],
  },
  {
    categoria: 'Aumento de Vendas',
    features: [
      { nome: 'Disparador de WhatsApp', valores: ['yes','yes','yes','no','yes','no','no','yes','no','no','no','no','no','no','no','no','yes','no','no','no','no','yes','yes','no','no','no','no','no'] },
      { nome: 'Programa de fidelidade', valores: ['yes','yes','no','yes','yes','yes','yes','yes','yes','yes','partial','yes','no','no','yes','no','yes','yes','no','no','yes','yes','yes','no','yes','no','no','yes'] },
    ],
  },
  {
    categoria: 'Gestão do Negócio',
    features: [
      { nome: 'Fluxo de caixa', valores: ['yes','partial','no','yes','yes','yes','no','partial','yes','no','no','no','yes','no','no','no','partial','no','no','no','yes','yes','no','yes','yes','no','yes','yes'] },
      { nome: 'Módulo Fiscal', valores: ['yes','partial','no','yes','yes','yes','no','partial','yes','no','partial','no','yes','no','yes','no','partial','yes','no','no','yes','yes','no','yes','yes','no','yes','partial'] },
      { nome: 'Gestão de estoque de produtos', valores: ['yes','partial','no','yes','yes','yes','no','partial','yes','yes','partial','no','yes','no','yes','yes','partial','yes','yes','no','yes','yes','no','yes','yes','no','yes','yes'] },
      { nome: 'Gestão de estoque de insumos', valores: ['yes','no','no','yes','no','yes','no','partial','partial','partial','no','no','yes','no','yes','no','partial','yes','no','no','no','yes','no','yes','yes','no','partial','partial'] },
      { nome: 'Gestão financeira', valores: ['yes','partial','no','yes','yes','yes','no','partial','yes','no','no','no','yes','no','no','no','partial','no','no','no','yes','yes','no','yes','yes','no','yes','yes'] },
      { nome: 'Gestão de rotas de entrega', valores: ['yes','no','no','yes','yes','yes','no','no','yes','partial','no','partial','no','no','yes','no','partial','yes','no','no','no','no','no','no','no','no','no','no'] },
      { nome: 'Integração com totem', valores: ['yes','yes','no','yes','yes','yes','no','yes','no','no','no','no','no','no','no','no','yes','no','no','no','no','no','no','no','partial','no','no','no'] },
    ],
  },
];
