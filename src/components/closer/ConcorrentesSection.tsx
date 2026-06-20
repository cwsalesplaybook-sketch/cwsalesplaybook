/** Seção Concorrentes — tabela comparativa. */
import { useState } from 'react';
import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CLOSER_CONCORRENTES_HEADERS,
  CLOSER_CONCORRENTES,
  type ConcorrenteValor,
} from '@/data/playbookCloser';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">{children}</p>;
}

function ValorIcon({ v }: { v: ConcorrenteValor }) {
  if (v === 'yes') return <Check className="h-3.5 w-3.5 text-emerald-400 mx-auto" />;
  if (v === 'no') return <X className="h-3.5 w-3.5 text-red-400/60 mx-auto" />;
  return <Minus className="h-3.5 w-3.5 text-cw-yellow/70 mx-auto" />;
}

const CATEGORIAS = CLOSER_CONCORRENTES.map(c => c.categoria);

export function ConcorrentesSection() {
  const [catIdx, setCatIdx] = useState(0);
  const cat = CLOSER_CONCORRENTES[catIdx];

  return (
    <div className="space-y-5">
      <div className="cw-card p-5">
        <SectionTitle>Matriz de Concorrentes</SectionTitle>
        <p className="text-sm text-cw-muted">Compare funcionalidades da Cardápio Web com os principais concorrentes do mercado.</p>
        <div className="flex items-center gap-4 mt-4 text-xs text-cw-muted">
          <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> Possui</span>
          <span className="flex items-center gap-1"><Minus className="h-3.5 w-3.5 text-cw-yellow/70" /> Parcial</span>
          <span className="flex items-center gap-1"><X className="h-3.5 w-3.5 text-red-400/60" /> Não possui</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIAS.map((c, i) => (
          <button
            key={c}
            onClick={() => setCatIdx(i)}
            className={cn(
              'text-xs font-medium px-3 py-1.5 rounded-full border transition-colors',
              catIdx === i ? 'gradient-primary text-white border-transparent' : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="cw-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-cw">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-cw-border bg-cw-elevated">
                <th className="text-left py-2 px-3 font-semibold text-cw-text min-w-[160px] sticky left-0 bg-cw-elevated z-10">
                  Funcionalidade
                </th>
                {CLOSER_CONCORRENTES_HEADERS.map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'py-2 px-2 font-semibold text-center min-w-[70px]',
                      i === 0 ? 'text-cw-purple' : 'text-cw-muted',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cat.features.map((f, ri) => (
                <tr key={f.nome} className={cn('border-b border-cw-border', ri % 2 === 0 ? '' : 'bg-cw-elevated/30')}>
                  <td className="py-2 px-3 text-cw-text font-medium sticky left-0 bg-inherit z-10">
                    {f.nome}
                  </td>
                  {f.valores.map((v, ci) => (
                    <td key={ci} className={cn('py-2 px-2 text-center', ci === 0 && 'bg-cw-purple/5')}>
                      <ValorIcon v={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
