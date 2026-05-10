/** Dados estáticos do Playbook de Vendas. */

export const PLAYBOOK_URL =
  'https://docs.google.com/spreadsheets/d/12IUEiWLFcXnLMqfAD0fAbDX0QBlW8hFI9qJrsWxmnUs';

export const CARGOS = [
  {
    sigla: 'BDR',
    nome: 'Business Development Representative',
    descricao:
      'Pré-vendedor responsável por prospectar leads que não solicitaram atendimento e não conhecem a empresa. Objetivo: qualificar e agendar reunião com o consultor.',
  },
  {
    sigla: 'SDR',
    nome: 'Sales Development Representative',
    descricao:
      'Pré-vendedor responsável por prospectar leads que solicitaram atendimento e conhecem a marca. Objetivo: qualificar e agendar reunião com o consultor.',
  },
  {
    sigla: 'LDR',
    nome: 'Lead Development Representative',
    descricao:
      'Responsável pela criação de listas para o time prospectar, aplicando conhecimentos de inteligência comercial.',
  },
  {
    sigla: 'Closer',
    nome: 'Especialista em Vendas',
    descricao:
      'Negocia planos e fecha a venda diretamente com o cliente, contornando objeções, apresentando o produto e acompanhando até o fechamento.',
  },
  {
    sigla: 'Supervisor',
    nome: 'Supervisor de Vendas',
    descricao:
      'Garante que o time siga as rotinas definidas estrategicamente pelo gerente de vendas.',
  },
  {
    sigla: 'Coordenador',
    nome: 'Coordenador de Vendas',
    descricao:
      'Acompanha o trabalho dos supervisores, define estratégias e ajuda no desenvolvimento de lideranças e vendedores.',
  },
  {
    sigla: 'Gerente',
    nome: 'Gerente de Vendas',
    descricao:
      'Acompanha coordenadores e supervisores, define estratégias e desenvolve as lideranças do time.',
  },
];

export const JORNADA = [
  { etapa: 'Prospecção',          desc: 'Identificação e contato inicial com leads.' },
  { etapa: 'Qualificação',        desc: 'Aplicação de BANT/SPIN para validar o fit.' },
  { etapa: 'Agendamento',         desc: 'Marcação da reunião com o Closer.' },
  { etapa: 'Reunião',             desc: 'Apresentação técnica e descoberta de dor.' },
  { etapa: 'Proposta',            desc: 'Envio da proposta comercial personalizada.' },
  { etapa: 'Fechamento',          desc: 'Negociação final e assinatura do contrato.' },
  { etapa: 'Onboarding',          desc: 'Passagem para o time de sucesso do cliente.' },
];

export const SPIN = [
  {
    letra: 'S',
    nome: 'Situação',
    cor: 'purple' as const,
    descricao: 'Perguntas para entender o contexto atual do lead.',
    exemplo: '"Como você gerencia seus pedidos hoje?"',
  },
  {
    letra: 'P',
    nome: 'Problema',
    cor: 'red' as const,
    descricao: 'Perguntas para identificar dores e dificuldades.',
    exemplo: '"Você perde pedidos por demora no atendimento?"',
  },
  {
    letra: 'I',
    nome: 'Implicação',
    cor: 'yellow' as const,
    descricao: 'Perguntas que ampliam o impacto do problema.',
    exemplo: '"Quanto isso te custa em vendas perdidas por mês?"',
  },
  {
    letra: 'N',
    nome: 'Necessidade',
    cor: 'green' as const,
    descricao: 'Perguntas que criam consciência da solução.',
    exemplo: '"Se você pudesse automatizar isso, como impactaria seu negócio?"',
  },
];

export const BANT = [
  { letra: 'B', nome: 'Budget (Orçamento)',    desc: 'O lead tem capacidade financeira para investir?' },
  { letra: 'A', nome: 'Authority (Autoridade)', desc: 'Você está falando com quem decide?' },
  { letra: 'N', nome: 'Need (Necessidade)',     desc: 'O lead tem uma dor real que nossa solução resolve?' },
  { letra: 'T', nome: 'Timeline (Tempo)',       desc: 'Quando ele precisa resolver esse problema?' },
];

export const OBJECOES = [
  {
    objecao: 'Já tenho um sistema',
    argumento:
      'Entendo! Mas você está satisfeito com os resultados que ele traz hoje? Nossa plataforma vai além de um sistema — é um canal próprio de vendas que elimina as taxas do iFood.',
  },
  {
    objecao: 'Está caro',
    argumento:
      'Faz sentido avaliar o custo. Quanto você paga de taxa pro iFood por mês? Nossos clientes recuperam o investimento no primeiro mês só eliminando essa dependência.',
  },
  {
    objecao: 'Preciso pensar',
    argumento:
      'Claro! O que exatamente você precisa avaliar? Posso te ajudar a ter essas informações agora para você decidir com mais segurança.',
  },
];

export const PASSAGEM_BASTAO = [
  'Lead qualificado (BANT verificado)',
  'Contexto documentado no CRM',
  'Closer apresentado ao lead',
  'Agendamento confirmado com data e hora',
  'Histórico da conversa registrado',
];

export const MOTIVOS_PERDA = [
  { motivo: 'Preço',          desc: 'Lead não viu valor suficiente para o investimento.' },
  { motivo: 'Timing',         desc: 'Momento errado — lead não estava pronto para decidir.' },
  { motivo: 'Concorrente',    desc: 'Optou por solução concorrente.' },
  { motivo: 'Sem decisão',    desc: 'Lead sumiu ou não respondeu.' },
  { motivo: 'Não qualificado', desc: 'Lead não tinha o perfil de ICP.' },
];
