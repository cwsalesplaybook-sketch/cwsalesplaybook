/** Dados de Gestão: Framework, Níveis de Liderança e Desafios das Equipes. */

export type IconeDimensao = 'Compass' | 'Database' | 'GitBranch' | 'Users' | 'TrendingUp';

export interface ItemDimensao {
  label: string;
  feito: boolean;
  nota?: number;
}

export interface Dimensao {
  id: string;
  nome: string;
  icone: IconeDimensao;
  nota: number;
  itens: ItemDimensao[];
}

export const DIMENSOES: Dimensao[] = [
  {
    id: 'preparacao',
    nome: 'Preparação',
    icone: 'Compass',
    nota: 4.7,
    itens: [
      { label: 'Planejamento estratégico', feito: false },
      { label: 'Rotinas de planejamento', feito: false },
      { label: 'Conhecimento da área, do time e do produto', feito: true, nota: 7 },
      { label: 'Cultura da empresa', feito: true, nota: 8 },
      { label: 'Estudo constante da área', feito: true, nota: 6 },
      { label: 'Conhecimento da estratégia da empresa', feito: true, nota: 6 },
      { label: 'Organograma da área', feito: true, nota: 5 },
      { label: 'Estudo de concorrência', feito: false },
      { label: 'Clareza na jornada do cliente', feito: true, nota: 5 },
      { label: 'Perfil de cliente ideal', feito: true, nota: 10 },
      { label: 'Off-site', feito: false },
    ],
  },
  {
    id: 'dados',
    nome: 'Dados',
    icone: 'Database',
    nota: 4.8,
    itens: [
      { label: 'Ferramentas', feito: true, nota: 6 },
      { label: 'KPIs quantitativos, qualitativos e de tempo', feito: true, nota: 9 },
      { label: 'Trackeamento', feito: true, nota: 6 },
      { label: 'Indicadores de pessoas do time', feito: true, nota: 8 },
      { label: 'Documentação clara dos indicadores', feito: false },
      { label: 'Estrutura de correlação dos dados', feito: false },
    ],
  },
  {
    id: 'processos',
    nome: 'Processos',
    icone: 'GitBranch',
    nota: 4.8,
    itens: [
      { label: 'Progressão de carreira', feito: true, nota: 7 },
      { label: 'Critérios de desligamento', feito: false },
      { label: 'Matriz de objeções', feito: true, nota: 6 },
      { label: 'Scripts', feito: true, nota: 6 },
      { label: 'Cumbucas', feito: true, nota: 8 },
      { label: 'Rotina de reuniões', feito: true, nota: 8 },
      { label: 'Capacity', feito: false },
      { label: 'Melhoria contínua (documentar aprendizados)', feito: false },
      { label: 'SLAs', feito: false },
      { label: 'Frameworks da área', feito: true, nota: 6 },
      { label: 'Onboarding documentado', feito: true, nota: 6 },
      { label: 'Estrutura de documentação — Playbook', feito: true, nota: 7 },
      { label: 'Team charter', feito: false },
      { label: 'Gestão de rotinas de pessoal', feito: true, nota: 4 },
      { label: 'POPs e checklists', feito: true, nota: 4 },
      { label: 'Plano de sucessão', feito: false },
    ],
  },
  {
    id: 'coaching',
    nome: 'Coaching',
    icone: 'Users',
    nota: 4.4,
    itens: [
      { label: 'Critérios de avaliação técnica', feito: false },
      { label: 'Critérios de avaliação comportamental', feito: false },
      { label: 'Rotina de avaliação de desempenho', feito: false },
      { label: '1:1s', feito: true, nota: 10 },
      { label: 'PDI (Plano de Desenvolvimento Individual)', feito: false },
      { label: 'Rotina de treinamento', feito: true, nota: 6 },
      { label: 'Comunicação', feito: true, nota: 9 },
      { label: 'Ações de engajamento externas', feito: false },
      { label: 'Roleplays', feito: true, nota: 9 },
    ],
  },
  {
    id: 'acompanhamento',
    nome: 'Acompanhamento',
    icone: 'TrendingUp',
    nota: 6.9,
    itens: [
      { label: 'Metas', feito: true, nota: 7 },
      { label: 'OKRs', feito: true, nota: 10 },
      { label: 'Bonificações', feito: true, nota: 10 },
      { label: 'Cobranças', feito: true, nota: 7 },
      { label: 'Rotina de alinhamento de ciclos', feito: true, nota: 4 },
      { label: 'Rotina de análise diária de métricas', feito: true, nota: 6 },
      { label: 'Metodologias ágeis — scrum, dailies, sprint, retrospectiva', feito: true, nota: 10 },
      { label: 'Rituais semanais de acompanhamento do time', feito: true, nota: 7 },
      { label: 'Ritual para pendências burocráticas', feito: false },
    ],
  },
];

