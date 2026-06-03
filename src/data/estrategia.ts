/** Dados de Missão, Visão, Valores e Estratégia da Cardápio Web. */

export const MISSAO = {
  destaque: 'Construir um mercado de food melhor para todos',
  contexto: `A Cardápio Web existe porque o mercado de food ainda está em um estágio de desenvolvimento muito inferior ao de outros segmentos do varejo. Em vários setores, os marketplaces ajudaram a digitalizar a relação entre empresas e consumidores e, depois disso, surgiu uma segunda onda: a construção de canais próprios, com mais margem, mais controle sobre a marca e mais acesso aos dados do cliente.

No food, essa transformação começou mais tarde e ainda está em formação. Marketplaces como o iFood tiveram um papel importante na digitalização inicial do setor — ajudaram a criar hábitos de consumo, trouxeram restaurantes e clientes para o ambiente digital. Mas a dependência excessiva do marketplace trouxe seus limites: compressão de margem, perda de protagonismo da marca do restaurante, pouco acesso aos dados do consumidor e dificuldade de construir crescimento próprio.

É exatamente nesse ponto que a Cardápio Web ganha relevância histórica. Nós existimos para ajudar restaurantes a vender diretamente aos seus clientes, operar com mais autonomia e construir negócios mais fortes, mais saudáveis e mais valiosos ao longo do tempo.

Nossa missão significa desenvolver um ambiente em que restaurantes tenham mais independência, consumidores tenham experiências melhores, parceiros encontrem um setor mais maduro para atuar e a venda direta deixe de ser exceção para se tornar infraestrutura. Quando ajudamos um restaurante a dominar seus próprios dados, melhorar sua operação digital, fortalecer sua marca e transformar gestão e marketing em motores reais de crescimento, nós não estamos apenas prestando um serviço. Estamos ajudando a estruturar um novo capítulo do mercado de food.`,
};

