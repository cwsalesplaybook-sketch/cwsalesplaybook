/** Roleplay do SDR — "Sala de Call": conteúdo declarativo do jogo (motor em
 *  src/lib/roleplay/engine.ts). Adaptado de um protótipo standalone que
 *  simulava a call de FECHAMENTO do Closer — aqui o jogador é o SDR: o
 *  objetivo nunca é vender, é qualificar (SPIN/BANT) e agendar a reunião
 *  com o consultor (Closer). "Fechar" virou "agendar"; a família de cartas
 *  que era de negociação de preço/desconto virou negociação de AGENDA
 *  (vencer "me manda no WhatsApp", "não tenho tempo agora", "essa call é
 *  necessária?"). Ids de carta são estáveis mesmo onde o texto mudou, pra
 *  não quebrar as referências em personas.ts (overrides/gatilhoRaiz/eventos).
 *
 *  FALAS COM TOKEN: {campo} é substituído pelo ctx da persona (roleplayEngine.txt).
 *  Condições (`se`): conf/info/urg/pac (números 0-100, com {lt,lte,gt,gte,eq}),
 *  turno, fase ('inicio'|'meio'|'fim'), raiz/raizFalsa (bool), usou/naoUsou
 *  (id de carta já jogada), usouAlgum (array de ids). */

export interface CartaEfeito {
  se?: Record<string, unknown>;
  ef: { conf?: number; info?: number; urg?: number; pac?: number };
  fala?: string;
  tell?: string;
  dica?: string;
  exigeEscuta?: boolean;
}

export interface Carta {
  id: string;
  nome: string;
  familia: 'diagnostico' | 'escuta' | 'valor' | 'negociacao' | 'fechamento' | 'raiz';
  desc: string;
  naoConta?: boolean;
  fecha?: boolean;
  encerraSuave?: boolean;
  bloqueada?: boolean;
  efeitos: CartaEfeito[];
}

export const MEDIDORES = {
  conf: { nome: 'Confiança', desc: 'O quanto ele confia em você.' },
  info: { nome: 'Informação', desc: 'O quanto você sabe da operação dele (SPIN).' },
  urg: { nome: 'Urgência', desc: 'O quanto ele sente que precisa agir agora.' },
  pac: { nome: 'Paciência', desc: 'Tempo e boa vontade que ainda restam pra call.' },
};

/** O que o jogo entrega de pista DURANTE a call, por dificuldade. No Difícil
 *  e no Muito difícil o SDR joga às cegas — a leitura vem só do traço, da
 *  postura e da fala. Tudo é explicado no debrief. */
export const REVELACAO: Record<string, {
  badgeRaiz: boolean; badgeJanela: boolean; badgeFalsa: boolean; dica: boolean;
  clima: boolean; aviso: boolean; interroga: number; resistencia: boolean;
}> = {
  'Treino': { badgeRaiz: true, badgeJanela: true, badgeFalsa: true, dica: true, clima: true, aviso: true, interroga: 4, resistencia: false },
  'Média': { badgeRaiz: true, badgeJanela: true, badgeFalsa: false, dica: false, clima: true, aviso: true, interroga: 4, resistencia: false },
  'Difícil': { badgeRaiz: false, badgeJanela: false, badgeFalsa: false, dica: false, clima: true, aviso: false, interroga: 3, resistencia: true },
  'Muito difícil': { badgeRaiz: false, badgeJanela: false, badgeFalsa: false, dica: false, clima: false, aviso: false, interroga: 3, resistencia: true },
};

export const REGRAS = {
  drenoPaciencia: 3,
  drenoDiagnostico: 4,
  interrogatorioLimite: 3,
  interrogatorioPenal: { conf: -12, pac: -9 },
  interrogatorioFala: 'Peraí. Isso aqui tá virando um questionário. Você quer me ajudar ou me entrevistar?',
  interrogatorioTell: 'Ele recosta e cruza os braços. Você empilhou perguntas sem devolver nada.',
  escutaIgnoradaPenal: { conf: -16, pac: -8 },
  escutaIgnoradaTell: 'Ele te entregou algo pessoal e você seguiu o roteiro. A porta fechou.',
  janelaTurnos: 3,
  janelaCooldown: 3,
  decaimentoJanela: { urg: -18, conf: -9, pac: -6 },
  tetoSuave: { limite1: 62, mult1: 0.6, limite2: 80, mult2: 0.32 },
  repeticaoMult: 0.3,
};

export const CLIMA = [
  { se: { pac: { lt: 22 } }, texto: 'Ele olha o relógio pela segunda vez.' },
  { se: { conf: { lt: 25 } }, texto: 'Respostas de três palavras. O olhar não acompanha mais a tela.' },
  { se: { conf: { lt: 45 } }, texto: 'Postura fechada. Responde, mas não elabora.' },
  { se: { conf: { lt: 70 } }, texto: 'Ele acompanha o raciocínio e devolve uma pergunta ou outra.' },
  { texto: 'Ele se inclina pra frente. Está construindo junto com você.' },
];

