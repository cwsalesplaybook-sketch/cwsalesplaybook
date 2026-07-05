/** Playbook de Representantes — espelha fielmente o conteúdo do portal
 *  de canal (cw-playbook-reps.vercel.app): 22 abas, mesma ordem e mesmo
 *  conteúdo real (não é mais placeholder, exceto onde o próprio portal
 *  de reps também mostra "em construção"). */
import { useState } from 'react';
import { Search, ChevronDown, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  REPS_SHEET_LINK, REPS_MISSAO, REPS_VISAO, REPS_VALORES, REPS_PILARES, REPS_ONDE_ESTAMOS_INDO,
  REPS_PRODUTO_FOCOS, REPS_PLANOS_FUNCIONALIDADES, REPS_MODULOS_EXTRAS,
  REPS_PRIMEIROS_PASSOS, REPS_GESTAO, REPS_AUTOMACAO, REPS_AUMENTO_VENDAS, REPS_MODULOS_SISTEMA,
  REPS_SUPORTE, REPS_PLANOS, REPS_DESCONTO_PARCERIA, REPS_PROMO_NEGOCIACAO,
  REPS_DIFERENCIAIS, REPS_CONCORRENTES, REPS_CARGOS, REPS_HACKS, REPS_OBJECOES_MATRIZ,
  REPS_MOTIVOS_PERDA, REPS_FAQ, REPS_MATERIAIS, REPS_MATERIAIS_INTERNOS,
  type RepsArtigo,
} from '@/data/playbookReps';

const TABS = [
  { id: 'cultura',       label: '🧭 Cultura & Estratégia' },
  { id: 'produto',       label: '🛠️ Produto' },
  { id: 'primeiros',     label: '🚀 Primeiros Passos' },
  { id: 'gestao',        label: '📋 Gestão' },
  { id: 'automacao',     label: '⚙️ Automação' },
  { id: 'vendas',        label: '📈 Aumento de Vendas' },
  { id: 'modulos',       label: '🧩 Módulos do Sistema' },
  { id: 'suporte',       label: '🎧 Suporte' },
  { id: 'planos',        label: '💰 Planos & Preços' },
  { id: 'concorrentes',  label: '⚔️ Concorrentes' },
  { id: 'territorio',    label: '🗺️ Território' },
  { id: 'cargos',        label: '🏢 Cargos' },
  { id: 'icp',           label: '🎯 ICP' },
  { id: 'abordagem',     label: '📣 Abordagem' },
  { id: 'negociacao',    label: '🔄 Negociação' },
  { id: 'hacks',         label: '💡 Hacks' },
  { id: 'objecoes',      label: '⚡ Objeções' },
  { id: 'fechamento',    label: '🤝 Fechamento' },
  { id: 'perda',         label: '❌ Motivos de Perda' },
  { id: 'faq',           label: '❓ FAQ' },
  { id: 'materiais',     label: '📚 Materiais' },
  { id: 'internos',      label: '🖥️ Materiais Internos' },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">{children}</p>;
}

function EmBreve({ titulo }: { titulo: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-cw-purple/10 border border-cw-purple/20 flex items-center justify-center">
        <span className="text-3xl">🚧</span>
      </div>
      <h3 className="text-lg font-bold text-cw-text">Em construção</h3>
      <p className="text-sm text-cw-muted max-w-xs leading-relaxed">
        O conteúdo de <strong>{titulo}</strong> ainda está sendo preparado pela liderança. Em breve estará disponível!
      </p>
    </div>
  );
}

/** Renderiza texto com marcação leve: "- item" vira bullet, "1. item" vira lista numerada. */
function ArtigoTexto({ texto }: { texto: string }) {
  const linhas = texto.split('\n');
  return (
    <div className="space-y-2">
      {linhas.map((linha, i) => {
        if (linha.trim() === '') return <div key={i} className="h-2" />;
        if (/^\d+\.\s/.test(linha)) {
          const n = linha.match(/^\d+/)?.[0];
          return (
            <div key={i} className="flex items-start gap-2 text-sm text-cw-text/90">
              <span className="text-cw-purple font-bold shrink-0">{n}.</span>
              <span>{linha.replace(/^\d+\.\s*/, '')}</span>
            </div>
          );
        }
        if (linha.startsWith('- ')) {
          return (
            <div key={i} className="flex items-start gap-2 text-sm text-cw-text/90 pl-1">
              <span className="text-cw-purple mt-1 shrink-0">•</span>
              <span>{linha.replace(/^-\s*/, '')}</span>
            </div>
          );
        }
        return <p key={i} className="text-sm text-cw-text/90 leading-relaxed">{linha}</p>;
      })}
    </div>
  );
}

