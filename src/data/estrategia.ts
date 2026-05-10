/** Dados de Missão, Visão, Valores e Estratégia da Cardápio Web. */

export const MISSAO = {
  destaque: 'Construir um mercado de food melhor para todos',
  contexto: `Durante anos, marketplaces como a Amazon digitalizaram o varejo. Depois, o mercado evoluiu para o e-commerce próprio — plataformas como a Shopify permitiram que marcas vendessem direto para seus clientes, com mais margem, mais controle e construção de marca.

No mercado de restaurantes, essa transformação está começando agora. O iFood ajudou a digitalizar o setor. Mas hoje muitos restaurantes dependem dos marketplaces, pagam taxas altas e não têm acesso aos dados dos seus clientes. A Cardápio Web existe para mudar isso.

Nós damos ao restaurante seu próprio sistema de pedidos online para que ele venda direto ao cliente, use seus dados com inteligência e transforme marketing e gestão em motores reais de crescimento.

Estamos liderando o desenvolvimento do ecossistema tecnológico que o food nunca teve. O que nós fazemos... muda o mundo.`,
};

export const VISAO = {
  destaque: 'Ser o e-commerce dos restaurantes no mundo até 2040',
  contexto: `Ser o "E-commerce dos Restaurantes do Mundo até 2040" significa construir a principal plataforma para que restaurantes vendam diretamente aos seus clientes, com autonomia e sem depender de intermediários — como a Shopify fez com o varejo.

Isso inclui oferecer toda a infraestrutura digital: cardápio online, pedidos, pagamentos, marketing, gestão e integrações.

A visão inclui escala global — presença em múltiplos países, participação relevante de mercado e construção de um ecossistema que torne os restaurantes mais independentes, donos dos seus dados e do seu crescimento.`,
};

export type IconeValor =
  | 'Zap' | 'Shield' | 'Star' | 'Heart' | 'RefreshCw' | 'Rocket' | 'Scale';

export interface Valor {
  id: string;
  nome: string;
  icone: IconeValor;
  definicao: string;
  exemplos: string[];
}

export const VALORES: Valor[] = [
  {
    id: 'fazemos',
    nome: 'Fazemos o que precisa ser feito',
    icone: 'Zap',
    definicao:
      'Assumimos responsabilidade pelo resultado, mesmo quando a tarefa não é "da nossa área". Não esperamos o cenário ideal nem terceirizamos problemas. Se algo impacta o cliente ou a empresa, agimos. É postura de dono.',
    exemplos: [
      'Um problema técnico surge perto do horário de pico. Mesmo fora do expediente, o time se mobiliza para resolver imediatamente.',
      'Um líder identifica que um processo está travando crescimento, mesmo não sendo sua responsabilidade formal, e propõe melhoria.',
      'Um colaborador percebe que um cliente está perdido e, em vez de enviar um link, agenda uma ligação para garantir que ele consiga operar.',
    ],
  },
  {
    id: 'cumprimos',
    nome: 'Cumprimos o que prometemos',
    icone: 'Shield',
    definicao:
      'Promessa é compromisso. Entregamos o que foi combinado, no prazo acordado. Nossa credibilidade é construída na consistência. Confiança é o nosso maior ativo.',
    exemplos: [
      'Um prazo acordado com cliente é mantido mesmo diante de imprevistos.',
      'Um líder promete feedback em determinada data e entrega exatamente naquele dia.',
      'Um colaborador assume uma meta e acompanha semanalmente até cumprir.',
    ],
  },
  {
    id: 'pequenas-coisas',
    nome: 'Nos importamos com as pequenas coisas',
    icone: 'Star',
    definicao:
      'Excelência está nos detalhes. A experiência do cliente, a clareza da comunicação, a organização interna — tudo importa. Pequenos descuidos se acumulam; pequenos cuidados constroem grandeza. Qualidade é hábito, não evento.',
    exemplos: [
      'Um erro de português em comunicação externa é revisado antes de enviar.',
      'O time testa uma funcionalidade nova como se fosse cliente real.',
      'Um evento interno é organizado com atenção ao ambiente e materiais.',
    ],
  },
  {
    id: 'cuidamos',
    nome: 'Cuidamos dos nossos',
    icone: 'Heart',
    definicao:
      'Valorizamos as pessoas que constroem a Cardápio Web — clientes, colaboradores e parceiros. Cuidar significa apoiar, desenvolver, ouvir e proteger o ambiente de confiança. Crescemos juntos.',
    exemplos: [
      'Um restaurante em dificuldade recebe atenção consultiva para melhorar vendas, não apenas suporte técnico.',
      'Um colaborador que enfrenta desafio pessoal encontra abertura para diálogo e apoio estruturado.',
      'Um líder dá feedback honesto e construtivo, mesmo quando é difícil.',
    ],
  },
  {
    id: 'evoluimos',
    nome: 'Evoluímos sem esquecer o que aprendemos',
    icone: 'RefreshCw',
    definicao:
      'Buscamos crescimento contínuo, mas não repetimos erros. Cada acerto e cada falha viram aprendizado estruturado. Evoluir não é abandonar o passado — é aprender com ele. Crescimento com consciência.',
    exemplos: [
      'Após uma falha em lançamento, o time documenta aprendizados e cria checklist para evitar repetição.',
      'Métricas antigas são analisadas antes de nova estratégia.',
      'Mudanças estruturais respeitam cultura e fundamentos que deram certo.',
    ],
  },
  {
    id: 'sonhamos',
    nome: 'Sonhamos grande',
    icone: 'Rocket',
    definicao:
      'Pensamos no longo prazo e construímos para impacto global. Não trabalhamos apenas para resolver o hoje, mas para desenvolver o futuro do mercado de food. Ambição com responsabilidade.',
    exemplos: [
      'Decisões de produto consideram escalabilidade internacional.',
      'Um colaborador propõe solução inovadora que pode gerar nova frente de receita.',
      'A empresa assume publicamente a visão de 2040 e toma decisões alinhadas a essa meta.',
    ],
  },
  {
    id: 'certo',
    nome: 'Fazemos o que é certo, mesmo quando é difícil',
    icone: 'Scale',
    definicao:
      'Tomar decisões difíceis é parte da liderança. O certo é o certo — independente de opinião ou contexto. Integridade não tem exceção.',
    exemplos: [
      'Manter padrões de qualidade mesmo sob pressão de prazo.',
      'Dar feedback duro a quem precisa evoluir, com respeito e clareza.',
      'Recusar atalhos que comprometem a confiança do cliente ou do time.',
    ],
  },
];

