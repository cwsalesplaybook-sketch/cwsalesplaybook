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
