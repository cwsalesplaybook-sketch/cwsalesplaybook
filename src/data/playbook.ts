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
    descricao: 'Perguntas para entender o contexto atual do lead e como ele opera hoje.',
    exemplo: '"Quantos pedidos você recebe por dia? E no WhatsApp? Como você controla seus pedidos hoje?"',
  },
  {
    letra: 'P',
    nome: 'Problema',
    cor: 'red' as const,
    descricao: 'Perguntas para identificar dores e dificuldades concretas da operação.',
    exemplo: '"Você já recebeu alguma reclamação por demora no atendimento ou por anotar pedido errado? Sente que isso tá te fazendo perder vendas?"',
  },
  {
    letra: 'I',
    nome: 'Implicação',
    cor: 'yellow' as const,
    descricao: 'Perguntas que ampliam o impacto do problema — fazem o lead sentir o custo real da dor.',
    exemplo: '"Quando seu cliente demora a ser atendido, como você acha que isso impacta nas suas vendas? Você não acha arriscado a sua empresa não ter nenhuma forma previsível de aumentar o faturamento?"',
  },
  {
    letra: 'N',
    nome: 'Necessidade de Solução',
    cor: 'green' as const,
    descricao: 'Perguntas que criam a visão da solução ideal e levam o lead a articular o valor por conta própria.',
    exemplo: '"Se você tivesse um atendimento rápido e sem a necessidade de um atendente, quais vantagens você acha que isso traria? Se o cardápio ficasse sempre na mesa, você acha que o seu cliente compraria mais?"',
  },
];

export interface SpinFuncionalidade {
  funcionalidade: string;
  situacao: string;
  problema: string;
  implicacao: string;
  necessidade: string;
  apresentacao: string;
}

