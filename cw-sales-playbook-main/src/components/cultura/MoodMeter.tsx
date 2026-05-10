/** Mood meter — enquete semanal anônima 1-5, salva local. */
import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const KEY = 'cw-mood-meter';
const FACES = ['😞', '😐', '🙂', '😄', '🚀'];

interface MoodEntry { week: string; rating: number }

function currentWeekKey() {
  const d = new Date();
  const week = Math.floor((d.getDate() + 6 - d.getDay()) / 7) + 1;
  return `${d.getFullYear()}-W${d.getMonth() + 1}-${week}`;
}

export function MoodMeter() {
  const [entries, setEntries] = useState<MoodEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  });
  const week = currentWeekKey();
  const already = entries.find((e) => e.week === week);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(entries)); }, [entries]);

  const submit = (rating: number) => {
    setEntries((prev) => [...prev.filter((e) => e.week !== week), { week, rating }]);
    toast({ title: 'Obrigado!', description: 'Sua resposta foi registrada anonimamente.' });
  };

  return (
    <section className="cw-card p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Activity className="h-5 w-5 text-cw-yellow" />
        <h2 className="text-lg font-bold">Como foi sua semana?</h2>
      </div>
      <p className="text-cw-muted text-sm mb-4">Anônimo. Salvo só no seu navegador.</p>
      <div className="flex justify-center gap-2">
        {FACES.map((face, i) => {
          const value = i + 1;
          const isPicked = already?.rating === value;
          return (
            <button
              key={i}
              onClick={() => submit(value)}
              className={cn(
                'h-14 w-14 rounded-xl text-3xl border-2 transition-all hover:scale-110',
                isPicked ? 'border-cw-yellow bg-cw-yellow/10 scale-110' : 'border-cw-border bg-cw-bg opacity-70'
              )}
            >
              {face}
            </button>
          );
        })}
      </div>
      {already && (
        <p className="text-xs text-cw-yellow mt-3">✓ Você respondeu nesta semana ({already.rating}/5)</p>
      )}
    </section>
  );
}
