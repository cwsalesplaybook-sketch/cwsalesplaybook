/** Meta do Mês — layout completo com pontos, resgates e top guerreiros */
import { useEffect, useState, useCallback } from 'react';
import { Settings, RefreshCw, X, Check, TrendingUp, Calendar, Target, Trophy, Zap, Lock, Gift, Coffee, Plane, Headphones, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const SDRS_ATIVOS: Record<string, string> = {
  '1523': 'Miguel Nunes', '1445': 'Gabrielly Oliveira', '1556': 'Thais Giurizatto',
  '1667': 'Luis Lincon', '1686': 'Jonas Sobreira', '1382': 'Tatyanna Freitas',
  '1708': 'Kailane Carvalho', '1407': 'Lara Stefanny', '1727': 'Raquel Alves',
  '1710': 'José Guilherme', '1728': 'Fabíola Azevedo', '1729': 'Enizia Evangelista',
  '1607': 'Caique Silva', '1555': 'Ana Alice', '1608': 'Ryan Felipe',
  '1730': 'Maria Gabriela', '1707': 'Karoline Santos', '1685': 'Dayana Ferreira',
  '1738': 'Clara Rodrigues', '1706': 'Raissa Fonseca', '1335': 'João Paulo',
};

const PREMIOS = [
  { icon: Coffee,      nome: 'Vale Café',       pts: 300,    cor: 'text-amber-400' },
  { icon: Calendar,    nome: 'Dia de Folga',    pts: 1000,   cor: 'text-blue-400' },
  { icon: Headphones,  nome: 'Fone Bluetooth',  pts: 2500,   cor: 'text-purple-400' },
  { icon: Gift,        nome: 'Vale Presente',   pts: 5000,   cor: 'text-pink-400' },
  { icon: Plane,       nome: 'Viagem',          pts: 10000,  cor: 'text-green-400' },
];

interface MetaData { meta1: number; meta2: number; meta3: number; ajuste: number; sdrId: string; }
interface ApiData { ganhos: number; mes: string; diasUteisTotal: number; diasPassados: number; diasRestantes: number; diasUteisSemanais: number; }

function getStatus(ganhos: number, meta1: number, diasPassados: number, diasUteisTotal: number) {
  if (!meta1 || !diasPassados) return 'no-ritmo';
  return (ganhos / diasPassados) >= (meta1 / diasUteisTotal) * 0.9 ? 'no-ritmo' : 'atrasado';
}

function getMensagemForecast(ganhos: number, m1: number, m2: number, m3: number) {
  if (m3 > 0 && ganhos >= m3) return { texto: 'Você bateu a Meta 3! 🏆', nivel: 3 };
  if (m2 > 0 && ganhos >= m2) return { texto: 'Você está no forecast da Meta 3', nivel: 2 };
  if (m1 > 0 && ganhos >= m1) return { texto: 'Você está no forecast da Meta 2', nivel: 1 };
  return { texto: 'Você está no forecast da Meta 1', nivel: 0 };
}

function ConfigModal({ metaData, onSave, onClose }: { metaData: MetaData; onSave: (d: MetaData) => void; onClose: () => void }) {
  const [form, setForm] = useState(metaData);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a0028] border border-[#3a1048] rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Configurar Metas</h3>
          <button onClick={onClose} className="text-purple-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1.5 block">Seu nome (SDR)</label>
            <select value={form.sdrId} onChange={e => setForm(f => ({ ...f, sdrId: e.target.value }))}
              className="w-full bg-[#0d0012] border border-[#3a1048] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500">
              <option value="">Selecione seu nome</option>
              {Object.entries(SDRS_ATIVOS).map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}
            </select>
          </div>
          {[1, 2, 3].map(n => (
            <div key={n}>
              <label className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1.5 block">Meta {n} {n === 3 && '⭐'}</label>
              <input type="number" min={0} value={(form as any)[`meta${n}`]}
                onChange={e => setForm(f => ({ ...f, [`meta${n}`]: Number(e.target.value) }))}
                className="w-full bg-[#0d0012] border border-[#3a1048] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="0" />
            </div>
          ))}
        </div>
        <button onClick={() => onSave(form)}
          className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white transition-colors"
          style={{ background: 'linear-gradient(135deg, #d946ef, #9333ea)' }}>
          Salvar configurações
        </button>
      </div>
    </div>
  );
}

