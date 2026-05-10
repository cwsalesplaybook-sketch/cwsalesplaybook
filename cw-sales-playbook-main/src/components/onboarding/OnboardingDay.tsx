/** Card de dia do onboarding com tipo visual e link clicável. */
import { useState } from 'react';
import { ChevronDown, Check, BookOpen, Video, Target, MessageSquare, Link as LinkIcon, ListChecks, ExternalLink } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { OnboardingItem, OnboardingTipo } from '@/types';

const TIPO_ICON: Record<OnboardingTipo, typeof BookOpen> = {
  leitura:  BookOpen,
  video:    Video,
  pratica:  Target,
  roleplay: MessageSquare,
  link:     LinkIcon,
  tarefa:   ListChecks,
};

const TIPO_COR: Record<OnboardingTipo, string> = {
  leitura:  'text-blue-300',
  video:    'text-cw-red',
  pratica:  'text-cw-yellow',
  roleplay: 'text-cw-purple-light',
  link:     'text-cyan-300',
  tarefa:   'text-cw-muted',
};

interface Props {
  dia: string;
  macrotopico: string;
  itens: OnboardingItem[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  defaultOpen?: boolean;
}

export function OnboardingDay({ dia, macrotopico, itens, checked, onToggle, defaultOpen }: Props) {
  const [open, setOpen] = useState(!!defaultOpen);
  const done = itens.filter((i) => checked[i.id]).length;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="cw-card overflow-hidden">
      <CollapsibleTrigger className="w-full flex items-center justify-between p-5 hover:bg-cw-elevated transition-colors text-left">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center font-bold text-white">
            {dia.replace('Dia ', '')}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-cw-muted">{dia}</p>
            <h3 className="font-bold text-lg">{macrotopico}</h3>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-cw-muted tabular-nums">{done}/{itens.length}</span>
          <ChevronDown className={cn('h-5 w-5 text-cw-muted transition-transform', open && 'rotate-180')} />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="border-t border-cw-border">
        <ul className="divide-y divide-cw-border">
          {itens.map((item) => {
            const isDone = !!checked[item.id];
            const Icon = TIPO_ICON[item.tipo ?? 'tarefa'];
            const corIcon = TIPO_COR[item.tipo ?? 'tarefa'];
            return (
              <li key={item.id} className="flex items-center gap-2 hover:bg-cw-elevated transition-colors">
                <button
                  onClick={() => onToggle(item.id)}
                  className="flex-1 flex items-center gap-3 px-5 py-3 text-left"
                >
                  <div className={cn(
                    'h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-colors',
                    isDone ? 'gradient-primary border-cw-purple' : 'border-cw-border bg-cw-bg'
                  )}>
                    {isDone && <Check className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <Icon className={cn('h-4 w-4 shrink-0', corIcon)} />
                  <span className={cn('text-sm', isDone ? 'line-through text-cw-muted' : 'text-cw-text')}>
                    {item.atividade}
                  </span>
                </button>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 mr-3 text-xs flex items-center gap-1 text-cw-purple-light hover:text-white transition-colors"
                  >
                    abrir <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
