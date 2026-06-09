/** Sales Enablement — hub operacional do time comercial. */
import { useState } from 'react';
import { LayoutDashboard, HelpCircle, Zap, Calculator, Target } from 'lucide-react';
import { GreetingBanner } from './GreetingBanner';
import { MonthCountdown } from './MonthCountdown';
import { TodayRituals } from './TodayRituals';
import { QuickLinks } from './QuickLinks';
import { MuralAvisos } from './MuralAvisos';
import FaqPage from '@/pages/Faq';
import ChangelogPage from '@/pages/ChangelogPage';
import Calculadora from '@/pages/Calculadora';

type Tab = 'inicio' | 'calculadora' | 'faq' | 'changelog';

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'inicio',      label: 'Início',      icon: LayoutDashboard },
  { id: 'calculadora', label: 'Calculadora', icon: Calculator      },
  { id: 'faq',         label: 'FAQ',         icon: HelpCircle      },
  { id: 'changelog',   label: 'Changelog',   icon: Zap             },
];

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('inicio');

  return (
    <>
      {/* Header + tab bar sticky */}
      <div className="sticky top-0 z-20 bg-cw-bg/90 backdrop-blur-sm border-b border-cw-border">
        <div className="px-8 pt-5 pb-0 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-cw-text tracking-tight">Sales Enablement</h1>
            <p className="text-sm text-cw-muted mt-0.5">Ferramentas, conteúdos e análises para vender mais e melhor</p>
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

      {/* Início */}
      {tab === 'inicio' && (
        <div className="p-8 space-y-6">
          {/* Banner Sales Enablement */}
          <div className="relative rounded-2xl overflow-hidden border border-cw-purple/30"
            style={{ background: 'linear-gradient(135deg, #20092F 0%, #2d1760 60%, #3a1a70 100%)' }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-cw-purple/10" />
              <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-[#A543FA]/5" />
            </div>
            <div className="relative px-7 py-6 grid md:grid-cols-2 gap-6 items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cw-yellow/15 border border-cw-yellow/30 mb-3">
                  <Target className="h-3 w-3 text-cw-yellow" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-cw-yellow">O que é Sales Enablement?</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  <span className="font-bold text-white">Sales Enablement</span> (ou Capacitação de Vendas) é a prática estratégica de fornecer ao time de vendas as ferramentas, conteúdos, informações e análises necessárias para que eles possam vender de forma mais eficaz.
                </p>
              </div>
              <div className="md:border-l md:border-white/10 md:pl-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-cw-yellow mb-2">Na prática</p>
                <p className="text-sm text-white/80 leading-relaxed">
                  Para o nosso dia a dia como SDR, esta aba é o seu{' '}
                  <span className="font-black text-cw-yellow">Arsenal de Guerra</span>. Ela centraliza tudo o que você precisa para acelerar suas ligações, quebrar objeções na hora e fechar contratos com mais agilidade.
                </p>
              </div>
            </div>
          </div>

          <GreetingBanner />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MonthCountdown />
            <TodayRituals />
            <QuickLinks />
          </div>
          <MuralAvisos />
        </div>
      )}

      {tab === 'calculadora' && <Calculadora />}
      {tab === 'faq'         && <FaqPage />}
      {tab === 'changelog'   && <ChangelogPage />}
    </>
  );
}
