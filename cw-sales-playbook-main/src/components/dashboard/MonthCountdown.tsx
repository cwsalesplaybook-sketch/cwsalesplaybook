/** Countdown do mês + status do Berserker. */
import { Swords } from 'lucide-react';
import { useCountdown, endOfMonth } from '@/hooks/useCountdown';
import { useBerserkerStatus } from '@/hooks/useBerserkerStatus';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function MonthCountdown() {
  const c = useCountdown(endOfMonth());
  const { isActive } = useBerserkerStatus();

  const blocks = [
    { label: 'Dias', value: c.days },
    { label: 'Horas', value: c.hours },
    { label: 'Min', value: c.minutes },
    { label: 'Seg', value: c.seconds },
  ];

  return (
    <div className="cw-card p-6 h-full flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-cw-muted font-semibold">Status do Mês</p>
          <h3 className="text-lg font-bold mt-1">Fechamento</h3>
        </div>
        {isActive ? (
          <Badge className="border border-cw-red/50 bg-cw-red/15 text-red-300 animate-pulse gap-1">
            <Swords className="h-3 w-3" /> BERSERKER ATIVO
          </Badge>
        ) : (
          <Badge variant="outline" className="border-cw-border text-cw-muted">
            Mês em andamento
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 mt-auto">
        {blocks.map((b) => (
          <div key={b.label} className={cn(
            'text-center rounded-lg py-3 border',
            isActive
              ? 'gradient-gold border-cw-yellow/40 text-cw-purple-dark'
              : 'bg-cw-bg border-cw-border'
          )}>
            <div className={cn(
              'text-2xl font-black tabular-nums',
              !isActive && 'text-cw-text'
            )}>
              {String(b.value).padStart(2, '0')}
            </div>
            <div className={cn(
              'text-[10px] uppercase tracking-wider mt-1',
              isActive ? 'text-cw-purple-dark/80' : 'text-cw-muted'
            )}>{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
