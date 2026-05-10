/** Calendário semanal Seg-Sex com blocos posicionados. */
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Ritual } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RitualBlock } from './RitualBlock';
import { cn } from '@/lib/utils';

const START_MIN = 540;   // 09:00
const END_MIN = 1140;    // 19:00
const PX_PER_MIN = 1.4;  // 1.4 px/min => 30min = 42px
const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const DIA_INDEX = [1, 2, 3, 4, 5];

interface Props {
  rituais: Ritual[];
  onSelect: (r: Ritual) => void;
}

function startOfWeek(offset: number) {
  const d = new Date();
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday
  d.setDate(d.getDate() + diff + offset * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmt(d: Date) {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function WeeklyCalendar({ rituais, onSelect }: Props) {
  const [offset, setOffset] = useState(0);
  const [now, setNow] = useState(new Date());
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const weekStart = startOfWeek(offset);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 4);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayCol = DIA_INDEX.findIndex((d) => {
    const dt = new Date(weekStart); dt.setDate(weekStart.getDate() + (d - 1));
    return dt.getTime() === today.getTime();
  });

  // hora atual em minutos desde meia-noite
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const showNowLine = todayCol >= 0 && nowMin >= START_MIN && nowMin <= END_MIN;
  const nowTop = (nowMin - START_MIN) * PX_PER_MIN;

  // Slots de 30 min para mostrar horários
  const slots: number[] = [];
  for (let m = START_MIN; m <= END_MIN; m += 30) slots.push(m);

  const totalHeight = (END_MIN - START_MIN) * PX_PER_MIN;

  return (
    <div className="cw-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-cw-border">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => setOffset(o => o - 1)} className="h-8 w-8 text-cw-muted hover:text-cw-text">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold min-w-[180px] text-center">
            Semana de {fmt(weekStart)} a {fmt(weekEnd)}
          </span>
          <Button size="icon" variant="ghost" onClick={() => setOffset(o => o + 1)} className="h-8 w-8 text-cw-muted hover:text-cw-text">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button size="sm" variant="outline" onClick={() => setOffset(0)} className="border-cw-border text-cw-muted hover:text-cw-text hover:bg-cw-elevated">
          Hoje
        </Button>
      </div>

      <div className="overflow-x-auto scrollbar-cw">
        <div className="min-w-[800px]">
          {/* Header dias */}
          <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-cw-border bg-cw-bg/50">
            <div />
            {DIAS.map((d, i) => {
              const dt = new Date(weekStart); dt.setDate(weekStart.getDate() + i);
              const isToday = i === todayCol;
              return (
                <div key={d} className="px-3 py-3 text-center">
                  <div className="text-xs uppercase tracking-wider text-cw-muted">{d}</div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className={cn('text-sm font-semibold', isToday && 'text-cw-orange')}>{fmt(dt)}</span>
                    {isToday && <Badge className="bg-cw-orange text-white text-[10px] h-5">HOJE</Badge>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grade */}
          <div ref={gridRef} className="grid grid-cols-[60px_repeat(5,1fr)] relative" style={{ height: totalHeight }}>
            {/* Coluna horários */}
            <div className="relative border-r border-cw-border">
              {slots.map((m) => (
                <div
                  key={m}
                  className="absolute left-0 right-0 text-[10px] text-cw-muted pr-2 text-right -translate-y-1/2"
                  style={{ top: (m - START_MIN) * PX_PER_MIN }}
                >
                  {String(Math.floor(m / 60)).padStart(2, '0')}:{String(m % 60).padStart(2, '0')}
                </div>
              ))}
            </div>

            {/* Colunas dos dias */}
            {DIA_INDEX.map((diaIdx, colIdx) => {
              const dayRituais = rituais.filter((r) => r.diasDaSemana?.includes(diaIdx));
              const roleplays = dayRituais.filter((r) => r.id === 'roleplay');
              const others = dayRituais.filter((r) => r.id !== 'roleplay');
              return (
                <div key={diaIdx} className="relative border-r border-cw-border last:border-r-0">
                  {/* linhas guia */}
                  {slots.map((m) => (
                    <div
                      key={m}
                      className="absolute left-0 right-0 border-t border-cw-border/40"
                      style={{ top: (m - START_MIN) * PX_PER_MIN }}
                    />
                  ))}

                  {others.map((r) => (
                    <RitualBlock
                      key={r.id + diaIdx}
                      ritual={r}
                      startMin={START_MIN}
                      pxPerMinute={PX_PER_MIN}
                      onClick={() => onSelect(r)}
                    />
                  ))}

                  {/* Roleplay duplicado: Squad A | B */}
                  {roleplays.map((r) => (
                    <div key={'rp-' + diaIdx} className="contents">
                      <RitualBlock ritual={r} startMin={START_MIN} pxPerMinute={PX_PER_MIN} onClick={() => onSelect(r)} half="left" />
                      <RitualBlock ritual={r} startMin={START_MIN} pxPerMinute={PX_PER_MIN} onClick={() => onSelect(r)} half="right" />
                    </div>
                  ))}

                  {/* Linha de "agora" */}
                  {showNowLine && colIdx === todayCol && (
                    <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{ top: nowTop }}>
                      <div className="h-[2px] bg-cw-orange" />
                      <div className="absolute -left-1 -top-[3px] h-2 w-2 rounded-full bg-cw-orange" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
