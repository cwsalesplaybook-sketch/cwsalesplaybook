/** Metas — tracker pessoal de metas do mês (localStorage por closer). */
import { useState } from 'react';
import { Target, Calendar, TrendingUp, Plus, Trash2, Package, Settings2, Check, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCloserMetas, type MetaModulo } from '@/hooks/useCloserMetas';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">{children}</p>;
}

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

function num(v: string): number {
  const n = Number(v.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function KpiCard({ label, value, hint, hintClass }: { label: string; value: string; hint?: string; hintClass?: string }) {
  return (
    <div className="cw-card p-4">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold text-cw-muted uppercase tracking-widest">{label}</p>
        <div className="h-8 w-8 rounded-lg bg-cw-purple/15 border border-cw-purple/30 flex items-center justify-center">
          <Target className="h-4 w-4 text-cw-purple" />
        </div>
      </div>
      <p className="text-2xl font-black text-cw-text mt-2">{value}</p>
      {hint && <p className={cn('text-xs mt-0.5', hintClass ?? 'text-cw-muted')}>{hint}</p>}
    </div>
  );
}

function ProgressoCard({ idx, alvo, progresso, falta, porDia, batida, label }:
  { idx: number; alvo: number; progresso: number; falta: number; porDia: number; batida: boolean; label?: string }) {
  const cor = idx === 0 ? 'text-cw-purple-light' : idx === 1 ? 'text-emerald-400' : 'text-cw-yellow';
  return (
    <div className="cw-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-bold text-sm text-cw-text">{label ?? `Meta ${idx + 1}`}</p>
        <p className={cn('text-sm font-black', cor)}>{progresso.toFixed(0)}%</p>
      </div>
      <div className="h-1.5 rounded-full bg-cw-elevated overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', idx === 0 ? 'bg-cw-purple' : idx === 1 ? 'bg-emerald-400' : 'bg-cw-yellow')}
          style={{ width: `${Math.min(100, progresso)}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-cw-muted">Meta</p>
          <p className="text-cw-text font-semibold">{brl(alvo)}</p>
        </div>
        <div>
          <p className="text-cw-muted">Falta</p>
          <p className="text-cw-text font-semibold">{brl(falta)}</p>
        </div>
      </div>
      <div className="border-t border-cw-border pt-2">
        <p className="text-cw-muted text-xs">Por dia</p>
        <p className={cn('font-black', batida ? 'text-emerald-400' : 'text-cw-text')}>
          {batida ? 'Meta batida! 🎉' : `${brl(porDia)}/dia`}
        </p>
      </div>
    </div>
  );
}

function ModuloRow({ m, onUpdate, onRemove }:
  { m: MetaModulo; onUpdate: (patch: Partial<MetaModulo>) => void; onRemove: () => void }) {
  const pct = m.meta > 0 ? Math.min(100, (m.conquistado / m.meta) * 100) : 0;
  return (
    <div className="cw-card p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-bold text-sm text-cw-text truncate">{m.nome}</p>
        <button onClick={onRemove} className="text-cw-muted hover:text-red-400 transition-colors shrink-0">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="h-1.5 rounded-full bg-cw-elevated overflow-hidden">
        <div className="h-full rounded-full bg-cw-purple transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-cw-muted">
          <span className="text-cw-text font-semibold">{m.conquistado}</span> / {m.meta} unidades
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdate({ conquistado: Math.max(0, m.conquistado - 1) })}
            className="h-6 w-6 rounded-lg bg-cw-elevated border border-cw-border text-cw-text hover:bg-cw-surface"
          >−</button>
          <button
            onClick={() => onUpdate({ conquistado: m.conquistado + 1 })}
            className="h-6 w-6 rounded-lg bg-cw-purple/15 border border-cw-purple/30 text-cw-purple-light hover:bg-cw-purple/25"
          >+</button>
        </div>
      </div>
    </div>
  );
}

export function MetasSection() {
  const { state, computed, update, setJaFechado, addModulo, updateModulo, removeModulo } = useCloserMetas();
  const [editMetas, setEditMetas] = useState(false);
  const [fechadoInput, setFechadoInput] = useState('');

  // Form de novo módulo
  const [novoNome, setNovoNome] = useState('');
  const [novaMeta, setNovaMeta] = useState('');
  const [novoConq, setNovoConq] = useState('');

  const handleAddModulo = () => {
    if (!novoNome.trim() || num(novaMeta) <= 0) return;
    addModulo({ nome: novoNome.trim(), meta: num(novaMeta), conquistado: num(novoConq) });
    setNovoNome(''); setNovaMeta(''); setNovoConq('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="cw-card p-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionTitle>Controle de Metas</SectionTitle>
          <h2 className="text-xl font-black text-cw-text">
            Metas de <span className="text-cw-purple-light">{computed.mesLabel}</span>
          </h2>
          <p className="text-sm text-cw-muted mt-1">Acompanhe seu progresso e saiba exatamente quanto precisa fechar.</p>
        </div>
        <button
          onClick={() => setEditMetas(v => !v)}
          className={cn(
            'flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border transition-colors shrink-0',
            editMetas ? 'gradient-primary text-white border-transparent' : 'bg-cw-surface text-cw-text border-cw-border hover:bg-cw-elevated',
          )}
        >
          <Settings2 className="h-3.5 w-3.5" /> {editMetas ? 'Fechar' : 'Definir Metas'}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="cw-card p-4">
          <div className="flex items-start justify-between">
            <p className="text-[10px] font-bold text-cw-muted uppercase tracking-widest">Dias úteis restantes</p>
            <div className="h-8 w-8 rounded-lg bg-cw-purple/15 border border-cw-purple/30 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-cw-purple" />
            </div>
          </div>
          <p className="text-2xl font-black text-cw-text mt-2">{computed.diasRestantes}</p>
          <p className="text-xs text-cw-muted mt-0.5">{state.diasUteis != null ? 'Definido manualmente' : 'Cálculo automático'}</p>
        </div>
        {computed.metas.map((m, i) => (
          <KpiCard
            key={i}
            label={`Meta diária p/ Meta ${i + 1}`}
            value={brl(m.porDia)}
            hint={m.batida ? 'Meta batida!' : `${m.progresso.toFixed(0)}% concluído`}
            hintClass={m.batida ? 'text-emerald-400 font-semibold' : 'text-cw-muted'}
          />
        ))}
      </div>

      {/* Configurar metas */}
      {editMetas && (
        <div className="cw-card p-5 space-y-4">
          <SectionTitle>Configurar Metas</SectionTitle>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {([
              ['Meta 1 (R$)', state.meta1, (v: number) => update({ meta1: v }), '10000'],
              ['Meta 2 (R$)', state.meta2, (v: number) => update({ meta2: v }), '15000'],
              ['Meta 3 (R$)', state.meta3, (v: number) => update({ meta3: v }), '20000'],
              ['Já Fechado (R$)', state.jaFechado, (v: number) => update({ jaFechado: v }), '5000'],
            ] as const).map(([label, val, setter, ph]) => (
              <label key={label} className="block">
                <span className="text-xs font-medium text-cw-muted">{label}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  defaultValue={val || ''}
                  placeholder={ph}
                  onChange={e => setter(num(e.target.value))}
                  className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50"
                />
              </label>
            ))}
            <label className="block">
              <span className="text-xs font-medium text-cw-muted">Dias Úteis</span>
              <input
                type="text"
                inputMode="numeric"
                defaultValue={state.diasUteis ?? ''}
                placeholder={`${computed.diasRestantes} (auto)`}
                onChange={e => {
                  const v = e.target.value.trim();
                  update({ diasUteis: v === '' ? null : Math.max(1, num(v)) });
                }}
                className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50"
              />
              <span className="text-[10px] text-cw-muted">Deixe vazio para cálculo automático</span>
            </label>
          </div>

          <div className="border-t border-cw-border pt-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Rocket className="h-3.5 w-3.5 text-cw-yellow" />
              <p className="text-[10px] font-black text-cw-yellow uppercase tracking-widest">Mega Metas (objetivo stretch)</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {([
                ['Mega Meta 1 (R$)', state.mega1, (v: number) => update({ mega1: v }), '30000'],
                ['Mega Meta 2 (R$)', state.mega2, (v: number) => update({ mega2: v }), '40000'],
                ['Mega Meta 3 (R$)', state.mega3, (v: number) => update({ mega3: v }), '50000'],
              ] as const).map(([label, val, setter, ph]) => (
                <label key={label} className="block">
                  <span className="text-xs font-medium text-cw-muted">{label}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    defaultValue={val || ''}
                    placeholder={ph}
                    onChange={e => setter(num(e.target.value))}
                    className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-yellow/50"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Atualizar valor fechado */}
      <div className="cw-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-cw-purple" />
          <p className="font-bold text-sm text-cw-text">Atualizar Valor Fechado</p>
        </div>
        <p className="text-xs text-cw-muted">Quanto você já fechou este mês? (R$)</p>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={fechadoInput}
            placeholder={brl(state.jaFechado)}
            onChange={e => setFechadoInput(e.target.value)}
            className="flex-1 bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50"
          />
          <button
            onClick={() => { setJaFechado(num(fechadoInput)); setFechadoInput(''); }}
            disabled={!fechadoInput.trim()}
            className="gradient-primary text-white text-sm font-semibold px-5 rounded-xl disabled:opacity-40"
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Progresso */}
      <div>
        <SectionTitle>Progresso das Metas</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {computed.metas.map((m, i) => (
            <ProgressoCard key={i} idx={i} alvo={m.valor} progresso={m.progresso} falta={m.falta} porDia={m.porDia} batida={m.batida} />
          ))}
        </div>
      </div>

      {/* Progresso das Mega Metas */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Rocket className="h-4 w-4 text-cw-yellow" />
          <p className="text-[10px] font-black text-cw-yellow uppercase tracking-widest">Progresso das Mega Metas</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {computed.megaMetas.map((m, i) => (
            <ProgressoCard key={i} idx={i} alvo={m.valor} progresso={m.progresso} falta={m.falta} porDia={m.porDia} batida={m.batida} label={`Mega Meta ${i + 1}`} />
          ))}
        </div>
        {computed.megaMetas.every(m => m.valor === 0) && (
          <p className="text-[11px] text-cw-muted mt-2">Defina suas mega metas em "Definir Metas" acima.</p>
        )}
      </div>

      {/* Módulos */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-4 w-4 text-cw-purple" />
          <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest">Módulos <span className="text-cw-muted normal-case font-medium">(unidades)</span></p>
        </div>

        {/* Form novo módulo */}
        <div className="cw-card p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 items-end mb-3">
          <label className="block">
            <span className="text-xs font-medium text-cw-muted">Nome do Módulo</span>
            <input
              value={novoNome}
              onChange={e => setNovoNome(e.target.value)}
              placeholder="Ex: Ativações"
              className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-cw-muted">Meta (un)</span>
            <input
              value={novaMeta}
              onChange={e => setNovaMeta(e.target.value)}
              inputMode="numeric"
              placeholder="100"
              className="mt-1 w-full sm:w-24 bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-cw-muted">Já feito</span>
            <input
              value={novoConq}
              onChange={e => setNovoConq(e.target.value)}
              inputMode="numeric"
              placeholder="0"
              className="mt-1 w-full sm:w-24 bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50"
            />
          </label>
          <button
            onClick={handleAddModulo}
            disabled={!novoNome.trim() || num(novaMeta) <= 0}
            className="gradient-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 justify-center disabled:opacity-40"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        </div>

        {state.modulos.length === 0 ? (
          <div className="cw-card p-8 flex flex-col items-center gap-2 text-center">
            <Package className="h-8 w-8 text-cw-muted/40" />
            <p className="text-sm text-cw-muted">Nenhum módulo cadastrado para este mês.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {state.modulos.map(m => (
              <ModuloRow key={m.id} m={m} onUpdate={p => updateModulo(m.id, p)} onRemove={() => removeModulo(m.id)} />
            ))}
          </div>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-[11px] text-cw-muted">
        <Check className="h-3 w-3 text-emerald-400" /> Seus dados ficam salvos só neste navegador.
      </p>
    </div>
  );
}
