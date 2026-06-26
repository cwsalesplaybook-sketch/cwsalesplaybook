/** Calculadora de Planos CW — multi-loja, descontos e proposta copiável.
 *  Portada da calculadora avançada (calculad0racw) para o visual do playbook. */
import { useMemo, useState } from 'react';
import { Plus, Minus, Copy, Check, Trash2, Percent, CopyPlus, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ----------------------------- Dados ----------------------------- */
type Period = 'Mensal' | 'Trimestral' | 'Semestral' | 'Anual';
type PlanType = 'Mesas' | 'Delivery' | 'Premium';

const PERIODOS: Period[] = ['Mensal', 'Trimestral', 'Semestral', 'Anual'];
const MULT: Record<Period, number> = { Mensal: 1, Trimestral: 3, Semestral: 6, Anual: 12 };
const PARTNER_DISCOUNT: Record<Period, number> = { Mensal: 15, Trimestral: 9, Semestral: 7, Anual: 5 };

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

const MODULES = [
  { id: 'marketplace', name: 'Integração Marketplaces', val: 29.99 },
  { id: 'estoque', name: 'Estoque Avançado', val: 29.99 },
  { id: 'roteirizacao', name: 'Roteirização de Entregas', val: 54.99 },
  { id: 'fiscal', name: 'Módulo Fiscal', val: 69.99 },
  { id: 'financeiro', name: 'Financeiro', val: 69.99 },
];

const SELF_MODULES = [
  { id: 'totem', name: 'Totem de Autoatendimento', val: 99.99, unit: 'dispositivo' },
];

const PLAN_OPTIONS: PlanType[] = ['Mesas', 'Delivery', 'Premium'];

const BRL = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* ----------------------------- Estado ---------------------------- */
interface StoreConfig {
  id: string;
  name: string;
  planType: PlanType;
  period: Period;
  modules: Record<string, boolean>;
  selfModules: Record<string, number>;
  customDiscount: number;
}

function newStore(name: string): StoreConfig {
  return {
    id: Math.random().toString(36).slice(2, 9),
    name,
    planType: 'Delivery',
    period: 'Mensal',
    modules: Object.fromEntries(MODULES.map(m => [m.id, false])),
    selfModules: Object.fromEntries(SELF_MODULES.map(m => [m.id, 0])),
    customDiscount: 0,
  };
}

function calcStore(s: StoreConfig) {
  const base = PLANOS[s.planType][s.period];
  const mult = MULT[s.period];
  const modulesMonthly = MODULES.filter(m => s.modules[m.id]).reduce((a, m) => a + m.val, 0);
  const selfMonthly = SELF_MODULES.reduce((a, m) => a + m.val * (s.selfModules[m.id] || 0), 0);
  const addonsMonthly = modulesMonthly + selfMonthly;
  const addonsTotal = addonsMonthly * mult;
  const custom = s.customDiscount || 0;
  const factor = 1 - custom / 100;
  const planTotal = base.t * factor;
  const planMonthlyEffective = s.period === 'Mensal' ? base.m * factor : planTotal / mult;
  // Economia vs. pagar o valor mensal cheio pelo mesmo nº de meses (só o plano).
  const economiaVsMensal = Math.max(0, PLANOS[s.planType].Mensal.m * mult - planTotal);
  return {
    base, mult, modulesMonthly, selfMonthly, addonsMonthly, addonsTotal,
    planTotal, planMonthlyEffective,
    total: planTotal + addonsTotal,
    monthly: planMonthlyEffective + addonsMonthly,
    custom, economiaVsMensal,
  };
}

type Calc = ReturnType<typeof calcStore>;

function buildProposta(calcs: { s: StoreConfig; c: Calc }[], consolidated: { total: number; monthly: number }) {
  const multi = calcs.length > 1;
  const out: string[] = ['*Proposta — Cardápio Web*', ''];
  for (const { s, c } of calcs) {
    if (multi) out.push(`🏪 *${s.name}* — Plano ${s.planType} · ${s.period}`);
    else out.push(`*Plano ${s.planType} · ${s.period}*`);
    const desc = c.custom;
    out.push(`• Plano: ${BRL(c.planTotal)}${desc > 0 ? ` (−${desc.toFixed(0)}% de desconto)` : ''}`);
    MODULES.filter(m => s.modules[m.id]).forEach(m => out.push(`• ${m.name}: ${BRL(m.val)}/mês`));
    SELF_MODULES.forEach(m => {
      const q = s.selfModules[m.id] || 0;
      if (q > 0) out.push(`• ${m.name} (${q}×): ${BRL(m.val * q)}/mês`);
    });
    out.push(`_Equivalente mensal: ${BRL(c.monthly)}/mês_`);
    out.push(`*Total do período: ${BRL(c.total)}*`);
    if (c.economiaVsMensal > 0.5) out.push(`💰 Economia vs. mês a mês: ${BRL(c.economiaVsMensal)}`);
    out.push('');
  }
  if (multi) {
    out.push(`*TOTAL GERAL: ${BRL(consolidated.total)}* (${BRL(consolidated.monthly)}/mês somado)`);
  }
  return out.join('\n').trim();
}

/* --------------------------- Componente -------------------------- */
export default function Calculadora() {
  const [stores, setStores] = useState<StoreConfig[]>([newStore('Loja 1')]);
  const [activeId, setActiveId] = useState(stores[0].id);
  const [showDiscounts, setShowDiscounts] = useState(false);
  const [copied, setCopied] = useState(false);

  const active = stores.find(s => s.id === activeId) ?? stores[0];

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
    (acc, { c }) => ({ total: acc.total + c.total, monthly: acc.monthly + c.monthly }),
    { total: 0, monthly: 0 },
  );
  const ac = calcStore(active);
  const temDesconto = active.customDiscount > 0;

  const copiarProposta = () => {
    const texto = buildProposta(calcs, consolidated);
    navigator.clipboard?.writeText(texto).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="p-8 space-y-4">
      {/* Barra de ações */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
          <button
            onClick={() => setShowDiscounts(v => !v)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-sm font-semibold transition-all',
              temDesconto
                ? 'border-emerald-500 text-emerald-600 bg-emerald-500/10'
                : 'border-cw-border text-cw-text hover:bg-cw-elevated',
            )}
          >
            {temDesconto && <Check className="h-3.5 w-3.5" />}
            <Percent className="h-3.5 w-3.5" /> Desconto {showDiscounts ? '▲' : '▼'}
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

      {/* Painel de desconto */}
      {showDiscounts && (
        <div className="cw-card p-4 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-cw-purple">Desconto — aplicado sobre o valor do plano</p>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-cw-text">Desconto no plano (%)</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number" min={0} max={100} value={active.customDiscount || ''}
                placeholder="0"
                onChange={e => update({ customDiscount: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                className="w-24 bg-cw-bg border border-cw-border rounded-lg px-2.5 py-2 text-sm text-center font-bold text-cw-text focus:outline-none focus:border-cw-purple"
              />
              <span className="text-sm font-bold text-cw-muted">%</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ── Configuração ── */}
        <div className="cw-card p-6 space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-2">Plano base</p>
            <select
              value={active.planType}
              onChange={e => update({ planType: e.target.value as PlanType })}
              className="w-full bg-cw-bg border border-cw-border rounded-xl px-4 py-2.5 text-sm font-semibold text-cw-text focus:outline-none focus:border-cw-purple cursor-pointer"
            >
              {PLAN_OPTIONS.map(p => <option key={p} value={p}>Plano {p}</option>)}
            </select>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-3">Periodicidade</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PERIODOS.map(p => {
                const d = PLANOS[active.planType][p];
                const sel = active.period === p;
                return (
                  <button
                    key={p}
                    onClick={() => update({ period: p })}
                    className={cn(
                      'rounded-xl border p-3 text-left transition-all',
                      sel ? 'border-cw-purple bg-cw-purple/5' : 'border-cw-border bg-cw-bg hover:border-cw-purple/40',
                    )}
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted">{p}</p>
                    <p className="text-base font-black text-[#5b21b6] mt-1.5">{BRL(d.t)}</p>
                    <p className="text-[11px] text-cw-muted">({BRL(d.m)}/mês)</p>
                    <p className="text-[10px] font-semibold text-emerald-600 mt-1">−{PARTNER_DISCOUNT[p]}% parceria</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-3">Módulos opcionais</p>
            <div className="space-y-1.5">
              {MODULES.map(m => {
                const checked = !!active.modules[m.id];
                const total = m.val * ac.mult;
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
                    <span className="text-right shrink-0">
                      <span className={cn('block text-sm font-bold', checked ? 'text-[#5b21b6]' : 'text-cw-muted')}>{BRL(total)}</span>
                      {ac.mult > 1 && <span className="block text-[11px] text-cw-muted">({BRL(m.val)}/mês)</span>}
                    </span>
                  </button>
                );
              })}

              {SELF_MODULES.map(m => {
                const qty = active.selfModules[m.id] || 0;
                const checked = qty > 0;
                const totalMonthly = m.val * qty;
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
                      <span className={cn('text-sm font-bold shrink-0', checked ? 'text-[#5b21b6]' : 'text-cw-muted')}>{BRL(m.val)}/{m.unit}</span>
                    </button>
                    {checked && (
                      <div className="px-4 pb-3 flex items-center gap-3 border-t border-cw-purple/15 pt-2.5">
                        <span className="text-xs text-cw-muted flex-1">Quantidade de {m.unit}s</span>
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
                        <span className="text-sm font-bold text-[#5b21b6] w-24 text-right">{BRL(totalMonthly)}/mês</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Resumo + consolidado ── */}
        <div className="space-y-4">
          <div className="cw-card p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-3">Resumo desta loja</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-cw-muted">Plano</span><span className="font-bold text-cw-text">{active.planType.toUpperCase()} · {active.period.toUpperCase()}</span></div>
              {temDesconto ? (
                <>
                  <div className="flex justify-between"><span className="text-cw-muted">Valor do plano</span><span className="font-semibold text-cw-muted line-through">{BRL(ac.base.t)}</span></div>
                  <div className="flex justify-between text-emerald-600"><span>Desconto −{ac.custom}% (sobre o plano)</span><span className="font-bold">−{BRL(ac.base.t - ac.planTotal)}</span></div>
                  <div className="flex justify-between"><span className="text-cw-muted">Plano com desconto</span><span className="font-bold text-cw-text">{BRL(ac.planTotal)}</span></div>
                </>
              ) : (
                <div className="flex justify-between"><span className="text-cw-muted">Valor do plano</span><span className="font-bold text-cw-text">{BRL(ac.planTotal)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-cw-muted">Módulos adicionais</span><span className="font-bold text-cw-text">{BRL(ac.modulesMonthly * ac.mult)}</span></div>
              <div className="flex justify-between"><span className="text-cw-muted">Autoatendimento</span><span className="font-bold text-cw-text">{BRL(ac.selfMonthly * ac.mult)}</span></div>
              <div className="h-px bg-cw-border my-2.5" />
              <div className="flex justify-between text-[15px]"><span className="text-cw-muted">Equivalente mensal</span><span className="font-bold text-cw-text">{BRL(ac.monthly)}/mês</span></div>
              <div className="flex items-end justify-between pt-1"><span className="font-bold text-cw-text">Total do período</span><span className="text-2xl font-black text-[#5b21b6]">{BRL(ac.total)}</span></div>
            </div>
            {ac.economiaVsMensal > 0.5 && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-2.5">
                <PiggyBank className="h-4 w-4 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-700 leading-snug">
                  No <span className="font-bold">{active.period.toLowerCase()}</span> você economiza{' '}
                  <span className="font-black">{BRL(ac.economiaVsMensal)}</span> vs. pagar mês a mês.
                </p>
              </div>
            )}
          </div>

          <div className="cw-card p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-3">
              Consolidado — {stores.length} {stores.length === 1 ? 'loja' : 'lojas'}
            </p>
            <div className="space-y-2">
              {calcs.map(({ s, c }) => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-dashed border-cw-border last:border-0">
                  <div>
                    <p className="font-bold text-sm text-cw-text">{s.name}</p>
                    <p className="text-[11px] text-cw-muted">
                      {s.planType.toUpperCase()} · {s.period.toUpperCase()}{c.custom > 0 && ` · −${c.custom}% desc`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-[#5b21b6]">{BRL(c.total)}</p>
                    <p className="text-[11px] text-cw-muted">{BRL(c.monthly)}/mês</p>
                  </div>
                </div>
              ))}
              <div className="h-px bg-cw-border my-2" />
              <div className="flex items-end justify-between"><span className="font-bold text-cw-text">Total geral</span><span className="text-2xl font-black text-[#5b21b6]">{BRL(consolidated.total)}</span></div>
              <div className="flex justify-between text-[13px]"><span className="text-cw-muted">Equivalente mensal somado</span><span className="font-bold text-cw-text">{BRL(consolidated.monthly)}/mês</span></div>
            </div>
          </div>

          {/* Copiar proposta */}
          <button
            onClick={copiarProposta}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all',
              copied ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/40' : 'gradient-primary text-white',
            )}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Proposta copiada!' : 'Copiar proposta para enviar'}
          </button>
          <p className="text-[10px] text-cw-muted leading-relaxed text-center">
            Gera um texto pronto pra colar no WhatsApp — sem precisar de print. * Módulo Fiscal e Roteirização podem ter valores excedentes; consulte o CSM.
          </p>
        </div>
      </div>
    </div>
  );
}