export const VISAO = {
  destaque: 'Ser o e-commerce dos restaurantes do mundo até 2040',
  contexto: `Ser o e-commerce dos restaurantes do mundo até 2040 significa construir a principal plataforma para que restaurantes vendam diretamente aos seus clientes, com autonomia e sem depender de intermediários como canal dominante.

Assim como plataformas de e-commerce deram a outros varejistas condições de operar sua própria máquina de vendas, a Cardápio Web quer oferecer ao food a infraestrutura digital completa para vender, receber, se relacionar, gerir e crescer.

Essa visão exige escala, profundidade de produto, força de marca, relevância internacional e um ecossistema robusto de parceiros e soluções conectadas. Em termos concretos, significa estar presente em pelo menos quatro países, com participação relevante de mercado, e construir uma empresa com faturamento de um bilhão de dólares.`,
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
      'Assumimos responsabilidade pelo resultado sem se esconder atrás de fronteiras de área, de cargo ou de conveniência. Se algo afeta o cliente ou a empresa, nossa postura deve ser agir.',
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
      'Confiança é construída pela repetição de compromissos honrados, no prazo e com consistência. Em uma empresa que quer liderar um mercado, credibilidade operacional não é detalhe, é ativo central.',
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
      'Excelência não nasce apenas de grandes decisões, mas do acúmulo de detalhes bem executados: uma comunicação clara, um produto intuitivo, um processo organizado, um evento bem preparado. Pequenos descuidos se somam e corroem a percepção de qualidade; pequenos cuidados constroem grandeza. Qualidade é hábito, não episódio.',
    exemplos: [
      'Um erro de português em comunicação externa é revisado antes de enviar.',
      'O time testa uma funcionalidade nova como se fosse cliente real, do ponto de vista real do cliente.',
      'Um evento interno é organizado com atenção ao ambiente e materiais.',
    ],
  },
  {
    id: 'cuidamos',
    nome: 'Cuidamos dos nossos',
    icone: 'Heart',
    definicao:
      'Cuidamos dos nossos quando apoiamos clientes com postura consultiva, quando desenvolvemos colegas com franqueza e respeito, quando preservamos um ambiente de confiança e quando tratamos parceiros como parte da construção do ecossistema. Cuidar não é suavizar a verdade nem evitar conversas difíceis — em muitos momentos, cuidar significa dar feedback honesto e elevar a barra.',
    exemplos: [
      'Um restaurante em dificuldade recebe atenção consultiva para melhorar vendas, não apenas suporte técnico.',
      'Um colaborador que enfrenta desafio pessoal encontra abertura para diálogo e apoio estruturado.',
      'Um líder dá feedback honesto e construtivo, mesmo quando é difícil, criando condições reais de evolução.',
    ],
  },
  {
    id: 'evoluimos',
    nome: 'Evoluímos sem esquecer o que aprendemos',
    icone: 'RefreshCw',
    definicao:
      'Crescer não significa abandonar a história, significa transformar acertos e erros em aprendizado estruturado. Sempre que falhamos, devemos aprender com rigor. Sempre que acertamos, devemos entender por que funcionou. Em uma empresa que quer atravessar muitos ciclos, memória operacional e capacidade de aprendizado são vantagens competitivas.',
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
      'Não trabalhamos apenas para resolver o presente imediato. Trabalhamos para desenvolver o futuro do mercado de food, com responsabilidade, coragem e visão de longo prazo.',
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
      'Somos, essencialmente, uma plataforma de comércio eletrônico, e o cardápio digital é nossa prioridade número um antes de qualquer outra coisa. Diante de escolhas difíceis, priorizamos aquilo que aumenta vendas diretas, melhora conversão, eleva GMV e fortalece a capacidade do restaurante de operar seu canal próprio com excelência.',
  },
  {
    id: 'last',
    nome: 'Built to last',
    descricao:
      'Estamos construindo uma empresa geracional, feita para durar décadas, atravessar ciclos, evoluir com o mercado e seguir relevante para a próxima geração. Não trocamos valor de longo prazo por ganho imediato. Evitamos atalhos que aceleram agora mas enfraquecem a empresa depois. Protegemos marca, cultura e confiança de clientes e parceiros como ativos estratégicos inegociáveis.',
  },
  {
    id: 'ai',
    nome: 'A.I. first',
    descricao:
      'Tudo que puder ser feito com I.A., deve ser feito com I.A. I.A. não é feature, não é experimento e não é diferencial temporário. É a forma como operamos. De produto a suporte, de marketing a operação interna, I.A. é a primeira pergunta, não a última. Não para substituir quem está aqui, mas para ampliar o que cada um consegue fazer.',
  },
  {
    id: 'crescimento',
    nome: 'O crescimento do nosso cliente é o nosso crescimento',
    descricao:
      'Quando um restaurante vende mais, retém mais clientes, opera melhor e aumenta sua margem, a Cardápio Web deve crescer junto. Sempre que houver desalinhamento entre o que faz bem ao restaurante e o que monetiza para nós, devemos tratar isso como um sinal de desenho estratégico ruim.',
  },
  {
    id: 'encantar',
    nome: 'Encantar clientes e torná-los promotores',
    descricao:
      'Encantar não é ser simpático, é gerar resultado real e experiência memorável. Isso começa no onboarding, que deve gerar a primeira venda desse restaurante de forma rápida, e se estende ao suporte, que deve resolver com agilidade e postura consultiva. NPS e indicação são métricas estratégicas, não periféricas.',
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
      'Nossa responsabilidade não é apenas responder ao mercado atual, mas antecipá-lo. Isso exige defender publicamente a tese da venda direta, investir em infraestrutura própria de dados e pagamentos e desenvolver modelos em que o restaurante acumule ativos de longo prazo — base, dados, marca e previsibilidade de receita.',
  },
  {
    id: 'food-services',
    titulo: 'Abraçamos todos os food services, sem exceção',
    descricao:
      'Não somos uma solução para um nicho específico de restaurante. Somos infraestrutura para qualquer negócio de food service que venda direto ao consumidor: do pequeno delivery local a redes, franquias, dark kitchens, cafeterias, pizzarias, hamburguerias, restaurantes premium, operações híbridas e futuros formatos que ainda vão surgir.',
  },
  {
    id: 'ecossistema',
    titulo: 'Um ecossistema de soluções no centro do mercado',
    descricao:
      'Não queremos ser apenas mais uma peça na operação do restaurante. Queremos ser o ponto de conexão entre pagamentos, parceiros, agências, integrações, CRM, fiscal, logística, serviços financeiros, educação e tecnologias complementares. Quanto mais a Cardápio Web se torna o lugar onde o restaurante resolve sua operação de venda direta, maior é nossa relevância estrutural no setor.',
  },
  {
    id: 'tams',
    titulo: 'Expandindo nossos TAMs continuamente',
    descricao:
      'Nunca nos limitamos ao mercado atual. TAM não é apenas algo que se mede, também é algo que se constrói estrategicamente. Podemos crescer do cardápio digital para payments, de payments para serviços financeiros, de restaurantes independentes para redes e franquias, do Brasil para novos mercados.',
  },
  {
    id: 'crescer-base',
    titulo: 'Crescer base com disciplina',
    descricao:
      'Ganhar escala é importante por marca, rede, dados e ecossistema, mas crescimento artificial cobra um preço alto. Não devemos perseguir volume que destrói unit economics ou compromete capacidade futura de monetização. Crescer com disciplina significa equilibrar expansão com sustentabilidade e escolher clientes com fit real.',
  },
];
