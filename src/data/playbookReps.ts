/** Dados do Playbook de Representantes — espelha o conteúdo real do canal
 *  de representantes (cw-playbook-reps.vercel.app), capturado diretamente do
 *  portal em produção. Território, Abordagem, Negociação e Fechamento
 *  seguem "em construção" porque é esse o estado real no portal de reps. */

export interface RepsArtigo {
  titulo: string;
  /** Texto com marcação leve: linhas iniciadas por "-" viram bullet,
   *  linhas "N." viram lista numerada, "**texto**" vira negrito. */
  conteudo: string;
}

/** Planilha única usada pelo portal de reps para ICP, matriz de objeções e motivos de perda. */
export const REPS_SHEET_LINK = 'https://docs.google.com/spreadsheets/d/12IUEiWLFcXnLMqfAD0fAbDX0QBlW8hFI9qJrsWxmnUs';

/* ────────────────────────── CULTURA & ESTRATÉGIA ───────────────────────── */

export const REPS_MISSAO = {
  curta: 'Construir um mercado de food melhor para todos',
  completa: `A Cardápio Web existe porque o mercado de food ainda está em um estágio de desenvolvimento muito inferior ao de outros segmentos do varejo. Em vários setores, os marketplaces ajudaram a digitalizar a relação entre empresas e consumidores e, depois disso, surgiu uma segunda onda: a construção de canais próprios, com mais margem, mais controle sobre a marca e mais acesso aos dados do cliente.

No food, essa transformação começou mais tarde e ainda está em formação. Marketplaces como o iFood tiveram um papel importante na digitalização inicial do setor — ajudaram a criar hábitos de consumo, trouxeram restaurantes e clientes para o ambiente digital. Mas a dependência excessiva do marketplace trouxe seus limites: compressão de margem, perda de protagonismo da marca do restaurante, pouco acesso aos dados do consumidor e dificuldade de construir crescimento próprio.

É exatamente nesse ponto que a Cardápio Web ganha relevância histórica. Nós existimos para ajudar restaurantes a vender diretamente aos seus clientes, operar com mais autonomia e construir negócios mais fortes, mais saudáveis e mais valiosos ao longo do tempo.

Nossa missão significa desenvolver um ambiente em que restaurantes tenham mais independência, consumidores tenham experiências melhores, parceiros encontrem um setor mais maduro para atuar e a venda direta deixe de ser exceção para se tornar infraestrutura. Quando ajudamos um restaurante a dominar seus próprios dados, melhorar sua operação digital, fortalecer sua marca e transformar gestão e marketing em motores reais de crescimento, nós não estamos apenas prestando um serviço. Estamos ajudando a estruturar um novo capítulo do mercado de food.`,
};

export const REPS_VISAO = {
  curta: 'Ser o e-commerce dos restaurantes do mundo até 2040',
  completa: `Ser o e-commerce dos restaurantes do mundo até 2040 significa construir a principal plataforma para que restaurantes vendam diretamente aos seus clientes, com autonomia e sem depender de intermediários como canal dominante.

Assim como plataformas de e-commerce deram a outros varejistas condições de operar sua própria máquina de vendas, a Cardápio Web quer oferecer ao food a infraestrutura digital completa para vender, receber, se relacionar, gerir e crescer.

Essa visão exige escala, profundidade de produto, força de marca, relevância internacional e um ecossistema robusto de parceiros e soluções conectadas. Em termos concretos, significa estar presente em pelo menos quatro países, com participação relevante de mercado, e construir uma empresa com faturamento de um bilhão de dólares.`,
};

export interface RepsValor {
  titulo: string;
  descricao: string;
  exemplos: string[];
}

export const REPS_VALORES: RepsValor[] = [
  {
    titulo: 'Fazemos o que precisa ser feito',
    descricao: 'Assumimos responsabilidade pelo resultado sem se esconder atrás de fronteiras de área, de cargo ou de conveniência. Se algo afeta o cliente ou a empresa, nossa postura deve ser agir.',
    exemplos: [
      'Um problema técnico surge perto do horário de pico. Mesmo fora do expediente, o time se mobiliza para resolver imediatamente.',
      'Um líder identifica que um processo está travando crescimento, mesmo não sendo sua responsabilidade formal, e propõe melhoria.',
      'Um colaborador percebe que um cliente está perdido e, em vez de enviar um link, agenda uma ligação para garantir que ele consiga operar.',
    ],
  },
  {
    titulo: 'Cumprimos o que prometemos',
    descricao: 'Confiança é construída pela repetição de compromissos honrados, no prazo e com consistência. Em uma empresa que quer liderar um mercado, credibilidade operacional não é detalhe, é ativo central.',
    exemplos: [
      'Um prazo acordado com cliente é mantido mesmo diante de imprevistos.',
      'Um líder promete feedback em determinada data e entrega exatamente naquele dia.',
      'Um colaborador assume uma meta e acompanha semanalmente até cumprir.',
    ],
  },
  {
    titulo: 'Nos importamos com as pequenas coisas',
    descricao: 'Excelência não nasce apenas de grandes decisões, mas do acúmulo de detalhes bem executados: uma comunicação clara, um produto intuitivo, um processo organizado, um evento bem preparado. Pequenos descuidos se somam e corroem a percepção de qualidade; pequenos cuidados constroem grandeza. Qualidade é hábito, não episódio.',
    exemplos: [
      'Um erro de português em comunicação externa é revisado antes de enviar.',
      'O time testa uma funcionalidade nova como se fosse cliente real, do ponto de vista real do cliente.',
      'Um evento interno é organizado com atenção ao ambiente e materiais.',
    ],
  },
  {
    titulo: 'Cuidamos dos nossos',
    descricao: 'Cuidamos dos nossos quando apoiamos clientes com postura consultiva, quando desenvolvemos colegas com franqueza e respeito, quando preservamos um ambiente de confiança e quando tratamos parceiros como parte da construção do ecossistema. Cuidar não é suavizar a verdade nem evitar conversas difíceis — em muitos momentos, cuidar significa dar feedback honesto e elevar a barra.',
    exemplos: [
      'Um restaurante em dificuldade recebe atenção consultiva para melhorar vendas, não apenas suporte técnico.',
      'Um colaborador que enfrenta desafio pessoal encontra abertura para diálogo e apoio estruturado.',
      'Um líder dá feedback honesto e construtivo, mesmo quando é difícil, criando condições reais de evolução.',
    ],
  },
  {
    titulo: 'Evoluímos sem esquecer o que aprendemos',
    descricao: 'Crescer não significa abandonar a história, significa transformar acertos e erros em aprendizado estruturado. Sempre que falhamos, devemos aprender com rigor. Sempre que acertamos, devemos entender por que funcionou. Em uma empresa que quer atravessar muitos ciclos, memória operacional e capacidade de aprendizado são vantagens competitivas.',
    exemplos: [
      'Após uma falha em lançamento, o time documenta aprendizados e cria checklist para evitar repetição.',
      'Métricas antigas são analisadas antes de nova estratégia.',
      'Mudanças estruturais respeitam cultura e fundamentos que deram certo.',
    ],
  },
  {
    titulo: 'Sonhamos grande',
    descricao: 'Não trabalhamos apenas para resolver o presente imediato. Trabalhamos para desenvolver o futuro do mercado de food, com responsabilidade, coragem e visão de longo prazo.',
    exemplos: [
      'Decisões de produto consideram escalabilidade internacional.',
      'Um colaborador propõe solução inovadora que pode gerar nova frente de receita.',
      'A empresa assume publicamente a visão de 2040 e toma decisões alinhadas a essa meta.',
    ],
  },
  {
    titulo: 'Fazemos o que é certo, mesmo quando é difícil',
    descricao: 'Tomar decisões difíceis é parte da liderança. O certo é o certo — independente de opinião ou contexto. Integridade não tem exceção.',
    exemplos: [
      'Manter padrões de qualidade mesmo sob pressão de prazo.',
      'Dar feedback duro a quem precisa evoluir, com respeito e clareza.',
      'Recusar atalhos que comprometem a confiança do cliente ou do time.',
    ],
  },
];

export const REPS_PILARES = [
  'Commerce first',
  'Built to last',
  'A.I. first',
  'O crescimento do nosso cliente é o nosso crescimento',
  'Encantar clientes e torná-los promotores',
];

