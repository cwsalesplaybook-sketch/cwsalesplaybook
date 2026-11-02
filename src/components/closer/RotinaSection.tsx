/** Seções da aba Rotina: Hora de Ouro (rotina, boas práticas, CRM). */
import { useState } from 'react';
import {
  Zap, Clock, FileSpreadsheet, Video, PhoneCall, MessagesSquare, MessageSquareReply,
  Target, Users, ListChecks, CalendarClock, Inbox, Flag, History, RefreshCw, TriangleAlert,
  CalendarCheck, Search, ClipboardList, CircleCheck, Check, ArrowRight, BookOpen,
  ChevronRight, UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CLOSER_HORA_OURO_DEF,
  CLOSER_HORA_OURO_PRATICAS,
  CLOSER_HORA_OURO_CRM,
  CLOSER_HORA_OURO_CRM_OBS,
} from '@/data/playbookCloser';

/* ----------------------- HORA DE OURO ----------------------- */

type Aba = 'rotina' | 'praticas' | 'crm';
type Duracao = 30 | 45;

interface Bloco { inicio: string; fim: string; atividade: string; icon: LucideIcon; ouro?: boolean; }

const ROTINAS: Record<Duracao, Bloco[]> = {
  30: [
    { inicio: '09:00', fim: '09:30', atividade: 'Preencher planilha e responder às mensagens de leads do dia anterior', icon: FileSpreadsheet },
    { inicio: '09:30', fim: '11:00', atividade: 'Rotina geral de reuniões/treinamento', icon: Video },
    { inicio: '11:00', fim: '11:30', atividade: 'Hora de ouro de ligações', icon: PhoneCall, ouro: true },
    { inicio: '11:30', fim: '12:00', atividade: 'Rotina geral de reuniões/treinamento', icon: Video },
    { inicio: '13:00', fim: '13:30', atividade: 'Roleplay / Cumbuca / Call Review', icon: MessagesSquare },
    { inicio: '13:30', fim: '15:00', atividade: 'Rotina geral de reuniões/treinamento', icon: Video },
    { inicio: '15:00', fim: '15:45', atividade: 'Hora de ouro geral', icon: Zap, ouro: true },
    { inicio: '15:45', fim: '16:45', atividade: 'Rotina geral de reuniões/treinamento', icon: Video },
    { inicio: '16:45', fim: '17:15', atividade: 'Hora de ouro geral e foco em responder feedbacks não respondidos', icon: MessageSquareReply, ouro: true },
    { inicio: '17:15', fim: '18:45', atividade: 'Rotina geral de reuniões/treinamento', icon: Video },
  ],
  45: [
    { inicio: '09:00', fim: '09:15', atividade: 'Preencher planilha', icon: FileSpreadsheet },
    { inicio: '09:15', fim: '12:00', atividade: 'Rotina geral de reuniões/treinamento', icon: Video },
    { inicio: '13:00', fim: '13:30', atividade: 'Roleplay / Cumbuca / Call Review', icon: MessagesSquare },
    { inicio: '13:30', fim: '15:00', atividade: 'Rotina geral de reuniões/treinamento', icon: Video },
    { inicio: '15:00', fim: '15:45', atividade: 'Hora de ouro geral — foco em ligações', icon: PhoneCall, ouro: true },
    { inicio: '15:45', fim: '18:45', atividade: 'Rotina geral de reuniões/treinamento', icon: Video },
  ],
};

const PERFIS: { duracao: Duracao; badge: string; itens: string[] }[] = [
  { duracao: 30, badge: 'Mais dinâmico', itens: [
    'Mais blocos de reuniões durante o dia',
    'Ritmo mais acelerado',
    'Maior volume de atendimentos',
    'Ideal para alta cadência comercial',
  ] },
  { duracao: 45, badge: 'Mais aprofundado', itens: [
    'Menor número de reuniões',
    'Mais tempo por atendimento',
    'Maior espaço para aprofundar diagnóstico',
    'Ideal para negociações consultivas e mais complexas',
  ] },
];

const BOAS_PRATICAS: { titulo: string; desc: string; icon: LucideIcon }[] = [
  { titulo: 'Mantenha foco total durante a Hora de Ouro', desc: 'Sem distrações: notificações, abas e conversas paralelas ficam para depois.', icon: Zap },
  { titulo: 'Priorize ligações, follow-ups e atividades de alto impacto', desc: 'O que avança oportunidade vem antes de qualquer tarefa operacional.', icon: Target },
  { titulo: 'Participe das rotinas de treinamento e alinhamento', desc: 'Os encontros do time mantêm discurso e processo afinados.', icon: Users },
  { titulo: 'Faça roleplay e call review', desc: 'Treinar e revisar ligações é o caminho mais curto para evoluir.', icon: MessagesSquare },
  { titulo: 'Atualize seu CRM diariamente', desc: 'Pipedrive em dia é contexto garantido para você e para o time.', icon: RefreshCw },
  { titulo: 'Sempre defina o próximo passo da oportunidade', desc: 'Toda conversa termina com uma ação e uma data combinadas.', icon: ArrowRight },
  { titulo: 'Responda leads e feedbacks pendentes', desc: 'Lead sem resposta esfria; feche o dia sem pendências.', icon: MessageSquareReply },
  { titulo: 'Evite deixar oportunidades sem atividade futura', desc: 'Oportunidade sem atividade agendada é oportunidade esquecida.', icon: CalendarClock },
];

