/** Os 5 Desafios das Equipes (Patrick Lencioni) — pirâmide visual. */
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { DESAFIOS_EQUIPE } from '@/data/gestao';
import { cn } from '@/lib/utils';

const COR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  red:            { bg: 'bg-cw-red/20',           text: 'text-red-300',         border: 'border-cw-red' },
  orange:         { bg: 'bg-orange-500/20',       text: 'text-orange-300',      border: 'border-orange-500' },
  yellow:         { bg: 'bg-cw-yellow/20',        text: 'text-cw-yellow',       border: 'border-cw-yellow' },
  'purple-light': { bg: 'bg-cw-purple-light/20',  text: 'text-cw-purple-light', border: 'border-cw-purple-light' },
  purple:         { bg: 'bg-cw-purple/30',        text: 'text-cw-purple-light', border: 'border-cw-purple' },
};

export function DesafiosEquipe() {
  // Topo da pirâmide primeiro (visualmente)
  const camadasTopDown = [...DESAFIOS_EQUIPE].sort((a, b) => b.camada - a.camada);
  const [expandida, setExpandida] = useState<number | null>(5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-cw-text">Os 5 Desafios das Equipes</h2>
        <p className="text-sm text-cw-muted mt-1">
          Baseado em Patrick Lencioni. A pirâmide que toda equipe precisa vencer.
        </p>
      </div>

      <div className="cw-card p-6">
        <div className="space-y-2 max-w-3xl mx-auto">
          {camadasTopDown.map((d, idx) => {
            const cores = COR_MAP[d.cor];
            const isExpandida = expandida === d.camada;
            // Largura crescente conforme desce: topo estreito (60%), base larga (100%)
            const widthPct = 60 + idx * 10;
            return (
              <div key={d.camada} className="flex flex-col items-center">
                <button
                  onClick={() => setExpandida(isExpandida ? null : d.camada)}
                  style={{ width: `${widthPct}%` }}
                  className={cn(
                    'rounded-lg border-2 px-4 py-3 transition-all hover:scale-[1.02] cursor-pointer text-left',
                    cores.bg, cores.border,
                    isExpandida && 'ring-2 ring-offset-2 ring-offset-cw-surface ring-current',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn('text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded shrink-0', cores.bg, cores.text)}>
                        Nível {d.camada}
                      </span>
                      <div className="min-w-0">
                        <p className={cn('text-sm font-bold truncate', cores.text)}>{d.problema}</p>
                        <p className="text-xs text-cw-muted truncate">→ {d.conceito}</p>
                      </div>
                    </div>
                    <ChevronRight className={cn('h-4 w-4 shrink-0 transition-transform', cores.text, isExpandida && 'rotate-90')} />
                  </div>
                </button>

                {isExpandida && (
                  <div
                    style={{ width: `${widthPct}%` }}
                    className={cn(
                      'mt-2 mb-1 rounded-lg border bg-cw-bg/60 p-4 animate-in fade-in slide-in-from-top-1',
                      cores.border,
                    )}
                  >
                    <p className="text-sm text-cw-muted leading-relaxed">{d.descricao}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Texto motivacional */}
      <div className="cw-card p-6 gradient-surface relative overflow-hidden">
        <div className="absolute inset-0 gradient-glow pointer-events-none" />
        <div className="relative text-center">
          <p className="text-base text-cw-text font-semibold leading-relaxed">
            Um time que supera os 5 desafios é praticamente <span className="text-gradient-primary">imbatível</span>.
          </p>
          <p className="text-sm text-cw-muted mt-3">
            Confiança → Conflito saudável → Comprometimento → Responsabilidade → <span className="text-cw-yellow font-bold">Resultados</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DesafiosEquipe;
