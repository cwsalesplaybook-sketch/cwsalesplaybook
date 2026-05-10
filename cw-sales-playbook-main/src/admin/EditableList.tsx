/** EditableList — CRUD genérico para arrays no Modo Gestor.
 *  Renderiza cada item via render-prop e adiciona controles de adicionar,
 *  remover, mover para cima/baixo. As mudanças são persistidas no Cloud. */
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContentStore, useEditableContent } from '@/store/contentStore';
import { useEditor } from './EditorContext';
import { toast } from '@/hooks/use-toast';

interface EditableListProps<T> {
  storeKey: string;
  defaultValue: T[];
  /** Cria um novo item ao clicar em "Adicionar". */
  newItem: () => T;
  /** Renderiza cada item. O parâmetro `editing` é o estado do Modo Gestor. */
  render: (item: T, idx: number, editing: boolean) => React.ReactNode;
  /** Texto do botão adicionar. */
  addLabel?: string;
  /** Classe wrapper. */
  className?: string;
  /** Estilo dos controles de cada item. inline = ao lado; corner = canto sup. dir. */
  controlsPosition?: 'inline' | 'corner';
  /** Esconde controles de reordenar (mantém só add/remove). */
  hideReorder?: boolean;
}

export function EditableList<T>({
  storeKey,
  defaultValue,
  newItem,
  render,
  addLabel = 'Adicionar',
  className,
  controlsPosition = 'corner',
  hideReorder = false,
}: EditableListProps<T>) {
  const { isEditing } = useEditor();
  const items = useEditableContent<T[]>(storeKey, defaultValue);
  const saveOverride = useContentStore((s) => s.saveOverride);

  const update = async (next: T[]) => {
    try { await saveOverride(storeKey, next); }
    catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao salvar';
      toast({ title: 'Falha ao salvar', description: msg, variant: 'destructive' });
    }
  };

  const add = () => update([...items, newItem()]);
  const remove = (idx: number) => update(items.filter((_, i) => i !== idx));
  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[idx], next[target]] = [next[target], next[idx]];
    update(next);
  };

  return (
    <div className={className}>
      {items.map((item, i) => (
        <div key={i} className="relative group/li">
          {render(item, i, isEditing)}
          {isEditing && (
            <div
              className={
                controlsPosition === 'corner'
                  ? 'absolute top-2 right-2 flex gap-1 opacity-0 group-hover/li:opacity-100 transition-opacity z-10'
                  : 'absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover/li:opacity-100 transition-opacity z-10'
              }
            >
              {!hideReorder && (
                <>
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    title="Mover para cima"
                    className="h-6 w-6 rounded bg-cw-elevated border border-cw-border hover:bg-cw-purple/20 disabled:opacity-30 flex items-center justify-center"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    title="Mover para baixo"
                    className="h-6 w-6 rounded bg-cw-elevated border border-cw-border hover:bg-cw-purple/20 disabled:opacity-30 flex items-center justify-center"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </>
              )}
              <button
                onClick={() => remove(i)}
                title="Remover"
                className="h-6 w-6 rounded bg-cw-red/15 text-cw-red border border-cw-red/30 hover:bg-cw-red/25 flex items-center justify-center"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      ))}

      {isEditing && (
        <div className="mt-3 flex justify-center">
          <Button size="sm" onClick={add} variant="outline" className="border-cw-purple-light/40 text-cw-purple-light hover:bg-cw-purple-light/10 h-8 border-dashed">
            <Plus className="h-3.5 w-3.5 mr-1" /> {addLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