const CHECKLIST_CRM: { item: string; icon: LucideIcon }[] = [
  { item: 'Conferir oportunidades sem atividade', icon: Search },
  { item: 'Atualizar etapa de cada oportunidade', icon: ListChecks },
  { item: 'Registrar último contato realizado', icon: History },
  { item: 'Definir próximo follow-up', icon: CalendarClock },
  { item: 'Atualizar previsão de fechamento', icon: CalendarCheck },
  { item: 'Conferir leads sem resposta', icon: Inbox },
  { item: 'Registrar motivo de perda quando necessário', icon: Flag },
  { item: 'Revisar oportunidades atrasadas', icon: TriangleAlert },
];

const ABAS: { id: Aba; label: string }[] = [
  { id: 'rotina', label: 'Rotina' },
  { id: 'praticas', label: 'Boas práticas' },
  { id: 'crm', label: 'Atualização do CRM' },
];

function TabTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-lg font-black text-cw-text">{title}</h2>
      {subtitle && <p className="text-sm text-cw-muted mt-0.5">{subtitle}</p>}
    </div>
  );
}

function OuroBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-cw-yellow/15 border border-cw-yellow/40 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#9a6b00]">
      <Zap className="h-2.5 w-2.5" /> Hora de ouro
    </span>
  );
}

