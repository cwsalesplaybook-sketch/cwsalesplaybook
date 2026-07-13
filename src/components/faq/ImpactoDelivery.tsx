/** Bloco "Impacto no Delivery" da FAQ — em vez de perguntas em accordion,
 *  mostra cards detalhados de como cada plano muda a realidade do dono de
 *  delivery/restaurante, pra ajudar o SDR a usar isso na conversa com o lead.
 *  Conteúdo (texto de cada card) ainda por preencher — a Gabi já tem o
 *  material escrito e vai colar aqui depois. */
import { Utensils, Bike, Crown, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlocoImpacto {
  id: string;
  nome: string;
  icon: LucideIcon;
  accent: { text: string; border: string; bg: string };
}

// Mesmos planos de PlaybookPlanos.tsx (Mesas, Delivery, Premium) — conteúdo de
// impacto ainda vazio, pronto pra receber o texto.
const BLOCOS: BlocoImpacto[] = [
  { id: 'mesas', nome: 'Plano Mesas', icon: Utensils, accent: { text: 'text-cw-purple', border: 'border-cw-purple/30', bg: 'bg-cw-purple/5' } },
  { id: 'delivery', nome: 'Plano Delivery', icon: Bike, accent: { text: 'text-emerald-600', border: 'border-emerald-300', bg: 'bg-emerald-50' } },
  { id: 'premium', nome: 'Plano Premium', icon: Crown, accent: { text: 'text-amber-600', border: 'border-amber-300', bg: 'bg-amber-50' } },
];

export default function ImpactoDelivery() {
  return (
    <div className="space-y-4">
      <div className="cw-card p-6">
        <h2 className="text-base font-bold text-cw-text">Como mudamos a realidade do delivery</h2>
        <p className="text-sm text-cw-muted mt-1 leading-relaxed">
          Pra usar na conversa com o lead: o antes/depois de cada plano na vida de quem toca um delivery ou restaurante no dia a dia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BLOCOS.map((bloco) => {
          const Icon = bloco.icon;
          return (
            <div key={bloco.id} className={cn('rounded-2xl border p-5 space-y-3', bloco.accent.bg, bloco.accent.border)}>
              <div className="flex items-center gap-2">
                <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center border', bloco.accent.bg, bloco.accent.border)}>
                  <Icon className={cn('h-4 w-4', bloco.accent.text)} />
                </div>
                <h3 className="font-bold text-cw-text">{bloco.nome}</h3>
              </div>
              {/* TODO(Gabi): colar aqui o texto de impacto desse plano — antes/depois, dor resolvida, resultado. */}
              <p className="text-sm text-cw-muted italic">
                Conteúdo em construção — em breve, aqui.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