export default function MetaMes() {
  const [metaData, setMetaData] = useState<MetaData>({ meta1: 0, meta2: 0, meta3: 0, ajuste: 0, sdrId: '' });
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(false);
  const [userId, setUserId] = useState('');
  const [mes, setMes] = useState('');

  const carregarPerfil = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setUserId(session.user.id);
    const mesAtual = new Date().toISOString().slice(0, 7);
    setMes(mesAtual);
    const { data } = await supabase.from('user_metas').select('*').eq('user_id', session.user.id).eq('mes', mesAtual).single();
    if (data) setMetaData({ meta1: data.meta1, meta2: data.meta2, meta3: data.meta3, ajuste: data.ajuste, sdrId: data.sdr_id });
    else setConfig(true);
  }, []);

  const buscarGanhos = useCallback(async (sdrId: string) => {
    if (!sdrId) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/meta?sdrId=${sdrId}`, { cache: 'no-store' });
      const json = await r.json();
      if (json.ok) setApiData(json);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { carregarPerfil(); }, [carregarPerfil]);
  useEffect(() => { if (metaData.sdrId) buscarGanhos(metaData.sdrId); }, [metaData.sdrId, buscarGanhos]);
  useEffect(() => { const id = setInterval(() => { if (metaData.sdrId) buscarGanhos(metaData.sdrId); }, 5 * 60 * 1000); return () => clearInterval(id); }, [metaData.sdrId, buscarGanhos]);

  const salvarConfig = async (novosDados: MetaData) => {
    await supabase.from('user_metas').upsert({ user_id: userId, sdr_id: novosDados.sdrId, meta1: novosDados.meta1, meta2: novosDados.meta2, meta3: novosDados.meta3, ajuste: novosDados.ajuste, mes, updated_at: new Date().toISOString() }, { onConflict: 'user_id,mes' });
    setMetaData(novosDados);
    setConfig(false);
    if (novosDados.sdrId) buscarGanhos(novosDados.sdrId);
  };

  const alterarAjuste = async (delta: number) => {
    const novoAjuste = metaData.ajuste + delta;
    const novo = { ...metaData, ajuste: novoAjuste };
    setMetaData(novo);
    await supabase.from('user_metas').upsert({ user_id: userId, sdr_id: metaData.sdrId, meta1: metaData.meta1, meta2: metaData.meta2, meta3: metaData.meta3, ajuste: novoAjuste, mes, updated_at: new Date().toISOString() }, { onConflict: 'user_id,mes' });
  };

  const totalGanhos = (apiData?.ganhos ?? 0) + metaData.ajuste;
  const { meta1, meta2, meta3 } = metaData;
  const diasRestantes = apiData?.diasRestantes ?? 20;
  const diasPassados = apiData?.diasPassados ?? 1;
  const diasUteisTotal = apiData?.diasUteisTotal ?? 22;
  const metaReferencia = meta3 || meta2 || meta1;
  const status = getStatus(totalGanhos, meta1, diasPassados, diasUteisTotal);
  const forecast = getMensagemForecast(totalGanhos, meta1, meta2, meta3);
  const projecao = diasPassados > 0 ? Math.round((totalGanhos / diasPassados) * diasUteisTotal) : 0;
  const porDia = (m: number) => diasRestantes > 0 ? Math.ceil(Math.max(0, m - totalGanhos) / diasRestantes) : 0;
  const falta = (m: number) => Math.max(0, m - totalGanhos);
  const maxMeta = meta3 || meta2 || meta1 || 1;
  const pctBarra = Math.min(100, (totalGanhos / maxMeta) * 100);

  // Pontos: cada ganho = 100 pts
  const pontos = totalGanhos * 100;
  const nivelPts = [0, 500, 1000, 2000, 5000, 10000];
  const nivel = nivelPts.findIndex(n => pontos < n) - 1;
  const nivelAtual = Math.max(0, nivel < 0 ? nivelPts.length - 1 : nivel);
  const proximoNivel = nivelPts[nivelAtual + 1] ?? nivelPts[nivelPts.length - 1];
  const pctNivel = Math.min(100, ((pontos - nivelPts[nivelAtual]) / (proximoNivel - nivelPts[nivelAtual])) * 100);

  const nomeMes = mes ? new Date(mes + '-15').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase()) : '';
  const nomeSDR = SDRS_ATIVOS[metaData.sdrId] || '';

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      {config && <ConfigModal metaData={metaData} onSave={salvarConfig} onClose={() => setConfig(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
            <Target className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Meta do Mês</h1>
            <p className="text-sm text-purple-400">{nomeMes} {nomeSDR && `• ${nomeSDR}`} {!metaData.sdrId && '• Configure seu perfil'}</p>
          </div>
        </div>
        <button onClick={() => setConfig(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a0028] border border-[#3a1048] text-purple-300 hover:text-white hover:border-purple-500/50 transition-colors text-sm font-semibold">
          <Settings className="h-4 w-4" /> Configurar
        </button>
      </div>

      {/* Card principal */}
      <div className="relative rounded-2xl border border-[#3a1048] bg-[#14001e] overflow-hidden">
        {/* Cardapinho viking */}
        <img src="/cardapinho-viking.png" alt="Cardapinho viking" className="absolute right-4 bottom-0 h-52 object-contain pointer-events-none select-none z-10" />

        <div className="relative z-0 p-6 space-y-5">
          {/* Topo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-400 uppercase tracking-wider">
              <Target className="h-4 w-4" />
              META DO MÊS — STATUS
              <button onClick={() => buscarGanhos(metaData.sdrId)} disabled={loading} className="ml-1">
                <RefreshCw className={cn('h-3.5 w-3.5 text-purple-600 hover:text-purple-400', loading && 'animate-spin')} />
              </button>
            </div>
            <span className={cn('text-xs font-black px-4 py-1.5 rounded-full', status === 'no-ritmo' ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40')}>
              {status === 'no-ritmo' ? 'No Ritmo' : 'Atrasado'}
            </span>
          </div>

          {/* Número + forecast */}
          <div className="pr-48">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-purple-400">{totalGanhos}</span>
              <span className="text-xl text-purple-600 font-bold">/ {metaReferencia || '?'}</span>
            </div>
            <p className={cn('text-sm font-semibold mt-1', forecast.nivel >= 2 ? 'text-green-400' : forecast.nivel === 1 ? 'text-yellow-400' : 'text-purple-400')}>
              {forecast.texto}
            </p>

            {/* Barra */}
            {metaReferencia > 0 && (
              <div className="mt-3 relative">
                <div className="w-full h-1.5 bg-[#2a003a] rounded-full">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-700" style={{ width: `${pctBarra}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Cards Meta 1/2/3 */}
          <div className="grid grid-cols-3 gap-3 pr-48">
            {[{ label: 'META 1', value: meta1 }, { label: 'META 2', value: meta2 }, { label: 'META 3 ⭐', value: meta3 }].map(({ label, value }, i) => {
              const batida = value > 0 && totalGanhos >= value;
              return (
                <div key={i} className={cn('rounded-xl border p-3', batida ? 'border-green-500/40 bg-green-500/10' : 'border-[#2a003a] bg-[#0d0018]')}>
                  <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{label}</p>
                  <p className="text-xs text-purple-600 mt-0.5">{value > 0 ? `${value} fechamentos` : 'Não definida'}</p>
                  {batida ? (
                    <div className="flex items-center gap-1 mt-1.5 text-green-400 text-xs font-semibold"><Check className="h-4 w-4" /> Meta atingida!</div>
                  ) : value > 0 ? (
                    <div className="mt-1.5">
                      <p className="text-base font-black text-white">{porDia(value)}<span className="text-xs text-purple-500 ml-1">/dia</span></p>
                      <p className="text-[10px] text-purple-600">Falta <span className="text-white font-semibold">{falta(value)}</span> pra meta</p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Projeção + dias */}
          <div className="grid grid-cols-2 gap-3 pr-48">
            <div className="bg-[#0d0018] rounded-xl border border-[#2a003a] px-4 py-3 flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-purple-400 shrink-0" />
              <div>
                <p className="text-[10px] text-purple-500 uppercase font-bold tracking-wider">Projeção Final</p>
                <p className="text-base font-black text-white">{projecao} <span className="text-sm text-purple-500 font-normal">/ {metaReferencia || '?'}</span></p>
              </div>
            </div>
            <div className="bg-[#0d0018] rounded-xl border border-[#2a003a] px-4 py-3 flex items-center gap-3">
              <Calendar className="h-4 w-4 text-yellow-400 shrink-0" />
              <div>
                <p className="text-[10px] text-purple-500 uppercase font-bold tracking-wider">Dias Restantes</p>
                <p className="text-base font-black text-white">{diasRestantes} <span className="text-sm text-purple-500 font-normal">dias</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões +1 / -1 */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => alterarAjuste(-1)} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#2a0a0a] border border-red-900/40 text-red-300 font-bold text-base hover:bg-red-900/20 transition-colors">
          — -1 ganho
        </button>
        <button onClick={() => alterarAjuste(1)} className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-white shadow-lg transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #d946ef, #9333ea)' }}>
          + +1 ganho
        </button>
      </div>

      {/* Salvar */}
      <div className="text-center space-y-1">
        <button onClick={() => buscarGanhos(metaData.sdrId)} disabled={loading || !metaData.sdrId}
          className="flex items-center justify-center gap-2 mx-auto px-6 py-2.5 rounded-xl border border-[#3a1048] bg-transparent text-purple-300 hover:text-white hover:border-purple-500/50 font-semibold text-sm transition-colors disabled:opacity-40">
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} /> Salvar ganhos
        </button>
        <p className="text-xs text-purple-700">
          Ganhos do Pipedrive: {apiData?.ganhos ?? '...'} · Ajuste manual: {metaData.ajuste >= 0 ? '+' : ''}{metaData.ajuste}
        </p>
      </div>

      {/* Seção inferior */}
      <div className="grid grid-cols-[1fr_380px] gap-4">
        {/* Cardápio do Guerreiro */}
        <div className="rounded-2xl border border-[#3a1048] bg-[#14001e] p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">⚔️</span>
            <h3 className="text-base font-black text-white uppercase tracking-wide">Cardápio do Guerreiro</h3>
          </div>
          <p className="text-xs text-purple-500 mb-5">Troque seus ganhos por prêmios e benefícios</p>

          {/* Pontos e barra de nível */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-sm">🪙</span>
                <span className="text-xs text-purple-400 font-semibold">Seus pontos</span>
              </div>
              <span className="text-xs text-purple-400">Próximo nível: {proximoNivel.toLocaleString()} pts</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white">{pontos.toLocaleString()} <span className="text-sm text-yellow-400">pts</span></span>
              <div className="flex-1 h-2 bg-[#2a003a] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all duration-700" style={{ width: `${pctNivel}%` }} />
              </div>
              <span className="text-xs font-black text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-lg">🏆 NÍVEL {nivelAtual + 1}</span>
            </div>
          </div>

          {/* Prêmios */}
          <div className="grid grid-cols-5 gap-2">
            {PREMIOS.map(({ icon: Icon, nome, pts, cor }) => {
              const podeResgatar = pontos >= pts;
              return (
                <div key={nome} className="rounded-xl border border-[#2a003a] bg-[#0d0018] p-3 flex flex-col items-center gap-2 text-center">
                  <Icon className={cn('h-6 w-6', cor)} />
                  <p className="text-[11px] font-semibold text-white leading-tight">{nome}</p>
                  <p className="text-[10px] text-purple-500 font-bold">{pts.toLocaleString()} pts</p>
                  {podeResgatar ? (
                    <button className="w-full py-1 rounded-lg bg-purple-700/40 border border-purple-500/40 text-purple-300 text-[10px] font-bold hover:bg-purple-600/50 transition-colors">
                      Resgatar
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-purple-700 text-[10px]">
                      <Lock className="h-3 w-3" /> Bloqueado
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button className="w-full mt-4 py-2.5 rounded-xl border border-[#3a1048] text-purple-400 hover:text-white hover:border-purple-500/50 text-sm font-semibold transition-colors">
            Ver todos os prêmios
          </button>
        </div>

        {/* Top Guerreiros */}
        <div className="rounded-2xl border border-[#3a1048] bg-[#14001e] p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <h3 className="text-base font-black text-white uppercase tracking-wide">Top Guerreiros</h3>
          </div>
          <p className="text-xs text-purple-500 mb-5">Os maiores pontuadores do mês</p>

          <div className="space-y-2 flex-1">
            {/* Placeholder guerreiros — virá do ranking real futuramente */}
            {[
              { pos: 1, nome: 'Miguel Nunes',      pts: totalGanhos > 0 ? totalGanhos * 100 : 3250, eu: metaData.sdrId === '1523' },
              { pos: 2, nome: 'Caique Silva',       pts: 2480,  eu: metaData.sdrId === '1607' },
              { pos: 3, nome: 'Tatyanna Freitas',   pts: 2150,  eu: metaData.sdrId === '1382' },
              { pos: 4, nome: nomeSDR || 'Você',    pts: pontos, eu: true },
              { pos: 5, nome: 'Gabrielly Oliveira', pts: 980,   eu: metaData.sdrId === '1445' },
            ].map(({ pos, nome, pts: p, eu }) => (
              <div key={pos} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl', eu ? 'bg-purple-600/15 border border-purple-500/30' : 'bg-[#0d0018] border border-transparent')}>
                <span className={cn('text-sm font-black w-5 text-center', pos === 1 ? 'text-yellow-400' : pos === 2 ? 'text-slate-300' : pos === 3 ? 'text-amber-600' : 'text-purple-500')}>{pos}</span>
                <div className="h-8 w-8 rounded-full bg-purple-700/50 border border-purple-600/40 flex items-center justify-center text-xs font-black text-purple-200 shrink-0">
                  {nome.split(' ').slice(0, 2).map(n => n[0]).join('')}
                </div>
                <p className={cn('flex-1 text-sm font-semibold truncate', eu ? 'text-white' : 'text-purple-200')}>
                  {nome} {eu && nomeSDR && <span className="text-xs text-purple-500">(você)</span>}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-xs">🪙</span>
                  <span className="text-sm font-black text-white">{p.toLocaleString()} <span className="text-purple-500 text-xs font-normal">pts</span></span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2.5 rounded-xl border border-[#3a1048] text-purple-400 hover:text-white hover:border-purple-500/50 text-sm font-semibold transition-colors">
            Ver ranking completo
          </button>
        </div>
      </div>
    </div>
  );
}
