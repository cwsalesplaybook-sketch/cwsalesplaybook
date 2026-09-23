/** EditorContext — controla se o Modo Gestor está ativo na sessão atual.
 *  Lideranças listadas em GESTOR_EMAILS têm acesso direto sem senha.
 *  Demais usuários precisam da senha para desbloquear. */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useContentStore } from '@/store/contentStore';
import { useAuth } from '@/context/AuthContext';
import { apiPost } from '@/lib/apiClient';

// Quem pode entrar no Modo Gestor. A trava por setor (mestre x gestor) é
// imposta no servidor (edge function editor-save) pelo e-mail do login.
const GESTOR_EMAILS = new Set([
  'pedro.ferreira@cardapioweb.com',
  'whenna.oliveira@cardapioweb.com',
  'hyorranes.souza@cardapioweb.com',
  'antonio.anderson@cardapioweb.com',
  'ana.clara@cardapioweb.com',
  'joelma.vieira@cardapioweb.com',
  'vithoria.pinheiro@cardapioweb.com',
  'gabrielly.oliveira@cardapioweb.com',
  'vanessa.alencar@cardapioweb.com',
  'beatriz.magalhaes@cardapioweb.com',
]);

// Mestres: veem e editam TODOS os setores (switcher sempre visível).
const MASTER_EMAILS = new Set([
  'vanessa.alencar@cardapioweb.com',
  'gabrielly.oliveira@cardapioweb.com',
  'johnnyalves@cardapioweb.com',
]);

interface EditorCtx {
  isEditing: boolean;
  isGestor: boolean;
  isMaster: boolean;
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
  const [isGestor, setIsGestor] = useState(false);
  const [isMaster, setIsMaster] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    initStore();
  }, [initStore]);

  // Verifica se o usuário logado é uma liderança (gestor) ou mestre
  useEffect(() => {
    const e = (user?.email ?? '').trim().toLowerCase();
    setIsGestor(GESTOR_EMAILS.has(e));
    setIsMaster(MASTER_EMAILS.has(e));
  }, [user]);

  const isEditing = !!editorToken;

  // Atalho global Ctrl+Shift+E
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        if (isEditing) {
          setEditorToken(null);
        } else if (isGestor) {
          setEditorToken('editor-mode-active');
        } else {
          setPasswordModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isEditing, isGestor, setEditorToken]);

  const tryUnlock = async (password: string) => {
    const r = await apiPost<{ token?: string }>('/api/auth/editor-login', { password });
    if (r.data.ok && r.data.token) {
      setEditorToken(r.data.token);
      setPasswordModalOpen(false);
      return true;
    }
    return false;
  };

  const lock = () => setEditorToken(null);

  const openPasswordModal = () => {
    if (isGestor) {
      setEditorToken('editor-mode-active');
    } else {
      setPasswordModalOpen(true);
    }
  };

  return (
    <Ctx.Provider
      value={{
        isEditing,
        isGestor,
        isMaster,
        passwordModalOpen,
        openPasswordModal,
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
