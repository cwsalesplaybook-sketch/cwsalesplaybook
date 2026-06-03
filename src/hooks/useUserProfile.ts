/** Hook que expõe os dados do perfil Google do usuário logado via Supabase OAuth. */
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  avatarUrl: string | null;
  fullName: string | null;
  email: string | null;
  initials: string;
}

export function useUserProfile(): UserProfile {
  const [profile, setProfile] = useState<UserProfile>({
    avatarUrl: null,
    fullName: null,
    email: null,
    initials: '?',
  });

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const meta = session.user.user_metadata;
      const name: string = meta?.full_name ?? meta?.name ?? session.user.email ?? '';
      const initials = name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n: string) => n[0].toUpperCase())
        .join('');
      setProfile({
        avatarUrl: meta?.avatar_url ?? meta?.picture ?? null,
        fullName: name || null,
        email: session.user.email ?? null,
        initials: initials || '?',
      });
    };
    load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) { setProfile({ avatarUrl: null, fullName: null, email: null, initials: '?' }); return; }
      const meta = session.user.user_metadata;
      const name: string = meta?.full_name ?? meta?.name ?? session.user.email ?? '';
      const initials = name.split(' ').filter(Boolean).slice(0, 2).map((n: string) => n[0].toUpperCase()).join('');
      setProfile({ avatarUrl: meta?.avatar_url ?? meta?.picture ?? null, fullName: name || null, email: session.user.email ?? null, initials: initials || '?' });
    });
    return () => subscription.unsubscribe();
  }, []);

  return profile;
}
