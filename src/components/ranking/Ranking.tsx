/** Ranking de Agendamentos dos SDRs — agrupa deals do mês pelo campo [QUAL] SDR/BDR. */
import { useEffect, useState } from 'react';
import { Trophy, Crown, RefreshCw, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOKEN = (import.meta.env.VITE_PIPEDRIVE_TOKEN as string) || '***PIPEDRIVE_TOKEN_REMOVIDO***';

// Campo customizado [QUAL] SDR/BDR
const SDR_FIELD = 'ce39d035fad6c74095053ffe04bdb9bbc9ae2a53';

// Apenas SDRs ATIVOS do time — whitelist oficial
// (Marcos Telles, Felipe Queiroz e Gabriel Alves ainda não cadastrados no Pipedrive)
const SDRS_ATIVOS: Record<string, string> = {
  '1523': 'Miguel Nunes',
  '1445': 'Gabrielly Oliveira',
  '1556': 'Thais Giurizatto',
  '1667': 'Luis Lincon',
  '1686': 'Jonas Sobreira',
  '1382': 'Tatyanna Freitas',
  '1708': 'Kailane Carvalho',
  '1407': 'Lara Stefanny',
  '1727': 'Raquel Alves',
  '1710': 'José Guilherme',
  '1728': 'Fabíola Azevedo',
  '1729': 'Enizia Evangelista',
  '1607': 'Caique Silva',
  '1555': 'Ana Alice',
  '1608': 'Ryan Felipe',
  '1730': 'Maria Gabriela',
  '1707': 'Karoline Santos',
  '1685': 'Dayana Ferreira',
  '1738': 'Clara Rodrigues',
  '1706': 'Raissa Fonseca',
  '1335': 'João Paulo',
};

interface Vendedor {
  userId: number;
  nome: string;
  iniciais: string;
  vendas: number;
}

function getIniciais(nome: string) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

// Managers/líderes que NÃO devem ser contados no ranking de SDRs
const EXCLUDE_OWNERS = new Set([
  22291180, // Gregory Lavor
  11726977, // Glauton Santos
  22991209, // Gustavo Duarte Pinheiro Silva
  22122891, // Leandro dos Santos
  12994693, // Johnny Alves
  11871118, // Italo Huan
]);

async function fetchRanking(): Promise<Vendedor[]> {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const prefixo = `${ano}-${mes}`;

  let start = 0;
  const limit = 200;
  const contagem: Record<string, number> = {};
  let paginas = 0;

  while (paginas < 15) {
    paginas++;
    // Busca por close_time DESC (campo suportado pela API do Pipedrive)
    const url = `https://api.pipedrive.com/v1/deals?api_token=${TOKEN}&status=won&pipeline_id=2&limit=${limit}&start=${start}&sort=close_time%20DESC`;
    const res = await fetch(url);
    if (!res.ok) break;
    const json = await res.json();
    if (!json.success || !json.data?.length) break;
    const deals: any[] = json.data;

    let achouAntigo = false;
    for (const deal of deals) {
      // close_time controla o loop (ordenado por ele)
      const closeTime: string = deal.close_time ?? '';
      if (!closeTime) continue;
      if (closeTime < `${ano}-${mes}-01`) { achouAntigo = true; break; }
      if (!closeTime.startsWith(prefixo)) continue;

      // won_time filtra o que realmente conta (igual ao Pipedrive Insights)
      // Deals com close_time manual em 2026 mas won_time antigo são ignorados
      const wonTime: string = deal.won_time ?? '';
      if (!wonTime.startsWith(prefixo)) continue;

      // Excluir deals de managers
      const ownerId: number = typeof deal.user_id === 'object' ? deal.user_id?.id : deal.user_id;
      if (EXCLUDE_OWNERS.has(ownerId)) continue;

      // Contar por SDR
      const sdrId = deal[SDR_FIELD] ? String(deal[SDR_FIELD]) : null;
      if (sdrId && SDRS_ATIVOS[sdrId]) {
        contagem[sdrId] = (contagem[sdrId] ?? 0) + 1;
      }
    }

    if (achouAntigo || !json.additional_data?.pagination?.more_items_in_collection) break;
    start += limit;
  }

  return Object.entries(contagem)
    .map(([sdrId, total]) => {
      const nome = SDRS_ATIVOS[sdrId] ?? `SDR #${sdrId}`;
      return { userId: Number(sdrId), nome, iniciais: getIniciais(nome), vendas: total };
    })
    .sort((a, b) => b.vendas - a.vendas);
}

function useCountdown() {
  const [tempo, setTempo] = useState('');
  const [encerrada, setEncerrada] = useState(false);

  useEffect(() => {
    const calcular = () => {
      const agora = new Date();
      const fim = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59);
      const diff = fim.getTime() - agora.getTime();
      if (diff <= 0) { setEncerrada(true); setTempo('00:00:00:00'); return; }
      const dias = Math.floor(diff / 86400000);
      const horas = Math.floor((diff % 86400000) / 3600000);
      const min = Math.floor((diff % 3600000) / 60000);
      const seg = Math.floor((diff % 60000) / 1000);
      setTempo(`${String(dias).padStart(2, '0')}:${String(horas).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`);
    };
    calcular();
    const id = setInterval(calcular, 1000);
    return () => clearInterval(id);
  }, []);

  return { tempo, encerrada };
}

