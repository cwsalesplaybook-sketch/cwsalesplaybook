/** Conteúdo da Central de Ajuda da Cardápio Web, organizado por categoria.
 *  Fonte: "Central de Ajuda CardapioWeb PSM" (documento de referência, julho/2026). */

export interface AjudaSubsecao {
  titulo: string;
  itens: string[];
}

export interface AjudaTopico {
  titulo: string;
  resumo?: string;
  subsecoes?: AjudaSubsecao[];
}

export const PRIMEIROS_PASSOS: AjudaTopico[] = [
  {
    titulo: 'Boas-vindas',
    resumo: 'A Central de Ajuda da Cardápio Web é o espaço ideal para esclarecer dúvidas de forma rápida, prática e eficiente. Contém guias, tutoriais e respostas às perguntas mais frequentes.',
    subsecoes: [
      {
        titulo: 'Categorias disponíveis',
        itens: [
          'Gestão → pedidos, mesas, comandas, caixa e relatórios.',
          'Automação → disparo via WhatsApp, chatbot, integrações.',
          'Aumento de Vendas → cupons, descontos e fidelidade.',
          'Módulos do Sistema → estoque avançado, financeiro, fiscal e mais.',
          'Suporte → aulas, perguntas frequentes e contatos.',
        ],
      },
    ],
  },
  {
    titulo: 'Planos, Funcionalidades e Módulos Adicionais',
    resumo: 'A Cardápio Web oferece três planos principais que se adaptam ao modelo de operação do negócio.',
    subsecoes: [
      { titulo: 'Plano Mesas', itens: ['Módulo de mesas, módulo de balcão, módulo de caixa, impressão automática, gestão de usuários, gestão de clientes, estoque simples, fiado.'] },
      { titulo: 'Plano Delivery', itens: ['Módulo de delivery, módulo de balcão, módulo de caixa, módulo de entregadores, campos personalizados, impressão automática, gestão de usuários, gestão de clientes, estoque simples, fidelidade, fiado, pagamento online, extensão do WhatsApp.'] },
      { titulo: 'Plano Premium', itens: ['Inclui todos os recursos dos planos anteriores (mesas + delivery).', 'Automação do chatbot disponível exclusivamente nos planos Delivery e Premium.'] },
      {
        titulo: 'Valores por plano',
        itens: [
          'Mesas: mensal R$169,99 | trimestral R$479,97 | semestral R$899,94 | anual R$1.679,88',
          'Delivery: mensal R$209,99 | trimestral R$599,97 | semestral R$1.139,94 | anual R$2.159,88',
          'Premium: mensal R$269,99 | trimestral R$799,97 | semestral R$1.499,94 | anual R$2.879,88',
        ],
      },
      {
        titulo: 'Módulos adicionais',
        itens: [
          'Gestão Financeira – R$69,99/mês: controle financeiro com entrada, saída, categorias e relatórios.',
          'Fiscal – R$69,99/mês: emissão de notas fiscais, XML, status de notas e integração com a Receita.',
          'Gestão de Entregas – R$54,99/mês: organização e acompanhamento de entregadores.',
          'Estoque Avançado – R$29,99/mês: gestão detalhada de insumos, perdas, movimentações e alertas.',
          'Integração com Marketplaces – R$29,99/mês: centraliza pedidos conectando marketplaces ao sistema.',
          'A cobrança dos módulos segue a mesma recorrência do plano principal (mensal, trimestral, semestral ou anual).',
        ],
      },
      {
        titulo: 'FAQ — Planos',
        itens: [
          'Posso trocar de plano depois da contratação? Sim.',
          'Posso contratar um módulo extra com o plano mais básico? Sim, qualquer módulo pode ser contratado com qualquer plano.',
          'Posso contratar um módulo com recorrência diferente do plano? Não — a cobrança do módulo segue a mesma recorrência do plano principal.',
        ],
      },
    ],
  },
  {
    titulo: 'Acessando o Sistema pela Primeira Vez',
    subsecoes: [
      {
        titulo: 'Primeiro acesso ao portal',
        itens: [
          'Acesse portal.cardapioweb.com/login.',
          'Clique em "Esqueci minha senha".',
          'Insira o e-mail cadastrado e clique em "Enviar".',
          'Acesse o e-mail recebido e clique no botão "Criar nova senha".',
          'Digite a nova senha nos campos indicados e clique em "Confirmar".',
        ],
      },
      {
        titulo: 'Recomendações de segurança para a senha',
        itens: [
          'Escolha uma senha fácil de lembrar, mas difícil de ser adivinhada.',
          'Use letras maiúsculas/minúsculas, números e símbolos especiais (@, #, !).',
          'Evite informações pessoais como datas de nascimento ou nomes.',
          'Crie senhas com pelo menos 12 caracteres.',
          'Não reutilize senhas antigas.',
        ],
      },
      {
        titulo: 'Como acessar o portal após criar a senha',
        itens: [
          'Acesse portal.cardapioweb.com, informe e-mail e senha.',
          'Você recebe um código de autenticação por e-mail.',
          'Insira o código no campo indicado para concluir o acesso.',
        ],
      },
    ],
  },
  {
    titulo: 'Cardápios Demonstrativos',
    resumo: 'A plataforma oferece exemplos reais de cardápios digitais, mostrando como é simples, prático e moderno criar um cardápio digital profissional.',
    subsecoes: [
      { titulo: 'Tipos disponíveis', itens: ['Pizzaria, Sushi, Hamburgueria, Confeitaria, Hortifruti, Gelateria, Padaria, Massas, Fit, Restaurante, Adega, Vegana, Açaiteria.'] },
    ],
  },
];