export const REPS_ONDE_ESTAMOS_INDO = [
  {
    titulo: 'Construímos o futuro do D2C no food',
    texto: 'Nossa responsabilidade não é apenas responder ao mercado atual, mas antecipá-lo. Isso exige defender publicamente a tese da venda direta, investir em infraestrutura própria de dados e pagamentos e desenvolver modelos em que o restaurante acumule ativos de longo prazo — base, dados, marca e previsibilidade de receita.',
  },
  {
    titulo: 'Abraçamos todos os food services, sem exceção',
    texto: 'Não somos uma solução para um nicho específico de restaurante. Somos infraestrutura para qualquer negócio de food service que venda direto ao consumidor: do pequeno delivery local a redes, franquias, dark kitchens, cafeterias, pizzarias, hamburguerias, restaurantes premium, operações híbridas e futuros formatos que ainda vão surgir.',
  },
  {
    titulo: 'Um ecossistema de soluções no centro do mercado',
    texto: 'Não queremos ser apenas mais uma peça na operação do restaurante. Queremos ser o ponto de conexão entre pagamentos, parceiros, agências, integrações, CRM, fiscal, logística, serviços financeiros, educação e tecnologias complementares. Quanto mais a Cardápio Web se torna o lugar onde o restaurante resolve sua operação de venda direta, maior é nossa relevância estrutural no setor.',
  },
  {
    titulo: 'Expandindo nossos TAMs continuamente',
    texto: 'Nunca nos limitamos ao mercado atual. TAM não é apenas algo que se mede, também é algo que se constrói estrategicamente. Podemos crescer do cardápio digital para payments, de payments para serviços financeiros, de restaurantes independentes para redes e franquias, do Brasil para novos mercados.',
  },
  {
    titulo: 'Crescer base com disciplina',
    texto: 'Ganhar escala é importante por marca, rede, dados e ecossistema, mas crescimento artificial cobra um preço alto. Não devemos perseguir volume que destrói unit economics ou compromete capacidade futura de monetização. Crescer com disciplina significa equilibrar expansão com sustentabilidade e escolher clientes com fit real.',
  },
];

/* ──────────────────────────────── PRODUTO ──────────────────────────────── */

export const REPS_PRODUTO_FOCOS = [
  {
    titulo: 'Automação de Atendimento',
    itens: [
      'ChatBot com Inteligência Artificial',
      'Cardápio digital (delivery, mesa, balcão)',
      'Sistema PDV dentro do WhatsApp',
      'Cardápio rápido e com boa usabilidade',
      'Pagamento online — Mercado Pago, Cielo, Pix',
      'Agendamento de pedidos',
    ],
    integracoes: ['Mercado Pago', 'Cielo', 'Tuna (Pix)'],
  },
  {
    titulo: 'Aumento de Vendas',
    itens: [
      'Disparador de mensagens em massa no WhatsApp',
      'Automações e agendamentos de mensagens',
      'Programa de fidelidade',
      'Cupons e descontos',
      'Filtros avançados de clientes',
      'Integração com Meta Ads e Google Ads',
    ],
    integracoes: ['Facebook Pixel', 'API de conversões Meta', 'Catálogo Facebook', 'Google Tag Manager', 'Google Analytics'],
  },
  {
    titulo: 'Gestão da Empresa',
    itens: [
      'PDV, estoque, caixa e impressoras',
      'Gestão de rotas de entrega',
      'Emissão de Nota Fiscal',
      'Gestão financeira (F360)',
      'Terceirização de entregadores',
      'Integração com iFood e Entrega Fácil',
    ],
    integracoes: ['F360', 'Foody Delivery', 'Pick N Go', 'Entrega Fácil iFood', 'Zumm', 'Saipos', 'Eclética', 'Berp Sistemas'],
  },
];

export const REPS_PLANOS_FUNCIONALIDADES = [
  {
    nome: 'Mesas',
    itens: [
      'Cardápio digital para mesas e balcão',
      'Sistema PDV no WhatsApp',
      'Disparador de mensagens',
      'Automações de mensagens',
      'Cupons e descontos',
      'Filtros avançados de clientes',
      'PDV + estoque simplificado + caixa',
      'Gestão financeira F360',
      'Fiado e KDS',
      'Agendamento de pedidos',
    ],
  },
  {
    nome: 'Delivery',
    itens: [
      'Tudo do Mesas +',
      'Cardápio digital para delivery',
      'ChatBot com Inteligência Artificial',
      'Pagamento online (Mercado Pago, Cielo)',
      'Programa de fidelidade',
      'Integração Meta Ads e Google Ads',
    ],
  },
  {
    nome: 'Premium',
    itens: [
      'Tudo do Delivery +',
      'Integração com iFood e Entrega Fácil',
      'Cardápio para delivery, mesas e balcão',
      'Gestão de entregadores',
    ],
  },
];

export const REPS_MODULOS_EXTRAS = [
  { nome: 'Módulo iFood', desc: 'Integração completa com iFood', preco: 'R$29,99/mês' },
  { nome: 'Estoque Avançado', desc: 'Com ficha técnica de insumos', preco: 'R$29,99/mês' },
  { nome: 'Cupom Fiscal', desc: 'Emissão de NF-e/NFC-e', preco: 'R$69,99/mês' },
  { nome: 'Entregadores', desc: 'Gestão e rotas de entrega', preco: 'R$54,99/mês' },
  { nome: 'Financeiro', desc: 'Gestão financeira completa', preco: 'R$69,99/mês' },
  { nome: 'Totem', desc: 'Autoatendimento touchscreen — cliente faz o pedido sozinho, com pagamento integrado.', preco: 'R$99,99/dispositivo' },
];

/* ───────────────────────────── PRIMEIROS PASSOS ────────────────────────── */

export const REPS_PRIMEIROS_PASSOS: RepsArtigo[] = [
  {
    titulo: 'Boas-vindas',
    conteudo: `A Central de Ajuda da Cardápio Web é o espaço ideal para esclarecer dúvidas de forma rápida, prática e eficiente. Contém guias, tutoriais e respostas às perguntas mais frequentes.

Categorias disponíveis:
- Gestão → pedidos, mesas, comandas, caixa e relatórios.
- Automação → disparo via WhatsApp, chatbot, integrações.
- Aumento de Vendas → cupons, descontos e fidelidade.
- Módulos do Sistema → estoque avançado, financeiro, fiscal e mais.
- Suporte → aulas, perguntas frequentes e contatos.`,
  },
  {
    titulo: 'Acessando o Sistema pela Primeira Vez',
    conteudo: `Primeiro Acesso ao Portal:

Se este é o seu primeiro acesso, você precisará criar uma senha. Acesse: https://portal.cardapioweb.com/login

1. Na página de login, clique em "ESQUECI MINHA SENHA".
2. Insira o e-mail cadastrado e clique em "ENVIAR".
3. Acesse o e-mail recebido e clique no botão "Criar nova senha".
4. Digite a nova senha nos campos indicados e clique em "Confirmar".

Recomendações de segurança para a senha:
- Escolha uma senha fácil de lembrar, mas difícil de ser adivinhada.
- Use letras maiúsculas/minúsculas, números e símbolos especiais (@, #, !).
- Evite informações pessoais como datas de nascimento ou nomes.
- Crie senhas com pelo menos 12 caracteres.
- Não reutilize senhas antigas.

Como acessar o portal após criar a senha:

Acesse portal.cardapioweb.com, informe seu e-mail e a senha criada. Você receberá um código de autenticação no e-mail. Insira o código no campo indicado para concluir o acesso.`,
  },
  {
    titulo: 'Cardápios Demonstrativos',
    conteudo: `A plataforma oferece exemplos reais de cardápios digitais desenvolvidos com a plataforma, mostrando como é simples, prático e moderno criar um cardápio digital profissional.

Tipos de cardápios demonstrativos disponíveis:
- Pizzaria
- Sushi
- Hamburgueria
- Confeitaria
- Hortifruti
- Gelateria
- Padaria
- Massas
- Fit
- Restaurante
- Adega
- Vegana
- Açaiteria`,
  },
];

/* ────────────────────────────────── GESTÃO ─────────────────────────────── */

