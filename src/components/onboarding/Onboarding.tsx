/** Seção Onboarding — checklist 13 dias + tracker de roleplays + bancos SPIN/Objeções + 1º 1:1. */
import { Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { ONBOARDING } from '@/data/onboarding';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';
import { OnboardingDay } from './OnboardingDay';
import { OnboardingProgress } from './OnboardingProgress';
import { RoleplayTracker } from './RoleplayTracker';
import { SpinBank } from './SpinBank';
import { ObjecoesBank } from './ObjecoesBank';
import { PrimeiroOneOnOne } from './PrimeiroOneOnOne';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Onboarding() {
  const { checked, toggle, done, total, percent } = useOnboardingProgress();

  const dias = Array.from(new Set(ONBOARDING.map((i) => i.dia)));

  return (
    <>
      <Header titulo="Onboarding" subtitulo="Bem-vindo(a) ao time. Você está no lugar certo." />
      <div className="p-8 space-y-6 max-w-5xl">
        <div className="cw-card p-6 bg-gradient-to-br from-cw-surface to-cw-elevated">
          <p className="text-cw-muted leading-relaxed">
            Esse guia foi feito para te ajudar a se sentir{' '}
            <span className="text-cw-text font-semibold">preparado(a), confiante e parte do time</span>{' '}
            o mais rápido possível. São <strong className="text-cw-purple-light">13 dias estruturados</strong> + acompanhamento contínuo.
          </p>
        </div>

        <OnboardingProgress done={done} total={total} percent={percent} checked={checked} />

        <Tabs defaultValue="checklist" className="space-y-4">
          <TabsList className="bg-cw-bg border border-cw-border">
            <TabsTrigger value="checklist" className="data-[state=active]:bg-cw-purple data-[state=active]:text-white">
              📋 Checklist (13 dias)
            </TabsTrigger>
            <TabsTrigger value="roleplays" className="data-[state=active]:bg-cw-purple data-[state=active]:text-white">
              🎭 Roleplays
            </TabsTrigger>
            <TabsTrigger value="spin" className="data-[state=active]:bg-cw-purple data-[state=active]:text-white">
              🧠 SPIN
            </TabsTrigger>
            <TabsTrigger value="objecoes" className="data-[state=active]:bg-cw-purple data-[state=active]:text-white">
              🛡️ Objeções
            </TabsTrigger>
            <TabsTrigger value="oneonone" className="data-[state=active]:bg-cw-purple data-[state=active]:text-white">
              ☕ 1º 1:1
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="space-y-3">
            {dias.map((dia, idx) => {
              const itens = ONBOARDING.filter((i) => i.dia === dia);
              const macro = itens[0]?.macrotopico ?? '';
              return (
                <OnboardingDay
                  key={dia}
                  dia={dia}
                  macrotopico={macro}
                  itens={itens}
                  checked={checked}
                  onToggle={toggle}
                  defaultOpen={idx === 0}
                />
              );
            })}

            <div className="cw-card p-5 border-l-4 border-l-cw-yellow bg-cw-yellow/5">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-cw-yellow shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-cw-yellow mb-1">Ramp-up de aproximadamente 3 meses</p>
                  <p className="text-sm text-cw-muted leading-relaxed">
                    Durante esse período você terá <span className="text-cw-text font-medium">1:1s quinzenais</span>{' '}
                    específicos para acompanhar sua integração e evolução.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roleplays"><RoleplayTracker /></TabsContent>
          <TabsContent value="spin"><SpinBank /></TabsContent>
          <TabsContent value="objecoes"><ObjecoesBank /></TabsContent>
          <TabsContent value="oneonone"><PrimeiroOneOnOne /></TabsContent>
        </Tabs>
      </div>
    </>
  );
}
