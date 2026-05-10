/** Os 5 Níveis de Liderança (John Maxwell). */
import { User, Users, TrendingUp, UserCheck, Star } from 'lucide-react';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { NIVEIS_LIDERANCA, type IconeNivel } from '@/data/gestao';
import { cn } from '@/lib/utils';

const ICONS: Record<IconeNivel, typeof User> = {
  User, Users, TrendingUp, UserCheck, Star,
};

const COR_MAP: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  red:    { bg: 'bg-cw-red/15',          text: 'text-red-300',         border: 'border-cw-red/40',          ring: 'ring-cw-red/30' },
  orange: { bg: 'bg-orange-500/15',      text: 'text-orange-300',      border: 'border-orange-500/40',      ring: 'ring-orange-500/30' },
  yellow: { bg: 'bg-cw-yellow/15',       text: 'text-cw-yellow',       border: 'border-cw-yellow/40',       ring: 'ring-cw-yellow/30' },
  green:  { bg: 'bg-emerald-500/15',     text: 'text-emerald-300',     border: 'border-emerald-500/40',     ring: 'ring-emerald-500/30' },
  purple: { bg: 'bg-cw-purple/20',       text: 'text-cw-purple-light', border: 'border-cw-purple',          ring: 'ring-cw-purple/40' },
};

export function NiveisLideranca() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-cw-text">Os 5 Níveis de Liderança</h2>
        <p className="text-sm text-cw-muted mt-1">Baseado em John Maxwell. Em qual nível você está?</p>
      </div>

      <div className="relative space-y-4">
        {/* Linha vertical da timeline */}
        <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-cw-red via-cw-yellow to-cw-purple opacity-40" />

        {NIVEIS_LIDERANCA.map((nivel) => {
          const Icon = ICONS[nivel.icone];
          const cores = COR_MAP[nivel.cor];
          const isPico = nivel.numero === 5;
          return (
            <div key={nivel.numero} className="relative pl-16">
              {/* Marker */}
              <div
                className={cn(
                  'absolute left-0 top-3 h-12 w-12 rounded-full flex items-center justify-center border-2 ring-4',
                  cores.bg, cores.border, cores.ring,
                  isPico && 'shadow-lg shadow-cw-purple/40',
                )}
              >
                <Icon className={cn('h-5 w-5', cores.text)} />
              </div>

              <div
                className={cn(
                  'cw-card cw-card-hover p-5',
                  isPico && 'border-cw-purple bg-gradient-to-br from-cw-elevated to-cw-surface',
                )}
              >
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={cn('text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded', cores.bg, cores.text, 'border', cores.border)}>
                    Nível {nivel.numero}
                  </span>
                  <h3 className="text-xl font-bold text-cw-text">{nivel.titulo}</h3>
                  {isPico && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-cw-yellow/20 text-cw-yellow border border-cw-yellow/40">
                      ⭐ Pináculo
                    </span>
                  )}
                </div>
                <p className={cn('text-sm font-semibold mb-3 italic', cores.text)}>
                  "{nivel.badge}"
                </p>
                <p className="text-sm text-cw-muted leading-relaxed mb-3">{nivel.descricao}</p>

                <Accordion type="single" collapsible>
                  <AccordionItem value={`n-${nivel.numero}`} className="border-cw-border">
                    <AccordionTrigger className="text-sm font-semibold text-cw-purple-light hover:text-cw-yellow hover:no-underline py-2">
                      {isPico ? 'Como continuar' : 'Como evoluir'}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-cw-muted leading-relaxed">
                      {nivel.evolucao}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NiveisLideranca;