export const REPS_GESTAO: RepsArtigo[] = [
  {
    titulo: 'Gestão de Pedidos',
    conteudo: `A tela de Gestão de Pedidos é o espaço onde você tem controle total sobre o fluxo de pedidos da sua loja — seja para delivery, retirada ou consumo no local.

Recursos disponíveis:
- Lançamento manual de pedidos: crie pedidos diretamente no sistema para qualquer tipo de atendimento.
- Edição de pedidos lançados: edite dados do cliente, endereço, tipo de pedido e formas de pagamento — inclusive múltiplas formas de pagamento no mesmo pedido.
- Personalização do layout: defina a posição de cada status de pedido na tela.
- Ajuste rápido de tempos: use atalhos para aumentar ou reduzir o tempo de preparo ou entrega.
- Pesquisa por nome ou número do cliente nos status: Em produção, Saiu para entrega, Aguardando retirada ou Cancelado.`,
  },
  {
    titulo: 'Mesas e Comandas',
    conteudo: `A tela de Mesas e Comandas é onde você realiza todo o atendimento presencial, controlando pedidos e movimentações em mesas físicas ou comandas.

Ações disponíveis:
- Abrir mesas ou comandas
- Lançar pedidos
- Cancelar itens
- Transferir itens entre mesas ou comandas
- Fechar contas

Status das mesas por cor:
- Verde: mesa aberta
- Roxa: em processo de fechamento
- Laranja: cliente solicitou o fechamento
- Cinza: mesa fechada e disponível para abrir

Como abrir uma mesa:
1. No menu lateral, clique em Mesas/Comandas.
2. Clique sobre uma mesa cinza.
3. Preencha o formulário: quantidade de pessoas (opcional), atendente responsável, identificação (opcional).
4. Clique em Salvar.

Como fechar uma mesa:
1. Selecione uma mesa verde (aberta) e clique em "Fechar conta".
2. Clique em "Pagamento".
3. Opção 1 – Dividir conta: atribua cada produto ao cliente correspondente, selecione a forma de pagamento e confirme.
4. Opção 2 – Pagamento total: clique em Pagar, selecione a forma de pagamento e confirme.

Como cancelar itens:
1. Clique em "Mais ações" (↑) e selecione "Cancelar itens".
2. Marque os itens, clique em "Cancelar selecionados", informe o motivo e confirme.

Como transferir itens entre mesas:
1. Clique em "Mais ações" (↑) e selecione "Transferir itens".
2. Marque os itens, clique em "Transferir selecionados", escolha a mesa/comanda de destino e salve.

Como editar formas de pagamento em Mesas/Comandas:

Pelo Histórico de Pedidos: acesse o histórico, busque o pedido, clique em REABRIR PEDIDO. Pelo Caixa do Dia: localize o pedido pelo número, clique nos detalhes, clique em REABRIR PEDIDO. Após reabrir, exclua a forma de pagamento incorreta e registre a nova.`,
  },
  {
    titulo: 'KDS - Kitchen Display System',
    conteudo: `O KDS (Kitchen Display System) é um visualizador digital de pedidos que substitui as comandas impressas ou escritas em papel. Exibe os pedidos em tempo real na cozinha, organizando o fluxo de preparo.

Modos de operação:
- Modo Preparo: recomendado para a equipe da cozinha. Exibe pedidos pendentes de produção.
- Modo Despacho: recomendado para o setor responsável pela entrega dos pedidos prontos.

Configurações do KDS:
- Layout: Compacto (mais pedidos na tela) ou Alinhado (pedidos lado a lado, mesmo tamanho).
- Tipos de pedido: Delivery, Retirada, Consumo no local, Mesas, Comandas.
- Áreas de produção: escolha quais áreas visualizar.

Cores de status dos produtos no Modo Preparo:
- Azul: produto em preparação.
- Cinza claro: produto finalizado e pronto.

Resumo da Produção:

Disponível no Modo Preparo, exibe a quantidade total de cada produto a ser produzido e a qual pedido cada produto está vinculado. Ao clicar em um item, o status muda para "em produção" (azul). Clique novamente para marcar como pronto.

Modo Despacho:

Exibe pedidos finalizados no preparo, prontos para entrega. Ações disponíveis: marcar como disponível para retirada, saiu para entrega ou entregue ao cliente. É possível retornar pedidos para a cozinha clicando no ícone de seta.`,
  },
  {
    titulo: 'Caixa',
    conteudo: `Informações Gerais:
- Um pedido só é lançado no caixa quando é concluído.
- Caso o caixa esteja fechado, ele será aberto automaticamente ao concluir um pedido.
- É importante fechar o caixa ao final do expediente.
- Caixas abertos há mais de 24h sem movimentações nas últimas 2h serão fechados automaticamente pelo sistema.

Como abrir o caixa:
1. No menu lateral, clique em "Caixa".
2. Clique em "Abrir Caixa" (botão roxo).
3. Informe o valor atual em dinheiro disponível no caixa.
4. Clique em Confirmar.

Informações disponíveis após abertura:
- Histórico de Movimentações: data/hora, descrição, valor, forma de pagamento, tipo e usuário responsável.
- Resumo do Caixa: número do caixa, data/hora de abertura, valores em dinheiro (saldo inicial, suprimentos, sangrias, vendas), resumo por forma de pagamento e por tipo de pedido.

Operações no Caixa:
- Suprimento: clique em "Suprimento", preencha descrição e valor, clique em "Salvar".
- Sangria: clique em "Sangria", informe descrição e valor, clique em "Salvar".
- Fechar caixa: clique em "Fechar Caixa", confira os valores, informe o valor real encontrado, finalize clicando em "Fechar Caixa e Imprimir" ou "Fechar Caixa".
- Reabrir caixa: acesse "Caixas Anteriores", selecione o caixa, clique em "Reabrir Caixa" e confirme.`,
  },
  {
    titulo: 'Desempenho',
    conteudo: `A Tela de Desempenho é o ponto central para monitorar e analisar os principais indicadores do estabelecimento, auxiliando na tomada de decisões estratégicas.

Informações disponíveis:
- Quantidade de pedidos em um período específico
- Faturamento total no período
- Acessos ao cardápio e número de visitantes
- Ticket médio dos pedidos
- Taxas de entrega e de serviço (para mesas e comandas)
- Taxas da maquineta
- Percentuais por método de pagamento (dinheiro, débito, crédito etc.)
- Descontos

Tópicos de análise:
- Vendas: volume de vendas, produtos mais vendidos e ticket médio.
- Clientes: comportamento dos clientes e padrões de consumo.
- Base de Clientes (RFV): análise por Recência, Frequência e Valor monetário.
- Catálogo: desempenho dos produtos do cardápio.
- Produtos: detalhamento por item.
- Entregas: status e eficiência das entregas.
- Descontos: impacto dos descontos nas vendas.
- Cancelamentos: motivos e frequência.
- Visão Geral do Estabelecimento: panorama completo do desempenho.`,
  },
  {
    titulo: 'Histórico de Pedidos',
    conteudo: `A tela de Histórico de Pedidos permite acompanhar todos os pedidos já realizados, independentemente do status.

Colunas disponíveis:
- Número do Pedido
- Nome do Cliente
- Data e Hora de Criação
- Data de Agendamento
- Valor Total
- Forma de Pagamento
- Tipo de Pedido (retirada, delivery, consumo no local, mesa/comanda)
- Canal de Venda (Portal, Extensão, Site, Site Balcão, iFood)
- Status do Pedido

Filtros Avançados disponíveis:
- Tipo de Pedido: Delivery, Retirada, Consumo no local, Mesa/Comanda
- Tipo de Entrega: Agendado ou Imediato
- Canais de Venda: Site, Portal, Extensão, iFood
- Status do Pedido: Pendente, Em preparação, Pronto, Saiu para entrega, Concluído, Cancelado, entre outros
- Forma de Pagamento: Pix, cartão de crédito, débito, dinheiro, etc.
- Entregador Vinculado
- Data de Criação e Data de Agendamento

Exportação:

Clique no botão "Exportar" para gerar um arquivo com todos os pedidos exibidos (de acordo com os filtros aplicados).`,
  },
  {
    titulo: 'Minha Empresa',
    conteudo: `A tela Minha Empresa permite configurar informações essenciais do estabelecimento.

O que pode ser configurado:
- Alterar o nome, logo e banner da empresa. Logo: 500x500 pixels (quadrado). Banner: 1270x460 pixels (horizontal).
- Editar o endereço do estabelecimento
- Definir o valor de pedido mínimo para delivery
- Ajustar os horários de funcionamento
- Ativar ou desativar formas de pagamento (online e offline)
- Adicionar avisos no cardápio
- Criar campos personalizados na tela de finalização de pedido (checkout)

Abas disponíveis:
- Perfil
- Horários
- Formas de pagamento
- Avisos
- Campos personalizados`,
  },
  {
    titulo: 'Catálogo',
    conteudo: `A tela de Catálogo é onde você pode criar e gerenciar produtos, complementos e opções.

Funcionalidades:
- Alterar preços dos produtos
- Colocar produtos como em falta ou ocultos
- Configurar disponibilidade por canal
- Ativar preço promocional
- Realizar edições em massa

Seções do Catálogo:
- Produtos: criar categorias e produtos, cadastrar complementos e opções, ativar preço promocional, marcar indisponíveis ou ocultos.
- Complementos: visualizar, criar e gerenciar complementos vinculados a vários produtos.
- Opções: criar e editar opções dentro dos complementos, com imagens e descrições.
- Filtros Avançados: selecionar vários produtos para edição em massa.

Como exportar o catálogo para planilha:
1. No Catálogo > Produtos, clique em "Ações" > "Exportar".
2. O sistema gera a planilha. Clique no ícone de notificação (sino) para baixar.

Peça Também:

Ferramenta que aparece no carrinho para sugerir produtos adicionais. Ativa pelo Catálogo > Produtos > Ações > Configurar "Peça Também". Pode ser automática (o sistema sugere) ou personalizada (você escolhe os produtos).`,
  },
  {
    titulo: 'Delivery',
    conteudo: `A tela de Delivery é composta por duas seções: Área de Entrega e Entregadores.

Tipos de configuração de entrega:
- Por Região: desenho no mapa (círculo ou polígono)
- Por Bairros: lista de bairros atendidos

Como criar área de entrega por círculo (raio):
1. Menu lateral > Delivery > Área de Entrega.
2. Clique na aba Regiões > "Nova Região".
3. Selecione "Círculo" no menu lateral.
4. Localize a loja no mapa, pressione o botão esquerdo do mouse e arraste para definir o raio.
5. Preencha nome, taxa de entrega e configurações, clique em Salvar.

Como criar área de entrega por polígono:
1. Menu lateral > Delivery > Área de Entrega.
2. Clique em Regiões > "Nova Região" > selecione "Polígono".
3. Clique no mapa para adicionar pontos de ancoragem. Para finalizar, clique no ponto inicial.
4. Preencha as informações e clique em Salvar.

Como criar área de entrega por bairro:
1. Menu lateral > Delivery > Área de Entrega.
2. Selecione a aba Bairros > "Gerenciar Bairros".
3. Adicione as cidades de atuação.
4. Clique em "Novo Bairro", preencha nome, cidade, taxa e tempo de entrega, clique em Salvar.

Como cadastrar entregadores:
1. Menu lateral > Delivery > Entregadores.
2. Clique em "Novo Entregador", informe nome e telefone, clique em Salvar.`,
  },
  {
    titulo: 'Clientes',
    conteudo: `A tela de Clientes permite visualizar, filtrar e cadastrar clientes, além de analisar dados como total de pedidos, ticket médio e classificação RFV.

Informações disponíveis por cliente:
- Nome, total de pedidos, ticket médio, data do último pedido, cliente desde, classificação RFV, total de pontos, gênero, data de nascimento.

Como cadastrar um novo cliente:
1. Clique em "+ Novo cliente".
2. Preencha nome, telefone e anotações.
3. Para cadastro completo, clique em "Cadastro Completo" e adicione e-mail, data de nascimento e gênero.

Outras formas de cadastrar clientes:
- Exportar contatos via Chatbot (Cardapinho): acesse o Cardapinho > 3 pontinhos > "Exportar Contatos".
- Enviar planilha CSV/TSV com nome e telefone (endereço opcional).

Metodologia RFV:

Avalia três critérios: Recência (tempo desde o último pedido), Frequência (quantidade de pedidos) e Valor Monetário (ticket médio). Cada parâmetro é classificado de 1 a 5, sendo 5 o melhor.

Grupos de clientes RFV:
- Campeões, Fiéis, Promissores, Novos clientes, Potenciais Fiéis, Precisam de atenção, Quase dormentes, Em risco, Hibernando, Perdidos, Não posso perder.`,
  },
  {
    titulo: 'Avaliações',
    conteudo: `Na aba de avaliações você acompanha a satisfação dos clientes e gerencia o feedback dos pedidos.

Como conseguir o link de avaliação:
- Clique em "Compartilhar pedido" > "Link de Avaliação".
- O Cardapinho também envia o link automaticamente ao concluir o pedido.
- É possível ativar impressão de QR Code de avaliação na via padrão (em Configurações > Impressão).

Como acompanhar as avaliações:

No menu lateral, acesse "AVALIAÇÕES". É possível aplicar filtros e selecionar datas. A avaliação é referente ao pedido e somente o dono do estabelecimento tem acesso às informações.`,
  },
  {
    titulo: 'Fiado',
    conteudo: `O módulo de Fiado é ideal para estabelecimentos que oferecem pagamentos para consumo interno de funcionários. Permite registrar vendas sem pagamento imediato, controlando o saldo devedor.

Como ativar o Fiado:

Vá em "MINHA EMPRESA" > "FORMAS DE PAGAMENTO" e ative a opção "FIADO".

IMPORTANTE: O Fiado é uma forma de pagamento interna, disponível apenas no sistema. Clientes que usam links de pedidos não têm acesso a essa opção.

Controle de dívidas:

Em "FIADO" > "CONTROLE DE DÍVIDAS": administre clientes devedores, registre novos pagamentos, novos débitos manualmente e veja o Extrato de cada cliente.

Visão geral das vendas no Fiado:

Em "FIADO" > "VISÃO GERAL": visualize dívidas pendentes, total de débitos, quantidade de clientes com dívidas, gráfico de vendas e recebimentos (filtrável por data).`,
  },
  {
    titulo: 'Administrativo',
    conteudo: `A tela de Administrativo é composta por: Usuários (criar logins para funcionários) e Assinaturas (visualizar lojas vinculadas e acompanhar faturas).

Como criar login para funcionários:
1. Menu lateral > Administrativo > Usuários.
2. Clique em "Adicionar Usuário".
3. Informe o e-mail do colaborador e clique em "Continuar".
4. Preencha nome, cargo e permissões de acesso.
5. Clique em "Convidar". O colaborador receberá um e-mail para criar a própria senha.

Como acessar faturas:
1. Menu lateral > Administrativo > Assinaturas.
2. Localize a fatura com status "A vencer" ou "Vencida".
3. Clique na fatura, escolha a forma de pagamento (PIX ou Cartão de Crédito) e pague.

Link de Multilojas:

Disponível para clientes com duas ou mais lojas ativas. Cria um link unificado para exibir todas as marcas/unidades. Inclui: exibição de todas as lojas em uma página, personalização com logo, banner, domínio próprio, Pixel do Facebook, API de Conversão, Google Tag Manager e Google Analytics.

Como ativar Multilojas:
1. Menu lateral > Administrativo > "Link multilojas".
2. Clique em "Habilitar Multi Lojas".
3. Preencha nome do grupo e identificador do link, clique em Salvar.`,
  },
  {
    titulo: 'Configurações',
    conteudo: `A tela de Configurações permite ajustar o funcionamento do sistema conforme as necessidades do negócio.

Abas disponíveis:
- Configurações Gerais: tipos de pedidos, notificações e comportamentos automáticos.
- Personalizar Site: controle sobre o que será exibido para os clientes.
- Impressão: configurações de impressoras.
- Agendamento: regras e horários para pedidos agendados.
- Mesas/Comandas: criação e gerenciamento de mesas/comandas com QR Codes e taxa de serviço.
- Integrações: acesso às integrações disponíveis.`,
  },
  {
    titulo: 'Impressora',
    conteudo: `A impressora é essencial nas operações de delivery. Configure as impressões pelo menu: Configurações > Impressão.

O que é possível fazer na tela de impressão:
- Vincular a impressora ao sistema
- Criar setores de impressão (para estabelecimentos com mais de um setor, como cozinha e bar)
- Definir quantidade de vias para cada tipo de pedido
- Adicionar mensagens personalizadas ao final da via padrão`,
  },
  {
    titulo: 'Ver Meus Links',
    conteudo: `Na Cardápio Web, existem vários links para receber pedidos. Acesse pelo menu lateral em "VER MEUS LINKS".

Links disponíveis:
- Catálogo Web: para delivery, onde o cliente faz pedidos para entrega ou retirada.
- Catálogo de Visualização: exibido no estabelecimento para visualização do cardápio sem realizar pedidos (pode ser usado em QR Codes nas mesas).
- Link para Pedidos Balcão: específico para pedidos feitos no balcão.
- Link para Pedidos de Mesa e Comanda: cada mesa tem um link único para QR Code.
- Link de Múltiplos Estabelecimentos: para contas com mais de uma loja.
- Gerador de QR Codes: permite personalizar QR Codes com textos e cores.

Ícones de ação:
- Olho = Abrir link
- Dois papéis = Copiar link
- Logo do WhatsApp = Enviar pelo WhatsApp
- QR Code = Abrir QR Code`,
  },
];