export const POSTURAS = [
  { se: { pac: { lt: 20 } }, pose: 'relogio', rotulo: 'Olhando o relógio' },
  { se: { conf: { lt: 26 } }, pose: 'recuado', rotulo: 'Recostado, afastado da mesa' },
  { se: { conf: { lt: 44 } }, pose: 'cruzado', rotulo: 'Braços cruzados' },
  { se: { conf: { lt: 62 } }, pose: 'neutro', rotulo: 'Neutro, escutando' },
  { se: { urg: { gte: 58 } }, pose: 'inclinado', rotulo: 'Inclinado sobre a mesa' },
  { pose: 'aberto', rotulo: 'Aberto, gesticulando' },
];

/* ==========================================================
   BARALHO — famílias mapeiam pra SPIN (diagnóstico), rapport
   (escuta), prova de valor (valor), fricção de agenda
   (negociação — era preço/desconto no protótipo original, virou
   "por que ele hesita em marcar") e agendamento (era fechamento).
   ========================================================== */
export const CARTAS: Carta[] = [

  /* ---------- DIAGNÓSTICO (SPIN) ---------- */
  { id: 'passagem_bastao', nome: 'Retomar o gancho de entrada', familia: 'diagnostico', naoConta: true,
    desc: 'Confirma o motivo que trouxe ele até aqui (anúncio, indicação, formulário) e pede validação.',
    efeitos: [
      { se: { turno: { lte: 2 } }, ef: { conf: 9, info: 6, pac: 3 },
        fala: 'Isso mesmo. Pelo menos não vou ter que contar tudo de novo.',
        tell: 'Ele relaxa os ombros. Você economizou o tempo dele logo de cara.',
        dica: 'Abrir confirmando o que já se sabe dele compra confiança barato.' },
      { se: { fase: 'fim' }, ef: { conf: -3, info: 1, pac: -5 },
        fala: 'A essa altura eu esperava que você já soubesse disso.',
        tell: 'Recapitular no fim da call soa como quem não estava prestando atenção.' },
      { ef: { conf: 1, info: 2, pac: -4 },
        fala: 'A gente já não falou disso no começo?',
        tell: 'Recapitular tarde soa como desorganização.' },
    ] },

  { id: 'pergunta_aberta', nome: 'Pergunta aberta (Situação)', familia: 'diagnostico',
    desc: 'Situação: como a operação dele funciona hoje.',
    efeitos: [
      { se: { info: { lt: 40 }, turno: { lte: 5 } }, ef: { conf: 5, info: 13 },
        fala: 'Olha, hoje {operacao}.',
        tell: 'Ele destrava e fala por quase um minuto.',
        dica: 'Pergunta de situação cedo é barata e abre caminho pra tudo.' },
      { se: { info: { gte: 55 } }, ef: { conf: -7, info: 2, pac: -6 },
        fala: 'Cara, isso eu já te falei: {operacao}.',
        tell: 'Ele repete palavra por palavra o que já tinha dito.' },
      { ef: { conf: -1, info: 5, pac: -2 },
        fala: 'É mais ou menos como eu falei antes...',
        tell: 'Resposta encurtada. Ele já contou essa parte.' },
    ] },

  { id: 'pergunta_problema', nome: 'Pergunta de problema', familia: 'diagnostico',
    desc: 'O que trava, o que dá retrabalho, o que incomoda.',
    efeitos: [
      { se: { naoUsou: 'pergunta_aberta', info: { lt: 32 } }, ef: { conf: -6, info: 5, pac: -4 },
        fala: 'Problema? Assim, você nem sabe como eu trabalho ainda.',
        tell: 'Você pulou a situação e foi direto na dor. Ele reage à ordem, não à pergunta.' },
      { se: { info: { lt: 28 } }, ef: { conf: -6, info: 5, pac: -4 },
        fala: 'Problema? Sei lá, acho que tá funcionando.',
        tell: 'Cedo demais. Ele ainda não te deu contexto pra saber onde cutucar.' },
      { se: { info: { gte: 45 }, conf: { gte: 40 } }, ef: { conf: 6, info: 14, urg: 9 },
        fala: '{dor}',
        tell: 'Ele para de olhar a tela e olha pra você. Achou a ferida.',
        exigeEscuta: true,
        dica: 'Ele abriu uma dor real. A próxima jogada precisa ser escuta, não outra pergunta.' },
      { ef: { conf: 2, info: 8, urg: 4, pac: -3 },
        fala: 'Tem umas coisas que atrapalham, sim.',
        tell: 'Resposta morna. O problema existe, mas ele não se abriu.' },
    ] },

  { id: 'implicacao', nome: 'Pergunta de implicação', familia: 'diagnostico',
    desc: 'Quanto custa esse problema continuar existindo.',
    efeitos: [
      { se: { naoUsou: 'pergunta_problema' }, ef: { conf: -11, urg: 2, pac: -6 },
        fala: 'Custa o quê? A gente nem falou de problema ainda.',
        tell: 'Implicação sem dor mapeada não tem sobre o que incidir.' },
      { se: { info: { lt: 42 } }, ef: { conf: -10, urg: 3, pac: -6 },
        fala: 'Não sei te dizer. Nem sei se é tanto assim.',
        tell: 'Sem problema mapeado, implicação vira interrogatório.' },
      { se: { conf: { lt: 40 } }, ef: { conf: -6, urg: 6, pac: -5 },
        fala: 'Você tá tentando me fazer sentir que eu tô perdendo dinheiro, né?',
        tell: 'Ele percebeu a técnica. Implicação sem confiança soa manipulativa.' },
      { se: { info: { gte: 60 }, conf: { gte: 50 } }, ef: { conf: 8, info: 5, urg: 23 },
        fala: '{conta}',
        tell: 'Silêncio de três segundos. Ele está calculando.',
        exigeEscuta: true },
      { ef: { conf: 3, info: 4, urg: 13, pac: -3 },
        fala: 'É, atrapalha. A gente perde alguma coisa nisso.',
        tell: 'Reconhece o custo, mas ainda no abstrato.' },
    ] },

  { id: 'need_payoff', nome: 'Necessidade (need-payoff)', familia: 'diagnostico',
    desc: 'Faz o lead dizer em voz alta o valor de resolver.',
    efeitos: [
      { se: { naoUsou: 'implicacao', urg: { lt: 45 } }, ef: { conf: -5, urg: 4, pac: -5 },
        fala: 'Seria bom, claro. Mas nem sei quanto isso me custa hoje.',
        tell: 'Sem a conta do prejuízo, o ganho não tem tamanho.' },
      { se: { urg: { lt: 38 } }, ef: { conf: -5, urg: 4, pac: -5 },
        fala: 'Ajudaria, eu acho. Mas hoje não é meu maior problema.',
        tell: 'Sem urgência construída, soa como venda disfarçada.' },
      { se: { urg: { gte: 58 }, conf: { gte: 50 } }, ef: { conf: 11, urg: 14 },
        fala: '{ganho}',
        tell: 'Ele acabou de vender a solução pra ele mesmo.' },
      { ef: { conf: 4, urg: 8, pac: -3 },
        fala: 'Sim, resolveria parte do problema.',
        tell: 'Concordância educada, sem entusiasmo.' },
    ] },

  { id: 'checar_contradicao', nome: 'Checar a contradição', familia: 'diagnostico',
    desc: 'Aponta com cuidado o que não bate no que ele disse.',
    efeitos: [
      { se: { conf: { lt: 38 } }, ef: { conf: -9, pac: -6 },
        fala: 'Tá me chamando de mentiroso?',
        tell: 'Confrontar sem confiança vira acusação.' },
      { se: { info: { lt: 40 } }, ef: { conf: -5, info: 6, pac: -4 },
        fala: 'Contradição de quê? Eu quase não te falei nada ainda.',
        tell: 'Não há material suficiente pra confrontar.' },
      { ef: { conf: 10, info: 16 },
        fala: 'É... na verdade não é bem assim. {motivoOculto}.',
        tell: 'Ele corrige a própria versão e deixa escapar mais do que pretendia.' },
    ] },

  /* ---------- ESCUTA ---------- */
  { id: 'silencio', nome: 'Silêncio', familia: 'escuta',
    desc: 'Você para de falar e sustenta a pausa.',
    efeitos: [
      { se: { turno: { lte: 1 } }, ef: { conf: -6, pac: -4 },
        fala: '...alô? Caiu?',
        tell: 'Silêncio sem tensão prévia vira constrangimento técnico.' },
      { se: { pac: { lt: 25 } }, ef: { conf: -4, pac: -6 },
        fala: 'Olha, se não tiver mais nada eu preciso ir.',
        tell: 'Silêncio com quem tem pressa parece desperdício de tempo.' },
      { se: { usou: 'pergunta_problema', raiz: false }, ef: { conf: 9, info: 13, pac: 2 },
        fala: '{falaSilencio}',
        tell: 'Ele preenche o vazio — e o que sai é mais fundo do que a resposta anterior.' },
      { ef: { conf: 8, info: 10, pac: 2 },
        fala: '...é. E tem outra coisa que eu nem ia comentar: {operacao}.',
        tell: 'Ele preenche o vazio com contexto que você não tinha pedido.' },
    ] },

  { id: 'espelhamento', nome: 'Espelhamento', familia: 'escuta',
    desc: 'Repete as últimas palavras dele, em tom de pergunta.',
    efeitos: [
      { se: { usou: 'espelhamento' }, ef: { conf: -6, pac: -5 },
        fala: 'Você tá repetindo tudo que eu falo, tá reparando?',
        tell: 'Espelhar duas vezes na mesma call fica evidente.' },
      { se: { usou: 'pergunta_problema' }, ef: { conf: 7, info: 13, pac: 2 },
        fala: 'Complicado? É... complicado porque {motivoOculto}.',
        tell: 'A repetição abriu porta que a pergunta direta não abriria.' },
      { ef: { conf: 6, info: 9, pac: 2 },
        fala: 'É isso mesmo. {operacao}, e isso me incomoda.',
        tell: 'Ele elabora um pouco mais do que tinha dito.' },
    ] },

  { id: 'rotulagem', nome: 'Rotulagem', familia: 'escuta',
    desc: 'Nomeia a emoção: "parece que isso já te custou caro antes".',
    efeitos: [
      { se: { conf: { lt: 30 } }, ef: { conf: 3, info: 7 },
        fala: 'Não é bem isso não.',
        tell: 'Ele corrige o rótulo. Mesmo errado, fez ele falar.' },
      { se: { raiz: true }, ef: { conf: 9, info: 6, pac: 3 },
        fala: 'É, você já entendeu onde dói. Não preciso repetir.',
        tell: 'Rotular depois da raiz revelada consolida, mas rende menos.' },
      { ef: { conf: 13, info: 11, pac: 3 },
        fala: '{falaRotulo}',
        tell: 'Os ombros descem. Ser compreendido desarma mais rápido que argumento.' },
    ] },

  { id: 'auditoria_acusacao', nome: 'Auditoria de acusações', familia: 'escuta',
    desc: 'Antecipa em voz alta o que ele deve estar pensando de ruim sobre a ligação.',
    efeitos: [
      { se: { conf: { lt: 42 } }, ef: { conf: 15, info: 6, pac: 4 },
        fala: '{falaAuditoria}',
        tell: 'Ele ri. A objeção que ele guardava perdeu a munição.' },
      { se: { usou: 'auditoria_acusacao' }, ef: { conf: -4, pac: -4 },
        fala: 'Você já fez isso. Não precisa se antecipar de novo.',
        tell: 'A técnica exposta duas vezes perde o efeito.' },
      { ef: { conf: 3, pac: -3 },
        fala: 'Nem tinha pensado nisso, mas ok.',
        tell: 'Você levantou uma objeção que ainda não existia.' },
    ] },

  { id: 'pergunta_calibrada', nome: 'Pergunta calibrada', familia: 'escuta',
    desc: '"Como isso funcionaria aí dentro?" — devolve o problema pra ele.',
    efeitos: [
      { se: { usou: 'demo_dirigida' }, ef: { conf: 8, info: 13, urg: 9, pac: 1 },
        fala: 'Como? Eu já tô imaginando: {demoRes} E aí eu teria que ver com {equipe}.',
        tell: 'Ele projeta o uso em cima do que acabou de ver. É o encaixe perfeito da carta.' },
      { ef: { conf: 7, info: 12, urg: 5, pac: 1 },
        fala: 'Como? Boa pergunta... eu teria que ver com {equipe}.',
        tell: 'Ele começa a projetar o uso. Está pensando dentro do seu cenário.' },
    ] },

  { id: 'validar_sentimento', nome: 'Validar sem concordar', familia: 'escuta',
    desc: 'Acolhe a reclamação dele sem prometer nada.',
    efeitos: [
      { ef: { conf: 11, pac: 6 },
        fala: '{falaValidar}',
        tell: 'Validação sem defesa baixa a guarda. Defender aqui teria custado caro.' },
    ] },

  /* ---------- VALOR ---------- */
  { id: 'demo_dirigida', nome: 'Prévia dirigida', familia: 'valor',
    desc: 'Mostra rapidinho (print, vídeo curto, tela) só o que resolve a dor que ele citou.',
    efeitos: [
      { se: { naoUsou: 'pergunta_problema' }, ef: { conf: -9, info: 2, urg: 2, pac: -7 },
        fala: 'Dirigida a quê? Você ainda não sabe o que me incomoda.',
        tell: 'Prévia antes da dor é passeio de funcionalidade, e ele nota.' },
      { se: { info: { lt: 42 } }, ef: { conf: -8, info: 2, urg: 2, pac: -7 },
        fala: 'Legal... mas isso aí eu não sei se eu usaria.',
        tell: 'Prévia sem diagnóstico vira passeio de funcionalidade.' },
      { se: { info: { gte: 60 }, conf: { gte: 45 } }, ef: { conf: 12, urg: 13, pac: 2 },
        fala: '{demoRes}',
        tell: 'Ele mesmo fez a ponte com a dor que citou. É o melhor sinal que uma prévia pode dar.' },
      { ef: { conf: 5, urg: 6, pac: -3 },
        fala: 'Bacana, entendi como funciona.',
        tell: 'Entendeu o produto. Ainda não entendeu o que muda pra ele.' },
    ] },

  { id: 'prova_social', nome: 'Prova social', familia: 'valor',
    desc: 'Case de um cliente real do mesmo perfil.',
    efeitos: [
      { se: { info: { lt: 42 } }, ef: { conf: -10, urg: 3, pac: -4 },
        fala: 'Ah sei... mas cada operação é uma operação, né?',
        tell: 'Sem conhecer a realidade dele, o case soa decorado.' },
      { se: { info: { gte: 55 } }, ef: { conf: 11, urg: 9 },
        fala: '{caseRef}',
        tell: 'Ele se reconhece no case. Prova social só funciona com espelho.' },
      { ef: { conf: 3, urg: 5 },
        fala: 'Interessante.',
        tell: 'Registrou, sem se mover.' },
    ] },

  { id: 'custo_inacao', nome: 'Custo da inação', familia: 'valor',
    desc: 'Coloca na ponta do lápis o que ele já perde por mês.',
    efeitos: [
      { se: { naoUsou: 'pergunta_problema' }, ef: { conf: -10, urg: 4, pac: -5 },
        fala: 'Perder em quê? Você tá fazendo conta de um problema que eu não te contei.',
        tell: 'Conta sobre dor que ele nunca declarou soa inventada.' },
      { se: { info: { lt: 48 } }, ef: { conf: -9, urg: 5, pac: -5 },
        fala: 'Esses números você tirou de onde?',
        tell: 'Conta com dado inventado destrói autoridade na hora.' },
      { se: { info: { gte: 60 }, conf: { gte: 45 } }, ef: { conf: 9, urg: 24 },
        fala: 'Colocando assim, eu jogo fora mais do que custa resolver isso. {conta}',
        tell: 'Ele abre a calculadora do celular. Refazendo sua conta.' },
      { ef: { conf: 2, urg: 12, pac: -2 },
        fala: 'É, faz sentido a conta.',
        tell: 'Aceita a lógica, mas o número ainda não é dele.' },
    ] },

  { id: 'ganho_projetado', nome: 'Ganho projetado', familia: 'valor',
    desc: 'Base de clientes × recompra × ticket — o que entra se resolver.',
    efeitos: [
      { se: { info: { lt: 45 } }, ef: { conf: -6, urg: 4, pac: -4 },
        fala: 'Mas eu nem sei quantos clientes eu tenho cadastrado.',
        tell: 'Projeção sobre base desconhecida não convence.' },
      { se: { usou: 'custo_inacao' }, ef: { conf: 7, urg: 17 },
        fala: 'Então de um lado eu paro de perder e do outro eu ganho? Aí muda a conversa.',
        tell: 'Perda e ganho na mesma call fecham a pinça.' },
      { ef: { conf: 6, urg: 16 },
        fala: 'Se der metade disso já vale a pena eu ver de perto.',
        tell: 'Ele passa a tratar como oportunidade, não como mais uma ligação de vendas.' },
    ] },

  { id: 'ensinar', nome: 'Ensinar algo novo', familia: 'valor',
    desc: 'Entrega uma prática que ele aplica mesmo sem marcar nada.',
    efeitos: [
      { se: { usou: 'ensinar' }, ef: { conf: 4, pac: 2 },
        fala: 'Boa também. Mas eu já anotei a primeira.',
        tell: 'O segundo ensinamento rende menos que o primeiro.' },
      { ef: { conf: 12, info: 4, urg: 5, pac: 5 },
        fala: '{falaEnsinar}',
        tell: 'Reciprocidade. Quem ensina sem cobrar vira referência, não vendedor.' },
    ] },

  { id: 'diferencial_concorrente', nome: 'Posicionar contra o que ele usa hoje', familia: 'valor',
    desc: 'Contrapõe à ferramenta atual dele, sem atacar.',
    efeitos: [
      { se: { info: { lt: 45 } }, ef: { conf: -9, pac: -4 },
        fala: '{contraConcorrente}',
        tell: 'Sem saber o que ele valoriza, comparação vira ataque.' },
      { ef: { conf: 9, info: 4, urg: 8 },
        fala: 'Isso o meu não faz mesmo. Nunca tinha parado pra comparar.',
        tell: 'Diferencial entregue como fato, não como ataque.' },
    ] },

  { id: 'redirecionar_negocio', nome: 'Trazer de volta pro negócio', familia: 'valor',
    desc: 'Sai da discussão técnica e volta pro impacto na operação.',
    efeitos: [
      { se: { info: { lt: 35 } }, ef: { conf: 2, info: 5, pac: 2 },
        fala: 'Voltar pra onde? A gente não chegou em lugar nenhum ainda.',
        tell: 'Não há assunto de negócio pra retomar.' },
      { ef: { conf: 10, urg: 12, pac: 4 },
        fala: 'Justo. No fim das contas é isso que importa: {dor}',
        tell: 'Ele solta a lista de perguntas. Estava testando você, não decidindo.' },
    ] },

  /* ---------- NEGOCIAÇÃO (aqui: vencer a fricção de marcar, não de preço) ---------- */
  { id: 'isolar_objecao', nome: 'Isolar a objeção real', familia: 'negociacao',
    desc: '"É a agenda mesmo, ou tem outra coisa te segurando antes de marcar?"',
    efeitos: [
      { se: { conf: { lt: 38 } }, ef: { conf: -5, info: 5, pac: -4 },
        fala: 'É que eu preciso pensar mesmo, cara.',
        tell: 'Sem confiança, ele protege a objeção real.' },
      { ef: { conf: 6, info: 16 },
        fala: 'Olha... sinceramente? Não é bem o que eu te falei no começo.',
        tell: 'A objeção declarada abre e mostra que tem algo atrás.' },
    ] },

  { id: 'escala_010', nome: 'Escala 0 a 10', familia: 'negociacao',
    desc: '"De 0 a 10, o quanto faz sentido conhecer isso de perto? O que faltaria pro 10?"',
    efeitos: [
      { se: { info: { lt: 42 } }, ef: { conf: -4, info: 6, pac: -4 },
        fala: 'Sei lá, uns 5? É cedo pra dizer.',
        tell: 'Escala pedida cedo mede o seu desconhecimento, não o interesse dele.' },
      { se: { usou: 'demo_dirigida' }, ef: { conf: 6, info: 15, urg: 8 },
        fala: 'Depois do que você mostrou, tô num 8. Pro 10 eu precisaria de {criterio}.',
        tell: 'A escala depois da prévia mede algo real, e ele entrega o critério.' },
      { ef: { conf: 5, info: 14, urg: 6 },
        fala: 'Tô num 7. Pro 10 eu precisaria de {criterio}.',
        tell: 'Ele te entregou o critério de decisão de bandeja.' },
    ] },

  { id: 'reenquadrar_preco', nome: 'Reenquadrar o pedido de preço', familia: 'negociacao',
    desc: 'Devolve o pedido de preço sem fugir — sem entregar número solto fora da call.',
    efeitos: [
      { se: { urg: { lt: 35 } }, ef: { conf: 4, pac: 2 },
        fala: 'Tá, mas não demora que eu preciso saber se cabe no bolso.',
        tell: 'Ele aceita esperar. A conta ainda não foi construída.' },
      { ef: { conf: 9, urg: 6, pac: 4 },
        fala: 'Faz sentido. Me mostra primeiro o que eu ganho com {dor} resolvido.',
        tell: 'Você comprou tempo sem parecer que está escondendo preço.' },
    ] },

  { id: 'ancoragem', nome: 'Range de investimento (BANT)', familia: 'negociacao',
    desc: 'Dá a faixa de preço cedo, pra qualificar orçamento sem empurrar plano.',
    efeitos: [
      { se: { naoUsou: 'pergunta_problema' }, ef: { conf: -18, urg: -6, pac: -5 },
        fala: 'Preço de quê? Você ainda não sabe o que eu preciso.',
        tell: 'Dar o range antes de existir problema é a forma mais rápida de queimar a call.' },
      { se: { conf: { lt: 48 } }, ef: { conf: -16, urg: -6, pac: -5 },
        fala: 'Já vai falar de preço? Nem sei direito o que eu tô conhecendo.',
        tell: 'Ele fecha a postura. Range antes de valor queima o lead.' },
      { se: { urg: { gte: 58 } }, ef: { conf: 5, urg: 9 },
        fala: 'Isso já dá pra encaixar no orçamento. Bora marcar então?',
        tell: 'Ele mesmo já está pronto pra marcar — o range fechou a conta pra ele.' },
      { ef: { conf: 1, pac: -3 },
        fala: 'Entendi a faixa de valores.',
        tell: 'Recebeu o range sem reagir.' },
    ] },

  { id: 'nao_conceder', nome: 'Perguntar antes de ceder', familia: 'negociacao',
    desc: '"Por que prefere resolver por WhatsApp em vez de 15 minutos de call?" — antes de simplesmente mandar tudo por mensagem.',
    efeitos: [
      { ef: { conf: 9, info: 13, urg: 5 },
        fala: 'Porque {motivoOculto}.',
        tell: 'O pedido nunca era sobre o WhatsApp. Perguntar revelou isso de graça.' },
    ] },

  { id: 'concessao_condicionada', nome: 'Compromisso condicionado', familia: 'negociacao',
    desc: '"Se eu confirmar um horário agora, você separa 15 minutos comigo?"',
    efeitos: [
      { se: { urg: { lt: 45 } }, ef: { conf: -7, urg: 2, pac: -4 },
        fala: 'Calma, nem cheguei nesse ponto.',
        tell: 'Condicionar antes da hora expõe a sua pressa, não a dele.' },
      { se: { raiz: false }, ef: { conf: -4, urg: 6, pac: -3 },
        fala: 'Talvez. Mas tem uma coisa que ainda me trava e você não perguntou.',
        tell: 'Condicionar sem saber o bloqueio real negocia o problema errado.' },
      { ef: { conf: 7, urg: 16 },
        fala: 'Se você conseguir um horário que encaixe, eu separo, sim.',
        tell: 'Compromisso obtido antes de qualquer concessão. Nada foi dado de graça.' },
    ] },

  { id: 'garantia_estendida', nome: 'Reduzir o risco da call', familia: 'negociacao',
    desc: 'Deixa claro que são só 15 minutos, sem compromisso — o antídoto pra "essa call é mesmo necessária?".',
    efeitos: [
      { se: { conf: { lt: 42 } }, ef: { conf: 15, urg: 9 },
        fala: '{falaGarantia}',
        tell: 'Tirar o risco da call ataca a insegurança direto.' },
      { se: { usou: 'ancoragem' }, ef: { conf: 8, urg: 9 },
        fala: 'Com o range na mão, os 15 minutos ficam mais fáceis de topar.',
        tell: 'Depois do range, reduzir o risco trabalha a favor da agenda.' },
      { ef: { conf: 6, urg: 6 },
        fala: 'Boa, é um conforto a mais.',
        tell: 'Bem recebida, mas ele já não estava com medo.' },
    ] },

  { id: 'congelamento', nome: 'Oferecer o horário mais fácil', familia: 'negociacao',
    desc: 'Encaixa a call no horário mais tranquilo pra ele — fim de expediente, fim de semana, o que for.',
    efeitos: [
      { se: { urg: { gte: 45 } }, ef: { conf: 8, urg: 15 },
        fala: 'Ah, se puder ser depois do expediente, aí eu consigo encaixar.',
        tell: 'O bloqueio era agenda, não interesse.' },
      { ef: { conf: 3, urg: 4 },
        fala: 'Entendi como funciona.',
        tell: 'Sem urgência, um horário mais fácil só adia a decisão de marcar.' },
    ] },

  { id: 'pausa_estrategica', nome: 'Pausa estratégica', familia: 'negociacao',
    desc: 'Recua um passo de propósito e devolve o controle.',
    efeitos: [
      { se: { conf: { lt: 35 } }, ef: { conf: 13, urg: -3, pac: 6 },
        fala: 'Valeu por não me empurrar. Isso conta.',
        tell: 'Tirar a pressão devolve o ar.' },
      { se: { fase: 'fim' }, ef: { conf: 1, urg: -14, pac: 3 },
        fala: 'Beleza, então a gente se fala depois.',
        tell: 'Recuar no fim da call é entregar o agendamento de graça.' },
      { ef: { conf: 2, urg: -11, pac: 3 },
        fala: 'Tudo bem, sem pressa então.',
        tell: 'Você tirou pressão que não existia. A call esfria.' },
    ] },

  { id: 'resumo_confirma', nome: 'Resumo e confirma', familia: 'negociacao',
    desc: 'Recapitula tudo (SPIN) e pede o "isso mesmo".',
    efeitos: [
      { se: { info: { gte: 58 }, usou: 'pergunta_problema' }, ef: { conf: 10, urg: 9 },
        fala: '{falaResumo}',
        tell: 'O "isso mesmo" dele. É o degrau antes do agendamento.' },
      { se: { info: { gte: 58 } }, ef: { conf: 6, urg: 6 },
        fala: 'No geral é isso, sim.',
        tell: 'Confirmação sem entusiasmo: você resumiu o produto, não a dor dele.' },
      { ef: { conf: 1, info: -3, pac: -3 },
        fala: 'Mais ou menos... alguns pontos não são bem assim.',
        tell: 'Resumo com lacuna expõe o que você não perguntou.' },
    ] },

  /* ---------- AGENDAMENTO (era "fechamento") ---------- */
  { id: 'fechamento_direto', nome: 'Convite direto', familia: 'fechamento', fecha: true,
    desc: '"Vamos marcar 15 minutinhos com nosso consultor essa semana?"', efeitos: [{ ef: {} }] },
  { id: 'fechamento_alternativa', nome: 'Alternativa de horário', familia: 'fechamento', fecha: true,
    desc: '"Prefere terça de manhã ou quinta à tarde?"', efeitos: [{ ef: {} }] },
  { id: 'next_step', nome: 'Travar o próximo passo', familia: 'fechamento', fecha: true, encerraSuave: true,
    desc: 'Dia, hora e o nome do consultor. Não agenda hoje, mas não perde o lead.', efeitos: [{ ef: {} }] },

  /* ---------- CARTAS DE RAIZ ---------- */
  { id: 'reparacao', nome: 'Separar do passado', familia: 'raiz', bloqueada: true,
    desc: 'Nomeia o que o fornecedor anterior fez e mostra o que é diferente aqui.',
    efeitos: [{ ef: { conf: 24, urg: 11 }, fala: 'Nunca ninguém tinha falado disso comigo desse jeito.',
      tell: 'A ferida foi nomeada sem julgamento.' }] },
  { id: 'trazer_decisor', nome: 'Chamar o decisor pra call', familia: 'raiz', bloqueada: true,
    desc: 'Propõe incluir quem decide na reunião com o consultor, sem constranger quem está na linha.',
    efeitos: [{ ef: { conf: 22, info: 12, urg: 9 }, fala: 'Ia ser bom mesmo. Ele fica mais tranquilo ouvindo direto do consultor.',
      tell: 'O alívio é visível. Não vai ter que defender a ideia sozinho.' }] },
  { id: 'migracao_sem_risco', nome: 'Migração sem parar a operação', familia: 'raiz', bloqueada: true,
    desc: 'Mostra como sair do sistema atual sem perder base nem faturar menos — sem prometer, só explicar como é a call.',
    efeitos: [{ ef: { conf: 23, urg: 14 }, fala: 'Então eu não perco o que já tenho? Era isso que me travava.',
      tell: 'O medo nunca foi o produto novo. Era a travessia.' }] },
  { id: 'mao_na_massa', nome: 'A equipe faz, você comanda', familia: 'raiz', bloqueada: true,
    desc: 'Tira a carga técnica dele sem tirar o controle.',
    efeitos: [{ ef: { conf: 24, urg: 10 }, fala: 'Então não sou eu que vou mexer nisso? E eu continuo vendo tudo?',
      tell: 'Não era medo de tecnologia — era medo de perder o comando.' }] },
  { id: 'municao_comparativa', nome: 'Munição pra defender internamente', familia: 'raiz', bloqueada: true,
    desc: 'Entrega o comparativo que ele precisa pra já levar pronto pra reunião ou pro sócio.',
    efeitos: [{ ef: { conf: 22, urg: 17 }, fala: 'Isso sim me ajuda. É o que eu preciso levar pra conversa.',
      tell: 'Pela primeira vez ele para de olhar o relógio.' }] },
  { id: 'vitoria_simbolica', nome: 'Dar a vitória, não a obrigação', familia: 'raiz', bloqueada: true,
    desc: 'Oferece algo que ele mostre como conquista (o comparativo pronto, uma resposta pra levar), sem tocar em preço ou pressão de agenda.',
    efeitos: [{ ef: { conf: 23, urg: 15 }, fala: 'Isso eu já consigo levar pro meu sócio. Beleza, bora marcar.',
      tell: 'Ele nunca quis desconto. Queria voltar com um troféu.' }] },
  { id: 'assumir_falha', nome: 'Assumir a falha e mostrar o que mudou', familia: 'raiz', bloqueada: true,
    desc: 'Reconhece que a empresa falhou com ele antes e mostra o que mudou desde então.',
    efeitos: [{ ef: { conf: 26, urg: 12 }, fala: 'Não esperava que você fosse admitir isso.',
      tell: 'Ninguém tinha reconhecido. Era só isso que ele precisava ouvir.' }] },
  { id: 'blindar_comite', nome: 'Blindar ele pro comitê', familia: 'raiz', bloqueada: true,
    desc: 'Prepara as respostas das perguntas que vão fazer pra ele lá dentro, antes mesmo da call com o consultor.',
    efeitos: [{ ef: { conf: 23, urg: 14 }, fala: 'É isso que eu precisava. Não posso travar numa pergunta.',
      tell: 'O medo nunca foi o produto. Era passar vergonha na reunião.' }] },
  { id: 'provar_sem_promessa', nome: 'Provar em vez de prometer', familia: 'raiz', bloqueada: true,
    desc: 'Propõe algo verificável (print, vídeo, teste guiado) no lugar de mais argumento.',
    efeitos: [{ ef: { conf: 25, urg: 13 }, fala: 'Assim eu topo. Se eu ver com meus olhos, eu marco.',
      tell: 'Ele não desconfiava de você. Desconfiava de discurso.' }] },
  { id: 'dividir_risco', nome: 'Dividir o risco da decisão', familia: 'raiz', bloqueada: true,
    desc: 'Estrutura os próximos passos por etapas, pra ele não sentir que está apostando tudo numa call só.',
    efeitos: [{ ef: { conf: 24, urg: 13 }, fala: 'Se for por etapas eu consigo justificar. Sozinho eu não ia arriscar.',
      tell: 'O tamanho do passo era o problema, não a direção.' }] },
  { id: 'proteger_rotina', nome: 'Proteger a rotina da equipe', familia: 'raiz', bloqueada: true,
    desc: 'Mostra que o time não vai ser sobrecarregado na virada.',
    efeitos: [{ ef: { conf: 24, urg: 12 }, fala: 'Minha preocupação era essa. Eles já estão no limite.',
      tell: 'Ele não estava protegendo o bolso. Estava protegendo as pessoas.' }] },
  { id: 'legitimar_escolha', nome: 'Legitimar a escolha dele', familia: 'raiz', bloqueada: true,
    desc: 'Reconhece publicamente que a decisão anterior dele fazia sentido na época.',
    efeitos: [{ ef: { conf: 25, urg: 12 }, fala: 'Ninguém nunca falou isso. Todo mundo só fala que eu escolhi errado.',
      tell: 'Ele precisava que a escolha antiga não fosse burrice — só desatualizada.' }] },
  { id: 'caminho_saida', nome: 'Mostrar a porta de saída', familia: 'raiz', bloqueada: true,
    desc: 'Deixa claro como ele sai, caso queira sair — da call e do teste. Sem letra miúda.',
    efeitos: [{ ef: { conf: 25, urg: 11 }, fala: 'Saber que não tem pegadinha é o que me faz topar a call.',
      tell: 'Quem já ficou preso em contrato compra a saída antes da entrada.' }] },
  { id: 'assumir_operacao', nome: 'Assumir a operação da virada', familia: 'raiz', bloqueada: true,
    desc: 'A equipe da CW faz a transição inteira na call e depois, ele só valida.',
    efeitos: [{ ef: { conf: 24, urg: 13 }, fala: 'Se vocês fizerem, eu topo. Eu não tenho gente pra isso.',
      tell: 'Faltava braço, não vontade.' }] },
];
