/** OKRs & Metas do Squad — painel de acompanhamento separado da Meta
 *  pessoal (Representantes Cadastrados) acima. Cada card tem uma
 *  engrenagem pra editar título/atual/meta/unidade/nota; nada aqui entra
 *  no cálculo de ritmo/projeção do bloco principal.
 *
 *  O card "Agendamentos" (id fixo `agendamentos`) recebe sincronização
 *  automática via prop `agendamentosAuto` (ganhos do mês no Funil de
 *  Prospecção de Representantes, Gabrielly + Hyorranes somados — ver
 *  MetaMesReps.tsx / api/reps-metas.js); segue editável manualmente entre
 *  sincronizações, igual ao card de Representantes Cadastrados acima. */
import { useEffect, useState } from 'react';
import { Settings, X, Trash2, Plus, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRepsOkrs, type OkrCard } from '@/hooks/useRepsOkrs';

function EditModal({ initial, onSave, onDelete, onClose }: {
  initial: OkrCard;
  onSave: (patch: Partial<OkrCard>) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [titulo, setTitulo] = useState(initial.titulo);
  const [atual, setAtual] = useState(initial.atual?.toString() ?? '');
  const [meta, setMeta] = useState(initial.meta?.toString() ?? '');
  const [unidade, setUnidade] = useState(initial.unidade ?? '');
  const [nota, setNota] = useState(initial.nota ?? '');

  const salvar = () => {
    if (!titulo.trim()) return;
    onSave({
      titulo: titulo.trim(),
      atual: atual.trim() === '' ? undefined : Number(atual),
      meta: meta.trim() === '' ? undefined : Number(meta),
      unidade: unidade.trim() || undefined,
      nota: nota.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div className="cw-card p-5 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="font-bold text-cw-text">Editar card</p>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text"><X className="h-4 w-4" /></button>
        </div>
        <label className="block">
          <span className="text-xs font-medium text-cw-muted">Título</span>
          <input value={titulo} onChange={e => setTitulo(e.target.value)}
            className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple/50" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-medium text-cw-muted">Atual (opcional)</span>
            <input type="number" value={atual} onChange={e => setAtual(e.target.value)} placeholder="—"
              className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-cw-muted">Meta (opcional)</span>
            <input type="number" value={meta} onChange={e => setMeta(e.target.value)} placeholder="—"
              className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50" />
          </label>
        </div>
        <label className="block">
          <span className="text-xs font-medium text-cw-muted">Unidade (opcional)</span>
          <input value={unidade} onChange={e => setUnidade(e.target.value)} placeholder="Ex: clientes, reps, respostas..."
            className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50" />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-cw-muted">Nota (opcional)</span>
          <textarea value={nota} onChange={e => setNota(e.target.value)} rows={2}
            className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50 resize-none" />
        </label>
        <div className="flex gap-2">
          <button onClick={() => { onDelete(); onClose(); }}
            className="h-10 w-10 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors shrink-0">
            <Trash2 className="h-4 w-4" />
          </button>
          <button onClick={salvar} disabled={!titulo.trim()}
            className="flex-1 gradient-primary text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-40">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ okr, onEdit }: { okr: OkrCard; onEdit: () => void }) {
  const temNumeros = okr.atual !== undefined || okr.meta !== undefined;
  const progresso = okr.atual !== undefined && okr.meta ? Math.min(100, (okr.atual / okr.meta) * 100) : null;
  return (
    <div className="rounded-xl border border-cw-border bg-cw-elevated p-4 space-y-2 relative">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-bold text-cw-purple uppercase tracking-wider leading-snug">{okr.titulo}</p>
        <button onClick={onEdit} title="Editar" className="shrink-0 text-cw-muted hover:text-cw-purple-light transition-colors">
          <Settings className="h-3.5 w-3.5" />
        </button>
      </div>

      {temNumeros && (
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-cw-text">{okr.atual ?? '—'}</span>
          {okr.meta !== undefined && <span className="text-sm text-cw-muted font-bold">/ {okr.meta}</span>}
          {okr.unidade && <span className="text-[10px] text-cw-muted">{okr.unidade}</span>}
        </div>
      )}
      {!temNumeros && okr.unidade && (
        <p className="text-xs text-cw-muted">{okr.unidade}</p>
      )}

      {progresso !== null && (
        <div className="h-1.5 bg-cw-border rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full', progresso >= 100 ? 'bg-emerald-500' : 'bg-cw-purple')} style={{ width: `${progresso}%` }} />
        </div>
      )}

      {okr.nota && <p className="text-[11px] text-cw-muted leading-snug">{okr.nota}</p>}
    </div>
  );
}

export function RepsOkrsSection({ cargo = 'Aquisição de Canal', agendamentosAuto }: { cargo?: string; agendamentosAuto?: number | null }) {
  const { okrs, updateOkr, addOkr, removeOkr } = useRepsOkrs(cargo);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = okrs.find(o => o.id === editingId) ?? null;

  useEffect(() => {
    if (agendamentosAuto == null) return;
    const atual = okrs.find(o => o.id === 'agendamentos')?.atual;
    if (atual !== agendamentosAuto) updateOkr('agendamentos', { atual: agendamentosAuto });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agendamentosAuto]);

  return (
    <div className="cw-card p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cw-purple/10 flex items-center justify-center shrink-0">
            <ListChecks className="h-4 w-4 text-cw-purple-light" />
          </div>
          <div>
            <h3 className="text-base font-black text-cw-text">OKRs & Metas do Squad</h3>
            <p className="text-xs text-cw-muted">Alinhado em reunião de liderança — não conta pra sua meta pessoal acima</p>
          </div>
        </div>
        <button onClick={() => setEditingId(addOkr())}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 transition-colors shrink-0">
          <Plus className="h-3.5 w-3.5" /> Novo card
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {okrs.map(okr => (
          <Card key={okr.id} okr={okr} onEdit={() => setEditingId(okr.id)} />
        ))}
      </div>

      {editing && (
        <EditModal
          initial={editing}
          onSave={patch => updateOkr(editing.id, patch)}
          onDelete={() => removeOkr(editing.id)}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  );
}
