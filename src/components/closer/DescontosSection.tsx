/** Descontos — gestão de cupons da CW no visual de filtros do dashboard de
 *  referência. Mantém os dados/preços reais (CLOSER_CUPONS): desconto, valor,
 *  total, mensal e código. Filtro por grupo + busca. Suporta ?q= (assistente). */
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Copy, Check, Percent, Search, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CLOSER_CUPONS, CLOSER_CUPONS_OBS, type CupomGrupo } from '@/data/playbookCloser';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">{children}</p>;
}

function norm(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
function slug(s: string) {
  return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

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

function GrupoCard({ g, highlight }: { g: CupomGrupo; highlight?: boolean }) {
  const totalCupons = g.linhas.length;
  return (
    <div id={slug(g.titulo)} className={cn('cw-card p-4 scroll-mt-8 transition-all', highlight && 'ring-2 ring-cw-yellow/70')}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="font-bold text-sm text-cw-text">{g.titulo}</p>
          <p className="text-xs text-cw-muted mt-0.5 leading-relaxed">{g.descricao}</p>
        </div>
        <span className="text-[10px] text-cw-muted shrink-0 px-2 py-1 rounded-full bg-cw-elevated border border-cw-border">
          {totalCupons} {totalCupons === 1 ? 'cupom' : 'cupons'}
        </span>
      </div>
      <div className="space-y-2">
        {g.linhas.map(l => (
          <div key={l.rotulo + l.codigo} className="flex items-center justify-between gap-3 bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5">
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

export function DescontosSection() {
  const [params] = useSearchParams();
  const [grupoSel, setGrupoSel] = useState('Todos');
  const [busca, setBusca] = useState(params.get('q') ?? '');

  const qParam = params.get('q') ?? '';
  useEffect(() => { if (qParam) setBusca(qParam); }, [qParam]);

  const grupos = ['Todos', ...CLOSER_CUPONS.map(g => g.titulo)];

  // Grupo que casa com a busca (ex: vindo do assistente) → highlight + scroll.
  const matched = useMemo(() => {
    const q = norm(busca);
    if (!q) return undefined;
    return CLOSER_CUPONS.find(g => norm(g.titulo).includes(q));
  }, [busca]);
  const highlightSlug = matched ? slug(matched.titulo) : undefined;

  useEffect(() => {
    if (highlightSlug) document.getElementById(highlightSlug)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlightSlug]);

  const termo = norm(busca);
  const filtrados = CLOSER_CUPONS.filter(g => {
    const okGrupo = grupoSel === 'Todos' || g.titulo === grupoSel;
    const okBusca = !termo ||
      norm(g.titulo).includes(termo) ||
      g.linhas.some(l => norm(l.rotulo).includes(termo) || norm(l.codigo).includes(termo));
    return okGrupo && okBusca;
  });

  const totalCupons = CLOSER_CUPONS.reduce((acc, g) => acc + g.linhas.length, 0);

  return (
    <div className="space-y-5">
      <div className="cw-card p-5">
        <div className="flex items-center gap-2 mb-2">
          <Percent className="h-4 w-4 text-cw-purple" />
          <SectionTitle>Gestão de Descontos</SectionTitle>
        </div>
        <p className="text-sm text-cw-muted leading-relaxed">{CLOSER_CUPONS_OBS}</p>
        <p className="text-[11px] text-cw-muted mt-1">Toque no código para copiar. {totalCupons} cupons disponíveis.</p>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cw-muted pointer-events-none" />
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por grupo, plano ou código (ex: parcerias, reopen, anual)..."
          className="w-full bg-cw-surface border border-cw-border rounded-xl pl-9 pr-4 py-3 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50 transition-colors"
        />
      </div>

      {/* Filtro por grupo */}
      <div className="flex flex-wrap gap-2">
        {grupos.map(g => (
          <button key={g} onClick={() => setGrupoSel(g)}
            className={cn('text-xs font-medium px-3 py-1.5 rounded-full border transition-colors',
              grupoSel === g ? 'gradient-primary text-white border-transparent' : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text')}>
            {g}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <div className="cw-card p-10 flex flex-col items-center gap-2 text-center">
          <Tag className="h-8 w-8 text-cw-muted/40" />
          <p className="text-sm text-cw-muted">Nenhum cupom encontrado para esse filtro.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map(g => (
            <GrupoCard key={g.titulo} g={g} highlight={slug(g.titulo) === highlightSlug} />
          ))}
        </div>
      )}
    </div>
  );
}
