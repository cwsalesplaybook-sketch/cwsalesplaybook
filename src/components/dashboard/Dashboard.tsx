/** Central — hub do time: mural, FAQ e novidades numa só aba. */
import { useState } from 'react';
import { LayoutDashboard, HelpCircle, Zap } from 'lucide-react';
import { GreetingBanner } from './GreetingBanner';
import { MonthCountdown } from './MonthCountdown';
import { TodayRituals } from './TodayRituals';
import { QuickLinks } from './QuickLinks';
import { MuralAvisos } from './MuralAvisos';
import FaqPage from '@/pages/Faq';
import ChangelogPage from '@/pages/ChangelogPage';

type Tab = 'inicio' | 'faq' | 'changelog';

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'inicio',    label: 'Início',    icon: LayoutDashboard },
  { id: 'faq',       label: 'FAQ',       icon: HelpCircle      },
  { id: 'changelog', label: 'Changelog', icon: Zap             },
];

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('inicio');

  return (
    <>
      {/* Header + tab bar sticky juntos */}
      <div className="sticky top-0 z-20 bg-cw-bg/90 backdrop-blur-sm border-b border-cw-border">
        <div className="px-8 pt-5 pb-0 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-cw-text tracking-tight">Central</h1>
            <p className="text-sm text-cw-muted mt-0.5">Avisos, dúvidas e novidades do time</p>
          </div>
        </div>
        <div className="px-8 flex gap-0 mt-3">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                  tab === t.id
                    ? 'border-cw-purple text-cw-purple'
                    : 'border-transparent text-cw-muted hover:text-cw-text'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === 'inicio' && (
        <div className="p-8 space-y-6">
          <GreetingBanner />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MonthCountdown />
            <TodayRituals />
            <QuickLinks />
          </div>
          <MuralAvisos />
        </div>
      )}

      {tab === 'faq' && <FaqPage />}
      {tab === 'changelog' && <ChangelogPage />}
    </>
  );
}
