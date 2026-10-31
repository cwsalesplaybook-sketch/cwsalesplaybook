/** Dashboard de Closer — "Metas do Mês" (Meu Desempenho). Visão geral das
 *  Metas pessoais (localStorage), módulos vendidos e atalhos de Templates/Descontos. */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Target, FileText, Percent, Zap, ChevronRight, Settings, X, Rocket, Plus, CircleDollarSign,
  BarChart3, PieChart, TrendingUp, TrendingDown, ArrowRight, CheckCircle2, Package, Bell, PartyPopper,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCloserMetas, type MetaCalculo } from '@/hooks/useCloserMetas';
import { Confetti } from '@/components/Confetti';

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

function num(v: string): number {
  const n = Number(v.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

const INPUT = 'w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple';

interface MetasForm {
  meta1: number; meta2: number; meta3: number;
  mega1: number; mega2: number; mega3: number;
  moduloMeta1: number; moduloMeta2: number; moduloMeta3: number;
  jaFechado: number; moduloConquistado: number;
}

function Modal({ titulo, onClose, children }: { titulo: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-cw-text">{titulo}</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text transition-colors"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Campo({ label, value, onChange, cor = 'text-cw-purple', unidade = 'R$' }: {
  label: string; value: number; onChange: (v: number) => void; cor?: string; unidade?: string;
}) {
  return (
    <div>
      <label className={cn('text-xs font-bold uppercase tracking-wider mb-1.5 block', cor)}>{label} ({unidade})</label>
      <input type="number" min={0} value={value || ''} placeholder="0"
        onChange={e => onChange(Number(e.target.value))} className={INPUT} />
    </div>
  );
}

function EditarMetasModal({ initial, diasUteis, onSave, onClose }: {
  initial: MetasForm; diasUteis: number | null;
  onSave: (v: MetasForm & { diasUteis: number | null }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<MetasForm>(initial);
  const [diasInput, setDiasInput] = useState(diasUteis != null ? String(diasUteis) : '');
  const set = (k: keyof MetasForm) => (v: number) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal titulo="Editar metas" onClose={onClose}>
      <div className="space-y-4">
        <Campo label="Meta 1" value={form.meta1} onChange={set('meta1')} />
        <Campo label="Meta 2" value={form.meta2} onChange={set('meta2')} />
        <Campo label="Meta 3" value={form.meta3} onChange={set('meta3')} />

        <div className="border-t border-cw-border pt-4 space-y-4">
          <p className="flex items-center gap-1.5 text-[10px] font-black text-cw-purple uppercase tracking-widest">
            <Package className="h-3.5 w-3.5" /> Módulos vendidos
          </p>
          <Campo label="Meta 1 Módulos" unidade="un" value={form.moduloMeta1} onChange={set('moduloMeta1')} />
          <Campo label="Meta 2 Módulos" unidade="un" value={form.moduloMeta2} onChange={set('moduloMeta2')} />
          <Campo label="Meta 3 Módulos" unidade="un" value={form.moduloMeta3} onChange={set('moduloMeta3')} />
        </div>

        <div className="border-t border-cw-border pt-4 space-y-4">
          <p className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-widest">
            <Rocket className="h-3.5 w-3.5" /> Mega Metas (stretch)
          </p>
          <Campo label="Mega Meta 1" cor="text-amber-500" value={form.mega1} onChange={set('mega1')} />
          <Campo label="Mega Meta 2" cor="text-amber-500" value={form.mega2} onChange={set('mega2')} />
          <Campo label="Mega Meta 3" cor="text-amber-500" value={form.mega3} onChange={set('mega3')} />
        </div>

        <div className="border-t border-cw-border pt-4 space-y-4">
          <Campo label="Já fechado" value={form.jaFechado} onChange={set('jaFechado')} />
          <Campo label="Módulos já vendidos" unidade="un" value={form.moduloConquistado} onChange={set('moduloConquistado')} />
          <div>
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Dias úteis restantes</label>
            <input type="text" inputMode="numeric" value={diasInput} onChange={e => setDiasInput(e.target.value)}
              placeholder="Automático" className={INPUT} />
            <span className="text-[10px] text-cw-muted">Deixe vazio para cálculo automático</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          const dias = diasInput.trim();
          onSave({ ...form, diasUteis: dias === '' ? null : Math.max(1, num(dias)) });
        }}
        className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white bg-cw-purple transition-opacity hover:opacity-90"
      >
        Salvar metas
      </button>
    </Modal>
  );
}

function RegistrarVendaModal({ onSave, onClose }: { onSave: (valor: number, modulos: number) => void; onClose: () => void }) {
  const [valor, setValor] = useState(0);
  const [modulos, setModulos] = useState(0);
  return (
    <Modal titulo="Registrar venda" onClose={onClose}>
      <div className="space-y-4">
        <Campo label="Valor da venda" value={valor} onChange={setValor} />
        <Campo label="Módulos vendidos" unidade="un" value={modulos} onChange={setModulos} />
        <p className="text-[11px] text-cw-muted">O valor é somado ao fechado do mês.</p>
      </div>
      <button
        onClick={() => onSave(valor, modulos)}
        disabled={valor <= 0 && modulos <= 0}
        className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white bg-cw-purple transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Registrar
      </button>
    </Modal>
  );
}

function KpiCard({ icon: Icon, label, value, valueClass, children }: {
  icon: typeof Target; label: string; value: string; valueClass?: string; children?: React.ReactNode;
}) {
  return (
    <div className="cw-card px-4 py-3 flex items-start gap-3">
      <div className="h-10 w-10 rounded-full bg-cw-purple/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-cw-purple" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-cw-muted">{label}</p>
        <p className={cn('text-xl font-black', valueClass ?? 'text-cw-text')}>{value}</p>
        <div className="text-xs text-cw-muted mt-0.5">{children}</div>
      </div>
    </div>
  );
}

function ConcluidaBadge({ small }: { small?: boolean }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full bg-white border border-emerald-300 text-emerald-700 font-semibold',
      small ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
    )}>
      <CheckCircle2 className={cn('fill-emerald-500 text-white', small ? 'h-3.5 w-3.5' : 'h-4 w-4')} /> Concluída
    </span>
  );
}

