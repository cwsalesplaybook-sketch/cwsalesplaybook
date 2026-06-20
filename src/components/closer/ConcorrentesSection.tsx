/** Seção Concorrentes — busca interativa, spotlight e tabela comparativa. */
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, X, Minus, Search, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CLOSER_CONCORRENTES_HEADERS,
  CLOSER_CONCORRENTES,
  type ConcorrenteValor,
} from '@/data/playbookCloser';

function norm(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">{children}</p>;
}

function ValorIcon({ v }: { v: ConcorrenteValor }) {
  if (v === 'yes') return <Check className="h-3.5 w-3.5 text-emerald-400 mx-auto" />;
  if (v === 'no') return <X className="h-3.5 w-3.5 text-red-400/60 mx-auto" />;
  return <Minus className="h-3.5 w-3.5 text-cw-yellow/70 mx-auto" />;
}

function getCompetitorIdx(query: string): number {
  if (!query || query.length < 2) return -1;
  const q = norm(query);
  for (let i = 1; i < CLOSER_CONCORRENTES_HEADERS.length; i++) {
    const h = norm(CLOSER_CONCORRENTES_HEADERS[i]);
    if (h === q) return i;
    if (q.length >= 3 && h.includes(q)) return i;
    const firstWord = h.split(' ')[0];
    if (firstWord.length > 3 && q.length >= 3 && firstWord.startsWith(q)) return i;
  }
  return -1;
}

type FeatureInfo = { categoria: string; nome: string; valor: ConcorrenteValor };

function getCompetitorFeatures(idx: number): FeatureInfo[] {
  return CLOSER_CONCORRENTES.flatMap(cat =>
    cat.features.map(f => ({
      categoria: cat.categoria,
      nome: f.nome,
      valor: f.valores[idx] as ConcorrenteValor,
    }))
  );
}