export const COMPORTAMENTOS_LIDERANCA = [
  { nome: 'Paranóico', desc: 'Sempre buscando otimizar e aprender de forma intensiva.' },
  { nome: 'Hands-on estratégico', desc: 'Entende o técnico profundamente.' },
  { nome: 'Extrai o máximo de valor das pessoas', desc: 'Sabe puxar o melhor de cada um do time.' },
  { nome: 'Tem conversas difíceis', desc: 'Toma decisões difíceis quando necessário.' },
  { nome: 'Se diverte trabalhando', desc: 'Gosta do que faz e contagia o time.' },
  { nome: 'Controle emocional sob pressão', desc: 'Pensamento lógico em momentos críticos.' },
  { nome: 'Foco em resultado', desc: 'Nossa receita é prioridade.' },
  { nome: 'Proatividade e colaboração', desc: 'Membro contribuinte do time.' },
  { nome: 'Obcecado por excelência', desc: 'Não aceita o "tá bom" — busca o melhor.' },
  { nome: 'Forma, inspira e retém talentos', desc: 'Constrói pessoas, não só resultados.' },
  { nome: 'Senso de dono', desc: 'Comprometimento extremo com a empresa.' },
  { nome: 'Curiosidade', desc: 'Aprendizado contínuo é parte da rotina.' },
  { nome: 'Ambição com foco em sucessão', desc: 'Pensa além do próprio cargo.' },
  { nome: 'Faz o que é certo', desc: 'Mesmo quando é difícil ou impopular.' },
  { nome: 'Humildade e mente aberta', desc: 'Reconhece quando está errado e ouve.' },
  { nome: 'Meritocracia absoluta', desc: 'Reconhece e promove com base em mérito real.' },
  { nome: 'Agilidade na decisão', desc: 'Não trava o time esperando certeza absoluta.' },
  { nome: 'Sem vitimismo', desc: 'Foco em resolver problemas, não em culpados.' },
  { nome: 'Gestão de tempo e prioridades', desc: 'Sabe o que é urgente vs. importante.' },
  { nome: 'Raciocínio lógico', desc: 'Orientação a dados em decisões.' },
  { nome: 'Se cerca das pessoas certas', desc: 'Constrói times de alto nível.' },
  { nome: 'Conta boas histórias', desc: 'Envolve o time em visões grandes.' },
];

export type IconeNivel = 'User' | 'Users' | 'TrendingUp' | 'UserCheck' | 'Star';

export interface NivelLideranca {
  numero: number;
  titulo: string;
  badge: string;
  icone: IconeNivel;
  cor: 'red' | 'orange' | 'yellow' | 'green' | 'purple';
  descricao: string;
  evolucao: string;
}

