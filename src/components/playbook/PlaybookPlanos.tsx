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
  importante?: string;
}

const PLANOS: Plano[] = [
  {
    id: 'mesas',
    nome: 'Mesas',
    titulo: 'Plano Mesas',
    descricao: 'O Plano Mesas da Cardápio Web é ideal para negócios que trabalham com atendimento presencial em mesas.',
    badge: 'Ideal para restaurantes',
    icon: Utensils,
    accent: {
      text: 'text-cw-purple', border: 'border-cw-purple/30', bg: 'bg-cw-purple/5',
      chip: 'bg-cw-purple text-white border-transparent',
      btn: 'gradient-primary text-white', check: 'text-cw-purple', dot: 'bg-cw-purple',
    },
    precos: {
      mensal:     { mes: '169,99', total: '169,99' },
      trimestral: { mes: '159,99', total: '479,97' },
      semestral:  { mes: '149,99', total: '899,94' },
      anual:      { mes: '139,99', total: '1.679,88' },
    },
    resumo: [
      'Gestão de pedidos para mesas, com controle direto por QR Code.',
      'Gestão de pedidos feitos no local (balcão).',
      'Controle financeiro das vendas.',
      'Impressão automática para agilizar o atendimento.',
      'Gestão de usuários e clientes, com controle de acesso e cadastro.',
      'Controle básico de insumos.',
      'Campos personalizados para adaptar o sistema à sua operação.',
    ],
    detalhes: [
      { titulo: 'Gestão de Pedidos', itens: [
        'Gestão de pedidos para mesas, com controle direto por QR Code.',
        'Gestão de pedidos feitos no local (balcão).',
      ]},
      { titulo: 'Financeiro', itens: [
        'Controle financeiro das vendas.',
      ]},
      { titulo: 'Operação', itens: [
        'Impressão automática para agilizar o atendimento.',
      ]},
      { titulo: 'Clientes e Usuários', itens: [
        'Gestão de usuários e clientes, com controle de acesso e cadastro.',
      ]},
      { titulo: 'Estoque', itens: [
        'Controle básico de insumos.',
      ]},
      { titulo: 'Configuração', itens: [
        'Campos personalizados para adaptar o sistema à sua operação.',
      ]},
      { titulo: 'Não incluído neste plano', itens: [
        'Programa de fidelidade (pontos para clientes)',
        'Pagamento online pelo site ou link',
        'Chatbot automático no WhatsApp',
        'Extensão para WhatsApp Web',
      ]},
    ],
    importante: 'Este plano não inclui funcionalidades como fidelidade, pagamento online, chatbot e extensão WhatsApp.',
  },
  {
    id: 'delivery',
    nome: 'Delivery',
    titulo: 'Plano Delivery',
    descricao: 'O Plano Delivery da Cardápio Web é ideal para negócios que atuam com delivery, retirada ou consumo no local com pagamento imediato.',
    badge: 'Melhor para delivery',
    icon: Bike,
    accent: {
      text: 'text-blue-600', border: 'border-blue-200', bg: 'bg-blue-50',
      chip: 'bg-blue-600 text-white border-transparent',
      btn: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white', check: 'text-blue-600', dot: 'bg-blue-600',
    },
    precos: {
      mensal:     { mes: '209,99', total: '209,99' },
      trimestral: { mes: '199,99', total: '599,97' },
      semestral:  { mes: '189,99', total: '1.139,94' },
      anual:      { mes: '179,99', total: '2.159,88' },
    },
    resumo: [
      'Gestão completa dos pedidos de entrega.',
      'Gestão de pedidos feitos no local.',
      'Controle financeiro das vendas.',
      'Cadastro e gestão dos entregadores.',
      'Campos personalizados para adaptar o sistema à sua operação.',
      'Impressão automática para agilizar o processo de produção e entrega.',
      'Gestão de usuários e clientes, com controle de acesso e cadastro.',
      'Controle básico de insumos.',
      'Programa de pontos para clientes.',
      'Permissão para vendas a prazo.',
      'Recebimento de pedidos pagos pelo site.',
      'Integração com WhatsApp para atendimento e pedidos.',
    ],
    detalhes: [
      { titulo: 'Gestão de Pedidos e Operação', itens: [
        'Gestão completa dos pedidos de entrega.',
        'Gestão de pedidos feitos no local.',
        'Impressão automática para agilizar o processo de produção e entrega.',
      ]},
      { titulo: 'Financeiro e Pagamentos', itens: [
        'Controle financeiro das vendas.',
        'Permissão para vendas a prazo.',
        'Recebimento de pedidos pagos pelo site.',
      ]},
      { titulo: 'Entregadores', itens: [
        'Cadastro e gestão dos entregadores.',
      ]},
      { titulo: 'Clientes e Fidelidade', itens: [
        'Gestão de usuários e clientes, com controle de acesso e cadastro.',
        'Programa de pontos para clientes.',
      ]},
      { titulo: 'Estoque', itens: [
        'Controle básico de insumos.',
      ]},
      { titulo: 'Atendimento ao Cliente', itens: [
        'Integração com WhatsApp para atendimento e pedidos.',
      ]},
      { titulo: 'Configuração', itens: [
        'Campos personalizados para adaptar o sistema à sua operação.',
      ]},
    ],
  },
  {
    id: 'premium',
    nome: 'Premium',
    titulo: 'Plano Premium',
    descricao: 'O Plano Premium da Cardápio Web é o mais completo, ideal para negócios que combinam atendimento presencial em mesas e delivery.',
    badge: 'Mais completo',
    icon: Crown,
    destaque: true,
    accent: {
      text: 'text-amber-600', border: 'border-amber-300', bg: 'bg-amber-50',
      chip: 'bg-amber-500 text-white border-transparent',
      btn: 'bg-gradient-to-r from-amber-500 to-amber-400 text-white', check: 'text-amber-600', dot: 'bg-amber-600',
    },
    precos: {
      mensal:     { mes: '269,99', total: '269,99' },
      trimestral: { mes: '259,99', total: '779,97' },
      semestral:  { mes: '249,99', total: '1.499,94' },
      anual:      { mes: '239,99', total: '2.879,88' },
    },
    resumo: [
      'Gestão de pedidos para mesas, com controle direto por QR Code.',
      'Gestão completa dos pedidos de entrega.',
      'Gestão de pedidos feitos no local (balcão).',
      'Controle financeiro das vendas.',
      'Cadastro e gestão dos entregadores.',
      'Campos personalizados para adaptar o sistema à sua operação.',
      'Impressão automática para agilizar o atendimento e entrega.',
      'Gestão de usuários e clientes, com controle de acesso e cadastro.',
      'Controle básico de insumos.',
      'Programa de pontos para clientes (fidelidade).',
      'Permissão para vendas a prazo.',
      'Recebimento de pedidos pagos pelo site.',
      'Integração com WhatsApp para atendimento e pedidos.',
    ],
    detalhes: [
      { titulo: 'Gestão de Pedidos e Operação', itens: [
        'Gestão de pedidos para mesas, com controle direto por QR Code.',
        'Gestão completa dos pedidos de entrega.',
        'Gestão de pedidos feitos no local (balcão).',
        'Impressão automática para agilizar o atendimento e entrega.',
      ]},
      { titulo: 'Financeiro e Pagamentos', itens: [
        'Controle financeiro das vendas.',
        'Permissão para vendas a prazo.',
        'Recebimento de pedidos pagos pelo site.',
      ]},
      { titulo: 'Entregadores', itens: [
        'Cadastro e gestão dos entregadores.',
      ]},
      { titulo: 'Clientes e Fidelidade', itens: [
        'Gestão de usuários e clientes, com controle de acesso e cadastro.',
        'Programa de pontos para clientes (fidelidade).',
      ]},
      { titulo: 'Estoque', itens: [
        'Controle básico de insumos.',
      ]},
      { titulo: 'Atendimento ao Cliente', itens: [
        'Integração com WhatsApp para atendimento e pedidos.',
      ]},
      { titulo: 'Configuração', itens: [
        'Campos personalizados para adaptar o sistema à sua operação.',
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
    id: 'financeiro', nome: 'Gestão Financeira', icon: Wallet,
    resumo: 'Controle de contas a pagar e a receber, fluxo de caixa, fornecedores, categorias e centros de custo.',
    precos: {
      mensal:     { mes: '69,99', total: '69,99' },
      trimestral: { mes: '69,99', total: '209,97' },
      semestral:  { mes: '69,99', total: '419,94' },
      anual:      { mes: '69,99', total: '839,88' },
    },
    detalhes: [
      'Controle de contas a pagar e a receber',
      'Fluxo de caixa completo do negócio',
      'Cadastro de fornecedores',
      'Categorias e centros de custo para organizar as finanças',
    ],
  },
  {
    id: 'fiscal', nome: 'Cupom Fiscal', icon: FileText, nota: true,
    resumo: 'Emissão de cupons fiscais para atender às exigências legais.',
    precos: {
      mensal:     { mes: '69,99', total: '69,99' },
      trimestral: { mes: '69,99', total: '209,97' },
      semestral:  { mes: '69,99', total: '419,94' },
      anual:      { mes: '69,99', total: '839,88' },
    },
    detalhes: [
      'Emissão de cupons fiscais (NF-e/NFC-e)',
      'Necessário para negócios que precisam emitir nota fiscal para os clientes',
    ],
  },
  {
    id: 'roteirizacao', nome: 'Gestão de Entregas (Roteirização)', icon: Route, nota: true,
    resumo: 'Roteirização automática para entregadores, com cálculo da melhor rota.',
    precos: {
      mensal:     { mes: '54,99', total: '54,99' },
      trimestral: { mes: '54,99', total: '164,97' },
      semestral:  { mes: '54,99', total: '329,94' },
      anual:      { mes: '54,99', total: '659,88' },
    },
    detalhes: [
      'Roteirização automática para entregadores',
      'Cálculo da melhor rota',
      'Link para o entregador acompanhar as entregas',
      'Dados detalhados sobre o desempenho das entregas',
    ],
  },
  {
    id: 'estoque', nome: 'Estoque Avançado', icon: Package,
    resumo: 'Controle detalhado de insumos, com baixa automática conforme as vendas.',
    precos: {
      mensal:     { mes: '29,99', total: '29,99' },
      trimestral: { mes: '29,99', total: '89,97' },
      semestral:  { mes: '29,99', total: '179,94' },
      anual:      { mes: '29,99', total: '359,88' },
    },
    detalhes: [
      'Controle detalhado de insumos',
      'Baixa automática no estoque conforme as vendas',
      'Alertas de estoque baixo',
      'Possibilidade de cadastrar fichas técnicas dos produtos',
    ],
  },
  {
    id: 'ifood', nome: 'Integração com Marketplaces', icon: ShoppingBag,
    resumo: 'Centraliza pedidos de plataformas como iFood no gestor da Cardápio Web.',
    precos: {
      mensal:     { mes: '29,99', total: '29,99' },
      trimestral: { mes: '29,99', total: '89,97' },
      semestral:  { mes: '29,99', total: '179,94' },
      anual:      { mes: '29,99', total: '359,88' },
    },
    detalhes: [
      'Centralização de pedidos do iFood (e futuramente 99food, Keeta e Aiqfome)',
      'Acesso a dados de vendas das plataformas integradas',
      'Solicitação de motoboy do iFood direto pelo sistema',
    ],
  },
  {
    id: 'totem', nome: 'Totem de Autoatendimento', icon: Tablet,
    resumo: 'Solução de autoatendimento presencial em dispositivos touchscreen. R$ 99,99 por dispositivo.',
    precos: {
      mensal:     { mes: '99,99', total: '99,99' },
      trimestral: { mes: '99,99', total: '249,97' },
      semestral:  { mes: '99,99', total: '499,94' },
      anual:      { mes: '99,99', total: '999,88' },
    },
    detalhes: [
      'Solução de autoatendimento presencial em dispositivos touchscreen',
      'Ideal para operações com alto fluxo presencial, como hamburguerias e fast food',
      'Cobrado por dispositivo (R$ 99,99/mês cada)',
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
      `${plano.descricao} Ele inclui:`,
      '',
      ...plano.resumo.map((r, i) => `${i + 1}. ${r}`),
      '',
      'Valores:',
      ...PERIODOS.map((per) => `- ${per.label}: R$ ${plano.precos[per.id].total}`),
    ];
    if (plano.importante) linhas.push('', `Importante: ${plano.importante}`);
    navigator.clipboard?.writeText(linhas.join('\n'))
      .then(() => toast({ title: 'Copiado!', description: plano.titulo }))
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
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
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

      {/* Aviso de exclusões */}
      {plano.importante && (
        <p className="text-[11px] text-cw-red bg-cw-red/5 border border-cw-red/20 rounded-lg px-2.5 py-2 mb-4 leading-snug">
          <span className="font-bold">Importante:</span> {plano.importante}
        </p>
      )}

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

  const copiar = () => {
    const linhas = [
      `${modulo.nome}: ${modulo.resumo}`,
      '',
      'Valores:',
      ...PERIODOS.map((per) => `- ${per.label}: R$ ${modulo.precos[per.id].total}`),
    ].join('\n');
    navigator.clipboard?.writeText(linhas)
      .then(() => toast({ title: 'Copiado!', description: modulo.nome }))
      .catch(() => toast({ title: 'Não foi possível copiar', variant: 'destructive' }));
  };

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

      <div className="mt-auto flex items-center gap-2">
        <button
          onClick={onToggle}
          className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg border border-cw-border bg-cw-elevated text-xs font-semibold text-cw-text/80 hover:border-cw-purple/40 hover:text-cw-text transition-colors"
        >
          {aberto ? 'Ocultar detalhes' : 'Ver detalhes'}
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', aberto && 'rotate-180')} />
        </button>
        <button
          onClick={copiar}
          title="Copiar resumo do módulo"
          className="h-9 w-9 shrink-0 rounded-lg border border-cw-border bg-cw-elevated text-cw-muted hover:text-cw-text hover:border-cw-purple/40 flex items-center justify-center transition-colors"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
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
                    periodo === per.id ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-700',
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