export const AJUDA_GESTAO: AjudaTopico[] = [
  {
    titulo: 'Gestão de Pedidos',
    resumo: 'Espaço onde você tem controle total sobre o fluxo de pedidos da loja — seja para delivery, retirada ou consumo no local.',
    subsecoes: [
      {
        titulo: 'Recursos disponíveis',
        itens: [
          'Lançamento manual de pedidos: crie pedidos diretamente no sistema para qualquer tipo de atendimento.',
          'Edição de pedidos lançados: edite dados do cliente, endereço, tipo de pedido e formas de pagamento — inclusive múltiplas formas de pagamento no mesmo pedido.',
          'Personalização do layout: defina a posição de cada status de pedido na tela.',
          'Ajuste rápido de tempos: use atalhos para aumentar ou reduzir o tempo de preparo ou entrega.',
          'Pesquisa por nome ou número do cliente nos status: Em produção, Saiu para entrega, Aguardando retirada ou Cancelado.',
        ],
      },
    ],
  },
  {
    titulo: 'Mesas e Comandas',
    resumo: 'Onde você realiza todo o atendimento presencial, controlando pedidos e movimentações em mesas físicas ou comandas.',
    subsecoes: [
      { titulo: 'Ações disponíveis', itens: ['Abrir mesas ou comandas', 'Lançar pedidos', 'Cancelar itens', 'Transferir itens entre mesas ou comandas', 'Fechar contas'] },
      { titulo: 'Status das mesas por cor', itens: ['Verde: mesa aberta', 'Roxa: em processo de fechamento', 'Laranja: cliente solicitou o fechamento', 'Cinza: mesa fechada e disponível para abrir'] },
      { titulo: 'Como abrir uma mesa', itens: ['No menu lateral, clique em Mesas/Comandas.', 'Clique sobre uma mesa cinza.', 'Preencha o formulário: quantidade de pessoas (opcional), atendente responsável, identificação (opcional).', 'Clique em Salvar.'] },
      { titulo: 'Como fechar uma mesa', itens: ['Selecione uma mesa verde (aberta) e clique em "Fechar conta".', 'Clique em "Pagamento".', 'Dividir conta: atribua cada produto ao cliente correspondente, selecione a forma de pagamento e confirme.', 'Pagamento total: clique em Pagar, selecione a forma de pagamento e confirme.'] },
      { titulo: 'Como cancelar itens', itens: ['Clique em "Mais ações" e selecione "Cancelar itens".', 'Marque os itens, clique em "Cancelar selecionados", informe o motivo e confirme.'] },
      { titulo: 'Como transferir itens entre mesas', itens: ['Clique em "Mais ações" e selecione "Transferir itens".', 'Marque os itens, clique em "Transferir selecionados", escolha a mesa/comanda de destino e salve.'] },
      { titulo: 'Como editar formas de pagamento em Mesas/Comandas', itens: ['Pelo Histórico de Pedidos: busque o pedido e clique em "Reabrir pedido".', 'Pelo Caixa do Dia: localize o pedido pelo número, clique nos detalhes e em "Reabrir pedido".', 'Após reabrir, exclua a forma de pagamento incorreta e registre a nova.'] },
    ],
  },
  {
    titulo: 'KDS — Kitchen Display System',
    resumo: 'Visualizador digital de pedidos que substitui comandas impressas ou escritas em papel. Exibe os pedidos em tempo real na cozinha, organizando o fluxo de preparo.',
    subsecoes: [
      { titulo: 'Modos de operação', itens: ['Modo Preparo: recomendado para a equipe da cozinha. Exibe pedidos pendentes de produção.', 'Modo Despacho: recomendado para o setor responsável pela entrega dos pedidos prontos.'] },
      { titulo: 'Configurações do KDS', itens: ['Layout: Compacto (mais pedidos na tela) ou Alinhado (pedidos lado a lado, mesmo tamanho).', 'Tipos de pedido: Delivery, Retirada, Consumo no local, Mesas, Comandas.', 'Áreas de produção: escolha quais áreas visualizar.'] },
      { titulo: 'Cores de status no Modo Preparo', itens: ['Azul: produto em preparação.', 'Cinza claro: produto finalizado e pronto.'] },
      { titulo: 'Resumo da Produção', itens: ['Disponível no Modo Preparo: exibe a quantidade total de cada produto a ser produzido e a qual pedido está vinculado. Clique em um item para marcar "em produção" (azul); clique novamente para marcar como pronto.'] },
      { titulo: 'Modo Despacho', itens: ['Exibe pedidos finalizados no preparo, prontos para entrega.', 'Ações: marcar como disponível para retirada, saiu para entrega ou entregue ao cliente.', 'É possível retornar pedidos para a cozinha clicando no ícone de seta.'] },
    ],
  },
  {
    titulo: 'Caixa',
    subsecoes: [
      { titulo: 'Informações gerais', itens: ['Um pedido só é lançado no caixa quando é concluído.', 'Caso o caixa esteja fechado, ele é aberto automaticamente ao concluir um pedido.', 'É importante fechar o caixa ao final do expediente.', 'Caixas abertos há mais de 24h sem movimentações nas últimas 2h são fechados automaticamente pelo sistema.'] },
      { titulo: 'Como abrir o caixa', itens: ['No menu lateral, clique em "Caixa".', 'Clique em "Abrir Caixa" (botão roxo).', 'Informe o valor atual em dinheiro disponível no caixa.', 'Clique em Confirmar.'] },
      { titulo: 'Informações após abertura', itens: ['Histórico de Movimentações: data/hora, descrição, valor, forma de pagamento, tipo e usuário responsável.', 'Resumo do Caixa: número do caixa, data/hora de abertura, valores em dinheiro (saldo inicial, suprimentos, sangrias, vendas), resumo por forma de pagamento e por tipo de pedido.'] },
      { titulo: 'Operações no caixa', itens: ['Suprimento: clique em "Suprimento", preencha descrição e valor, clique em "Salvar".', 'Sangria: clique em "Sangria", informe descrição e valor, clique em "Salvar".', 'Fechar caixa: clique em "Fechar Caixa", confira os valores, informe o valor real encontrado e finalize.', 'Reabrir caixa: acesse "Caixas Anteriores", selecione o caixa, clique em "Reabrir Caixa" e confirme.'] },
    ],
  },
  {
    titulo: 'Desempenho',
    resumo: 'Ponto central para monitorar e analisar os principais indicadores do estabelecimento, auxiliando na tomada de decisões estratégicas.',
    subsecoes: [
      { titulo: 'Informações disponíveis', itens: ['Quantidade de pedidos em um período específico', 'Faturamento total no período', 'Acessos ao cardápio e número de visitantes', 'Ticket médio dos pedidos', 'Taxas de entrega e de serviço (mesas e comandas)', 'Taxas da maquineta', 'Percentuais por método de pagamento', 'Descontos'] },
      { titulo: 'Tópicos de análise', itens: ['Vendas: volume, produtos mais vendidos e ticket médio.', 'Clientes: comportamento e padrões de consumo.', 'Base de Clientes (RFV): análise por Recência, Frequência e Valor monetário.', 'Catálogo: desempenho dos produtos do cardápio.', 'Produtos: detalhamento por item.', 'Entregas: status e eficiência.', 'Descontos: impacto nas vendas.', 'Cancelamentos: motivos e frequência.', 'Visão Geral do Estabelecimento: panorama completo do desempenho.'] },
    ],
  },
  {
    titulo: 'Histórico de Pedidos',
    resumo: 'Permite acompanhar todos os pedidos já realizados, independentemente do status.',
    subsecoes: [
      { titulo: 'Colunas disponíveis', itens: ['Número do Pedido', 'Nome do Cliente', 'Data e Hora de Criação', 'Data de Agendamento', 'Valor Total', 'Forma de Pagamento', 'Tipo de Pedido (retirada, delivery, consumo no local, mesa/comanda)', 'Canal de Venda (Portal, Extensão, Site, Site Balcão, iFood)', 'Status do Pedido'] },
      { titulo: 'Filtros avançados', itens: ['Tipo de Pedido, Tipo de Entrega (agendado ou imediato)', 'Canais de Venda (Site, Portal, Extensão, iFood)', 'Status do Pedido (Pendente, Em preparação, Pronto, Saiu para entrega, Concluído, Cancelado, entre outros)', 'Forma de Pagamento (Pix, crédito, débito, dinheiro etc.)', 'Entregador Vinculado', 'Data de Criação e Data de Agendamento'] },
      { titulo: 'Exportação', itens: ['Clique no botão "Exportar" para gerar um arquivo com todos os pedidos exibidos, de acordo com os filtros aplicados.'] },
    ],
  },
  {
    titulo: 'Minha Empresa',
    resumo: 'Permite configurar as informações essenciais do estabelecimento.',
    subsecoes: [
      { titulo: 'O que pode ser configurado', itens: ['Nome, logo (500x500px) e banner (1270x460px) da empresa.', 'Endereço do estabelecimento.', 'Valor de pedido mínimo para delivery.', 'Horários de funcionamento.', 'Formas de pagamento (online e offline).', 'Avisos no cardápio.', 'Campos personalizados na tela de finalização de pedido (checkout).'] },
      { titulo: 'Abas disponíveis', itens: ['Perfil, Horários, Formas de pagamento, Avisos, Campos personalizados.'] },
    ],
  },
  {
    titulo: 'Catálogo',
    resumo: 'Onde você cria e gerencia produtos, complementos e opções.',
    subsecoes: [
      { titulo: 'Funcionalidades', itens: ['Alterar preços dos produtos', 'Colocar produtos como em falta ou ocultos', 'Configurar disponibilidade por canal', 'Ativar preço promocional', 'Realizar edições em massa'] },
      { titulo: 'Seções do catálogo', itens: ['Produtos: criar categorias e produtos, cadastrar complementos e opções, ativar preço promocional, marcar indisponíveis ou ocultos.', 'Complementos: visualizar, criar e gerenciar complementos vinculados a vários produtos.', 'Opções: criar e editar opções dentro dos complementos, com imagens e descrições.', 'Filtros Avançados: selecionar vários produtos para edição em massa.'] },
      { titulo: 'Como exportar o catálogo para planilha', itens: ['No Catálogo > Produtos, clique em "Ações" > "Exportar".', 'O sistema gera a planilha; clique no ícone de notificação (sino) para baixar.'] },
      { titulo: 'Peça Também', itens: ['Ferramenta que aparece no carrinho para sugerir produtos adicionais.', 'Ativa pelo Catálogo > Produtos > Ações > Configurar "Peça Também".', 'Pode ser automática (o sistema sugere) ou personalizada (você escolhe os produtos).'] },
    ],
  },
  {
    titulo: 'Delivery',
    resumo: 'Composto por duas seções: Área de Entrega e Entregadores.',
    subsecoes: [
      { titulo: 'Tipos de configuração de entrega', itens: ['Por Região: desenho no mapa (círculo ou polígono).', 'Por Bairros: lista de bairros atendidos.'] },
      { titulo: 'Como criar área de entrega por círculo (raio)', itens: ['Menu lateral > Delivery > Área de Entrega.', 'Clique na aba Regiões > "Nova Região" > selecione "Círculo".', 'Localize a loja no mapa, pressione o botão esquerdo do mouse e arraste para definir o raio.', 'Preencha nome, taxa de entrega e configurações, clique em Salvar.'] },
      { titulo: 'Como criar área de entrega por polígono', itens: ['Menu lateral > Delivery > Área de Entrega.', 'Clique em Regiões > "Nova Região" > selecione "Polígono".', 'Clique no mapa para adicionar pontos de ancoragem; para finalizar, clique no ponto inicial.', 'Preencha as informações e clique em Salvar.'] },
      { titulo: 'Como criar área de entrega por bairro', itens: ['Menu lateral > Delivery > Área de Entrega.', 'Selecione a aba Bairros > "Gerenciar Bairros".', 'Adicione as cidades de atuação.', 'Clique em "Novo Bairro", preencha nome, cidade, taxa e tempo de entrega, clique em Salvar.'] },
      { titulo: 'Como cadastrar entregadores', itens: ['Menu lateral > Delivery > Entregadores.', 'Clique em "Novo Entregador", informe nome e telefone, clique em Salvar.'] },
    ],
  },
  {
    titulo: 'Clientes',
    resumo: 'Permite visualizar, filtrar e cadastrar clientes, além de analisar dados como total de pedidos, ticket médio e classificação RFV.',
    subsecoes: [
      { titulo: 'Informações disponíveis por cliente', itens: ['Nome, total de pedidos, ticket médio, data do último pedido, cliente desde, classificação RFV, total de pontos, gênero, data de nascimento.'] },
      { titulo: 'Como cadastrar um novo cliente', itens: ['Clique em "+ Novo cliente".', 'Preencha nome, telefone e anotações.', 'Para cadastro completo, clique em "Cadastro Completo" e adicione e-mail, data de nascimento e gênero.'] },
      { titulo: 'Outras formas de cadastrar clientes', itens: ['Exportar contatos via Chatbot (Cardapinho): Cardapinho > 3 pontinhos > "Exportar Contatos".', 'Enviar planilha CSV/TSV com nome e telefone (endereço opcional).'] },
      { titulo: 'Metodologia RFV', itens: ['Avalia três critérios: Recência (tempo desde o último pedido), Frequência (quantidade de pedidos) e Valor Monetário (ticket médio). Cada parâmetro é classificado de 1 a 5, sendo 5 o melhor.'] },
      { titulo: 'Grupos de clientes RFV', itens: ['Campeões, Fiéis, Promissores, Novos clientes, Potenciais Fiéis, Precisam de atenção, Quase dormentes, Em risco, Hibernando, Perdidos, Não posso perder.'] },
    ],
  },
  {
    titulo: 'Avaliações',
    resumo: 'Acompanhe a satisfação dos clientes e gerencie o feedback dos pedidos.',
    subsecoes: [
      { titulo: 'Como conseguir o link de avaliação', itens: ['Clique em "Compartilhar pedido" > "Link de Avaliação".', 'O Cardapinho também envia o link automaticamente ao concluir o pedido.', 'É possível ativar impressão de QR Code de avaliação na via padrão (Configurações > Impressão).'] },
      { titulo: 'Como acompanhar as avaliações', itens: ['No menu lateral, acesse "Avaliações". É possível aplicar filtros e selecionar datas. A avaliação é referente ao pedido e somente o dono do estabelecimento tem acesso às informações.'] },
    ],
  },
  {
    titulo: 'Fiado',
    resumo: 'Ideal para estabelecimentos que oferecem pagamentos para consumo interno de funcionários. Permite registrar vendas sem pagamento imediato, controlando o saldo devedor.',
    subsecoes: [
      { titulo: 'Como ativar', itens: ['Vá em "Minha Empresa" > "Formas de Pagamento" e ative a opção "Fiado".', 'Importante: o Fiado é uma forma de pagamento interna, disponível apenas no sistema — clientes que usam links de pedidos não têm acesso a essa opção.'] },
      { titulo: 'Controle de dívidas', itens: ['Em "Fiado" > "Controle de Dívidas": administre clientes devedores, registre novos pagamentos e débitos manualmente, e veja o extrato de cada cliente.'] },
      { titulo: 'Visão geral das vendas no Fiado', itens: ['Em "Fiado" > "Visão Geral": visualize dívidas pendentes, total de débitos, quantidade de clientes com dívidas, gráfico de vendas e recebimentos (filtrável por data).'] },
    ],
  },
  {
    titulo: 'Administrativo',
    resumo: 'Composto por Usuários (criar logins para funcionários) e Assinaturas (visualizar lojas vinculadas e acompanhar faturas).',
    subsecoes: [
      { titulo: 'Como criar login para funcionários', itens: ['Menu lateral > Administrativo > Usuários.', 'Clique em "Adicionar Usuário".', 'Informe o e-mail do colaborador e clique em "Continuar".', 'Preencha nome, cargo e permissões de acesso.', 'Clique em "Convidar" — o colaborador recebe um e-mail para criar a própria senha.'] },
      { titulo: 'Como acessar faturas', itens: ['Menu lateral > Administrativo > Assinaturas.', 'Localize a fatura com status "A vencer" ou "Vencida".', 'Clique na fatura, escolha a forma de pagamento (Pix ou Cartão de Crédito) e pague.'] },
      { titulo: 'Link de Multilojas', itens: ['Disponível para clientes com duas ou mais lojas ativas.', 'Cria um link unificado para exibir todas as marcas/unidades.', 'Inclui: exibição de todas as lojas em uma página, personalização com logo, banner, domínio próprio, Pixel do Facebook, API de Conversão, Google Tag Manager e Google Analytics.'] },
      { titulo: 'Como ativar Multilojas', itens: ['Menu lateral > Administrativo > "Link multilojas".', 'Clique em "Habilitar Multi Lojas".', 'Preencha nome do grupo e identificador do link, clique em Salvar.'] },
    ],
  },
  {
    titulo: 'Configurações',
    resumo: 'Permite ajustar o funcionamento do sistema conforme as necessidades do negócio.',
    subsecoes: [
      { titulo: 'Abas disponíveis', itens: ['Configurações Gerais: tipos de pedidos, notificações e comportamentos automáticos.', 'Personalizar Site: controle sobre o que será exibido para os clientes.', 'Impressão: configurações de impressoras.', 'Agendamento: regras e horários para pedidos agendados.', 'Mesas/Comandas: criação e gerenciamento de mesas/comandas com QR Codes e taxa de serviço.', 'Integrações: acesso às integrações disponíveis.'] },
    ],
  },
  {
    titulo: 'Impressora',
    resumo: 'Essencial nas operações de delivery. Configure as impressões pelo menu: Configurações > Impressão.',
    subsecoes: [
      { titulo: 'O que é possível fazer', itens: ['Vincular a impressora ao sistema.', 'Criar setores de impressão (para estabelecimentos com mais de um setor, como cozinha e bar).', 'Definir quantidade de vias para cada tipo de pedido.', 'Adicionar mensagens personalizadas ao final da via padrão.'] },
    ],
  },
  {
    titulo: 'Ver Meus Links',
    resumo: 'Existem vários links para receber pedidos. Acesse pelo menu lateral em "Ver Meus Links".',
    subsecoes: [
      { titulo: 'Links disponíveis', itens: ['Catálogo Web: para delivery, onde o cliente faz pedidos para entrega ou retirada.', 'Catálogo de Visualização: exibido no estabelecimento para visualização do cardápio sem realizar pedidos (bom para QR Codes nas mesas).', 'Link para Pedidos Balcão: específico para pedidos feitos no balcão.', 'Link para Pedidos de Mesa e Comanda: cada mesa tem um link único para QR Code.', 'Link de Múltiplos Estabelecimentos: para contas com mais de uma loja.', 'Gerador de QR Codes: permite personalizar QR Codes com textos e cores.'] },
      { titulo: 'Ícones de ação', itens: ['Olho = Abrir link', 'Dois papéis = Copiar link', 'Logo do WhatsApp = Enviar pelo WhatsApp', 'QR Code = Abrir QR Code'] },
    ],
  },
];

