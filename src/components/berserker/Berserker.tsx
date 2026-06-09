/** Seção Berserker — fundo de batalha viking, countdown, leaderboard, hall. */
import { Sword, Flame } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { useBerserkerStatus } from '@/hooks/useBerserkerStatus';
import { BerserkerCountdown } from './BerserkerCountdown';
import { HallOfFame } from './HallOfFame';
import { EditableText } from '@/admin/EditableText';

export default function Berserker() {
  const { isActive } = useBerserkerStatus();

  return (
    <div className="relative min-h-full">
      {/* Fundo de batalha — gradient-hot intenso */}
      <div className="absolute inset-0 gradient-hot opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(234,67,53,0.35),_transparent_60%)] pointer-events-none" />
      {/* Ruído sutil para sensação de batalha */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='0.7'/></svg>\")",
        }}
      />

      <div className="relative">

        <div className="p-8 space-y-6">
          <BerserkerCountdown />

          <div className="cw-card p-6 border-l-4 border-l-cw-red">
            <div className="flex items-center gap-2 mb-3">
              <Sword className="h-5 w-5 text-cw-red" />
              <h3 className="text-lg font-bold">
                <EditableText storeKey="berserker.como.titulo" defaultValue="Como funciona" />
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-cw-muted leading-relaxed">
              <li>• <EditableText storeKey="berserker.como.r1" defaultValue="Os últimos 3 dias do mês são oficialmente o período Berserker." multiline className="text-sm" /></li>
              <li>• <EditableText storeKey="berserker.como.r2" defaultValue="A métrica de batalha é definida pela liderança no início do mês." multiline className="text-sm" /></li>
              <li>• <EditableText storeKey="berserker.como.r3" defaultValue="Quem lidera o ranking ao final do último dia é o Berserker do mês." multiline className="text-sm" /></li>
              <li>• <EditableText storeKey="berserker.como.r4" defaultValue="Premiação: reconhecimento público + entrada no Hall da Fama + prêmio simbólico." multiline className="text-sm" /></li>
              <li>• <EditableText storeKey="berserker.como.r5" defaultValue="A regra dos 3 dias de antecedência garante que ninguém está fora da batalha — mesmo de trás dá pra virar." multiline className="text-sm" /></li>
            </ul>
            <blockquote className="mt-4 border-l-2 border-cw-yellow pl-4 italic text-cw-text">
              "<EditableText storeKey="berserker.como.frase" defaultValue="O Berserker prova que qualquer um pode dar a volta por cima nos momentos finais." multiline className="italic" />"
            </blockquote>
          </div>

          <HallOfFame />
        </div>
      </div>
    </div>
  );
}
