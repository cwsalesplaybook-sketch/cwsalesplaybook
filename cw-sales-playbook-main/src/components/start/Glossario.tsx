/** Glossário CW — termos e siglas. Editável + CRUD pelo Modo Gestor. */
import { useMemo, useState } from 'react';
import { BookMarked, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GLOSSARIO } from '@/data/glossario';
import { useEditableContent, useContentStore } from '@/store/contentStore';
import { useEditor } from '@/admin/EditorContext';
import { EditableText } from '@/admin/EditableText';
import type { GlossarioTermo } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const STORE_KEY = 'start.glossario';

export function Glossario() {
  const { isEditing } = useEditor();
  const items = useEditableContent<GlossarioTermo[]>(STORE_KEY, GLOSSARIO);
  const saveOverride = useContentStore((s) => s.saveOverride);
  const [q, setQ] = useState('');

  const update = async (next: GlossarioTermo[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) { toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };
  const add = () => update([...items, { categoria: 'Novo', termo: 'Novo Termo', definicao: 'Definição.' }]);
  const remove = (idx: number) => update(items.filter((_, i) => i !== idx));

  const filtered = useMemo(() => {
    if (!q.trim()) return items.map((t, i) => ({ ...t, _idx: i }));
    const lc = q.toLowerCase();
    return items
      .map((t, i) => ({ ...t, _idx: i }))
      .filter((t) => t.termo.toLowerCase().includes(lc) || t.definicao.toLowerCase().includes(lc));
  }, [items, q]);

  return (
    <section className="cw-card p-6">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <BookMarked className="h-5 w-5 text-cw-purple-light" />
          <h2 className="text-xl font-bold">
            <EditableText storeKey="start.glossario.titulo" defaultValue="Glossário CW" className="text-xl font-bold" />
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <Button size="sm" onClick={add} className="gradient-primary text-white h-9">
              <Plus className="h-3.5 w-3.5 mr-1" /> Termo
            </Button>
          )}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cw-muted" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar termo..."
              className="pl-9 bg-cw-bg border-cw-border h-9"
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((t) => (
          <div key={`${t.termo}-${t._idx}`} className="group p-3 rounded-lg bg-cw-bg border border-cw-border relative">
            {isEditing && (
              <button
                onClick={() => remove(t._idx)}
                className="absolute top-2 right-2 h-6 w-6 rounded bg-cw-red/15 text-cw-red border border-cw-red/30 hover:bg-cw-red/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remover termo"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <p className="font-bold text-cw-purple-light">
                <EditableText storeKey={`${STORE_KEY}.${t._idx}.termo`} defaultValue={t.termo} className="font-bold text-cw-purple-light" />
              </p>
              {t.categoria && (
                <Badge variant="outline" className="border-cw-border text-cw-muted text-[10px]">
                  <EditableText storeKey={`${STORE_KEY}.${t._idx}.categoria`} defaultValue={t.categoria} className="text-[10px]" />
                </Badge>
              )}
            </div>
            <p className="text-xs text-cw-muted leading-relaxed">
              <EditableText storeKey={`${STORE_KEY}.${t._idx}.definicao`} defaultValue={t.definicao} multiline className="text-xs text-cw-muted" />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
