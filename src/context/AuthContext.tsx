/** Contexto único de autenticação — substitui as 4 assinaturas independentes
 *  de sessão do Supabase (App.tsx, SidebarContext.tsx, EditorContext.tsx,
 *  useUserProfile.ts). Busca a sessão uma vez (via cookie de refresh) e
 *  publica o usuário pra árvore inteira. */
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { apiGet, apiPost, apiPut, apiPatch, refreshSession, setAccessToken, getAccessToken } from '@/lib/apiClient';

export interface AuthUser {
  id: string;
  email: string;
  apelido: string | null;
  papel: string | null;
  squad: string | null;
  squads_lideradas: string[] | null;
  cargo_lideranca: string | null;
  cargo_representante: string | null;
  onboarding_done: boolean | null;
}

type Status = 'loading' | 'authed' | 'anon';

interface AuthCtx {
  status: Status;
  user: AuthUser | null;
  login: (email: string, password: string, remember: boolean) => Promise<{ ok: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    nome: string,
    remember: boolean,
  ) => Promise<{ ok: boolean; error?: string; vinculo?: string | null }>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
  refetchMe: () => Promise<void>;
  /** Atualiza o próprio perfil (sdr_profiles) e já refaz o /me em seguida. */
  updateProfile: (patch: Record<string, unknown>, method?: 'PUT' | 'PATCH') => Promise<{ ok: boolean; error?: string }>;
}

const Ctx = createContext<AuthCtx | null>(null);

// Avisa por e-mail 1x por aba do navegador quando a pessoa fica autenticada
// (login novo ou sessão já existente ao recarregar) — mesmo espírito do
// antigo listener de SIGNED_IN, sem repetir a cada re-render.
const NOTIFY_KEY = 'cw-login-notified';
function notificarLoginUmaVez(user: AuthUser) {
  if (sessionStorage.getItem(NOTIFY_KEY)) return;
  sessionStorage.setItem(NOTIFY_KEY, '1');
  apiPost('/api/login-notify', { email: user.email, name: user.apelido ?? user.email }).catch(() => {
    /* fire-and-forget */
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  const fetchMe = useCallback(async () => {
    const r = await apiGet<{ user: AuthUser }>('/api/auth/me');
    if (r.ok && r.data.ok) {
      setUser(r.data.user);
      setStatus('authed');
      notificarLoginUmaVez(r.data.user);
    } else {
      setUser(null);
      setStatus('anon');
    }
  }, []);

  useEffect(() => {
    (async () => {
      const renovou = await refreshSession();
      if (!renovou) {
        setStatus('anon');
        return;
      }
      await fetchMe();
    })();
  }, [fetchMe]);

  const login = useCallback(
    async (email: string, password: string, remember: boolean) => {
      const r = await apiPost<{ accessToken?: string; error?: string }>('/api/auth/login', { email, password, remember });
      if (!r.data.ok || !r.data.accessToken) return { ok: false, error: r.data.error ?? 'Não foi possível entrar.' };
      setAccessToken(r.data.accessToken);
      await fetchMe();
      return { ok: true };
    },
    [fetchMe],
  );

  const signup = useCallback(
    async (email: string, password: string, nome: string, remember: boolean) => {
      const r = await apiPost<{ accessToken?: string; error?: string; vinculo?: string | null }>('/api/auth/signup', {
        email,
        password,
        nome,
        remember,
      });
      if (!r.data.ok || !r.data.accessToken) return { ok: false, error: r.data.error ?? 'Não foi possível criar a conta.' };
      setAccessToken(r.data.accessToken);
      await fetchMe();
      return { ok: true, vinculo: r.data.vinculo };
    },
    [fetchMe],
  );

  const logout = useCallback(async () => {
    await apiPost('/api/auth/logout');
    setAccessToken(null);
    setUser(null);
    setStatus('anon');
    sessionStorage.removeItem(NOTIFY_KEY);
  }, []);

  const loginWithGoogle = useCallback(() => {
    window.location.href = '/api/auth/google/start';
  }, []);

  const updateProfile = useCallback(
    async (patch: Record<string, unknown>, method: 'PUT' | 'PATCH' = 'PUT') => {
      const call = method === 'PUT' ? apiPut : apiPatch;
      const r = await call('/api/profile/sdr-profiles', patch);
      if (!r.data.ok) return { ok: false, error: r.data.error };
      await fetchMe();
      return { ok: true };
    },
    [fetchMe],
  );

  return (
    <Ctx.Provider value={{ status, user, login, signup, logout, loginWithGoogle, refetchMe: fetchMe, updateProfile }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}

/** Pra código fora de componentes React que só precisa saber se há token. */
export function hasAccessToken(): boolean {
  return getAccessToken() !== null;
}
