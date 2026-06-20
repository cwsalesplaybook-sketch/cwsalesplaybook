import { type LucideIcon } from 'lucide-react';

interface Props {
  titulo: string;
  subtitulo?: string;
  Icon: LucideIcon;
}

export default function GestorPlaceholder({ titulo, subtitulo, Icon }: Props) {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cw-text">{titulo}</h1>
        {subtitulo && <p className="text-sm text-cw-muted mt-1">{subtitulo}</p>}
      </div>
      <div className="flex flex-col items-center justify-center h-64 text-cw-muted gap-4 border border-dashed border-cw-border rounded-xl">
        <Icon className="h-10 w-10 opacity-30" />
        <p className="text-sm">{titulo} em construção</p>
      </div>
    </div>
  );
}
