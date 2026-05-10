/** Linha do tempo da Cardápio Web — visual horizontal. Editável + CRUD. */
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { TIMELINE_EMPRESA } from '@/data/timelineEmpresa';
import { useEditableContent, useContentStore } from '@/store/contentStore';
import { useEditor } from '@/admin/EditorContext';
import { EditableText } from '@/admin/EditableText';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import type { MarcoTimeline } from '@/types';

const STORE_KEY = 'start.timelineEmpresa';

export function TimelineEmpresa() {
  const { isEditing } = useEditor();
  const items = useEditableContent<MarcoTimeline[]>(STORE_KEY, TIMELINE_EMPRESA);
  const saveOverride = useContentStore((s) => s.saveOverride);

  const update = async (next: MarcoTimeline[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) { toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };
  const add = () => update([...items, { ano: '2030', titulo: 'Novo marco', descricao: 'Descrição.' }]);
  const remove = (idx: number) => update(items.filter((_, i) => i !== idx));

  return (
    <section className="cw-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-cw-purple-light" />
          <h2 className="text-xl font-bold">
            <EditableText storeKey="start.timeline.titulo" defaultValue="A jornada da CW" className="text-xl font-bold" />
          </h2>
        </div>
        {isEditing && (
          <Button size="sm" onClick={add} className="gradient-primary text-white h-8">
            <Plus className="h-3.5 w-3.5 mr-1" /> Marco
          </Button>
        )}
      </div>

      <ol className="relative border-l-2 border-cw-border ml-3 space-y-6">
        {items.map((m, idx) => {
          const isFuture = m.ano === '2040';
          return (
            <li key={`${m.ano}-${idx}`} className="ml-6 group/m">
              <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${isFuture ? 'bg-cw-yellow text-cw-purple-dark' : idx === 0 ? 'gradient-primary text-white' : 'bg-cw-elevated border border-cw-border text-cw-purple-light'}`}>
                ●
              </span>
              <div className="flex items-baseline gap-3 flex-wrap">
                <p className={`text-lg font-black ${isFuture ? 'text-cw-yellow' : 'text-cw-purple-light'}`}>
                  <EditableText storeKey={`${STORE_KEY}.${idx}.ano`} defaultValue={m.ano} className={`text-lg font-black ${isFuture ? 'text-cw-yellow' : 'text-cw-purple-light'}`} />
                </p>
                <p className="font-bold">
                  <EditableText storeKey={`${STORE_KEY}.${idx}.titulo`} defaultValue={m.titulo} className="font-bold" />
                </p>
                {isEditing && (
                  <button
                    onClick={() => remove(idx)}
                    className="h-6 w-6 rounded bg-cw-red/15 text-cw-red border border-cw-red/30 hover:bg-cw-red/25 flex items-center justify-center opacity-0 group-hover/m:opacity-100 transition-opacity ml-auto"
                    title="Remover"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
              <p className="text-sm text-cw-muted mt-1">
                <EditableText storeKey={`${STORE_KEY}.${idx}.descricao`} defaultValue={m.descricao} multiline className="text-sm text-cw-muted" />
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
