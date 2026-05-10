/** Sub-aba "Cultura & Estratégia" do Playbook: Missão/Visão, Valores e Estratégia. */
import {
  Target, Eye, Zap, Shield, Star, Heart, RefreshCw, Rocket, Scale,
  Compass, Briefcase,
} from 'lucide-react';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  MISSAO, VISAO, VALORES, PILARES_OPERACIONAIS, VISAO_MERCADO,
  type IconeValor,
} from '@/data/estrategia';

const VALOR_ICONS: Record<IconeValor, typeof Zap> = {
  Zap, Shield, Star, Heart, RefreshCw, Rocket, Scale,
};

function SectionDivider({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="h-px flex-1 bg-cw-border" />
      <div className="text-center">
        <h2 className="text-xl font-bold text-cw-text uppercase tracking-wider">{title}</h2>
        {subtitle && <p className="text-sm text-cw-muted mt-1">{subtitle}</p>}
      </div>
      <div className="h-px flex-1 bg-cw-border" />
    </div>
  );
}

export function CulturaEstrategia() {
  return (
    <div className="space-y-6">
      {/* ── SUB-SEÇÃO A: MISSÃO & VISÃO ─────────────────────── */}
      <SectionDivider title="Missão & Visão" subtitle="Por que existimos e onde queremos chegar." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* MISSÃO */}
        <div className="cw-card cw-card-hover p-6 relative overflow-hidden">
          <div className="absolute inset-0 gradient-glow pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-cw-purple-light">Nossa Missão</p>
                <h3 className="text-lg font-bold text-cw-text">Por que existimos</h3>
              </div>
            </div>

            <p className="text-2xl font-bold leading-snug mb-5 text-gradient-primary">
              {MISSAO.destaque}
            </p>

            <Accordion type="single" collapsible>
              <AccordionItem value="missao-ctx" className="border-cw-border">
                <AccordionTrigger className="text-sm font-semibold text-cw-purple-light hover:text-cw-yellow hover:no-underline">
                  Entenda o contexto completo
                </AccordionTrigger>
                <AccordionContent className="text-sm text-cw-muted leading-relaxed whitespace-pre-line">
                  {MISSAO.contexto}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* VISÃO */}
        <div className="cw-card cw-card-hover p-6 relative overflow-hidden">
          <div className="absolute inset-0 gradient-glow pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 rounded-xl gradient-hot flex items-center justify-center shrink-0">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-cw-yellow">Nossa Visão</p>
                <h3 className="text-lg font-bold text-cw-text">Onde queremos chegar</h3>
              </div>
            </div>

            <p className="text-2xl font-bold leading-snug mb-5 text-cw-text">
              {VISAO.destaque}
            </p>

            <Accordion type="single" collapsible>
              <AccordionItem value="visao-ctx" className="border-cw-border">
                <AccordionTrigger className="text-sm font-semibold text-cw-purple-light hover:text-cw-yellow hover:no-underline">
                  O que isso significa na prática
                </AccordionTrigger>
                <AccordionContent className="text-sm text-cw-muted leading-relaxed whitespace-pre-line">
                  {VISAO.contexto}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* ── SUB-SEÇÃO B: VALORES ─────────────────────── */}
      <SectionDivider title="Nossos Valores" subtitle="Os princípios que guiam cada decisão que tomamos." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {VALORES.map((valor, i) => {
          const Icon = VALOR_ICONS[valor.icone];
          return (
            <div key={valor.id} className="cw-card cw-card-hover p-5 flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-cw-purple/15 border border-cw-purple/40 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-cw-purple-light" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-cw-muted mb-0.5">
                    Valor {i + 1}
                  </p>
                  <h4 className="font-bold text-cw-text leading-tight">{valor.nome}</h4>
                </div>
              </div>
              <p className="text-sm text-cw-muted leading-relaxed mb-3 flex-1">{valor.definicao}</p>

              <Accordion type="single" collapsible>
                <AccordionItem value={`v-${valor.id}`} className="border-cw-border">
                  <AccordionTrigger className="text-xs font-semibold text-cw-purple-light hover:text-cw-yellow hover:no-underline py-2">
                    Ver exemplos
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pt-1">
                      {valor.exemplos.map((ex, idx) => (
                        <li key={idx} className="text-xs text-cw-muted leading-relaxed flex gap-2">
                          <span className="text-cw-yellow shrink-0">→</span>
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          );
        })}
      </div>

      {/* ── SUB-SEÇÃO C: ESTRATÉGIA ─────────────────────── */}
      <SectionDivider title="Nossa Estratégia" subtitle="Os pilares que direcionam como crescemos." />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* BLOCO 1 — Pilares operacionais (40%) */}
        <div className="lg:col-span-2 cw-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="h-4 w-4 text-cw-purple-light" />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cw-purple/20 text-cw-purple-light border border-cw-purple/40">
              Pilares operacionais
            </span>
          </div>
          <h3 className="text-lg font-bold text-cw-text mb-4">Como trabalhamos</h3>

          <Accordion type="single" collapsible className="space-y-2">
            {PILARES_OPERACIONAIS.map((p) => (
              <AccordionItem
                key={p.id}
                value={p.id}
                className="border border-cw-border rounded-lg px-3 bg-cw-bg/50 hover:border-cw-purple/50 transition-colors"
              >
                <AccordionTrigger className="text-sm font-semibold text-cw-text hover:no-underline py-3 text-left">
                  {p.nome}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-cw-muted leading-relaxed pb-3">
                  {p.descricao}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* BLOCO 2 — Visão de mercado (60%) */}
        <div className="lg:col-span-3 cw-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-4 w-4 text-cw-yellow" />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cw-yellow/15 text-cw-yellow border border-cw-yellow/40">
              Onde estamos indo
            </span>
          </div>
          <h3 className="text-lg font-bold text-cw-text mb-4">Nossa visão de mercado</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {VISAO_MERCADO.map((v) => (
              <div
                key={v.id}
                className="rounded-lg border border-cw-border bg-cw-bg/50 p-4 hover:border-cw-purple/50 transition-colors"
              >
                <h4 className="font-bold text-cw-text text-sm mb-2 leading-snug">{v.titulo}</h4>
                <p className="text-xs text-cw-muted leading-relaxed">{v.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CulturaEstrategia;
