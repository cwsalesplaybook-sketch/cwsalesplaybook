/** Renderiza uma categoria da Central de Ajuda (lista de tópicos em accordion). */
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { AjudaTopico } from '@/data/playbookAjuda';

export function AjudaCategoria({ topicos }: { topicos: AjudaTopico[] }) {
  return (
    <Accordion type="single" collapsible className="space-y-2">
      {topicos.map((t, i) => (
        <AccordionItem
          key={i}
          value={`ajuda-${i}`}
          className="border border-cw-border rounded-lg px-4 bg-cw-bg/50 hover:border-cw-purple/50 transition-colors"
        >
          <AccordionTrigger className="text-sm font-semibold text-cw-text hover:no-underline py-3 text-left">
            {t.titulo}
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-3">
            {t.resumo && <p className="text-sm text-cw-muted leading-relaxed">{t.resumo}</p>}
            {t.subsecoes?.map((s, j) => (
              <div key={j}>
                <p className="text-xs font-semibold uppercase tracking-wider text-cw-purple-light mb-1.5">{s.titulo}</p>
                <ul className="space-y-1">
                  {s.itens.map((item, k) => (
                    <li key={k} className="text-sm text-cw-muted leading-relaxed flex gap-2">
                      <span className="text-cw-purple-light mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
