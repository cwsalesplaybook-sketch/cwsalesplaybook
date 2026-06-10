/** Aba Planos & Módulos — planos por período de contratação, com detalhes
 *  do que vem em cada plano e tabela de módulos extras. */
import { useState } from 'react';
import {
  Check, Copy, ChevronDown, Utensils, Bike, Crown,
  Package, FileText, Route, Wallet, Tablet, ShoppingBag, type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type PeriodoId = 'mensal' | 'trimestral' | 'semestral' | 'anual';

const PERIODOS: { id: PeriodoId; label: string; desc: number; parcelas: number; totalLabel: string }[] = [
  { id: 'mensal',     label: 'Mensal',     desc: 0,  parcelas: 1,  totalLabel: 'Total mensal' },
  { id: 'trimestral', label: 'Trimestral', desc: 5,  parcelas: 3,  totalLabel: 'Total trimestral' },
  { id: 'semestral',  label: 'Semestral',  desc: 10, parcelas: 6,  totalLabel: 'Total semestral' },
  { id: 'anual',      label: 'Anual',      desc: 15, parcelas: 12, totalLabel: 'Total anual' },
];

interface Categoria { titulo: string; itens: string[] }
interface Plano {
  id: string; nome: string; titulo: string; descricao: string; badge: string;
  icon: LucideIcon; destaque?: boolean;
  accent: { text: string; border: string; bg: string; chip: string; btn: string; check: string; dot: string };
  precos: Record<PeriodoId, { mes: string; total: string }>;
  resumo: string[];
  detalhes: Categoria[];
}

const PLANOS: Plano[] = [
  {
    id: 'mesas',
    nome: 'Mesas',
    titulo: 'Plano Mesas',
    descricao: 'Para restaurantes com atendimento físico em mesas e balcão.',
    badge: 'Ideal para restaurantes',
    icon: Utensils,
    accent: {
      text: 'text-cw-purple-light', border: 'border-cw-purple/40', bg: 'bg-cw-purple/8',
      chip: 'bg-cw-purple/15 text-cw-purple-light border-cw-purple/40',
      btn: 'gradient-primary text-white', check: 'text-cw-purple-light', dot: 'bg-cw-purple-light',
    },
    precos: {
      mensal:     { mes: '169,99', total: '169,99' },
      trimestral: { mes: '159,99', total: '479,97' },
      semestral:  { mes: '149,99', total: '899,94' },
      anual:      { mes: '139,99', total: '1.679,88' },
    },
    resumo: [
      'Pedidos na mesa via QR Code exclusivo',
      'Divisão de conta por itens ou valores iguais',
      'Controle de mesas (livre, ocupada, aguardando pagamento)',
      'Retirada no balcão organizada à parte',
      'Pagamentos em dinheiro, cartão ou Pix',
      'Cardápio digital com cores e logo da marca',
      'Impressão automática para cozinha ou bar',
      'Estoque básico com alertas',
      'Relatórios e análise de consumo por mesa',
    ],
    detalhes: [
      { titulo: 'Gestão de Pedidos para Mesas', itens: [
        'QR Code exclusivo por mesa direcionando ao cardápio digital',
        'Pedidos enviados automaticamente ao gestor e à cozinha',
        'Divisão da conta entre clientes, por itens ou valores iguais',
        'Status das mesas: livre, ocupada e aguardando pagamento',
        'Consumo de cada mesa visível em tempo real',
        'Transferência de pedidos entre mesas e adição de novos itens',
      ]},
      { titulo: 'Gestão de Retirada no Local (Balcão)', itens: [
        'Pedidos para retirada direto no estabelecimento',
        'Pedidos de retirada organizados separadamente dos das mesas',
      ]},
      { titulo: 'Gestão de Pagamentos', itens: [
        'Registro de pagamentos em dinheiro, cartão ou Pix no sistema',
        'Divisão do pagamento por itens ou valores iguais',
        'Pagamentos online não estão disponíveis no Plano Mesas',
      ]},
      { titulo: 'Configuração de Produtos e Cardápio', itens: [
        'Cadastro de produtos com fotos, descrições e preços',
        'Adicionais como borda recheada ou molhos extras',
        'Personalização do cardápio com cores e logo da marca',
        'Cadastro de produtos específicos para consumo no salão',
      ]},
      { titulo: 'Impressão Automática de Pedidos', itens: [
        'Impressão automática dos pedidos ao serem recebidos',
        'Envio direto para a cozinha ou o bar, conforme o item',
      ]},
      { titulo: 'Gestão de Estoque Básico', itens: [
        'Controle automático do estoque dos produtos vendidos',
        'Alertas configuráveis para estoque acabando',
      ]},
      { titulo: 'Relatórios e Análises', itens: [
        'Relatórios de faturamento, número de pedidos e ticket médio',
        'Análise de consumo por mesa para identificar padrões',
      ]},
      { titulo: 'Suporte e Atualizações', itens: [
        'Atendimento humanizado todos os dias da semana',
        'Atualizações constantes com novas funcionalidades',
      ]},
      { titulo: 'Flexibilidade de Planos', itens: [
        'Contratação mensal, trimestral, semestral ou anual',
        'Descontos progressivos para períodos mais longos',
      ]},
      { titulo: 'Limitações do Plano Mesas', itens: [
        'Não inclui delivery, gestão de entregadores ou áreas de entrega',
        'Sem automação de chatbot ou disparador de mensagens no WhatsApp',
        'Não permite pagamentos online ou integração com marketplaces',
      ]},
    ],
  },
  {
    id: 'delivery',
    nome: 'Delivery',
    titulo: 'Plano Delivery',
    descricao: 'Para operações focadas em delivery e estratégias de marketing.',
    badge: 'Melhor para delivery',
    icon: Bike,
    accent: {
      text: 'text-sky-300', border: 'border-sky-400/40', bg: 'bg-sky-400/8',
      chip: 'bg-sky-400/15 text-sky-300 border-sky-400/40',
      btn: 'bg-gradient-to-r from-sky-600 to-sky-500 text-white', check: 'text-sky-300', dot: 'bg-sky-300',
    },
    precos: {
      mensal:     { mes: '209,99', total: '209,99' },
      trimestral: { mes: '199,99', total: '599,97' },
      semestral:  { mes: '189,99', total: '1.139,94' },
      anual:      { mes: '179,99', total: '2.159,88' },
    },
    resumo: [
      'Gestão de pedidos de delivery em tempo real',
      'Áreas de entrega por raio, bairros ou desenho no mapa',
      'Taxas e tempo estimado por região',
      'Pagamento online (cartão e Pix)',
      'Chatbot no WhatsApp + status automático do pedido',
      'Gestão de entregadores com rotas e link exclusivo',
      'Disparo de mensagens em massa e cupons',
      'Programa de fidelidade',
      'Relatórios detalhados e mapa de calor',
    ],
    detalhes: [
      { titulo: 'Gestão de Pedidos de Delivery', itens: [
        'Recebimento e organização de pedidos em tempo real',
        'Status claros: pendente, em preparação, saiu para entrega, entregue',
        'Áreas de entrega por raio, bairros ou desenho no mapa',
        'Tempo estimado de entrega personalizado por região',
        'Taxas de entrega diferentes por distância ou localização',
      ]},
      { titulo: 'Gestão de Retirada no Local (Balcão)', itens: [
        'Pedidos para retirada direto no estabelecimento',
        'Pedidos de retirada separados dos pedidos de entrega',
      ]},
      { titulo: 'Gestão de Pagamentos', itens: [
        'Pagamentos online com cartão de crédito e Pix',
        'Registro de pagamentos em dinheiro ou maquininha na entrega',
        'Pagamentos online seguros e integrados ao sistema',
      ]},
      { titulo: 'Automação de Atendimento', itens: [
        'Chatbot integrado ao WhatsApp para dúvidas frequentes',
        'Mensagens automáticas de status (pedido pronto, saiu para entrega)',
      ]},
      { titulo: 'Gestão de Clientes', itens: [
        'Cadastro completo com nome, telefone, endereço e histórico',
        'Programa de fidelidade com pontos, descontos e entrega grátis',
      ]},
      { titulo: 'Gestão de Estoque Básico', itens: [
        'Controle automático do estoque dos produtos vendidos',
        'Alertas configuráveis para estoque acabando',
      ]},
      { titulo: 'Gestão de Entregadores', itens: [
        'Cadastro e gerenciamento de entregadores',
        'Cálculo automático das melhores rotas',
        'Link exclusivo para o entregador ver entregas, mapa e avisar clientes',
      ]},
      { titulo: 'Personalização de Áreas de Entrega', itens: [
        'Promoções como entrega grátis acima de um valor mínimo',
        'Horários específicos para ativar ou desativar entregas por região',
      ]},
      { titulo: 'Ferramentas de Marketing e Fidelização', itens: [
        'Disparo de mensagens em massa pelo WhatsApp',
        'Cupons personalizados: porcentagem, valor fixo ou entrega grátis',
      ]},
      { titulo: 'Relatórios e Análises', itens: [
        'Faturamento, número de pedidos, ticket médio e atrasos',
        'Mapa de calor das áreas com maior concentração de pedidos',
      ]},
      { titulo: 'Configuração de Produtos e Cardápio', itens: [
        'Cadastro de produtos com fotos, descrições e preços',
        'Adicionais como borda recheada ou molhos extras',
        'Personalização do cardápio com cores e logo da marca',
      ]},
      { titulo: 'Impressão Automática de Pedidos', itens: [
        'Impressoras configuradas para imprimir pedidos automaticamente',
      ]},
      { titulo: 'Extensão para WhatsApp Web', itens: [
        'Comunicação facilitada com os clientes pelo WhatsApp Web',
      ]},
      { titulo: 'Flexibilidade de Planos', itens: [
        'Contratação mensal, trimestral, semestral ou anual',
        'Descontos progressivos para períodos mais longos',
      ]},
      { titulo: 'Suporte e Atualizações', itens: [
        'Atendimento humanizado todos os dias da semana',
        'Atualizações constantes com novas funcionalidades',
      ]},
    ],
  },
  {
    id: 'premium',
    nome: 'Premium',
    titulo: 'Plano Premium',
    descricao: 'Operação completa: mesas, delivery, marketing e iFood.',
    badge: 'Mais completo',
    icon: Crown,
    destaque: true,
    accent: {
      text: 'text-amber-300', border: 'border-amber-400/50', bg: 'bg-amber-400/8',
      chip: 'bg-amber-400/15 text-amber-300 border-amber-400/50',
      btn: 'bg-gradient-to-r from-amber-500 to-amber-400 text-[#1a0020]', check: 'text-amber-300', dot: 'bg-amber-300',
    },
    precos: {
      mensal:     { mes: '269,99', total: '269,99' },
      trimestral: { mes: '259,99', total: '779,97' },
      semestral:  { mes: '249,99', total: '1.499,94' },
      anual:      { mes: '239,99', total: '2.879,88' },
    },
    resumo: [
      'Tudo do Mesas + tudo do Delivery',
      'Pedidos de delivery, mesa (QR Code) e balcão',
      'Integração com iFood, 99food e outros marketplaces',
      'Gestão de mesas e de entregadores',
      'Pagamento online + chatbot no WhatsApp',
      'Marketing: disparo em massa, cupons e fidelidade',
      'Gestão avançada e relatórios estratégicos',
      'Controle remoto da operação em tempo real',
    ],
    detalhes: [
      { titulo: 'Gestão de Pedidos de Delivery', itens: [
        'Recebimento e organização de pedidos em tempo real',
        'Status: pendente, em preparação, saiu para entrega, entregue',
        'Áreas de entrega por raio, bairros ou desenho no mapa',
        'Tempo estimado e taxas diferentes por região',
      ]},
      { titulo: 'Gestão de Pedidos para Mesas', itens: [
        'Pedidos direto da mesa com QR Code exclusivo',
        'Pedidos enviados automaticamente ao gestor e à cozinha',
        'Divisão da conta por itens ou valores iguais',
      ]},
      { titulo: 'Gestão de Retirada no Local (Balcão)', itens: [
        'Pedidos para retirada direto no estabelecimento',
        'Pedidos de retirada organizados separadamente',
      ]},
      { titulo: 'Gestão de Pagamentos', itens: [
        'Pagamentos online com cartão de crédito e Pix',
        'Registro de dinheiro ou maquininha na entrega ou no salão',
        'Pagamentos online seguros e integrados',
      ]},
      { titulo: 'Automação de Atendimento', itens: [
        'Chatbot integrado ao WhatsApp para dúvidas frequentes',
        'Mensagens automáticas de status do pedido',
      ]},
      { titulo: 'Gestão de Clientes', itens: [
        'Cadastro completo com histórico de pedidos',
        'Programa de fidelidade com pontos e recompensas',
      ]},
      { titulo: 'Gestão de Estoque Básico', itens: [
        'Controle automático do estoque',
        'Alertas para estoque acabando',
      ]},
      { titulo: 'Gestão de Entregadores', itens: [
        'Cadastro e gerenciamento de entregadores',
        'Cálculo automático das melhores rotas',
        'Link exclusivo para o entregador ver entregas e avisar clientes',
      ]},
      { titulo: 'Personalização de Áreas de Entrega', itens: [
        'Entrega grátis acima de um valor mínimo',
        'Horários para ativar ou desativar entregas por região',
      ]},
      { titulo: 'Ferramentas de Marketing e Fidelização', itens: [
        'Disparo de mensagens em massa pelo WhatsApp',
        'Cupons personalizados: porcentagem, valor fixo ou entrega grátis',
      ]},
      { titulo: 'Relatórios e Análises', itens: [
        'Faturamento, número de pedidos, ticket médio e atrasos',
        'Mapa de calor das áreas com maior concentração de pedidos',
      ]},
      { titulo: 'Configuração de Produtos e Cardápio', itens: [
        'Cadastro com fotos, descrições e preços',
        'Adicionais e personalização com cores e logo da marca',
      ]},
      { titulo: 'Impressão Automática de Pedidos', itens: [
        'Impressoras configuradas para imprimir pedidos automaticamente',
      ]},
      { titulo: 'Extensão para WhatsApp Web', itens: [
        'Comunicação facilitada com os clientes pelo WhatsApp Web',
      ]},
      { titulo: 'Gestão de Mesas', itens: [
        'Status das mesas: livre, ocupada e aguardando pagamento',
        'Consumo de cada mesa em tempo real',
        'Transferência de pedidos entre mesas e adição de itens',
      ]},
      { titulo: 'Flexibilidade de Planos', itens: [
        'Contratação mensal, trimestral, semestral ou anual',
        'Descontos progressivos para períodos mais longos',
      ]},
      { titulo: 'Suporte e Atualizações', itens: [
        'Atendimento humanizado todos os dias da semana',
        'Atualizações constantes com novas funcionalidades',
      ]},
      { titulo: 'Integração Completa', itens: [
        'Integração com marketplaces como iFood, 99food e outros',
        'Integração com sistemas de gestão e ferramentas de marketing',
      ]},
      { titulo: 'Gestão Avançada de Operação', itens: [
        'Controle remoto da operação, acompanhando tudo à distância',
        'Relatórios detalhados para decisão estratégica',
      ]},
    ],
  },
];

interface Modulo {
  id: string; nome: string; resumo: string; icon: LucideIcon; nota?: boolean;
  precos: Record<PeriodoId, { mes: string; total: string }>;
  detalhes: string[];
}

const MODULOS: Modulo[] = [
  {
    id: 'ifood', nome: 'iFood / Marketplaces', icon: ShoppingBag,
    resumo: 'Centraliza pedidos do iFood e outros marketplaces no gestor.',
    precos: {
      mensal:     { mes: '29,99', total: '29,99' },
      trimestral: { mes: '29,99', total: '89,97' },
      semestral:  { mes: '29,99', total: '179,94' },
      anual:      { mes: '29,99', total: '359,88' },
    },
    detalhes: [
      'Centralização de pedidos de iFood, 99food, Keeta (em breve) e Aiqfome (em breve)',
      'Acesso aos pedidos do iFood direto no gestor da Cardápio Web',
      'Dados de vendas do iFood integrados ao sistema',
      'Solicitação de motoboy do iFood direto pelo sistema',
    ],
  },
  {
    id: 'estoque', nome: 'Estoque Avançado', icon: Package,
    resumo: 'Controle de insumos com ficha técnica e baixa automática.',
    precos: {
      mensal:     { mes: '29,99', total: '29,99' },
      trimestral: { mes: '29,99', total: '89,97' },
      semestral:  { mes: '29,99', total: '179,94' },
      anual:      { mes: '29,99', total: '359,88' },
    },
    detalhes: [
      'Controle detalhado de insumos e produtos',
      'Ficha técnica por produto com baixa automática conforme as vendas',
      'Estoque mínimo com alertas: regular, baixo, crítico e sem controle',
      'Relatórios detalhados sobre o consumo de insumos e produtos',
      'Entrada de insumos no estoque feita de forma manual',
    ],
  },
  {
    id: 'fiscal', nome: 'Cupom Fiscal', icon: FileText,
    resumo: 'Emissão de notas fiscais (NF-e/NFC-e) com integração TEF.',
    precos: {
      mensal:     { mes: '69,99', total: '69,99' },
      trimestral: { mes: '69,99', total: '209,97' },
      semestral:  { mes: '69,99', total: '419,94' },
      anual:      { mes: '69,99', total: '839,88' },
    },
    detalhes: [
      'Emissão de notas fiscais diretamente pelo sistema',
      'Integração com TEF para pagamentos com cartão',
      'Configuração fiscal feita pelo cliente ou contador',
      'Suporte para emissão em todos os estados brasileiros',
      'Procedimentos específicos para autorização em PR e SC',
    ],
  },
  {
    id: 'roteirizacao', nome: 'Roteirização de Entregas', icon: Route, nota: true,
    resumo: 'Roteirização automática e relatórios de desempenho de entregas.',
    precos: {
      mensal:     { mes: '54,99', total: '54,99' },
      trimestral: { mes: '54,99', total: '164,97' },
      semestral:  { mes: '54,99', total: '329,94' },
      anual:      { mes: '54,99', total: '659,88' },
    },
    detalhes: [
      'Roteirização automática das entregas assim que o pedido é feito',
      'Cálculo da melhor rota para os entregadores',
      'Link exclusivo para o entregador ver entregas, mapa e avisar clientes',
      'Relatórios de desempenho: tempo de preparo, atrasos e mapa de calor',
      'Regiões com mais pedidos e tentativas fora da área de cobertura',
    ],
  },
  {
    id: 'financeiro', nome: 'Financeiro', icon: Wallet,
    resumo: 'Contas a pagar e receber, fluxo de caixa e centros de custo.',
    precos: {
      mensal:     { mes: '69,99', total: '69,99' },
      trimestral: { mes: '69,99', total: '209,97' },
      semestral:  { mes: '69,99', total: '419,94' },
      anual:      { mes: '69,99', total: '839,88' },
    },
    detalhes: [
      'Controle de contas a pagar e a receber',
      'Cadastro de fornecedores com categorias pré-definidas',
      'Fluxo de caixa detalhado, com receitas e despesas organizadas',
      'Movimentações financeiras em gráficos e calendário',
      'Categorias e centros de custos para análise detalhada',
      'Acompanhamento de contas vencidas, a vencer e pagas',
    ],
  },
  {
    id: 'totem', nome: 'Totem de Autoatendimento', icon: Tablet,
    resumo: 'Autoatendimento presencial em qualquer touchscreen. R$ 99,99 por dispositivo.',
    precos: {
      mensal:     { mes: '99,99', total: '99,99' },
      trimestral: { mes: '99,99', total: '249,97' },
      semestral:  { mes: '99,99', total: '499,94' },
      anual:      { mes: '99,99', total: '999,88' },
    },
    detalhes: [
      'Solução de autoatendimento presencial para clientes finais',
      'Funciona em qualquer touchscreen com navegador (Android, Windows ou Linux)',
      'Cliente faz o pedido, personaliza itens, aplica cupons e paga no totem',
      'Integração com maquininhas via Smart TEF para pagamentos com cartão',
      'Identificação por telefone, vinculando ao programa de fidelidade',
      'Mídias visuais personalizáveis, como chamariz e banners',
    ],
  },
];

function getPeriodo(id: PeriodoId) {
  return PERIODOS.find((p) => p.id === id)!;
}

function PlanoCard({ plano, periodo, aberto, onToggle }: {
  plano: Plano; periodo: PeriodoId; aberto: boolean; onToggle: () => void;
}) {
  const p = getPeriodo(periodo);
  const preco = plano.precos[periodo];
  const Icon = plano.icon;
  const precoPrincipal = periodo === 'mensal' ? `R$ ${preco.mes}` : `${p.parcelas}x de R$ ${preco.mes}`;

  const copiar = () => {
    const linhas = [
      `${plano.titulo} — ${p.label}`,
      `${precoPrincipal}/mês · ${p.totalLabel}: R$ ${preco.total}`,
      '',
      ...plano.resumo.map((r) => `• ${r}`),
    ].join('\n');
    navigator.clipboard?.writeText(linhas)
      .then(() => toast({ title: 'Copiado!', description: `${plano.titulo} (${p.label})` }))
      .catch(() => toast({ title: 'Não foi possível copiar', variant: 'destructive' }));
  };

  return (
    <div className={cn(
      'rounded-2xl border p-5 relative flex flex-col cw-card-hover',
      plano.accent.bg, plano.accent.border,
      plano.destaque && 'ring-1 ring-amber-400/30',
    )}>
      {/* Badge */}
      <span className={cn('absolute -top-2.5 left-5 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider border', plano.accent.chip)}>
        {plano.badge}
      </span>

      {/* Header */}
      <div className="flex items-center gap-2.5 mt-1 mb-1">
        <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', plano.accent.bg, plano.accent.border, 'border')}>
          <Icon className={cn('h-[18px] w-[18px]', plano.accent.text)} />
        </div>
        <span className={cn('text-[10px] font-black uppercase tracking-widest', plano.accent.text)}>{plano.nome}</span>
      </div>
      <h3 className="text-lg font-black text-cw-text">{plano.titulo}</h3>
      <p className="text-xs text-cw-muted mb-4 min-h-[2rem]">{plano.descricao}</p>

      {/* Preço */}
      <div className="mb-4">
        <p className="text-2xl font-black text-cw-text leading-tight">
          {precoPrincipal}<span className="text-sm font-semibold text-cw-muted">/mês</span>
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs text-cw-muted">{p.totalLabel}: R$ {preco.total}</span>
          {p.desc > 0 && (
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              ECONOMIZE {p.desc}%
            </span>
          )}
        </div>
      </div>

      {/* Resumo */}
      <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted mb-2">Funcionalidades</p>
      <ul className="space-y-1.5 mb-4">
        {plano.resumo.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-cw-text/85">
            <Check className={cn('h-3.5 w-3.5 shrink-0 mt-0.5', plano.accent.check)} />
            {f}
          </li>
        ))}
      </ul>

      {/* Detalhes expansíveis */}
      {aberto && (
        <div className="space-y-3 mb-4 border-t border-cw-border pt-4">
          {plano.detalhes.map((cat) => (
            <div key={cat.titulo}>
              <p className={cn('text-xs font-bold mb-1', plano.accent.text)}>{cat.titulo}</p>
              <ul className="space-y-1">
                {cat.itens.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-[11px] text-cw-muted leading-snug">
                    <span className={cn('mt-1 h-1 w-1 rounded-full shrink-0', plano.accent.dot)} />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Ações */}
      <div className="mt-auto flex items-center gap-2">
        <button
          onClick={onToggle}
          className={cn('flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl text-sm font-bold hover:brightness-110 transition-all', plano.accent.btn)}
        >
          {aberto ? 'Ocultar detalhes' : 'Ver detalhes do plano'}
          <ChevronDown className={cn('h-4 w-4 transition-transform', aberto && 'rotate-180')} />
        </button>
        <button
          onClick={copiar}
          title="Copiar resumo do plano"
          className="h-11 w-11 shrink-0 rounded-xl border border-cw-border bg-cw-elevated text-cw-muted hover:text-cw-text hover:border-cw-purple/40 flex items-center justify-center transition-colors"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ModuloCard({ modulo, periodo, aberto, onToggle }: {
  modulo: Modulo; periodo: PeriodoId; aberto: boolean; onToggle: () => void;
}) {
  const p = getPeriodo(periodo);
  const preco = modulo.precos[periodo];
  const Icon = modulo.icon;

  return (
    <div className="cw-card cw-card-hover p-5 flex flex-col">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-9 w-9 rounded-xl bg-cw-purple/10 border border-cw-purple/25 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-cw-purple-light" />
        </div>
        <p className="text-sm font-bold text-cw-text leading-tight">
          {modulo.nome}{modulo.nota && <span className="text-cw-red"> *</span>}
        </p>
      </div>

      <p className="text-xs text-cw-muted mb-3 min-h-[2.5rem]">{modulo.resumo}</p>

      <div className="mb-3">
        <p className="text-xl font-black text-cw-purple-light leading-tight">
          R$ {preco.mes}<span className="text-xs font-semibold text-cw-muted">/mês</span>
        </p>
        <p className="text-[11px] text-cw-muted">{p.totalLabel}: R$ {preco.total}</p>
      </div>

      {aberto && (
        <ul className="space-y-1.5 mb-3 border-t border-cw-border pt-3">
          {modulo.detalhes.map((d) => (
            <li key={d} className="flex items-start gap-2 text-[11px] text-cw-muted leading-snug">
              <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-cw-purple-light" />
              {d}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onToggle}
        className="mt-auto flex items-center justify-center gap-1.5 h-9 rounded-lg border border-cw-border bg-cw-elevated text-xs font-semibold text-cw-text/80 hover:border-cw-purple/40 hover:text-cw-text transition-colors"
      >
        {aberto ? 'Ocultar detalhes' : 'Ver detalhes'}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', aberto && 'rotate-180')} />
      </button>
    </div>
  );
}

export function PlaybookPlanos() {
  const [periodo, setPeriodo] = useState<PeriodoId>('anual');
  const [view, setView] = useState<'planos' | 'modulos'>('planos');
  const [abertoPlano, setAbertoPlano] = useState<string | null>(null);
  const [abertoModulo, setAbertoModulo] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Barra superior: sub-abas + período */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Sub-abas */}
        <div className="inline-flex bg-cw-surface border border-cw-border rounded-xl p-1">
          {([['planos', 'Planos'], ['modulos', 'Módulos Extras']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-bold transition-all',
                view === id ? 'gradient-primary text-white shadow' : 'text-cw-muted hover:text-cw-text',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Seletor de período */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cw-muted hidden sm:inline">Período</span>
          <div className="inline-flex bg-cw-surface border border-cw-border rounded-xl p-1 flex-wrap">
            {PERIODOS.map((per) => (
              <button
                key={per.id}
                onClick={() => setPeriodo(per.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
                  periodo === per.id ? 'gradient-primary text-white shadow' : 'text-cw-muted hover:text-cw-text',
                )}
              >
                {per.label}
                {per.desc > 0 && (
                  <span className={cn(
                    'text-[9px] font-black px-1 rounded',
                    periodo === per.id ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-400',
                  )}>
                    -{per.desc}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Planos */}
      {view === 'planos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start pt-2">
          {PLANOS.map((plano) => (
            <PlanoCard
              key={plano.id}
              plano={plano}
              periodo={periodo}
              aberto={abertoPlano === plano.id}
              onToggle={() => setAbertoPlano((cur) => (cur === plano.id ? null : plano.id))}
            />
          ))}
        </div>
      )}

      {/* Módulos Extras */}
      {view === 'modulos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULOS.map((modulo) => (
              <ModuloCard
                key={modulo.id}
                modulo={modulo}
                periodo={periodo}
                aberto={abertoModulo === modulo.id}
                onToggle={() => setAbertoModulo((cur) => (cur === modulo.id ? null : modulo.id))}
              />
            ))}
          </div>
          <div className="cw-card p-4 text-[11px] text-cw-muted space-y-1">
            <p><span className="text-cw-red font-bold">*</span> Módulo fiscal e de roteirização de entrega possuem valores excedentes. Favor consultar o CSM mais próximo.</p>
            <p>🖥️ Totem de Autoatendimento: <span className="font-semibold text-cw-text">R$ 99,99 por dispositivo</span>.</p>
          </div>
        </div>
      )}
    </div>
  );
}
