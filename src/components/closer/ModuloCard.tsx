/** Módulos — cards de score no estilo dos KPIs de meta (badge + número
 *  grande), usado tanto na aba Metas quanto no Dashboard (Metas do Mês). */
import { useState } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';
import { cn, parseLooseNumber } from '@/lib/utils';
import type { MetaModulo } from '@/hooks/useCloserMetas';

function ModuloCard({ m, onUpdate, onRemove }:
  { m: MetaModulo; onUpdate: (patch: Partial<MetaModulo>) => void; onRemove: () => void }) {
  const [conqInput, setConqInput] = useState(String(m.conquistado));
  const falta = Math.max(0, m.meta - m.conquistado);
  const batida = m.meta > 0 && m.conquistado >= m.meta;

  const commit = (v: number) => {
    const val = Math.max(0, v);
    onUpdate({ conquistado: val });
    setConqInput(String(val));
  };

  return (
    <div className="cw-card p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-bold text-cw-muted uppercase tracking-widest truncate pr-1">{m.nome}</p>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={onRemove} className="text-cw-muted hover:text-red-400 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <div className="h-8 w-8 rounded-lg bg-cw-purple/15 border border-cw-purple/30 flex items-center justify-center">
            <Package className="h-4 w-4 text-cw-purple" />
          </div>
        </div>
      </div>
      <div className="flex items-baseline gap-1.5 mt-2">
        <input
          type="text"
          inputMode="numeric"
          value={conqInput}
          onChange={e => setConqInput(e.target.value)}
          onBlur={() => commit(parseLooseNumber(conqInput))}
          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
          className="w-16 bg-transparent text-2xl font-black text-cw-text focus:outline-none border-b border-dashed border-cw-border focus:border-cw-purple"
        />
        <span className="text-sm text-cw-muted font-bold">/ {m.meta}</span>
      </div>
      <p className={cn('text-xs mt-0.5', batida ? 'text-emerald-400 font-semibold' : 'text-cw-muted')}>
        {batida ? 'Meta batida! 🎉' : `Falta ${falta} un`}
      </p>
      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-cw-border">
        <button
          onClick={() => commit(m.conquistado - 1)}
          className="h-6 w-6 rounded-lg bg-cw-elevated border border-cw-border text-cw-text hover:bg-cw-surface"
        >−</button>
        <button
          onClick={() => commit(m.conquistado + 1)}
          className="h-6 w-6 rounded-lg bg-cw-purple/15 border border-cw-purple/30 text-cw-purple-light hover:bg-cw-purple/25"
        >+</button>
      </div>
    </div>
  );
}

function NovoModuloForm({ onAdd }: { onAdd: (m: Omit<MetaModulo, 'id'>) => void }) {
  const [novoNome, setNovoNome] = useState('');
  const [novaMeta, setNovaMeta] = useState('');
  const [novoConq, setNovoConq] = useState('');

  const handleAdd = () => {
    if (!novoNome.trim() || parseLooseNumber(novaMeta) <= 0) return;
    onAdd({ nome: novoNome.trim(), meta: parseLooseNumber(novaMeta), conquistado: parseLooseNumber(novoConq) });
    setNovoNome(''); setNovaMeta(''); setNovoConq('');
  };

  return (
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
        onClick={handleAdd}
        disabled={!novoNome.trim() || parseLooseNumber(novaMeta) <= 0}
        className="gradient-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 justify-center disabled:opacity-40"
      >
        <Plus className="h-4 w-4" /> Adicionar
      </button>
    </div>
  );
}

export function ModulosSection({ modulos, onAdd, onUpdate, onRemove }: {
  modulos: MetaModulo[];
  onAdd: (m: Omit<MetaModulo, 'id'>) => void;
  onUpdate: (id: string, patch: Partial<MetaModulo>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Package className="h-4 w-4 text-cw-purple" />
        <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest">Módulos <span className="text-cw-muted normal-case font-medium">(unidades)</span></p>
      </div>

      <NovoModuloForm onAdd={onAdd} />

      {modulos.length === 0 ? (
        <div className="cw-card p-8 flex flex-col items-center gap-2 text-center">
          <Package className="h-8 w-8 text-cw-muted/40" />
          <p className="text-sm text-cw-muted">Nenhum módulo cadastrado para este mês.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {modulos.map(m => (
            <ModuloCard key={m.id} m={m} onUpdate={p => onUpdate(m.id, p)} onRemove={() => onRemove(m.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
