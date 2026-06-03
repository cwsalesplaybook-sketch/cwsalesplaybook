import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Crown, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SDR { id: string; nome: string; iniciais: string; vendas: number; }

function pad(n: number) { return String(n).padStart(2, '0'); }

function Countdown({ mes }: { mes: string }) {
  const [t, setT] = useState({ d: '00', h: '00', m: '00', s: '00', enc: false });
  useEffect(() => {
    const tick = () => {
      if (!mes) return;
      const [y, mo] = mes.split('-').map(Number);
      const fim = new Date(y, mo, 0, 23, 59, 59);
      const diff = fim.getTime() - Date.now();
      if (diff <= 0) { setT({ d: '00', h: '00', m: '00', s: '00', enc: true }); return; }
      setT({ d: pad(Math.floor(diff / 86400000)), h: pad(Math.floor(diff % 86400000 / 3600000)), m: pad(Math.floor(diff % 3600000 / 60000)), s: pad(Math.floor(diff % 60000 / 1000)), enc: false });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [mes]);
  return (
    <div className="flex flex-col items-end gap-1">
      {t.enc && <span className="text-[10px] font-black tracking-[0.2em] text-cw-yellow uppercase">Encerrada</span>}
      <div className="flex gap-1.5">
        {[{ v: t.d, l: 'DIAS' }, { v: t.h, l: 'HORAS' }, { v: t.m, l: 'MIN' }, { v: t.s, l: 'SEG' }].map(({ v, l }) => (
          <div key={l} className="flex flex-col items-center bg-cw-purple/8 border border-cw-purple/20 rounded-xl px-3 py-1.5 min-w-[52px]">
            <span className="text-xl font-black tabular-nums text-cw-purple">{v}</span>
            <span className="text-[9px] text-cw-muted font-bold tracking-wider">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const CORES = [
  { borda: 'border-cw-yellow',   texto: 'text-cw-yellow',    bg: 'bg-cw-yellow/8'   },
  { borda: 'border-cw-muted',    texto: 'text-cw-muted',     bg: 'bg-cw-elevated'   },
  { borda: 'border-amber-500',   texto: 'text-amber-500',    bg: 'bg-amber-50'      },
];

export default function Ranking() {
  const [lista, setLista]   = useState<SDR[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro]     = useState('');
  const [mes, setMes]       = useState('');
  const [segs, setSegs]     = useState(0);

  const carregar = useCallback(async () => {
    setLoading(true); setErro('');
    try {
      const r = await fetch('/api/ranking', { cache: 'no-store' });
      const json = await r.json();
      if (!json.ok) throw new Error(json.erro ?? 'Erro');
      setLista(json.ranking);
      setMes(json.mes);
      setSegs(0);
    } catch (e: any) { setErro(e.message ?? 'Erro ao buscar'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);
  useEffect(() => { const id = setInterval(carregar, 5 * 60 * 1000); return () => clearInterval(id); }, [carregar]);
  useEffect(() => { const id = setInterval(() => setSegs(s => s + 1), 1000); return () => clearInterval(id); }, []);
  useEffect(() => { window.addEventListener('focus', carregar); return () => window.removeEventListener('focus', carregar); }, [carregar]);

  const nomeMes  = mes ? new Date(mes + '-15').toLocaleDateString('pt-BR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase()) : '';
  const anoAtual = mes ? mes.split('-')[0] : '';
  const top3     = lista.slice(0, 3);
  const demais   = lista.slice(3);

  return (
    <div className="min-h-screen bg-cw-bg p-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-cw-yellow/15 border border-cw-yellow/30 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-cw-yellow" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-cw-text">Ranking de Crescimento</h1>
            <p className="text-sm text-cw-muted">{nomeMes} {anoAtual}</p>
          </div>
        </div>
        <Countdown mes={mes} />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-32 gap-3 text-cw-muted">
          <RefreshCw className="h-6 w-6 animate-spin text-cw-purple" /><span>Carregando...</span>
        </div>
      )}

      {erro && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-cw-red text-sm">{erro}</p>
          <button onClick={carregar} className="px-4 py-2 gradient-primary rounded-xl text-sm font-semibold text-white hover:opacity-90">Tentar novamente</button>
        </div>
      )}

      {!loading && !erro && lista.length === 0 && (
        <div className="flex items-center justify-center py-32 text-cw-muted">Nenhuma venda registrada este mês ainda.</div>
      )}

      {!loading && !erro && lista.length > 0 && (
        <div className="flex gap-6">

          {/* Pódium */}
          <div className="w-[340px] shrink-0">
            <div className="cw-card p-5">
              <p className="text-[9px] font-bold tracking-[0.2em] text-cw-purple uppercase mb-0.5">Pódium dos Guerreiros</p>
              <h2 className="text-sm font-bold text-cw-text mb-5">Top 3 do Mês</h2>

              {/* Avatares topo */}
              <div className="flex justify-around items-end mb-5 px-2">
                {[top3[1], top3[0], top3[2]].map((s, pos) => {
                  if (!s) return <div key={pos} className="w-14" />;
                  const ci = pos === 1 ? 0 : pos === 0 ? 1 : 2;
                  return (
                    <div key={s.id} className="flex flex-col items-center gap-1.5">
                      {pos === 1 && <Crown className="h-5 w-5 text-cw-yellow" />}
                      <div className={cn(
                        'rounded-full border-2 flex items-center justify-center font-black text-cw-text',
                        CORES[ci].borda, CORES[ci].bg,
                        pos === 1 ? 'h-16 w-16 text-xl' : 'h-12 w-12 text-base'
                      )}>
                        {s.iniciais}
                      </div>
                      <p className="text-xs font-semibold text-cw-text text-center max-w-[70px] truncate">{s.nome.split(' ')[0]}</p>
                    </div>
                  );
                })}
              </div>

              {/* Cards pódium */}
              <div className="space-y-2">
                {top3.map((s, i) => (
                  <div key={s.id} className={cn('rounded-xl border p-4', CORES[i].borda, CORES[i].bg)}>
                    <p className={cn('text-[9px] font-black tracking-widest uppercase mb-1 flex items-center gap-1', CORES[i].texto)}>
                      {i === 0 && <Crown className="h-3 w-3" />}{i + 1}° LUGAR
                    </p>
                    <p className={cn('text-base font-black', CORES[i].texto)}>{s.nome}</p>
                    <div className="mt-1.5 flex items-end gap-2">
                      <span className="text-3xl font-black text-cw-text">{s.vendas}</span>
                      <span className="text-xs text-cw-muted pb-1">negócios ganhos</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Demais */}
          <div className="flex-1">
            <div className="cw-card p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] text-cw-purple uppercase mb-0.5">Demais Guerreiros</p>
                  <h2 className="text-lg font-bold text-cw-text">Classificação Geral</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-cw-muted">{lista.length} participantes</span>
                  <button onClick={carregar} disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cw-elevated hover:bg-cw-border/60 text-xs font-semibold text-cw-muted border border-cw-border transition-colors">
                    <RefreshCw className={cn('h-3 w-3', loading && 'animate-spin')} /> Atualizar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {demais.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3 bg-cw-elevated rounded-xl border border-cw-border px-4 py-3 hover:border-cw-purple/30 transition-colors">
                    <span className="text-base font-black text-cw-muted w-6 shrink-0">{i + 4}</span>
                    <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-[11px] font-black text-white shrink-0">
                      {s.iniciais}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-cw-text truncate">{s.nome}</p>
                      <p className="text-xs text-cw-muted">{s.vendas} negócio{s.vendas !== 1 ? 's' : ''} ganho{s.vendas !== 1 ? 's' : ''}</p>
                    </div>
                    <span className="text-lg font-black text-cw-yellow shrink-0">{s.vendas}</span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-cw-muted mt-5 text-center">
                Atualiza a cada 5min · há {segs}s
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
