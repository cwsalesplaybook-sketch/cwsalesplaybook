/** Calculadora de Proposta CW — gera a proposta comercial (multi-loja) e copia o texto.
 *  Remodelada a partir da Calculadora de Proposta do portal de representantes.
 *  Sem "Taxa de Implantação" (removida a pedido). */
import { useMemo, useState } from 'react';
import { Plus, Minus, Copy, Check, Trash2, CopyPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ----------------------------- Dados ----------------------------- */
type Period = 'Mensal' | 'Trimestral' | 'Semestral' | 'Anual';
type PlanType = 'Mesas' | 'Delivery' | 'Premium';

const PERIODOS: Period[] = ['Mensal', 'Trimestral', 'Semestral', 'Anual'];
const MULT: Record<Period, number> = { Mensal: 1, Trimestral: 3, Semestral: 6, Anual: 12 };
const PERIODO_LABEL: Record<Period, string> = {
  Mensal: 'Cobrança mês a mês',
  Trimestral: '3 meses — pagamento trimestral',
  Semestral: '6 meses — pagamento semestral',
  Anual: '12 meses — pagamento anual',
};

const PLANOS: Record<PlanType, Record<Period, { t: number; m: number }>> = {
  Mesas: {
    Mensal: { t: 169.99, m: 169.99 }, Trimestral: { t: 479.97, m: 159.99 },
    Semestral: { t: 899.94, m: 149.99 }, Anual: { t: 1679.88, m: 139.99 },
  },
  Delivery: {
    Mensal: { t: 209.99, m: 209.99 }, Trimestral: { t: 599.97, m: 199.99 },
    Semestral: { t: 1139.94, m: 189.99 }, Anual: { t: 2159.88, m: 179.99 },
  },
  Premium: {
    Mensal: { t: 269.99, m: 269.99 }, Trimestral: { t: 779.97, m: 259.99 },
    Semestral: { t: 1499.94, m: 249.99 }, Anual: { t: 2879.88, m: 239.99 },
  },
};

const PLAN_OPTIONS: PlanType[] = ['Mesas', 'Delivery', 'Premium'];

const MODULES = [
  { id: 'marketplace', name: 'Marketplace', val: 29.99,
    tag: 'iFood, Keeta, 99Food e AiQFome',
    bullets: ['Integração com iFood', 'Integração com Keeta', 'Integração com 99Food', 'Integração com AiQFome'] },
  { id: 'estoque', name: 'Estoque Avançado', val: 29.99,
    tag: 'Controle completo de estoque e fichas técnicas',
    bullets: ['Estoque de itens e opções', 'Controle de insumos', 'Ficha técnica', 'Movimentações de estoque'] },
  { id: 'roteirizacao', name: 'Roteirização', val: 54.99,
    tag: 'Otimização de rotas para entregadores',
    bullets: ['500 pedidos/mês inclusos', 'Excedente até 1.500: R$ 0,08/pedido', 'Acima de 1.500: R$ 0,06/pedido'] },
  { id: 'fiscal', name: 'Fiscal', val: 69.99,
    tag: 'Emissão de NFC-e integrada',
    bullets: ['Até 2.500 NFC-e por mês', 'Excedente: R$ 0,05 por NFC-e'] },
  { id: 'financeiro', name: 'Financeiro', val: 69.99,
    tag: 'Gestão financeira completa',
    bullets: ['Lançamentos financeiros', 'Contas a pagar e receber', 'Fluxo de caixa com calendário', 'Análise de pagamentos e recebimentos'] },
] as const;

const SELF_MODULES = [
  { id: 'totem', name: 'Totem', val: 99.99, unit: 'unid.',
    tag: 'Autoatendimento independente para clientes',
    bullets: ['Pedidos autônomos pelos clientes', 'Interface intuitiva e rápida', 'Integrado ao sistema de gestão'] },
] as const;

const INCLUSO = [
  'Suporte técnico incluso',
  'Atualizações do sistema inclusas',
  'Treinamento de implantação incluso',
];

const PLAN_FEATURES: Record<PlanType, string[]> = {
  Mesas: [
    'Cardápio Web para visualização e balcão',
    'Cardápio Web para mesas com pedidos',
    'Controle de mesas e garçons',
    'Adição de pedidos manualmente',
    'Sistema de caixa',
    'Controle de estoque simplificado',
    'Gestão de clientes',
    'Histórico de pedidos e relatórios',
    'Atualização do cardápio',
    'Horários de funcionamento',
    'Taxas de entrega por bairro ou km',
    'Gestão de cupons e avisos',
    'Múltiplos usuários com permissões',
    'Impressão automática de comandas',
    'Múltiplas impressoras',
    'Google Analytics e Tag Manager',
    'Integração com domínio próprio',
    'WhatsApp API Oficial (Meta)',
    'ChatBot de WhatsApp',
  ],
  Delivery: [
    'Cardápio Web para delivery, balcão e visualização',
    'Adição de pedidos manualmente',
    'Sistema de caixa',
    'Controle de estoque simplificado',
    'Integração com Facebook Pixels',
    'Gestão de clientes',
    'Histórico de pedidos e relatórios',
    'Atualização do cardápio',
    'Horários de funcionamento',
    'Taxas de entrega por bairro ou km',
    'Gestão de cupons e avisos',
    'Múltiplos usuários com permissões',
    'Impressão automática de comandas',
    'Múltiplas impressoras',
    'Controle de entregadores',
    'Pedidos agendados',
    'Avaliação de pedidos',
    'Pagamento online',
    'Sistema de fidelidade',
    'Google Analytics e Tag Manager',
    'Integração com domínio próprio',
    'WhatsApp API Oficial (Meta)',
    'ChatBot de WhatsApp',
  ],
  Premium: [
    'Cardápio Web para delivery, visualização e balcão',
    'Cardápio Web para mesas com pedidos',
    'Controle de mesas e garçons',
    'Adição de pedidos (delivery + mesas)',
    'Sistema de caixa',
    'Controle de estoque simplificado',
    'Integração com Facebook Pixels',
    'Gestão de clientes',
    'Histórico de pedidos e relatórios',
    'Atualização do cardápio',
    'Horários de funcionamento',
    'Taxas de entrega por bairro ou km',
    'Gestão de cupons e avisos',
    'Múltiplos usuários com permissões',
    'Impressão automática de comandas',
    'Múltiplas impressoras',
    'Controle de entregadores',
    'Pedidos agendados',
    'Avaliação de pedidos',
    'Pagamento online',
    'Google Analytics e Tag Manager',
    'Integração com domínio próprio',
    'WhatsApp API Oficial (Meta)',
    'ChatBot de WhatsApp',
  ],
};

const BRL = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* ----------------------------- Estado ---------------------------- */
interface ClientInfo {
  contato: string; telefone: string; empresa: string; documento: string;
  email: string; cep: string; endereco: string; cidade: string; uf: string;
}
const emptyClient: ClientInfo = {
  contato: '', telefone: '', empresa: '', documento: '',
  email: '', cep: '', endereco: '', cidade: '', uf: '',
};

interface StoreConfig {
  id: string;
  name: string;
  planType: PlanType;
  period: Period;
  modules: Record<string, boolean>;
  selfModules: Record<string, number>;
}

function newStore(name: string): StoreConfig {
  return {
    id: Math.random().toString(36).slice(2, 9),
    name,
    planType: 'Premium',
    period: 'Mensal',
    modules: Object.fromEntries(MODULES.map(m => [m.id, false])),
    selfModules: Object.fromEntries(SELF_MODULES.map(m => [m.id, 0])),
  };
}

function calcStore(s: StoreConfig) {
  const base = PLANOS[s.planType][s.period];
  const mult = MULT[s.period];
  const planMonthly = s.period === 'Mensal' ? base.m : base.t / mult;
  const modulesMonthly = MODULES.filter(m => s.modules[m.id]).reduce((a, m) => a + m.val, 0);
  const selfMonthly = SELF_MODULES.reduce((a, m) => a + m.val * (s.selfModules[m.id] || 0), 0);
  const monthly = planMonthly + modulesMonthly + selfMonthly;
  return {
    base, mult, planMonthly, modulesMonthly, selfMonthly,
    monthly,
    totalPeriodo: monthly * mult,
  };
}
type Calc = ReturnType<typeof calcStore>;

/* --------------------------- Proposta em texto ------------------- */
function buildProposta(
  client: ClientInfo,
  calcs: { s: StoreConfig; c: Calc }[],
  consolidated: { monthly: number; totalPeriodo: number },
  validadeDias: number,
) {
  const multi = calcs.length > 1;
  const hoje = new Date().toLocaleDateString('pt-BR');
  const out: string[] = [
    '*Proposta Comercial — Cardápio Web*',
    'Sistema de Gestão para Restaurantes',
    `Data: ${hoje}`,
  ];

  const cli: string[] = [];
  if (client.contato) cli.push(client.contato);
  if (client.empresa) cli.push(client.empresa);
  if (cli.length) out.push('', `Cliente: ${cli.join(' — ')}`);
  if (client.telefone) out.push(`Telefone: ${client.telefone}`);

  for (const { s, c } of calcs) {
    out.push('');
    if (multi) out.push(`🏪 *${s.name}* — Plano ${s.planType} · ${s.period}`);
    else out.push(`*Plano ${s.planType} · ${s.period}*`);
    out.push(`• Plano ${s.planType}: ${BRL(c.planMonthly)}/mês`);
    MODULES.filter(m => s.modules[m.id]).forEach(m => out.push(`• ${m.name}: ${BRL(m.val)}/mês`));
    SELF_MODULES.forEach(m => {
      const q = s.selfModules[m.id] || 0;
      if (q > 0) out.push(`• ${m.name} (${q}×): ${BRL(m.val * q)}/mês`);
    });
    out.push(`Mensalidade: ${BRL(c.monthly)}/mês`);
    if (c.mult > 1) out.push(`Total do período (${c.mult}x): ${BRL(c.totalPeriodo)}`);
  }

  if (multi) {
    out.push('', `*TOTAL GERAL: ${BRL(consolidated.monthly)}/mês* (soma das lojas)`);
    out.push(`Total geral do período: ${BRL(consolidated.totalPeriodo)}`);
  }

  out.push('', `Proposta válida por ${validadeDias} dias corridos a partir da emissão.`);
  return out.join('\n').trim();
}

/* ----------------------------- UI helpers ----------------------- */
function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-1">{label}</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-cw-bg border border-cw-border rounded-lg px-3 py-2 text-sm text-cw-text placeholder:text-cw-muted/60 focus:outline-none focus:border-cw-purple"
      />
    </label>
  );
}

