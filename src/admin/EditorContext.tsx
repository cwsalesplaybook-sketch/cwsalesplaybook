/** EditorContext — controla se o Modo Gestor está ativo na sessão atual.
 *  Senha é validada no servidor (edge function editor-login) que devolve um
 *  token assinado HMAC. O token é guardado em localStorage para persistir entre
 *  reloads, e usado pela edge function editor-save para autorizar gravações. */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useContentStore } from '@/store/contentStore';

interface EditorCtx {
  isEditing: boolean;
  passwordModalOpen: boolean;
  openPasswordModal: () => void;
  closePasswordModal: () => void;
  tryUnlock: (password: string) => Promise<boolean>;
  lock: () => void;
}

const Ctx = createContext<EditorCtx | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const editorToken = useContentStore((s) => s.editorToken);
  const setEditorToken = useContentStore((s) => s.setEditorToken);
  const initStore = useContentStore((s) => s.init);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Inicializa o store (carrega overrides + assina realtime) no mount.
  useEffect(() => {
    initStore();
  }, [initStore]);

  const isEditing = !!editorToken;

  // Atalho global Ctrl+Shift+E
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        if (isEditing) {
          setEditorToken(null);
        } else {
          setPasswordModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isEditing, setEditorToken]);

  const tryUnlock = async (password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('editor-login', {
        body: { password },
      });
      if (error) {
        console.error('[editor-login] erro:', error);
        return false;
      }
      const payload = data as { ok?: boolean; token?: string };
      if (payload?.ok && payload.token) {
        setEditorToken(payload.token);
        setPasswordModalOpen(false);
        return true;
      }
      return false;
    } catch (e) {
      console.error('[editor-login] exceção:', e);
      return false;
    }
  };

  const lock = () => setEditorToken(null);

  return (
    <Ctx.Provider
      value={{
        isEditing,
        passwordModalOpen,
        openPasswordModal: () => setPasswordModalOpen(true),
        closePasswordModal: () => setPasswordModalOpen(false),
        tryUnlock,
        lock,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useEditor deve ser usado dentro de EditorProvider');
  return ctx;
}
