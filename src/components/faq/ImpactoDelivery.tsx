/** Bloco "Impacto no Delivery" da FAQ — em vez de perguntas em accordion,
 *  mostra cards detalhados de como cada plano muda a realidade do dono de
 *  delivery/restaurante, pra ajudar o SDR a usar isso na conversa com o lead.
 *  Rascunho inicial (antes/depois + destaques) escrito a partir do resumo de
 *  cada plano em PlaybookPlanos.tsx — a Gabi vai revisar e trocar pelo texto
 *  final que já tem escrito. */
import { Utensils, Bike, Crown, ArrowRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlocoImpacto {
  id: string;
  nome: string;
  icon: LucideIcon;
  accent: { text: string; border: string; bg: string; dot: string };
  antes: string;
  depois: string;
  destaques: string[];
}

// Mesmos planos de PlaybookPlanos.tsx (Mesas, Delivery, Premium).
const BLOCOS: BlocoImpacto[] = [
  {
    id: 'mesas',
    nome: 'Plano Mesas',
    icon: Utensils,
    accent: { text: 'text-cw-purple', border: 'border-cw-purple/30', bg: 'bg-cw-purple/5', dot: 'bg-cw-purple' },
    antes: 'Comanda de papel, garçom decorando pedido, conta somada na mão e cliente esperando pra fechar.',
    depois: 'Cliente pede pelo QR Code da própria mesa, a cozinha recebe na hora e a conta se divide sozinha.',
    destaques: [
      'QR Code exclusivo por mesa, direto pro cardápio digital',
      'Divisão de conta por itens ou valores iguais, sem calculadora',
      'Status de cada mesa em tempo real: livre, ocupada, aguardando pagamento',
    ],
  },
  {
    id: 'delivery',
    nome: 'Plano Delivery',
    icon: Bike,
    accent: { text: 'text-emerald-600', border: 'border-emerald-300', bg: 'bg-emerald-50', dot: 'bg-emerald-600' },
    antes: 'Pedido anotado no WhatsApp, entregador sem rota definida e cliente sem saber se o pedido já saiu.',
    depois: 'Pedidos centralizados com status automático, entregador com rota calculada e cliente avisado sozinho.',
    destaques: [
      'Chatbot no WhatsApp + status automático do pedido',
      'Gestão de entregadores com melhor rota e link exclusivo',
      'Disparo de mensagens, cupons e programa de fidelidade',
    ],
  },
  {
    id: 'premium',
    nome: 'Plano Premium',
    icon: Crown,
    accent: { text: 'text-amber-600', border: 'border-amber-300', bg: 'bg-amber-50', dot: 'bg-amber-600' },
    antes: 'Mesa, delivery e iFood cada um numa ferramenta diferente, sem visão única do negócio.',
    depois: 'Mesa, balcão, delivery e marketplaces (iFood, 99food) rodando juntos, numa operação só.',
    destaques: [
      'Tudo do Mesas + tudo do Delivery no mesmo plano',
      'Integração com iFood, 99food e outros marketplaces',
      'Marketing e fidelização cobrindo todos os canais de venda',
    ],
  },
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
            <div key={bloco.id} className={cn('rounded-2xl border p-5 space-y-4', bloco.accent.bg, bloco.accent.border)}>
              <div className="flex items-center gap-2">
                <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center border shrink-0', bloco.accent.bg, bloco.accent.border)}>
                  <Icon className={cn('h-4 w-4', bloco.accent.text)} />
                </div>
                <h3 className="font-bold text-cw-text">{bloco.nome}</h3>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-cw-muted leading-relaxed">
                  <span className="font-bold text-cw-text/70 uppercase tracking-wider text-[10px]">Antes</span><br />
                  {bloco.antes}
                </p>
                <div className="flex items-center gap-1.5">
                  <ArrowRight className={cn('h-3.5 w-3.5', bloco.accent.text)} />
                  <span className={cn('text-[10px] font-bold uppercase tracking-wider', bloco.accent.text)}>Depois</span>
                </div>
                <p className="text-xs text-cw-text leading-relaxed font-medium">
                  {bloco.depois}
                </p>
              </div>

              <ul className="space-y-1.5 border-t border-cw-border/60 pt-3">
                {bloco.destaques.map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-cw-muted">
                    <span className={cn('mt-1.5 h-1 w-1 rounded-full shrink-0', bloco.accent.dot)} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