export interface PilarOperacional {
  id: string;
  nome: string;
  descricao: string;
}

export const PILARES_OPERACIONAIS: PilarOperacional[] = [
  {
    id: 'commerce',
    nome: 'Commerce first',
    descricao:
      'Somos essencialmente uma plataforma de comércio eletrônico. O cardápio digital é prioridade número 1. Se houver dúvida entre duas prioridades, escolher a que aumenta vendas diretas.',
  },
  {
    id: 'ai',
    nome: 'A.I. first',
    descricao:
      'I.A. é nossa forma padrão de operar. Tudo que puder ser feito com I.A. deve ser feito com I.A. — não para substituir quem está aqui, mas para ampliar o que cada um consegue fazer.',
  },
  {
    id: 'encantar',
    nome: 'Buscamos encantar nossos clientes e torná-los promotores',
    descricao:
      'Encantar não é ser simpático. É gerar resultado real e experiência memorável. Crescimento de longo prazo depende de reputação, indicação e autoridade.',
  },
  {
    id: 'last',
    nome: 'Built to last — jogamos no longo prazo',
    descricao:
      'Construindo uma empresa geracional. Não trocamos valor de longo prazo por ganho imediato. Fazemos escolhas que fortaleçam a empresa ao longo dos anos.',
  },
  {
    id: 'crescimento',
    nome: 'O crescimento do nosso cliente é o nosso crescimento',
    descricao:
      'Nosso modelo deve estar alinhado ao sucesso do restaurante. Quando ele vende mais e retém mais clientes, nós crescemos junto.',
  },
];

export interface VisaoMercado {
  id: string;
  titulo: string;
  descricao: string;
}

export const VISAO_MERCADO: VisaoMercado[] = [
  {
    id: 'd2c',
    titulo: 'Construímos o futuro do D2C no food',
    descricao:
      'Não seguimos o mercado. Antecipamos. Somos responsáveis por liderar a transição do restaurante dependente de marketplace para o restaurante dono da sua base, dos seus dados e da sua receita direta.',
  },
  {
    id: 'food-services',
    titulo: 'Abraçamos todos os food services, sem exceção',
    descricao:
      'Não somos solução para um nicho. Somos infraestrutura para qualquer negócio de food service: do pequeno delivery local a redes, franquias, dark kitchens, cafeterias, pizzarias, hamburguerias e formatos que ainda vão surgir.',
  },
  {
    id: 'ecossistema',
    titulo: 'Construímos um ecossistema, não só uma ferramenta',
    descricao:
      'Queremos ser a infraestrutura central que conecta soluções: marketing, pagamentos, logística, CRM, fiscal, parceiros, agências, adquirentes, mentores. O hub onde o restaurante resolve sua operação.',
  },
  {
    id: 'tams',
    titulo: 'Estamos sempre expandindo nossos TAMs',
    descricao:
      'Nunca nos limitamos ao mercado atual. De cardápio digital → payments → serviços financeiros → redes e franquias → América Latina. TAM não é fixo. É construído estrategicamente.',
  },
];