export const AJUDA_AUTOMACAO: AjudaTopico[] = [
  {
    titulo: 'Food Marketing / Campanhas via WhatsApp',
    resumo: 'Ferramenta para envio de mensagens em massa de forma prática e eficiente, permitindo alcançar mais clientes e impulsionar vendas.',
    subsecoes: [
      { titulo: 'Como acessar', itens: ['Menu lateral > "Food Marketing".', 'Campanhas WhatsApp: onde você realiza disparos e campanhas.', 'Segmentação de clientes: onde você cria filtros personalizados para os disparos.'] },
      {
        titulo: 'Como criar uma campanha',
        itens: [
          'Conecte o número do WhatsApp escaneando o QR Code.',
          'Clique em "Disparar mensagens".',
          'Preencha o Título (visível só para o estabelecimento) e a Mensagem (texto e/ou imagem).',
          'Use variáveis: Nome do cliente e Descadastrar.',
          'Adicione até 3 variações de mensagens para maior segurança contra bloqueio.',
          'Defina a data de envio: Agora, em data específica ou recorrente (diária, semanal ou mensal).',
          'Selecione os destinatários com filtros: ticket médio, quantidade de pedidos, tempo desde a última compra, aniversariantes, etc.',
          'Clique em "Enviar mensagem".',
        ],
      },
    ],
  },
  {
    titulo: 'Chatbot — Cardapinho',
    resumo: 'Extensão para navegador que facilita o atendimento automático aos clientes pelo WhatsApp Web, oferecendo atendimento mais rápido, eficiente e profissional.',
    subsecoes: [
      { titulo: 'Requisitos', itens: ['WhatsApp Web aberto e conectado enquanto o chatbot estiver ativo.', 'Computador ligado e com acesso à internet durante o atendimento.'] },
      { titulo: 'Como instalar a extensão', itens: ['Menu lateral > Configurações > Integrações > Cardapinho.', 'Clique em "Instalar Extensão" e adicione no Chrome.', 'Acesse o WhatsApp Web, atualize a página e faça login na extensão.'] },
      { titulo: 'Indicadores de status das conversas', itens: ['Verde: conversas ativas — o Cardapinho está respondendo automaticamente.', 'Laranja: conversas aguardando atendimento humano.', 'Azul: conversas pausadas — bot desativado manualmente.'] },
      { titulo: 'Funcionalidades', itens: ['Atender clientes automaticamente com respostas prontas.', 'Personalizar mensagens de atendimento.', 'Ser notificado quando intervenção humana é necessária.', 'Criar pedidos diretamente pelo WhatsApp (PDV).', 'Controlar atendimentos com indicadores de status.', 'Receber notificações sobre o andamento de pedidos.'] },
      { titulo: 'Criar pedidos pelo WhatsApp (PDV)', itens: ['No Cardapinho > Atendimento, clique na conversa do cliente > "+ Novo Pedido".', 'Escolha o tipo: Delivery, Retirada ou Consumo no Local.', 'Adicione produtos, veja o carrinho, selecione a forma de pagamento e finalize.', 'O cliente recebe automaticamente o resumo do pedido no WhatsApp.'] },
    ],
  },
  {
    titulo: 'Integrações',
    subsecoes: [
      { titulo: 'Marketing e Vendas', itens: ['Domínio Próprio, Facebook Pixel e Token da API, Catálogo do Facebook, Google Analytics, Google Tag Manager, Cardapinho (Chatbot), Repediu, Retorne.app.'] },
      { titulo: 'Marketplaces', itens: ['iFood, 99Food, Keeta, Aiqfome.'] },
      { titulo: 'Pagamentos Online', itens: ['Cielo, Mercado Pago.'] },
      { titulo: 'Logística', itens: ['iFood sob demanda, Foody Delivery, Pick n Go!, Bee Delivery, MOTTU, Let’s Express, Husky, Machine, JAXBus, Entregas Expressas, Moovery, Agilizone.'] },
      { titulo: 'Sistemas de Gestão', itens: ['Saipos, Eclética, Sischef, F360 Finanças, Glow, IzzyWay.'] },
      { titulo: 'APIs para Integrações', itens: ['API Aberta, Open Delivery.'] },
    ],
  },
];

