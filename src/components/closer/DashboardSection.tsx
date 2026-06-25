/** Dashboard de Closer — "Central de Operações". Visão geral que agrega as
 *  Metas pessoais (localStorage) e os contadores de Templates/Descontos. */
import { Link } from 'react-router-dom';
import { Target, TrendingUp, Activity, ArrowUpRight, FileText, Percent, Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCloserMetas } from '@/hooks/useCloserMetas';
import { useContentStore } from '@/store/contentStore';
import { useSidebarContext } from '@/context/SidebarContext';
import { SEED_TEMPLATES, type CloserTemplate } from '@/data/closerTemplates';
import { CLOSER_CUPONS } from '@/data/playbookCloser';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">{children}</p>;
}

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

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
  const { computed } = useCloserMetas();
  const { papel } = useSidebarContext();
  const prefix = (papel === 'SDR' || papel === 'Liderança') ? '' : papel.toLowerCase() + '.';
  const tplOverride = useContentStore(s => s.overrides[prefix + 'templates']) as CloserTemplate[] | undefined;

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
        <SectionTitle>Painel de Comando</SectionTitle>
        <h2 className="text-xl font-black text-cw-text">
          Central de <span className="text-cw-purple-light">Operações</span>
        </h2>
        <p className="text-sm text-cw-muted mt-1">Monitore suas metas, gerencie estratégias e feche negócios com precisão.</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Link to="/closer/templates" className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-cw-elevated border border-cw-border text-cw-text hover:bg-cw-surface">
            <FileText className="h-3.5 w-3.5 text-cw-purple" /> <span className="font-black">{numTemplates}</span> Templates
          </Link>
          <Link to="/closer/descontos" className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-cw-elevated border border-cw-border text-cw-text hover:bg-cw-surface">
            <Percent className="h-3.5 w-3.5 text-cw-purple" /> <span className="font-black">{numCupons}</span> Cupons
          </Link>
        </div>
      </div>

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
    </div>
  );
}
