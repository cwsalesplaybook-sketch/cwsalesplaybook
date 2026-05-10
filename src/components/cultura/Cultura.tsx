/** Seção Cultura — agora interativa: cards + mural + histórias + semana + mood + grito de guerra. */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Megaphone, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CULTURA_CARDS, type CulturaCard } from '@/data/cultura';
import { cn } from '@/lib/utils';
import { MuralFotos } from './MuralFotos';
import { HistoriasVitoria } from './HistoriasVitoria';
import { SemanaCW } from './SemanaCW';
import { MoodMeter } from './MoodMeter';
import { GritoDeGuerra } from './GritoDeGuerra';
import { useEditableContent, useContentStore } from '@/store/contentStore';
import { useEditor } from '@/admin/EditorContext';
import { EditableText } from '@/admin/EditableText';
import { toast } from '@/hooks/use-toast';

const COLOR_MAP: Record<CulturaCard['cor'], { border: string; accent: string; bg: string }> = {
  orange: { border: 'border-cw-purple/40',      accent: 'text-cw-purple-light', bg: 'from-cw-purple/15 to-transparent' },
  blue:   { border: 'border-cw-purple/40',      accent: 'text-purple-300',       bg: 'from-cw-purple/15 to-transparent' },
  green:  { border: 'border-cw-yellow/40',      accent: 'text-cw-yellow',        bg: 'from-cw-yellow/10 to-transparent' },
  purple: { border: 'border-cw-purple-dark/50', accent: 'text-cw-purple-light',  bg: 'from-cw-purple-dark/20 to-transparent' },
  red:    { border: 'border-cw-red/50',         accent: 'text-red-300',          bg: 'from-cw-red/15 to-transparent' },
  yellow: { border: 'border-cw-yellow/40',      accent: 'text-cw-yellow',        bg: 'from-cw-yellow/10 to-transparent' },
};

const STORE_KEY = 'cultura.cards';

function CardBlock({ card, idx, onRemove }: { card: CulturaCard; idx: number; onRemove?: () => void }) {
  const c = COLOR_MAP[card.cor];
  const nav = useNavigate();
  const { isEditing } = useEditor();
  const [shout, setShout] = useState(false);

  const handleAction = () => {
    if (card.acaoTipo === 'gritar') {
      setShout(true);
      setTimeout(() => setShout(false), 2000);
    } else if (card.acaoTipo === 'navegar' && card.acaoDestino) {
      nav(card.acaoDestino);
    }
  };

  const isHotBanner = card.fullWidth;

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border p-6 group/cc',
      isHotBanner ? 'gradient-hot border-cw-purple/40' : 'bg-cw-surface',
      !isHotBanner && c.border,
      card.fullWidth && 'lg:col-span-2'
    )}>
      {!isHotBanner && (
        <div className={cn('absolute inset-0 bg-gradient-to-br pointer-events-none', c.bg)} />
      )}
      {isEditing && onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 h-7 w-7 rounded bg-cw-red/20 text-cw-red border border-cw-red/40 hover:bg-cw-red/30 flex items-center justify-center opacity-0 group-hover/cc:opacity-100 transition-opacity"
          title="Remover card"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{card.emoji}</span>
          <h3 className={cn('text-xl font-bold', isHotBanner ? 'text-white' : c.accent)}>
            <EditableText storeKey={`${STORE_KEY}.${idx}.titulo`} defaultValue={card.titulo} className="text-xl font-bold" />
          </h3>
        </div>

        {isHotBanner && card.destaque ? (
          <p className={cn(
            'text-2xl md:text-3xl font-black text-center my-6 leading-tight transition-transform',
            shout && 'animate-war-pulse'
          )}>
            <span className="text-gradient-gold">
              <EditableText storeKey={`${STORE_KEY}.${idx}.destaque`} defaultValue={card.destaque} className="text-2xl md:text-3xl font-black text-gradient-gold" multiline />
            </span>
          </p>
        ) : (
          <p className="text-cw-muted leading-relaxed mb-4">
            <EditableText storeKey={`${STORE_KEY}.${idx}.descricao`} defaultValue={card.descricao} multiline className="text-cw-muted" />
          </p>
        )}

        {isHotBanner && (
          <p className="text-white/90 leading-relaxed mb-4 text-center">
            <EditableText storeKey={`${STORE_KEY}.${idx}.descricao`} defaultValue={card.descricao} multiline className="text-white/90" />
          </p>
        )}

        {!isHotBanner && card.destaque && (
          <div className={cn(
            'flex items-start gap-2 p-3 rounded-lg border text-sm mb-4',
            card.cor === 'green'
              ? 'border-cw-red/40 bg-cw-red/10 text-red-300'
              : 'border-cw-border bg-cw-bg text-cw-text'
          )}>
            {card.cor === 'green' && <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />}
            <span>
              <EditableText storeKey={`${STORE_KEY}.${idx}.destaque`} defaultValue={card.destaque} multiline className="text-sm" />
            </span>
          </div>
        )}

        {card.badge && (
          <Badge variant="outline" className="border-cw-border text-cw-muted">
            <EditableText storeKey={`${STORE_KEY}.${idx}.badge`} defaultValue={card.badge} className="text-xs" />
          </Badge>
        )}

        {card.acaoLabel && (
          <Button
            onClick={handleAction}
            className={cn(
              'mt-4 gap-2',
              card.acaoTipo === 'gritar'
                ? 'bg-cw-yellow hover:brightness-110 text-cw-purple-dark font-bold'
                : 'gradient-primary hover:brightness-110 text-white'
            )}
          >
            {card.acaoTipo === 'gritar' ? <Megaphone className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            {card.acaoLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Cultura() {
  const { isEditing } = useEditor();
  const cards = useEditableContent<CulturaCard[]>(STORE_KEY, CULTURA_CARDS);
  const saveOverride = useContentStore((s) => s.saveOverride);

  const update = async (next: CulturaCard[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) { toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };
  const add = () => update([...cards, {
    id: `c-${Date.now()}`, titulo: 'Novo Card', emoji: '✨', cor: 'purple', descricao: 'Descrição.',
  }]);
  const remove = (idx: number) => update(cards.filter((_, i) => i !== idx));

  return (
    <>
      <Header titulo="Cultura" subtitulo="A cultura da CW vivida todos os dias" />
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cards.map((c, idx) => (
            <CardBlock key={c.id} card={c} idx={idx} onRemove={isEditing ? () => remove(idx) : undefined} />
          ))}
        </div>

        {isEditing && (
          <div className="flex justify-center">
            <Button onClick={add} variant="outline" className="border-dashed border-cw-purple-light/40 text-cw-purple-light hover:bg-cw-purple-light/10">
              <Plus className="h-4 w-4 mr-1" /> Novo card de cultura
            </Button>
          </div>
        )}

        <SemanaCW />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><HistoriasVitoria /></div>
          <MoodMeter />
        </div>

        <MuralFotos />
      </div>
    </>
  );
}
