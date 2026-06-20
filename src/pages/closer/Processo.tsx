/** Dashboard de Closer — Processo de Venda
 *  Funis de Vendas + SPIN + Etapas da reunião + Critérios + Follow-up. */
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  EtapasReuniaoSection,
  CriteriosSection,
  FollowUpSection,
  FunisSection,
  SpinSection,
} from '@/components/closer/ProcessoSection';

type Tab = 'etapas' | 'criterios' | 'followup' | 'funis' | 'spin';

const TABS: { id: Tab; label: string }[] = [
  { id: 'etapas', label: 'Etapas da reunião' },
  { id: 'criterios', label: 'Critérios' },
  { id: 'followup', label: 'Follow-up' },
  { id: 'funis', label: 'Funis de Vendas' },
  { id: 'spin', label: 'SPIN' },
];

export default function CloserProcesso() {
  const [tab, setTab] = useState<Tab>('etapas');
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Processo de Venda</h1>
        <p className="text-sm text-cw-muted mt-1">Funis, SPIN, etapas da reunião, critérios de avaliação e follow-up.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'text-xs font-medium px-3 py-1.5 rounded-full border transition-colors',
              tab === t.id ? 'gradient-primary text-white border-transparent' : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'etapas' && <EtapasReuniaoSection />}
      {tab === 'criterios' && <CriteriosSection />}
      {tab === 'followup' && <FollowUpSection />}
      {tab === 'funis' && <FunisSection />}
      {tab === 'spin' && <SpinSection />}
    </div>
  );
}
