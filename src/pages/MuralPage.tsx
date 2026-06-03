/** Página dedicada do Mural de Avisos. */
import { useEffect } from 'react';
import {
  Megaphone, BookOpen, Swords, Target, Calendar, Sparkles, Trophy,
  Plus, Trash2, ArrowUp, ArrowDown, Bell,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useContentStore, useEditableContent } from '@/store/contentStore';
import { useEditor } from '@/admin/EditorContext';
import { EditableText } from '@/admin/EditableText';
import { toast } from '@/hooks/use-toast';
import { AVISOS_PADRAO, type Aviso, type AvisoIcon } from '@/data/avisos';
import { useMuralNotifications } from '@/hooks/useMuralNotifications';

const ICON_MAP = { BookOpen, Swords, Target, Megaphone, Calendar, Sparkles, Trophy } as const;
const ICON_KEYS: AvisoIcon[] = ['BookOpen', 'Swords', 'Target', 'Megaphone', 'Calendar', 'Sparkles', 'Trophy'];
const STORE_KEY = 'dashboard.avisos';

export default function MuralPage() {
  const { isEditing } = useEditor();
  const avisos = useEditableContent<Aviso[]>(STORE_KEY, AVISOS_PADRAO);
  const saveOverride = useContentStore((s) => s.saveOverride);
  const { markAllRead } = useMuralNotifications();

  // Marca todos como lidos ao abrir a página
  useEffect(() => { markAllRead(); }, [markAllRead]);

  const update = async (next: Aviso[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) {
      toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' });
    }
  };

  const add = () => update([
    {
      id: `a-${Date.now()}`,
      icon: 'Megaphone',
      badge: 'Novo',
      text: 'Novo aviso — clique para editar.',
    },
    ...avisos,
  ]);

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
    update(avisos.map((a) => {
      if (a.id !== id) return a;
      const cur = ICON_KEYS.indexOf(a.icon);
      return { ...a, icon: ICON_KEYS[(cur + 1) % ICON_KEYS.length] };
    }));
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-cw-text">Mural de Avisos</h1>
            <p className="text-sm text-cw-muted mt-0.5">Comunicados e atualizações do time.</p>
          </div>
        </div>
        {isEditing && (
          <Button onClick={add} className="gradient-primary text-white h-9">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Novo aviso
          </Button>
        )}
      </div>

      {/* Lista de avisos */}
      <div className="space-y-3 max-w-3xl">
        {avisos.map((a, i) => {
          const Icon = ICON_MAP[a.icon] ?? Megaphone;
          return (
            <div
              key={a.id}
              className="group cw-card cw-card-hover p-5 flex items-start gap-4 relative"
            >
              <button
                type="button"
                onClick={isEditing ? () => cycleIcon(a.id) : undefined}
                disabled={!isEditing}
                title={isEditing ? 'Clique para trocar o ícone' : undefined}
                className={`h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shrink-0 ${isEditing ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
              >
                <Icon className="h-5 w-5 text-white" />
              </button>

              <div className="flex-1 min-w-0">
                <Badge variant="outline" className="border-cw-border text-cw-muted text-[10px] mb-2">
                  <EditableText
                    storeKey={`${STORE_KEY}.${a.id}.badge`}
                    defaultValue={a.badge}
                    className="text-[10px]"
                  />
                </Badge>
                <p className="text-sm text-cw-text leading-relaxed">
                  <EditableText
                    storeKey={`${STORE_KEY}.${a.id}.text`}
                    defaultValue={a.text}
                    multiline
                    className="text-sm"
                  />
                </p>
              </div>

              {isEditing && (
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => move(a.id, -1)} disabled={i === 0} title="Mover para cima"
                    className="h-7 w-7 rounded-lg bg-cw-elevated border border-cw-border hover:bg-cw-purple/20 disabled:opacity-30 flex items-center justify-center">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => move(a.id, 1)} disabled={i === avisos.length - 1} title="Mover para baixo"
                    className="h-7 w-7 rounded-lg bg-cw-elevated border border-cw-border hover:bg-cw-purple/20 disabled:opacity-30 flex items-center justify-center">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(a.id)} title="Remover"
                    className="h-7 w-7 rounded-lg bg-cw-red/15 text-cw-red border border-cw-red/30 hover:bg-cw-red/25 flex items-center justify-center">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {avisos.length === 0 && (
          <div className="cw-card p-10 text-center">
            <Bell className="h-10 w-10 text-cw-border mx-auto mb-3" />
            <p className="text-cw-muted text-sm">Nenhum aviso por enquanto.</p>
            {isEditing && <p className="text-xs text-cw-muted mt-1">Clique em "Novo aviso" para começar.</p>}
          </div>
        )}
      </div>

      {isEditing && avisos.length > 0 && (
        <p className="text-xs text-cw-muted italic max-w-3xl">
          💡 Clique nos textos para editar · Clique no ícone para alternar · Use as setas para reordenar
        </p>
      )}
    </div>
  );
}
