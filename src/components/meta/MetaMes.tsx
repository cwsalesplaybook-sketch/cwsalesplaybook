/** Meta do Mês — layout completo com gráfico de evolução e top guerreiros */
import { useEffect, useState, useCallback } from 'react';
import { Settings, RefreshCw, X, Check, TrendingUp, Calendar, Target, Trophy, TrendingDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
} from 'recharts';

const SDRS_ATIVOS: Record<string, string> = {
  '1523': 'Miguel Nunes', '1445': 'Gabrielly Oliveira', '1556': 'Thais Giurizatto',
  '1667': 'Luis Lincon', '1686': 'Jonas Sobreira', '1382': 'Tatyanna Freitas',
  '1708': 'Kailane Carvalho', '1407': 'Lara Stefanny', '1727': 'Raquel Alves',
  '1710': 'José Guilherme', '1728': 'Fabíola Azevedo', '1729': 'Enizia Evangelista',
  '1607': 'Caique Silva', '1555': 'Ana Alice', '1608': 'Ryan Felipe',
  '1730': 'Maria Gabriela', '1707': 'Karoline Santos', '1685': 'Dayana Ferreira',
  '1738': 'Clara Rodrigues', '1706': 'Raissa Fonseca', '1335': 'João Paulo',
};

interface MetaData { meta1: number; meta2: number; meta3: number; ajuste: number; sdrId: string; }
interface EvolucaoPonto { dia: string; noDia: number; acumulado: number; }
interface ApiData  { ganhos: number; mes: string; diasUteisTotal: number; diasPassados: number; diasRestantes: number; diasUteisSemanais: number; evolucao?: EvolucaoPonto[]; }
interface RankingSDR { id: string; nome: string; iniciais: string; vendas: number; }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-cw-text">Configurar Metas</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Seu nome (SDR)</label>
            <select value={form.sdrId} onChange={e => setForm(f => ({ ...f, sdrId: e.target.value }))}
              className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple">
              <option value="">Selecione seu nome</option>
              {Object.entries(SDRS_ATIVOS).map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}
            </select>
          </div>
          {[1, 2, 3].map(n => (
            <div key={n}>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Meta {n} {n === 3 && '⭐'}</label>
              <input type="number" min={0} value={(form as any)[`meta${n}`]}
                onChange={e => setForm(f => ({ ...f, [`meta${n}`]: Number(e.target.value) }))}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple" placeholder="0" />
            </div>
          ))}
        </div>
        <button onClick={() => onSave(form)} className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white gradient-primary transition-opacity hover:opacity-90">
          Salvar configurações
        </button>
      </div>
    </div>
  );
}

