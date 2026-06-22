/** FAQ do novato — perguntas reais. Editáveis pelo Modo Gestor. */
import { HelpCircle, Plus, Trash2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useEditableContent, useContentStore } from '@/store/contentStore';
import { useEditor } from '@/admin/EditorContext';
import { EditableText } from '@/admin/EditableText';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface FaqItem { q: string; a: string }

const FAQ_PADRAO: FaqItem[] = [
  { q: 'Posso errar no roleplay?', a: 'Pode e vai. Roleplay existe pra isso, se errar agora, não erra com cliente real. Quanto mais você expor onde tá com dúvida, mais rápido evolui.' },
  { q: 'Quanto tempo até bater meta cheia?', a: 'O ramp-up oficial é de ~3 meses. Esperamos crescimento gradual, sem cobrança de meta cheia no primeiro mês. Você terá 1:1s quinzenais para acompanhar evolução.' },
  { q: 'O que acontece se eu não ler a Cumbuca?', a: 'A cumbuca é cancelada e a gente pula o capítulo, por conta que é um compromisso.' },
  { q: 'Posso pedir ajuda mesmo se for óbvio?', a: 'Sim. Pergunta boba é a que ficou na sua cabeça. Slack do seu líder, da Joelma ou Pedro, tudo aberto.' },
  { q: 'Como funciona o Berserker?', a: 'Toda virada de mês a liderança define UMA métrica (ex: agendamentos). Quem performar mais nessa métrica vira o Berserker do mês, entra no Hall of Fame.' },
];

const STORE_KEY = 'start.faq';

export function FaqNovato() {
  const { isEditing } = useEditor();
  const items = useEditableContent<FaqItem[]>(STORE_KEY, FAQ_PADRAO);
  const saveOverride = useContentStore((s) => s.saveOverride);

  const update = async (next: FaqItem[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) { toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };
  const add = () => update([...items, { q: 'Nova pergunta?', a: 'Resposta editável.' }]);
  const remove = (idx: number) => update(items.filter((_, i) => i !== idx));

  return (
    <section className="cw-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-cw-purple-light" />
          <h2 className="text-xl font-bold">
            <EditableText storeKey="start.faq.titulo" defaultValue="Perguntas que todo novato faz" className="text-xl font-bold" />
          </h2>
        </div>
        {isEditing && (
          <Button size="sm" onClick={add} className="gradient-primary text-white h-8">
            <Plus className="h-3.5 w-3.5 mr-1" /> Pergunta
          </Button>
        )}
      </div>
      <Accordion type="single" collapsible className="w-full">
        {items.map((f, i) => (
          <AccordionItem key={i} value={`q${i}`} className="border-cw-border group/faq">
            <div className="flex items-center gap-2">
              <AccordionTrigger className="text-left hover:text-cw-purple-light flex-1">
                <EditableText storeKey={`${STORE_KEY}.${i}.q`} defaultValue={f.q} className="text-left" multiline />
              </AccordionTrigger>
              {isEditing && (
                <button
                  onClick={() => remove(i)}
                  className="h-6 w-6 rounded bg-cw-red/15 text-cw-red border border-cw-red/30 hover:bg-cw-red/25 flex items-center justify-center opacity-0 group-hover/faq:opacity-100 transition-opacity mr-2"
                  title="Remover pergunta"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
            <AccordionContent className="text-cw-muted leading-relaxed">
              <EditableText storeKey={`${STORE_KEY}.${i}.a`} defaultValue={f.a} multiline className="text-cw-muted" />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