function VerDetalhes() {
  return (
    <Link to="/closer/metas" className="flex items-center gap-1 text-xs font-semibold text-cw-purple hover:underline">
      Ver detalhes <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

/** Cor da barra por meta: 1 e 2 roxo cheio, 3 roxo claro; concluída = verde. */
const barCor = (i: number) => (i === 2 ? 'bg-cw-purple/50' : 'bg-cw-purple');

function MetaCard({ i, m, jaFechado }: { i: number; m: MetaCalculo; jaFechado: number }) {
  return (
    <div className={cn('rounded-xl border p-3', m.batida ? 'bg-emerald-50 border-emerald-200' : 'bg-cw-elevated border-cw-border')}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-cw-text">Meta {i + 1}</p>
          <p className="text-lg font-black text-cw-text">{brl(m.valor)}</p>
        </div>
        {m.batida ? <ConcluidaBadge small /> : <p className="text-sm font-bold text-cw-purple mt-5">{m.progresso.toFixed(0)}%</p>}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="h-2 flex-1 rounded-full bg-cw-border/60 overflow-hidden">
          <div className={cn('h-full rounded-full transition-all', m.batida ? 'bg-emerald-500' : barCor(i))}
            style={{ width: `${Math.min(100, m.progresso)}%` }} />
        </div>
        {m.batida && <p className="text-xs font-bold text-emerald-600">100%</p>}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mt-2">
        <div><p className="text-cw-muted">Valor fechado</p><p className="text-cw-text font-bold">{brl(jaFechado)}</p></div>
        {m.batida
          ? <div><p className="text-cw-muted">Meta</p><p className="text-cw-text font-bold">{brl(m.valor)}</p></div>
          : <div><p className="text-cw-muted">Faltam</p><p className="text-cw-text font-bold">{brl(m.falta)}</p></div>}
      </div>
    </div>
  );
}

function ModuloMetaCard({ i, m, conquistado }: { i: number; m: MetaCalculo; conquistado: number }) {
  return (
    <div className="cw-card px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-cw-text">Meta {i + 1}</p>
          <p className="text-base font-black text-cw-text">{Math.min(conquistado, m.valor || conquistado)} / {m.valor}</p>
        </div>
        {m.batida ? <ConcluidaBadge small /> : <p className="text-xs font-bold text-cw-purple mt-5">{m.progresso.toFixed(0)}%</p>}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="h-2 flex-1 rounded-full bg-cw-border/60 overflow-hidden">
          <div className={cn('h-full rounded-full transition-all', m.batida ? 'bg-emerald-500' : barCor(i))}
            style={{ width: `${Math.min(100, m.progresso)}%` }} />
        </div>
        {m.batida && <p className="text-xs font-bold text-emerald-600">100%</p>}
      </div>
    </div>
  );
}

export function DashboardSection() {
  const { computed, state, update, registrarVenda } = useCloserMetas();
  const [editarOpen, setEditarOpen] = useState(false);
  const [vendaOpen, setVendaOpen] = useState(false);
  const [festa, setFesta] = useState(false);

  // Meta principal = a próxima meta ainda não batida; se todas foram batidas, a maior.
  const definidas = computed.metas.filter(m => m.valor > 0);
  const principal = definidas.find(m => !m.batida) ?? definidas[definidas.length - 1];
  const todasBatidas = definidas.length > 0 && definidas.every(m => m.batida);
  const alcancada = principal ? Math.min(100, principal.progresso) : 0;
  const algumaBatida = definidas.some(m => m.batida);
  const temMega = state.mega1 > 0 || state.mega2 > 0 || state.mega3 > 0;

  const ant = computed.fechadoMesAnterior;
  const variacao = ant && ant > 0 ? ((computed.jaFechado - ant) / ant) * 100 : null;

  const subtitulo = !principal
    ? 'Defina suas metas para acompanhar seu desempenho.'
    : todasBatidas
      ? 'Todas as metas batidas! Hora de mirar nas mega metas. 🚀'
      : `Faltam ${brl(principal.falta)} para alcançar sua meta principal.`;

  const acoes: Array<{ label: string; icon: typeof Target } & ({ to: string } | { onClick: () => void })> = [
    { to: '/closer/descontos', label: 'Pegar cupom', icon: Percent },
    { to: '/closer/templates', label: 'Copiar template', icon: FileText },
    { onClick: () => setEditarOpen(true), label: 'Atualizar meta', icon: Target },
  ];

  return (
    <div className="space-y-3">
      <Confetti active={festa} />

      {/* Meu desempenho */}
      <div className="cw-card relative overflow-visible px-6 py-4 md:pr-48">
        <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest">Meu desempenho</p>
        <h2 className="text-xl font-black text-cw-text mt-1">Seu próximo fechamento faz a diferença.</h2>
        <p className="text-sm text-cw-muted mt-1">{subtitulo}</p>
        <div className="flex flex-wrap gap-3 mt-3">
          <button onClick={() => setVendaOpen(true)}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-cw-purple px-5 py-2 rounded-xl hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" /> Registrar venda
          </button>
          <button onClick={() => setEditarOpen(true)}
            className="flex items-center gap-2 text-sm font-semibold text-cw-text bg-white border border-cw-purple/30 px-5 py-2 rounded-xl hover:bg-cw-purple/5 transition-colors">
            <Settings className="h-4 w-4 text-cw-purple" /> Editar metas
          </button>
        </div>
        <img src="/cardapinho-viking-metas.webp" alt="Cardapinho viking"
          className="hidden md:block absolute right-6 bottom-0 h-[135px] w-auto object-contain pointer-events-none select-none" />
      </div>

      {editarOpen && (
        <EditarMetasModal
          initial={{
            meta1: state.meta1, meta2: state.meta2, meta3: state.meta3,
            mega1: state.mega1, mega2: state.mega2, mega3: state.mega3,
            moduloMeta1: state.moduloMeta1, moduloMeta2: state.moduloMeta2, moduloMeta3: state.moduloMeta3,
            jaFechado: state.jaFechado, moduloConquistado: state.moduloConquistado,
          }}
          diasUteis={state.diasUteis}
          onSave={(v) => { update(v); setEditarOpen(false); }}
          onClose={() => setEditarOpen(false)}
        />
      )}
      {vendaOpen && (
        <RegistrarVendaModal
          onSave={(valor, modulos) => { registrarVenda(valor, modulos); setVendaOpen(false); }}
          onClose={() => setVendaOpen(false)}
        />
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={CircleDollarSign} label="Fechado no mês" value={brl(computed.jaFechado)}>
          {variacao == null ? (
            <span>Acumulado de {computed.mesLabel.toLowerCase()}</span>
          ) : (
            <span className={cn('flex items-center gap-1', variacao >= 0 ? 'text-emerald-600' : 'text-red-500')}>
              {variacao >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              <span className="font-semibold">{variacao >= 0 ? '+' : ''}{variacao.toFixed(0)}%</span>
              <span className="text-cw-muted">em relação ao mês anterior</span>
            </span>
          )}
        </KpiCard>
        <KpiCard icon={Target} label="Meta do mês" value={brl(principal?.valor ?? 0)}>Meta principal</KpiCard>
        <KpiCard icon={BarChart3} label="Falta para a meta" value={brl(principal?.falta ?? 0)}>Para alcançar sua meta</KpiCard>
        <KpiCard icon={PieChart} label="Meta alcançada" value={`${alcancada.toFixed(0)}%`} valueClass="text-emerald-600">
          {brl(computed.jaFechado).replace('R$', '').trim()} de {brl(principal?.valor ?? 0).replace('R$', '').trim()}
        </KpiCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3">
        {/* Progresso das metas */}
        <div className="cw-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-cw-purple" />
              <p className="font-bold text-sm text-cw-text">Progresso das metas</p>
            </div>
            <VerDetalhes />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {computed.metas.map((m, i) => <MetaCard key={i} i={i} m={m} jaFechado={computed.jaFechado} />)}
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="cw-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-cw-purple" />
            <p className="font-bold text-sm text-cw-text">Ações rápidas</p>
          </div>
          <div className="space-y-2">
            {acoes.map(a => 'to' in a ? (
              <Link key={a.label} to={a.to}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white border border-cw-border text-cw-text hover:bg-cw-elevated transition-colors">
                <a.icon className="h-4 w-4 text-cw-purple shrink-0" />
                <span className="flex-1 text-sm font-medium">{a.label}</span>
                <ChevronRight className="h-4 w-4 text-cw-muted" />
              </Link>
            ) : (
              <button key={a.label} onClick={a.onClick}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white border border-cw-border text-cw-text hover:bg-cw-elevated transition-colors w-full text-left">
                <a.icon className="h-4 w-4 text-cw-purple shrink-0" />
                <span className="flex-1 text-sm font-medium">{a.label}</span>
                <ChevronRight className="h-4 w-4 text-cw-muted" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Módulos vendidos */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-cw-purple" />
            <p className="font-bold text-sm text-cw-text">Módulos vendidos</p>
          </div>
          <VerDetalhes />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {computed.moduloMetas.map((m, i) => <ModuloMetaCard key={i} i={i} m={m} conquistado={state.moduloConquistado} />)}
        </div>
      </div>

      {/* Mega Metas (só aparece se alguma mega meta foi definida) */}
      {temMega && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Rocket className="h-4 w-4 text-amber-500" />
            <p className="font-bold text-sm text-cw-text">Mega metas</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {computed.megaMetas.map((m, i) => (
              <div key={i} className={cn('rounded-xl border px-4 py-3', m.batida ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-amber-300/60')}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-cw-text">Mega Meta {i + 1} 🚀</p>
                    <p className="text-base font-black text-cw-text">{brl(m.valor)}</p>
                  </div>
                  {m.batida ? <ConcluidaBadge small /> : <p className="text-xs font-bold text-amber-500 mt-5">{m.progresso.toFixed(0)}%</p>}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-2 flex-1 rounded-full bg-cw-border/60 overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', m.batida ? 'bg-emerald-500' : 'bg-amber-400')}
                      style={{ width: `${Math.min(100, m.progresso)}%` }} />
                  </div>
                  <p className={cn('text-xs font-bold', m.batida ? 'text-emerald-600' : 'text-cw-muted')}>
                    {m.batida ? '100%' : `Faltam ${brl(m.falta)}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comemoração */}
      <div className="cw-card px-4 py-3 flex items-center gap-3">
        <Bell className="h-4 w-4 text-cw-purple shrink-0" />
        <p className="flex-1 text-sm text-cw-text">Quando a meta chegar, a comemoração é sua.</p>
        <button
          onClick={() => { setFesta(false); requestAnimationFrame(() => setFesta(true)); }}
          disabled={!algumaBatida}
          className="flex items-center gap-2 text-xs font-semibold px-5 py-2 rounded-xl bg-cw-purple text-white hover:opacity-90 transition-opacity disabled:bg-cw-elevated disabled:text-cw-muted disabled:cursor-not-allowed"
        >
          <PartyPopper className="h-4 w-4" /> Comemorar meta
        </button>
      </div>
    </div>
  );
}
