/** Conexão do SDR com o próprio Google Calendar (OAuth individual, sem
 *  domain-wide delegation) pra sincronizar reuniões marcadas no Kanban.
 *  O refresh_token nunca chega no client depois de guardado — só o
 *  flag "conectado" (ver edge functions calendar-connect/status/sync). */
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const GCAL_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
const REDIRECT_PARAM = 'gcal';
const REDIRECT_VALUE = 'connect';

export function useGoogleCalendarConnection() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checarStatus = useCallback(async () => {
    const { data, error: err } = await supabase.functions.invoke('calendar-status');
    if (err) { setError(err.message); return; }
    setConnected(!!(data as { connected?: boolean })?.connected);
    setLastSyncedAt((data as { lastSyncedAt?: string | null })?.lastSyncedAt ?? null);
  }, []);

  // Ao voltar do OAuth do Google (redirectTo com ?gcal=connect), guarda o
  // refresh_token retornado na sessão via calendar-connect.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get(REDIRECT_PARAM) !== REDIRECT_VALUE) {
      checarStatus();
      return;
    }

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const refreshToken = (session as unknown as { provider_refresh_token?: string })?.provider_refresh_token;
      url.searchParams.delete(REDIRECT_PARAM);
      window.history.replaceState({}, '', url.toString());

      if (refreshToken) {
        const { error: err } = await supabase.functions.invoke('calendar-connect', {
          body: { refresh_token: refreshToken },
        });
        if (err) setError(err.message);
      } else {
        setError('Google não devolveu permissão de acesso ao calendário — tente conectar de novo.');
      }
      checarStatus();
    })();
  }, [checarStatus]);

  const conectar = useCallback(async () => {
    setConnecting(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: GCAL_SCOPE,
        queryParams: { access_type: 'offline', prompt: 'consent' },
        redirectTo: `${window.location.origin}/kanban?${REDIRECT_PARAM}=${REDIRECT_VALUE}`,
      },
    });
    if (err) { setError(err.message); setConnecting(false); }
  }, []);

  const sincronizar = useCallback(async (): Promise<{ criados: number; atualizados: number } | null> => {
    setSyncing(true);
    setError(null);
    const { data, error: err } = await supabase.functions.invoke('calendar-sync');
    setSyncing(false);
    if (err || (data as { error?: string })?.error) {
      setError(err?.message || (data as { error?: string })?.error || 'Falha ao sincronizar');
      return null;
    }
    await checarStatus();
    return data as { criados: number; atualizados: number };
  }, [checarStatus]);

  return { connected, lastSyncedAt, connecting, syncing, error, conectar, sincronizar };
}
