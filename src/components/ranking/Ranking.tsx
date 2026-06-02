import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Crown } from 'lucide-react';
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
      {t.enc && <span className="text-[10px] font-black tracking-[0.2em] text-yellow-400 uppercase">Encerrada</span>}
      <div className="flex gap-1.5">
        {[{ v: t.d, l: 'DIAS' }, { v: t.h, l: 'HORAS' }, { v: t.m, l: 'MIN' }, { v: t.s, l: 'SEG' }].map(({ v, l }) => (
          <div key={l} className="flex flex-col items-center bg-[#3a0060]/80 border border-purple-600/40 rounded-lg px-3 py-1.5 min-w-[52px]">
            <span className="text-xl font-black tabular-nums text-white">{v}</span>
            <span className="text-[9px] text-purple-300 font-bold tracking-wider">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const CORES = [
  { borda: 'border-yellow-400', texto: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { borda: 'border-purple-400', texto: 'text-purple-300', bg: 'bg-purple-500/10' },
  { borda: 'border-orange-400', texto: 'text-orange-400', bg: 'bg-orange-400/10' },
];

export default function Ranking() {
  const [lista, setLista] = useState<SDR[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [mes, setMes] = useState('');
  const [segs, setSegs] = useState(0);

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

  const nomeMes = mes ? new Date(mes + '-15').toLocaleDateString('pt-BR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase()) : '';
  const anoAtual = mes ? mes.split('-')[0] : '';
  const top3 = lista.slice(0, 3);
  const demais = lista.slice(3);

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(160deg, #3a0060 0%, #1a0030 40%, #0d001a 100%)' }}>

      {/* Header */}
      <div className="flex items-start justify-between px-8 py-5">
        <div className="flex-1" />
        <div className="text-center flex-1">
          <p className="text-[11px] font-black tracking-[0.25em] text-yellow-400 uppercase mb-1">Ranking de Crescimento</p>
          <h1 className="text-4xl font-black">{nomeMes} {anoAtual}</h1>
          <p className="text-[11px] tracking-[0.2em] text-purple-300 uppercase mt-0.5">{mes?.replace('-', ' · ')}</p>
        </div>
        <div className="flex-1 flex justify-end">
          <Countdown mes={mes} />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-32 gap-3 text-purple-300">
          <RefreshCw className="h-6 w-6 animate-spin" /><span>Carregando...</span>
        </div>
      )}

      {erro && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-red-400 text-sm">{erro}</p>
          <button onClick={carregar} className="px-4 py-2 bg-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-600">Tentar novamente</button>
        </div>
      )}

      {!loading && !erro && lista.length === 0 && (
        <div className="flex items-center justify-center py-32 text-purple-400">Nenhuma venda registrada este mês ainda.</div>
      )}

      {!loading && !erro && lista.length > 0 && (
        <div className="flex gap-0">
          {/* Pódium */}
          <div className="w-[340px] shrink-0 px-6 pb-6">
            <p className="text-[9px] font-bold tracking-[0.2em] text-purple-400 uppercase mb-0.5">Pódium dos Guerreiros</p>
            <h2 className="text-sm font-bold text-white mb-4">Top 3 Berserker</h2>

            {/* Avatares topo */}
            <div className="flex justify-around items-end mb-5 px-2">
              {[top3[1], top3[0], top3[2]].map((s, pos) => {
                if (!s) return <div key={pos} className="w-14" />;
                const ci = pos === 1 ? 0 : pos === 0 ? 1 : 2;
                return (
                  <div key={s.id} className="flex flex-col items-center gap-1">
                    {pos === 1 && <Crown className="h-5 w-5 text-yellow-400" />}
                    <div className={cn('rounded-full border-2 flex items-center justify-center font-black', CORES[ci].borda, CORES[ci].bg, pos === 1 ? 'h-16 w-16 text-xl' : 'h-12 w-12 text-base')}>
                      {s.iniciais}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cards pódium */}
            <div className="space-y-2">
              {top3.map((s, i) => (
                <div key={s.id} className={cn('rounded-xl border p-4', CORES[i].borda, CORES[i].bg)}>
                  <p className={cn('text-[9px] font-black tracking-widest uppercase mb-1', CORES[i].texto)}>
                    {i === 0 && <Crown className="inline h-3 w-3 mr-1" />}{i + 1}° LUGAR
                  </p>
                  <p className={cn('text-lg font-black uppercase', CORES[i].texto)}>{s.nome}</p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-4xl font-black text-white">{s.vendas}</span>
                    <span className="text-sm text-purple-300 pb-1">negócios ganhos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demais */}
          <div className="flex-1 px-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[9px] font-bold tracking-[0.2em] text-purple-400 uppercase mb-0.5">Demais Guerreiros</p>
                <h2 className="text-lg font-bold">Classificação Geral</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-purple-400">{lista.length} participantes</span>
                <button onClick={carregar} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-800/40 hover:bg-purple-700/60 text-xs font-semibold text-purple-300 border border-purple-700/40 transition-colors">
                  <RefreshCw className={cn('h-3 w-3', loading && 'animate-spin')} /> Atualizar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {demais.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 bg-[#2a0040]/60 rounded-xl border border-purple-800/30 px-4 py-3">
                  <span className="text-base font-black text-purple-500 w-6 shrink-0">{i + 4}</span>
                  <div className="h-9 w-9 rounded-full bg-[#4a006a] border border-purple-600/50 flex items-center justify-center text-[11px] font-black text-purple-200 shrink-0">
                    {s.iniciais}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white truncate">{s.nome}</p>
                    <p className="text-xs text-purple-400">{s.vendas} negócio{s.vendas !== 1 ? 's' : ''} ganho{s.vendas !== 1 ? 's' : ''}</p>
                  </div>
                  <span className="text-lg font-black text-yellow-400 shrink-0">{s.vendas}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-purple-700 mt-5 text-center">
              Atualiza a cada 5min · há {segs}s
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
