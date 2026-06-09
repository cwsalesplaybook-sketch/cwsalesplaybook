/** Hall da Fama dos Berserkers — editável no Modo Gestor. */
import { Crown, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HALL_OF_FAME as HALL_PADRAO, type HallEntry } from '@/data/berserker';
import { useEditor } from '@/admin/EditorContext';
import { useContentStore, useEditableContent } from '@/store/contentStore';
import { EditableText } from '@/admin/EditableText';
import { toast } from '@/hooks/use-toast';

const STORE_KEY = 'berserker.hallOfFame';

function initials(n: string) {
  return n.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

export function HallOfFame() {
  const { isEditing } = useEditor();
  const hall = useEditableContent<HallEntry[]>(STORE_KEY, HALL_PADRAO);
  const saveOverride = useContentStore((s) => s.saveOverride);

  const update = async (next: HallEntry[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao salvar';
      toast({ title: 'Falha ao salvar', description: msg, variant: 'destructive' });
    }
  };

  const add = () => {
    const novo: HallEntry = {
      nome: 'Novo Berserker',
      squad: 'Squad Águia',
      mes: 'Mes/Ano',
      metrica: 'Métrica',
      frase: 'Frase de inspiração.',
    };
    update([...hall, novo]);
  };

  const remove = (idx: number) => update(hall.filter((_, i) => i !== idx));

  return (
    <div className="cw-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-bold">Hall da Fama</h3>
        </div>
        {isEditing && (
          <Button size="sm" onClick={add} className="gradient-primary text-white h-8">
            <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hall.map((h, idx) => (
          <div
            key={`${h.nome}-${idx}`}
            className="group relative rounded-xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-cw-surface to-cw-bg p-5 text-center"
          >
            {isEditing && (
              <button
                onClick={() => remove(idx)}
                className="absolute top-2 right-2 h-6 w-6 rounded bg-cw-red/15 text-cw-red border border-cw-red/30 hover:bg-cw-red/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remover"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
            <div className="mx-auto h-24 w-24 rounded-full overflow-hidden shadow-xl shadow-yellow-500/20 border-[3px] border-yellow-400/70">
              {h.foto
                ? <img src={h.foto} alt={h.nome} className="h-full w-full object-cover object-top" />
                : <div className="h-full w-full bg-gradient-to-br from-yellow-500 to-amber-700 flex items-center justify-center text-xl font-black text-white">{initials(h.nome)}</div>
              }
            </div>
            <p className="font-black mt-3 text-cw-text text-base">
              <EditableText storeKey={`${STORE_KEY}.${idx}.nome`} defaultValue={h.nome} />
            </p>
            <p className="text-xs text-cw-text/60 mt-0.5 font-medium">
              <EditableText storeKey={`${STORE_KEY}.${idx}.squad`} defaultValue={h.squad} className="text-xs" />
            </p>
            <p className="text-xs text-yellow-600 font-semibold mt-2 italic leading-snug">
              "<EditableText storeKey={`${STORE_KEY}.${idx}.destaque`} defaultValue={(h as any).destaque ?? ''} className="text-xs" />"
            </p>
            <div className="mt-2 inline-block bg-yellow-500/20 border border-yellow-500/40 rounded-full px-3 py-0.5">
              <p className="text-xs text-yellow-600 font-bold">
                <EditableText storeKey={`${STORE_KEY}.${idx}.metrica`} defaultValue={h.metrica} className="text-xs" />
              </p>
            </div>
            <p className="text-sm text-cw-text/70 italic mt-3 leading-relaxed">
              "<EditableText storeKey={`${STORE_KEY}.${idx}.frase`} defaultValue={h.frase} multiline className="text-sm" />"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