/* ────────────────────────────────── AUTOMAÇÃO ──────────────────────────── */

export const REPS_AUTOMACAO: RepsArtigo[] = [
  {
    titulo: 'Food Marketing / Campanhas via WhatsApp',
    conteudo: `O disparador via WhatsApp/food marketing é uma ferramenta para envio de mensagens em massa de forma prática e eficiente, permitindo alcançar mais clientes e impulsionar vendas.

Como acessar:
- Menu lateral > "Food Marketing".
- Campanhas WhatsApp: onde você realiza disparos e campanhas.
- Segmentação de clientes: onde você cria filtros personalizados para os disparos.

Como criar uma campanha:
1. Conecte o número do WhatsApp escaneando o QR Code.
2. Clique em "Disparar mensagens".
3. Preencha o Título (visível só para o estabelecimento) e a Mensagem (texto e/ou imagem).
4. Use variáveis: Nome do cliente e Descadastrar.
5. Adicione até 3 variações de mensagens para maior segurança contra bloqueio.
6. Defina a data de envio: Agora, em data específica ou recorrente (diária, semanal ou mensal).
7. Selecione os destinatários com filtros: ticket médio, quantidade de pedidos, tempo desde a última compra, aniversariantes, etc.
8. Clique em "Enviar mensagem".`,
  },
  {
    titulo: 'Chatbot - Cardapinho',
    conteudo: `O Cardapinho é uma extensão para navegador que facilita o atendimento automático aos clientes pelo WhatsApp Web, oferecendo atendimento mais rápido, eficiente e profissional.

Requisitos:
- WhatsApp Web aberto e conectado enquanto o chatbot estiver ativo.
- Computador ligado e com acesso à internet durante o atendimento.

Como instalar a extensão:
1. Menu lateral > Configurações > Integrações > Cardapinho.
2. Clique em "Instalar Extensão" e adicione no Chrome.
3. Acesse o WhatsApp Web, atualize a página e faça login na extensão.

Indicadores de status das conversas:
- Verde: conversas ativas — o Cardapinho está respondendo automaticamente.
- Laranja: conversas aguardando atendimento humano.
- Azul: conversas pausadas — bot desativado manualmente.

Funcionalidades:
- Atender clientes automaticamente com respostas prontas.
- Personalizar mensagens de atendimento.
- Ser notificado quando intervenção humana é necessária.
- Criar pedidos diretamente pelo WhatsApp (PDV).
- Controlar atendimentos com indicadores de status.
- Receber notificações sobre o andamento de pedidos.

Criar pedidos pelo WhatsApp (PDV):
1. No Cardapinho > Atendimento, clique na conversa do cliente > "+ Novo Pedido".
2. Escolha o tipo: Delivery, Retirada ou Consumo no Local.
3. Adicione produtos, veja o carrinho, selecione a forma de pagamento e finalize.
4. O cliente recebe automaticamente o resumo do pedido no WhatsApp.`,
  },
  {
    titulo: 'Integrações',
    conteudo: `Integrações de Marketing e Vendas:
- Domínio Próprio
- Facebook Pixel e Token da API
- Catálogo do Facebook
- Google Analytics
- Google Tag Manager
- Cardapinho (Chatbot)
- Repediu, Retorne.app

Integrações de Marketplaces:
- iFood, 99Food, Keeta, Aiqfome

Integrações de Pagamentos Online:
- Cielo, Mercado Pago

Integrações de Logística:
- iFood sob demanda, Foody Delivery, Pick n Go!, Bee Delivery, MOTTU, Let's Express, Husky, Machine, JAXBus, Entregas Expressas, Moovery, Agilizone

Integrações de Sistemas de Gestão:
- Saipos, Eclética, Sischef, F360 Finanças, Glow, IzzyWay

API's para Integrações:
- API Aberta, Open Delivery`,
  },
];

