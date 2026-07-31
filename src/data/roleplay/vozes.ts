/** Falas próprias de cada lead pras cartas que respondiam igual em qualquer
 *  cenário no protótipo genérico — mescladas no ctx da persona na carga
 *  (ver mergeVozes em personas.ts). A psicologia por trás de cada raiz vale
 *  tanto pra decidir fechar quanto pra decidir topar uma call de 15 minutos,
 *  então a maioria das falas foi reaproveitada sem mudança; só `falaGarantia`
 *  precisou de ajuste pontual em alguns leads, porque a carta que ela responde
 *  ("Reduzir o risco da call") agora fala de tempo/compromisso, não de
 *  dinheiro — não existe uma compra em jogo ainda na etapa do SDR. */

export interface VozesPersona {
  falaRaiz: string;
  falaSilencio: string;
  falaRotulo: string;
  falaValidar: string;
  falaAuditoria: string;
  falaEnsinar: string;
  falaGarantia: string;
  falaResumo: string;
}

export const VOZES: Record<string, VozesPersona> = {

jorge: {
  falaRaiz: 'Sabe qual é meu medo de verdade? Não é aprender, não. É eu não saber mais o que acontece na minha própria casa sem perguntar pro meu filho. Isso aqui eu levantei sozinho.',
  falaSilencio: '...e olha, no fundo eu tenho medo de virar figura decorativa no meu próprio salão.',
  falaRotulo: 'É isso. Você é o primeiro que não me tratou como velho que não entende nada.',
  falaValidar: 'Obrigado por não rir de mim. Já teve moço que riu.',
  falaAuditoria: 'Rapaz, é exatamente o que eu tava pensando. Você me desarmou.',
  falaEnsinar: 'Isso eu vou anotar. Ninguém nunca me explicou desse jeito, com paciência.',
  falaGarantia: 'Se for só 15 minutinhos, sem compromisso nenhum, tá bom, eu encaixo.',
  falaResumo: 'É isso. O caderno no sábado e o medo de depender do meu filho. Você entendeu.' },

marlene: {
  falaRaiz: 'Vou te confessar: eu comprei um sistema de caixa há dois anos e ele tá lá, na caixa, sem abrir. Eu não tenho medo do preço. Tenho medo de pagar e travar de novo.',
  falaSilencio: '...é que eu já comprei um sistema de caixa que tá lá na caixa até hoje, sem abrir.',
  falaRotulo: 'Nossa, é exatamente isso. Medo de gastar e não conseguir usar.',
  falaValidar: 'Que bom ouvir isso. Eu já me senti boba por não ter conseguido antes.',
  falaAuditoria: 'Você falou tudo o que eu ia falar. Agora não tenho argumento.',
  falaEnsinar: 'Ai, isso eu vou fazer amanhã mesmo na padaria. Que dica boa.',
  falaGarantia: 'Sendo só uma conversa, sem compromisso, fico bem mais tranquila de topar.',
  falaResumo: 'É isso mesmo: o WhatsApp lotando de manhã e o medo de travar. Certinho.' },

caio: {
  falaRaiz: 'Cara, vou ser honesto contigo. Eu assinei três ferramentas e não terminei de configurar nenhuma. Meu problema não é começar, é não largar no meio.',
  falaSilencio: '...cara, sendo sincero, eu já assinei três coisas e não terminei de configurar nenhuma.',
  falaRotulo: 'Mano, é isso. Eu começo animado e largo no meio.',
  falaValidar: 'Valeu por não me julgar. Todo mundo acha que é falta de vontade.',
  falaAuditoria: 'Cara, você adivinhou o que eu ia dizer. Fechou.',
  falaEnsinar: 'Isso é ouro. Vou aplicar no próximo evento independente de marcar ou não.',
  falaGarantia: 'Se for só bater um papo sem compromisso, o risco é zero. Aí eu topo.',
  falaResumo: 'É isso: a fila que espanta cliente e eu que largo as coisas no meio.' },

rita: {
  falaRaiz: 'Olha, a real é essa: eu quero muito, mas cada centavo tá na obra. Não é que eu ache caro. É que eu não tenho o dinheiro hoje, só depois que abrir.',
  falaSilencio: '...na verdade meu medo é abrir e o bairro me julgar já no primeiro fim de semana.',
  falaRotulo: 'É exatamente isso. Tô com medo de errar na estreia.',
  falaValidar: 'Nossa, obrigada. Todo mundo só me pergunta quando abre, ninguém pergunta como eu estou.',
  falaAuditoria: 'Você falou o que eu tava pensando sobre gastar mais agora.',
  falaEnsinar: 'Isso vai me poupar dor de cabeça na inauguração. Anotado.',
  falaGarantia: 'Se não me tomar mais que 15 minutos, eu encaixo antes da inauguração sem culpa.',
  falaResumo: 'É isso: inaugurar em três semanas com a obra comendo tudo. Você pegou.' },

ricardo: {
  falaRaiz: 'Ó, vou ser honesto. Não é o valor, não. Eu já contratei um sistema desses, paguei implantação, e um mês depois ninguém atendia meu telefone. Fiquei três meses no prejuízo. É isso que tá na minha cabeça.',
  falaSilencio: '...sabe o que me tira o sono? Não é o preço. É passar de novo pelo que eu passei.',
  falaRotulo: 'É exatamente isso. Você é o primeiro que percebeu que não é dinheiro.',
  falaValidar: 'É bom ouvir isso. Da outra vez eu só ouvi desculpa e prazo furado.',
  falaAuditoria: 'Você disse tudo que eu ia dizer. Agora fica difícil eu te tratar como o outro.',
  falaEnsinar: 'Isso aí eu aplico já na sexta, com ou sem call marcada.',
  falaGarantia: 'Se o risco de perder tempo não é só meu, aí a conversa muda de lugar.',
  falaResumo: 'É isso: a sexta com três canais e o medo de ficar na mão outra vez.' },

fabio: {
  falaRaiz: 'Vou te falar a verdade: eu não acredito que pagar resolve. Pra mim é tudo igual, muda só o nome. Se você quiser que eu mude de ideia, vai ter que me mostrar, não me contar.',
  falaSilencio: '...o que me pega é que eu já paguei uma vez e o problema continuou igual.',
  falaRotulo: 'É isso mesmo. Eu não acredito que pagar muda alguma coisa.',
  falaValidar: 'Legal você não tentar me convencer no chute. Isso conta.',
  falaAuditoria: 'Cara, é exatamente o que eu tava pensando: tudo igual, só muda o nome.',
  falaEnsinar: 'Isso eu vou testar no domingo. Já valeu a ligação.',
  falaGarantia: 'Se for só ver funcionando, sem compromisso nenhum, beleza, eu vejo.',
  falaResumo: 'É isso: cair no domingo sem ter pra quem reclamar. Resumiu bem.' },

juliana: {
  falaRaiz: 'Deixa eu te contar por que eu insisto nisso. Eu assinei dois anos de um sistema, usei três meses e paguei o resto sem usar. Não é a mensalidade que me assusta. É não conseguir sair.',
  falaSilencio: '...eu paguei um ano e meio de um sistema que eu não usava, só pra não quebrar contrato.',
  falaRotulo: 'Exatamente. Não é o valor mensal, é a sensação de ficar presa.',
  falaValidar: 'Que bom você entender. Todo vendedor me trata como se eu fosse implicante.',
  falaAuditoria: 'Você antecipou minha pergunta sobre fidelidade. Ponto pra você.',
  falaEnsinar: 'Isso da base de clientes eu vou aplicar essa semana. Obrigada.',
  falaGarantia: 'Isso ajuda, mas o que eu quero saber mesmo é como eu saio depois, se precisar.',
  falaResumo: 'É isso: perder cliente recorrente e não querer contrato longo. Certo.' },

cleiton: {
  falaRaiz: 'Vou te falar uma coisa. Esse jeito de trabalhar fui eu que inventei, do zero. Trocar agora parece que eu tô admitindo que fiz errado esse tempo todo.',
  falaSilencio: '...meu medo é chegar cliente antigo e não achar nada do jeito que eu fazia.',
  falaRotulo: 'É por aí. Eu construí isso sozinho, do zero, com a minha cabeça.',
  falaValidar: 'Boa, moço. Você é o primeiro que não falou que eu tô fazendo errado.',
  falaAuditoria: 'Você falou o que eu ia falar: que é firula de quem não trabalha.',
  falaEnsinar: 'Essa eu vou usar hoje à noite na churrasqueira. Boa.',
  falaGarantia: 'Se for só uma conversa e eu poder voltar pro meu jeito depois, tudo bem, eu escuto.',
  falaResumo: 'É isso: responder com a mão suja e deixar cliente esperando. Você viu.' },

bruna: {
  falaRaiz: 'Olha, vou ser sincera contigo: não é conversa de negociação. Meu mês fraco é fraco de verdade. Eu não posso assumir um custo fixo que eu não sustente.',
  falaSilencio: '...na real eu tenho medo de assumir um custo fixo e não dar conta no mês fraco.',
  falaRotulo: 'É exatamente isso. Não é falta de vontade, é falta de margem.',
  falaValidar: 'Nossa, obrigada. Eu me sinto pequena falando de dinheiro nessas reuniões.',
  falaAuditoria: 'Você já falou que eu ia dizer que é caro. Falei mesmo.',
  falaEnsinar: 'Isso das encomendas por data eu vou organizar hoje. Já ajudou.',
  falaGarantia: 'Ajuda, mas meu problema não é o risco da call, é o mês que vem.',
  falaResumo: 'É isso: trocar bolo de festa e o orçamento curto de verdade. Resumiu.' },

vanessa: {
  falaRaiz: 'Deixa eu te explicar o que ninguém entende. Não é que eu não queira. É que sou eu pra tudo aqui. Se isso me der trabalho, eu não vou conseguir, por mais que eu queira.',
  falaSilencio: '...o que ninguém entende é que eu não tenho quem faça. Sou eu pra tudo.',
  falaRotulo: 'É isso. Eu não tô resistindo, eu tô sem braço.',
  falaValidar: 'Que bom. Geralmente me tratam como se eu fosse desorganizada.',
  falaAuditoria: 'Você falou o que eu ia dizer sobre não ter tempo. Exato.',
  falaEnsinar: 'Isso vai me economizar tempo já hoje.',
  falaGarantia: 'Meu risco não é dinheiro, é tempo. Se for rápido mesmo, eu encaixo.',
  falaResumo: 'É isso: dois pontos, dois números e eu fechando caixa às onze da noite.' },

sergio: {
  falaRaiz: 'Vou te dizer o que tá por trás. Eu já tomei multa por nota emitida errada. Desde então eu confiro tudo três vezes. Não é escopo, é medo do fisco.',
  falaSilencio: '...eu já tomei multa por nota errada. Desde então eu confiro tudo três vezes.',
  falaRotulo: 'É exatamente isso. Não é preguiça, é medo do fisco.',
  falaValidar: 'Bom ouvir isso. Contador me trata como se eu fosse desatento.',
  falaAuditoria: 'Você antecipou: eu ia dizer que só quero a parte fiscal. Dito.',
  falaEnsinar: 'Isso sobre o cupom na nota eu não sabia. Vale a ligação.',
  falaGarantia: 'Isso não me protege de multa. O que eu quero é saber quem responde pela configuração.',
  falaResumo: 'É isso: nota manual uma por uma e o trauma da multa. Exato.' },

marcosf: {
  falaRaiz: 'Vou te contar por que eu tô desconfiado. Eu já montei canal próprio uma vez e o cliente continuou pedindo pelo marketplace. Eu não soube trazer ninguém pra lá.',
  falaSilencio: '...eu já tentei ter canal próprio e ninguém pediu por lá. Foi frustrante.',
  falaRotulo: 'É isso. Eu me sinto refém do marketplace e não sei sair.',
  falaValidar: 'Valeu por não falar que é só divulgar mais. Já ouvi muito isso.',
  falaAuditoria: 'Você falou o que eu ia falar: que já tentei e não deu.',
  falaEnsinar: 'Essa mecânica de cupom pra migrar base eu não tinha pensado. Boa.',
  falaGarantia: 'Isso me protege do sistema, não da minha base não migrar.',
  falaResumo: 'É isso: comissão comendo a margem e a tentativa que não deu certo.' },

anderson: {
  falaRaiz: 'Cara, vou te falar o que me trava de verdade. Eu já troquei de sistema uma vez e perdi todo o cadastro de cliente. Dois anos de base. Não é o que a sua ferramenta faz — é o que eu perco no meio do caminho.',
  falaSilencio: '...cara, o que me trava mesmo é que eu já perdi dois anos de cadastro numa troca.',
  falaRotulo: 'É exatamente isso. Não é o sistema, é a travessia.',
  falaValidar: 'Bom você não sair defendendo. O outro também defendia.',
  falaAuditoria: 'Você falou o que eu ia falar: que é tudo igual e mais caro.',
  falaEnsinar: 'Isso do disparo segmentado eu vou testar. Boa dica, viu.',
  falaGarantia: 'Isso não me devolve base perdida. Meu medo é outro.',
  falaResumo: 'É isso: sábado fora do ar nas três lojas e o medo de perder cadastro.' },

camila: {
  falaRaiz: 'Ai... deixa eu ser sincera. Eu adoro, mas quem mexe no dinheiro é meu sócio. Ele é mais pé no chão que eu, e eu já levei não em duas coisas esse ano.',
  falaSilencio: '...ai, é que eu queria muito, mas não sou eu que decido isso aqui.',
  falaRotulo: 'Ai, é isso mesmo. Eu fico animada e depois travo na hora de bancar.',
  falaValidar: 'Que bom você falar isso, porque eu já me senti meio boba nessa posição.',
  falaAuditoria: 'Nossa, você falou tudo que eu ia falar! Não sobrou nada.',
  falaEnsinar: 'Isso eu vou aplicar no Instagram hoje. Adorei!',
  falaGarantia: 'Isso ajuda a convencer, mas quem tem que ser convencido não sou eu.',
  falaResumo: 'É isso: perder pedido no fim de semana e eu não conseguindo bancar sozinha.' },

wesley: {
  falaRaiz: 'Vou te falar a real: não é nem o valor em si. É que eu não posso chegar pro meu sócio e dizer que só topei bater papo à toa. Tenho que voltar com alguma coisa.',
  falaSilencio: '...na verdade o problema é que eu preciso chegar pro meu sócio com alguma vitória.',
  falaRotulo: 'É isso. Não é o valor, é eu não poder chegar de mãos vazias.',
  falaValidar: 'Valeu por não me tratar como pão-duro. Não é isso.',
  falaAuditoria: 'Você falou o que eu ia falar: que eu só quero desconto. Nem é isso.',
  falaEnsinar: 'Isso do fechamento de caixa eu levo pro meu sócio hoje.',
  falaGarantia: 'Isso é legal, mas garantia eu não consigo mostrar como conquista.',
  falaResumo: 'É isso: a planilha que não bate e a briga com meu sócio todo dia 5.' },

thiago: {
  falaRaiz: 'Cara, vou te contar. Ano passado eu levei uma proposta pro comitê, me fizeram três perguntas e eu não soube responder nenhuma. Foi constrangedor. Desde então eu evito bancar as coisas lá dentro.',
  falaSilencio: '...eu já travei numa pergunta do comitê e passei vergonha. Não repito isso.',
  falaRotulo: 'É exatamente isso. Eu evito bancar coisa nova lá dentro.',
  falaValidar: 'Bom ouvir. Aqui todo mundo acha que é só apresentar bonito.',
  falaAuditoria: 'Você falou o que eu ia falar: que eu não decido. É verdade.',
  falaEnsinar: 'Isso me ajuda a argumentar. Vou levar pro comitê.',
  falaGarantia: 'É bom argumento, mas não me salva se eu travar na pergunta.',
  falaResumo: 'É isso: o sistema da rede não atende delivery e eu preciso defender isso lá.' },

renata: {
  falaRaiz: 'Vou te falar o que realmente pesa. Meu maître tem doze anos de casa e reage mal a qualquer mudança. O problema nunca foi o sistema. É que eu evito esse desgaste com ele.',
  falaSilencio: '...meu maître tem doze anos de casa e reage mal a qualquer mudança. É esse o problema.',
  falaRotulo: 'É isso. Não é técnico, é humano.',
  falaValidar: 'Que bom. Fornecedor sempre trata equipe antiga como obstáculo.',
  falaAuditoria: 'Você antecipou: eu ia dizer que não troco o salão. Ia mesmo.',
  falaEnsinar: 'Isso sobre separar os canais eu não tinha considerado. Bom.',
  falaGarantia: 'Isso me protege do contrato. Não protege minha equipe do estresse.',
  falaResumo: 'É isso: salão organizado, delivery no caos e a equipe no limite.' },

paulo: {
  falaRaiz: 'Deixa eu te falar o que complica. Foi o dono que escolheu o sistema de hoje. Eu chegar propondo troca soa como se eu tivesse dizendo que ele errou.',
  falaSilencio: '...o problema é que foi o dono que escolheu o sistema de hoje. Não posso dizer que é ruim.',
  falaRotulo: 'É isso. Eu não posso contrariar quem escolheu.',
  falaValidar: 'Bom ouvir. Na minha posição a gente apanha das duas pontas.',
  falaAuditoria: 'Você falou o que eu ia falar: que não sou eu que decido.',
  falaEnsinar: 'Isso do relatório automático já me economiza a manhã da segunda.',
  falaGarantia: 'Isso ajuda a vender internamente, mas o dono é orgulhoso.',
  falaResumo: 'É isso: relatório no Excel toda semana e o dono que não gosta de ser contrariado.' },

eduardo: {
  falaRaiz: 'Vou te economizar tempo com a verdade. Eu não desconfio de você. Eu desconfio de reunião. Já ouvi essa apresentação três vezes e as três eram convincentes. Nada que você falar vai contar.',
  falaSilencio: '...eu já ouvi essa mesma conversa três vezes, de três empresas. Todas convincentes.',
  falaRotulo: 'É isso. Eu não desconfio de você, desconfio de apresentação.',
  falaValidar: 'Valeu. Normalmente o vendedor fica na defensiva quando eu digo isso.',
  falaAuditoria: 'Você falou tudo que eu ia falar. Confesso que me pegou.',
  falaEnsinar: 'Isso é útil. Vou aplicar independente de marcar ou não.',
  falaGarantia: 'Isso já me prometeram antes. E depois inventaram cláusula.',
  falaResumo: 'É isso: dois meses de bagunça por troca e nenhum entregou o prometido.' },

larissa: {
  falaRaiz: 'Vou ser direta com o que me incomoda. Eu acho que a agência me indicou vocês por comissão, não por mérito. E hoje eu não tenho acesso a nada do que é meu.',
  falaSilencio: '...eu desconfio que a agência ganha comissão e me indicou por isso, não por mim.',
  falaRotulo: 'É exatamente isso. Eu me sinto refém de quem cuida do meu marketing.',
  falaValidar: 'Nossa, obrigada por não sair defendendo a agência.',
  falaAuditoria: 'Você falou o que eu ia falar sobre comissão. Direto, gostei.',
  falaEnsinar: 'Isso sobre acesso próprio eu não sabia que era possível. Ótimo.',
  falaGarantia: 'Isso é sobre vocês. Meu problema é quem fica com a chave da conta.',
  falaResumo: 'É isso: dependência total da agência e desconfiança da indicação.' },

gustavo: {
  falaRaiz: 'Vou te falar onde a conversa realmente mora. Eu tenho um sócio investidor que cobra racional de cada gasto. Ele não pergunta desconto, ele pergunta retorno. É pra ele que eu preciso levar isso.',
  falaSilencio: '...na real eu tenho um sócio investidor que cobra racional de cada centavo.',
  falaRotulo: 'É isso. Não é desconto, é eu conseguir justificar.',
  falaValidar: 'Bom ouvir. Fornecedor sempre acha que é sacanagem de comprador.',
  falaAuditoria: 'Você falou o que eu ia falar sobre escala. Certo.',
  falaEnsinar: 'Isso da visão consolidada é exatamente o que eu preciso mostrar.',
  falaGarantia: 'É secundário. Meu sócio pergunta retorno, não risco.',
  falaResumo: 'É isso: três licenças separadas e nenhuma visão de rede. Exato.' },

marcia: {
  falaRaiz: 'Vou te falar por que eu tô assim. Eu já troquei de fornecedor por causa de suporte, e o novo prometeu exatamente o que você tá prometendo. Palavra pra mim não vale mais nada.',
  falaSilencio: '...eu já troquei uma vez por causa de suporte e o novo prometeu a mesma coisa.',
  falaRotulo: 'É isso mesmo. Eu não acredito mais em promessa de atendimento.',
  falaValidar: 'Que bom. Fornecedor sempre acha que eu tô exagerando.',
  falaAuditoria: 'Você falou o que eu ia falar: que todos prometem igual.',
  falaEnsinar: 'Isso da contingência no fim de semana eu vou implantar já.',
  falaGarantia: 'Isso não me devolve um sábado parado.',
  falaResumo: 'É isso: três dias esperando chamado e sábado sem ninguém do outro lado.' },

patricia: {
  falaRaiz: 'Vou ser direta, porque tempo é o que eu não tenho. Já tem outra solução em avaliação aqui, defendida por outra diretoria. Eu não preciso de PDF. Preciso de argumento pra sustentar a minha posição na quinta.',
  falaSilencio: '...tem outro projeto sendo defendido aqui dentro, por outra diretoria.',
  falaRotulo: 'É isso. Não é falta de interesse, é disputa interna.',
  falaValidar: 'Agradeço a objetividade. Meu tempo é o que eu não tenho.',
  falaAuditoria: 'Você falou o que eu ia falar sobre proposta por e-mail. Direto.',
  falaEnsinar: 'Isso do comparativo por unidade me serve na quinta. Útil.',
  falaGarantia: 'Isso não resolve política interna. Eu preciso de argumento.',
  falaResumo: 'É isso: decidir no escuro nas quatro unidades e a reunião de quinta.' },

simone: {
  falaRaiz: 'Quer saber a verdade? Eu nem cheguei a usar direito. Empaquei no cadastro do cardápio, deixei pra depois, e depois virou nunca. Ninguém me ligou pra perguntar. Aí eu cancelei e falei que não servia.',
  falaSilencio: '...a verdade é que eu nem cheguei a usar direito. Empaquei e desisti.',
  falaRotulo: 'É isso. E confesso que também tem vergonha nisso.',
  falaValidar: 'Ninguém tinha dito isso pra mim. Nem quando eu cancelei.',
  falaAuditoria: 'Você falou o que eu ia falar: que agora mudou tudo. Ia mesmo.',
  falaEnsinar: 'Isso das encomendas por data é o que eu não conseguia resolver.',
  falaGarantia: 'Isso eu já tinha. Não foi disso que eu precisei.',
  falaResumo: 'É isso: voltei pro caderno, tá pior, e ninguém me acompanhou na primeira vez.' },

rafael: {
  falaRaiz: 'Vou ser honesto contigo. Fui eu que escolhi o sistema que a gente usa hoje. Passei seis meses ouvindo o time reclamar de uma decisão minha. Eu não posso errar duas vezes na frente deles.',
  falaSilencio: '...fui eu que escolhi o sistema de hoje. O time me cobrou por seis meses.',
  falaRotulo: 'É isso. Não é arquitetura. É eu não poder errar duas vezes em público.',
  falaValidar: 'Interessante você dizer isso. Normalmente eu só recebo especificação.',
  falaAuditoria: 'Você falou o que eu ia falar: que eu tô me blindando. Tô.',
  falaEnsinar: 'Isso da integração nativa muda meu trabalho de manutenção. Bom.',
  falaGarantia: 'Isso não me protege da reunião com o time.',
  falaResumo: 'É isso: integração remendada quebrando toda semana e eu virando a noite.' },

helio: {
  falaRaiz: 'Vou te poupar rodeio. Eu banco, mas eu não opero. Quem decide o dia a dia são os operadores de cada casa, e eles resistem a imposição. Comprar sem eles é comprar briga.',
  falaSilencio: '...eu banco, mas quem decide o dia a dia são os operadores. E eles resistem.',
  falaRotulo: 'Correto. Meu problema é adesão, não capital.',
  falaValidar: 'Aprecio a franqueza. Poupa tempo dos dois.',
  falaAuditoria: 'Você antecipou: eu ia pedir só retorno. Ia mesmo.',
  falaEnsinar: 'Isso da comparabilidade entre casas é o que me falta hoje.',
  falaGarantia: 'É irrelevante pra mim. O risco é adoção, não dinheiro.',
  falaResumo: 'É isso: seis casas, seis sistemas e nenhuma comparabilidade.' },

fernanda: {
  falaRaiz: 'Sinceramente? Se fosse só por preço eu já teria decidido. Eu entrei nessa call com um favorito. O que eu procuro é motivo pra confirmar ou pra derrubar.',
  falaSilencio: '...sinceramente, eu já tenho um favorito aqui dentro. Preciso confirmar ou derrubar.',
  falaRotulo: 'É isso. O processo é formal, mas a decisão tem rumo.',
  falaValidar: 'Agradeço. Fornecedor costuma fingir que não percebe isso.',
  falaAuditoria: 'Você falou o que eu ia falar sobre proposta comparável. Justo.',
  falaEnsinar: 'Isso do tempo de implantação por loja é meu critério real.',
  falaGarantia: 'Todos oferecem isso. Não diferencia ninguém aqui.',
  falaResumo: 'É isso: sete lojas, seis semanas por implantação e expansão travada.' },

ivan: {
  falaRaiz: 'Vou te falar o que ninguém fala. Eu sei que eu preciso. O problema é que eu já disse não pra vocês duas vezes. Dizer sim agora é chegar pros meus sócios e admitir que eu errei duas vezes.',
  falaSilencio: '...eu já disse não duas vezes. Mudar agora é admitir que errei na frente dos sócios.',
  falaRotulo: 'É isso. Não é o produto. É a minha palavra.',
  falaValidar: 'Você é o primeiro que não veio me provar que eu estava errado.',
  falaAuditoria: 'Você falou o que eu ia falar: que já recusei duas vezes. Recusei.',
  falaEnsinar: 'Isso do ticket de churrascaria ser diferente, você entendeu. Poucos entendem.',
  falaGarantia: 'Isso não me protege da cara que eu vou fazer na reunião.',
  falaResumo: 'É isso: delivery crescendo sem controle e eu já tendo dito não duas vezes.' },

cristina: {
  falaRaiz: 'Vou te contar uma coisa que eu não costumo contar. Eu já tentei padronizar um fornecedor há dois anos. Os franqueados se rebelaram e eu tive que voltar atrás publicamente. Não vou repetir isso.',
  falaSilencio: '...eu já tentei padronizar uma vez. Os franqueados se rebelaram e eu voltei atrás.',
  falaRotulo: 'É isso. Não posso impor. Já custou caro.',
  falaValidar: 'Bom ouvir. Fornecedor sempre acha que franqueado obedece.',
  falaAuditoria: 'Você falou o que eu ia falar sobre contrato de rede. Exato.',
  falaEnsinar: 'Isso do dado consolidado é meu argumento de venda de franquia.',
  falaGarantia: 'Isso não me protege de crise com quarenta donos independentes.',
  falaResumo: 'É isso: quarenta relatórios diferentes e nenhum poder de impor.' },

otavio: {
  falaRaiz: 'Vou te dizer o que está realmente em jogo. O grupo errou duas contratações e me chamaram depois da segunda. Se eu recomendar vocês e der errado, quem perde o contrato sou eu. Eu não preciso da melhor solução — preciso da mais defensável.',
  falaSilencio: '...se eu recomendar e der errado, quem perde o contrato de consultoria sou eu.',
  falaRotulo: 'É isso. Meu risco aqui é reputacional, não técnico.',
  falaValidar: 'Registro isso. Poucos fornecedores admitem esse tipo de coisa.',
  falaAuditoria: 'Você antecipou: eu ia pedir documentação e encerrar. Ia.',
  falaEnsinar: 'Isso dos critérios de aceite por etapa é útil pro meu parecer.',
  falaGarantia: 'Isso não cobre a minha recomendação.',
  falaResumo: 'É isso: o grupo errou duas vezes e eu entrei depois da segunda.' },

};
