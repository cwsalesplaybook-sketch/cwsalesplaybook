/** Header da área principal. Títulos editáveis no Modo Gestor. */
import { ReactNode } from 'react';
import { EditableText } from '@/admin/EditableText';

interface HeaderProps {
  titulo: string;
  subtitulo?: string;
  acoes?: ReactNode;
  /** Chave para edição. Se omitida, usa o slug do título — mas é melhor passar explícita. */
  storeKey?: string;
}

export function Header({ titulo, subtitulo, acoes, storeKey }: HeaderProps) {
  const key = storeKey ?? `header.${titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <header className="border-b border-cw-border bg-cw-bg/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cw-text tracking-tight">
            <EditableText storeKey={`${key}.titulo`} defaultValue={titulo} className="text-2xl font-bold" />
          </h1>
          {subtitulo && (
            <p className="text-sm text-cw-muted mt-0.5">
              <EditableText storeKey={`${key}.subtitulo`} defaultValue={subtitulo} className="text-sm text-cw-muted" multiline />
            </p>
          )}
        </div>
        {acoes && <div className="flex items-center gap-2">{acoes}</div>}
      </div>
    </header>
  );
}
