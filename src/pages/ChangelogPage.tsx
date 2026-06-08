/** Página de Changelog — histórico de atualizações do sistema */
import { Zap, Plus, Trash2, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useContentStore, useEditableContent } from '@/store/contentStore';
import { useEditor } from '@/admin/EditorContext';
import { EditableText } from '@/admin/EditableText';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from '@/hooks/use-toast';
import { CHANGELOG_PADRAO, type ChangelogEntry, type ChangelogType } from '@/data/changelog';

const STORE_KEY = 'changelog.entries';

const TYPE_CONFIG: Record<ChangelogType, { label: string; className: string }> = {
  feature:  { label: 'Nova função',   className: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  update:   { label: 'Atualização',   className: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  fix:      { label: 'Correção',      className: 'bg-green-500/20 text-green-300 border-green-500/30' },
  breaking: { label: 'Atenção',       className: 'bg-red-500/20 text-red-300 border-red-500/30' },
};

const TYPE_KEYS: ChangelogType[] = ['feature', 'update', 'fix', 'breaking'];

export default function ChangelogPage() {
  const { isEditing } = useEditor();
  const userProfile = useUserProfile();
  const entries = useEditableContent<ChangelogEntry[]>(STORE_KEY, CHANGELOG_PADRAO);
  const saveOverride = useContentStore((s) => s.saveOverride);

  const update = async (next: ChangelogEntry[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) {
      toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' });
    }
  };

  const add = () => update([
    {
      id: `cl-${Date.now()}`,
      version: '—',
      date: new Date().toISOString().split('T')[0],
      title: 'Nova atualização — edite aqui.',
      description: 'Descreva o que mudou.',
      postedBy: userProfile.fullName ?? 'Gestor',
      type: 'feature',
    },
    ...entries,
  ]);

  const remove = (id: string) => update(entries.filter(e => e.id !== id));

  const move = (id: string, dir: -1 | 1) => {
    const idx = entries.findIndex(e => e.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= entries.length) return;
    const next = [...entries];
    [next[idx], next[target]] = [next[target], next[idx]];
    update(next);
  };

  const cycleType = (id: string) => {
    update(entries.map(e => {
      if (e.id !== id) return e;
      const cur = TYPE_KEYS.indexOf(e.type);
      return { ...e, type: TYPE_KEYS[(cur + 1) % TYPE_KEYS.length] };
    }));
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-cw-text">Changelog</h1>
            <p className="text-sm text-cw-muted mt-0.5">Atualizações e melhorias da plataforma.</p>
          </div>
        </div>
        {isEditing && (
          <Button onClick={add} className="gradient-primary text-white h-9">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Nova entrada
          </Button>
        )}
      </div>

      {/* Entries */}
      <div className="space-y-0 max-w-3xl relative">
        {/* Linha vertical da timeline */}
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-cw-border" />

        {entries.map((entry, i) => {
          const cfg = TYPE_CONFIG[entry.type];
          return (
            <div key={entry.id} className="group relative flex gap-5 pb-6">
              {/* Dot */}
              <button
                type="button"
                onClick={isEditing ? () => cycleType(entry.id) : undefined}
                disabled={!isEditing}
                title={isEditing ? 'Clique para trocar o tipo' : undefined}
                className={`relative z-10 h-10 w-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  isEditing ? 'cursor-pointer hover:scale-110' : ''
                } border-cw-border bg-cw-bg`}
              >
                <Zap className="h-4 w-4 text-cw-purple" />
              </button>

              {/* Card */}
              <div className="flex-1 cw-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <button
                        type="button"
                        onClick={isEditing ? () => cycleType(entry.id) : undefined}
                        disabled={!isEditing}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${cfg.className} ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
                      >
                        {cfg.label}
                      </button>
                      <span className="text-[11px] font-bold text-cw-purple bg-cw-purple/10 px-2 py-0.5 rounded-md border border-cw-purple/20">
                        v<EditableText
                          storeKey={`${STORE_KEY}.${entry.id}.version`}
                          defaultValue={entry.version}
                          className="text-[11px] font-bold"
                        />
                      </span>
                      <span className="text-[10px] text-cw-muted">
                        <EditableText
                          storeKey={`${STORE_KEY}.${entry.id}.date`}
                          defaultValue={entry.date}
                          className="text-[10px]"
                        />
                      </span>
                    </div>

                    {/* Título */}
                    <h3 className="text-[15px] font-bold text-cw-text mb-1.5">
                      <EditableText
                        storeKey={`${STORE_KEY}.${entry.id}.title`}
                        defaultValue={entry.title}
                        className="text-[15px] font-bold"
                      />
                    </h3>

                    {/* Descrição */}
                    <p className="text-[13px] text-cw-muted leading-relaxed">
                      <EditableText
                        storeKey={`${STORE_KEY}.${entry.id}.description`}
                        defaultValue={entry.description}
                        multiline
                        className="text-[13px]"
                      />
                    </p>

                    {/* Autor */}
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-cw-border">
                      <Check className="h-3 w-3 text-cw-purple" />
                      <span className="text-[10px] text-cw-muted">Postado por </span>
                      <span className="text-[10px] font-semibold text-cw-purple">
                        <EditableText
                          storeKey={`${STORE_KEY}.${entry.id}.postedBy`}
                          defaultValue={entry.postedBy}
                          className="text-[10px] font-semibold"
                        />
                      </span>
                    </div>
                  </div>

                  {/* Controles do gestor */}
                  {isEditing && (
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => move(entry.id, -1)} disabled={i === 0} title="Mover para cima"
                        className="h-7 w-7 rounded-lg bg-cw-elevated border border-cw-border hover:bg-cw-purple/20 disabled:opacity-30 flex items-center justify-center">
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => move(entry.id, 1)} disabled={i === entries.length - 1} title="Mover para baixo"
                        className="h-7 w-7 rounded-lg bg-cw-elevated border border-cw-border hover:bg-cw-purple/20 disabled:opacity-30 flex items-center justify-center">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => remove(entry.id)} title="Remover"
                        className="h-7 w-7 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 flex items-center justify-center">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {entries.length === 0 && (
          <div className="cw-card p-10 text-center ml-14">
            <Zap className="h-10 w-10 text-cw-border mx-auto mb-3" />
            <p className="text-cw-muted text-sm">Nenhuma entrada ainda.</p>
            {isEditing && <p className="text-xs text-cw-muted mt-1">Clique em "Nova entrada" para começar.</p>}
          </div>
        )}
      </div>

      {isEditing && entries.length > 0 && (
        <p className="text-xs text-cw-muted italic max-w-3xl ml-14">
          💡 Clique nos textos para editar · Clique no tipo/ícone para alternar · Use as setas para reordenar
        </p>
      )}
    </div>
  );
}