/* ─────────────────────────────── AUMENTO DE VENDAS ─────────────────────── */

export const REPS_AUMENTO_VENDAS: RepsArtigo[] = [
  {
    titulo: 'Cupons e Descontos',
    conteudo: `Os cupons de desconto ajudam a incentivar vendas e atrair novos clientes. Acesse pelo menu lateral em "CUPONS DE DESCONTO".

Informações exibidas na tela de cupons:
- Situação: disponível, expirado ou inativo.
- Nome e código do cupom.
- Desconto: valor fixo ou percentual.
- Data de expiração, quantidade disponível, usos e status ativo/inativo.

Como criar um cupom:
1. Clique em "+ Novo cupom".
2. Nome do Cupom: destaque a característica principal da oferta.
3. Código: funciona como senha para o cliente obter o desconto. Deixe em branco para aplicação automática.
4. Tipo de Desconto: Valor fixo (R$), Percentual (%) ou Entrega grátis.

Limitações configuráveis:
- Data inicial e final de validade
- Horário específico de disponibilidade
- Disponibilidade por dia da semana
- Disponibilidade por tipo de pedido (delivery, retirada, consumo no local)
- Quantidade máxima de usos
- Valor mínimo de compra
- Apenas para novos clientes
- Permitir múltiplos usos pelo mesmo cliente

Configurações avançadas:

Associar desconto a itens específicos do cardápio e configurar restrições de formas de pagamento.`,
  },
  {
    titulo: 'Fidelidade e Cashback',
    conteudo: `O programa de fidelidade permite oferecer um programa de pontos para os clientes acumularem e trocarem por produtos ou descontos.

Regra de pontuação:

Para cada R$1,00 em compras (valor dos produtos após descontos, sem incluir taxa de entrega), o cliente ganha 1 ponto.

Como ativar:
1. Menu lateral > FIDELIDADE > RECOMPENSAS.
2. Ative o programa de fidelidade clicando no ícone.

Brinde para novos clientes:

É possível conceder pontos extras ao fazer o primeiro pedido. Ative "BRINDE PARA NOVOS CLIENTES" e defina a quantidade de pontos.

Tipos de recompensas:
- Entrega grátis: defina quantos pontos o cliente gasta para cada R$1 de taxa de entrega.
- Resgate de descontos fixos (R$10, R$5, etc.): cliente troca pontos por desconto. Exemplo: 100 pontos = R$10 de desconto (proporção de 10%).
- Resgate de produtos do catálogo: cliente usa pontos para resgatar produtos. Defina quantos pontos por R$1 do produto.

Proporção recomendada pelo mercado: 5% a 10%.

Adicionar ou remover pontos manualmente:

Menu lateral > FIDELIDADE > ATIVIDADES > PONTUADOR. Escolha Adicionar ou Remover pontos, informe o cliente e a quantidade.`,
  },
];

/* ───────────────────────────── MÓDULOS DO SISTEMA ──────────────────────── */

export const REPS_MODULOS_SISTEMA: RepsArtigo[] = [
  {
    titulo: 'Estoque Avançado',
    conteudo: `O Módulo de Estoque Avançado (R$29,99/mês) permite controlar o estoque por produtos e opções, gerenciar insumos e criar fichas técnicas.

Funcionalidades:
- Controle preciso dos ingredientes utilizados em cada item do cardápio.
- Baixa automática dos insumos a cada venda.
- Quando insumo acaba, produtos podem ser automaticamente marcados como indisponíveis.
- Opção de estoque negativo (produtos continuam disponíveis mesmo com insumo zerado).

Como criar um insumo:
1. Menu lateral > Estoque > Meu Estoque.
2. Clique em "Novo Insumo".
3. Preencha: nome, unidade de medida (gramas, litros, unidades) e categoria (opcional).
4. Clique em Salvar e informe a quantidade disponível.

Como montar a ficha técnica:
1. Menu lateral > Estoque > Meu Estoque.
2. Clique em Produtos ou Opções.
3. Encontre o item e clique em "Ficha Técnica".
4. Clique em "Adicionar Insumo", selecione os ingredientes e informe a quantidade exata.`,
  },
  {
    titulo: 'Módulo Financeiro',
    conteudo: `O Módulo Financeiro (R$69,99/mês) oferece controle total das finanças: contas a pagar e receber, fluxo de caixa, relatórios completos.

Funcionalidades:
- Lançamentos: receitas, despesas e transferências entre contas.
- Fluxo de caixa: análise em Tabela, Gráfico ou Calendário.
- Configurações: contas bancárias, categorias financeiras, centros de custos, fornecedores, funcionários e formas de pagamento.

Como fazer lançamentos:
1. Menu lateral > Financeiro > Lançamentos > "Adicionar".
2. Selecione o tipo: Despesa, Receita ou Transferência.
3. Preencha data, valor, categoria, conta bancária, etc. e clique em Salvar.

Como analisar o fluxo de caixa:
1. Menu lateral > Financeiro > Fluxo de Caixa.
2. Use filtros de data, conta bancária e categorias. Escolha visualização: Tabela, Gráfico ou Calendário.`,
  },
  {
    titulo: 'Módulo de Gestão de Entregadores',
    conteudo: `O Módulo de Gestão de Entregas (R$54,99/mês) facilita o controle, organização e distribuição das entregas.

Inclusões no plano:
- 500 pedidos de delivery por mês (incluindo cancelados).
- Pedidos adicionais até 1.500: R$0,08 por pedido.
- Acima de 1.500 pedidos adicionais: R$0,06 por pedido.

Funcionalidades:
- Roteirização de pedidos pelo mapa interativo.
- Visualização da última localização dos entregadores.
- Criação de logins individuais para entregadores.
- Desempenho: tempo médio de preparo, tempo médio de entrega, atrasos e tempo total.
- Mapa de calor das regiões com mais pedidos.

Formas de atribuir pedidos a entregadores:
1. Atribuição manual pelo mapa (roteirização manual).
2. Atribuição automática (roteirização automática — ideal para alto fluxo).
3. Atribuição pelo próprio entregador: escaneando o QR Code da via padrão ou digitando o número do pedido.

Funcionalidades do login do entregador:
- Notificação de novos pedidos.
- Histórico de entregas e ganhos.
- Acesso ao mapa com redirecionamento para Google Maps ou Waze.`,
  },
  {
    titulo: 'Módulo de Integração com Marketplaces',
    conteudo: `O Módulo de integração com marketplaces (R$29,99/mês) centraliza pedidos do iFood e outros marketplaces diretamente no sistema.

Como fazer a integração com iFood:
1. Menu lateral > Configurações > Integrações > iFood.
2. Clique em "Adicionar loja do iFood" > "Gerar código de autorização".
3. Clique em "Autorizar integração" e autorize no site do iFood.
4. Copie o código gerado, cole no sistema e clique em Confirmar.
5. Selecione a loja do iFood e confirme.

IMPORTANTE: Para aceitação e impressão automática funcionarem corretamente, desative essas funções no painel do iFood.

Vincular produtos com o iFood (para emissão de notas fiscais):
1. Configurações > Integrações > iFood > "Ver códigos dos produtos".
2. Copie o código interno do produto e insira no campo "PDV do produto ou opção" no painel do iFood.

Widget do iFood:

Pequeno aplicativo incorporado à tela de gestão de pedidos. Funcionalidades: chat com clientes, acompanhamento de entregas, pausa programada da loja. Ative em Configurações > Integrações > iFood > botão Widget. Visível apenas na tela de Gestão de Pedidos, no canto inferior direito, em dispositivos com largura acima de 850 pixels.`,
  },
  {
    titulo: 'Módulo Fiscal',
    conteudo: `O Módulo Fiscal (R$69,99/mês) permite emitir notas fiscais de forma prática. Inclui até 2.500 notas por mês. Notas excedentes: R$0,05 por nota.

Emissor fiscal utilizado:
- Sistema: eNotas (CNPJ: 57.743.975/0001-27)
- Razão Social: Enotas Desenvolvimento de Softwares LTDA
- Nome Comercial: eNotas Gateway

Etapas da configuração:
1. Dados da Empresa: CNPJ, Inscrição Estadual, Razão Social, Código do Regime Tributário.
2. Configurações Gerais: CSC, número e série da nota.
3. Certificado Digital: formato .PFX ou .P12 (modelo A1 apenas).
4. Ambiente de emissão: Homologação (testes) ou Produção (emissão oficial).

IMPORTANTE: Todas as configurações devem ser realizadas com o apoio do contador.

Envio automático de XMLs para contabilidade:

Configure o e-mail do contador em Fiscal > Configurações > Dados da Empresa. No dia 03 de cada mês, o sistema envia automaticamente resumo das notas e link para download dos XMLs.

Autorização por estado:
- Paraná: emitir Documento de Cadastro de Autorização de Uso na SEFAZ-PR com os dados do eNotas, enviar ao suporte.
- Santa Catarina: contatar o suporte para solicitar autorização (prazo: até 2 dias úteis).`,
  },
];

