/** Tira-dúvidas do SDR — "mini IAs" com respostas pré-curadas, uma por
 *  pessoa do time. O SDR escolhe o TÓPICO/pergunta, nunca a pessoa — o
 *  roteamento pra persona certa é sempre automático (src/lib/matchDuvida.ts).
 *  Não usa IA generativa: cada persona tem um banco fixo de perguntas e
 *  respostas (ver src/lib/matchDuvida.ts pro motor de busca).
 *  Conteúdo das respostas puxado do que já existe no playbook (src/data/playbook.ts)
 *  pra não inventar informação de preço/processo.
 *  Avatares: mascotes 3D gerados pra cada pessoa (public/tira-duvidas/). Nome
 *  exibido é o apelido — o nome completo fica no campo `cargo`. */

export interface DuvidaItem {
  pergunta: string;
  /** Termos extras que devem casar com a pergunta, além das palavras do texto acima. */
  palavrasChave?: string[];
  resposta: string;
}

export interface DuvidaPersona {
  id: string;
  nome: string;
  /** Artigo pro nome, pra concordância em frases tipo "Slack {artigo} {nome}". */
  artigo: 'a' | 'o';
  cargo: string;
  foto?: string;
  slack: string;
  /** Rótulo curto do tópico, usado nos chips de tópico (não expõe a pessoa). */
  topico: string;
  tema: string;
  saudacao: string;
  perguntas: DuvidaItem[];
}