export const AJUDA_VENDAS: AjudaTopico[] = [
  {
    titulo: 'Cupons e Descontos',
    resumo: 'Ajudam a incentivar vendas e atrair novos clientes. Acesse pelo menu lateral em "Cupons de Desconto".',
    subsecoes: [
      { titulo: 'Informações exibidas na tela de cupons', itens: ['Situação: disponível, expirado ou inativo.', 'Nome e código do cupom.', 'Desconto: valor fixo ou percentual.', 'Data de expiração, quantidade disponível, usos e status ativo/inativo.'] },
      { titulo: 'Como criar um cupom', itens: ['Clique em "+ Novo cupom".', 'Nome do Cupom: destaque a característica principal da oferta.', 'Código: funciona como senha para o cliente obter o desconto — deixe em branco para aplicação automática.', 'Tipo de Desconto: valor fixo (R$), percentual (%) ou entrega grátis.'] },
      { titulo: 'Limitações configuráveis', itens: ['Data inicial e final de validade', 'Horário específico de disponibilidade', 'Disponibilidade por dia da semana', 'Disponibilidade por tipo de pedido (delivery, retirada, consumo no local)', 'Quantidade máxima de usos', 'Valor mínimo de compra', 'Apenas para novos clientes', 'Permitir múltiplos usos pelo mesmo cliente'] },
      { titulo: 'Configurações avançadas', itens: ['Associar desconto a itens específicos do cardápio e configurar restrições de formas de pagamento.'] },
    ],
  },
  {
    titulo: 'Fidelidade e Cashback',
    resumo: 'Permite oferecer um programa de pontos para os clientes acumularem e trocarem por produtos ou descontos.',
    subsecoes: [
      { titulo: 'Regra de pontuação', itens: ['Para cada R$1,00 em compras (valor dos produtos após descontos, sem incluir taxa de entrega), o cliente ganha 1 ponto.'] },
      { titulo: 'Como ativar', itens: ['Menu lateral > Fidelidade > Recompensas.', 'Ative o programa de fidelidade clicando no ícone.'] },
      { titulo: 'Brinde para novos clientes', itens: ['É possível conceder pontos extras ao fazer o primeiro pedido. Ative "Brinde para Novos Clientes" e defina a quantidade de pontos.'] },
      { titulo: 'Tipos de recompensas', itens: ['Entrega grátis: defina quantos pontos o cliente gasta para cada R$1 de taxa de entrega.', 'Resgate de descontos fixos (R$10, R$5, etc.): cliente troca pontos por desconto — ex.: 100 pontos = R$10 de desconto (proporção de 10%).', 'Resgate de produtos do catálogo: cliente usa pontos para resgatar produtos, definindo quantos pontos por R$1 do produto.', 'Proporção recomendada pelo mercado: 5% a 10%.'] },
      { titulo: 'Adicionar ou remover pontos manualmente', itens: ['Menu lateral > Fidelidade > Atividades > Pontuador.', 'Escolha Adicionar ou Remover pontos, informe o cliente e a quantidade.'] },
    ],
  },
];

