/** Store global de overrides do Modo Gestor — agora usando Lovable Cloud (Supabase).
 *  
 *  Arquitetura:
 *  - Leitura pública via tabela `content_overrides` (qualquer usuário lê).
 *  - Escrita exclusiva via edge function `editor-save` (valida token de gestor).
 *  - Sincronização ao vivo via Supabase Realtime: quando um gestor salva,
 *    todos os clientes conectados recebem o update em ~1s.
 *  - Cache local em memória (useSyncExternalStore-friendly via Zustand).
 *  
 *  Compatibilidade: a API `useEditableContent(key, defaultValue)` foi mantida.
 *  Mudanças passam a ser globais (não mais individuais por navegador).
 */
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export const STORE_VERSION = 2;

interface ContentStore {
  version: number;
  overrides: Record<string, unknown>;
  loaded: boolean;
  loading: boolean;
  /** Token de sessão do gestor (vindo de editor-login). null = não logado. */
  editorToken: string | null;
  /** Aplica um valor remoto ao cache (chamado por realtime e por load inicial). */
  applyRemote: (key: string, value: unknown) => void;
  removeRemote: (key: string) => void;
  applyMany: (rows: Array<{ key: string; value: unknown }>) => void;
  /** Salva no Cloud via edge function. Lança em caso de erro. */
  saveOverride: (key: string, value: unknown) => Promise<void>;
  saveMany: (upserts: Array<{ key: string; value: unknown }>) => Promise<void>;
  deleteOverride: (key: string) => Promise<void>;
  resetAll: () => Promise<void>;
  setEditorToken: (token: string | null) => void;
  /** Carrega todos os overrides + assina realtime. Chame uma vez no boot. */
  init: () => Promise<void>;
  exportJSON: () => string;
  importJSON: (data: { version: number; overrides: Record<string, unknown> }) => Promise<void>;
}

let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;

const TOKEN_KEY = 'cw-editor-token';

export const useContentStore = create<ContentStore>()((set, get) => ({
  version: STORE_VERSION,
  overrides: {},
  loaded: false,
  loading: false,
  editorToken: typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,

  applyRemote: (key, value) =>
    set((s) => ({ overrides: { ...s.overrides, [key]: value } })),

  removeRemote: (key) =>
    set((s) => {
      const next = { ...s.overrides };
      delete next[key];
      return { overrides: next };
    }),

  applyMany: (rows) =>
    set((s) => {
      const next = { ...s.overrides };
      for (const r of rows) next[r.key] = r.value;
      return { overrides: next };
    }),

  setEditorToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    }
    set({ editorToken: token });
  },

  saveOverride: async (key, value) => {
    const token = get().editorToken;
    if (!token) throw new Error('Sessão de gestor expirada — entre novamente.');
    // otimista: aplica antes da resposta
    get().applyRemote(key, value);
    const { data, error } = await supabase.functions.invoke('editor-save', {
      body: { token, key, value },
    });
    if (error || (data && (data as { error?: string }).error)) {
      throw new Error(error?.message || (data as { error?: string })?.error || 'Falha ao salvar');
    }
  },

  saveMany: async (upserts) => {
    const token = get().editorToken;
    if (!token) throw new Error('Sessão de gestor expirada — entre novamente.');
    for (const u of upserts) get().applyRemote(u.key, u.value);
    const { data, error } = await supabase.functions.invoke('editor-save', {
      body: { token, upserts },
    });
    if (error || (data && (data as { error?: string }).error)) {
      throw new Error(error?.message || (data as { error?: string })?.error || 'Falha ao salvar');
    }
  },

  deleteOverride: async (key) => {
    const token = get().editorToken;
    if (!token) throw new Error('Sessão de gestor expirada — entre novamente.');
    get().removeRemote(key);
    const { data, error } = await supabase.functions.invoke('editor-save', {
      body: { token, deletes: [key] },
    });
    if (error || (data && (data as { error?: string }).error)) {
      throw new Error(error?.message || (data as { error?: string })?.error || 'Falha ao deletar');
    }
  },

  resetAll: async () => {
    const token = get().editorToken;
    if (!token) throw new Error('Sessão de gestor expirada — entre novamente.');
    set({ overrides: {} });
    const { data, error } = await supabase.functions.invoke('editor-save', {
      body: { token, resetAll: true },
    });
    if (error || (data && (data as { error?: string }).error)) {
      throw new Error(error?.message || (data as { error?: string })?.error || 'Falha ao resetar');
    }
  },

  init: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('content_overrides')
        .select('key, value');
      if (error) throw error;
      const map: Record<string, unknown> = {};
      for (const row of data ?? []) map[row.key] = row.value;
      set({ overrides: map, loaded: true, loading: false });
    } catch (e) {
      console.error('[contentStore] erro ao carregar overrides:', e);
      set({ loaded: true, loading: false });
    }

    // Realtime subscription
    if (realtimeChannel) {
      try { supabase.removeChannel(realtimeChannel); } catch { /* ignore */ }
    }
    realtimeChannel = supabase
      .channel('content_overrides_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'content_overrides' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const oldKey = (payload.old as { key?: string })?.key;
            if (oldKey) get().removeRemote(oldKey);
          } else {
            const row = payload.new as { key: string; value: unknown };
            if (row?.key) get().applyRemote(row.key, row.value);
          }
        }
      )
      .subscribe();
  },

  exportJSON: () =>
    JSON.stringify(
      { version: STORE_VERSION, exportedAt: new Date().toISOString(), overrides: get().overrides },
      null,
      2
    ),

  importJSON: async (data) => {
    if (!data || typeof data !== 'object') return;
    const overrides = data.overrides ?? {};
    const upserts = Object.entries(overrides).map(([key, value]) => ({ key, value }));
    if (upserts.length === 0) return;
    await get().saveMany(upserts);
  },
}));

/** Hook utilitário: devolve o conteúdo (override OU padrão). */
export function useEditableContent<T>(key: string, defaultValue: T): T {
  const override = useContentStore((s) => s.overrides[key]);
  return (override as T) ?? defaultValue;
}
