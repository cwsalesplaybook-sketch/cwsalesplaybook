/** Página /start — Comece por Aqui. */
import { Header } from '@/components/layout/Header';
import { WelcomeHero } from '@/components/start/WelcomeHero';
import { NextTasks } from '@/components/start/NextTasks';
import { TimeGrid } from '@/components/start/TimeGrid';
import { Glossario } from '@/components/start/Glossario';
import { TimelineEmpresa } from '@/components/start/TimelineEmpresa';
import { FaqNovato } from '@/components/start/FaqNovato';

export default function Start() {
  return (
    <>
      <Header titulo="Comece por aqui" subtitulo="Seu mapa para os primeiros 30 dias" />
      <div className="p-8 space-y-6 max-w-6xl">
        <WelcomeHero />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><TimelineEmpresa /></div>
          <NextTasks />
        </div>

        <TimeGrid />
        <Glossario />
        <FaqNovato />
      </div>
    </>
  );
}
