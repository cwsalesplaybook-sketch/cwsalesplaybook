/** Seções de Rotina & Progressão: Hora Ouro e níveis de carreira. */
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  CLOSER_HORA_OURO_DEF,
  CLOSER_HORA_OURO_ROTINA,
  CLOSER_HORA_OURO_PRATICAS,
  CLOSER_HORA_OURO_CRM,
  CLOSER_HORA_OURO_CRM_OBS,
  CLOSER_PROGRESSAO,
} from '@/data/playbookCloser';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">{children}</p>;
}

/* ----------------------- HORA OURO ----------------------- */

export function HoraOuroSection() {
  const [tab, setTab] = useState<'rotina' | 'praticas' | 'crm'>('rotina');

  return (
    <div className="space-y-5">
      <div className="cw-card p-5 space-y-3">
        <SectionTitle>Hora Ouro</SectionTitle>
        <p className="text-sm text-cw-text font-semibold">Definição</p>
        <p className="text-sm text-cw-muted leading-relaxed whitespace-pre-line">{CLOSER_HORA_OURO_DEF}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {([['rotina', 'Rotina'], ['praticas', 'Boas práticas'], ['crm', 'Atualização do CRM']] as const).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'text-xs font-medium px-4 py-2 rounded-full border transition-colors',
              tab === t ? 'gradient-primary text-white border-transparent' : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'rotina' && (
        <div className="space-y-4">
          {CLOSER_HORA_OURO_ROTINA.map(g => (
            <div key={g.grupo} className="cw-card p-4 space-y-3">
              <p className="font-bold text-sm text-cw-text">{g.grupo}</p>
              <ul className="space-y-2">
                {g.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-cw-muted">
                    <span className="text-cw-purple mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {tab === 'praticas' && (
        <div className="cw-card p-4 space-y-3">
          <p className="font-bold text-sm text-cw-text mb-2">Boas práticas</p>
          <ul className="space-y-3">
            {CLOSER_HORA_OURO_PRATICAS.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-cw-muted leading-relaxed">
                <span className="text-cw-purple font-bold mt-0.5 flex-shrink-0">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'crm' && (
        <div className="space-y-3">
          <div className="cw-card p-4 space-y-2">
            <p className="font-bold text-sm text-cw-text mb-2">Hora ouro — Atualização do CRM</p>
            <ol className="space-y-2">
              {CLOSER_HORA_OURO_CRM.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-cw-muted leading-relaxed">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-cw-purple/15 border border-cw-purple/30 text-xs font-bold text-cw-purple flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-amber-500/8 border border-amber-500/25 rounded-xl p-3">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wide mb-1">⚠ Importante</p>
            <p className="text-xs text-cw-text leading-relaxed">{CLOSER_HORA_OURO_CRM_OBS}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------- PROGRESSÃO ----------------------- */

export function ProgressaoSection() {
  const juniors = CLOSER_PROGRESSAO.filter(n => n.nome.startsWith('Júnior'));
  const plenos = CLOSER_PROGRESSAO.filter(n => n.nome.startsWith('Pleno'));
  const seniors = CLOSER_PROGRESSAO.filter(n => n.nome.startsWith('Sênior'));

  const groups = [
    { label: 'Júnior', items: juniors, cor: 'text-cw-muted border-cw-border bg-cw-surface' },
    { label: 'Pleno', items: plenos, cor: 'text-cw-purple border-cw-purple/30 bg-cw-purple/8' },
    { label: 'Sênior', items: seniors, cor: 'text-cw-yellow border-cw-yellow/30 bg-cw-yellow/8' },
  ];

  return (
    <div className="space-y-5">
      <div className="cw-card p-5">
        <SectionTitle>Progressão de carreira</SectionTitle>
        <p className="text-sm text-cw-muted">Níveis de carreira e tempo mínimo de empresa para progressão.</p>
      </div>
      <div className="space-y-4">
        {groups.map(g => (
          <div key={g.label}>
            <p className="text-xs font-bold text-cw-text mb-2">{g.label}</p>
            <div className="grid grid-cols-3 gap-2">
              {g.items.map(n => (
                <div
                  key={n.nome}
                  className={cn('rounded-xl border p-3 text-center', g.cor)}
                >
                  <p className="font-bold text-sm">{n.nome}</p>
                  <p className="text-xs mt-0.5 opacity-70">{n.tempo}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
