/** Tab "Framework de Gestão": as 5 dimensões + comportamentos da liderança. */
import {
  Compass, Database, GitBranch, Users, TrendingUp, Check, Circle, Sparkles,
} from 'lucide-react';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  DIMENSOES, COMPORTAMENTOS_LIDERANCA, type IconeDimensao,
} from '@/data/gestao';

const DIM_ICONS: Record<IconeDimensao, typeof Compass> = {
  Compass, Database, GitBranch, Users, TrendingUp,
};

/** Cor por nota: 0-4 vermelho, 5-6 amarelo, 7-10 verde. */
function corPorNota(nota: number) {
  if (nota >= 7) return { bar: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10' };
  if (nota >= 5) return { bar: 'bg-cw-yellow', text: 'text-cw-yellow', border: 'border-cw-yellow/40', bg: 'bg-cw-yellow/10' };
  return { bar: 'bg-cw-red', text: 'text-red-300', border: 'border-cw-red/40', bg: 'bg-cw-red/10' };
}

export function FrameworkGestao() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-cw-text">O que seria uma boa gestão?</h2>
        <p className="text-sm text-cw-muted mt-1">
          Um framework para avaliar e evoluir a qualidade da gestão em 5 dimensões.
        </p>
      </div>

      {/* Diagnóstico geral */}
      <div className="cw-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 gradient-glow pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-cw-yellow" />
            <h3 className="text-lg font-bold text-cw-text">Diagnóstico Geral</h3>
          </div>
          <div className="space-y-4">
            {DIMENSOES.map((d) => {
              const cores = corPorNota(d.nota);
              const Icon = DIM_ICONS[d.icone];
              return (
                <div key={d.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-cw-muted" />
                      <span className="text-sm font-semibold text-cw-text">{d.nome}</span>
                    </div>
                    <span className={cn('text-sm font-bold', cores.text)}>{d.nota.toFixed(1)}/10</span>
                  </div>
                  <div className="h-2 rounded-full bg-cw-bg border border-cw-border overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', cores.bar)}
                      style={{ width: `${(d.nota / 10) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-cw-muted mt-5 italic">
            Diagnóstico atual do time comercial. Itens com <span className="text-emerald-400 font-semibold">✓</span> já estão sendo executados.
          </p>
        </div>
      </div>

      {/* Cards por dimensão */}
      <div className="space-y-4">
        {DIMENSOES.map((d) => {
          const Icon = DIM_ICONS[d.icone];
          const cores = corPorNota(d.nota);
          return (
            <div
              key={d.id}
              className={cn(
                'cw-card cw-card-hover p-5 border-l-4',
                cores.border.replace('/40', ''),
              )}
              style={{ borderLeftColor: undefined }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', cores.bg, 'border', cores.border)}>
                    <Icon className={cn('h-5 w-5', cores.text)} />
                  </div>
                  <div>
                    <h3 className="font-bold text-cw-text text-lg">{d.nome}</h3>
                    <p className="text-xs text-cw-muted">{d.itens.filter((i) => i.feito).length} de {d.itens.length} itens em execução</p>
                  </div>
                </div>
                <span className={cn('px-3 py-1 rounded-full text-sm font-bold border', cores.bg, cores.text, cores.border)}>
                  {d.nota.toFixed(1)}/10
                </span>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {d.itens.map((item, idx) => (
                  <li
                    key={idx}
                    className={cn(
                      'flex items-center gap-2.5 p-2 rounded-md text-sm border',
                      item.feito
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-cw-text'
                        : 'bg-cw-bg/40 border-cw-border text-cw-muted',
                    )}
                  >
                    {item.feito ? (
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-cw-muted shrink-0" />
                    )}
                    <span className="flex-1">{item.label}</span>
                    {item.feito && item.nota !== undefined && (
                      <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded', corPorNota(item.nota).text, corPorNota(item.nota).bg)}>
                        {item.nota}/10
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Comportamentos da liderança */}
      <div className="cw-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-cw-text">O perfil da liderança que buscamos</h3>
          <p className="text-sm text-cw-muted mt-1">Passe o mouse para ver a descrição de cada comportamento.</p>
        </div>

        <TooltipProvider delayDuration={150}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {COMPORTAMENTOS_LIDERANCA.map((c) => (
              <Tooltip key={c.nome}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-cw-border bg-cw-bg/40 hover:border-cw-purple hover:bg-cw-elevated transition-all cursor-help">
                    <span className="text-cw-yellow text-sm">✦</span>
                    <span className="text-sm text-cw-text font-medium">{c.nome}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs bg-cw-elevated border-cw-border text-cw-text">
                  {c.desc}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default FrameworkGestao;
