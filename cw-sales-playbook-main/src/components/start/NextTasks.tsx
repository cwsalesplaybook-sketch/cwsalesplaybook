/** Próximas tarefas do onboarding — top 3 não concluídas. */
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ListChecks } from 'lucide-react';
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
        <p className="text-cw-yellow text-2xl mb-2">🏆</p>
        <p className="font-bold">Onboarding 100% concluído!</p>
        <p className="text-cw-muted text-sm">Você é oficialmente um Cardapinho.</p>
      </div>
    );
  }

  return (
    <div className="cw-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <ListChecks className="h-5 w-5 text-cw-purple-light" />
        <h2 className="text-lg font-bold">Suas próximas tarefas</h2>
      </div>
      <ul className="space-y-2 mb-4">
        {next.map((item) => (
          <li key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-cw-bg border border-cw-border">
            <div className="text-xs uppercase tracking-wider text-cw-purple-light font-semibold shrink-0 mt-0.5">{item.dia}</div>
            <span className="text-sm">{item.atividade}</span>
          </li>
        ))}
      </ul>
      <Button onClick={() => nav('/onboarding')} className="w-full gradient-primary text-white">
        Ir para o checklist <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
