/** Nossos Valores — extraídos do Memorando da Cardápio Web (Glauton Santos, 2026). */
import { useState } from 'react';
import { ChevronDown, Zap, ShieldCheck, Star, Heart, RefreshCw, Rocket, ShoppingCart, Clock, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const VALORES = [
  {
    icon: Zap,
    titulo: 'Fazer o que precisa ser feito',
    cor: 'text-cw-purple',
    bg: 'bg-cw-purple/8',
    borda: 'border-cw-purple/20',
    resumo: 'Assuma o resultado.',
    descricao: 'Responsabilidade pelo resultado sem se esconder atrás de fronteiras de área, cargo ou conveniência. Se algo afeta o cliente ou a empresa, nossa postura deve ser agir.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Cumprir o que prometemos',
    cor: 'text-blue-600',
    bg: 'bg-blue-50',
    borda: 'border-blue-200',
    resumo: 'Confiança se constrói na repetição.',
    descricao: 'Confiança é construída pela repetição de compromissos honrados, no prazo e com consistência. Credibilidade operacional não é detalhe — é ativo central.',
  },
  {
    icon: Star,
    titulo: 'Importar-se com as pequenas coisas',
    cor: 'text-amber-600',
    bg: 'bg-amber-50',
    borda: 'border-amber-200',
    resumo: 'Qualidade é hábito, não episódio.',
    descricao: 'Excelência nasce do acúmulo de detalhes bem executados: comunicação clara, produto intuitivo, processo organizado. Pequenos descuidos corroem qualidade; pequenos cuidados constroem grandeza.',
  },
  {
    icon: Heart,
    titulo: 'Cuidar dos nossos',
    cor: 'text-cw-red',
    bg: 'bg-red-50',
    borda: 'border-red-200',
    resumo: 'Cuidar é elevar, não suavizar.',
    descricao: 'Apoiar clientes com postura consultiva, desenvolver colegas com franqueza e respeito, preservar um ambiente de confiança. Cuidar significa dar feedback honesto e criar condições reais de evolução.',
  },
  {
    icon: RefreshCw,
    titulo: 'Evoluímos sem esquecer o que aprendemos',
    cor: 'text-green-600',
    bg: 'bg-green-50',
    borda: 'border-green-200',
    resumo: 'Erros viram aprendizado estruturado.',
    descricao: 'Crescer não significa abandonar a história. Quando falhamos, aprendemos com rigor. Quando acertamos, entendemos por quê. Memória operacional e capacidade de aprendizado são vantagens competitivas.',
  },
  {
    icon: Rocket,
    titulo: 'Sonhamos grande',
    cor: 'text-cw-purple',
    bg: 'bg-cw-purple/8',
    borda: 'border-cw-purple/20',
    resumo: 'Construímos o futuro do food.',
    descricao: 'Não trabalhamos apenas para resolver o presente imediato. Trabalhamos para desenvolver o futuro do mercado de food, com responsabilidade, coragem e visão de longo prazo.',
  },
];

const PILARES = [
  {
    icon: ShoppingCart,
    titulo: 'Commerce First',
    descricao: 'O cardápio digital é nossa prioridade nº 1. Priorizamos sempre aquilo que aumenta vendas diretas, melhora conversão e eleva GMV.',
    cor: 'text-cw-purple',
    bg: 'bg-cw-purple/8',
  },
  {
    icon: Clock,
    titulo: 'Built to Last',
    descricao: 'Construímos uma empresa geracional. Não trocamos valor de longo prazo por ganho imediato. Protegemos marca, cultura e confiança como ativos inegociáveis.',
    cor: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Bot,
    titulo: 'A.I. First',
    descricao: 'Tudo que puder ser feito com IA, deve ser feito com IA. Não como feature — como forma de operar. IA pertence a todos, não a um time específico.',
    cor: 'text-green-600',
    bg: 'bg-green-50',
  },
];

function ValorCard({ v }: { v: typeof VALORES[0] }) {
  const [open, setOpen] = useState(false);
  const Icon = v.icon;
  return (
    <button
      onClick={() => setOpen(o => !o)}
      className={cn(
        'w-full text-left rounded-xl border p-3.5 transition-all duration-200',
        open ? `${v.bg} ${v.borda}` : 'bg-white border-cw-border hover:border-cw-purple/30'
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', v.bg)}>
          <Icon className={cn('h-3.5 w-3.5', v.cor)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-cw-text leading-snug">{v.titulo}</p>
          {!open && <p className="text-[11px] text-cw-muted truncate">{v.resumo}</p>}
        </div>
        <ChevronDown className={cn('h-3.5 w-3.5 text-cw-muted shrink-0 transition-transform duration-200', open && 'rotate-180')} />
      </div>
      {open && (
        <p className="text-xs text-cw-text/80 leading-relaxed mt-2.5 pl-9">{v.descricao}</p>
      )}
    </button>
  );
}

export function Valores() {
  const [abaAtiva, setAbaAtiva] = useState<'valores' | 'pilares'>('valores');

  return (
    <section className="cw-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cw-purple/10 flex items-center justify-center">
            <Rocket className="h-4 w-4 text-cw-purple" />
          </div>
          <div>
            <h2 className="text-base font-black text-cw-text">Nossa Cultura</h2>
            <p className="text-xs text-cw-muted">Memorando CW · Glauton Santos · 2026</p>
          </div>
        </div>

        {/* Mini tabs */}
        <div className="flex gap-1 bg-cw-elevated p-1 rounded-xl border border-cw-border">
          {(['valores', 'pilares'] as const).map(aba => (
            <button
              key={aba}
              onClick={() => setAbaAtiva(aba)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-semibold transition-all capitalize',
                abaAtiva === aba
                  ? 'bg-white text-cw-purple shadow-sm border border-cw-border'
                  : 'text-cw-muted hover:text-cw-text'
              )}
            >
              {aba === 'valores' ? 'Valores' : 'Estratégia'}
            </button>
          ))}
        </div>
      </div>

      {/* Valores */}
      {abaAtiva === 'valores' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {VALORES.map(v => <ValorCard key={v.titulo} v={v} />)}
        </div>
      )}

      {/* Pilares estratégicos */}
      {abaAtiva === 'pilares' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PILARES.map(p => {
            const Icon = p.icon;
            return (
              <div key={p.titulo} className={cn('rounded-xl border border-cw-border p-4', p.bg)}>
                <div className={cn('w-8 h-8 rounded-lg bg-white flex items-center justify-center mb-3 shadow-sm')}>
                  <Icon className={cn('h-4 w-4', p.cor)} />
                </div>
                <p className={cn('text-sm font-black mb-1.5', p.cor)}>{p.titulo}</p>
                <p className="text-xs text-cw-text/75 leading-relaxed">{p.descricao}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Missão + Visão */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-cw-elevated border border-cw-border px-4 py-3">
          <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-1">Missão</p>
          <p className="text-xs text-cw-text leading-relaxed">Construir um mercado de food melhor para todos.</p>
        </div>
        <div className="rounded-xl bg-cw-elevated border border-cw-border px-4 py-3">
          <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-1">Visão 2040</p>
          <p className="text-xs text-cw-text leading-relaxed">Ser o e-commerce dos restaurantes do mundo.</p>
        </div>
      </div>
    </section>
  );
}
