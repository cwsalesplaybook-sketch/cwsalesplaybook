/** Lista os rituais que acontecem hoje. */
import { Flame, Brain, Heart, BarChart3, CalendarDays } from 'lucide-react';
import { RITUAIS } from '@/data/rituais';
import type { Categoria } from '@/types';

const ICONS: Record<Categoria, React.ComponentType<any>> = {
  performance: Flame,
  desenvolvimento: Brain,
  cultura: Heart,
  gestao: BarChart3,
};

export function TodayRituals() {
  const today = new Date().getDay();
  const hoje = RITUAIS.filter((r) => r.diasDaSemana?.includes(today));

  return (
    <div className="cw-card p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-4 w-4 text-cw-purple-light" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-cw-muted">Rituais de Hoje</h3>
      </div>

      {hoje.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-cw-text font-semibold">Sem rituais hoje.</p>
          <p className="text-sm text-cw-muted mt-1">Hora de prospectar com tudo. 🔥</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {hoje.map((r) => {
            const Icon = ICONS[r.categoria];
            return (
              <li key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-cw-bg border border-cw-border hover:border-cw-purple/60 transition-colors duration-150">
                <div className="h-8 w-8 rounded-md gradient-primary flex items-center justify-center">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{r.nome}</p>
                  {r.horario && <p className="text-xs text-cw-muted">{r.horario}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
