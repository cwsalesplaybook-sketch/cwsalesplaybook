/** Página de Changelog — histórico de atualizações do sistema */
import { Zap, Plus, Trash2, ArrowLeft, ArrowRight, Check, ExternalLink } from 'lucide-react';
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
      date: new Date().toLocaleDateString('pt-BR'),
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
            <p className="text-sm text-cw-muted mt-0.5">Últimas atualizações da plataforma.</p>
          </div>
        </div>
        {isEditing && (
          <Button onClick={add} className="gradient-primary text-white h-9">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Nova entrada
          </Button>
        )}
      </div>

      {/* Banner featurebase */}
      <a
        href="https://cardpioweb.featurebase.app/en"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-cw-purple/30 bg-cw-purple/5 hover:bg-cw-purple/10 transition-colors group"
      >
        <Zap className="h-4 w-4 text-cw-purple shrink-0" />
        <p className="text-[13px] text-cw-muted flex-1">
          Veja <span className="font-semibold text-cw-purple">todos os changelogs da plataforma</span> no portal oficial do Cardápio Web
        </p>
        <ExternalLink className="h-3.5 w-3.5 text-cw-purple/60 group-hover:text-cw-purple shrink-0 transition-colors" />
      </a>

      {/* Cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {entries.map((entry, i) => {
          const cfg = TYPE_CONFIG[entry.type];
          return (
            <div key={entry.id} className="group cw-card p-6 flex flex-col gap-4">
              {/* Type badge + date row */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={isEditing ? () => cycleType(entry.id) : undefined}
                  disabled={!isEditing}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${cfg.className} ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
                >
                  {cfg.label}
                </button>
                <span className="text-[11px] text-cw-muted ml-auto">
                  <EditableText
                    storeKey={`${STORE_KEY}.${entry.id}.date`}
                    defaultValue={entry.date}
                    className="text-[11px]"
                  />
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-bold text-cw-text leading-snug">
                <EditableText
                  storeKey={`${STORE_KEY}.${entry.id}.title`}
                  defaultValue={entry.title}
                  className="text-[17px] font-bold"
                />
              </h3>

              {/* Description */}
              <div className="text-[13px] text-cw-muted leading-relaxed flex-1" style={{ whiteSpace: 'pre-wrap' }}>
                <EditableText
                  storeKey={`${STORE_KEY}.${entry.id}.description`}
                  defaultValue={entry.description}
                  multiline
                  className="text-[13px]"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-cw-border">
                <div className="flex items-center gap-1.5">
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

                {/* Controles do gestor */}
                {isEditing && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => move(entry.id, -1)} disabled={i === 0} title="Mover para esquerda"
                      className="h-7 w-7 rounded-lg bg-cw-elevated border border-cw-border hover:bg-cw-purple/20 disabled:opacity-30 flex items-center justify-center">
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => move(entry.id, 1)} disabled={i === entries.length - 1} title="Mover para direita"
                      className="h-7 w-7 rounded-lg bg-cw-elevated border border-cw-border hover:bg-cw-purple/20 disabled:opacity-30 flex items-center justify-center">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => remove(entry.id)} title="Remover"
                      className="h-7 w-7 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 flex items-center justify-center">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {entries.length === 0 && (
          <div className="cw-card p-10 text-center col-span-full">
            <Zap className="h-10 w-10 text-cw-border mx-auto mb-3" />
            <p className="text-cw-muted text-sm">Nenhuma entrada ainda.</p>
            {isEditing && <p className="text-xs text-cw-muted mt-1">Clique em "Nova entrada" para começar.</p>}
          </div>
        )}
      </div>

      {isEditing && entries.length > 0 && (
        <p className="text-xs text-cw-muted italic">
          💡 Clique nos textos para editar · Clique no tipo para alternar · Use as setas para reordenar
        </p>
      )}
    </div>
  );
}
