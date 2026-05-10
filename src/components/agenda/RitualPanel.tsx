/** Sheet lateral com detalhes do ritual. */
import { Flame, Brain, Heart, BarChart3, Shield, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import type { Categoria, Ritual } from '@/types';

const ICONS: Record<Categoria, React.ComponentType<any>> = {
  performance: Flame, desenvolvimento: Brain, cultura: Heart, gestao: BarChart3,
};

interface Props {
  ritual: Ritual | null;
  onClose: () => void;
}

export function RitualPanel({ ritual, onClose }: Props) {
  const open = !!ritual;
  const Icon = ritual ? ICONS[ritual.categoria] : Flame;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="bg-cw-surface border-l border-cw-border text-cw-text w-full sm:max-w-lg overflow-y-auto scrollbar-cw"
      >
        {ritual && (
          <>
            <SheetHeader className="text-left pb-4 border-b border-cw-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-cw-elevated flex items-center justify-center">
                  <Icon className="h-5 w-5 text-cw-orange" />
                </div>
                <div>
                  <SheetTitle className="text-cw-text">{ritual.nome}</SheetTitle>
                  <SheetDescription className="text-cw-muted">
                    {ritual.frequencia} · {ritual.duracao}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="border-cw-border text-cw-muted">{ritual.participantes}</Badge>
                {ritual.horario && <Badge variant="outline" className="border-cw-border text-cw-muted">{ritual.horario}</Badge>}
                <Badge variant="outline" className="border-cw-border text-cw-muted">Resp: {ritual.responsavel.split('—')[0].trim()}</Badge>
              </div>
            </SheetHeader>

            <Accordion type="multiple" defaultValue={['obj', 'como']} className="mt-4">
              <AccordionItem value="obj" className="border-cw-border">
                <AccordionTrigger className="text-cw-text hover:text-cw-orange">Objetivo</AccordionTrigger>
                <AccordionContent className="text-cw-muted leading-relaxed">{ritual.objetivo}</AccordionContent>
              </AccordionItem>

              <AccordionItem value="como" className="border-cw-border">
                <AccordionTrigger className="text-cw-text hover:text-cw-orange">Como Funciona</AccordionTrigger>
                <AccordionContent className="text-cw-muted leading-relaxed">{ritual.comoFunciona}</AccordionContent>
              </AccordionItem>

              <AccordionItem value="regras" className="border-cw-border">
                <AccordionTrigger className="text-cw-text hover:text-cw-orange">Regras de Ouro</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {ritual.regrasDeOuro.map((r, i) => (
                      <li key={i} className="flex gap-2 text-cw-muted text-sm">
                        <Shield className="h-4 w-4 text-cw-orange shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="esperado" className="border-cw-border">
                <AccordionTrigger className="text-cw-text hover:text-cw-orange">O que é esperado de você</AccordionTrigger>
                <AccordionContent className="text-cw-muted leading-relaxed">{ritual.oQueEsperado}</AccordionContent>
              </AccordionItem>

              <AccordionItem value="novatos" className="border-cw-border">
                <AccordionTrigger className="text-yellow-400 hover:text-yellow-300">
                  <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Para novatos em ramp-up</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="border-l-2 border-yellow-500 bg-yellow-500/5 p-3 rounded-r-md text-cw-muted leading-relaxed text-sm">
                    {ritual.paraNovatos}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="metrica" className="border-cw-border">
                <AccordionTrigger className="text-cw-text hover:text-cw-orange">Métrica de sucesso</AccordionTrigger>
                <AccordionContent className="text-cw-muted leading-relaxed">{ritual.metricaDeSucesso}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
