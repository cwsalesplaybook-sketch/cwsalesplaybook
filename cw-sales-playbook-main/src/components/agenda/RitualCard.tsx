/** Card de ritual na visão de lista. */
import { Flame, Brain, Heart, BarChart3 } from 'lucide-react';
import type { Categoria, Ritual } from '@/types';
import { Badge } from '@/components/ui/badge';

const ICONS: Record<Categoria, React.ComponentType<any>> = {
  performance: Flame,
  desenvolvimento: Brain,
  cultura: Heart,
  gestao: BarChart3,
};

const ACCENT: Record<Categoria, string> = {
  performance:     'border-l-cw-red',
  desenvolvimento: 'border-l-cw-purple',
  cultura:         'border-l-cw-yellow',
  gestao:          'border-l-cw-purple-dark',
};

const BADGE: Record<Categoria, string> = {
  performance:     'bg-red-900/30 text-red-300 border border-red-800',
  desenvolvimento: 'bg-purple-900/30 text-purple-300 border border-purple-800',
  cultura:         'bg-yellow-900/30 text-yellow-300 border border-yellow-800',
  gestao:          'bg-violet-900/30 text-violet-300 border border-violet-800',
};

const CAT_LABEL: Record<Categoria, string> = {
  performance: '🔥 Performance',
  desenvolvimento: '🧠 Desenvolvimento',
  cultura: '🤝 Cultura',
  gestao: '📊 Gestão',
};

interface Props {
  ritual: Ritual;
  onClick: () => void;
}

export function RitualCard({ ritual, onClick }: Props) {
  const Icon = ICONS[ritual.categoria];
  return (
    <button
      onClick={onClick}
      className={`text-left cw-card cw-card-hover border-l-4 ${ACCENT[ritual.categoria]} p-5 transition-all group`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-cw-text leading-tight text-lg">{ritual.nome}</h4>
          <p className="text-xs text-cw-muted mt-0.5">{ritual.frequencia}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${BADGE[ritual.categoria]}`}>
          {CAT_LABEL[ritual.categoria]}
        </span>
        <Badge variant="outline" className="border-cw-border text-cw-muted text-[10px]">{ritual.duracao}</Badge>
        <Badge variant="outline" className="border-cw-border text-cw-muted text-[10px]">{ritual.participantes}</Badge>
      </div>

      <p className="text-xs text-cw-muted line-clamp-2 mb-3">{ritual.objetivo}</p>

      <span className="text-xs font-semibold text-cw-purple-light group-hover:text-cw-yellow transition-colors">
        Ver detalhes →
      </span>
    </button>
  );
}
