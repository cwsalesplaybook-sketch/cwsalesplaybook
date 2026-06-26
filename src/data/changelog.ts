export type ChangelogType = 'feature' | 'fix' | 'update' | 'breaking';

export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  postedBy: string;
  type: ChangelogType;
}

export const CHANGELOG_PADRAO: ChangelogEntry[] = [
  // ── 24/06/2026 ──────────────────────────────────────────────────────────────
  {
    id: 'cw-240626-a',
    version: '—',
    date: '24/06/2026',
    title: 'CW App Store — marketplace de aplicativos',
    description: `Novo marketplace de integrações dentro do portal: a tela "CW Apps" (no menu lateral) reúne, em um catálogo único, aplicativos da própria Cardápio Web e de parceiros — gestão, marketing, delivery, chatbot e mais.

O lojista vê primeiro os apps já instalados, depois os recomendados e a lista completa, com filtro por categoria: Marketing, Vendas, Gestão e Logística. Na página de cada app há capturas de tela, descrição, nota média e avaliações de outros restaurantes.

Instalar = autorizar o app a acessar os dados do estabelecimento pela API da CW. A autorização é por estabelecimento (cliente com várias lojas instala em cada uma) e usa o novo modelo OAuth 2.0 com PKCE: cada app pede permissões específicas (catálogo, pedidos, loja, cupons, avaliações, clientes) e o acesso pode ser revisado ou revogado individualmente, sem desconectar as outras integrações.

Apps instalados ganham um atalho no canto superior direito (botões Acessar e Desinstalar). Com o app instalado, o lojista pode avaliar: nota de 1 a 5 estrelas + comentário de até 300 caracteres.

A autenticação antiga por token continua funcionando, mas está sendo desencorajada (pode ser descontinuada) e não aparece no marketplace — novas integrações devem usar o novo modelo.`,
    postedBy: 'Cardápio Web',
    type: 'feature',
  },
  // ── 19/06/2026 ──────────────────────────────────────────────────────────────
  {
    id: 'cw-190626-a',
    version: '—',
    date: '19/06/2026',
    title: 'Integração Oficial com a Meta (WhatsApp)',
    description: `O ChatBot e as notificações de pedido do WhatsApp passam a funcionar pela API oficial da Meta. Acaba a dependência da extensão: as mensagens saem pela infraestrutura da Meta, sem precisar de um computador ligado com o navegador aberto — mais estabilidade e independência.

Nova área "Gerenciar WhatsApp" centraliza tudo: conectar e gerenciar números (WhatsApp Business via API oficial), modelos de mensagem, configuração das notificações de pedido e personalização do ChatBot. A conexão é feita direto pela Meta, no botão "Conectar via Meta".

Coexistência: o mesmo número continua sendo usado normalmente pelos atendentes no WhatsApp Business/Web ao mesmo tempo que roda as automações. Nesta 1ª versão, 1 número conectado por estabelecimento.

Janelas de conversa: dentro de 24h após o cliente escrever (janela aberta), o ChatBot responde livre, sem template. Fora das 24h (janela fechada), a Meta exige um modelo aprovado. Por isso cada notificação tem 2 mensagens — janela aberta (sem custo) e janela fechada (template aprovado, pode ter cobrança da Meta) — e o sistema escolhe automaticamente.

Os modelos de mensagem são criados no portal e aprovados pela própria Meta (não podem ser editados depois — para mudar, cria-se um novo). O envio de campanhas pela API oficial ainda não está disponível: é a próxima etapa.`,
    postedBy: 'Cardápio Web',
    type: 'feature',
  },
  // ── 22/05/2026 ──────────────────────────────────────────────────────────────
  {
    id: 'cw-220526-a',
    version: '—',
    date: '22/05/2026',
    title: 'Módulo Totem de Autoatendimento',
    description: `Novo módulo para cadastrar e gerenciar totens no estabelecimento. Cada totem tem configuração própria de dispositivo, terminal de pagamento (via Smart TEF) e formas de pagamento aceitas. Acesse em: Configurações › Dispositivos › Totens.

Dispositivos: o totem é um site web que funciona em qualquer touchscreen com navegador (Android, Windows, Linux). A CW não comercializa hardware. É possível fixar em modo kiosk para impedir que o cliente saia da tela.

Vínculo em 3 passos: (1) abra o link no dispositivo touch; (2) no portal, clique em "+ Adicionar totem" e gere o código de 6 dígitos; (3) insira o código no equipamento.

Mídias: configure "Chamariz" (imagens/vídeos verticais exibidos quando o totem está ocioso — até 5 arquivos, vídeos até 50 MB) e "Banners" (carrossel no cardápio do totem).

Pagamentos:
• Dinheiro — pedido lançado, pago no caixa com confirmação manual
• Pix automático — via Tuna, estorno automático no cancelamento
• Cartão via Smart TEF — estorno manual obrigatório na maquininha

Custo: R$ 99,99 por dispositivo/mês.`,
    postedBy: 'Cardápio Web',
    type: 'feature',
  },
  // ── 05/06/2026 ──────────────────────────────────────────────────────────────
  {
    id: 'cw-050626-a',
    version: '—',
    date: '05/06/2026',
    title: 'Integração com Balança Toledo Prix 3 Fit',
    description: `Integração com balança para pesagem automática de produtos vendidos por kg/litro. Requer cabo USB compatível com conversor serial integrado (chipset PL2303, FTDI ou CH340) e navegador Google Chrome ou Microsoft Edge.

Configuração da balança Toledo Prix 3 Fit (antes de conectar):
Acesse: tecla Modo → senha 2011 → tecla Modo novamente.
• C13 = SERIAL (interface)
• C14 = PRT1 (protocolo — único homologado)
• C15 = 2400 (baud rate recomendado pela CW)
• C16 = d (modo de transmissão sob demanda)

Configuração no sistema: Configurações › Integrações › Balança. Ative e informe o Baud Rate (recomendado: 2400 para maior estabilidade).

Conexão: ao clicar em "Conectar balança", o navegador solicita a porta serial. Selecione a porta identificada como "USB", "PL2303", "CH340" ou "COM3/COM4". A permissão é salva para as próximas sessões.

Pesagem: produtos do tipo quilograma exibem o peso em tempo real. É possível pausar e digitar o peso manualmente quando necessário.

Importante: cabos RJ45 de rede comum NÃO funcionam — use somente cabos homologados para Toledo Prix 3 Fit com conversor serial integrado.`,
    postedBy: 'Cardápio Web',
    type: 'feature',
  },
];