/* ──────────────────────────────── SUPORTE ──────────────────────────────── */

export const REPS_SUPORTE = `Canais de atendimento:
- Chat no sistema: clique em "Falar com o suporte".
- WhatsApp do Suporte: disponível na Central de Ajuda.

Horários de Atendimento:
- Segunda a Sábado: 09:00 às 22:00
- Domingo: 14:00 às 22:00
- Feriado: 09:00 às 22:00

Perguntas Frequentes:
- É possível imprimir pedidos APENAS pelo celular?
- É possível instalar o QZTRAY no celular Android?
- Como criar atalho do sistema no computador ou celular?
- É possível configurar tablet por acesso remoto para impressão?
- Consigo usar o chatbot pelo celular Android ou iOS?
- É possível imprimir automaticamente usando apenas o celular?
- Consigo receber pedidos do iFood dentro do sistema?
- Onde baixar o aplicativo da Cardápio Web?
- Tem como receber minha fatura por e-mail?

Acesso Remoto:

O suporte utiliza AnyDesk para acesso remoto seguro. Baixe em anydesk.com, informe o ID ao técnico e clique em "Aceitar" para autorizar. O acesso só é realizado com sua autorização.

Quando é necessário acesso remoto:
- Falhas na impressão não resolvidas com instruções básicas.
- Problemas técnicos complexos no sistema.
- Auxílio com configurações avançadas (rede, drivers, impressoras).
- Instalação de ferramentas essenciais.`;

/* ──────────────────────────────── PLANOS & PREÇOS ──────────────────────── */

export const REPS_PLANOS = [
  { nome: 'Mesas', mensal: 'R$ 139,99/mês', total: 'R$ 1.679,88', desc: 'Para restaurantes com atendimento físico em mesas e balcão.' },
  { nome: 'Delivery', mensal: 'R$ 179,99/mês', total: 'R$ 2.159,88', desc: 'Para operações focadas em delivery e estratégias de marketing.' },
  { nome: 'Premium', mensal: 'R$ 239,99/mês', total: 'R$ 2.879,88', desc: 'Operação completa: mesas, delivery, marketing e iFood.' },
];

/** Desconto de parceria (canal de representantes) por período de fidelidade. */
export const REPS_DESCONTO_PARCERIA = [
  { periodo: 'Anual', desconto: '5%', mesas: 'R$132,99', delivery: 'R$170,99', premium: 'R$227,99' },
  { periodo: 'Semestral', desconto: '7%', mesas: 'R$139,49', delivery: 'R$176,69', premium: 'R$232,49' },
  { periodo: 'Trimestral', desconto: '9%', mesas: 'R$145,59', delivery: 'R$181,99', premium: 'R$236,59' },
  { periodo: 'Mensal', desconto: '15%', mesas: 'R$144,49', delivery: 'R$178,49', premium: 'R$229,49' },
];

/** Promoção para negociação — válida só nos primeiros 3 meses, depois volta ao valor mensal padrão. */
export const REPS_PROMO_NEGOCIACAO = [
  { desconto: '20%', mesas: 'R$135,99', delivery: 'R$167,99', premium: 'R$215,99' },
  { desconto: '30%', mesas: 'R$118,99', delivery: 'R$146,99', premium: 'R$188,99' },
];

/* ─────────────────────────────── CONCORRENTES ──────────────────────────── */

export const REPS_DIFERENCIAIS = [
  'Ferramenta completa: automação + aumento de vendas + gestão em um único plano',
  'Suporte humanizado 7 dias por semana (não terceirizado)',
  'Disparador de WhatsApp com filtros avançados e agendamento',
  'Programa de fidelidade nativo (sem módulo extra na maioria dos planos)',
  'ChatBot com IA incluso no plano Delivery e Premium',
  'Parcerias com agências e gestores de tráfego: integração com Pixel, catálogo e API de conversões',
  'Cardápio de alta conversão — pensado para tráfego pago',
  'Crescimento junto ao cliente: quanto mais o restaurante vende, mais a CW cresce',
];

export const REPS_CONCORRENTES = [
  { nome: 'Anota Aí', tag: 'Concorrente direto', site: 'anota.ai' },
  { nome: 'Saipos', tag: 'Integração disponível', site: 'saipos.com' },
  { nome: 'Consumer / Menu Dino', tag: 'Ponto fraco: cardápio', site: 'consumer.com.br' },
  { nome: 'Goomer', tag: 'Foco em totens', site: 'goomer.com.br' },
  { nome: 'WhatsMenu', tag: 'SMS ao invés de WhatsApp', site: 'whatsmenu.com.br' },
  { nome: 'Instadelivery', tag: 'Só delivery', site: 'instadelivery.com.br' },
];

/* ────────────────────────────────── CARGOS ─────────────────────────────── */

export const REPS_CARGOS = [
  { sigla: 'BDR', nome: 'Business Development Representative', desc: 'Pré-vendedor responsável por prospectar leads que não solicitaram atendimento e não conhecem a empresa. Objetivo: qualificar e agendar reunião com o consultor.' },
  { sigla: 'SDR', nome: 'Sales Development Representative', desc: 'Pré-vendedor responsável por prospectar leads que solicitaram atendimento e conhecem a marca. Objetivo: qualificar e agendar reunião com o consultor.' },
  { sigla: 'LDR', nome: 'Lead Development Representative', desc: 'Responsável pela criação de listas para o time prospectar, aplicando conhecimentos de inteligência comercial.' },
  { sigla: 'Closer', nome: 'Especialista em Vendas', desc: 'Negocia planos e fecha a venda diretamente com o cliente, contornando objeções, apresentando o produto e acompanhando até o fechamento.' },
  { sigla: 'Supervisor', nome: 'Supervisor de Vendas', desc: 'Garante que o time siga as rotinas definidas estrategicamente pelo gerente de vendas.' },
  { sigla: 'Coordenador', nome: 'Coordenador de Vendas', desc: 'Acompanha o trabalho dos supervisores, define estratégias e ajuda no desenvolvimento de lideranças e vendedores.' },
  { sigla: 'Gerente', nome: 'Gerente de Vendas', desc: 'Acompanha coordenadores e supervisores, define estratégias e desenvolve as lideranças do time.' },
];

/* ────────────────────────────────── HACKS ──────────────────────────────── */

export const REPS_HACKS = [
  {
    titulo: 'Envia o lead para fechar na reunião',
    situacao: 'O lead já demonstrou sinais claros que gostaria de fechar, porém não quer a videochamada e prefere seguir pelo WhatsApp.',
    conducao: 'Entendo [NOME], sei que sua rotina é bem corrida e imagino que o tempo seja curto, mas a videochamada tem uma duração curta de 30 minutos, seria muito importante você participar para tirar suas dúvidas, validar se a ferramenta é o que você busca e seguir para a contratação com nosso especialista. Dessa forma você até comprova tudo isso que estou te passando já que estará vendo o sistema. Tenho horário disponível para hoje às [horário], você teria disponibilidade?',
  },
  {
    titulo: 'Lead demonstrou insatisfação com o processo de perguntas',
    situacao: 'O lead demonstra insatisfação com o processo de qualificação.',
    conducao: 'Tente ligar para o lead e, caso não consiga conexão na ligação, abra uma exceção ao processo e busque responder diretamente às perguntas do lead com intuito de marcar uma reunião rapidamente. Na ligação: "Entendo [NOME], sei que você está com pressa para saber as informações, mas preciso entender como funciona a sua operação para te passar o plano mais adequado. Me diz qual a dificuldade que você enfrenta que te fez se interessar pelo nosso sistema?"',
  },
  {
    titulo: 'Lead pediu para enviar um material com funcionalidades e planos',
    situacao: 'O lead quer um material que contenha as funcionalidades e os valores dos planos para analisar e validar com outra pessoa.',
    conducao: 'Entendo [NOME], para isso temos uma videochamada onde nosso especialista vai te mostrar como funciona todo o sistema. Esse momento é importante porque ele vai analisar toda a necessidade da sua operação e separar um momento para te atender de acordo com essas necessidades. Imagina que eu te mando um material mas surgem várias dúvidas — na videochamada nosso especialista consegue te mostrar como funciona e tirar suas dúvidas para que você valide tudo.',
  },
  {
    titulo: 'Lead está com urgência e quer prioridade',
    situacao: 'O lead só quer contratar se conseguir uma prioridade para que o sistema esteja pronto no dia seguinte, pois já vai inaugurar e precisa do cardápio funcionando e da configuração da impressora.',
    conducao: 'SDR: "Se eu conseguir essa prioridade para você, fechamos negócio ainda hoje?"\nLEAD: Sim, fechamos, estou com urgência!\n\nObs: O SDR deve consultar as lideranças de Implementação e Ativação via grupo #prioridades_de_clientes no Slack e aguardar retorno antes de confirmar para o lead.',
  },
];