export const SPIN_FUNCIONALIDADES: SpinFuncionalidade[] = [
  {
    funcionalidade: 'Automatização de pedidos de delivery',
    situacao: 'Quantos pedidos você recebe por dia? E no WhatsApp? E mesmo na hora movimentada do dia, você ainda consegue me garantir que o atendimento é rápido? E que nenhum cliente passa batido?',
    problema: 'E mesmo na hora movimentada do dia, você ainda consegue garantir que o atendimento é rápido e que nenhum cliente passa batido?',
    implicacao: 'Quando seu cliente demora a ser atendido, como você acha que isso impacta nas suas vendas?',
    necessidade: 'Se você tivesse um atendimento rápido e sem a necessidade de um atendente, quais vantagens você acha que isso traria? (Corte de custo com funcionário, aumento de vendas, escala no atendimento)',
    apresentacao: 'Com relação à automação dos seus pedidos de delivery, nós temos: Cardápio digital, ChatBot com Inteligência Artificial, Extensão para o atendente fazer pedidos dentro do próprio WhatsApp Web.',
  },
  {
    funcionalidade: 'Disparador de mensagens de WhatsApp',
    situacao: 'Qual sua estratégia de crescimento para os próximos meses?',
    problema: 'Se sua demanda começasse a cair a partir de hoje, o que você faria?',
    implicacao: 'Você não acha arriscado a sua empresa não ter nenhuma forma previsível de se programar para aumentar seu faturamento?',
    necessidade: 'Se você tivesse o poder de mandar uma mensagem para todos os seus clientes em questão de minutos, qual estratégia você usaria para vender mais?',
    apresentacao: 'A nossa ferramenta tem implantado um disparador de mensagens em massa no WhatsApp, que te permite alcançar milhares de clientes em questão de minutos, disparando ofertas, imagens, cupons, pesquisas de satisfação, falando o nome do cliente. Somos a ferramenta mais indicada para quem faz tráfego pago — mais de 200 agências parceiras.',
  },
  {
    funcionalidade: 'Sistema de gestão com notas fiscais e iFood',
    situacao: 'Você já usa alguma ferramenta para gerenciar seus pedidos e emitir notas fiscais? Como você faz para garantir que a sua empresa está funcionando corretamente?',
    problema: 'Se você viajasse hoje e só voltasse daqui a 1 mês, sua empresa funcionaria normalmente sem você?',
    implicacao: 'Caso você conseguisse gerenciar a sua operação de forma remota, como isso impactaria sua vida?',
    necessidade: 'Se você conseguisse unir todas as ferramentas que precisa num único sistema, quais seriam as vantagens? (Corte de custos, facilidade de aprendizado, centralização dos dados)',
    apresentacao: 'A gente consegue te ajudar na parte de controle de estoque, caixa, gestão de pedido na cozinha por tela (KDS), controle de fiado, relatórios de vendas. Integramos com Foody Delivery, Pick N Go, iFood Entregas e F360.',
  },
  {
    funcionalidade: 'Cardápio digital para mesa',
    situacao: 'Hoje como funciona seu atendimento presencial? Quantos cardápios para cada mesa no presencial?',
    problema: 'Você sente alguma dificuldade em trabalhar com cardápios físicos? (Atualização de preço, rotacionar cardápios)',
    implicacao: 'Você não sente que os seus clientes ficam irritados quando demoram a ser atendidos? Como você acha que isso impacta na sua operação?',
    necessidade: 'Se o cardápio ficasse sempre na mesa, você acha que o seu cliente compraria mais? Se você pudesse atualizar seu cardápio em questão de minutos, como você usaria isso a seu favor?',
    apresentacao: 'Seu cliente consegue fazer o pedido direto do celular dele e já enviar para a cozinha de forma automática, sem a necessidade de um garçom. Você também pode atualizar o cardápio em minutos, testar produtos novos e atualizar preços com agilidade.',
  },
  {
    funcionalidade: 'Gestão de agendamentos',
    situacao: 'Hoje como os clientes fazem para agendar um pedido com vocês?',
    problema: 'Quando o cliente quer fazer um pedido e não tem ninguém disponível para falar com ele, como você faz?',
    implicacao: 'Você não acha que isso prejudica a experiência do seu cliente e pode te fazer perder, tanto vendas quanto clientes?',
    necessidade: 'E se o seu cliente pudesse agendar um pedido na hora que ele quisesse, independente da sua loja estar aberta ou não, como isso impactaria nas suas vendas?',
    apresentacao: 'A nossa gestão de agendamentos permite o controle de regras específicas para cada operação de pedidos, definindo os dias e horários que o cliente pode selecionar para receber ou pegar seus pedidos, sem precisar de ninguém para combinar o agendamento.',
  },
  {
    funcionalidade: 'Totem de autoatendimento',
    situacao: 'Hoje como funciona o atendimento presencial no seu estabelecimento? Você tem garçons ou atendentes para receber os pedidos?',
    problema: 'Você já teve situação em que os clientes esperaram muito para ser atendidos na fila? Já perdeu cliente por causa disso?',
    implicacao: 'Quanto você acha que esse tempo de espera impacta nas suas vendas? Você já calculou quantos pedidos poderiam ser feitos se cada cliente atendesse a si mesmo?',
    necessidade: 'Se o seu cliente pudesse fazer o pedido sozinho em um totem, sem precisar de um atendente, como isso mudaria a operação do seu estabelecimento? Você consegue imaginar a fila fluindo mais rápido e o custo com atendentes reduzindo?',
    apresentacao: 'O Totem de Autoatendimento da Cardápio Web permite que o cliente faça o pedido completo sozinho, com pagamento integrado (Pix, cartão, dinheiro), vinculado ao programa de fidelidade e ao mesmo cardápio do balcão. É um módulo extra de R$99,99 por dispositivo, funciona em qualquer tablet ou monitor touchscreen.',
  },
];