/** Lista de artigos em accordion (abre só um por vez), com busca opcional. */
function ArtigosAccordion({ artigos, comBusca }: { artigos: RepsArtigo[]; comBusca?: boolean }) {
  const [aberto, setAberto] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const termo = busca.trim().toLowerCase();
  const filtrados = termo ? artigos.filter(a => a.titulo.toLowerCase().includes(termo) || a.conteudo.toLowerCase().includes(termo)) : artigos;

  return (
    <div className="space-y-3">
      {comBusca && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cw-muted" />
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar artigo..."
            className="w-full bg-cw-surface border border-cw-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50"
          />
        </div>
      )}
      <div className="space-y-2">
        {filtrados.map(a => {
          const open = aberto === a.titulo;
          return (
            <div key={a.titulo} className="cw-card overflow-hidden">
              <button
                onClick={() => setAberto(open ? null : a.titulo)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-cw-elevated transition-colors"
              >
                <span className="text-sm font-bold text-cw-text">{a.titulo}</span>
                <ChevronDown className={cn('h-4 w-4 text-cw-muted shrink-0 transition-transform', open && 'rotate-180')} />
              </button>
              {open && (
                <div className="px-4 pb-4 pt-1 border-t border-cw-border">
                  <ArtigoTexto texto={a.conteudo} />
                </div>
              )}
            </div>
          );
        })}
        {filtrados.length === 0 && (
          <p className="text-sm text-cw-muted text-center py-8">Nenhum artigo encontrado.</p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Cultura & Estratégia ─────────────────────── */

function ValorCard({ idx, valor }: { idx: number; valor: (typeof REPS_VALORES)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cw-card p-4">
      <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-1">Valor {idx + 1}</p>
      <p className="font-bold text-sm text-cw-text mb-1.5">{valor.titulo}</p>
      <p className="text-xs text-cw-muted leading-relaxed">{valor.descricao}</p>
      <button
        onClick={() => setOpen(o => !o)}
        className="mt-2 text-xs font-semibold text-cw-purple-light hover:underline"
      >
        Ver exemplos
      </button>
      {open && (
        <div className="mt-2 space-y-1.5 border-t border-cw-border pt-2">
          {valor.exemplos.map((ex, i) => (
            <p key={i} className="text-xs text-cw-text/80 flex gap-2"><span className="text-cw-purple shrink-0">→</span>{ex}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function CulturaEstrategiaSection() {
  const [missaoOpen, setMissaoOpen] = useState(false);
  const [visaoOpen, setVisaoOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Missão & Visão</SectionTitle>
        <p className="text-sm text-cw-muted mb-3">Por que existimos e onde queremos chegar.</p>
        <div className="cw-card p-5 mb-3">
          <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-1">Nossa Missão</p>
          <p className="text-xs text-cw-muted mb-1">Por que existimos</p>
          <p className="font-bold text-cw-text mb-2">{REPS_MISSAO.curta}</p>
          <button onClick={() => setMissaoOpen(o => !o)} className="text-xs font-semibold text-cw-purple-light hover:underline">
            Entenda o contexto completo
          </button>
          {missaoOpen && <div className="mt-3 pt-3 border-t border-cw-border"><ArtigoTexto texto={REPS_MISSAO.completa} /></div>}
        </div>
        <div className="cw-card p-5">
          <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-1">Nossa Visão</p>
          <p className="text-xs text-cw-muted mb-1">Onde queremos chegar</p>
          <p className="font-bold text-cw-text mb-2">{REPS_VISAO.curta}</p>
          <button onClick={() => setVisaoOpen(o => !o)} className="text-xs font-semibold text-cw-purple-light hover:underline">
            O que isso significa na prática
          </button>
          {visaoOpen && <div className="mt-3 pt-3 border-t border-cw-border"><ArtigoTexto texto={REPS_VISAO.completa} /></div>}
        </div>
      </div>

      <div>
        <SectionTitle>Nossos Valores</SectionTitle>
        <p className="text-sm text-cw-muted mb-3">Os princípios que guiam cada decisão que tomamos.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {REPS_VALORES.map((v, i) => <ValorCard key={v.titulo} idx={i} valor={v} />)}
        </div>
      </div>

      <div>
        <SectionTitle>Nossa Estratégia</SectionTitle>
        <p className="text-sm text-cw-muted mb-3">Os pilares que direcionam como crescemos.</p>
        <div className="cw-card p-5 mb-3">
          <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-2">Pilares Operacionais — Como trabalhamos</p>
          <div className="flex flex-wrap gap-2">
            {REPS_PILARES.map(p => (
              <span key={p} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-cw-purple/10 text-cw-purple-light border border-cw-purple/20">{p}</span>
            ))}
          </div>
        </div>
        <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-2">Onde estamos indo — Nossa visão de mercado</p>
        <div className="space-y-2">
          {REPS_ONDE_ESTAMOS_INDO.map(o => (
            <div key={o.titulo} className="cw-card p-4">
              <p className="font-bold text-sm text-cw-text mb-1">{o.titulo}</p>
              <p className="text-xs text-cw-muted leading-relaxed">{o.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────── Produto ────────────────────────────── */

function ProdutoSection() {
  return (
    <div className="space-y-6">
      <div className="cw-card p-5">
        <p className="text-sm text-cw-text/90 leading-relaxed">
          A Cardápio Web é, essencialmente, uma plataforma de comércio eletrônico — o cardápio digital é nossa prioridade número 1.
          Ajudamos restaurantes a vender diretamente aos seus clientes, com autonomia e sem depender de intermediários.
        </p>
      </div>
      <div>
        <SectionTitle>Os 3 focos da Cardápio Web</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {REPS_PRODUTO_FOCOS.map(f => (
            <div key={f.titulo} className="cw-card p-4">
              <p className="font-bold text-sm text-cw-text mb-2">{f.titulo}</p>
              <ul className="space-y-1 mb-3">
                {f.itens.map(i => <li key={i} className="text-xs text-cw-muted flex gap-1.5"><span className="text-cw-purple">•</span>{i}</li>)}
              </ul>
              <p className="text-[10px] font-bold text-cw-purple uppercase tracking-widest mb-1">Integrações</p>
              <div className="flex flex-wrap gap-1">
                {f.integracoes.map(i => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-cw-elevated border border-cw-border text-cw-muted">{i}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>Funcionalidades por plano</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {REPS_PLANOS_FUNCIONALIDADES.map(p => (
            <div key={p.nome} className="cw-card p-4">
              <p className="font-bold text-sm text-cw-text mb-2">{p.nome}</p>
              <ul className="space-y-1">
                {p.itens.map(i => <li key={i} className="text-xs text-cw-muted flex gap-1.5"><span className="text-cw-purple">•</span>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>Módulos extras (add-ons)</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {REPS_MODULOS_EXTRAS.map(m => (
            <div key={m.nome} className="cw-card p-4">
              <p className="font-bold text-sm text-cw-text">{m.nome}</p>
              <p className="text-xs text-cw-muted mt-0.5 mb-1.5">{m.desc}</p>
              <p className="text-xs font-semibold text-cw-purple-light">{m.preco}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Planos & Preços ───────────────────────── */

function PlanosPrecosSection() {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Planos</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {REPS_PLANOS.map(p => (
            <div key={p.nome} className="cw-card p-5">
              <p className="font-black text-lg text-cw-text">{p.nome}</p>
              <p className="text-xs text-cw-muted mt-1 mb-3">{p.desc}</p>
              <p className="text-2xl font-black text-cw-purple-light">{p.mensal}</p>
              <p className="text-xs text-cw-muted">Total anual: {p.total} <span className="text-emerald-400 font-semibold">economize 15%</span></p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>Desconto de parceria (canal de representantes)</SectionTitle>
        <div className="overflow-x-auto scrollbar-cw">
          <table className="w-full text-xs cw-card p-0">
            <thead>
              <tr className="text-cw-muted text-left border-b border-cw-border">
                <th className="py-2.5 px-3 font-semibold">Período</th>
                <th className="py-2.5 px-3 font-semibold">Desconto</th>
                <th className="py-2.5 px-3 font-semibold">Mesas</th>
                <th className="py-2.5 px-3 font-semibold">Delivery</th>
                <th className="py-2.5 px-3 font-semibold">Premium</th>
              </tr>
            </thead>
            <tbody>
              {REPS_DESCONTO_PARCERIA.map(d => (
                <tr key={d.periodo} className="border-b border-cw-border last:border-0">
                  <td className="py-2.5 px-3 text-cw-text font-semibold">{d.periodo}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">{d.desconto}</td>
                  <td className="py-2.5 px-3 text-cw-muted">{d.mesas}</td>
                  <td className="py-2.5 px-3 text-cw-muted">{d.delivery}</td>
                  <td className="py-2.5 px-3 text-cw-muted">{d.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <SectionTitle>Promoção para negociação (primeiros 3 meses)</SectionTitle>
        <p className="text-xs text-cw-muted mb-2">Após os 3 meses, retorna ao valor mensal padrão. Use com critério.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REPS_PROMO_NEGOCIACAO.map(p => (
            <div key={p.desconto} className="cw-card p-4">
              <p className="font-black text-cw-purple-light mb-1">{p.desconto} de desconto</p>
              <p className="text-xs text-cw-muted">Mesas {p.mesas} · Delivery {p.delivery} · Premium {p.premium}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────── Concorrentes ─────────────────────────── */

function ConcorrentesSection() {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Nossos diferenciais no mercado</SectionTitle>
        <div className="space-y-1.5">
          {REPS_DIFERENCIAIS.map(d => (
            <p key={d} className="text-sm text-cw-text/90 flex gap-2"><span className="text-emerald-400 shrink-0">✓</span>{d}</p>
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>Principais concorrentes</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {REPS_CONCORRENTES.map(c => (
            <div key={c.nome} className="cw-card p-4">
              <p className="font-bold text-sm text-cw-text">{c.nome}</p>
              <p className="text-xs text-cw-muted mt-0.5">{c.tag}</p>
              <p className="text-xs text-cw-purple-light mt-1.5">{c.site}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-cw-muted italic">
        Lembre: não construímos produto para um nicho restrito. Somos infraestrutura para qualquer food service que venda direto ao consumidor. — Memorando CW
      </p>
    </div>
  );
}

/* ───────────────────────────────────── Cargos ──────────────────────────── */

function CargosSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {REPS_CARGOS.map(c => (
        <div key={c.sigla} className="cw-card p-4">
          <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest">{c.sigla}</p>
          <p className="font-bold text-sm text-cw-text mt-0.5">{c.nome}</p>
          <p className="text-xs text-cw-muted mt-1 leading-relaxed">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────── ICP ───────────────────────────── */

function IcpSection() {
  return (
    <div className="cw-card p-5 space-y-3">
      <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest">O que é o ICP</p>
      <p className="text-sm text-cw-text/90 leading-relaxed">
        O ICP (Ideal Customer Profile) define o perfil do lead com maior probabilidade de fechar e se tornar um cliente de sucesso.
        Conhecer o ICP é fundamental para priorizar esforços de indicação e qualificação.
      </p>
      <a href={REPS_SHEET_LINK} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-cw-purple-light hover:underline">
        Ver ICP completo <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

/* ──────────────────────────────────── Hacks ────────────────────────────── */

function HacksSection() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-cw-muted">Técnicas e scripts práticos para lidar com situações específicas durante indicação e negociação.</p>
      {REPS_HACKS.map((h, i) => (
        <div key={h.titulo} className="cw-card p-4">
          <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-1">Hack {i + 1}</p>
          <p className="font-bold text-sm text-cw-text mb-1">{h.titulo}</p>
          <p className="text-xs text-cw-muted mb-2">{h.situacao}</p>
          <p className="text-[10px] font-bold text-cw-purple uppercase tracking-widest mb-1">Como conduzir</p>
          <ArtigoTexto texto={h.conducao} />
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────────────── Objeções (matriz) ───────────────────── */

function ObjecoesSection() {
  return (
    <div className="space-y-3">
      <div className="cw-card p-5">
        <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-1">Matriz de Objeções</p>
        <p className="text-sm text-cw-muted">Mapeia as principais resistências dos leads e os melhores argumentos para cada uma.</p>
      </div>
      {REPS_OBJECOES_MATRIZ.map(o => (
        <div key={o.objecao} className="cw-card p-4">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cw-elevated text-cw-muted border border-cw-border">{o.categoria}</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cw-purple/10 text-cw-purple-light border border-cw-purple/20">{o.momento}</span>
          </div>
          <p className="text-sm font-semibold text-cw-text mb-2">{o.objecao}</p>
          <p className="text-[10px] font-bold text-cw-purple uppercase tracking-widest mb-1">Como responder</p>
          <p className="text-xs text-cw-text/85 leading-relaxed">{o.resposta}</p>
        </div>
      ))}
      <a href={REPS_SHEET_LINK} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-cw-purple-light hover:underline">
        Ver matriz completa <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

/* ───────────────────────────────── Motivos de Perda ────────────────────── */

function MotivosPerdaSection() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-cw-muted">Entender por que perdemos um lead é tão importante quanto entender por que fechamos.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {REPS_MOTIVOS_PERDA.map(m => (
          <div key={m.titulo} className="cw-card p-4">
            <p className="font-bold text-sm text-cw-text">{m.titulo}</p>
            <p className="text-xs text-cw-muted mt-0.5">{m.desc}</p>
          </div>
        ))}
      </div>
      <a href={REPS_SHEET_LINK} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-cw-purple-light hover:underline">
        Ver lista completa <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

/* ──────────────────────────────────── Materiais ────────────────────────── */

function MateriaisSection() {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest">Leitura recomendada — Canalize PRM</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {REPS_MATERIAIS.map(m => (
          <div key={m.titulo} className="cw-card p-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cw-purple/10 text-cw-purple-light border border-cw-purple/20">{m.categoria}</span>
              <span className="text-[10px] text-cw-muted">{m.fonte}</span>
            </div>
            <p className="font-bold text-sm text-cw-text">{m.titulo}</p>
            <p className="text-xs text-cw-muted mt-1">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MateriaisInternosSection() {
  return (
    <div className="space-y-5">
      {REPS_MATERIAIS_INTERNOS.map(g => (
        <div key={g.grupo}>
          <SectionTitle>{g.grupo}</SectionTitle>
          <div className="space-y-2">
            {g.itens.map(item => (
              <div key={item} className="cw-card p-3.5 flex items-center justify-between gap-3">
                <span className="text-sm text-cw-text">{item}</span>
                <span className="text-[10px] font-bold text-cw-muted uppercase tracking-widest shrink-0">Em breve</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────────────────── Root ────────────────────────────── */

export default function PlaybookRepresentantes() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-cw-text">Playbook de Representantes</h1>
        <p className="text-sm text-cw-muted mt-1">Conteúdo exclusivo para o time de Representantes da Cardápio Web.</p>
      </div>
      <Tabs defaultValue="cultura" className="w-full">
        <div className="overflow-x-auto scrollbar-cw -mx-1 pb-2">
          <TabsList className="bg-cw-surface border border-cw-border p-1 inline-flex w-max">
            {TABS.map(t => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="data-[state=active]:gradient-primary data-[state=active]:text-white whitespace-nowrap text-xs font-medium"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="cultura" className="mt-6"><CulturaEstrategiaSection /></TabsContent>
        <TabsContent value="produto" className="mt-6"><ProdutoSection /></TabsContent>
        <TabsContent value="primeiros" className="mt-6"><ArtigosAccordion artigos={REPS_PRIMEIROS_PASSOS} /></TabsContent>
        <TabsContent value="gestao" className="mt-6"><ArtigosAccordion artigos={REPS_GESTAO} comBusca /></TabsContent>
        <TabsContent value="automacao" className="mt-6"><ArtigosAccordion artigos={REPS_AUTOMACAO} /></TabsContent>
        <TabsContent value="vendas" className="mt-6"><ArtigosAccordion artigos={REPS_AUMENTO_VENDAS} /></TabsContent>
        <TabsContent value="modulos" className="mt-6"><ArtigosAccordion artigos={REPS_MODULOS_SISTEMA} comBusca /></TabsContent>
        <TabsContent value="suporte" className="mt-6"><div className="cw-card p-5"><ArtigoTexto texto={REPS_SUPORTE} /></div></TabsContent>
        <TabsContent value="planos" className="mt-6"><PlanosPrecosSection /></TabsContent>
        <TabsContent value="concorrentes" className="mt-6"><ConcorrentesSection /></TabsContent>
        <TabsContent value="territorio" className="mt-6"><EmBreve titulo="Território" /></TabsContent>
        <TabsContent value="cargos" className="mt-6"><CargosSection /></TabsContent>
        <TabsContent value="icp" className="mt-6"><IcpSection /></TabsContent>
        <TabsContent value="abordagem" className="mt-6"><EmBreve titulo="Abordagem" /></TabsContent>
        <TabsContent value="negociacao" className="mt-6"><EmBreve titulo="Negociação" /></TabsContent>
        <TabsContent value="hacks" className="mt-6"><HacksSection /></TabsContent>
        <TabsContent value="objecoes" className="mt-6"><ObjecoesSection /></TabsContent>
        <TabsContent value="fechamento" className="mt-6"><EmBreve titulo="Fechamento" /></TabsContent>
        <TabsContent value="perda" className="mt-6"><MotivosPerdaSection /></TabsContent>
        <TabsContent value="faq" className="mt-6"><ArtigosAccordion artigos={REPS_FAQ} comBusca /></TabsContent>
        <TabsContent value="materiais" className="mt-6"><MateriaisSection /></TabsContent>
        <TabsContent value="internos" className="mt-6"><MateriaisInternosSection /></TabsContent>
      </Tabs>
    </div>
  );
}