export default function MetaMes() {
  const [metaData, setMetaData]   = useState<MetaData>({ meta1: 0, meta2: 0, meta3: 0, ajuste: 0, sdrId: '' });
  const [apiData, setApiData]     = useState<ApiData | null>(null);
  const [loading, setLoading]     = useState(false);
  const [config, setConfig]       = useState(false);
  const [userId, setUserId]       = useState('');
  const [mes, setMes]             = useState('');
  const [ranking, setRanking]     = useState<RankingSDR[]>([]);
  const [loadingRank, setLoadingRank] = useState(false);

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

  const buscarRanking = useCallback(async () => {
    setLoadingRank(true);
    try {
      const r = await fetch('/api/ranking', { cache: 'no-store' });
      const json = await r.json();
      if (json.ok) setRanking(json.ranking ?? []);
    } finally { setLoadingRank(false); }
  }, []);

  useEffect(() => { carregarPerfil(); buscarRanking(); }, [carregarPerfil, buscarRanking]);
  useEffect(() => { if (metaData.sdrId) buscarGanhos(metaData.sdrId); }, [metaData.sdrId, buscarGanhos]);
  useEffect(() => {
    const id = setInterval(() => {
      if (metaData.sdrId) buscarGanhos(metaData.sdrId);
      buscarRanking();
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [metaData.sdrId, buscarGanhos, buscarRanking]);

  const salvarConfig = async (novosDados: MetaData) => {
    await supabase.from('user_metas').upsert({ user_id: userId, sdr_id: novosDados.sdrId, meta1: novosDados.meta1, meta2: novosDados.meta2, meta3: novosDados.meta3, ajuste: novosDados.ajuste, mes, updated_at: new Date().toISOString() }, { onConflict: 'user_id,mes' });
    setMetaData(novosDados);
    setConfig(false);
    if (novosDados.sdrId) buscarGanhos(novosDados.sdrId);
  };

  const alterarAjuste = async (delta: number) => {
    const novoAjuste = metaData.ajuste + delta;
    setMetaData(m => ({ ...m, ajuste: novoAjuste }));
    await supabase.from('user_metas').upsert({ user_id: userId, sdr_id: metaData.sdrId, meta1: metaData.meta1, meta2: metaData.meta2, meta3: metaData.meta3, ajuste: novoAjuste, mes, updated_at: new Date().toISOString() }, { onConflict: 'user_id,mes' });
  };

  const totalGanhos   = (apiData?.ganhos ?? 0) + metaData.ajuste;
  const { meta1, meta2, meta3 } = metaData;
  const diasRestantes  = apiData?.diasRestantes  ?? 20;
  const diasPassados   = apiData?.diasPassados   ?? 1;
  const diasUteisTotal = apiData?.diasUteisTotal ?? 22;
  const metaReferencia = meta3 || meta2 || meta1;
  const status   = getStatus(totalGanhos, meta1, diasPassados, diasUteisTotal);
  const forecast = getMensagemForecast(totalGanhos, meta1, meta2, meta3);
  const projecao = diasPassados > 0 ? Math.round((totalGanhos / diasPassados) * diasUteisTotal) : 0;
  const porDia   = (m: number) => diasRestantes > 0 ? Math.ceil(Math.max(0, m - totalGanhos) / diasRestantes) : 0;
  const falta    = (m: number) => Math.max(0, m - totalGanhos);
  const maxMeta  = meta3 || meta2 || meta1 || 1;
  const pctBarra = Math.min(100, (totalGanhos / maxMeta) * 100);

  const pontos = totalGanhos * 100;

  const nomeMes = mes ? new Date(mes + '-15').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase()) : '';
  const nomeSDR = SDRS_ATIVOS[metaData.sdrId] || '';

  return (
    <div className="p-6  space-y-4">
      {config && <ConfigModal metaData={metaData} onSave={salvarConfig} onClose={() => setConfig(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-cw-purple/10 border border-cw-purple/20 flex items-center justify-center">
            <Target className="h-5 w-5 text-cw-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-cw-text">Meta do Mês</h1>
            <p className="text-sm text-cw-muted">
              {nomeMes}{nomeSDR && ` • ${nomeSDR}`}{!metaData.sdrId && ' • Configure seu perfil'}
            </p>
          </div>
        </div>
        <button onClick={() => setConfig(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-cw-border text-cw-text hover:border-cw-purple/50 hover:text-cw-purple transition-colors text-sm font-semibold shadow-sm">
          <Settings className="h-4 w-4" /> Configurar
        </button>
      </div>

      {/* Card principal — status */}
      <div className="relative rounded-2xl border border-cw-border bg-white overflow-hidden shadow-sm">
        {/* Cardapinho viking */}
        <img src="/cardapinho viking.png" alt="" className="absolute right-0 bottom-0 h-56 object-contain pointer-events-none select-none z-10" />

        <div className="relative z-0 p-6 space-y-5">
          {/* Topo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-cw-purple uppercase tracking-widest">
              <Target className="h-4 w-4" />
              META DO MÊS — STATUS
              <button onClick={() => buscarGanhos(metaData.sdrId)} disabled={loading} className="ml-1">
                <RefreshCw className={cn('h-3.5 w-3.5 text-cw-muted hover:text-cw-purple', loading && 'animate-spin')} />
              </button>
            </div>
            <span className={cn('text-xs font-black px-4 py-1.5 rounded-full border',
              status === 'no-ritmo'
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-red-50 text-red-500 border-red-200'
            )}>
              {status === 'no-ritmo' ? '↗ No Ritmo' : '↘ Atrasado'}
            </span>
          </div>

          {/* Número + forecast */}
          <div className="pr-52">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-cw-purple">{totalGanhos}</span>
              <span className="text-xl text-cw-muted font-bold">/ {metaReferencia || '?'}</span>
            </div>
            <p className={cn('text-sm font-semibold mt-1',
              forecast.nivel >= 2 ? 'text-green-600' : forecast.nivel === 1 ? 'text-amber-500' : 'text-cw-muted'
            )}>
              {forecast.texto}
            </p>
            {metaReferencia > 0 && (
              <div className="mt-3">
                <div className="w-full h-1.5 bg-cw-border rounded-full overflow-hidden">
                  <div className="h-full bg-cw-purple rounded-full transition-all duration-700" style={{ width: `${pctBarra}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Cards Meta 1/2/3 */}
          <div className="grid grid-cols-3 gap-3 pr-52">
            {[{ label: 'META 1', value: meta1 }, { label: 'META 2', value: meta2 }, { label: 'META 3 ⭐', value: meta3 }].map(({ label, value }, i) => {
              const batida = value > 0 && totalGanhos >= value;
              return (
                <div key={i} className={cn('rounded-xl border p-3',
                  batida ? 'border-green-200 bg-green-50' : 'border-cw-border bg-cw-elevated'
                )}>
                  <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">{label}</p>
                  <p className="text-xs text-cw-muted mt-0.5">{value > 0 ? `${value} fechamentos` : 'Não definida'}</p>
                  {batida ? (
                    <div className="flex items-center gap-1 mt-1.5 text-green-600 text-xs font-semibold">
                      <Check className="h-3.5 w-3.5" /> Meta atingida!
                    </div>
                  ) : value > 0 ? (
                    <div className="mt-1.5">
                      <p className="text-base font-black text-cw-text">{porDia(value)}<span className="text-xs text-cw-muted ml-1">/dia</span></p>
                      <p className="text-[10px] text-cw-muted">Falta <span className="text-cw-text font-semibold">{falta(value)}</span> pra meta</p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Projeção + dias */}
          <div className="grid grid-cols-2 gap-3 pr-52">
            <div className="bg-cw-elevated rounded-xl border border-cw-border px-4 py-3 flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-cw-purple shrink-0" />
              <div>
                <p className="text-[10px] text-cw-muted uppercase font-bold tracking-wider">Projeção Final</p>
                <p className="text-base font-black text-cw-text">{projecao} <span className="text-sm text-cw-muted font-normal">/ {metaReferencia || '?'}</span></p>
              </div>
            </div>
            <div className="bg-cw-elevated rounded-xl border border-cw-border px-4 py-3 flex items-center gap-3">
              <Calendar className="h-4 w-4 text-cw-yellow shrink-0" />
              <div>
                <p className="text-[10px] text-cw-muted uppercase font-bold tracking-wider">Dias Restantes</p>
                <p className="text-base font-black text-cw-text">{diasRestantes} <span className="text-sm text-cw-muted font-normal">dias</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões +1 / -1 */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => alterarAjuste(-1)}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white border border-cw-red/30 text-cw-red font-bold text-base hover:bg-red-50 transition-colors shadow-sm">
          — 1 ganho
        </button>
        <button onClick={() => alterarAjuste(1)}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-white gradient-primary shadow-md transition-opacity hover:opacity-90">
          + 1 ganho
        </button>
      </div>

      {/* Info Pipedrive */}
      <div className="text-center space-y-1">
        <button onClick={() => buscarGanhos(metaData.sdrId)} disabled={loading || !metaData.sdrId}
          className="flex items-center justify-center gap-2 mx-auto px-6 py-2.5 rounded-xl border border-cw-border bg-white text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 font-semibold text-sm transition-colors disabled:opacity-40 shadow-sm">
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} /> Salvar ganhos
        </button>
        <p className="text-xs text-cw-muted">
          Ganhos do Pipedrive: {apiData?.ganhos ?? '...'} · Ajuste manual: {metaData.ajuste >= 0 ? '+' : ''}{metaData.ajuste}
        </p>
      </div>

      {/* Seção inferior */}
      <div className="grid grid-cols-[1fr_380px] gap-4">

        {/* Gráfico Evolução de Fechamentos */}
        <div className="cw-card p-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cw-purple/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-cw-purple" />
              </div>
              <div>
                <h3 className="text-base font-black text-cw-text">Evolução de Fechamentos</h3>
                <p className="text-xs text-cw-muted">Acumulado diário no mês</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-cw-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-0.5 bg-cw-purple rounded inline-block" /> Acumulado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-6 border-t-2 border-dashed border-cw-red inline-block" /> No dia
              </span>
            </div>
          </div>

          <div className="mt-5 h-52">
            {(apiData?.evolucao?.length ?? 0) === 0 ? (
              <div className="h-full flex items-center justify-center text-cw-muted text-sm">
                {loading ? <RefreshCw className="h-5 w-5 animate-spin text-cw-purple" /> : 'Sem dados ainda este mês.'}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={apiData!.evolucao} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9DDF2" vertical={false} />
                  <XAxis
                    dataKey="dia"
                    tick={{ fontSize: 10, fill: '#7B5EA7' }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#7B5EA7' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #E9DDF2',
                      borderRadius: 12,
                      fontSize: 12,
                      color: '#1A0A2E',
                      boxShadow: '0 4px 20px rgba(89,50,122,0.10)',
                    }}
                    labelStyle={{ fontWeight: 700, color: '#A543FA' }}
                    formatter={(value: number, name: string) => [
                      value,
                      name === 'acumulado' ? 'Acumulado' : 'No dia',
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="acumulado"
                    stroke="#A543FA"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#A543FA', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#A543FA' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="noDia"
                    stroke="#FF5959"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    dot={{ r: 2.5, fill: '#FF5959', strokeWidth: 0 }}
                    activeDot={{ r: 4, fill: '#FF5959' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Guerreiros — dados reais da /api/ranking */}
        <div className="cw-card p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-5 w-5 text-cw-yellow" />
            <h3 className="text-base font-black text-cw-text uppercase tracking-wide">Top Guerreiros</h3>
          </div>
          <p className="text-xs text-cw-muted mb-5">Negócios ganhos no mês · Pipedrive ao vivo</p>

          <div className="space-y-2 flex-1">
            {loadingRank ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-5 w-5 animate-spin text-cw-purple" />
              </div>
            ) : ranking.length === 0 ? (
              <div className="text-center py-8 text-cw-muted text-sm">Sem dados ainda este mês.</div>
            ) : (
              ranking.slice(0, 5).map((sdr, idx) => {
                const eu = sdr.id === metaData.sdrId;
                const pos = idx + 1;
                return (
                  <div key={sdr.id} className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
                    eu ? 'bg-cw-purple/8 border border-cw-purple/20' : 'bg-cw-elevated border border-transparent hover:border-cw-border'
                  )}>
                    <span className={cn('text-sm font-black w-5 text-center shrink-0',
                      pos === 1 ? 'text-cw-yellow' : pos === 2 ? 'text-slate-400' : pos === 3 ? 'text-amber-500' : 'text-cw-muted'
                    )}>{pos}</span>
                    <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-black text-white shrink-0">
                      {sdr.iniciais}
                    </div>
                    <p className={cn('flex-1 text-sm font-semibold truncate', eu ? 'text-cw-text' : 'text-cw-text/80')}>
                      {sdr.nome}{eu && <span className="text-xs text-cw-muted ml-1">(você)</span>}
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs">🏆</span>
                      <span className="text-sm font-black text-cw-text">{sdr.vendas}</span>
                      <span className="text-cw-muted text-xs font-normal">ganhos</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={buscarRanking}
            className="w-full mt-4 py-2.5 rounded-xl border border-cw-border text-cw-purple hover:bg-cw-purple/5 hover:border-cw-purple/40 text-sm font-semibold transition-colors"
          >
            Ver ranking completo
          </button>
        </div>
      </div>
    </div>
  );
}