/* ─────────────────────────────── OBJEÇÕES (MATRIZ) ─────────────────────── */

export const REPS_OBJECOES_MATRIZ = [
  { categoria: 'Valores', momento: 'Início', objecao: '"Eu só quero saber o preço"', resposta: 'Nós temos planos a partir de R$139,99/mês (anual). Mas antes de falar de preço, preciso entender a sua operação — assim consigo te indicar o plano certo e mostrar como o investimento já se paga nos primeiros meses.' },
  { categoria: 'Valores', momento: 'Fim', objecao: '"Eu achei muito caro"', resposta: 'Se você achou caro é porque eu ainda não consegui mostrar todo o valor da ferramenta. Uma das funcionalidades nativas é o disparador de WhatsApp — com ele, um único disparo costuma pagar vários meses de mensalidade. Posso te mostrar como funciona?' },
  { categoria: 'Concorrente', momento: 'Fim', objecao: '"A ferramenta que tenho hoje tem tudo que vocês têm"', resposta: 'Você consegue identificar algum ponto de melhoria no sistema atual? É muito comum ferramentas se apresentarem como completas, mas com funcionalidades incompletas ou em módulos separados. O que você usa hoje e sente que poderia ser melhor?' },
  { categoria: 'Ceticismo', momento: 'Início', objecao: '"Minhas vendas estão fracas, não é bom momento"', resposta: 'Entendo o receio. Mas deixa eu te perguntar: você já teve dificuldade de atender clientes no WhatsApp? Essa dificuldade compromete o atendimento? Automatizando esse processo, você evita perder pedidos e constrói uma base de clientes para fidelizar.' },
  { categoria: 'Processo', momento: 'Fim', objecao: '"Essa videochamada é realmente necessária?"', resposta: 'Sim! A gente faz isso para que você faça uma contratação com segurança — o consultor vai te mostrar exatamente o que a plataforma faz pela sua operação, personalizado para o seu negócio.' },
  { categoria: 'Dispensa', momento: 'Fim', objecao: '"Me manda no WhatsApp que eu olho e te dou retorno"', resposta: 'Posso sim te passar as informações no WhatsApp. Mas antes de encerrar, você consegue me dizer qual é o principal desafio da sua operação hoje? Assim eu te envio exatamente o que faz sentido para você avaliar.' },
  { categoria: 'Deal Breaker', momento: 'Qualquer', objecao: '"Só tenho R$60 para investir"', resposta: 'Entendo. Nesse caso, nossos planos começam em R$139,99/mês. Se o orçamento não se encaixa agora, posso te passar nosso contato para quando o momento estiver melhor?' },
];

/* ─────────────────────────────── MOTIVOS DE PERDA ──────────────────────── */

export const REPS_MOTIVOS_PERDA = [
  { titulo: 'Preço', desc: 'Lead não viu valor suficiente para o investimento.' },
  { titulo: 'Timing', desc: 'Momento errado — lead não estava pronto para decidir.' },
  { titulo: 'Concorrente', desc: 'Optou por solução concorrente.' },
  { titulo: 'Sem decisão', desc: 'Lead sumiu ou não respondeu.' },
  { titulo: 'Não qualificado', desc: 'Lead não tinha o perfil de ICP.' },
];

/* ───────────────────────────────── MATERIAIS ───────────────────────────── */

export const REPS_MATERIAIS = [
  { categoria: 'Ferramentas', fonte: 'Canalize PRM', titulo: 'Como usar o PRM do vendor para vender mais', desc: 'O PRM é a central que organiza operações comerciais, acompanha resultados e fortalece o relacionamento com a empresa parceira.' },
  { categoria: 'Contrato', fonte: 'Canalize PRM', titulo: 'Direitos e deveres do parceiro: o que analisar no contrato', desc: 'O contrato define obrigações, prazos, remuneração e condições de encerramento — a base de qualquer parceria sólida.' },
  { categoria: 'Remuneração', fonte: 'Canalize PRM', titulo: 'Revenue share, margem ou comissão: qual modelo escolher', desc: 'Comissão, margem ou revenue share — cada modelo tem o seu perfil ideal de parceiro. Entenda qual combina com você.' },
  { categoria: 'Relacionamento', fonte: 'Canalize PRM', titulo: 'O erro de tratar parceiro como cliente', desc: 'Parceiros são agentes estratégicos de crescimento mútuo, não consumidores finais. Essa diferença muda tudo.' },
];

export const REPS_MATERIAIS_INTERNOS = [
  {
    grupo: 'Apresentação',
    itens: ['Apresentação institucional Cardápio Web', 'Pitch deck para parceiros e indicações', 'Vídeo institucional da marca'],
  },
  {
    grupo: 'Planejamento',
    itens: ['Calendário de metas do trimestre', 'Roadmap de produto', 'Plano de expansão do canal de representantes'],
  },
];

/* ────────────────────────────────────── FAQ ────────────────────────────── */

