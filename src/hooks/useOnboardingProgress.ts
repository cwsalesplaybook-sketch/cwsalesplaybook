/** Persistência do progresso de onboarding: localStorage (imediato) + Supabase (visível ao gestor). */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ONBOARDING } from '@/data/onboarding';
import { supabase } from '@/integrations/supabase/client';

const KEY_CHECKS = 'cw-onboarding-checks';
const KEY_NOTES = 'cw-onboarding-notes';

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Envia progresso ao Supabase (debounced 2s para não spammar a cada clique) */
async function syncToSupabase(checked: Record<string, boolean>) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const checkedIds = Object.entries(checked)
    .filter(([, v]) => v)
    .map(([id]) => id);

  const total = ONBOARDING.length;
  const done = checkedIds.length;
  const percent = Math.round((done / total) * 100);

  await supabase.from('onboarding_progress').upsert({
    user_id: session.user.id,
    checked_ids: checkedIds,
    done_items: done,
    total_items: total,
    percent,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
}

export function useOnboardingProgress() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    loadJSON<Record<string, boolean>>(KEY_CHECKS, {})
  );
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    loadJSON<Record<string, string>>(KEY_NOTES, {})
  );

  // Debounce ref para o sync ao Supabase
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    localStorage.setItem(KEY_CHECKS, JSON.stringify(checked));

    // Debounce: espera 2s de inatividade antes de sincronizar
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      syncToSupabase(checked);
    }, 2000);

    return () => { if (syncTimer.current) clearTimeout(syncTimer.current); };
  }, [checked]);

  useEffect(() => {
    localStorage.setItem(KEY_NOTES, JSON.stringify(notes));
  }, [notes]);

  const toggle = useCallback(
    (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] })),
    []
  );

  const setNote = useCallback(
    (id: string, value: string) => setNotes((prev) => ({ ...prev, [id]: value })),
    []
  );

  const stats = useMemo(() => {
    const total = ONBOARDING.length;
    const done = ONBOARDING.filter((i) => checked[i.id]).length;
    const percent = Math.round((done / total) * 100);
    return { total, done, percent };
  }, [checked]);

  return { checked, toggle, notes, setNote, ...stats };
}
