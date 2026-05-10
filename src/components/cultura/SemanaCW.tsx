/** "A semana na CW" — timeline horizontal dos momentos da semana. */
import { Calendar } from 'lucide-react';

const MOMENTOS = [
  { dia: 'Seg', emoji: '⏳', titulo: 'Aguardando liderança', desc: '' },
  { dia: 'Ter', emoji: '⏳', titulo: 'Aguardando liderança', desc: '' },
  { dia: 'Qua', emoji: '⏳', titulo: 'Aguardando liderança', desc: '' },
  { dia: 'Qui', emoji: '⏳', titulo: 'Aguardando liderança', desc: '' },
  { dia: 'Sex', emoji: '⏳', titulo: 'Aguardando liderança', desc: '' },
];

export function SemanaCW() {
  return (
    <section className="cw-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-cw-purple-light" />
        <h2 className="text-xl font-bold">A semana na CW</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-cw pb-2">
        {MOMENTOS.map((m, i) => (
          <div key={i} className="shrink-0 w-44 p-4 rounded-xl bg-cw-bg border border-cw-border hover:border-cw-purple/50 transition-colors">
            <p className="text-xs uppercase tracking-wider text-cw-purple-light font-bold">{m.dia}</p>
            <span className="text-3xl block my-2">{m.emoji}</span>
            <p className="font-bold text-sm">{m.titulo}</p>
            <p className="text-xs text-cw-muted mt-1 leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