export const REPS_FAQ: RepsArtigo[] = [
  {
    titulo: 'Totem de Autoatendimento',
    conteudo: `O que é o Totem de Autoatendimento?

É um módulo extra da Cardápio Web que transforma qualquer tablet ou monitor touchscreen em um totem de autoatendimento. O cliente faz o pedido completo sozinho — navega pelo cardápio, escolhe complementos, se identifica, escolhe "comer aqui" ou "para levar", aplica cupons e paga — sem precisar de garçom ou atendente.

Quanto custa o módulo de Totem?

R$99,99 por dispositivo por mês. Cada totem cadastrado é um dispositivo independente. O acesso à tela de gestão de totens, terminais de pagamento e ao link do totem só fica disponível para clientes com o módulo ativo.

Quais dispositivos são compatíveis?

O totem é um site web — funciona em qualquer dispositivo touchscreen com navegador: Android, Windows ou Linux. Pode ser um tablet, PC com monitor touch ou totem tradicional. A Cardápio Web não comercializa hardware e não tem parceiros oficiais no momento. O cliente busca o equipamento no mercado conforme sua preferência.

Os produtos do totem são os mesmos do cardápio digital?

Sim. Os produtos oferecidos no totem são os mesmos do cardápio digital, respeitando as regras de disponibilidade do link de balcão. Não é possível ter um cardápio diferente no totem.

Quais formas de pagamento o totem aceita?

Dinheiro (padrão, sempre habilitado), Pix automático via Tuna (requer conta de Pix Automático ativa no sistema), Cartão de crédito e Cartão de débito (requerem terminal de pagamento Smart TEF vinculado ao totem). É obrigatório ter pelo menos uma forma de pagamento configurada.

Como vincular o totem ao dispositivo?

1. Abrir o link do totem no navegador do dispositivo touchscreen.
2. No portal, ir em Configurações > Dispositivos > Totens, clicar em "Adicionar totem", dar um nome e clicar em "Gerar código de vínculo" — aparece um código de 6 dígitos com tempo de expiração.
3. Inserir o código na tela "Vincular Totem" que está aberta no equipamento.

O totem tem suporte a impressora?

Inicialmente o totem foi desenvolvido para funcionar sem impressora. Para estabelecimentos que quiserem imprimir pedidos após o envio, essa opção está disponível apenas para dispositivos com Windows.

O que é o "Chamariz" e o "Banner"?

Chamariz: mídias (imagens ou vídeos verticais) que aparecem na tela inicial do totem quando não há atendimento em andamento. Aceita JPG, PNG, WEBP, HEIC (até 10 MB) e MP4, MOV, WebM etc. (até 50 MB). Limite de 5 mídias.

Banners: mídias que aparecem na página do cardápio do totem, em carrossel. Se nenhuma for adicionada, o totem usa o mesmo banner do cardápio digital.

O cancelamento de pedido faz estorno automático?

Depende da forma de pagamento:
- Pix: sim — ao cancelar no portal, o estorno é realizado automaticamente pelo sistema. O cliente também pode cancelar diretamente no totem antes de concluir o pagamento.
- Cartão de crédito/débito: NÃO há estorno automático. O procedimento deve ser feito diretamente no sistema do banco ou na própria maquininha.

O totem tem programa de fidelidade?

Sim. O cliente se identifica obrigatoriamente pelo telefone (via teclado numérico em tela), o que vincula o pedido ao programa de fidelidade para acúmulo de recompensas e recebimento de ofertas. Se já for cadastrado, não precisa informar o nome. Se for novo, uma segunda tela solicita o nome.

É possível usar cupons de desconto no totem?

Sim, mas apenas cupons com código. No totem não há aplicação automática de descontos — o cliente precisa inserir o código manualmente na etapa de confirmação do pedido.

Como funciona o terminal de pagamento (maquininha)?

O vínculo do terminal se dá via Smart TEF. Cada totem pode ter seu próprio terminal vinculado. O processo: no portal, acessar "Configurações > Dispositivos > Terminais de pagamento", adicionar o terminal, selecionar a marca da maquininha e seguir as instruções detalhadas de instalação do app Smart TEF — algumas marcas requerem contato com o suporte da CW.`,
  },
  {
    titulo: 'Planos & Preços',
    conteudo: `Quais são os planos disponíveis?

Mesas: R$139,99/mês (anual) — cardápio para mesas e balcão, PDV, disparador de mensagens, automações, cupons, KDS e fiado.

Delivery: R$179,99/mês (anual) — tudo do Mesas + cardápio delivery, ChatBot com IA, pagamento online, fidelidade, Meta Ads e Google Ads.

Premium: R$239,99/mês (anual) — tudo do Delivery + integração iFood, gestão de entregadores.

Quais módulos add-on existem e quanto custam?

- iFood: R$29,99/mês
- Estoque Avançado: R$29,99/mês
- Cupom Fiscal: R$69,99/mês
- Entregadores: R$54,99/mês
- Financeiro: R$69,99/mês
- Totem de autoatendimento: R$99,99 por dispositivo/mês

Há descontos por fidelidade?

Sim, descontos de parceria:
- Anual: 5% → Mesas R$132,99 | Delivery R$170,99 | Premium R$227,99
- Semestral: 7% → Mesas R$139,49 | Delivery R$176,69 | Premium R$232,49
- Trimestral: 9% → Mesas R$145,59 | Delivery R$181,99 | Premium R$236,59
- Mensal: 15% → Mesas R$144,49 | Delivery R$178,49 | Premium R$229,49

Existe promoção para negociação?

Sim, promoções para os primeiros 3 meses:
- 20% de desconto: Mesas R$135,99 | Delivery R$167,99 | Premium R$215,99
- 30% de desconto: Mesas R$118,99 | Delivery R$146,99 | Premium R$188,99

Após os 3 meses, retorna ao valor mensal padrão. Use com critério.`,
  },
  {
    titulo: 'Produto',
    conteudo: `O que é o ChatBot com Inteligência Artificial?

É uma ferramenta de automação de atendimento no WhatsApp que recebe pedidos, responde dúvidas e conduz o cliente pelo fluxo de compra sem precisar de atendente humano. Disponível nos planos Delivery e Premium.

O que é o disparador de mensagens?

Ferramenta de envio de mensagens em massa via WhatsApp para a base de clientes. Permite disparar ofertas, cupons, imagens e mensagens personalizadas (com nome do cliente) para milhares de clientes em minutos. Somos a ferramenta mais indicada por mais de 200 agências de marketing parceiras.

O cardápio digital funciona no iFood?

O cardápio digital da CW é independente do iFood. O módulo iFood (R$29,99/mês) integra os pedidos do iFood ao sistema da CW para gerenciamento centralizado. O plano Premium já inclui a integração com iFood e Entrega Fácil.

O que é o KDS?

Kitchen Display System — tela de gestão de pedidos na cozinha. Os pedidos chegam automaticamente na tela da cozinha, eliminando comandas em papel e reduzindo erros. Disponível no plano Mesas.`,
  },
  {
    titulo: 'Integração WhatsApp (Meta)',
    conteudo: `O que é a integração oficial com a Meta?

É a integração do WhatsApp via API oficial da Meta. O ChatBot e as notificações de pedido passam a ser enviados pela infraestrutura da própria Meta, com mais estabilidade e independência — sem depender da extensão do WhatsApp. O envio de campanhas pela API oficial ainda não está disponível (é a próxima etapa); por enquanto contempla ChatBot e notificações automáticas.

Preciso manter um computador ligado para o WhatsApp funcionar?

Não. Com a API oficial da Meta, as mensagens saem pela infraestrutura da Meta — não é mais necessário deixar um computador ligado com o navegador aberto. Essa dependência existia no modelo da extensão do WhatsApp.

Vou perder meu WhatsApp Business ao conectar?

Não. A integração tem suporte a coexistência: o mesmo número continua sendo usado normalmente pelos atendentes no WhatsApp Business e no WhatsApp Web, ao mesmo tempo que roda as automações. Não é preciso escolher entre atendimento humano e automação — os dois funcionam juntos. Recomenda-se manter a opção de coexistência habilitada durante a configuração.

Posso conectar mais de um número?

A integração foi feita com suporte a múltiplos números, mas nesta primeira versão cada estabelecimento pode usar apenas um número conectado por vez. A gestão de múltiplos números no mesmo estabelecimento chega em versões futuras.

O ChatBot precisa de modelos (templates) aprovados pela Meta?

Não. Como a conversa é sempre iniciada pelo cliente, abre-se uma "janela" de 24h em que o ChatBot responde livremente, sem template. Os modelos aprovados pela Meta só são exigidos para iniciar uma conversa fora das 24h (janela fechada) — caso de campanhas e de notificações quando o cliente está sem conversa ativa. Quem aprova os templates é a própria Meta, e eles não podem ser editados depois de criados (para mudar, cria-se um novo).

O que muda na área de WhatsApp e nas notificações de pedido?

Surge a área "Gerenciar WhatsApp", que centraliza tudo no portal: números conectados, modelos de mensagem, notificações de pedido e personalização do ChatBot (antes só na extensão). Nas notificações, cada evento passa a ter duas mensagens — uma para janela aberta (sem template e sem custo da Meta) e uma para janela fechada (template aprovado, que pode gerar cobrança da Meta). O sistema escolhe automaticamente qual usar conforme o cliente ter ou não conversa ativa.`,
  },
  {
    titulo: 'CW App Store',
    conteudo: `O que é a CW App Store?

É o marketplace de aplicativos da Cardápio Web: um catálogo centralizado, dentro do portal, com integrações da própria CW e de parceiros (sistemas de gestão, marketing, delivery, chatbot e outras soluções). O objetivo é dar mais organização, controle e transparência — o cliente descobre, instala e gerencia integrações num só lugar.

Onde o cliente acessa e como encontra os apps?

Pela tela "CW Apps", no menu lateral do portal. Lá o lojista vê primeiro os apps já instalados, depois os recomendados e a lista completa de disponíveis, com filtro por categoria: Marketing, Vendas, Gestão e Logística. Ao abrir um app, vê capturas de tela, descrição completa, nota média e avaliações de outros restaurantes.

O que significa "instalar" um aplicativo?

Instalar é autorizar que o aplicativo acesse os dados do estabelecimento pela API da CW. Essa autorização é concedida por estabelecimento: se o cliente tem mais de uma loja e quer o mesmo app em todas, precisa instalar em cada uma. Sem essa etapa, o app não consegue consultar nem operar sobre os dados da loja. Apps instalados ficam acessíveis por um atalho no canto superior direito, com os botões Acessar e Desinstalar.

Como funciona a segurança e a autorização dos apps?

Pelo novo modelo OAuth 2.0 com PKCE: cada aplicativo pede autorização diretamente ao estabelecimento, com permissões específicas (catálogo, pedidos, loja, cupons, avaliações, clientes). O acesso pode ser revisado, bloqueado ou revogado individualmente por app, sem afetar as outras integrações. É bem mais seguro e transparente que o modelo antigo, em que um único token do estabelecimento dava acesso total.

A autenticação antiga por token deixa de funcionar?

Não. As integrações que usam token continuam operando normalmente, mas esse modelo está sendo desencorajado (pode ser descontinuado no futuro) e não aparece no marketplace. Novas integrações devem usar o novo modelo de autenticação da API aberta para poderem fazer parte da CW App Store.

O cliente pode avaliar os aplicativos?

Sim. Com o app instalado, o lojista pode avaliar diretamente pela página do aplicativo: nota de 1 a 5 estrelas e um comentário de até 300 caracteres. A nota média e as avaliações ficam visíveis na página do app, ajudando outros restaurantes a decidir.`,
  },
];

/* ───────────────────────────────── ONBOARDING ──────────────────────────── */

export const REPS_ONBOARDING = [
  { fase: 'DIA 1', itens: [
    'Assista ao vídeo de boas-vindas no Comece Aqui',
    'Apresente-se na Comunidade com uma mensagem',
    'Conheça o time: Glauton, Rafael, Hyorranes e Gabi',
  ] },
  { fase: 'DIA 2 – 3', itens: [
    'Leia os 4 artigos do Playbook de representantes',
    'Configure seu acesso ao Pipedrive e explore o Pipeline',
    'Entenda como funciona a Meta do Mês',
  ] },
  { fase: 'SEMANA 1', itens: [
    'Registre sua primeira oportunidade no Pipeline',
    'Tire dúvidas com seu líder na Comunidade',
  ] },
];