function CompetitorSpotlight({ idx, onClear }: { idx: number; onClear: () => void }) {
  const nome = CLOSER_CONCORRENTES_HEADERS[idx];
  const features = getCompetitorFeatures(idx);
  const sim = features.filter(f => f.valor === 'yes');
  const parcial = features.filter(f => f.valor === 'partial');
  const nao = features.filter(f => f.valor === 'no');

  return (
    <div className="cw-card p-5 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Comparativo detalhado</p>
          <h2 className="text-xl font-black text-cw-text">{nome}</h2>
          <p className="text-xs text-cw-muted mt-1">vs Cardápio Web — {features.length} funcionalidades analisadas</p>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-cw-muted hover:text-cw-text transition-colors px-3 py-1.5 rounded-lg hover:bg-cw-elevated border border-cw-border shrink-0"
        >
          <ChevronLeft className="h-3 w-3" /> Voltar
        </button>
      </div>

      {/* Score */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-cw-surface border border-cw-border rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-cw-muted">{sim.length}</p>
          <p className="text-[10px] text-cw-muted mt-0.5">Também têm</p>
        </div>
        <div className="bg-cw-yellow/8 border border-cw-yellow/25 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-cw-yellow">{parcial.length}</p>
          <p className="text-[10px] text-cw-muted mt-0.5">Fazem parcial</p>
        </div>
        <div className="bg-cw-purple/8 border border-cw-purple/25 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-cw-purple-light">{nao.length}</p>
          <p className="text-[10px] text-cw-muted mt-0.5">Só a CW tem</p>
        </div>
      </div>

      {/* Advantages */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {nao.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-2">Só a Cardápio Web tem</p>
            <div className="space-y-1.5">
              {nao.map(f => (
                <div key={f.nome} className="flex items-center gap-2 px-3 py-2 bg-cw-purple/8 border border-cw-purple/20 rounded-lg">
                  <Check className="h-3 w-3 text-cw-purple-light flex-shrink-0" />
                  <span className="text-xs text-cw-text flex-1">{f.nome}</span>
                  <span className="text-[9px] text-cw-muted shrink-0">{f.categoria}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {parcial.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-cw-yellow uppercase tracking-widest mb-2">Fazemos melhor</p>
            <div className="space-y-1.5">
              {parcial.map(f => (
                <div key={f.nome} className="flex items-center gap-2 px-3 py-2 bg-cw-yellow/8 border border-cw-yellow/20 rounded-lg">
                  <Minus className="h-3 w-3 text-cw-yellow flex-shrink-0" />
                  <span className="text-xs text-cw-text flex-1">{f.nome}</span>
                  <span className="text-[9px] text-cw-muted shrink-0">{f.categoria}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Shared features */}
      {sim.length > 0 && (
        <div>
          <p className="text-[10px] font-black text-cw-muted uppercase tracking-widest mb-2">Funcionalidades em comum</p>
          <div className="flex flex-wrap gap-1.5">
            {sim.map(f => (
              <span key={f.nome} className="text-[10px] px-2.5 py-1 bg-cw-surface border border-cw-border rounded-full text-cw-muted">
                {f.nome}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Closing argument */}
      {nao.length > 0 && (
        <div className="bg-cw-purple/8 border border-cw-purple/25 rounded-xl p-4">
          <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-1.5">Argumento de fechamento</p>
          <p className="text-xs text-cw-text leading-relaxed">
            {nome.split(' ')[0]} não oferece{' '}
            {nao.length === 1
              ? nao[0].nome.toLowerCase()
              : nao.slice(0, -1).map(f => f.nome.toLowerCase()).join(', ') + ' e ' + nao[nao.length - 1].nome.toLowerCase()}
            .{' '}
            {nao.length === 1
              ? 'Esse diferencial é exclusivo da Cardápio Web.'
              : `Esses ${nao.length} diferenciais são exclusivos da Cardápio Web.`}
          </p>
        </div>
      )}

      {nao.length === 0 && (
        <div className="bg-amber-500/8 border border-amber-500/25 rounded-xl p-4">
          <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Concorrente forte</p>
          <p className="text-xs text-cw-text leading-relaxed">
            {nome.split(' ')[0]} possui as mesmas funcionalidades. O diferencial deve vir de atendimento, suporte e parceria de longo prazo.
          </p>
        </div>
      )}
    </div>
  );
}

const CATEGORIAS = CLOSER_CONCORRENTES.map(c => c.categoria);
const DESTAQUES = CLOSER_CONCORRENTES_HEADERS.slice(1, 9);

export function ConcorrentesSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [busca, setBusca] = useState(searchParams.get('q') ?? '');
  const [catIdx, setCatIdx] = useState(0);

  const spotlightIdx = getCompetitorIdx(busca);

  function handleBusca(v: string) {
    setBusca(v);
    if (v) setSearchParams({ q: v }, { replace: true });
    else setSearchParams({}, { replace: true });
  }

  const cat = CLOSER_CONCORRENTES[catIdx];

  return (
    <div className="space-y-5">
      {/* Intro (only when no search active) */}
      {!busca && (
        <div className="cw-card p-5">
          <SectionTitle>Matriz de Concorrentes</SectionTitle>
          <p className="text-sm text-cw-muted mb-3">
            Busque pelo nome de um concorrente para ver o comparativo detalhado — diferenciais da CW, funcionalidades em comum e argumento de fechamento pronto.
          </p>
          <div className="flex items-center gap-4 text-xs text-cw-muted">
            <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> Possui</span>
            <span className="flex items-center gap-1"><Minus className="h-3.5 w-3.5 text-cw-yellow/70" /> Parcial</span>
            <span className="flex items-center gap-1"><X className="h-3.5 w-3.5 text-red-400/60" /> Não possui</span>
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cw-muted pointer-events-none" />
        <input
          value={busca}
          onChange={e => handleBusca(e.target.value)}
          placeholder="Digite o concorrente (ex: Consumer, Anota ai, Goomer, Saipos...)"
          className="w-full bg-cw-surface border border-cw-border rounded-xl pl-9 pr-4 py-3 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50 transition-colors"
        />
      </div>

      {/* Quick chips */}
      {!busca && (
        <div className="flex flex-wrap gap-2">
          {DESTAQUES.map(h => (
            <button
              key={h}
              onClick={() => handleBusca(h)}
              className="text-xs px-3 py-1.5 rounded-full bg-cw-surface border border-cw-border text-cw-muted hover:text-cw-text hover:border-orange-400/40 hover:bg-cw-elevated transition-all"
            >
              {h}
            </button>
          ))}
          <span className="text-xs px-2 py-1.5 text-cw-muted self-center">
            +{CLOSER_CONCORRENTES_HEADERS.length - 1 - DESTAQUES.length} mais
          </span>
        </div>
      )}

      {/* Spotlight card */}
      {spotlightIdx > 0 && (
        <CompetitorSpotlight idx={spotlightIdx} onClear={() => handleBusca('')} />
      )}

      {/* No match */}
      {busca.length > 0 && spotlightIdx <= 0 && (
        <div className="cw-card p-4 text-center space-y-1">
          <p className="text-sm text-cw-muted">
            Nenhum concorrente encontrado para "<span className="text-cw-text">{busca}</span>".
          </p>
          <p className="text-xs text-cw-muted">Tente: Anota ai, Consumer, Goomer, Saipos, Takeat, Brendi...</p>
        </div>
      )}

      {/* Full comparison table (hidden when spotlight is active) */}
      {spotlightIdx <= 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map((c, i) => (
              <button
                key={c}
                onClick={() => setCatIdx(i)}
                className={cn(
                  'text-xs font-medium px-3 py-1.5 rounded-full border transition-colors',
                  catIdx === i
                    ? 'gradient-primary text-white border-transparent'
                    : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text',
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="cw-card overflow-hidden">
            <div className="overflow-x-auto scrollbar-cw">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-cw-border bg-cw-elevated">
                    <th className="text-left py-2 px-3 font-semibold text-cw-text min-w-[160px] sticky left-0 bg-cw-elevated z-10">
                      Funcionalidade
                    </th>
                    {CLOSER_CONCORRENTES_HEADERS.map((h, i) => (
                      <th
                        key={h}
                        onClick={() => i > 0 && handleBusca(h)}
                        title={i > 0 ? `Ver comparativo de ${h}` : undefined}
                        className={cn(
                          'py-2 px-2 font-semibold text-center min-w-[70px] transition-colors',
                          i === 0
                            ? 'text-cw-purple'
                            : 'text-cw-muted cursor-pointer hover:text-cw-text hover:bg-cw-surface/50',
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cat.features.map((f, ri) => (
                    <tr key={f.nome} className={cn('border-b border-cw-border', ri % 2 === 0 ? '' : 'bg-cw-elevated/30')}>
                      <td className="py-2 px-3 text-cw-text font-medium sticky left-0 bg-inherit z-10">
                        {f.nome}
                      </td>
                      {f.valores.map((v, ci) => (
                        <td key={ci} className={cn('py-2 px-2 text-center', ci === 0 && 'bg-cw-purple/5')}>
                          <ValorIcon v={v as ConcorrenteValor} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-cw-muted text-center">
            Clique no nome do concorrente para ver o comparativo detalhado
          </p>
        </>
      )}
    </div>
  );
}
