/** Rastreia avisos não lidos do Mural via localStorage. */
import { useEffect, useState, useCallback } from 'react';
import { useEditableContent } from '@/store/contentStore';
import { AVISOS_PADRAO, type Aviso } from '@/data/avisos';

const SEEN_KEY = 'mural.seen';

function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveSeenIds(ids: Set<string>) {
  localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(ids)));
}

export function useMuralNotifications() {
  const avisos = useEditableContent<Aviso[]>('dashboard.avisos', AVISOS_PADRAO);
  const [seenIds, setSeenIds] = useState<Set<string>>(getSeenIds);

  // Recalcula quando avisos mudam (novo aviso postado pelo gestor)
  useEffect(() => {
    setSeenIds(getSeenIds());
  }, [avisos.length]);

  const unreadCount = avisos.filter((a) => !seenIds.has(a.id)).length;

  const markAllRead = useCallback(() => {
    const next = new Set(avisos.map((a) => a.id));
    saveSeenIds(next);
    setSeenIds(next);
  }, [avisos]);

  return { unreadCount, markAllRead };
}
