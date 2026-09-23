/** Store global de overrides do Modo Gestor — API própria (Neon + Vercel).
 *
 *  Arquitetura:
 *  - Leitura pública via GET /api/content/list (qualquer usuário lê).
 *  - Escrita exclusiva via POST /api/content/save (valida token de gestor).
 *  - Sincronização entre sessões via polling (30s + refetch ao focar a aba) —
 *    Neon não tem um equivalente ao Realtime do Supabase.
 *  - Cache local em memória (useSyncExternalStore-friendly via Zustand).
 *
 *  Prefixo de setor:
 *  - SDR e Liderança: sem prefixo (compatibilidade com overrides existentes).
 *  - Closer: prefixo "closer." → ex: "closer.playbook.tabs"
 *  - Parcerias: prefixo "parcerias."
 *  - Isso garante dashboards independentes num único app.
 */
import { create } from 'zustand';
import { apiGet, apiPost } from '@/lib/apiClient';
import { useSidebarContext } from '@/context/SidebarContext';

export const STORE_VERSION = 2;

const POLL_MS = 30_000;

/** Prefixo do setor para ações do store (lê localStorage — sem React). */
function getStoreSectorPrefix(): string {
  if (typeof window === 'undefined') return '';
  const papel = localStorage.getItem('cw-papel') ?? 'SDR';
  if (papel === 'SDR' || papel === 'Liderança') return '';
  return papel.toLowerCase() + '.';
}

interface ContentStore {
  version: number;
  overrides: Record<string, unknown>;
  loaded: boolean;
  loading: boolean;
  /** Token de sessão do gestor (vindo do editor-login, ou flag local pra quem já está autorizado pelo próprio login). null = não logado. */
  editorToken: string | null;
  applyRemote: (key: string, value: unknown) => void;
  removeRemote: (key: string) => void;
  applyMany: (rows: Array<{ key: string; value: unknown }>) => void;
  saveOverride: (key: string, value: unknown) => Promise<void>;
  saveGlobalOverride: (key: string, value: unknown) => Promise<void>;
  saveMany: (upserts: Array<{ key: string; value: unknown }>) => Promise<void>;
  deleteOverride: (key: string) => Promise<void>;
  deleteGlobalOverride: (key: string) => Promise<void>;
  resetAll: () => Promise<void>;
  setEditorToken: (token: string | null) => void;
  init: () => Promise<void>;
  refetch: () => Promise<void>;
  exportJSON: () => string;
  importJSON: (data: { version: number; overrides: Record<string, unknown> }) => Promise<void>;
}

const TOKEN_KEY = 'cw-editor-token';
let pollTimer: ReturnType<typeof setInterval> | null = null;

async function save(body: Record<string, unknown>): Promise<void> {
  const r = await apiPost<{ error?: string }>('/api/content/save', body);
  if (!r.data.ok) throw new Error(r.data.error || 'Falha ao salvar');
}

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
    if (!get().editorToken) throw new Error('Sessão de gestor expirada — entre novamente.');
    const prefix = getStoreSectorPrefix();
    const effectiveKey = prefix + key;
    get().applyRemote(effectiveKey, value);
    await save({ token: get().editorToken, key: effectiveKey, value });
  },

  saveGlobalOverride: async (key, value) => {
    if (!get().editorToken) throw new Error('Sessão de gestor expirada — entre novamente.');
    get().applyRemote(key, value);
    await save({ token: get().editorToken, key, value });
  },

  saveMany: async (upserts) => {
    if (!get().editorToken) throw new Error('Sessão de gestor expirada — entre novamente.');
    for (const u of upserts) get().applyRemote(u.key, u.value);
    await save({ token: get().editorToken, upserts });
  },

  deleteOverride: async (key) => {
    if (!get().editorToken) throw new Error('Sessão de gestor expirada — entre novamente.');
    const prefix = getStoreSectorPrefix();
    const effectiveKey = prefix + key;
    get().removeRemote(effectiveKey);
    await save({ token: get().editorToken, deletes: [effectiveKey] });
  },

  deleteGlobalOverride: async (key) => {
    if (!get().editorToken) throw new Error('Sessão de gestor expirada — entre novamente.');
    get().removeRemote(key);
    await save({ token: get().editorToken, deletes: [key] });
  },

  resetAll: async () => {
    if (!get().editorToken) throw new Error('Sessão de gestor expirada — entre novamente.');
    set({ overrides: {} });
    await save({ token: get().editorToken, resetAll: true });
  },

  refetch: async () => {
    const r = await apiGet<{ overrides?: Array<{ key: string; value: unknown }> }>('/api/content/list');
    if (!r.data.ok || !r.data.overrides) return;
    const map: Record<string, unknown> = {};
    for (const row of r.data.overrides) map[row.key] = row.value;
    set({ overrides: map });
  },

  init: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true });
    try {
      await get().refetch();
      set({ loaded: true, loading: false });
    } catch (e) {
      console.error('[contentStore] erro ao carregar overrides:', e);
      set({ loaded: true, loading: false });
    }

    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(() => {
      if (document.visibilityState === 'visible') get().refetch();
    }, POLL_MS);

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') get().refetch();
      });
    }
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

/**
 * Hook: devolve conteúdo específico do setor atual.
 * SDR e Liderança usam chaves sem prefixo (compatibilidade com overrides existentes).
 * Closer/Parcerias usam "closer.", "parcerias." como prefixo.
 * Setores não-SDR sem override retornam string vazia ou array vazio (dashboard em branco).
 */
export function useEditableContent<T>(key: string, defaultValue: T): T {
  const { papel } = useSidebarContext();
  const prefix = (papel === 'SDR' || papel === 'Liderança') ? '' : papel.toLowerCase() + '.';
  const effectiveKey = prefix + key;

  const override = useContentStore((s) => s.overrides[effectiveKey]);
  if (override !== undefined) return override as T;

  // Setor não-SDR sem override → padrão em branco (gestor preenche depois)
  if (prefix) {
    if (typeof defaultValue === 'string') return '' as unknown as T;
    if (Array.isArray(defaultValue)) return [] as unknown as T;
  }
  return defaultValue;
}

/**
 * Hook: devolve conteúdo global sem prefixo de setor.
 * Usar para elementos compartilhados entre todos os setores (ex: sidebar.nav).
 */
export function useGlobalEditableContent<T>(key: string, defaultValue: T): T {
  const override = useContentStore((s) => s.overrides[key]);
  return (override as T) ?? defaultValue;
}
