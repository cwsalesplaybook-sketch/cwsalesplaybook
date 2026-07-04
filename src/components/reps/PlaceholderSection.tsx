/** Placeholder padrão para seções do dashboard de REPS sem conteúdo definitivo ainda —
 *  mesmo padrão usado em PlaybookRepresentantes.tsx enquanto a liderança prepara o material. */
import type { LucideIcon } from 'lucide-react';

interface Props {
  titulo: string;
  descricao: string;
  icon: LucideIcon;
}

export function PlaceholderSection({ titulo, descricao, icon: Icon }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-cw-purple/10 border border-cw-purple/20 flex items-center justify-center">
        <Icon className="h-7 w-7 text-cw-purple-light" />
      </div>
      <h3 className="text-lg font-bold text-cw-text">Em construção</h3>
      <p className="text-sm text-cw-muted max-w-sm leading-relaxed">
        O conteúdo de <strong>{titulo}</strong> ainda está sendo preparado pela liderança. {descricao}
      </p>
    </div>
  );
}
