/** Próximas tarefas do onboarding — top 3 não concluídas. */
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ListChecks, Circle } from 'lucide-react';
import { ONBOARDING } from '@/data/onboarding';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';
import { Button } from '@/components/ui/button';

export function NextTasks() {
  const nav = useNavigate();
  const { checked } = useOnboardingProgress();

  const next = ONBOARDING.filter((i) => !checked[i.id]).slice(0, 3);

  if (next.length === 0) {
    return (
      <div className="cw-card p-6 text-center">
        <p className="text-3xl mb-3">🏆</p>
        <p className="font-bold text-cw-text">Onboarding 100% concluído!</p>
        <p className="text-cw-muted text-sm mt-1">Você é oficialmente um Cardapinho.</p>
      </div>
    );
  }

  return (
    <div className="cw-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-cw-purple/10 flex items-center justify-center">
          <ListChecks className="h-4 w-4 text-cw-purple" />
        </div>
        <h2 className="text-lg font-bold text-cw-text">Suas próximas tarefas</h2>
      </div>
      <ul className="space-y-2.5 mb-5">
        {next.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-cw-elevated border border-cw-border hover:border-cw-purple/40 hover:bg-white transition-all duration-150 cursor-default group"
          >
            <Circle className="h-4 w-4 text-cw-border mt-0.5 shrink-0 group-hover:text-cw-purple transition-colors" />
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[10px] uppercase tracking-widest text-cw-purple font-bold bg-cw-purple/8 px-2 py-0.5 rounded-full mb-1">{item.dia}</span>
              <p className="text-sm text-cw-text leading-snug">{item.atividade}</p>
            </div>
          </li>
        ))}
      </ul>
      <Button onClick={() => nav('/onboarding')} className="w-full gradient-primary text-white rounded-xl h-10 font-semibold">
        Ir para o checklist <ArrowRight className="h-4 w-4 ml-1.5" />
      </Button>
    </div>
  );
}
