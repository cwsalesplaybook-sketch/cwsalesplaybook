/** Mural de fotos do time — placeholders editáveis pelo gestor. */
import { Image as ImageIcon } from 'lucide-react';

const FOTOS = [
  { legenda: 'Reunião de Sexta — comemoração de meta',  emoji: '🎯' },
  { legenda: 'Off-site Squad Águia',                     emoji: '🦅' },
  { legenda: 'Berserker do mês — Marcos Vinicius',       emoji: '⚔️' },
  { legenda: 'Cumbuca — discussão SPIN Selling',         emoji: '📚' },
  { legenda: 'Onboarding turma de Janeiro',              emoji: '🌱' },
  { legenda: 'Primeira venda do Ryan',                   emoji: '🚀' },
];

export function MuralFotos() {
  return (
    <section className="cw-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="h-5 w-5 text-cw-purple-light" />
        <h2 className="text-xl font-bold">Mural do time</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {FOTOS.map((f, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-cw-border bg-gradient-to-br from-cw-purple/30 to-cw-purple-dark/40 flex flex-col items-center justify-center p-4 group hover:border-cw-purple/60 transition-colors">
            <span className="text-5xl mb-2 group-hover:scale-110 transition-transform">{f.emoji}</span>
            <p className="text-xs text-center text-white/90 font-medium leading-tight">{f.legenda}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-cw-muted text-center mt-3">
        💡 No Modo Gestor, é possível trocar essas imagens por fotos reais do time.
      </p>
    </section>
  );
}
