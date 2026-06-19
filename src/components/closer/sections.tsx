/** Seções de conteúdo do dashboard de Closer (render reutilizável).
 *  Dados em '@/data/playbookCloser'. Conteúdo estático (hardcoded). */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Search, Copy, Check, Star, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CLOSER_PLANOS, CLOSER_MODULOS, CLOSER_CUPONS, CLOSER_CUPONS_OBS,
  CLOSER_FRANQUIAS, CLOSER_FRANQUIAS_INTRO, CLOSER_FRANQUIAS_OBS,
  CLOSER_OBJECOES, CLOSER_OBJECOES_CATEGORIAS,
  type PlanoCloser, type ModuloCloser, type CupomGrupo, type FranquiaTabela,
  type ObjecaoCloser,
} from '@/data/playbookCloser';

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">{children}</p>;
}

function normTxt(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/* ---------------------------- PLANOS ----------------------------- */

function ValoresTabela({ valores }: { valores: PlanoCloser['valores'] }) {
  return (
    <div className="overflow-x-auto scrollbar-cw">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-cw-muted text-left">
            <th className="py-1.5 pr-3 font-semibold">Fidelidade</th>
            <th className="py-1.5 pr-3 font-semibold">Valor total</th>
            <th className="py-1.5 font-semibold">Valor mensal</th>
          </tr>
        </thead>
        <tbody>
          {valores.map(v => (
            <tr key={v.fidelidade} className="border-t border-cw-border">
              <td className="py-1.5 pr-3 text-cw-text">{v.fidelidade}</td>
              <td className="py-1.5 pr-3 text-cw-muted">{v.total}</td>
              <td className="py-1.5 text-cw-text font-semibold">{v.mensal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlanoCard({ p }: { p: PlanoCloser }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cw-card overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-cw-elevated transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm text-cw-text">{p.nome}</p>
            {p.popular && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cw-yellow/15 text-cw-yellow border border-cw-yellow/30">
                <Star className="h-2.5 w-2.5" /> MAIS POPULAR
              </span>
            )}
          </div>
          <p className="text-xs text-cw-muted mt-0.5">A partir de {p.valores[p.valores.length - 1].mensal}/mês · clique para ver funcionalidades e valores</p>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-cw-muted shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-cw-border space-y-4">
          <div className="mt-3">
            <p className="text-[11px] font-semibold text-cw-text mb-1.5">Funcionalidades incluídas:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              {p.funcionalidades.map(f => (
                <li key={f} className="flex items-start gap-2 text-xs text-cw-muted">
                  <Check className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <ValoresTabela valores={p.valores} />
        </div>
      )}
    </div>
  );
}

function ModuloCard({ m }: { m: ModuloCloser }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cw-card overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-cw-elevated transition-colors">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-cw-text">{m.nome}</p>
          <p className="text-xs text-cw-muted mt-0.5">{m.valores[m.valores.length - 1].mensal}/mês</p>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-cw-muted shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-cw-border space-y-3">
          <div className="mt-3"><ValoresTabela valores={m.valores} /></div>
          {m.obs && <p className="text-[11px] text-cw-muted bg-cw-elevated rounded-lg px-3 py-2">{m.obs}</p>}
        </div>
      )}
    </div>
  );
}

function cupomSlug(titulo: string) {
  return titulo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/** Chip grande do código do cupom — clique para copiar. */
function CodeChip({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      title="Copiar código"
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs font-bold transition-colors shrink-0',
        copied
          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
          : 'bg-cw-purple/15 border-cw-purple/30 text-cw-purple-light hover:bg-cw-purple/25',
      )}
    >
      {value}
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function CupomGrupoCard({ g, highlight }: { g: CupomGrupo; highlight?: boolean }) {
  return (
    <div
      id={cupomSlug(g.titulo)}
      className={cn(
        'cw-card p-4 scroll-mt-8 transition-all',
        highlight && 'ring-2 ring-cw-yellow/70',
      )}
    >
      <p className="font-bold text-sm text-cw-text">{g.titulo}</p>
      <p className="text-xs text-cw-muted mt-0.5 mb-3 leading-relaxed">{g.descricao}</p>
      <div className="space-y-2">
        {g.linhas.map(l => (
          <div
            key={l.rotulo}
            className="flex items-center justify-between gap-3 bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-cw-text truncate">{l.rotulo}</p>
              <p className="text-[11px] text-cw-muted">
                <span className="text-emerald-400 font-semibold">{l.desconto} OFF</span>
                {' · '}{l.mensalDesc}/mês · total {l.totalDesc}
              </p>
            </div>
            <CodeChip value={l.codigo} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlanosSection() {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Planos oficiais — clique para expandir</SectionTitle>
        <div className="space-y-2">
          {CLOSER_PLANOS.map(p => <PlanoCard key={p.nome} p={p} />)}
        </div>
      </div>
      <div>
        <SectionTitle>Módulos adicionais (para qualquer plano)</SectionTitle>
        <div className="space-y-2">
          {CLOSER_MODULOS.map(m => <ModuloCard key={m.nome} m={m} />)}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- CUPONS ----------------------------- */

export function CuponsSection() {
  const [params] = useSearchParams();
  const q = normTxt(params.get('q') ?? '');
  const matched = q ? CLOSER_CUPONS.find(g => normTxt(g.titulo).includes(q)) : undefined;
  const highlightSlug = matched ? cupomSlug(matched.titulo) : undefined;

  useEffect(() => {
    if (highlightSlug) {
      document.getElementById(highlightSlug)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightSlug]);

  return (
    <div className="space-y-4">
      <div className="cw-card p-5">
        <SectionTitle>Cupons de desconto</SectionTitle>
        <p className="text-sm text-cw-muted leading-relaxed">{CLOSER_CUPONS_OBS}</p>
        <p className="text-[11px] text-cw-muted mt-1">Toque no código para copiar.</p>
      </div>
      <div className="space-y-3">
        {CLOSER_CUPONS.map(g => (
          <CupomGrupoCard key={g.titulo} g={g} highlight={cupomSlug(g.titulo) === highlightSlug} />
        ))}
      </div>
    </div>
  );
}

/* --------------------------- FRANQUIAS --------------------------- */

function FranquiaCard({ f }: { f: FranquiaTabela }) {
  return (
    <div className="cw-card p-4">
      <p className="font-bold text-sm text-cw-text mb-3">{f.plano}</p>
      <div className="overflow-x-auto scrollbar-cw">
        <table className="w-full text-xs whitespace-nowrap">
          <thead>
            <tr className="text-cw-muted text-left">
              <th className="py-1.5 pr-3 font-semibold">Unidades</th>
              <th className="py-1.5 pr-3 font-semibold">Mensal</th>
              <th className="py-1.5 pr-3 font-semibold">Trimestral</th>
              <th className="py-1.5 pr-3 font-semibold">Semestral</th>
              <th className="py-1.5 font-semibold">Anual</th>
            </tr>
          </thead>
          <tbody>
            {f.linhas.map(l => (
              <tr key={l.unidades} className="border-t border-cw-border">
                <td className="py-1.5 pr-3 text-cw-text font-semibold">{l.unidades}</td>
                <td className="py-1.5 pr-3 text-cw-muted">{l.mensalDesc} · <span className="text-cw-text">{l.mensalValor}</span></td>
                <td className="py-1.5 pr-3 text-cw-muted">{l.trimestralDesc} · <span className="text-cw-text">{l.trimestralValor}</span></td>
                <td className="py-1.5 pr-3 text-cw-muted">{l.semestralDesc} · <span className="text-cw-text">{l.semestralValor}</span></td>
                <td className="py-1.5 text-cw-muted">{l.anualDesc} · <span className="text-cw-text">{l.anualValor}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FranquiasSection() {
  return (
    <div className="space-y-6">
      <div className="cw-card p-5">
        <SectionTitle>Negociação com franquias</SectionTitle>
        <p className="text-sm text-cw-muted leading-relaxed">{CLOSER_FRANQUIAS_INTRO}</p>
        <div className="mt-3 flex items-start gap-2 bg-cw-yellow/10 border border-cw-yellow/25 rounded-xl px-3 py-2.5">
          <ShieldAlert className="h-3.5 w-3.5 text-cw-yellow shrink-0 mt-0.5" />
          <p className="text-xs text-cw-text/85">{CLOSER_FRANQUIAS_OBS}</p>
        </div>
      </div>
      <SectionTitle>Tabelas por volume de unidades</SectionTitle>
      <div className="space-y-3">
        {CLOSER_FRANQUIAS.map(f => <FranquiaCard key={f.plano} f={f} />)}
      </div>
    </div>
  );
}

/* --------------------------- OBJEÇÕES ---------------------------- */

const FASE_COR: Record<string, string> = {
  'Fase de apresentação': 'bg-blue-50 text-blue-600 border-blue-200',
  'Fase de negociação':   'bg-cw-purple/10 text-cw-purple border-cw-purple/20',
  'Fase de follow-up':    'bg-amber-50 text-amber-600 border-amber-200',
};

function ObjecaoCard({ o, defaultOpen = false }: { o: ObjecaoCloser; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => { setOpen(defaultOpen); }, [defaultOpen]);
  return (
    <div className="cw-card overflow-hidden">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-start gap-3 p-4 text-left hover:bg-cw-elevated transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cw-elevated text-cw-muted border border-cw-border">{o.categoria}</span>
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', FASE_COR[o.fase])}>{o.fase}</span>
          </div>
          <p className="text-sm font-semibold text-cw-text leading-snug">“{o.titulo}”</p>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-cw-muted shrink-0 mt-1 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-cw-border">
          <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mt-3 mb-1.5">Discurso de solução</p>
          <p className="text-xs text-cw-text/85 leading-relaxed whitespace-pre-line">{o.contorno}</p>
        </div>
      )}
    </div>
  );
}

export function ObjecoesSection() {
  const [params] = useSearchParams();
  const qParam = params.get('q') ?? '';
  const [busca, setBusca] = useState(qParam);
  const [cat, setCat] = useState<string>('Todas');

  // Quando chega de fora com ?q= (ex: assistente flutuante), pré-preenche a busca.
  useEffect(() => { if (qParam) setBusca(qParam); }, [qParam]);

  const termo = busca.trim().toLowerCase();
  const filtradas = CLOSER_OBJECOES.filter(o => {
    const okCat = cat === 'Todas' || o.categoria === cat;
    const okBusca = !termo || o.titulo.toLowerCase().includes(termo) || o.contorno.toLowerCase().includes(termo);
    return okCat && okBusca;
  });

  return (
    <div className="space-y-5">
      <div className="cw-card p-5">
        <SectionTitle>Contorno de objeções</SectionTitle>
        <p className="text-sm text-cw-muted">Pesquise a objeção do lead e veja como contorná-la.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cw-muted" />
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Ex: valor, teste grátis, concorrente, sócio..."
          className="w-full bg-cw-surface border border-cw-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {['Todas', ...CLOSER_OBJECOES_CATEGORIAS].map(c => (
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

      <p className="text-[11px] text-cw-muted">{filtradas.length} de {CLOSER_OBJECOES.length} objeções</p>

      <div className="space-y-2">
        {filtradas.map(o => (
          <ObjecaoCard
            key={o.titulo}
            o={o}
            defaultOpen={termo.length > 2 && o.titulo.toLowerCase().includes(termo)}
          />
        ))}
        {filtradas.length === 0 && (
          <p className="text-sm text-cw-muted text-center py-12">Nenhuma objeção encontrada para esse filtro.</p>
        )}
      </div>
    </div>
  );
}

/* -------------------------- EM CONSTRUÇÃO ------------------------- */

export function EmConstrucao({ titulo }: { titulo: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-cw-purple/10 border border-cw-purple/20 flex items-center justify-center">
        <span className="text-3xl">🚧</span>
      </div>
      <h3 className="text-lg font-bold text-cw-text">Em construção</h3>
      <p className="text-sm text-cw-muted max-w-xs leading-relaxed">
        A seção <strong>{titulo}</strong> está sendo preparada e chega em breve.
      </p>
    </div>
  );
}
