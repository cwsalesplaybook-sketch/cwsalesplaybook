/** Seções do Processo de Venda: Etapas da reunião, Critérios, Follow-up, Funis, SPIN. */
import { useState } from 'react';
import { ChevronDown, Clock, Copy, Check, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CLOSER_ETAPAS_REUNIAO,
  CLOSER_CRITERIOS_PRINCIPAIS,
  CLOSER_CRITERIOS_BONUS,
  CLOSER_SPIN,
  CLOSER_FOLLOWUP_VIDEO,
  CLOSER_FOLLOWUP_EXCLUSIVOS,
  CLOSER_FUNIS,
  type EtapaReuniao,
  type CriterioAvaliacao,
  type SpinExemplo,
  type FollowUpStep,
  type FunilEtapa,
} from '@/data/playbookCloser';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">{children}</p>;
}

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return { copied, copy };
}

/* ----------------------- ETAPAS DA REUNIÃO ----------------------- */

function EtapaCard({ e, idx }: { e: EtapaReuniao; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cw-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-cw-elevated transition-colors"
      >
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-cw-purple/15 border border-cw-purple/30 flex items-center justify-center text-xs font-black text-cw-purple">
          {idx + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-cw-text">{e.topico}</p>
          <p className="flex items-center gap-1 text-xs text-cw-muted mt-0.5">
            <Clock className="h-3 w-3" /> {e.tempo}
          </p>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-cw-muted shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-cw-border space-y-4">
          <div className="mt-3">
            <p className="text-[11px] font-bold text-cw-purple uppercase tracking-wide mb-1">Detalhes</p>
            <p className="text-sm text-cw-muted leading-relaxed">{e.detalhes}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-cw-purple uppercase tracking-wide mb-1">Como será avaliado</p>
            <p className="text-sm text-cw-muted leading-relaxed whitespace-pre-line">{e.avaliacao}</p>
          </div>
          <div className="bg-cw-yellow/8 border border-cw-yellow/20 rounded-xl p-3">
            <p className="text-[10px] font-bold text-cw-yellow uppercase tracking-wide mb-1.5">Exemplo</p>
            <p className="text-xs text-cw-text leading-relaxed whitespace-pre-line">{e.exemplo}</p>
          </div>
          {e.criterios && (
            <div className="flex flex-wrap gap-1.5">
              {e.criterios.split(',').map(c => (
                <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-cw-purple/10 text-cw-purple border border-cw-purple/20 font-medium">
                  {c.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function EtapasReuniaoSection() {
  return (
    <div className="space-y-5">
      <div className="cw-card p-5">
        <SectionTitle>Passo a passo da reunião</SectionTitle>
        <p className="text-sm text-cw-muted">Manual de como conduzir uma boa reunião. Cada etapa traz detalhes, como será avaliada e um exemplo prático.</p>
      </div>
      <div className="space-y-2">
        {CLOSER_ETAPAS_REUNIAO.map((e, i) => (
          <EtapaCard key={e.topico} e={e} idx={i} />
        ))}
      </div>
    </div>
  );
}

/* ----------------------- CRITÉRIOS DE AVALIAÇÃO ----------------------- */

function CriterioCard({ c }: { c: CriterioAvaliacao }) {
  const [open, setOpen] = useState(false);
  const pesoColor =
    c.peso >= 10 ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
    : c.peso >= 8 ? 'text-cw-yellow border-cw-yellow/30 bg-cw-yellow/10'
    : 'text-cw-muted border-cw-border bg-cw-surface';
  return (
    <div className="cw-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-cw-elevated transition-colors"
      >
        <div className={cn('flex-shrink-0 h-8 w-8 rounded-full border flex items-center justify-center text-xs font-black', pesoColor)}>
          {c.peso}
        </div>
        <p className="flex-1 font-bold text-sm text-cw-text">{c.criterio}</p>
        <ChevronDown className={cn('h-4 w-4 text-cw-muted shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-cw-border">
          <p className="text-sm text-cw-muted leading-relaxed mt-3">{c.descricao}</p>
        </div>
      )}
    </div>
  );
}

export function CriteriosSection() {
  return (
    <div className="space-y-5">
      <div className="cw-card p-5">
        <SectionTitle>Critérios de avaliação</SectionTitle>
        <p className="text-sm text-cw-muted">Cada critério possui um peso (1-10). Os critérios bônus são diferenciais que elevam a nota da reunião.</p>
      </div>
      <div>
        <p className="text-xs font-bold text-cw-text mb-2">Critérios principais</p>
        <div className="space-y-2">
          {CLOSER_CRITERIOS_PRINCIPAIS.map(c => (
            <CriterioCard key={c.criterio} c={c} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-cw-text mb-2">Combos (Bônus)</p>
        <p className="text-xs text-cw-muted mb-3">Critérios bônus que diferenciam os melhores closers.</p>
        <div className="space-y-2">
          {CLOSER_CRITERIOS_BONUS.map(c => (
            <CriterioCard key={c.criterio} c={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------- FOLLOW-UP ----------------------- */

function TemplateBox({ template, kommoTag }: { template: string; kommoTag: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="bg-cw-elevated border border-cw-border rounded-xl p-3 space-y-2">
      {kommoTag && (
        <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cw-purple/15 text-cw-purple border border-cw-purple/20">
          {kommoTag}
        </span>
      )}
      <p className="text-xs text-cw-text leading-relaxed whitespace-pre-line">{template}</p>
      <button
        onClick={() => copy(template)}
        className="flex items-center gap-1.5 text-[11px] font-medium text-cw-muted hover:text-cw-purple transition-colors"
      >
        {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
        {copied ? 'Copiado!' : 'Copiar mensagem'}
      </button>
    </div>
  );
}

function FollowUpStepCard({ s }: { s: FollowUpStep }) {
  const [open, setOpen] = useState(false);
  const [ver, setVer] = useState(0);
  const v = s.versions[ver];
  return (
    <div className="cw-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-cw-elevated transition-colors"
      >
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-cw-purple/15 border border-cw-purple/30 flex items-center justify-center text-xs font-black text-cw-purple">
          {s.step}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-cw-text">{s.titulo}</p>
          {s.etapa && <p className="text-[11px] text-cw-purple mt-0.5">Etapa: {s.etapa}</p>}
        </div>
        <ChevronDown className={cn('h-4 w-4 text-cw-muted shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-cw-border space-y-3">
          <p className="text-sm text-cw-muted leading-relaxed mt-3 whitespace-pre-line">{s.descricao}</p>
          {s.versions.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {s.versions.map((sv, i) => (
                <button
                  key={i}
                  onClick={() => setVer(i)}
                  className={cn(
                    'text-xs font-medium px-3 py-1 rounded-full border transition-colors',
                    ver === i ? 'gradient-primary text-white border-transparent' : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text',
                  )}
                >
                  {sv.label}
                </button>
              ))}
            </div>
          )}
          {v && <TemplateBox template={v.template} kommoTag={v.kommoTag} />}
        </div>
      )}
    </div>
  );
}

export function FollowUpSection() {
  const [tab, setTab] = useState<'video' | 'exclusivos'>('video');
  const steps = tab === 'video' ? CLOSER_FOLLOWUP_VIDEO : CLOSER_FOLLOWUP_EXCLUSIVOS;
  return (
    <div className="space-y-5">
      <div className="cw-card p-5">
        <SectionTitle>Follow-up</SectionTitle>
        <p className="text-sm text-cw-muted">Sequência de mensagens e ações para acompanhar o lead após a reunião ou contato inicial.</p>
      </div>
      <div className="flex gap-2">
        {(['video', 'exclusivos'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'text-xs font-medium px-4 py-2 rounded-full border transition-colors',
              tab === t ? 'gradient-primary text-white border-transparent' : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text',
            )}
          >
            {t === 'video' ? 'Follow-up de Vídeo Chamada' : 'Follow-up de Exclusivos e WhatsApp'}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {steps.map(s => (
          <FollowUpStepCard key={`${tab}-${s.step}`} s={s} />
        ))}
      </div>
    </div>
  );
}

/* ----------------------- FUNIS DE VENDAS ----------------------- */

function FunilCard({ f }: { f: FunilEtapa }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cw-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-cw-elevated transition-colors"
      >
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-cw-purple/15 border border-cw-purple/30 flex items-center justify-center text-xs font-black text-cw-purple">
          {f.id}
        </div>
        <p className="flex-1 font-bold text-sm text-cw-text">{f.nome}</p>
        <ChevronDown className={cn('h-4 w-4 text-cw-muted shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-cw-border space-y-3">
          <div className="mt-3">
            <p className="text-[11px] font-bold text-cw-purple uppercase tracking-wide mb-1">Descrição</p>
            <p className="text-sm text-cw-muted leading-relaxed">{f.descricao}</p>
          </div>
          <div className="bg-amber-500/8 border border-amber-500/25 rounded-xl p-3">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wide mb-1">⚠ Importante</p>
            <p className="text-xs text-cw-text leading-relaxed">{f.importante}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-cw-purple uppercase tracking-wide mb-1">Ações do Closer</p>
            <p className="text-sm text-cw-muted leading-relaxed">{f.acoes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function FunisSection() {
  return (
    <div className="space-y-5">
      <div className="cw-card p-5">
        <SectionTitle>Etapas de um lead no Pipedrive</SectionTitle>
        <p className="text-sm text-cw-muted">Entenda o que acontece em cada etapa do funil e quais ações o closer deve tomar.</p>
      </div>
      <div className="space-y-2">
        {CLOSER_FUNIS.map(f => (
          <FunilCard key={f.id} f={f} />
        ))}
      </div>
    </div>
  );
}

/* ----------------------- SPIN ----------------------- */

const SPIN_CATEGORIAS = [...new Set(CLOSER_SPIN.map(s => s.categoria))];

function SpinCard({ s }: { s: SpinExemplo }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cw-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-cw-elevated transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-cw-text">Exemplo {s.id}</p>
          <p className="text-xs text-cw-muted mt-0.5">{s.dialogues.length} falas</p>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-cw-muted shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-cw-border space-y-2 mt-3">
          {s.dialogues.map((d, i) => (
            <div
              key={i}
              className={cn(
                'flex gap-2 text-xs leading-relaxed',
                d.speaker === 'intro' && 'italic text-cw-muted bg-cw-elevated border border-cw-border rounded-xl p-3',
              )}
            >
              {d.speaker !== 'intro' && (
                <div className={cn(
                  'flex-shrink-0 flex items-center gap-1 font-bold min-w-[54px]',
                  d.speaker === 'closer' ? 'text-cw-purple' : 'text-cw-muted',
                )}>
                  {d.speaker === 'closer' ? <User className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                  {d.speaker === 'closer' ? 'Closer:' : 'Lead:'}
                </div>
              )}
              <p className="text-cw-text whitespace-pre-line">{d.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SpinSection() {
  const [cat, setCat] = useState(SPIN_CATEGORIAS[0]);
  const filtered = CLOSER_SPIN.filter(s => s.categoria === cat);
  return (
    <div className="space-y-5">
      <div className="cw-card p-5">
        <SectionTitle>SPIN — Exemplos por vertical</SectionTitle>
        <p className="text-sm text-cw-muted">Exemplos de diálogos SPIN organizados por vertical de negócio do lead.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {SPIN_CATEGORIAS.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              'text-xs font-medium px-3 py-1.5 rounded-full border transition-colors',
              cat === c ? 'gradient-primary text-white border-transparent' : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text',
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(s => (
          <SpinCard key={s.id} s={s} />
        ))}
      </div>
    </div>
  );
}
