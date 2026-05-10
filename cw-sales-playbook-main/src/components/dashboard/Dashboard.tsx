/** Seção Dashboard. */
import { Header } from '@/components/layout/Header';
import { GreetingBanner } from './GreetingBanner';
import { MonthCountdown } from './MonthCountdown';
import { TodayRituals } from './TodayRituals';
import { QuickLinks } from './QuickLinks';
import { MuralAvisos } from './MuralAvisos';

export default function Dashboard() {
  return (
    <>
      <Header
        titulo="Dashboard"
        subtitulo={new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
      />
      <div className="p-8 space-y-6">
        <GreetingBanner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MonthCountdown />
          <TodayRituals />
          <QuickLinks />
        </div>

        <MuralAvisos />
      </div>
    </>
  );
}
