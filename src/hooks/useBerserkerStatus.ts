/** Indica se o período Berserker está ativo (≥ dia 28 do mês). */
import { useMemo } from 'react';

export function useBerserkerStatus() {
  return useMemo(() => {
    const now = new Date();
    const day = now.getDate();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const isActive = day >= 28;
    const daysRemaining = lastDay - day;
    const nextStart = new Date(now.getFullYear(), now.getMonth(), 28);
    if (day >= 28) {
      // próximo Berserker é mês que vem
      nextStart.setMonth(nextStart.getMonth() + 1);
    }
    return { isActive, daysRemaining, nextStart };
  }, []);
}