export const NIVEIS_LIDERANCA: NivelLideranca[] = [
  {
    numero: 1,
    titulo: 'Posição',
    badge: 'As pessoas te seguem porque precisam',
    icone: 'User',
    cor: 'red',
    descricao:
      'Você é líder por causa do cargo, título ou autoridade formal. A influência aqui é mínima — as pessoas obedecem, mas não estão engajadas. Liderança baseada em controle e hierarquia.',
    evolucao:
      'Construir relacionamento genuíno com o time. Demonstrar interesse real pelas pessoas. Ouvir mais do que falar. Ser acessível e humano. Gerar confiança. Foco: conexão antes de cobrança.',
  },
  {
    numero: 2,
    titulo: 'Relacionamento',
    badge: 'As pessoas te seguem porque querem',
    icone: 'Users',
    cor: 'orange',
    descricao:
      'Você construiu relacionamento. As pessoas confiam em você. Existe respeito, proximidade e boa comunicação. Risco: ficar confortável demais e evitar conversas difíceis para querer ser "legal" o tempo todo.',
    evolucao:
      'Começar a gerar resultado real com o time. Definir metas claras. Cobrar performance com respeito. Mostrar que relacionamento e resultado caminham juntos. Foco: sair de "gostam de mim" → "crescem comigo".',
  },
  {
    numero: 3,
    titulo: 'Produtividade',
    badge: 'As pessoas te seguem pelo que você faz',
    icone: 'TrendingUp',
    cor: 'yellow',
    descricao:
      'Você entrega resultado. Sua liderança gera performance. O time começa a acreditar porque vê impacto concreto. Risco: virar um líder "fazedor" e não desenvolver pessoas.',
    evolucao:
      'Desenvolver líderes dentro do time. Delegar com inteligência — não só tarefas, mas responsabilidade. Criar sucessores. Treinar e dar feedback constante. Foco: sair de "eu faço" → "eu multiplico".',
  },
  {
    numero: 4,
    titulo: 'Desenvolvimento de Pessoas',
    badge: 'As pessoas te seguem pelo que você faz por elas',
    icone: 'UserCheck',
    cor: 'green',
    descricao:
      'Você forma líderes. Seu impacto escala através de outras pessoas. O time cresce profissionalmente por sua causa. Risco: investir nas pessoas erradas.',
    evolucao:
      'Desenvolver líderes que também desenvolvem outros líderes. Criar cultura forte e consistente. Tomar decisões difíceis sobre pessoas para manter padrão alto. Atrair talentos melhores que você. Foco: construir sistema de liderança, não só indivíduos.',
  },
  {
    numero: 5,
    titulo: 'Respeito (Pináculo)',
    badge: 'As pessoas te seguem por quem você é',
    icone: 'Star',
    cor: 'purple',
    descricao:
      'Você virou referência. Sua liderança transcende a empresa. Você construiu legado, cultura e impacto duradouro. Risco: ego ou desconexão com a realidade.',
    evolucao:
      'Garantir sucessão forte. Manter humildade e aprendizado contínuo. Expandir impacto além da empresa. Preservar e evoluir a cultura. Foco: legado e escala de impacto.',
  },
];

export interface DesafioEquipe {
  camada: number;
  problema: string;
  conceito: string;
  cor: 'red' | 'orange' | 'yellow' | 'purple-light' | 'purple';
  descricao: string;
}

export const DESAFIOS_EQUIPE: DesafioEquipe[] = [
  {
    camada: 1,
    problema: 'Invulnerabilidade',
    conceito: 'Falta de CONFIANÇA',
    cor: 'red',
    descricao:
      'Quando os membros do time têm medo de ser vulneráveis uns com os outros, é impossível construir a base de confiança necessária para o trabalho em equipe eficaz.',
  },
  {
    camada: 2,
    problema: 'Harmonia Artificial',
    conceito: 'Medo de CONFLITOS',
    cor: 'orange',
    descricao:
      'Times que não confiam uns nos outros são incapazes de se engajar em debate de ideias — não filtrado e apaixonado. Em vez disso, recorrem a discussões veladas e comentários indiretos.',
  },
  {
    camada: 3,
    problema: 'Ambiguidade',
    conceito: 'Falta de COMPROMETIMENTO',
    cor: 'yellow',
    descricao:
      'Sem conflito saudável, é difícil obter comprometimento real. As pessoas fingem concordar mas saem da reunião sem se comprometer de fato com as decisões.',
  },
  {
    camada: 4,
    problema: 'Baixos Padrões',
    conceito: 'Evitar RESPONSABILIZAR os outros',
    cor: 'purple-light',
    descricao:
      'Quando as pessoas não se comprometem com um plano claro, elas relutam em responsabilizar umas às outras. Isso cria ambiente de baixos padrões.',
  },
  {
    camada: 5,
    problema: 'Status e Ego',
    conceito: 'Falta de atenção aos RESULTADOS',
    cor: 'purple',
    descricao:
      'O desafio final — quando os membros do time colocam suas necessidades individuais (ego, desenvolvimento de carreira, reconhecimento) acima dos objetivos coletivos da equipe.',
  },
];