/* --------------------------- Componente -------------------------- */
export default function Calculadora() {
  const [client, setClient] = useState<ClientInfo>(emptyClient);
  const [validadeDias, setValidadeDias] = useState(15);
  const [stores, setStores] = useState<StoreConfig[]>([newStore('Loja 1')]);
  const [activeId, setActiveId] = useState(stores[0].id);
  const [copied, setCopied] = useState(false);

  const active = stores.find(s => s.id === activeId) ?? stores[0];
  const setC = (patch: Partial<ClientInfo>) => setClient(prev => ({ ...prev, ...patch }));
  const update = (patch: Partial<StoreConfig>) =>
    setStores(prev => prev.map(s => (s.id === active.id ? { ...s, ...patch } : s)));

  const nextStoreNumber = (list: StoreConfig[]) => {
    const nums = list
      .map(s => /^Loja (\d+)$/.exec(s.name.trim()))
      .filter((m): m is RegExpExecArray => m !== null)
      .map(m => parseInt(m[1], 10));
    return (nums.length ? Math.max(...nums) : list.length) + 1;
  };
  const addStore = () => {
    const s = newStore(`Loja ${nextStoreNumber(stores)}`);
    setStores([...stores, s]);
    setActiveId(s.id);
  };
  const removeStore = (id: string) => {
    if (stores.length === 1) return;
    const next = stores.filter(s => s.id !== id);
    setStores(next);
    if (activeId === id) setActiveId(next[0].id);
  };
  const duplicateStore = (id: string) => {
    const src = stores.find(s => s.id === id);
    if (!src) return;
    const copy: StoreConfig = {
      ...src, id: Math.random().toString(36).slice(2, 9),
      name: `Loja ${nextStoreNumber(stores)}`,
      modules: { ...src.modules }, selfModules: { ...src.selfModules },
    };
    setStores([...stores, copy]);
    setActiveId(copy.id);
  };

  const calcs = useMemo(() => stores.map(s => ({ s, c: calcStore(s) })), [stores]);
  const consolidated = calcs.reduce(
    (acc, { c }) => ({ monthly: acc.monthly + c.monthly, totalPeriodo: acc.totalPeriodo + c.totalPeriodo }),
    { monthly: 0, totalPeriodo: 0 },
  );
  const ac = calcStore(active);
  const hoje = new Date().toLocaleDateString('pt-BR');

  const copiarProposta = () => {
    const texto = buildProposta(client, calcs, consolidated, validadeDias);
    navigator.clipboard?.writeText(texto).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const selectedModules = MODULES.filter(m => active.modules[m.id]);
  const totemQty = active.selfModules['totem'] || 0;

  return (
    <div className="p-8 space-y-4 h-full flex flex-col">
      {/* Barra de ações — lojas */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap gap-1.5">
          {stores.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg border text-sm font-semibold transition-all',
                s.id === activeId
                  ? 'border-cw-purple bg-cw-purple/10 text-cw-purple'
                  : 'border-cw-border bg-cw-bg text-cw-muted hover:text-cw-text',
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={addStore} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg gradient-primary text-white text-sm font-semibold">
            <Plus className="h-3.5 w-3.5" /> Adicionar loja
          </button>
          <button onClick={() => duplicateStore(active.id)} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-cw-border text-cw-text text-sm font-semibold hover:bg-cw-elevated">
            <CopyPlus className="h-3.5 w-3.5" /> Duplicar
          </button>
          {stores.length > 1 && (
            <button onClick={() => removeStore(active.id)} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-red-300 text-red-500 text-sm font-semibold hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5" /> Remover
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* ── Configuração ── */}
        <div className="cw-card p-6 space-y-6 h-full overflow-y-auto">
          {/* Identificação do cliente */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted">Identificação do cliente</p>
              <span className="text-[9px] font-bold uppercase tracking-widest text-cw-muted/70 border border-cw-border rounded px-1.5 py-0.5">Opcional</span>
            </div>
            <p className="text-[11px] text-cw-muted mb-3">Dados para personalizar a proposta copiada.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Nome do contato" value={client.contato} onChange={v => setC({ contato: v })} placeholder="João Silva" />
              <Field label="Telefone" value={client.telefone} onChange={v => setC({ telefone: v })} placeholder="(41) 99999-0000" />
              <Field label="Empresa / estabelecimento" value={client.empresa} onChange={v => setC({ empresa: v })} placeholder="Restaurante do João" />
              <Field label="CPF / CNPJ" value={client.documento} onChange={v => setC({ documento: v })} placeholder="00.000.000/0001-00" />
              <Field label="E-mail" value={client.email} onChange={v => setC({ email: v })} placeholder="joao@restaurante.com" />
              <Field label="CEP" value={client.cep} onChange={v => setC({ cep: v })} placeholder="00000-000" />
              <div className="sm:col-span-2">
                <Field label="Endereço" value={client.endereco} onChange={v => setC({ endereco: v })} placeholder="Rua das Flores, 123" />
              </div>
              <Field label="Cidade" value={client.cidade} onChange={v => setC({ cidade: v })} placeholder="Curitiba" />
              <Field label="UF" value={client.uf} onChange={v => setC({ uf: v.toUpperCase().slice(0, 2) })} placeholder="PR" />
            </div>
          </div>

          <div className="h-px bg-cw-border" />

          {/* Período */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-1">Período de contratação</p>
            <p className="text-[11px] text-cw-muted mb-3">{PERIODO_LABEL[active.period]}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PERIODOS.map(p => (
                <button
                  key={p}
                  onClick={() => update({ period: p })}
                  className={cn(
                    'rounded-lg border py-2 text-sm font-semibold transition-all',
                    active.period === p
                      ? 'border-cw-purple bg-cw-purple/10 text-cw-purple'
                      : 'border-cw-border bg-cw-bg text-cw-muted hover:text-cw-text',
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Plano base */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-1">1 · Plano base</p>
            <p className="text-[11px] text-cw-muted mb-3">Selecione o plano principal.</p>
            <div className="space-y-2">
              {PLAN_OPTIONS.map(p => {
                const sel = active.planType === p;
                const base = PLANOS[p][active.period];
                const monthly = active.period === 'Mensal' ? base.m : base.t / MULT[active.period];
                return (
                  <button
                    key={p}
                    onClick={() => update({ planType: p })}
                    className={cn(
                      'relative w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all',
                      sel ? 'border-cw-purple bg-cw-purple/5' : 'border-cw-border hover:border-cw-purple/40',
                    )}
                  >
                    {p === 'Premium' && (
                      <span className="absolute -top-2 left-4 text-[9px] font-black uppercase tracking-widest text-white gradient-primary rounded-full px-2 py-0.5">
                        Mais vendido
                      </span>
                    )}
                    <span className={cn('h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center', sel ? 'border-cw-purple' : 'border-cw-border')}>
                      {sel && <span className="h-2 w-2 rounded-full bg-cw-purple" />}
                    </span>
                    <span className={cn('flex-1 text-sm font-bold', sel ? 'text-cw-text' : 'text-cw-muted')}>Plano {p}</span>
                    <span className={cn('text-sm font-bold shrink-0', sel ? 'text-[#5b21b6]' : 'text-cw-muted')}>{BRL(monthly)}/mês</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Módulos */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-1">2 · Módulos adicionais</p>
            <p className="text-[11px] text-cw-muted mb-3">Selecione os extras contratados.</p>
            <div className="space-y-1.5">
              {MODULES.map(m => {
                const checked = !!active.modules[m.id];
                return (
                  <button
                    key={m.id}
                    onClick={() => update({ modules: { ...active.modules, [m.id]: !checked } })}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all',
                      checked ? 'border-cw-purple bg-cw-purple/5' : 'border-cw-border hover:border-cw-purple/40',
                    )}
                  >
                    <span className={cn('h-4 w-4 rounded border-2 shrink-0 flex items-center justify-center', checked ? 'bg-cw-purple border-cw-purple' : 'border-cw-border')}>
                      {checked && <Check className="h-2.5 w-2.5 text-white" />}
                    </span>
                    <span className={cn('flex-1 text-sm font-semibold', checked ? 'text-cw-text' : 'text-cw-muted')}>{m.name}</span>
                    <span className={cn('text-sm font-bold shrink-0', checked ? 'text-[#5b21b6]' : 'text-cw-muted')}>+ {BRL(m.val)}/mês</span>
                  </button>
                );
              })}

              {SELF_MODULES.map(m => {
                const qty = active.selfModules[m.id] || 0;
                const checked = qty > 0;
                return (
                  <div key={m.id} className={cn('rounded-xl border transition-all', checked ? 'border-cw-purple bg-cw-purple/5' : 'border-cw-border')}>
                    <button
                      onClick={() => update({ selfModules: { ...active.selfModules, [m.id]: checked ? 0 : 1 } })}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    >
                      <span className={cn('h-4 w-4 rounded border-2 shrink-0 flex items-center justify-center', checked ? 'bg-cw-purple border-cw-purple' : 'border-cw-border')}>
                        {checked && <Check className="h-2.5 w-2.5 text-white" />}
                      </span>
                      <span className={cn('flex-1 text-sm font-semibold', checked ? 'text-cw-text' : 'text-cw-muted')}>{m.name}</span>
                      <span className={cn('text-sm font-bold shrink-0', checked ? 'text-[#5b21b6]' : 'text-cw-muted')}>+ {BRL(m.val)}/{m.unit}</span>
                    </button>
                    {checked && (
                      <div className="px-4 pb-3 flex items-center gap-3 border-t border-cw-purple/15 pt-2.5">
                        <span className="text-xs text-cw-muted flex-1">Quantidade</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => update({ selfModules: { ...active.selfModules, [m.id]: Math.max(1, qty - 1) } })}
                            className="h-7 w-7 rounded-lg border border-cw-border flex items-center justify-center hover:bg-cw-elevated">
                            <Minus className="h-3 w-3 text-cw-text" />
                          </button>
                          <span className="w-6 text-center text-sm font-black text-cw-text">{qty}</span>
                          <button onClick={() => update({ selfModules: { ...active.selfModules, [m.id]: qty + 1 } })}
                            className="h-7 w-7 rounded-xl gradient-primary flex items-center justify-center">
                            <Plus className="h-3 w-3 text-white" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-[#5b21b6] w-24 text-right">{BRL(m.val * qty)}/mês</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Validade */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-1">3 · Validade da proposta</p>
            <p className="text-[11px] text-cw-muted mb-3">Dias corridos a partir da emissão.</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={validadeDias}
                onChange={e => setValidadeDias(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-24 bg-cw-bg border border-cw-border rounded-lg px-3 py-2 text-sm font-bold text-cw-text focus:outline-none focus:border-cw-purple"
              />
              <span className="text-sm text-cw-muted">dias corridos</span>
            </div>
          </div>
        </div>

        {/* ── Proposta ── */}
        <div className="h-full flex flex-col gap-4 min-h-0">
         <div className="relative flex-1 min-h-0">
          {/* Cardapinho decorativo no canto — não interfere no layout (pointer-events-none).
              Solte o PNG do manual da marca em public/ com este nome pra ele aparecer. */}
          <img
            src="/cardapinho-calculadora.png"
            alt=""
            aria-hidden="true"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            className="pointer-events-none select-none absolute -bottom-3 -right-2 h-24 xl:h-28 object-contain z-10 drop-shadow"
          />
          <div className="cw-card p-6 h-full overflow-y-auto">
            {/* Cabeçalho */}
            <div className="flex items-start justify-between gap-4 border-b border-cw-border pb-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-cw-purple">Proposta comercial</p>
                <p className="text-sm font-bold text-cw-text mt-0.5">Cardápio Web — Sistema de Gestão para Restaurantes</p>
              </div>
              <p className="text-[11px] text-cw-muted whitespace-nowrap">{hoje}</p>
            </div>

            {/* Solução proposta */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mt-4 mb-2">Solução proposta</p>
            <div className="space-y-0">
              <div className="flex items-center justify-between py-2 border-b border-cw-border">
                <span className="text-sm text-cw-text">Plano {active.planType}</span>
                <span className="text-sm font-bold text-[#5b21b6]">{BRL(ac.planMonthly)}/mês</span>
              </div>
              {selectedModules.map(m => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-cw-border">
                  <span className="text-sm text-cw-text">{m.name}</span>
                  <span className="text-sm font-bold text-[#5b21b6]">{BRL(m.val)}/mês</span>
                </div>
              ))}
              {totemQty > 0 && (
                <div className="flex items-center justify-between py-2 border-b border-cw-border">
                  <span className="text-sm text-cw-text">Totem{totemQty > 1 ? ` (${totemQty}×)` : ''}</span>
                  <span className="text-sm font-bold text-[#5b21b6]">{BRL(99.99 * totemQty)}/mês</span>
                </div>
              )}
            </div>

            {/* Mensalidade total */}
            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted">Mensalidade total</p>
              <p className="text-3xl font-black text-[#5b21b6] leading-tight">
                {BRL(ac.monthly)}<span className="text-sm font-bold text-cw-muted"> /mês</span>
              </p>
              {ac.mult > 1 && (
                <p className="text-xs text-cw-muted">{ac.mult}x de <span className="font-bold text-cw-text">{BRL(ac.totalPeriodo)}</span></p>
              )}
            </div>

            {/* O que está incluso */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mt-5 mb-2">O que está incluso</p>
            <div className="space-y-1.5">
              {INCLUSO.map(t => (
                <div key={t} className="flex items-center gap-2 text-sm text-cw-text">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> {t}
                </div>
              ))}
            </div>

            {/* Funcionalidades do plano */}
            <div className="mt-5 rounded-xl gradient-primary px-4 py-2.5">
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <Check className="h-4 w-4" /> Funcionalidades incluídas — Plano {active.planType}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mt-3">
              {PLAN_FEATURES[active.planType].map(f => (
                <div key={f} className="flex items-start gap-2 text-[13px] text-cw-text">
                  <Check className="h-3.5 w-3.5 text-cw-purple shrink-0 mt-0.5" /> {f}
                </div>
              ))}
            </div>

            {/* Detalhe dos módulos */}
            {(selectedModules.length > 0 || totemQty > 0) && (
              <div className="mt-5 space-y-4">
                {[...selectedModules, ...(totemQty > 0 ? SELF_MODULES.filter(m => (active.selfModules[m.id] || 0) > 0) : [])].map(m => (
                  <div key={m.id}>
                    <p className="text-sm font-bold text-cw-text flex items-center gap-1.5">
                      <span className="text-cw-purple">+</span> {m.name}
                      <span className="text-[11px] font-normal text-cw-muted">{m.tag}</span>
                    </p>
                    <div className="mt-1 space-y-1 pl-4">
                      {m.bullets.map(b => (
                        <div key={b} className="flex items-start gap-2 text-[13px] text-cw-muted">
                          <Check className="h-3.5 w-3.5 text-cw-purple shrink-0 mt-0.5" /> {b}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Validade + disclaimer */}
            <div className="mt-5 rounded-xl bg-cw-elevated border border-cw-border px-3 py-2.5">
              <p className="text-xs text-cw-muted">
                Esta proposta tem validade de <span className="font-bold text-cw-text">{validadeDias} dias corridos</span> a partir da data de emissão.
              </p>
            </div>
            <p className="text-[10px] text-cw-muted leading-relaxed mt-3">
              Ao aceitar esta proposta, o Cliente declara estar ciente e de acordo com os Termos de Uso e a Política de Privacidade da Cardápio Web. A contratação implica na aceitação integral das condições gerais de uso da plataforma.
            </p>

            {/* Consolidado multi-loja */}
            {stores.length > 1 && (
              <div className="mt-6 pt-4 border-t border-cw-border">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-2">
                  Consolidado — {stores.length} lojas
                </p>
                <div className="space-y-1">
                  {calcs.map(({ s, c }) => (
                    <div key={s.id} className="flex items-center justify-between py-1.5 border-b border-dashed border-cw-border last:border-0">
                      <div>
                        <p className="font-bold text-sm text-cw-text">{s.name}</p>
                        <p className="text-[11px] text-cw-muted">{s.planType.toUpperCase()} · {s.period.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-[#5b21b6]">{BRL(c.monthly)}/mês</p>
                        {c.mult > 1 && <p className="text-[11px] text-cw-muted">período: {BRL(c.totalPeriodo)}</p>}
                      </div>
                    </div>
                  ))}
                  <div className="h-px bg-cw-border my-2" />
                  <div className="flex items-end justify-between">
                    <span className="font-bold text-cw-text">Total geral</span>
                    <span className="text-2xl font-black text-[#5b21b6]">{BRL(consolidated.monthly)}/mês</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-cw-muted">Total geral do período</span>
                    <span className="font-bold text-cw-text">{BRL(consolidated.totalPeriodo)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
         </div>

          {/* Copiar proposta */}
          <button
            onClick={copiarProposta}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all shrink-0',
              copied ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/40' : 'gradient-primary text-white',
            )}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Proposta copiada!' : 'Copiar proposta'}
          </button>
          <p className="text-[10px] text-cw-muted leading-relaxed text-center shrink-0">
            Gera um texto pronto pra colar no WhatsApp com todas as lojas e o total consolidado.
            Módulo Fiscal e Roteirização podem ter valores excedentes; consulte o CSM.
          </p>
        </div>
      </div>
    </div>
  );
}
