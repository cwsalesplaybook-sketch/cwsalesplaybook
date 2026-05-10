/** Hall de Histórias de Vitória — cases reais. */
import { Trophy } from 'lucide-react';

const HISTORIAS = [
  {
    autor: 'Marcos Vinicius',
    squad: 'Squad Águia',
    titulo: 'Como virei o jogo no Berserker de Janeiro',
    metrica: '+47 agendamentos em 1 mês',
    historia: 'Comecei o mês atrás. Mudei minha cadência de manhã: 100% Hora de Ouro, zero distração. No fim do mês virei o Berserker e levei o Hall.',
  },
  {
    autor: 'Thais Giurizatto',
    squad: 'Squad Lobo',
    titulo: 'Consistência virou título',
    metrica: 'Maior taxa de conversão de Fevereiro',
    historia: 'Não foi uma jogada genial — foi rotina. Bati follow-up religiosamente e refiz cada roleplay até a abertura ficar natural.',
  },
  {
    autor: 'Ryan Felipe',
    squad: 'Squad Águia',
    titulo: 'De zero a herói em 3 dias',
    metrica: 'Saí de 0 → 12 agendamentos em 72h',
    historia: 'Nos primeiros dias eu tava travado. O Pedro me passou o framework de SPIN ajustado, fiz roleplay de manhã e cobrei prática de tarde. Virou.',
  },
];

export function HistoriasVitoria() {
  return (
    <section className="cw-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-cw-yellow" />
        <h2 className="text-xl font-bold">Histórias de Vitória</h2>
      </div>
      <div className="space-y-3">
        {HISTORIAS.map((h, i) => (
          <article key={i} className="p-5 rounded-xl bg-gradient-to-r from-cw-purple/15 to-transparent border border-cw-border hover:border-cw-yellow/40 transition-colors">
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
              <h3 className="font-bold text-cw-purple-light">{h.titulo}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-cw-yellow/20 text-cw-yellow font-mono">{h.metrica}</span>
            </div>
            <p className="text-sm text-cw-text/90 leading-relaxed mb-2">"{h.historia}"</p>
            <p className="text-xs text-cw-muted">— <strong className="text-cw-text">{h.autor}</strong>, {h.squad}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
