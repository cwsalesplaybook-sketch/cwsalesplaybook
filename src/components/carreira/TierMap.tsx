/** Mapa de tiers e SDRs. Editável no Modo Gestor. */
import { Users, Trash2, Plus } from 'lucide-react';
import { TIERS, type TierInfo } from '@/data/carreira';
import { cn } from '@/lib/utils';
import { EditableText } from '@/admin/EditableText';
import { useEditableContent, useContentStore } from '@/store/contentStore';
import { useEditor } from '@/admin/EditorContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const STORE_KEY = 'carreira.tiers';

export function TierMap() {
  const { isEditing } = useEditor();
  const tiers = useEditableContent<TierInfo[]>(STORE_KEY, TIERS);
  const saveOverride = useContentStore((s) => s.saveOverride);

  const update = async (next: TierInfo[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) { toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };
  const remove = (i: number) => update(tiers.filter((_, idx) => idx !== i));
  const add = () => update([...tiers, { id: `t-${Date.now()}`, nome: 'NOVO TIER', cor: 'from-cw-purple/30 to-cw-purple-dark/10 border-cw-purple/40', perfilLead: 'Perfil.', sdrs: [] }]);
  const updateSdrs = (i: number, csv: string) => {
    const sdrs = csv.split(',').map((s) => s.trim()).filter(Boolean);
    update(tiers.map((t, idx) => idx === i ? { ...t, sdrs } : t));
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tiers.map((t, i) => (
          <div
            key={t.id}
            className={cn(
              'rounded-2xl border bg-gradient-to-br p-5 relative group/tier',
              t.cor
            )}
          >
            {isEditing && (
              <button
                onClick={() => remove(i)}
                className="absolute top-2 right-2 h-7 w-7 rounded bg-cw-red/15 text-cw-red border border-cw-red/30 hover:bg-cw-red/25 flex items-center justify-center opacity-0 group-hover/tier:opacity-100"
                title="Remover tier"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-cw-text/80" />
              <h4 className="font-bold tracking-wider text-cw-text">
                <EditableText storeKey={`${STORE_KEY}.${i}.nome`} defaultValue={t.nome} className="font-bold tracking-wider" />
              </h4>
            </div>
            <p className="text-xs text-cw-muted mb-4 leading-relaxed">
              <EditableText storeKey={`${STORE_KEY}.${i}.perfilLead`} defaultValue={t.perfilLead} multiline className="text-xs" />
            </p>
            {isEditing ? (
              <textarea
                defaultValue={t.sdrs.join(', ')}
                onBlur={(e) => updateSdrs(i, e.target.value)}
                placeholder="Nomes separados por vírgula"
                className="w-full bg-cw-bg/60 border border-cw-border rounded-md px-2 py-1 text-xs text-cw-text min-h-[60px]"
              />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {t.sdrs.map((s) => (
                  <span key={s} className="text-xs px-2 py-1 rounded-md bg-cw-bg/60 border border-cw-border text-cw-text">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {isEditing && (
        <div className="flex justify-center mt-4">
          <Button size="sm" variant="outline" onClick={add} className="border-dashed border-cw-purple-light/40 text-cw-purple-light">
            <Plus className="h-3.5 w-3.5 mr-1" /> Tier
          </Button>
        </div>
      )}
    </div>
  );
}
