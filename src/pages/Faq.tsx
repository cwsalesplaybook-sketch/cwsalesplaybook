/** Página FAQ — cards por categoria, accordion de perguntas. */
import { useState } from 'react';
import { Monitor, DollarSign, Package, ChevronLeft, ChevronRight, HelpCircle, MessageCircle, Store } from 'lucide-react';
import { FAQ } from '@/data/playbook';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface Categoria {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  descricao: string;
  cor: string;
  bg: string;
  borda: string;
  badge?: string;
}

const CATEGORIAS: Categoria[] = [
  {
    id: 'Totem de Autoatendimento',
    label: 'Totem de Autoatendimento',
    icon: Monitor,
    descricao: 'Como funciona, preço, dispositivos, pagamentos e configuração.',
    cor: 'text-cw-purple-light',
    bg: 'bg-cw-purple/8',
    borda: 'border-cw-purple/30',
    badge: 'Novo',
  },
  {
    id: 'Planos & Preços',
    label: 'Planos & Preços',
    icon: DollarSign,
    descricao: 'Valores dos planos, módulos add-on, descontos e promoções.',
    cor: 'text-emerald-400',
    bg: 'bg-emerald-500/8',
    borda: 'border-emerald-500/30',
  },
  {
    id: 'Produto',
    label: 'Produto',
    icon: Package,
    descricao: 'ChatBot com IA, disparador, KDS, iFood e funcionalidades gerais.',
    cor: 'text-blue-400',
    bg: 'bg-blue-500/8',
    borda: 'border-blue-500/30',
  },
  {
    id: 'Integração WhatsApp (Meta)',
    label: 'Integração WhatsApp (Meta)',
    icon: MessageCircle,
    descricao: 'API oficial da Meta: ChatBot, notificações, coexistência e janelas de conversa.',
    cor: 'text-green-400',
    bg: 'bg-green-500/8',
    borda: 'border-green-500/30',
    badge: 'Novo',
  },
  {
    id: 'CW App Store',
    label: 'CW App Store',
    icon: Store,
    descricao: 'Marketplace de apps: instalar, permissões (OAuth), categorias e avaliações.',
    cor: 'text-orange-400',
    bg: 'bg-orange-500/8',
    borda: 'border-orange-500/30',
    badge: 'Novo',
  },
];

export default function Faq() {
  const [selectedCat, setSelectedCat] = useState<string | null>('Totem de Autoatendimento');

  const catAtual = CATEGORIAS.find((c) => c.id === selectedCat);
  const perguntasCat = selectedCat ? FAQ.filter((f) => f.categoria === selectedCat) : [];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cw-text">FAQ</h1>
        <p className="text-sm text-cw-muted mt-1">Perguntas frequentes por tema. Clique em uma categoria para ver as respostas.</p>
      </div>

      {/* Cards de categoria */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORIAS.map((cat) => {
          const Icon = cat.icon;
          const count = FAQ.filter((f) => f.categoria === cat.id).length;
          const isActive = selectedCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(isActive ? null : cat.id)}
              className={cn(
                'relative text-left rounded-2xl border p-5 transition-all duration-200 group',
                cat.bg, cat.borda,
                isActive
                  ? 'ring-2 ring-offset-2 ring-offset-cw-bg scale-[1.02] shadow-lg'
                  : 'hover:scale-[1.01] hover:shadow-md',
                isActive && cat.id === 'Totem de Autoatendimento' && 'ring-cw-purple',
                isActive && cat.id === 'Planos & Preços' && 'ring-emerald-500',
                isActive && cat.id === 'Produto' && 'ring-blue-500',
                isActive && cat.id === 'Integração WhatsApp (Meta)' && 'ring-green-500',
                isActive && cat.id === 'CW App Store' && 'ring-orange-500',
              )}
            >
              {cat.badge && (
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cw-yellow/20 text-cw-yellow border border-cw-yellow/40">
                  {cat.badge}
                </span>
              )}
              <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center mb-3', cat.bg, 'border', cat.borda)}>
                <Icon className={cn('h-5 w-5', cat.cor)} />
              </div>
              <h3 className={cn('font-bold text-cw-text mb-1 pr-8')}>{cat.label}</h3>
              <p className="text-xs text-cw-muted leading-relaxed mb-3">{cat.descricao}</p>
              <div className="flex items-center justify-between">
                <span className={cn('text-[10px] font-bold uppercase tracking-wider', cat.cor)}>
                  {count} {count === 1 ? 'pergunta' : 'perguntas'}
                </span>
                <ChevronRight className={cn('h-4 w-4 transition-transform', cat.cor, isActive && 'rotate-90')} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Perguntas da categoria selecionada */}
      {catAtual && perguntasCat.length > 0 && (
        <div className="cw-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedCat(null)}
              className="h-8 w-8 rounded-lg border border-cw-border flex items-center justify-center hover:bg-cw-elevated transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-cw-muted" />
            </button>
            <div className="flex items-center gap-2">
              <HelpCircle className={cn('h-4 w-4', catAtual.cor)} />
              <h2 className="text-base font-bold text-cw-text">{catAtual.label}</h2>
              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', catAtual.bg, 'border', catAtual.borda, catAtual.cor)}>
                {perguntasCat.length} perguntas
              </span>
            </div>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {perguntasCat.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-cw-border rounded-xl px-4 bg-cw-bg/50 hover:border-cw-purple/40 transition-colors"
              >
                <AccordionTrigger className="text-sm font-semibold text-cw-text hover:no-underline py-4 text-left">
                  {item.pergunta}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-cw-muted leading-relaxed pb-4 whitespace-pre-line">
                  {item.resposta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
