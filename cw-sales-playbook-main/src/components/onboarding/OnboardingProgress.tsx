/** Barra de XP do onboarding com badges desbloqueáveis. */
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useBadges } from '@/hooks/useBadges';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Props {
  done: number;
  total: number;
  percent: number;
  checked: Record<string, boolean>;
}

const SHOWN_KEY = 'cw-shown-badges';

export function OnboardingProgress({ done, total, percent, checked }: Props) {
  const badges = useBadges(checked);
  const prevUnlocked = useRef<Set<string>>(new Set());

  useEffect(() => {
    const shown: string[] = JSON.parse(localStorage.getItem(SHOWN_KEY) || '[]');
    prevUnlocked.current = new Set(shown);
  }, []);

  useEffect(() => {
    const shown: string[] = JSON.parse(localStorage.getItem(SHOWN_KEY) || '[]');
    const set = new Set(shown);
    badges.forEach((b) => {
      if (b.unlocked && !set.has(b.id)) {
        set.add(b.id);
        toast({
          title: `${b.emoji} Badge desbloqueado: ${b.nome}`,
          description: b.descricao,
        });
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.3 },
          colors: ['#760F95', '#9B1AC0', '#FBBC04', '#EA4335'],
        });
      }
    });
    localStorage.setItem(SHOWN_KEY, JSON.stringify([...set]));
  }, [badges]);

  return (
    <div className="cw-card p-6 space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-cw-muted">Seu XP de Onboarding</p>
          <p className="text-2xl font-bold mt-1">
            {done} <span className="text-cw-muted text-base">/ {total} itens concluídos</span>
          </p>
        </div>
        <span className="text-3xl font-black text-gradient-primary tabular-nums">{percent}%</span>
      </div>
      <Progress value={percent} className="h-3 bg-cw-bg [&>div]:bg-gradient-to-r [&>div]:from-cw-purple [&>div]:to-cw-purple-light" />

      <div className="pt-2 border-t border-cw-border">
        <p className="text-xs uppercase tracking-wider text-cw-muted mb-3">Badges</p>
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <Tooltip key={b.id}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'h-12 w-12 rounded-xl flex items-center justify-center text-2xl border-2 transition-all',
                    b.unlocked
                      ? 'border-cw-yellow bg-gradient-to-br from-cw-purple to-cw-purple-dark scale-100'
                      : 'border-cw-border bg-cw-bg grayscale opacity-40'
                  )}
                >
                  {b.emoji}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-cw-elevated border-cw-border max-w-xs">
                <p className="font-bold text-sm">{b.nome} {b.unlocked ? '✓' : '🔒'}</p>
                <p className="text-xs text-cw-muted">{b.descricao}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
