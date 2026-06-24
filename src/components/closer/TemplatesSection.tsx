/** Templates — "Arsenal de Mensagens" do Closer.
 *  Lista compartilhada (seed em código ou override `closer.templates`,
 *  editável pelo gestor). Favoritos são pessoais (localStorage). */
import { useState } from 'react';
import { Copy, Check, Star, Pencil, Trash2, Plus, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContentStore } from '@/store/contentStore';
import { useSidebarContext } from '@/context/SidebarContext';
import { useEditor } from '@/admin/EditorContext';
import { toast } from '@/hooks/use-toast';
import { SEED_TEMPLATES, TEMPLATE_CATEGORIAS, type CloserTemplate } from '@/data/closerTemplates';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">{children}</p>;
}

const FAV_KEY = 'cw-closer-tpl-fav';

function usePersonalFavs(): [Set<string>, (id: string) => void] {
  const [favs, setFavs] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]')); } catch { return new Set(); }
  });
  const toggle = (id: string) => {
    setFavs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem(FAV_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };
  return [favs, toggle];
}

/** Lê a lista compartilhada (override do setor atual) com fallback no seed. */
function useTemplates(): [CloserTemplate[], (next: CloserTemplate[]) => Promise<void>] {
  const { papel } = useSidebarContext();
  const prefix = (papel === 'SDR' || papel === 'Liderança') ? '' : papel.toLowerCase() + '.';
  const override = useContentStore(s => s.overrides[prefix + 'templates']) as CloserTemplate[] | undefined;
  const saveOverride = useContentStore(s => s.saveOverride);
  const list = Array.isArray(override) ? override : SEED_TEMPLATES;
  const save = (next: CloserTemplate[]) => saveOverride('templates', next);
  return [list, save];
}

function TemplateCard({ t, fav, onFav, editing, onEdit, onDelete }: {
  t: CloserTemplate; fav: boolean; onFav: () => void;
  editing: boolean; onEdit: () => void; onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(t.texto).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="cw-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-bold text-sm text-cw-text leading-tight">{t.titulo}</p>
          <p className="text-[11px] text-cw-muted mt-0.5">{t.categoria}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onFav} title="Favoritar" className={cn('transition-colors', fav ? 'text-cw-yellow' : 'text-cw-muted hover:text-cw-yellow')}>
            <Star className={cn('h-4 w-4', fav && 'fill-current')} />
          </button>
          {editing && (
            <>
              <button onClick={onEdit} title="Editar" className="text-cw-muted hover:text-cw-purple-light"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={onDelete} title="Excluir" className="text-cw-muted hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
            </>
          )}
        </div>
      </div>
      <p className="text-sm text-cw-muted leading-relaxed flex-1 whitespace-pre-line">{t.texto}</p>
      <button
        onClick={copy}
        className={cn(
          'w-full flex items-center justify-center gap-1.5 text-sm font-medium py-2.5 rounded-xl border transition-colors',
          copied ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-cw-elevated border-cw-border text-cw-text hover:bg-cw-surface',
        )}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Copiado!' : 'Copiar'}
      </button>
    </div>
  );
}

function EditModal({ initial, onClose, onSave }: {
  initial: CloserTemplate | null;
  onClose: () => void;
  onSave: (t: CloserTemplate) => void;
}) {
  const [titulo, setTitulo] = useState(initial?.titulo ?? '');
  const [categoria, setCategoria] = useState(initial?.categoria ?? TEMPLATE_CATEGORIAS[0]);
  const [texto, setTexto] = useState(initial?.texto ?? '');

  const salvar = () => {
    if (!titulo.trim() || !texto.trim()) return;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      titulo: titulo.trim(),
      categoria,
      texto: texto.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div className="cw-card p-5 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="font-bold text-cw-text">{initial ? 'Editar Template' : 'Novo Template'}</p>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text"><X className="h-4 w-4" /></button>
        </div>
        <label className="block">
          <span className="text-xs font-medium text-cw-muted">Título</span>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Follow-up Padrão"
            className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50" />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-cw-muted">Categoria</span>
          <select value={categoria} onChange={e => setCategoria(e.target.value)}
            className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple/50">
            {TEMPLATE_CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-cw-muted">Mensagem</span>
          <textarea value={texto} onChange={e => setTexto(e.target.value)} rows={4} placeholder="Escreva a mensagem..."
            className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50 resize-none" />
        </label>
        <button onClick={salvar} disabled={!titulo.trim() || !texto.trim()}
          className="w-full gradient-primary text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-40">
          Salvar
        </button>
      </div>
    </div>
  );
}

export function TemplatesSection() {
  const [list, save] = useTemplates();
  const [favs, toggleFav] = usePersonalFavs();
  const { isEditing } = useEditor();

  const [cat, setCat] = useState('Todas');
  const [soFav, setSoFav] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; editing: CloserTemplate | null }>({ open: false, editing: null });

  const categorias = ['Todas', ...Array.from(new Set(list.map(t => t.categoria)))];
  const filtrados = list.filter(t =>
    (cat === 'Todas' || t.categoria === cat) && (!soFav || favs.has(t.id)),
  );

  const persist = async (next: CloserTemplate[]) => {
    try { await save(next); }
    catch (e) { toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };
  const onSaveTemplate = (t: CloserTemplate) => {
    const exists = list.some(x => x.id === t.id);
    persist(exists ? list.map(x => x.id === t.id ? t : x) : [...list, t]);
    setModal({ open: false, editing: null });
  };
  const onDelete = (id: string) => persist(list.filter(t => t.id !== id));

  return (
    <div className="space-y-5">
      <div className="cw-card p-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionTitle>Arsenal de Mensagens</SectionTitle>
          <p className="text-sm text-cw-muted">Mensagens estratégicas prontas para copiar e fechar negócios.</p>
        </div>
        {isEditing && (
          <button onClick={() => setModal({ open: true, editing: null })}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl gradient-primary text-white shrink-0">
            <Plus className="h-3.5 w-3.5" /> Novo Template
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        {categorias.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={cn('text-xs font-medium px-3 py-1.5 rounded-full border transition-colors',
              cat === c ? 'gradient-primary text-white border-transparent' : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text')}>
            {c}
          </button>
        ))}
        <button onClick={() => setSoFav(v => !v)}
          className={cn('flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors',
            soFav ? 'bg-cw-yellow/15 text-cw-yellow border-cw-yellow/30' : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text')}>
          <Star className={cn('h-3 w-3', soFav && 'fill-current')} /> Favoritos
        </button>
      </div>

      {filtrados.length === 0 ? (
        <div className="cw-card p-10 flex flex-col items-center gap-2 text-center">
          <FileText className="h-8 w-8 text-cw-muted/40" />
          <p className="text-sm text-cw-muted">Nenhum template neste filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtrados.map(t => (
            <TemplateCard
              key={t.id} t={t} fav={favs.has(t.id)} onFav={() => toggleFav(t.id)}
              editing={isEditing}
              onEdit={() => setModal({ open: true, editing: t })}
              onDelete={() => onDelete(t.id)}
            />
          ))}
        </div>
      )}

      {modal.open && (
        <EditModal initial={modal.editing} onClose={() => setModal({ open: false, editing: null })} onSave={onSaveTemplate} />
      )}
    </div>
  );
}