export const BANT = [
  {
    letra: 'B',
    nome: 'Budget (Orçamento)',
    desc: 'Tá ótimo, agora vamos falar de valores, nossos preços variam de R$145 a R$400 por mês a depender do que você precisa na sua operação e da fidelidade que você escolher. Esses valores estão dentro do seu orçamento?',
  },
  {
    letra: 'A',
    nome: 'Authority (Autoridade)',
    desc: 'Maravilha, tem mais alguém que você ache importante participar desse projeto junto com você?',
  },
  {
    letra: 'N',
    nome: 'Need (Necessidade)',
    desc: 'Com base no que a gente conversou, numa escala de 0 a 10, sendo 10 a prioridade máxima, qual seria a prioridade para você? (Comente apenas sobre os pontos que o lead se identificou: automatizar pedidos, ter mais vendas via WhatsApp, gerenciar com um único sistema, aumentar eficiência no presencial)',
  },
  {
    letra: 'T',
    nome: 'Timeline (Tempo)',
    desc: 'Perfeito, e outra coisa importante: às vezes você pode considerar uma prioridade, mas tá sem tempo para botar em prática agora. Então só para a gente alinhar — quando você acha que poderia iniciar esse nosso projeto?',
  },
];

export interface Hack {
  titulo: string;
  contexto: string;
  como_conduzir: string;
}

export const HACKS: Hack[] = [
  {
    titulo: 'Envia o lead para fechar na reunião',
    contexto: 'O lead já demonstrou sinais claros que gostaria de fechar, porém não quer a videochamada e prefere seguir pelo WhatsApp.',
    como_conduzir: 'Entendo [NOME], sei que sua rotina é bem corrida e imagino que o tempo seja curto, mas a videochamada tem uma duração curta de 30 minutos, seria muito importante você participar para tirar suas dúvidas, validar se a ferramenta é o que você busca e seguir para a contratação com nosso especialista. Dessa forma você até comprova tudo isso que estou te passando já que estará vendo o sistema. Tenho horário disponível para hoje às [horário], você teria disponibilidade?',
  },
  {
    titulo: 'Lead demonstrou insatisfação com o processo de perguntas',
    contexto: 'O lead demonstra insatisfação com o processo de qualificação.',
    como_conduzir: 'Tente ligar para o lead e, caso não consiga conexão na ligação, abra uma exceção ao processo e busque responder diretamente às perguntas do lead com intuito de marcar uma reunião rapidamente. Na ligação: "Entendo [NOME], sei que você está com pressa para saber as informações, mas preciso entender como funciona a sua operação para te passar o plano mais adequado. Me diz qual a dificuldade que você enfrenta que te fez se interessar pelo nosso sistema?"',
  },
  {
    titulo: 'Lead pediu para enviar um material com funcionalidades e planos',
    contexto: 'O lead quer um material que contenha as funcionalidades e os valores dos planos para analisar e validar com outra pessoa.',
    como_conduzir: 'Entendo [NOME], para isso temos uma videochamada onde nosso especialista vai te mostrar como funciona todo o sistema. Esse momento é importante porque ele vai analisar toda a necessidade da sua operação e separar um momento para te atender de acordo com essas necessidades. Imagina que eu te mando um material mas surgem várias dúvidas — na videochamada nosso especialista consegue te mostrar como funciona e tirar suas dúvidas para que você valide tudo.',
  },
  {
    titulo: 'Lead está com urgência e quer prioridade',
    contexto: 'O lead só quer contratar se conseguir uma prioridade para que o sistema esteja pronto no dia seguinte, pois já vai inaugurar e precisa do cardápio funcionando e da configuração da impressora.',
    como_conduzir: 'SDR: "Se eu conseguir essa prioridade para você, fechamos negócio ainda hoje?"\nLEAD: Sim, fechamos, estou com urgência!\n\nObs: O SDR deve consultar as lideranças de Implementação e Ativação via grupo #prioridades_de_clientes no Slack e aguardar retorno antes de confirmar para o lead.',
  },
];

export interface AidaEtapa {
  letra: string;
  nome: string;
  estrutura: string;
  roteiro: string;
}

