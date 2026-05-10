/** Persistência leve para checks do onboarding e textos livres do novato.
 *  Usa localStorage para que o progresso sobreviva ao refresh. */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ONBOARDING } from '@/data/onboarding';

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

export function useOnboardingProgress() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    loadJSON<Record<string, boolean>>(KEY_CHECKS, {})
  );
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    loadJSON<Record<string, string>>(KEY_NOTES, {})
  );

  useEffect(() => {
    localStorage.setItem(KEY_CHECKS, JSON.stringify(checked));
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
