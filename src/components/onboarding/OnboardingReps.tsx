/** Onboarding de Representantes — checklist próprio (3 fases, 8 itens),
 *  espelha o guia de primeiros passos do portal de reps. Progresso salvo
 *  só neste navegador (localStorage), sem sync com Supabase por enquanto. */
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { REPS_ONBOARDING } from '@/data/playbookReps';

const STORAGE_KEY = 'cw-reps-onboarding-checks';

function loadChecks(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function OnboardingReps() {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadChecks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const totalItens = REPS_ONBOARDING.reduce((acc, fase) => acc + fase.itens.length, 0);
  const doneItens = Object.values(checked).filter(Boolean).length;

  const toggle = (id: string) => setChecked(c => ({ ...c, [id]: !c[id] }));

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Onboarding</h1>
        <p className="text-sm text-cw-muted mt-1">Seu guia de primeiros passos como representante de canal.</p>
      </div>

      <div className="cw-card p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-cw-text">Progresso geral</p>
          <p className="text-sm font-black text-cw-purple-light">{doneItens}/{totalItens} concluídos</p>
        </div>
        <div className="h-2 rounded-full bg-cw-elevated overflow-hidden">
          <div
            className="h-full rounded-full gradient-primary transition-all"
            style={{ width: `${totalItens > 0 ? (doneItens / totalItens) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-5">
        {REPS_ONBOARDING.map(fase => (
          <div key={fase.fase}>
            <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-2">{fase.fase}</p>
            <div className="space-y-2">
              {fase.itens.map((item, i) => {
                const id = `${fase.fase}-${i}`;
                const isChecked = !!checked[id];
                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    className="w-full cw-card p-3.5 flex items-center gap-3 text-left hover:bg-cw-elevated transition-colors"
                  >
                    <span className={cn(
                      'h-5 w-5 rounded-md border shrink-0 flex items-center justify-center transition-colors',
                      isChecked ? 'bg-cw-purple border-cw-purple' : 'border-cw-border',
                    )}>
                      {isChecked && <Check className="h-3.5 w-3.5 text-white" />}
                    </span>
                    <span className={cn('text-sm', isChecked ? 'text-cw-muted line-through' : 'text-cw-text')}>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