function Timeline({ blocos }: { blocos: Bloco[] }) {
  return (
    <ol className="relative">
      {blocos.map((b, i) => {
        const Icon = b.icon;
        const ultimo = i === blocos.length - 1;
        // Pausa de almoço: intervalo entre um bloco que termina e o próximo que começa mais tarde
        const almoco = !ultimo && blocos[i + 1].inicio !== b.fim;
        return (
          <li key={`${b.inicio}-${b.fim}`} className="relative pl-12">
            {/* Linha vertical + ícone */}
            {!ultimo && <span className="absolute left-[17px] top-9 bottom-0 w-px bg-cw-border" />}
            <span className={cn(
              'absolute left-0 top-1.5 h-9 w-9 rounded-xl flex items-center justify-center border',
              b.ouro ? 'bg-cw-yellow/15 border-cw-yellow/40 text-[#b07a00]' : 'bg-cw-elevated border-cw-border text-cw-purple',
            )}>
              <Icon className="h-4 w-4" />
            </span>

            <div className={cn(
              'rounded-xl px-3 py-2.5 mb-2',
              b.ouro ? 'bg-cw-yellow/[0.07] border border-cw-yellow/30' : 'hover:bg-cw-elevated',
            )}>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums',
                  b.ouro ? 'bg-cw-yellow/20 text-[#8a5f00]' : 'bg-cw-purple/10 text-cw-purple-dark',
                )}>
                  <Clock className="h-3 w-3" /> {b.inicio} – {b.fim}
                </span>
                {b.ouro && <OuroBadge />}
              </div>
              <p className={cn('text-sm leading-snug', b.ouro ? 'font-bold text-cw-text' : 'font-medium text-cw-text')}>
                {b.atividade}
              </p>
            </div>

            {almoco && (
              <div className="flex items-center gap-2 mb-2 -ml-12 pl-12 text-[10px] font-semibold uppercase tracking-wider text-cw-muted/70">
                <UtensilsCrossed className="h-3 w-3" /> Pausa · {b.fim} – {blocos[i + 1].inicio}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function RotinaTab() {
  const [duracao, setDuracao] = useState<Duracao>(30);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <TabTitle title="Rotina dos Closers" subtitle="Escolha o modelo de rotina de acordo com o tempo médio das reuniões do seu time." />
        <div className="inline-flex self-start rounded-full bg-cw-surface border border-cw-border p-1 shrink-0">
          {([30, 45] as const).map(d => (
            <button
              key={d}
              onClick={() => setDuracao(d)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap',
                duracao === d ? 'bg-cw-purple text-white shadow-sm' : 'text-cw-muted hover:text-cw-text',
              )}
            >
              Reuniões de {d} minutos
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="cw-card p-4 sm:p-5">
          <Timeline blocos={ROTINAS[duracao]} />
        </div>

        <aside className="cw-card p-4 sm:p-5 space-y-4 self-start">
          <p className="text-sm font-black text-cw-text">Qual a diferença entre os closers?</p>
          {PERFIS.map(p => (
            <div
              key={p.duracao}
              className={cn(
                'rounded-xl border p-3 space-y-2 transition-colors',
                duracao === p.duracao ? 'border-cw-purple/40 bg-cw-purple/[0.04]' : 'border-cw-border',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-cw-text">Reuniões de {p.duracao} minutos</p>
                <span className="rounded-full bg-cw-purple/10 px-2 py-0.5 text-[10px] font-bold text-cw-purple whitespace-nowrap">{p.badge}</span>
              </div>
              <ul className="space-y-1">
                {p.itens.map(item => (
                  <li key={item} className="flex items-start gap-1.5 text-xs text-cw-muted">
                    <Check className="h-3 w-3 mt-0.5 shrink-0 text-cw-purple" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

function PraticasTab() {
  return (
    <div className="space-y-4">
      <TabTitle title="Boas práticas comerciais" />

      <div className="grid gap-3 sm:grid-cols-2">
        {BOAS_PRATICAS.map(p => {
          const Icon = p.icon;
          return (
            <div key={p.titulo} className="cw-card p-4 flex items-start gap-3">
              <span className="h-9 w-9 rounded-xl bg-cw-purple/10 text-cw-purple flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-cw-text leading-snug flex items-start gap-1.5">
                  <CircleCheck className="h-4 w-4 mt-px shrink-0 text-cw-purple" />
                  {p.titulo}
                </p>
                <p className="text-xs text-cw-muted mt-1 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Regras do time (conteúdo original da aba, mantido) */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="cw-card p-4 sm:p-5">
          <p className="text-sm font-black text-cw-text mb-3 flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-cw-purple" /> Regras do time na Hora de Ouro
          </p>
          <ul className="divide-y divide-cw-border">
            {CLOSER_HORA_OURO_PRATICAS.map(p => (
              <li key={p} className="flex items-start gap-2 py-2 text-xs text-cw-text leading-relaxed">
                <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-cw-purple" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="cw-card p-4 sm:p-5 self-start">
          <p className="text-sm font-black text-cw-text mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-cw-purple" /> De onde vem a Hora de Ouro
          </p>
          <p className="text-xs text-cw-muted leading-relaxed whitespace-pre-line">{CLOSER_HORA_OURO_DEF}</p>
        </div>
      </div>
    </div>
  );
}

function CrmTab() {
  return (
    <div className="space-y-4">
      <TabTitle title="Checklist diário do CRM" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="cw-card p-2 sm:p-3">
          <ul className="grid sm:grid-cols-2 gap-1">
            {CHECKLIST_CRM.map(c => {
              const Icon = c.icon;
              return (
                <li key={c.item} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-cw-elevated">
                  <span className="h-5 w-5 rounded-md border-2 border-cw-purple/40 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-cw-purple" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-cw-text">{c.item}</span>
                  <Icon className="h-4 w-4 text-cw-muted/60 shrink-0" />
                </li>
              );
            })}
          </ul>
        </div>

        {/* Passo a passo no Pipedrive (conteúdo original da aba, mantido) */}
        <div className="space-y-3 self-start">
          <div className="cw-card p-4">
            <p className="text-sm font-black text-cw-text mb-3 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-cw-purple" /> Passo a passo no Pipedrive
            </p>
            <ol className="space-y-2">
              {CLOSER_HORA_OURO_CRM.map((step, i) => (
                <li key={step} className="flex items-start gap-2.5 text-xs text-cw-text leading-relaxed">
                  <span className="h-5 w-5 rounded-full bg-cw-purple/10 text-[10px] font-bold text-cw-purple flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-cw-yellow/40 bg-cw-yellow/[0.08] p-3">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#9a6b00] mb-1 flex items-center gap-1">
              <TriangleAlert className="h-3 w-3" /> Importante
            </p>
            <p className="text-xs text-cw-text leading-relaxed">{CLOSER_HORA_OURO_CRM_OBS}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HoraOuroSection() {
  const [tab, setTab] = useState<Aba>('rotina');

  return (
    <div className="space-y-5">
      {/* Destaque — Hora de Ouro */}
      <div className="gradient-primary rounded-2xl px-5 py-4 sm:px-6 sm:py-5 flex flex-col md:flex-row md:items-center gap-4 text-white shadow-[0_8px_24px_rgba(89,50,122,0.25)]">
        <span className="h-11 w-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
          <Zap className="h-5 w-5 text-cw-yellow" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cw-yellow">Hora de ouro</p>
          <p className="text-lg font-black leading-tight mt-0.5">Foque no que gera mais resultado</p>
          <p className="text-sm text-white/80 mt-1 leading-relaxed max-w-2xl">
            Período comercial de maior produtividade, dedicado às atividades de alto impacto — especialmente ligações, follow-ups e avanço de oportunidades — com foco total e sem distrações.
          </p>
        </div>
        <button
          onClick={() => setTab('praticas')}
          className="self-start md:self-center shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white text-cw-purple-dark px-4 py-2 text-xs font-bold hover:bg-white/90 transition-colors"
        >
          Ver boas práticas <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Navegação interna */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mb-1">
        {ABAS.map(a => (
          <button
            key={a.id}
            onClick={() => setTab(a.id)}
            className={cn(
              'text-xs font-semibold px-4 py-2 rounded-full border transition-colors whitespace-nowrap',
              tab === a.id ? 'gradient-primary text-white border-transparent' : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text',
            )}
          >
            {a.label}
          </button>
        ))}
      </div>

      {tab === 'rotina' && <RotinaTab />}
      {tab === 'praticas' && <PraticasTab />}
      {tab === 'crm' && <CrmTab />}
    </div>
  );
}
