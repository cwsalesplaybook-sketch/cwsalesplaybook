/** Botão genérico de edição — aparece no hover quando Modo Gestor está ativo.
 *  Em vez de implementar todos os formulários (próxima entrega), abre toast
 *  explicando que essa área específica está em desenvolvimento — ou abre o
 *  painel quando definido. Para já, aceita um callback onClick. */
import { Pencil } from 'lucide-react';
import { useEditor } from './EditorContext';
import { cn } from '@/lib/utils';

interface EditButtonProps {
  /** Identificador da seção (para futuro painel dinâmico). */
  sectionKey: string;
  /** Texto curto do que será editado. */
  label?: string;
  onClick?: () => void;
  className?: string;
}

export function EditButton({ sectionKey, label = 'Editar', onClick, className }: EditButtonProps) {
  const { isEditing } = useEditor();
  if (!isEditing) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick?.();
      }}
      title={`${label} — ${sectionKey}`}
      className={cn(
        'absolute top-2 right-2 z-10 h-7 w-7 rounded-md flex items-center justify-center',
        'bg-cw-purple-light text-white shadow-lg shadow-cw-purple/40',
        'opacity-0 group-hover:opacity-100 transition-opacity',
        'hover:scale-110 transition-transform',
        className
      )}
    >
      <Pencil className="h-3.5 w-3.5" />
    </button>
  );
}
