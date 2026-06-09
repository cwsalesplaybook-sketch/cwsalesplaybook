/** Seção Cultura — grito de guerra + cards + rotinas do time. */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Megaphone, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CULTURA_CARDS, type CulturaCard } from '@/data/cultura';
import { cn } from '@/lib/utils';
import { GritoDeGuerra } from './GritoDeGuerra';
import { useEditableContent, useContentStore } from '@/store/contentStore';
import { useEditor } from '@/admin/EditorContext';
import { EditableText } from '@/admin/EditableText';
import { toast } from '@/hooks/use-toast';
import { RITUAIS } from '@/data/rituais';
import { useSidebarContext } from '@/context/SidebarContext';
import { RitualCard } from '@/components/agenda/RitualCard';
import { RitualPanel } from '@/components/agenda/RitualPanel';
import type { Ritual } from '@/types';

const BORDER: Record<CulturaCard['cor'], string> = {
  orange: 'border-l-orange-400',
  blue:   'border-l-blue-400',
  green:  'border-l-green-500',
  purple: 'border-l-cw-purple',
  red:    'border-l-red-500',
  yellow: 'border-l-yellow-400',
};

const BADGE_COLOR: Record<CulturaCard['cor'], string> = {
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  blue:   'bg-blue-100 text-blue-700 border-blue-200',
  green:  'bg-green-100 text-green-700 border-green-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  red:    'bg-red-100 text-red-700 border-red-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const STORE_KEY = 'cultura.cards';

function CulturaCardItem({ card, idx, onRemove }: { card: CulturaCard; idx: number; onRemove?: () => void }) {
  const nav = useNavigate();
  const { isEditing } = useEditor();
  const [shout, setShout] = useState(false);

  const handleAction = () => {
    if (card.acaoTipo === 'gritar') { setShout(true); setTimeout(() => setShout(false), 2000); }
    else if (card.acaoTipo === 'navegar' && card.acaoDestino) nav(card.acaoDestino);
  };

  return (
    <div className={cn(
      'relative group/cc text-left cw-card border-l-4 p-5 transition-all',
      BORDER[card.cor],
      card.fullWidth && 'lg:col-span-2'
    )}>
      {isEditing && onRemove && (
        <button onClick={onRemove}
          className="absolute top-2 right-2 z-10 h-7 w-7 rounded bg-red-100 text-red-500 border border-red-200 hover:bg-red-200 flex items-center justify-center opacity-0 group-hover/cc:opacity-100 transition-opacity">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center shrink-0 text-lg">
          {card.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-cw-text leading-tight text-lg">
            <EditableText storeKey={`${STORE_KEY}.${idx}.titulo`} defaultValue={card.titulo} className="text-lg font-semibold" />
          </h4>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-md border', BADGE_COLOR[card.cor])}>
          {card.titulo}
        </span>
      </div>

      <p className="text-xs text-cw-muted line-clamp-3 mb-3">
        <EditableText storeKey={`${STORE_KEY}.${idx}.descricao`} defaultValue={card.descricao} multiline className="text-xs text-cw-muted" />
      </p>

      {card.destaque && (
        <div className="text-xs text-cw-text/80 bg-cw-elevated border border-cw-border rounded-lg px-3 py-2 mb-3">
          <EditableText storeKey={`${STORE_KEY}.${idx}.destaque`} defaultValue={card.destaque} multiline className="text-xs" />
        </div>
      )}

      {card.badge && (
        <Badge variant="outline" className="border-cw-border text-cw-muted text-[10px] mb-3">
          <EditableText storeKey={`${STORE_KEY}.${idx}.badge`} defaultValue={card.badge} className="text-xs" />
        </Badge>
      )}

      {card.acaoLabel && (
        <button onClick={handleAction}
          className={cn(
            'flex items-center gap-2 mt-1 px-4 py-2 rounded-xl text-sm font-bold transition-opacity hover:opacity-90',
            card.acaoTipo === 'gritar'
              ? 'bg-cw-yellow text-cw-purple-dark'
              : 'gradient-primary text-white'
          )}>
          {card.acaoTipo === 'gritar' ? <Megaphone className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          {card.acaoLabel}
        </button>
      )}
    </div>
  );
}

export default function Cultura() {
  const { isEditing } = useEditor();
  const { papel } = useSidebarContext();
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const cards = useEditableContent<CulturaCard[]>(STORE_KEY, CULTURA_CARDS);
  const saveOverride = useContentStore((s) => s.saveOverride);

  const rituais = useMemo(() =>
    RITUAIS.filter((r) =>
      papel === 'SDR'
        ? r.participantes === 'SDR' || r.participantes === 'Ambos'
        : r.participantes === 'Closer' || r.participantes === 'Ambos'
    ), [papel]);

  const update = async (next: CulturaCard[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) { toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };
  const add = () => update([...cards, { id: `c-${Date.now()}`, titulo: 'Novo Card', emoji: '✨', cor: 'purple', descricao: 'Descrição.' }]);
  const remove = (idx: number) => update(cards.filter((_, i) => i !== idx));

  return (
    <>
      <div className="p-8 space-y-6">
        <div className="cw-card p-8 gradient-surface">
          <p className="text-2xl md:text-3xl font-bold tracking-tight max-w-3xl">
            "<EditableText
              storeKey="cultura.frase"
              defaultValue="A cultura não é o que está escrito. É o que é vivido todo dia."
              className="text-2xl md:text-3xl font-bold"
              multiline
            />"
          </p>
        </div>

        <GritoDeGuerra />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c, idx) => c.fullWidth ? null : (
            <CulturaCardItem key={c.id} card={c} idx={idx} onRemove={isEditing ? () => remove(idx) : undefined} />
          ))}
          {rituais.map((r) => (
            <RitualCard key={r.id} ritual={r} onClick={() => setSelectedRitual(r)} />
          ))}
        </div>

        {isEditing && (
          <div className="flex justify-center">
            <Button onClick={add} variant="outline" className="border-dashed border-cw-purple-light/40 text-cw-purple-light hover:bg-cw-purple-light/10">
              <Plus className="h-4 w-4 mr-1" /> Novo card de cultura
            </Button>
          </div>
        )}
      </div>
      <RitualPanel ritual={selectedRitual} onClose={() => setSelectedRitual(null)} />
    </>
  );
}
