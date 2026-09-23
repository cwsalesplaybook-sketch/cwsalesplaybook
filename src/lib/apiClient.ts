/** Cliente HTTP pra API própria (substitui o client do Supabase).
 *  O access token vive só em memória (nunca localStorage) — a sessão persiste
 *  via cookie httpOnly de refresh token, que o navegador manda sozinho. */

let accessToken: string | null = null;
let refreshPromise: Promise<boolean> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

/** Tenta renovar o access token usando o cookie de refresh. true = conseguiu. */
export async function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) return false;
        const data = await r.json().catch(() => null);
        if (!data?.ok || !data.accessToken) return false;
        setAccessToken(data.accessToken);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Se der 401, tenta 1 refresh silencioso e repete a chamada (padrão: true). */
  retryOn401?: boolean;
}

export interface ApiResult<T = Record<string, unknown>> {
  ok: boolean;
  status: number;
  data: T & { ok?: boolean; error?: string };
}

export async function apiFetch<T = Record<string, unknown>>(path: string, opts: ApiOptions = {}): Promise<ApiResult<T>> {
  const { body, retryOn401 = true, headers, ...rest } = opts;

  const doFetch = async (): Promise<Response> =>
    fetch(path, {
      ...rest,
      credentials: 'include',
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res = await doFetch();

  if (res.status === 401 && retryOn401) {
    const renovou = await refreshSession();
    if (renovou) res = await doFetch();
  }

  const data = (await res.json().catch(() => ({}))) as T & { ok?: boolean; error?: string };
  return { ok: res.ok, status: res.status, data };
}

export const apiGet = <T = Record<string, unknown>>(path: string) => apiFetch<T>(path, { method: 'GET' });
export const apiPost = <T = Record<string, unknown>>(path: string, body?: unknown) => apiFetch<T>(path, { method: 'POST', body });
export const apiPut = <T = Record<string, unknown>>(path: string, body?: unknown) => apiFetch<T>(path, { method: 'PUT', body });
export const apiPatch = <T = Record<string, unknown>>(path: string, body?: unknown) => apiFetch<T>(path, { method: 'PATCH', body });
export const apiDelete = <T = Record<string, unknown>>(path: string) => apiFetch<T>(path, { method: 'DELETE' });
