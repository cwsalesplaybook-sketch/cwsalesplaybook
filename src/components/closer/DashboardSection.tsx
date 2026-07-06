/** Dashboard de Closer — "Central de Operações". Visão geral que agrega as
 *  Metas pessoais (localStorage) e os contadores de Templates/Descontos. */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, TrendingUp, Activity, ArrowUpRight, FileText, Percent, Zap, ChevronRight, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCloserMetas } from '@/hooks/useCloserMetas';
import { useContentStore } from '@/store/contentStore';
import { useSidebarContext } from '@/context/SidebarContext';
import { SEED_TEMPLATES, type CloserTemplate } from '@/data/closerTemplates';
import { CLOSER_CUPONS } from '@/data/playbookCloser';
import { ModulosSection } from '@/components/closer/ModuloCard';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">{children}</p>;
}

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

function num(v: string): number {
  const n = Number(v.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function ConfigMetaModal({ meta1, meta2, meta3, jaFechado, diasUteis, onSave, onClose }: {
  meta1: number; meta2: number; meta3: number; jaFechado: number; diasUteis: number | null;
  onSave: (v: { meta1: number; meta2: number; meta3: number; jaFechado: number; diasUteis: number | null }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ meta1, meta2, meta3, jaFechado });
  const [diasInput, setDiasInput] = useState(diasUteis != null ? String(diasUteis) : '');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-cw-text">Configurar Metas do Mês</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4">
          {([1, 2, 3] as const).map(n => (
            <div key={n}>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Meta {n} (R$)</label>
              <input
                type="number" min={0}
                value={(form as any)[`meta${n}`]}
                onChange={e => setForm(f => ({ ...f, [`meta${n}`]: Number(e.target.value) }))}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple"
                placeholder="0"
              />
            </div>
          ))}
          <div className="border-t border-cw-border pt-4">
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Já Fechado (R$)</label>
            <input
              type="number" min={0}
              value={form.jaFechado}
              onChange={e => setForm(f => ({ ...f, jaFechado: Number(e.target.value) }))}
              className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Dias Úteis Restantes</label>
            <input
              type="text" inputMode="numeric"
              value={diasInput}
              onChange={e => setDiasInput(e.target.value)}
              placeholder="Automático"
              className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple"
            />
            <span className="text-[10px] text-cw-muted">Deixe vazio para cálculo automático</span>
          </div>
        </div>
        <button
          onClick={() => {
            const dias = diasInput.trim();
            onSave({ ...form, diasUteis: dias === '' ? null : Math.max(1, num(dias)) });
          }}
          className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white gradient-primary transition-opacity hover:opacity-90"
        >
          Salvar metas
        </button>
      </div>
    </div>
  );
}

function KpiCard({ label, value, hint, hintClass, icon: Icon }: {
  label: string; value: string; hint?: string; hintClass?: string;
  icon: typeof Target;
}) {
  return (
    <div className="cw-card p-4">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold text-cw-muted uppercase tracking-widest">{label}</p>
        <div className="h-8 w-8 rounded-lg bg-cw-purple/15 border border-cw-purple/30 flex items-center justify-center">
          <Icon className="h-4 w-4 text-cw-purple" />
        </div>
      </div>
      <p className="text-2xl font-black text-cw-text mt-2">{value}</p>
      {hint && <p className={cn('text-xs mt-0.5', hintClass ?? 'text-cw-muted')}>{hint}</p>}
    </div>
  );
}

export function DashboardSection() {
  const { computed, state, update, addModulo, updateModulo, removeModulo } = useCloserMetas();
  const { papel } = useSidebarContext();
  const prefix = (papel === 'SDR' || papel === 'Liderança') ? '' : papel.toLowerCase() + '.';
  const tplOverride = useContentStore(s => s.overrides[prefix + 'templates']) as CloserTemplate[] | undefined;
  const [configOpen, setConfigOpen] = useState(false);

  const numTemplates = Array.isArray(tplOverride) ? tplOverride.length : SEED_TEMPLATES.length;
  const numCupons = CLOSER_CUPONS.reduce((acc, g) => acc + g.linhas.length, 0);

  const meta3 = computed.metas[2];
  const metaDiaria = computed.metas.find(m => !m.batida)?.porDia ?? 0;
  const pctMeta3 = meta3.valor > 0 ? (computed.jaFechado / meta3.valor) * 100 : 0;

  const acoes = [
    { to: '/closer/descontos', label: 'Pegar Cupom', icon: Percent },
    { to: '/closer/templates', label: 'Copiar Template', icon: FileText },
    { to: '/closer/metas', label: 'Atualizar Meta', icon: Target },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="cw-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <SectionTitle>Painel de Comando</SectionTitle>
            <h2 className="text-xl font-black text-cw-text">
              Metas do <span className="text-cw-purple-light">Mês</span>
            </h2>
            <p className="text-sm text-cw-muted mt-1">Monitore suas metas, gerencie estratégias e feche negócios com precisão.</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={() => setConfigOpen(true)} title="Configurar metas"
              className="h-7 w-7 rounded-lg bg-cw-elevated border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-all">
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Link to="/closer/templates" className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-cw-elevated border border-cw-border text-cw-text hover:bg-cw-surface">
            <FileText className="h-3.5 w-3.5 text-cw-purple" /> <span className="font-black">{numTemplates}</span> Templates
          </Link>
          <Link to="/closer/descontos" className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-cw-elevated border border-cw-border text-cw-text hover:bg-cw-surface">
            <Percent className="h-3.5 w-3.5 text-cw-purple" /> <span className="font-black">{numCupons}</span> Cupons
          </Link>
        </div>
      </div>

      {configOpen && (
        <ConfigMetaModal
          meta1={state.meta1} meta2={state.meta2} meta3={state.meta3}
          jaFechado={state.jaFechado} diasUteis={state.diasUteis}
          onSave={(v) => { update(v); setConfigOpen(false); }}
          onClose={() => setConfigOpen(false)}
        />
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={Target} label="Meta Diária" value={brl(metaDiaria)} hint={`${computed.diasRestantes} dias úteis restantes`} />
        <KpiCard icon={TrendingUp} label="Já Fechado" value={brl(computed.jaFechado)}
          hint={`${pctMeta3.toFixed(0)}% da Meta 3`} hintClass={pctMeta3 >= 100 ? 'text-emerald-400 font-semibold' : 'text-cw-muted'} />
        <KpiCard icon={Activity} label="Projeção do Mês" value={brl(computed.projecao)}
          hint={computed.projecao >= meta3.valor ? 'Acima da meta' : 'Abaixo da meta'}
          hintClass={computed.projecao >= meta3.valor ? 'text-emerald-400 font-semibold' : 'text-cw-yellow'} />
        <KpiCard icon={ArrowUpRight} label="Performance" value={`${computed.performance.toFixed(1)}%`} hint={`Meta 3: ${brl(meta3.valor)}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3">
        {/* Progresso das metas */}
        <div className="cw-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-cw-purple" />
            <p className="font-bold text-sm text-cw-text">Progresso das Metas</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {computed.metas.map((m, i) => {
              const cor = i === 0 ? 'text-cw-purple-light' : i === 1 ? 'text-emerald-400' : 'text-cw-yellow';
              const bar = i === 0 ? 'bg-cw-purple' : i === 1 ? 'bg-emerald-400' : 'bg-cw-yellow';
              return (
                <div key={i} className="bg-cw-elevated border border-cw-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-cw-text">Meta {i + 1}</p>
                    <p className={cn('text-sm font-black', cor)}>{m.progresso.toFixed(0)}%</p>
                  </div>
                  <div className="h-1.5 rounded-full bg-cw-surface overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', bar)} style={{ width: `${Math.min(100, m.progresso)}%` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><p className="text-cw-muted">Meta</p><p className="text-cw-text font-semibold">{brl(m.valor)}</p></div>
                    <div><p className="text-cw-muted">Falta</p><p className="text-cw-text font-semibold">{brl(m.falta)}</p></div>
                  </div>
                  <p className="text-xs text-cw-muted">Por dia: <span className="text-cw-text font-semibold">{m.batida ? '—' : brl(m.porDia)}</span></p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="cw-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-cw-purple" />
            <p className="font-bold text-sm text-cw-text">Ações Rápidas</p>
          </div>
          <div className="space-y-2">
            {acoes.map(a => (
              <Link key={a.to} to={a.to}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-cw-elevated border border-cw-border text-cw-text hover:bg-cw-surface transition-colors">
                <a.icon className="h-4 w-4 text-cw-purple shrink-0" />
                <span className="flex-1 text-sm font-medium">{a.label}</span>
                <ChevronRight className="h-4 w-4 text-cw-muted" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Módulos */}
      <ModulosSection modulos={state.modulos} onAdd={addModulo} onUpdate={updateModulo} onRemove={removeModulo} />
    </div>
  );
}
