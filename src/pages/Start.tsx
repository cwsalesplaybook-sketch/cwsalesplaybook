/** Página /start — Comece por Aqui. */
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { WelcomeHero } from '@/components/start/WelcomeHero';
import { NextTasks } from '@/components/start/NextTasks';
import { TimeGrid } from '@/components/start/TimeGrid';
import { Glossario } from '@/components/start/Glossario';
import { TimelineEmpresa } from '@/components/start/TimelineEmpresa';
import { FaqNovato } from '@/components/start/FaqNovato';
import { Valores } from '@/components/start/Valores';
import { useSidebarContext } from '@/context/SidebarContext';

export default function Start() {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const { setOnboardingActive } = useSidebarContext();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const done = data.user?.user_metadata?.onboarding_done === true;
      const needs = !done;
      setNeedsOnboarding(needs);
      setOnboardingActive(needs); // bloqueia sidebar se precisa de onboarding
    });
    return () => { setOnboardingActive(false); };
  }, []);

  const handleComplete = () => {
    setNeedsOnboarding(false);
    setOnboardingActive(false);
  };

  if (needsOnboarding === null) return null;

  if (needsOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <OnboardingWizard inline onComplete={handleComplete} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <WelcomeHero />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><TimelineEmpresa /></div>
        <NextTasks />
      </div>
      <Valores />
      <TimeGrid />
      <Glossario />
      <FaqNovato />
    </div>
  );
}