export const TIRA_DUVIDAS_PERSONAS: DuvidaPersona[] = [
  {
    id: 'joelma',
    artigo: 'a',
    nome: 'Jojo',
    cargo: 'Joelma Vieira · Liderança de Pré-Vendas (SDR)',
    foto: '/tira-duvidas/joelma.jpg',
    slack: '@joelma',
    topico: 'Processo & Qualificação',
    tema: 'Processo de SDR, qualificação e passagem de bastão',
    saudacao: 'Oi, tudo bem? Sou a Jojo. Vou verificar.',
    perguntas: [
      {
        pergunta: 'Como funciona a passagem de bastão pro Closer?',
        palavrasChave: ['bastao', 'closer', 'repassar', 'passar lead'],
        resposta: 'Antes de passar o lead pro Closer, confere esse checklist:\n\n1. Lead qualificado (BANT verificado)\n2. Contexto documentado no CRM\n3. Closer apresentado ao lead\n4. Agendamento confirmado com data e hora\n5. Histórico da conversa registrado',
      },
      {
        pergunta: 'Quais são as etapas do BANT?',
        palavrasChave: ['bant', 'budget', 'authority', 'need', 'timeline', 'qualificacao'],
        resposta: 'B — Budget (Orçamento): confirma se os valores (R$145 a R$400/mês, a depender da operação) cabem no orçamento do lead.\nA — Authority (Autoridade): pergunta se tem mais alguém que precisa participar da decisão.\nN — Need (Necessidade): pede pra ele dar uma nota de 0 a 10 pra prioridade, com base no que ele contou de dor.\nT — Timeline (Tempo): alinha quando ele pretende começar o projeto.',
      },
      {
        pergunta: 'Quais são os principais motivos de perda de um lead?',
        palavrasChave: ['perda', 'perdido', 'motivo', 'sumiu'],
        resposta: 'Os motivos mais comuns:\n• Preço — lead não viu valor suficiente pro investimento\n• Timing — momento errado, lead não tava pronto pra decidir\n• Concorrente — optou por solução concorrente\n• Sem decisão — lead sumiu ou não respondeu\n• Não qualificado — lead não tinha o perfil de ICP',
      },
      {
        pergunta: 'Qual a diferença entre BDR e SDR?',
        palavrasChave: ['bdr', 'diferenca', 'cargo', 'funcao'],
        resposta: 'SDR: pré-vendedor que atende leads que solicitaram atendimento e já conhecem a marca. Objetivo é qualificar e agendar reunião com o consultor.\n\nBDR: pré-vendedor que prospecta ativamente leads frios (nunca ouviram falar da CW) ou mornos (já viram a apresentação mas não fecharam). Também qualifica e encaminha.',
      },
      {
        pergunta: 'Como funciona a jornada do lead até o fechamento?',
        palavrasChave: ['jornada', 'funil', 'etapas', 'fluxo'],
        resposta: 'Marketing/Growth gera a demanda → Parcerias indica clientes (agências, gestores de tráfego, influenciadores) → SDR qualifica lead quente (que pediu atendimento) → BDR prospecta lead frio/morno → Closer demonstra e fecha → Implementação configura → Suporte (IA + N1 + N2) atende o pós-venda.',
      },
    ],
  },
  {
    id: 'pedro',
    artigo: 'o',
    nome: 'Pedrinho',
    cargo: 'Pedro Ferreira · Liderança de Pré-Vendas',
    foto: '/tira-duvidas/pedro.jpg',
    slack: '@pedro',
    topico: 'Scripts & Objeções',
    tema: 'Scripts, SPIN, cold call e contorno de objeções',
    saudacao: 'Oi, tudo bem? Sou o Pedrinho. Vou verificar.',
    perguntas: [
      {
        pergunta: 'Como aplicar o SPIN Selling numa ligação?',
        palavrasChave: ['spin', 'situacao', 'problema', 'implicacao', 'necessidade'],
        resposta: 'S — Situação: entende o contexto atual ("Quantos pedidos você recebe por dia? E no WhatsApp?").\nP — Problema: identifica a dor ("Já recebeu reclamação por demora ou pedido errado?").\nI — Implicação: amplia o impacto ("Como isso afeta suas vendas?").\nN — Necessidade de Solução: faz o lead articular o valor ("Se o atendimento fosse automático, que vantagem isso traria?").',
      },
      {
        pergunta: 'Como estruturar uma cold call com AIDA?',
        palavrasChave: ['aida', 'cold call', 'prospeccao', 'ligacao fria'],
        resposta: 'A — Atenção: introdução + rapport + pede 2 minutos.\nI — Interesse: fala do aumento de 10 a 30% nas vendas, cita prova social (Domino\'s, Cacau Show etc.).\nD — Desejo: aplica o SPIN em cima do que viu no Instagram do lead.\nA — Ação: contorna objeção com a matriz, marca a videochamada e usa gatilho de compromisso pra confirmar.',
      },
      {
        pergunta: 'O lead quer fechar direto pelo WhatsApp e não quer entrar na call, o que eu faço?',
        palavrasChave: ['whatsapp', 'sem call', 'nao quer reuniao', 'videochamada'],
        resposta: 'Reforça que a call é curta (30 min) e é o momento de tirar dúvidas e validar se a ferramenta serve pra operação dele antes de contratar. Oferece um horário específico ainda hoje: "Tenho horário disponível às [horário], você teria disponibilidade?"',
      },
      {
        pergunta: 'O lead tá impaciente com as perguntas de qualificação, como conduzo?',
        palavrasChave: ['impaciente', 'insatisfeito', 'qualificacao', 'perguntas demais'],
        resposta: 'Tenta ligar pro lead; se não conseguir, abre exceção no processo e responde direto às perguntas dele, buscando marcar a reunião rápido: "Entendo que você tá com pressa, mas preciso entender sua operação pra te passar o plano certo. Qual dificuldade te fez se interessar pelo sistema?"',
      },
      {
        pergunta: 'O lead pediu material com preços e funcionalidades antes da call, o que respondo?',
        palavrasChave: ['material', 'pdf', 'antes da call', 'enviar preco'],
        resposta: 'Explica que na videochamada o especialista mostra tudo personalizado pra operação dele, e ali mesmo já tira as dúvidas que apareceriam se ele visse um material sozinho — evita que ele avalie sem contexto.',
      },
      {
        pergunta: 'O lead quer prioridade urgente na ativação, posso prometer?',
        palavrasChave: ['urgencia', 'prioridade', 'inauguracao', 'prazo'],
        resposta: 'Pode condicionar o fechamento à prioridade ("Se eu conseguir isso pra você, fechamos hoje?"), mas NÃO promete sozinho — precisa consultar as lideranças de Implementação e Ativação no grupo #prioridades_de_clientes no Slack antes de confirmar pro lead.',
      },
      {
        pergunta: 'O lead disse que a ferramenta que ele já usa tem tudo que a gente tem, como contorno?',
        palavrasChave: ['concorrente', 'ja uso', 'outra ferramenta'],
        resposta: 'Pergunta se ele identifica algum ponto de melhoria no sistema atual — é comum ferramentas concorrentes parecerem completas mas terem funcionalidades incompletas ou em módulos separados. "O que você usa hoje e sente que poderia ser melhor?"',
      },
      {
        pergunta: 'O lead disse que as vendas dele estão fracas e não é bom momento, como contorno?',
        palavrasChave: ['ceticismo', 'vendas fracas', 'nao e bom momento'],
        resposta: 'Pergunta se ele já teve dificuldade de atender no WhatsApp e se isso compromete o atendimento. Automatizando esse processo ele evita perder pedidos e ainda constrói base de clientes pra fidelizar — justamente pra reverter esse momento fraco.',
      },
      {
        pergunta: 'O lead pediu pra mandar por WhatsApp e ele dá retorno depois, como contorno?',
        palavrasChave: ['manda no whatsapp', 'depois eu vejo', 'dispensa'],
        resposta: 'Tudo bem passar por WhatsApp, mas antes pergunta qual o principal desafio da operação dele — assim você manda exatamente o que faz sentido pra ele avaliar, em vez de material genérico.',
      },
    ],
  },
  {
    id: 'vithoria',
    artigo: 'a',
    nome: 'Vivi',
    cargo: 'Vithoria Rodrigues · Liderança de Pré-Vendas',
    foto: '/tira-duvidas/vithoria.jpg',
    slack: '@vithoria',
    topico: 'Planos & Preços',
    tema: 'Planos, preços e parcerias',
    saudacao: 'Oi, tudo bem? Sou a Vivi. Vou verificar.',
    perguntas: [
      {
        pergunta: 'Quais são os planos disponíveis e quanto custam?',
        palavrasChave: ['planos', 'preco', 'valor', 'mensalidade', 'mesas', 'delivery', 'premium'],
        resposta: 'Mesas: R$139,99/mês (anual) — cardápio mesas + balcão, PDV, disparador, automações, cupons, KDS e fiado.\nDelivery: R$179,99/mês (anual) — tudo do Mesas + cardápio delivery, ChatBot com IA, pagamento online, fidelidade, Meta Ads e Google Ads.\nPremium: R$239,99/mês (anual) — tudo do Delivery + integração iFood e gestão de entregadores.',
      },
      {
        pergunta: 'Quais módulos adicionais existem e quanto custam?',
        palavrasChave: ['modulo', 'add-on', 'adicional', 'extra', 'totem'],
        resposta: 'iFood: R$29,99/mês\nEstoque Avançado: R$29,99/mês\nCupom Fiscal: R$69,99/mês\nEntregadores: R$54,99/mês\nFinanceiro: R$69,99/mês\nTotem de Autoatendimento: R$99,99 por dispositivo/mês',
      },
      {
        pergunta: 'Existe desconto por fidelidade/recorrência?',
        palavrasChave: ['desconto', 'fidelidade', 'anual', 'semestral', 'trimestral'],
        resposta: 'Sim, desconto de parceria por recorrência:\n• Anual: 5% → Mesas R$132,99 | Delivery R$170,99 | Premium R$227,99\n• Semestral: 7% → Mesas R$139,49 | Delivery R$176,69 | Premium R$232,49\n• Trimestral: 9% → Mesas R$145,59 | Delivery R$181,99 | Premium R$236,59\n• Mensal: 15% → Mesas R$144,49 | Delivery R$178,49 | Premium R$229,49',
      },
      {
        pergunta: 'Existe promoção pra usar em negociação?',
        palavrasChave: ['promocao', 'negociacao', 'desconto extra'],
        resposta: 'Sim, promoção pros 3 primeiros meses:\n• 20% off: Mesas R$135,99 | Delivery R$167,99 | Premium R$215,99\n• 30% off: Mesas R$118,99 | Delivery R$146,99 | Premium R$188,99\nApós os 3 meses volta pro valor mensal padrão. Use com critério, não é pra qualquer negociação.',
      },
      {
        pergunta: 'Como funciona a etapa de Parcerias na jornada do lead?',
        palavrasChave: ['parceria', 'parceiro', 'indicacao', 'agencia', 'influenciador'],
        resposta: 'Parcerias fica logo no início da jornada: agências, gestores de tráfego e influenciadores indicam clientes pra CW e recebem comissão quando o cliente indicado fecha contrato. É um canal de entrada de leads, junto com Marketing/Growth.',
      },
      {
        pergunta: 'Onde vejo o tier e a comissão de cada parceiro?',
        palavrasChave: ['tier', 'comissao', 'faixa', 'percentual'],
        resposta: 'Essa parte ainda não tá documentada aqui no playbook — o Playbook de Parcerias tá em construção pela liderança. Me chama no Slack (@vithoria) que eu te aponto quem responde certinho o tier e a comissão do caso específico.',
      },
      {
        pergunta: 'O lead só quer saber o preço logo de cara, o que eu falo?',
        palavrasChave: ['so quer o preco', 'quanto custa logo', 'valores inicio'],
        resposta: 'Fala que os planos começam a partir de R$139,99/mês (anual), mas que antes de falar de preço você precisa entender a operação dele — assim você indica o plano certo e mostra como o investimento se paga já nos primeiros meses.',
      },
      {
        pergunta: 'O lead achou caro, como eu contorno?',
        palavrasChave: ['achei caro', 'muito caro', 'objecao preco'],
        resposta: 'Se achou caro é porque ainda não vimos todo o valor da ferramenta juntos. O disparador de WhatsApp, por exemplo, costuma pagar vários meses de mensalidade com um único disparo bem feito — oferece mostrar como funciona.',
      },
      {
        pergunta: 'O lead pediu teste grátis, existe?',
        palavrasChave: ['teste gratis', 'periodo de teste', 'garantia', 'reembolso', 'devolucao'],
        resposta: 'Teste grátis a gente não tem, mas tem algo melhor: garantia de satisfação com reembolso integral, contada a partir da contratação. Planos mensal e trimestral têm 10 dias de garantia; semestral e anual têm 30 dias. Se não fizer sentido pra operação do lead, devolve sem burocracia.',
      },
    ],
  },
  {
    id: 'bibi',
    artigo: 'a',
    nome: 'Bibi',
    cargo: 'Gabrielly Oliveira · PSM',
    foto: '/tira-duvidas/bibi.jpg',
    slack: '@gabrielly',
    topico: 'Produto',
    tema: 'Produto: Totem, ChatBot IA, WhatsApp/Meta e CW App Store',
    saudacao: 'Oi, tudo bem? Sou a Bibi. Vou verificar.',
    perguntas: [
      {
        pergunta: 'O que é o Totem de Autoatendimento?',
        palavrasChave: ['totem', 'autoatendimento'],
        resposta: 'É um módulo extra (R$99,99 por dispositivo/mês) que transforma qualquer tablet ou monitor touchscreen num totem: o cliente navega pelo cardápio, escolhe complementos, se identifica, escolhe "comer aqui" ou "para levar", aplica cupom e paga sozinho — sem garçom.',
      },
      {
        pergunta: 'Quais dispositivos são compatíveis com o Totem?',
        palavrasChave: ['dispositivo', 'tablet', 'hardware totem'],
        resposta: 'O totem é um site web — funciona em qualquer touchscreen com navegador (Android, Windows ou Linux): tablet, PC com monitor touch ou totem tradicional. A CW não vende hardware nem tem parceiro oficial de equipamento; o cliente compra no mercado.',
      },
      {
        pergunta: 'Quais formas de pagamento o Totem aceita?',
        palavrasChave: ['pagamento totem', 'pix', 'cartao totem'],
        resposta: 'Dinheiro (sempre disponível), Pix automático (via Tuna), e cartão de crédito/débito — esses dois últimos exigem terminal de pagamento Smart TEF vinculado ao totem. Precisa ter pelo menos uma forma configurada.',
      },
      {
        pergunta: 'O que é o ChatBot com Inteligência Artificial?',
        palavrasChave: ['chatbot', 'ia', 'inteligencia artificial', 'automacao whatsapp'],
        resposta: 'Ferramenta de automação de atendimento no WhatsApp: recebe pedidos, responde dúvidas e conduz o cliente pelo fluxo de compra sem atendente humano. Disponível nos planos Delivery e Premium.',
      },
      {
        pergunta: 'O que muda com a integração oficial com a Meta?',
        palavrasChave: ['meta', 'whatsapp oficial', 'api whatsapp', 'coexistencia'],
        resposta: 'ChatBot e notificações passam a rodar pela infraestrutura oficial da Meta — mais estável, sem precisar deixar computador ligado com WhatsApp Web aberto. Tem suporte a coexistência: o número continua sendo usado normalmente pelos atendentes ao mesmo tempo que roda a automação. O envio de campanhas por essa API ainda não está disponível.',
      },
      {
        pergunta: 'O cliente perde o WhatsApp Business ao conectar a integração oficial?',
        palavrasChave: ['perder whatsapp', 'whatsapp business'],
        resposta: 'Não. Com a coexistência habilitada, o mesmo número continua sendo usado normalmente pelo time do cliente no WhatsApp Business e Web, ao mesmo tempo que as automações rodam por trás.',
      },
      {
        pergunta: 'O que é a CW App Store?',
        palavrasChave: ['cw app store', 'marketplace', 'integracoes'],
        resposta: 'É o marketplace de integrações da CW dentro do portal — reúne apps próprios e de parceiros (gestão, marketing, delivery, chatbot etc.) num catálogo único, com instalação, avaliações e permissões (OAuth 2.0) por app, de forma mais segura e organizada que o modelo antigo de token único.',
      },
      {
        pergunta: 'O que é o KDS?',
        palavrasChave: ['kds', 'kitchen display', 'cozinha'],
        resposta: 'Kitchen Display System — tela de gestão de pedidos na cozinha. Os pedidos chegam automaticamente, eliminando comanda de papel e reduzindo erro. Disponível no plano Mesas.',
      },
    ],
  },
];