const PODIUM_COLORS = [
  { border: 'border-yellow-400', text: 'text-yellow-400', bg: 'bg-yellow-400/10', shadow: 'shadow-yellow-400/20' },
  { border: 'border-purple-400', text: 'text-purple-400', bg: 'bg-purple-400/10', shadow: 'shadow-purple-400/20' },
  { border: 'border-red-400', text: 'text-red-400', bg: 'bg-red-400/10', shadow: 'shadow-red-400/20' },
];

const LUGAR = ['1º LUGAR', '2º LUGAR', '3º LUGAR'];

export default function Ranking() {
  const [ranking, setRanking] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const { tempo, encerrada } = useCountdown();

  const agora = new Date();
  const mesNome = agora.toLocaleDateString('pt-BR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase());
  const anoAtual = agora.getFullYear();

  const carregar = async () => {
    setLoading(true);
    setErro('');
    try {
      const data = await fetchRanking();
      setRanking(data);
      setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
    } catch (e) {
      setErro('Erro ao buscar dados do Pipedrive.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  // Auto-refresh a cada 2 minutos
  useEffect(() => {
    const id = setInterval(carregar, 2 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // Refresh ao voltar para a aba/janela
  useEffect(() => {
    const onFocus = () => carregar();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const top3 = ranking.slice(0, 3);
  const demais = ranking.slice(3);

  const [tempo0, tempo1, tempo2, tempo3] = tempo.split(':');

  return (
    <div className="min-h-screen bg-[#1a0028] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-purple-900/40">
        <div className="text-center flex-1">
          <p className="text-xs font-bold tracking-[0.2em] text-yellow-400 uppercase">Ranking de Crescimento</p>
          <h1 className="text-3xl font-black">{mesNome} {anoAtual}</h1>
          <p className="text-xs text-purple-300 tracking-widest uppercase">{mesNome.toUpperCase()} · {anoAtual}</p>
        </div>

        <div className="flex flex-col items-end gap-1">
          {encerrada && <span className="text-[10px] font-bold tracking-widest text-red-400 uppercase">Encerrada</span>}
          <div className="flex gap-2">
            {[{ v: tempo0, l: 'DIAS' }, { v: tempo1, l: 'HORAS' }, { v: tempo2, l: 'MIN' }, { v: tempo3, l: 'SEG' }].map(({ v, l }) => (
              <div key={l} className="flex flex-col items-center bg-[#2a003a] border border-purple-800/50 rounded-lg px-3 py-1.5 min-w-[52px]">
                <span className="text-xl font-black tabular-nums">{v ?? '00'}</span>
                <span className="text-[9px] text-purple-400 font-bold tracking-wider">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
          <span className="ml-3 text-purple-300">Carregando ranking...</span>
        </div>
      ) : erro ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <p className="text-red-400">{erro}</p>
          <button onClick={carregar} className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold">Tentar novamente</button>
        </div>
      ) : ranking.length === 0 ? (
        <div className="flex items-center justify-center py-32 text-purple-400">
          Nenhuma venda registrada este mês ainda.
        </div>
      ) : (
        <div className="flex gap-0 min-h-[calc(100vh-120px)]">
          {/* Pódium */}
          <div className="w-[340px] shrink-0 bg-gradient-to-b from-[#3a0060] to-[#1a0028] border-r border-purple-900/40 p-6 flex flex-col">
            <div className="mb-4">
              <p className="text-[10px] font-bold tracking-[0.2em] text-purple-400 uppercase">Pódium dos Guerreiros</p>
              <h2 className="text-lg font-bold text-white">Top 3 do Mês</h2>
            </div>

            {/* Avatares no topo */}
            <div className="flex justify-around items-end mb-6 px-2">
              {/* 2º lugar */}
              {top3[1] && (
                <div className="flex flex-col items-center gap-1">
                  <div className={cn('h-14 w-14 rounded-full border-2 flex items-center justify-center text-lg font-black', PODIUM_COLORS[1].border, PODIUM_COLORS[1].bg)}>
                    {top3[1].iniciais}
                  </div>
                </div>
              )}
              {/* 1º lugar */}
              {top3[0] && (
                <div className="flex flex-col items-center gap-1">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <div className={cn('h-16 w-16 rounded-full border-2 flex items-center justify-center text-xl font-black', PODIUM_COLORS[0].border, PODIUM_COLORS[0].bg)}>
                    {top3[0].iniciais}
                  </div>
                </div>
              )}
              {/* 3º lugar */}
              {top3[2] && (
                <div className="flex flex-col items-center gap-1">
                  <div className={cn('h-14 w-14 rounded-full border-2 flex items-center justify-center text-lg font-black', PODIUM_COLORS[2].border, PODIUM_COLORS[2].bg)}>
                    {top3[2].iniciais}
                  </div>
                </div>
              )}
            </div>

            {/* Cards do pódium */}
            <div className="space-y-3 flex-1">
              {top3.map((v, i) => (
                <div key={v.userId} className={cn('rounded-xl border p-4', PODIUM_COLORS[i].border, PODIUM_COLORS[i].bg, 'shadow-lg', PODIUM_COLORS[i].shadow)}>
                  <p className={cn('text-[10px] font-bold tracking-widest uppercase mb-1', PODIUM_COLORS[i].text)}>
                    {i === 0 && <Crown className="inline h-3 w-3 mr-1" />}{LUGAR[i]}
                  </p>
                  <p className={cn('text-lg font-black uppercase leading-tight', PODIUM_COLORS[i].text)}>
                    {v.nome}
                  </p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-4xl font-black tabular-nums text-white">{v.vendas}</span>
                    <span className="text-sm text-purple-300 pb-1">vendas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demais */}
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-purple-400 uppercase">Demais Guerreiros</p>
                <h2 className="text-lg font-bold">Classificação Geral</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-purple-400">{ranking.length} participantes</span>
                <button
                  onClick={carregar}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-800/40 hover:bg-purple-700/60 text-xs font-semibold text-purple-300 border border-purple-700/40 transition-colors"
                >
                  <RefreshCw className={cn('h-3 w-3', loading && 'animate-spin')} />
                  Atualizar
                </button>
              </div>
            </div>

            {demais.length === 0 ? (
              <p className="text-purple-400 text-sm">Todos no pódium! 🏆</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {demais.map((v, i) => (
                  <div key={v.userId} className="flex items-center gap-3 bg-[#2a003a] rounded-xl border border-purple-900/40 px-4 py-3">
                    <span className="text-lg font-black text-purple-400 w-7 shrink-0">{i + 4}</span>
                    <div className="h-9 w-9 rounded-full bg-purple-700/40 border border-purple-600/40 flex items-center justify-center text-xs font-black text-purple-200 shrink-0">
                      {v.iniciais}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-white truncate">{v.nome}</p>
                      <p className="text-xs text-purple-400">{v.vendas} venda{v.vendas !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span className="text-sm font-black">{v.vendas}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {lastUpdate && (
              <p className="text-xs text-purple-600 mt-6 text-center">
                Atualiza a cada 2min · última atualização: {lastUpdate}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
