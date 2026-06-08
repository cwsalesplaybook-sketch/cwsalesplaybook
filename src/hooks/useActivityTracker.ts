/** Registra a atividade do usuário no Supabase para o painel do gestor. */
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useActivityTracker() {
  useEffect(() => {
    async function track() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const name = user.user_metadata?.full_name ?? user.email ?? 'Usuário';

      await supabase.from('user_activity' as any).upsert(
        {
          user_id: user.id,
          user_email: user.email,
          user_name: name,
          last_seen: new Date().toISOString(),
          visit_count: 1,
        },
        {
          onConflict: 'user_id',
          ignoreDuplicates: false,
        }
      );
    }
    track();
  }, []);
}
