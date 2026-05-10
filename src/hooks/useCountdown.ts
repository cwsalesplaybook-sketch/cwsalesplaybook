/** Hook de countdown em tempo real até uma data alvo. */
import { useEffect, useState } from 'react';

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function compute(target: Date): Countdown {
  const total = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { days, hours, minutes, seconds, total };
}

export function useCountdown(target: Date): Countdown {
  const [state, setState] = useState<Countdown>(() => compute(target));
  useEffect(() => {
    const id = setInterval(() => setState(compute(target)), 1000);
    return () => clearInterval(id);
  }, [target.getTime()]);
  return state;
}

/** Retorna o último dia do mês corrente às 23:59:59. */
export function endOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
}
