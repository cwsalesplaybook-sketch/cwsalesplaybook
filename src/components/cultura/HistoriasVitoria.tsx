/** Histórias de Sucesso — Hall da Fama CW */
import { useState } from 'react';
import { Trophy, Star, Plus, Trash2, X } from 'lucide-react';
import { useEditor } from '@/admin/EditorContext';
import { useEditableContent, useContentStore } from '@/store/contentStore';
import { cn } from '@/lib/utils';

interface Historia {
  id: string;
  nome: string;
  foto: string;
  conquista: string;
  historia: string;
}

const HISTORIAS_PADRAO: Historia[] = [
  {
    id: 'joelma',
    nome: 'Joelma Vieira',
    foto: '',
    conquista: 'SDR → Closer → Liderança Comercial',
    historia: 'Entrou no time como SDR e construiu sua carreira tijolo por tijolo — sem atalho, sem sorte, só resultado. Foi promovida a Closer pelo que provava a cada mês e pela forma como se entregava ao processo. Hoje lidera comercialmente o Time Lobo. Joelma é a prova de que dedicação e foco constroem carreira de verdade na CW.',
  },
];

const STORE_KEY = 'historias.entries';

function initials(nome: string) {
  return nome.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function Avatar({ foto, nome, size }: { foto: string; nome: string; size: 'lg' | 'md' }) {
  const cls = size === 'lg'
    ? 'h-24 w-24 text-2xl ring-4 ring-amber-400/60 ring-offset-2 ring-offset-white'
    : 'h-14 w-14 text-base ring-2 ring-cw-purple/40 ring-offset-1 ring-offset-white';
  return foto ? (
    <img src={foto} alt={nome} className={cn('rounded-full object-cover shrink-0', cls)} />
  ) : (
    <div className={cn('rounded-full gradient-primary flex items-center justify-center text-white font-black shrink-0', cls)}>
      {initials(nome)}
    </div>
  );
}

function ModalAdicionar({ onSave, onClose }: { onSave: (h: Historia) => void; onClose: () => void }) {
  const [form, setForm] = useState({ nome: '', foto: '', conquista: '', historia: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const valid = form.nome.trim() && form.conquista.trim() && form.historia.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-cw-text">Novo membro do Hall da Fama</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex items-center gap-3">
          <Avatar foto={form.foto} nome={form.nome || '?'} size="md" />
          <div className="flex-1">
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider block mb-1">URL da Foto (opcional)</label>
            <input value={form.foto} onChange={set('foto')} placeholder="https://..."
              className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cw-purple" />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-cw-purple uppercase tracking-wider block mb-1">Nome</label>
          <input value={form.nome} onChange={set('nome')} placeholder="Ex: Luan Nicolas"
            className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cw-purple" />
        </div>

        <div>
          <label className="text-xs font-bold text-cw-purple uppercase tracking-wider block mb-1">Jornada / Conquista</label>
          <input value={form.conquista} onChange={set('conquista')} placeholder="Ex: SDR → Closer → Liderança"
            className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cw-purple" />
        </div>

        <div>
          <label className="text-xs font-bold text-cw-purple uppercase tracking-wider block mb-1">História</label>
          <textarea value={form.historia} onChange={set('historia')} rows={4}
            placeholder="Conta como foi a jornada e o que levou a essa conquista..."
            className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cw-purple resize-none" />
        </div>

        <button
          disabled={!valid}
          onClick={() => onSave({ ...form, id: `h-${Date.now()}` })}
          className="w-full py-3 rounded-xl font-bold text-sm text-white gradient-primary disabled:opacity-40 transition-opacity hover:opacity-90"
        >
          Adicionar ao Hall da Fama
        </button>
      </div>
    </div>
  );
}

function FeaturedCard({ h, onRemove }: { h: Historia; onRemove?: () => void }) {
  return (
    <article className="relative group/h rounded-2xl border-2 border-amber-300/50 bg-gradient-to-br from-amber-50 via-white to-yellow-50 p-6 md:p-8 shadow-md">
      {onRemove && (
        <button onClick={onRemove}
          className="absolute top-3 right-3 h-6 w-6 rounded bg-red-100 border border-red-200 text-red-500 flex items-center justify-center opacity-0 group-hover/h:opacity-100 transition-opacity hover:bg-red-200">
          <Trash2 className="h-3 w-3" />
        </button>
      )}

      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="flex flex-col items-center gap-2 shrink-0">
          <Avatar foto={h.foto} nome={h.nome} size="lg" />
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
            <Trophy className="h-3 w-3" /> Nº 1
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Hall da Fama CW</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">{h.nome}</h3>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 mb-4">
            {h.conquista}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">"{h.historia}"</p>
        </div>
      </div>
    </article>
  );
}

function RegularCard({ h, num, onRemove }: { h: Historia; num: number; onRemove?: () => void }) {
  return (
    <article className="relative group/h rounded-2xl border border-cw-border bg-gradient-to-br from-cw-purple/5 to-transparent p-5 hover:border-cw-purple/30 transition-colors">
      {onRemove && (
        <button onClick={onRemove}
          className="absolute top-3 right-3 h-6 w-6 rounded bg-red-100 border border-red-200 text-red-500 flex items-center justify-center opacity-0 group-hover/h:opacity-100 transition-opacity hover:bg-red-200">
          <Trash2 className="h-3 w-3" />
        </button>
      )}

      <div className="flex items-start gap-3 mb-3">
        <Avatar foto={h.foto} nome={h.nome} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-black text-cw-muted">#{num}</span>
          </div>
          <p className="font-bold text-cw-text text-base leading-tight">{h.nome}</p>
          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cw-yellow/20 text-amber-600 border border-cw-yellow/30">
            {h.conquista}
          </span>
        </div>
      </div>
      <p className="text-xs text-cw-text/80 leading-relaxed">"{h.historia}"</p>
    </article>
  );
}

export function HistoriasVitoria() {
  const { isEditing } = useEditor();
  const historias = useEditableContent<Historia[]>(STORE_KEY, HISTORIAS_PADRAO);
  const saveOverride = useContentStore((s) => s.saveOverride);
  const [showModal, setShowModal] = useState(false);

  const save = (next: Historia[]) => saveOverride(STORE_KEY, next);
  const adicionar = (h: Historia) => { save([...historias, h]); setShowModal(false); };
  const remover = (id: string) => save(historias.filter(h => h.id !== id));

  const [featured, ...rest] = historias;

  return (
    <section className="space-y-6">
      {showModal && <ModalAdicionar onSave={adicionar} onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-black text-cw-text">Hall da Fama CW</h2>
            <p className="text-xs text-cw-muted">As pessoas que provaram que o método funciona</p>
          </div>
        </div>
        {isEditing && (
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cw-purple/10 border border-cw-purple/30 text-cw-purple text-xs font-bold hover:bg-cw-purple/20 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Adicionar
          </button>
        )}
      </div>

      {/* Featured — primeiro da lista */}
      {featured && (
        <FeaturedCard h={featured} onRemove={isEditing ? () => remover(featured.id) : undefined} />
      )}

      {/* Grid — demais entradas */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rest.map((h, i) => (
            <RegularCard key={h.id} h={h} num={i + 2} onRemove={isEditing ? () => remover(h.id) : undefined} />
          ))}
        </div>
      )}

      {historias.length === 0 && (
        <div className="text-center py-10 text-cw-muted text-sm">
          Nenhuma história ainda.{isEditing ? ' Clique em "Adicionar" para começar.' : ''}
        </div>
      )}
    </section>
  );
}