export const AJUDA_MODULOS: AjudaTopico[] = [
  {
    titulo: 'Estoque Avançado',
    resumo: 'Módulo (R$29,99/mês) que permite controlar o estoque por produtos e opções, gerenciar insumos e criar fichas técnicas.',
    subsecoes: [
      { titulo: 'Funcionalidades', itens: ['Controle preciso dos ingredientes utilizados em cada item do cardápio.', 'Baixa automática dos insumos a cada venda.', 'Quando um insumo acaba, produtos podem ser automaticamente marcados como indisponíveis.', 'Opção de estoque negativo (produtos continuam disponíveis mesmo com insumo zerado).'] },
      { titulo: 'Como criar um insumo', itens: ['Menu lateral > Estoque > Meu Estoque.', 'Clique em "Novo Insumo".', 'Preencha: nome, unidade de medida (gramas, litros, unidades) e categoria (opcional).', 'Clique em Salvar e informe a quantidade disponível.'] },
      { titulo: 'Como montar a ficha técnica', itens: ['Menu lateral > Estoque > Meu Estoque.', 'Clique em Produtos ou Opções.', 'Encontre o item e clique em "Ficha Técnica".', 'Clique em "Adicionar Insumo", selecione os ingredientes e informe a quantidade exata.'] },
    ],
  },
  {
    titulo: 'Módulo Financeiro',
    resumo: 'Módulo (R$69,99/mês) que oferece controle total das finanças: contas a pagar e receber, fluxo de caixa e relatórios completos.',
    subsecoes: [
      { titulo: 'Funcionalidades', itens: ['Lançamentos: receitas, despesas e transferências entre contas.', 'Fluxo de caixa: análise em Tabela, Gráfico ou Calendário.', 'Configurações: contas bancárias, categorias financeiras, centros de custos, fornecedores, funcionários e formas de pagamento.'] },
      { titulo: 'Como fazer lançamentos', itens: ['Menu lateral > Financeiro > Lançamentos > "Adicionar".', 'Selecione o tipo: Despesa, Receita ou Transferência.', 'Preencha data, valor, categoria, conta bancária, etc. e clique em Salvar.'] },
      { titulo: 'Como analisar o fluxo de caixa', itens: ['Menu lateral > Financeiro > Fluxo de Caixa.', 'Use filtros de data, conta bancária e categorias.', 'Escolha a visualização: Tabela, Gráfico ou Calendário.'] },
    ],
  },
  {
    titulo: 'Módulo de Gestão de Entregadores',
    resumo: 'Módulo (R$54,99/mês) que facilita o controle, organização e distribuição das entregas.',
    subsecoes: [
      { titulo: 'Inclusões no plano', itens: ['500 pedidos de delivery por mês (incluindo cancelados).', 'Pedidos adicionais até 1.500: R$0,08 por pedido.', 'Acima de 1.500 pedidos adicionais: R$0,06 por pedido.'] },
      { titulo: 'Funcionalidades', itens: ['Roteirização de pedidos pelo mapa interativo.', 'Visualização da última localização dos entregadores.', 'Criação de logins individuais para entregadores.', 'Desempenho: tempo médio de preparo, tempo médio de entrega, atrasos e tempo total.', 'Mapa de calor das regiões com mais pedidos.'] },
      { titulo: 'Formas de atribuir pedidos a entregadores', itens: ['Atribuição manual pelo mapa (roteirização manual).', 'Atribuição automática (roteirização automática — ideal para alto fluxo).', 'Atribuição pelo próprio entregador: escaneando o QR Code da via padrão ou digitando o número do pedido.'] },
      { titulo: 'Funcionalidades do login do entregador', itens: ['Notificação de novos pedidos.', 'Histórico de entregas e ganhos.', 'Acesso ao mapa com redirecionamento para Google Maps ou Waze.'] },
    ],
  },
  {
    titulo: 'Módulo de Integração com Marketplaces',
    resumo: 'Módulo (R$29,99/mês) que centraliza pedidos do iFood e outros marketplaces diretamente no sistema.',
    subsecoes: [
      { titulo: 'Como fazer a integração com iFood', itens: ['Menu lateral > Configurações > Integrações > iFood.', 'Clique em "Adicionar loja do iFood" > "Gerar código de autorização".', 'Clique em "Autorizar integração" e autorize no site do iFood.', 'Copie o código gerado, cole no sistema e clique em Confirmar.', 'Selecione a loja do iFood e confirme.', 'Importante: para aceitação e impressão automática funcionarem corretamente, desative essas funções no painel do iFood.'] },
      { titulo: 'Vincular produtos com o iFood (notas fiscais)', itens: ['Configurações > Integrações > iFood > "Ver códigos dos produtos".', 'Copie o código interno do produto e insira no campo "PDV do produto ou opção" no painel do iFood.'] },
      { titulo: 'Widget do iFood', itens: ['Pequeno aplicativo incorporado à tela de gestão de pedidos.', 'Funcionalidades: chat com clientes, acompanhamento de entregas, pausa programada da loja.', 'Ative em Configurações > Integrações > iFood > botão Widget.', 'Visível apenas na tela de Gestão de Pedidos, no canto inferior direito, em dispositivos com largura acima de 850 pixels.'] },
    ],
  },
  {
    titulo: 'Módulo Fiscal',
    resumo: 'Módulo (R$69,99/mês) que permite emitir notas fiscais de forma prática. Inclui até 2.500 notas por mês — notas excedentes: R$0,05 por nota.',
    subsecoes: [
      { titulo: 'Emissor fiscal utilizado', itens: ['Sistema: eNotas (CNPJ: 57.743.975/0001-27).', 'Razão Social: Enotas Desenvolvimento de Softwares LTDA.', 'Nome Comercial: eNotas Gateway.'] },
      { titulo: 'Etapas da configuração', itens: ['Dados da Empresa: CNPJ, Inscrição Estadual, Razão Social, Código do Regime Tributário.', 'Configurações Gerais: CSC, número e série da nota.', 'Certificado Digital: formato .PFX ou .P12 (modelo A1 apenas).', 'Ambiente de emissão: Homologação (testes) ou Produção (emissão oficial).', 'Importante: todas as configurações devem ser realizadas com o apoio do contador.'] },
      { titulo: 'Envio automático de XMLs para contabilidade', itens: ['Configure o e-mail do contador em Fiscal > Configurações > Dados da Empresa.', 'No dia 03 de cada mês, o sistema envia automaticamente resumo das notas e link para download dos XMLs.'] },
      { titulo: 'Autorização por estado', itens: ['Paraná: emitir Documento de Cadastro de Autorização de Uso na SEFAZ-PR com os dados do eNotas e enviar ao suporte.', 'Santa Catarina: contatar o suporte para solicitar autorização (prazo: até 2 dias úteis).'] },
    ],
  },
];

