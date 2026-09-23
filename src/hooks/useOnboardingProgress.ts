/** Persistência do progresso de onboarding: localStorage (imediato) + API (visível ao gestor). */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ONBOARDING } from '@/data/onboarding';
import { apiPut } from '@/lib/apiClient';
import { hasAccessToken } from '@/context/AuthContext';

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

/** Envia progresso pra API (debounced 2s para não spammar a cada clique) */
async function syncProgresso(checked: Record<string, boolean>) {
  if (!hasAccessToken()) return;

  const checkedIds = Object.entries(checked)
    .filter(([, v]) => v)
    .map(([id]) => id);

  const total = ONBOARDING.length;
  const done = checkedIds.length;
  const percent = Math.round((done / total) * 100);

  await apiPut('/api/profile/onboarding-progress', {
    checked_ids: checkedIds,
    done_items: done,
    total_items: total,
    percent,
  });
}

export function useOnboardingProgress() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    loadJSON<Record<string, boolean>>(KEY_CHECKS, {})
  );
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    loadJSON<Record<string, string>>(KEY_NOTES, {})
  );

  // Debounce ref para o sync com a API
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    localStorage.setItem(KEY_CHECKS, JSON.stringify(checked));

    // Debounce: espera 2s de inatividade antes de sincronizar
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      syncProgresso(checked);
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
