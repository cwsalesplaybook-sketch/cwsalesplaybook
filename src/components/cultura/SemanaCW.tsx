/** "A semana na CW" — timeline horizontal dos momentos da semana. */
import { Calendar } from 'lucide-react';

const MOMENTOS = [
  { dia: 'Seg', emoji: '🔥', titulo: 'Kickoff da semana', desc: 'Squad Águia bateu metas de Q1' },
  { dia: 'Ter', emoji: '📚', titulo: 'Cumbuca SPIN cap. 7-8', desc: 'Discussão sobre perguntas de implicação' },
  { dia: 'Qua', emoji: '🎯', titulo: '1ª venda da Lara',     desc: 'Pizzaria com 3 unidades fechou' },
  { dia: 'Qui', emoji: '🎭', titulo: 'Roleplay coletivo',    desc: 'Time todo praticou contorno de "achei caro"' },
  { dia: 'Sex', emoji: '🏆', titulo: 'Reunião Geral',        desc: 'Marcos foi anunciado como Berserker' },
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