export const AJUDA_SUPORTE: AjudaTopico[] = [
  {
    titulo: 'Canais e Horários de Atendimento',
    subsecoes: [
      { titulo: 'Canais de atendimento', itens: ['Chat no sistema: clique em "Falar com o suporte".', 'WhatsApp do Suporte: disponível na Central de Ajuda.'] },
      { titulo: 'Horários', itens: ['Segunda a Sábado: 09:00 às 22:00', 'Domingo: 14:00 às 22:00', 'Feriado: 09:00 às 22:00'] },
    ],
  },
  {
    titulo: 'Perguntas Frequentes',
    subsecoes: [
      {
        titulo: 'Dúvidas comuns',
        itens: [
          'É possível imprimir pedidos apenas pelo celular?',
          'É possível instalar o QZTray no celular Android?',
          'Como criar atalho do sistema no computador ou celular?',
          'É possível configurar tablet por acesso remoto para impressão?',
          'Consigo usar o chatbot pelo celular Android ou iOS?',
          'É possível imprimir automaticamente usando apenas o celular?',
          'Consigo receber pedidos do iFood dentro do sistema?',
          'Onde baixar o aplicativo da Cardápio Web?',
          'Tem como receber minha fatura por e-mail?',
        ],
      },
    ],
  },
  {
    titulo: 'Acesso Remoto',
    subsecoes: [
      { titulo: 'Como funciona', itens: ['O suporte utiliza AnyDesk para acesso remoto seguro.', 'Baixe em anydesk.com, informe o ID ao técnico e clique em "Aceitar" para autorizar.', 'O acesso só é realizado com a autorização do lojista.'] },
      { titulo: 'Quando é necessário', itens: ['Falhas na impressão não resolvidas com instruções básicas.', 'Problemas técnicos complexos no sistema.', 'Auxílio com configurações avançadas (rede, drivers, impressoras).', 'Instalação de ferramentas essenciais.'] },
    ],
  },
];
