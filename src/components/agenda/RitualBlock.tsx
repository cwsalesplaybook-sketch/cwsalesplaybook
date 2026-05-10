/** Bloco posicionado na grade semanal. */
import type { Ritual } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  ritual: Ritual;
  startMin: number;       // minuto base da grade (ex 540 = 09:00)
  pxPerMinute: number;
  onClick: () => void;
  half?: 'left' | 'right';
}

export function RitualBlock({ ritual, startMin, pxPerMinute, onClick, half }: Props) {
  if (ritual.horarioInicio == null || ritual.horarioFim == null) return null;
  const top = (ritual.horarioInicio - startMin) * pxPerMinute;
  const height = (ritual.horarioFim - ritual.horarioInicio) * pxPerMinute;

  return (
    <button
      onClick={onClick}
      style={{
        top, height,
        left: half === 'right' ? '50%' : 0,
        right: half === 'left' ? '50%' : 0,
      }}
      className={cn(
        'absolute mx-1 rounded-md border-l-2 px-2 py-1 text-left transition-all hover:scale-[1.02] hover:shadow-lg overflow-hidden',
        ritual.cor
      )}
    >
      <p className="text-[11px] font-bold leading-tight truncate">{ritual.nome}</p>
      {ritual.horario && (
        <p className="text-[10px] opacity-80 mt-0.5 truncate">{ritual.horario}</p>
      )}
      {half && <p className="text-[9px] opacity-70 mt-0.5">Squad {half === 'left' ? 'A' : 'B'}</p>}
    </button>
  );
}
