import { useEffect, useState, useCallback } from 'react';
import { Crown, RefreshCw, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SDR { id: string; nome: string; iniciais: string; vendas: number; }

const CORES = [
  { borda: 'border-yellow-400', texto: 'text-yellow-400', fundo: 'bg-yellow-400/10' },
  { borda: 'border-purple-400', texto: 'text-purple-400', fundo: 'bg-purple-400/10' },
  { borda: 'border-red-400',    texto: 'text-red-400',    fundo: 'bg-red-400/10'    },
];

function Countdown() {
  const [t, setT] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const d = end.getTime() - now.getTime();
      if (d <= 0) { setT('00:00:00:00'); return; }
      const pad = (n: number) => String(n).padStart(2, '0');
      setT(`${pad(Math.floor(d/86400000))}:${pad(Math.floor(d%86400000/3600000))}:${pad(Math.floor(d%3600000/60000))}:${pad(Math.floor(d%60000/1000))}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const [dias, horas, min, seg] = t.split(':');
  return (
    <div className="flex gap-1.5">
      {[{v:dias,l:'DIAS'},{v:horas,l:'HORAS'},{v:min,l:'MIN'},{v:seg,l:'SEG'}].map(({v,l}) => (
        <div key={l} className="flex flex-col items-center bg-[#2a003a] border border-purple-800/50 rounded-lg px-2.5 py-1.5 min-w-[48px]">
          <span className="text-lg font-black tabular-nums">{v ?? '00'}</span>
          <span className="text-[9px] text-purple-400 font-bold tracking-wider">{l}</span>
        </div>
      ))}
    </div>
  );
}

export default function Ranking() {
  const [lista, setLista] = useState<SDR[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [ultima, setUltima] = useState('');
  const [mes, setMes] = useState('');

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      const r = await fetch('/api/ranking', { cache: 'no-store' });
      const json = await r.json();
      if (!json.ok) throw new Error(json.erro ?? 'Erro');
      setLista(json.ranking);
      setMes(json.mes);
      setUltima(new Date().toLocaleTimeString('pt-BR'));
    } catch (e: any) {
      setErro(e.message ?? 'Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);
  useEffect(() => { const id = setInterval(carregar, 2 * 60 * 1000); return () => clearInterval(id); }, [carregar]);
  useEffect(() => { window.addEventListener('focus', carregar); return () => window.removeEventListener('focus', carregar); }, [carregar]);

  const nomeMes = mes ? new Date(mes + '-01').toLocaleDateString('pt-BR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase()) : '';
  const ano = mes ? mes.split('-')[0] : '';
  const top3 = lista.slice(0, 3);
  const demais = lista.slice(3);

  return (
    <div className="min-h-screen bg-[#12001a] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-purple-900/30">
        <div className="flex-1 text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] text-yellow-400 uppercase">Ranking de Vendas</p>
          <h1 className="text-3xl font-black">{nomeMes} {ano}</h1>
        </div>
        <Countdown />
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center gap-3 text-purple-400">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Carregando...</span>
        </div>
      )}

      {erro && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-red-400 text-sm">{erro}</p>
          <button onClick={carregar} className="px-4 py-2 bg-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-600">
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !erro && lista.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-purple-400">
          Nenhuma venda registrada este mês ainda.
        </div>
      )}

      {!loading && !erro && lista.length > 0 && (
        <div className="flex flex-1">
          {/* Pódium */}
          <div className="w-[300px] shrink-0 bg-gradient-to-b from-[#2a0040] to-[#12001a] border-r border-purple-900/30 p-6 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-purple-400 uppercase">Pódium</p>
              <h2 className="text-base font-bold">Top 3 do Mês</h2>
            </div>

            {/* Avatares */}
            <div className="flex justify-around items-end px-2">
              {[top3[1], top3[0], top3[2]].map((s, i) => s && (
                <div key={s.id} className="flex flex-col items-center gap-1">
                  {i === 1 && <Crown className="h-4 w-4 text-yellow-400" />}
                  <div className={cn('rounded-full border-2 flex items-center justify-center font-black', CORES[i === 1 ? 0 : i === 0 ? 1 : 2].borda, CORES[i === 1 ? 0 : i === 0 ? 1 : 2].fundo, i === 1 ? 'h-16 w-16 text-xl' : 'h-12 w-12 text-base')}>
                    {s.iniciais}
                  </div>
                </div>
              ))}
            </div>

            {/* Cards */}
            {top3.map((s, i) => (
              <div key={s.id} className={cn('rounded-xl border p-4', CORES[i].borda, CORES[i].fundo)}>
                <p className={cn('text-[10px] font-bold tracking-widest uppercase mb-1', CORES[i].texto)}>
                  {i === 0 && <Crown className="inline h-3 w-3 mr-1" />}{i + 1}º LUGAR
                </p>
                <p className={cn('text-base font-black uppercase', CORES[i].texto)}>{s.nome}</p>
                <div className="flex items-end gap-2 mt-2">
                  <span className="text-3xl font-black text-white">{s.vendas}</span>
                  <span className="text-sm text-purple-300 pb-0.5">venda{s.vendas !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Demais */}
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-purple-400 uppercase">Classificação Geral</p>
                <p className="text-sm text-purple-300">{lista.length} participantes</p>
              </div>
              <button onClick={carregar} disabled={loading} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-800/40 hover:bg-purple-700/60 text-xs font-semibold text-purple-300 border border-purple-700/40 transition-colors">
                <RefreshCw className={cn('h-3 w-3', loading && 'animate-spin')} /> Atualizar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {demais.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 bg-[#1e002e] rounded-xl border border-purple-900/30 px-4 py-3">
                  <span className="text-base font-black text-purple-400 w-6 shrink-0">{i + 4}</span>
                  <div className="h-9 w-9 rounded-full bg-purple-700/40 border border-purple-600/40 flex items-center justify-center text-xs font-black text-purple-200 shrink-0">
                    {s.iniciais}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{s.nome}</p>
                    <p className="text-xs text-purple-400">{s.vendas} venda{s.vendas !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="text-sm font-black">{s.vendas}</span>
                  </div>
                </div>
              ))}
            </div>

            {ultima && (
              <p className="text-xs text-purple-700 mt-6 text-center">
                Atualiza a cada 2min · última atualização: {ultima}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
