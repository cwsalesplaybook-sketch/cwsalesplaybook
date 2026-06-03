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
  { etapa: 'Marketing / Growth',  desc: 'Rodrigo Bruno gera demanda via anúncios e redes sociais. Leads chegam já com interesse declarado na CW.' },
  { etapa: 'Parcerias',           desc: 'Vanessa Alencar: agências, gestores de tráfego e influenciadores indicam clientes e recebem comissão por fechamento.' },
  { etapa: 'SDR (lead quente)',   desc: 'Joelma Vieira / Pedro Ferreira: qualificam leads que solicitaram atendimento. Passam para o Closer apenas quem tem fit e potencial.' },
  { etapa: 'BDR (lead frio/morno)', desc: 'Hyorranes Abreu: prospecta leads frios (nunca ouviram da CW) e mornos (já passaram pela apresentação mas não fecharam). Qualifica e encaminha.' },
  { etapa: 'Closer',              desc: 'Whenna Oliveira: demonstra a plataforma, fecha a contratação, cria a conta e repassa ao time de implementação.' },
  { etapa: 'ISM (Implementação)', desc: 'Samuel Morais / Lara Ferreira: garantem a configuração técnica, integração inicial e que o cliente gere o primeiro ROI rapidamente.' },
  { etapa: 'Suporte N0 (IA)',     desc: 'IA atende primeiro — resolve 40% dos casos. Casos não resolvidos vão para N1.' },
  { etapa: 'Suporte N1',          desc: 'Karen / Lethycia / Leiliane / Thais: triagem e resolução de casos simples não resolvidos pela IA.' },
  { etapa: 'Suporte N2',          desc: 'Gabriel Barbosa: casos técnicos — impressora, ativação remota, configurações avançadas.' },
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
    tipo: 'Valores',
    objecao: 'Eu só quero saber o preço',
    momento: 'Início',
    argumento: 'Nós temos planos a partir de R$139,99/mês (anual). Mas antes de falar de preço, preciso entender a sua operação — assim consigo te indicar o plano certo e mostrar como o investimento já se paga nos primeiros meses.',
  },
  {
    tipo: 'Valores',
    objecao: 'Eu achei muito caro',
    momento: 'Fim',
    argumento: 'Se você achou caro é porque eu ainda não consegui mostrar todo o valor da ferramenta. Uma das funcionalidades nativas é o disparador de WhatsApp — com ele, um único disparo costuma pagar vários meses de mensalidade. Posso te mostrar como funciona?',
  },
  {
    tipo: 'Concorrente',
    objecao: 'A ferramenta que tenho hoje tem tudo que vocês têm',
    momento: 'Fim',
    argumento: 'Você consegue identificar algum ponto de melhoria no sistema atual? É muito comum ferramentas se apresentarem como completas, mas com funcionalidades incompletas ou em módulos separados. O que você usa hoje e sente que poderia ser melhor?',
  },
  {
    tipo: 'Ceticismo',
    objecao: 'Minhas vendas estão fracas, não é bom momento',
    momento: 'Início',
    argumento: 'Entendo o receio. Mas deixa eu te perguntar: você já teve dificuldade de atender clientes no WhatsApp? Essa dificuldade compromete o atendimento? Automatizando esse processo, você evita perder pedidos e constrói uma base de clientes para fidelizar.',
  },
  {
    tipo: 'Processo',
    objecao: 'Essa videochamada é realmente necessária?',
    momento: 'Fim',
    argumento: 'Sim! A gente faz isso para que você faça uma contratação com segurança — o consultor vai te mostrar exatamente o que a plataforma faz pela sua operação, personalizado para o seu negócio.',
  },
  {
    tipo: 'Dispensa',
    objecao: 'Me manda no WhatsApp que eu olho e te dou retorno',
    momento: 'Fim',
    argumento: 'Posso sim te passar as informações no WhatsApp. Mas antes de encerrar, você consegue me dizer qual é o principal desafio da sua operação hoje? Assim eu te envio exatamente o que faz sentido para você avaliar.',
  },
  {
    tipo: 'Deal Breaker',
    objecao: 'Só tenho R$60 para investir',
    momento: 'Qualquer',
    argumento: 'Entendo. Nesse caso, nossos planos começam em R$139,99/mês. Se o orçamento não se encaixa agora, posso te passar nosso contato para quando o momento estiver melhor?',
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
