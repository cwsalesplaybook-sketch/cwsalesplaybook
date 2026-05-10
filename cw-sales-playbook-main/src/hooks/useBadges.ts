/** Calcula badges desbloqueados a partir do estado de checks do onboarding. */
import { useMemo } from 'react';
import { BADGES } from '@/data/badges';

export function useBadges(checked: Record<string, boolean>) {
  return useMemo(
    () =>
      BADGES.map((b) => ({
        ...b,
        unlocked: b.regra(checked),
      })),
    [checked]
  );
}
