/** Countdown do Berserker. */
import { useCountdown, endOfMonth } from '@/hooks/useCountdown';
import { useBerserkerStatus } from '@/hooks/useBerserkerStatus';
import { cn } from '@/lib/utils';

export function BerserkerCountdown() {
  const c = useCountdown(endOfMonth());
  const { isActive, nextStart } = useBerserkerStatus();

  const label = isActive ? 'TEMPO RESTANTE NA BATALHA' : 'PRÓXIMO BERSERKER';
  const blocks = isActive
    ? [
        { v: c.days, l: 'Dias' },
        { v: c.hours, l: 'Horas' },
        { v: c.minutes, l: 'Min' },
        { v: c.seconds, l: 'Seg' },
      ]
    : [
        { v: nextStart.getDate(), l: nextStart.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase() },
      ];

  return (
    <div className={cn(
      'rounded-2xl border p-6 text-center',
      isActive
        ? 'border-cw-red/60 gradient-hot'
        : 'border-cw-border bg-cw-surface'
    )}>
      <p className={cn(
        'text-xs uppercase tracking-[0.3em] font-bold',
        isActive ? 'text-cw-yellow animate-pulse' : 'text-cw-muted'
      )}>
        {label}
      </p>
      <div className="flex items-center justify-center gap-3 mt-4">
        {blocks.map((b) => (
          <div
            key={b.l}
            className={cn(
              'rounded-xl px-5 py-4 min-w-[80px] border',
              isActive
                ? 'gradient-gold border-cw-yellow/50 text-cw-purple-dark'
                : 'bg-cw-bg border-cw-border text-cw-text'
            )}
          >
            <div className="text-4xl font-black tabular-nums">{String(b.v).padStart(2, '0')}</div>
            <div className={cn(
              'text-[10px] uppercase tracking-wider mt-1',
              isActive ? 'text-cw-purple-dark/80' : 'text-cw-muted'
            )}>{b.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
