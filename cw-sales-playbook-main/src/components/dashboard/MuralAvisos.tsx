/** Mural de Avisos — CRUD completo no Modo Gestor. */
import { Megaphone, BookOpen, Swords, Target, Calendar, Sparkles, Trophy, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useContentStore, useEditableContent } from '@/store/contentStore';
import { useEditor } from '@/admin/EditorContext';
import { EditableText } from '@/admin/EditableText';
import { toast } from '@/hooks/use-toast';
import { AVISOS_PADRAO, type Aviso, type AvisoIcon } from '@/data/avisos';

const ICON_MAP = { BookOpen, Swords, Target, Megaphone, Calendar, Sparkles, Trophy } as const;
const ICON_KEYS: AvisoIcon[] = ['BookOpen', 'Swords', 'Target', 'Megaphone', 'Calendar', 'Sparkles', 'Trophy'];

const STORE_KEY = 'dashboard.avisos';

export function MuralAvisos() {
  const { isEditing } = useEditor();
  const avisos = useEditableContent<Aviso[]>(STORE_KEY, AVISOS_PADRAO);
  const saveOverride = useContentStore((s) => s.saveOverride);

  const update = async (next: Aviso[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao salvar';
      toast({ title: 'Falha ao salvar', description: msg, variant: 'destructive' });
    }
  };

  const add = () => {
    const novo: Aviso = {
      id: `a-${Date.now()}`,
      icon: 'Megaphone',
      badge: 'Novo',
      text: 'Novo aviso — clique para editar.',
    };
    update([...avisos, novo]);
  };

  const remove = (id: string) => update(avisos.filter((a) => a.id !== id));

  const move = (id: string, dir: -1 | 1) => {
    const idx = avisos.findIndex((a) => a.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= avisos.length) return;
    const next = [...avisos];
    [next[idx], next[target]] = [next[target], next[idx]];
    update(next);
  };

  const cycleIcon = (id: string) => {
    const next = avisos.map((a) => {
      if (a.id !== id) return a;
      const cur = ICON_KEYS.indexOf(a.icon);
      const nxt = ICON_KEYS[(cur + 1) % ICON_KEYS.length];
      return { ...a, icon: nxt };
    });
    update(next);
  };

  return (
    <div className="cw-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-cw-purple-light" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cw-muted">Mural de Avisos</h3>
        </div>
        {isEditing && (
          <Button size="sm" onClick={add} className="gradient-primary text-white h-8">
            <Plus className="h-3.5 w-3.5 mr-1" /> Novo aviso
          </Button>
        )}
      </div>

      <ul className="space-y-3">
        {avisos.map((a, i) => {
          const Icon = ICON_MAP[a.icon] ?? Megaphone;
          return (
            <li
              key={a.id}
              className="group flex items-start gap-3 p-3 rounded-lg bg-cw-bg border border-cw-border hover:border-cw-purple/40 transition-colors relative"
            >
              <button
                type="button"
                onClick={isEditing ? () => cycleIcon(a.id) : undefined}
                disabled={!isEditing}
                title={isEditing ? 'Clique para trocar o ícone' : undefined}
                className={`h-8 w-8 rounded-md gradient-primary flex items-center justify-center shrink-0 ${isEditing ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
              >
                <Icon className="h-4 w-4 text-white" />
              </button>
              <div className="flex-1">
                <Badge variant="outline" className="border-cw-border text-cw-muted text-[10px] mb-1">
                  <EditableText
                    storeKey={`${STORE_KEY}.${a.id}.badge`}
                    defaultValue={a.badge}
                    className="text-[10px]"
                  />
                </Badge>
                <p className="text-sm text-cw-text">
                  <EditableText
                    storeKey={`${STORE_KEY}.${a.id}.text`}
                    defaultValue={a.text}
                    multiline
                    className="text-sm"
                  />
                </p>
              </div>

              {isEditing && (
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => move(a.id, -1)}
                    disabled={i === 0}
                    title="Mover para cima"
                    className="h-6 w-6 rounded bg-cw-elevated border border-cw-border hover:bg-cw-purple/20 disabled:opacity-30 flex items-center justify-center"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => move(a.id, 1)}
                    disabled={i === avisos.length - 1}
                    title="Mover para baixo"
                    className="h-6 w-6 rounded bg-cw-elevated border border-cw-border hover:bg-cw-purple/20 disabled:opacity-30 flex items-center justify-center"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => remove(a.id)}
                    title="Remover"
                    className="h-6 w-6 rounded bg-cw-red/15 text-cw-red border border-cw-red/30 hover:bg-cw-red/25 flex items-center justify-center"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </li>
          );
        })}
        {avisos.length === 0 && (
          <li className="text-sm text-cw-muted italic text-center py-4">Nenhum aviso. {isEditing && 'Clique em "Novo aviso" acima.'}</li>
        )}
      </ul>

      {isEditing && (
        <p className="text-xs text-cw-muted mt-4 text-center italic">
          💡 Clique nos textos para editar · Clique no ícone para alternar · Use as setas para reordenar
        </p>
      )}
    </div>
  );
}
