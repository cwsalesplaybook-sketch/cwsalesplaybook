/** EditableText — texto editável inline quando Modo Gestor está ativo.
 *  - Em modo normal: renderiza children como texto puro.
 *  - Em modo gestor: clique transforma em input/textarea; Enter/blur salva.
 *  Persiste o valor no Lovable Cloud (tabela content_overrides via edge function).
 *  As alterações são vistas por todos os usuários em tempo real. */
import { useEffect, useRef, useState, type ElementType } from 'react';
import { Pencil, Loader2 } from 'lucide-react';
import { useContentStore, useEditableContent } from '@/store/contentStore';
import { useEditor } from './EditorContext';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  /** Chave única no store (ex.: "dashboard.aviso.0.text"). */
  storeKey: string;
  /** Valor padrão (do código) quando não há override. */
  defaultValue: string;
  /** Tag HTML/elemento de saída. Padrão: span. */
  as?: ElementType;
  /** Renderizar como textarea ao editar (multilinha). */
  multiline?: boolean;
  className?: string;
  /** Placeholder no input. */
  placeholder?: string;
}

export function EditableText({
  storeKey,
  defaultValue,
  as: Tag = 'span',
  multiline = false,
  className,
  placeholder = 'Digite o texto…',
}: EditableTextProps) {
  const { isEditing } = useEditor();
  const value = useEditableContent<string>(storeKey, defaultValue);
  const saveOverride = useContentStore((s) => s.saveOverride);
  const deleteOverride = useContentStore((s) => s.deleteOverride);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [editing]);

  const commit = async () => {
    const next = draft.trim();
    if (next === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      if (next === defaultValue) {
        await deleteOverride(storeKey);
      } else {
        await saveOverride(storeKey, next);
      }
      setEditing(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao salvar';
      toast({ title: 'Falha ao salvar', description: msg, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (!isEditing) {
    return <Tag className={className}>{value}</Tag>;
  }

  if (editing) {
    if (multiline) {
      return (
        <div className="relative inline-block w-full">
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            disabled={saving}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setDraft(value);
                setEditing(false);
              }
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) commit();
            }}
            placeholder={placeholder}
            className={cn(
              'w-full min-h-[60px] bg-cw-bg border border-cw-purple-light rounded-md px-2 py-1 text-cw-text',
              'focus:outline-none focus:ring-2 focus:ring-cw-purple-light',
              className
            )}
          />
          {saving && <Loader2 className="absolute top-2 right-2 h-4 w-4 animate-spin text-cw-purple-light" />}
        </div>
      );
    }
    return (
      <span className="relative inline-block">
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          disabled={saving}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') {
              setDraft(value);
              setEditing(false);
            }
          }}
          placeholder={placeholder}
          className={cn(
            'bg-cw-bg border border-cw-purple-light rounded-md px-2 py-0.5 text-cw-text',
            'focus:outline-none focus:ring-2 focus:ring-cw-purple-light',
            className
          )}
        />
        {saving && <Loader2 className="inline-block ml-1 h-3 w-3 animate-spin text-cw-purple-light" />}
      </span>
    );
  }

  return (
    <Tag
      className={cn(
        className,
        'relative cursor-pointer rounded outline outline-1 outline-dashed outline-cw-purple-light/40 hover:outline-cw-purple-light hover:bg-cw-purple-light/5 transition-colors px-1 -mx-1 inline-flex items-center gap-1 group/edt'
      )}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        setEditing(true);
      }}
      title="Clique para editar"
    >
      {value}
      <Pencil className="h-3 w-3 text-cw-purple-light opacity-0 group-hover/edt:opacity-100 transition-opacity shrink-0" />
    </Tag>
  );
}