export const AIDA: AidaEtapa[] = [
  {
    letra: 'A',
    nome: 'Atenção',
    estrutura: 'Introdução + Rapport + Pedir 2 minutos',
    roteiro: 'Saudações e introduzir seu nome e perguntar se está tudo bem com o lead.\n\nExplique que está fazendo um mapeamento nas empresas [nicho] da região [cidade], e percebeu que a empresa do lead é muito bem recomendada — inclusive mencione que tem um amigo [nome] que pede lá com frequência e sempre fala bem da comida [tipo].\n\nPeça 2 minutos para conversar.',
  },
  {
    letra: 'I',
    nome: 'Interesse',
    estrutura: 'Benefícios + Prova social + Perguntar se há interesse',
    roteiro: 'Diga que trabalha com uma solução que aumenta de 10 a 30% as vendas de empresas [nicho] que trabalham diretamente com WhatsApp.\n\nMencione que esse trabalho já foi feito com empresas como Domino\'s, Cacau Show, Puro Açaí, Carol Coxinhas, DuckBill, Pizza Crec (adapte ao nicho e cidade).\n\nReforce que sempre aumenta de 10 a 30% as vendas.\n\nPergunte se o lead teria interesse em ter esse aumento de vendas na sua operação também.',
  },
  {
    letra: 'D',
    nome: 'Desejo',
    estrutura: 'Contextualizar + Elogiar Instagram + Aplicar SPIN',
    roteiro: 'Explique que viu a empresa no Instagram e percebeu que recebem pedidos no WhatsApp. Elogie o trabalho que o lead tem feito no Instagram.\n\nAplique o SPIN associado ao produto:\n→ Quantos pedidos num dia movimentado?\n→ Você já recebeu alguma reclamação por demora no atendimento ou por anotar pedido errado?\n→ Sente que isso tá te fazendo perder vendas?\n→ E se a gente conseguisse garantir que todos os seus clientes vão ser atendidos rapidamente e que nenhum pedido vai ser anotado errado, você acredita que isso aumentaria suas vendas?\n\nAo final, pergunte ao lead se o que conversaram até aquele momento faz sentido.',
  },
  {
    letra: 'A',
    nome: 'Ação',
    estrutura: 'Contornar objeções + Marcar videochamada + Gatilho de compromisso',
    roteiro: 'Se o lead trouxer objeções (preço, produto), use a matriz de objeções para contornar.\n\nExplique que com base no que conversaram, é certeza que o lead é exatamente o tipo de empresa que a gente atende. Reforce que além da automação, há diversas outras ferramentas de aumento de vendas.\n\nDeixe claro que essa ligação não tem intuito de vender — antes precisa apresentar a solução. Marque uma videochamada, de preferência no mesmo dia. Peça o e-mail.\n\nGatilho de compromisso: "O consultor tem uma agenda ocupada e é um dos maiores especialistas em automação de atendimento no WhatsApp. Você teria algum motivo para não estar presente no horário e data acordados [horário/data]?" → Confirme a reunião por WhatsApp.',
  },
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

export interface FaqItem {
  categoria: string;
  pergunta: string;
  resposta: string;
}

export const FAQ: FaqItem[] = [
  // ── TOTEM ──────────────────────────────────────────────────────────────────
  {
    categoria: 'Totem de Autoatendimento',
    pergunta: 'O que é o Totem de Autoatendimento?',
    resposta: 'É um módulo extra da Cardápio Web que transforma qualquer tablet ou monitor touchscreen em um totem de autoatendimento. O cliente faz o pedido completo sozinho — navega pelo cardápio, escolhe complementos, se identifica, escolhe "comer aqui" ou "para levar", aplica cupons e paga — sem precisar de garçom ou atendente.',
  },
  {
    categoria: 'Totem de Autoatendimento',
    pergunta: 'Quanto custa o módulo de Totem?',
    resposta: 'R$99,99 por dispositivo por mês. Cada totem cadastrado é um dispositivo independente. O acesso à tela de gestão de totens, terminais de pagamento e ao link do totem só fica disponível para clientes com o módulo ativo.',
  },
  {
    categoria: 'Totem de Autoatendimento',
    pergunta: 'Quais dispositivos são compatíveis?',
    resposta: 'O totem é um site web — funciona em qualquer dispositivo touchscreen com navegador: Android, Windows ou Linux. Pode ser um tablet, PC com monitor touch ou totem tradicional. A Cardápio Web não comercializa hardware e não tem parceiros oficiais no momento. O cliente busca o equipamento no mercado conforme sua preferência.',
  },
  {
    categoria: 'Totem de Autoatendimento',
    pergunta: 'Os produtos do totem são os mesmos do cardápio digital?',
    resposta: 'Sim. Os produtos oferecidos no totem são os mesmos do cardápio digital, respeitando as regras de disponibilidade do link de balcão. Não é possível ter um cardápio diferente no totem.',
  },
  {
    categoria: 'Totem de Autoatendimento',
    pergunta: 'Quais formas de pagamento o totem aceita?',
    resposta: 'Dinheiro (padrão, sempre habilitado), Pix automático via Tuna (requer conta de Pix Automático ativa no sistema), Cartão de crédito e Cartão de débito (requerem terminal de pagamento Smart TEF vinculado ao totem). É obrigatório ter pelo menos uma forma de pagamento configurada.',
  },
  {
    categoria: 'Totem de Autoatendimento',
    pergunta: 'Como vincular o totem ao dispositivo?',
    resposta: '3 passos:\n1. Abrir o link do totem no navegador do dispositivo touchscreen.\n2. No portal, ir em Configurações > Dispositivos > Totens, clicar em "Adicionar totem", dar um nome e clicar em "Gerar código de vínculo" — aparece um código de 6 dígitos com tempo de expiração.\n3. Inserir o código na tela "Vincular Totem" que está aberta no equipamento.',
  },
  {
    categoria: 'Totem de Autoatendimento',
    pergunta: 'O totem tem suporte a impressora?',
    resposta: 'Inicialmente o totem foi desenvolvido para funcionar sem impressora. Para estabelecimentos que quiserem imprimir pedidos após o envio, essa opção está disponível apenas para dispositivos com Windows.',
  },
  {
    categoria: 'Totem de Autoatendimento',
    pergunta: 'O que é o "Chamariz" e o "Banner"?',
    resposta: 'Chamariz: mídias (imagens ou vídeos verticais) que aparecem na tela inicial do totem quando não há atendimento em andamento. Aceita JPG, PNG, WEBP, HEIC (até 10 MB) e MP4, MOV, WebM etc. (até 50 MB). Limite de 5 mídias.\n\nBanners: mídias que aparecem na página do cardápio do totem, em carrossel. Se nenhuma for adicionada, o totem usa o mesmo banner do cardápio digital.',
  },
  {
    categoria: 'Totem de Autoatendimento',
    pergunta: 'O cancelamento de pedido faz estorno automático?',
    resposta: 'Depende da forma de pagamento:\n• Pix: sim — ao cancelar no portal, o estorno é realizado automaticamente pelo sistema. O cliente também pode cancelar diretamente no totem antes de concluir o pagamento.\n• Cartão de crédito/débito: NÃO há estorno automático. O procedimento deve ser feito diretamente no sistema do banco ou na própria maquininha.',
  },
  {
    categoria: 'Totem de Autoatendimento',
    pergunta: 'O totem tem programa de fidelidade?',
    resposta: 'Sim. O cliente se identifica obrigatoriamente pelo telefone (via teclado numérico em tela), o que vincula o pedido ao programa de fidelidade para acúmulo de recompensas e recebimento de ofertas. Se já for cadastrado, não precisa informar o nome. Se for novo, uma segunda tela solicita o nome.',
  },
  {
    categoria: 'Totem de Autoatendimento',
    pergunta: 'É possível usar cupons de desconto no totem?',
    resposta: 'Sim, mas apenas cupons com código. No totem não há aplicação automática de descontos — o cliente precisa inserir o código manualmente na etapa de confirmação do pedido.',
  },
  {
    categoria: 'Totem de Autoatendimento',
    pergunta: 'Como funciona o terminal de pagamento (maquininha)?',
    resposta: 'O vínculo do terminal se dá via Smart TEF. Cada totem pode ter seu próprio terminal vinculado. O processo: no portal, acessar "Configurações > Dispositivos > Terminais de pagamento", adicionar o terminal, selecionar a marca da maquininha e seguir as instruções detalhadas de instalação do app Smart TEF — algumas marcas requerem contato com o suporte da CW.',
  },
  // ── PLANOS & PREÇOS ────────────────────────────────────────────────────────
  {
    categoria: 'Planos & Preços',
    pergunta: 'Quais são os planos disponíveis?',
    resposta: 'Mesas: R$139,99/mês (anual) — cardápio para mesas e balcão, PDV, disparador de mensagens, automações, cupons, KDS e fiado.\n\nDelivery: R$179,99/mês (anual) — tudo do Mesas + cardápio delivery, ChatBot com IA, pagamento online, fidelidade, Meta Ads e Google Ads.\n\nPremium: R$239,99/mês (anual) — tudo do Delivery + integração iFood, gestão de entregadores.',
  },
  {
    categoria: 'Planos & Preços',
    pergunta: 'Quais módulos add-on existem e quanto custam?',
    resposta: 'iFood: R$29,99/mês\nEstoque Avançado: R$29,99/mês\nCupom Fiscal: R$69,99/mês\nEntregadores: R$54,99/mês\nFinanceiro: R$69,99/mês\nTotem de autoatendimento: R$99,99 por dispositivo/mês',
  },
  {
    categoria: 'Planos & Preços',
    pergunta: 'Há descontos por fidelidade?',
    resposta: 'Sim, descontos de parceria:\n• Anual: 5% → Mesas R$132,99 | Delivery R$170,99 | Premium R$227,99\n• Semestral: 7% → Mesas R$139,49 | Delivery R$176,69 | Premium R$232,49\n• Trimestral: 9% → Mesas R$145,59 | Delivery R$181,99 | Premium R$236,59\n• Mensal: 15% → Mesas R$144,49 | Delivery R$178,49 | Premium R$229,49',
  },
  {
    categoria: 'Planos & Preços',
    pergunta: 'Existe promoção para negociação?',
    resposta: 'Sim, promoções para os primeiros 3 meses:\n• 20% de desconto: Mesas R$135,99 | Delivery R$167,99 | Premium R$215,99\n• 30% de desconto: Mesas R$118,99 | Delivery R$146,99 | Premium R$188,99\nApós os 3 meses, retorna ao valor mensal padrão. Use com critério.',
  },
  // ── PRODUTO ────────────────────────────────────────────────────────────────
  {
    categoria: 'Produto',
    pergunta: 'O que é o ChatBot com Inteligência Artificial?',
    resposta: 'É uma ferramenta de automação de atendimento no WhatsApp que recebe pedidos, responde dúvidas e conduz o cliente pelo fluxo de compra sem precisar de atendente humano. Disponível nos planos Delivery e Premium.',
  },
  {
    categoria: 'Produto',
    pergunta: 'O que é o disparador de mensagens?',
    resposta: 'Ferramenta de envio de mensagens em massa via WhatsApp para a base de clientes. Permite disparar ofertas, cupons, imagens e mensagens personalizadas (com nome do cliente) para milhares de clientes em minutos. Somos a ferramenta mais indicada por mais de 200 agências de marketing parceiras.',
  },
  {
    categoria: 'Produto',
    pergunta: 'O cardápio digital funciona no iFood?',
    resposta: 'O cardápio digital da CW é independente do iFood. O módulo iFood (R$29,99/mês) integra os pedidos do iFood ao sistema da CW para gerenciamento centralizado. O plano Premium já inclui a integração com iFood e Entrega Fácil.',
  },
  {
    categoria: 'Produto',
    pergunta: 'O que é o KDS?',
    resposta: 'Kitchen Display System — tela de gestão de pedidos na cozinha. Os pedidos chegam automaticamente na tela da cozinha, eliminando comandas em papel e reduzindo erros. Disponível no plano Mesas.',
  },
];
