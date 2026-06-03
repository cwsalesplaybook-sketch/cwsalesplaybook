/** Grid "Quem é quem" do time comercial. Editável + CRUD pelo Modo Gestor. */
import { Users, Plus, Trash2 } from 'lucide-react';
import { TIME } from '@/data/time';
import { useEditableContent, useContentStore } from '@/store/contentStore';
import { useEditor } from '@/admin/EditorContext';
import { EditableText } from '@/admin/EditableText';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import type { Pessoa } from '@/types';

const STORE_KEY = 'start.time';

export function TimeGrid() {
  const { isEditing } = useEditor();
  const items = useEditableContent<Pessoa[]>(STORE_KEY, TIME);
  const saveOverride = useContentStore((s) => s.saveOverride);

  const update = async (next: Pessoa[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) { toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };
  const add = () => update([...items, {
    id: `p-${Date.now()}`, nome: 'Nova Pessoa', cargo: 'Cargo', slack: '@user', bio: 'Bio curta.',
  }]);
  const remove = (idx: number) => update(items.filter((_, i) => i !== idx));

  return (
    <section className="cw-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-cw-purple-light" />
          <h2 className="text-xl font-bold text-cw-text">
            <EditableText storeKey="start.time.titulo" defaultValue="Quem é quem no time" className="text-xl font-bold text-cw-text" />
          </h2>
        </div>
        {isEditing && (
          <Button size="sm" onClick={add} className="gradient-primary text-white h-8">
            <Plus className="h-3.5 w-3.5 mr-1" /> Pessoa
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((p, idx) => {
          const initials = p.nome.split(' ').slice(0, 2).map((n) => n[0]).join('');
          return (
            <div key={p.id} className="group p-4 rounded-xl bg-cw-elevated border border-cw-border hover:border-cw-purple/50 hover:shadow-md transition-all duration-150 relative">
              {isEditing && (
                <button
                  onClick={() => remove(idx)}
                  className="absolute top-2 right-2 h-6 w-6 rounded bg-cw-red/15 text-cw-red border border-cw-red/30 hover:bg-cw-red/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
              <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold mb-3">
                {initials}
              </div>
              <p className="font-bold text-sm text-cw-text">
                <EditableText storeKey={`${STORE_KEY}.${idx}.nome`} defaultValue={p.nome} className="font-bold text-sm text-cw-text" />
              </p>
              <p className="text-xs text-cw-muted mb-2">
                <EditableText storeKey={`${STORE_KEY}.${idx}.cargo`} defaultValue={p.cargo} className="text-xs text-cw-muted" />
              </p>
              {p.bio && (
                <p className="text-xs text-cw-text/70 leading-relaxed mb-2">
                  <EditableText storeKey={`${STORE_KEY}.${idx}.bio`} defaultValue={p.bio} multiline className="text-xs text-cw-text/70" />
                </p>
              )}
              {p.slack && (
                <p className="text-xs text-cw-purple font-mono">
                  <EditableText storeKey={`${STORE_KEY}.${idx}.slack`} defaultValue={p.slack} className="text-xs text-cw-purple font-mono" />
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
