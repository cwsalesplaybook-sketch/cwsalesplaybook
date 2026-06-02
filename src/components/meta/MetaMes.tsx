/** Meta do Mês — acompanhamento individual por SDR */
import { useEffect, useState, useCallback } from 'react';
import { Settings, RefreshCw, X, Check, TrendingUp, Calendar, Target, Zap } from 'lucide-react';
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

interface MetaData { meta1: number; meta2: number; meta3: number; ajuste: number; sdrId: string; }
interface ApiData { ganhos: number; mes: string; diasUteisTotal: number; diasPassados: number; diasRestantes: number; diasUteisSemanais: number; }

function getStatus(ganhos: number, meta1: number, diasPassados: number, diasUteisTotal: number) {
  if (!meta1 || !diasPassados) return 'no-ritmo';
  const ritmoNecessario = meta1 / diasUteisTotal;
  const ritmoAtual = ganhos / diasPassados;
  return ritmoAtual >= ritmoNecessario * 0.9 ? 'no-ritmo' : 'atrasado';
}

function getMensagemForecast(ganhos: number, meta1: number, meta2: number, meta3: number) {
  if (ganhos >= meta3 && meta3 > 0) return { texto: 'Você bateu a Meta 3! 🏆', nivel: 3 };
  if (ganhos >= meta2 && meta2 > 0) return { texto: 'Você está no forecast da Meta 3', nivel: 2 };
  if (ganhos >= meta1 && meta1 > 0) return { texto: 'Você está no forecast da Meta 2', nivel: 1 };
  return { texto: 'Você está no forecast da Meta 1', nivel: 0 };
}

// Modal de configuração
function ConfigModal({ metaData, onSave, onClose }: {
  metaData: MetaData;
  onSave: (d: MetaData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(metaData);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-cw-surface border border-cw-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-cw-text">Configurar Metas</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-cw-muted uppercase tracking-wider mb-1 block">Seu perfil SDR</label>
            <select
              value={form.sdrId}
              onChange={e => setForm(f => ({ ...f, sdrId: e.target.value }))}
              className="w-full bg-cw-bg border border-cw-border rounded-lg px-3 py-2 text-sm text-cw-text focus:outline-none focus:border-cw-purple"
            >
              <option value="">Selecione seu nome</option>
              {Object.entries(SDRS_ATIVOS).map(([id, nome]) => (
                <option key={id} value={id}>{nome}</option>
              ))}
            </select>
          </div>

          {[1, 2, 3].map(n => (
            <div key={n}>
              <label className="text-xs font-semibold text-cw-muted uppercase tracking-wider mb-1 block">
                Meta {n} {n === 3 && '⭐'} <span className="text-cw-muted/60 lowercase">(fechamentos)</span>
              </label>
              <input
                type="number"
                min={0}
                value={(form as any)[`meta${n}`]}
                onChange={e => setForm(f => ({ ...f, [`meta${n}`]: Number(e.target.value) }))}
                className="w-full bg-cw-bg border border-cw-border rounded-lg px-3 py-2 text-sm text-cw-text focus:outline-none focus:border-cw-purple"
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => onSave(form)}
          className="w-full mt-6 py-2.5 bg-cw-purple text-white rounded-xl font-semibold text-sm hover:bg-cw-purple-light transition-colors"
        >
          Salvar
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
  const [salvando, setSalvando] = useState(false);
  const [userId, setUserId] = useState('');
  const [mes, setMes] = useState('');

  // Carrega dados do Supabase
  const carregarPerfil = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setUserId(session.user.id);

    const mesAtual = new Date().toISOString().slice(0, 7);
    setMes(mesAtual);

    const { data } = await supabase
      .from('user_metas')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('mes', mesAtual)
      .single();

    if (data) {
      setMetaData({ meta1: data.meta1, meta2: data.meta2, meta3: data.meta3, ajuste: data.ajuste, sdrId: data.sdr_id });
    } else {
      // Abre config se não tiver meta configurada
      setConfig(true);
    }
  }, []);

  // Busca ganhos do Pipedrive
  const buscarGanhos = useCallback(async (sdrId: string) => {
    if (!sdrId) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/meta?sdrId=${sdrId}`, { cache: 'no-store' });
      const json = await r.json();
      if (json.ok) setApiData(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregarPerfil(); }, [carregarPerfil]);
  useEffect(() => {
    if (metaData.sdrId) buscarGanhos(metaData.sdrId);
  }, [metaData.sdrId, buscarGanhos]);

  // Auto refresh a cada 5 min
  useEffect(() => {
    const id = setInterval(() => { if (metaData.sdrId) buscarGanhos(metaData.sdrId); }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [metaData.sdrId, buscarGanhos]);

  const salvarConfig = async (novosDados: MetaData) => {
    setSalvando(true);
    await supabase.from('user_metas').upsert({
      user_id: userId,
      sdr_id: novosDados.sdrId,
      meta1: novosDados.meta1,
      meta2: novosDados.meta2,
      meta3: novosDados.meta3,
      ajuste: novosDados.ajuste,
      mes,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,mes' });
    setMetaData(novosDados);
    setConfig(false);
    setSalvando(false);
    if (novosDados.sdrId) buscarGanhos(novosDados.sdrId);
  };

  const alterarAjuste = async (delta: number) => {
    const novoAjuste = metaData.ajuste + delta;
    setMetaData(m => ({ ...m, ajuste: novoAjuste }));
    await supabase.from('user_metas').upsert({
      user_id: userId,
      sdr_id: metaData.sdrId,
      meta1: metaData.meta1, meta2: metaData.meta2, meta3: metaData.meta3,
      ajuste: novoAjuste, mes,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,mes' });
  };

  const totalGanhos = (apiData?.ganhos ?? 0) + metaData.ajuste;
  const { meta1, meta2, meta3 } = metaData;
  const diasRestantes = apiData?.diasRestantes ?? 20;
  const diasPassados = apiData?.diasPassados ?? 1;
  const diasUteisTotal = apiData?.diasUteisTotal ?? 22;
  const diasUteisSemanais = apiData?.diasUteisSemanais ?? 5;

  const status = getStatus(totalGanhos, meta1, diasPassados, diasUteisTotal);
  const forecast = getMensagemForecast(totalGanhos, meta1, meta2, meta3);

  // Projeção final
  const ritmoAtual = diasPassados > 0 ? totalGanhos / diasPassados : 0;
  const projecao = Math.round(ritmoAtual * diasUteisTotal);

  // Por dia necessário por meta
  const porDia = (meta: number) => diasRestantes > 0 ? Math.ceil(Math.max(0, meta - totalGanhos) / diasRestantes) : 0;
  const falta = (meta: number) => Math.max(0, meta - totalGanhos);

  // Meta semanal (para forecast da meta3)
  const metaReferencia = meta3 || meta2 || meta1;
  const necessarioSemana = diasUteisTotal > 0 && metaReferencia > 0
    ? Math.ceil((metaReferencia / diasUteisTotal) * diasUteisSemanais)
    : 0;

  // Barra de progresso
  const maxMeta = meta3 || meta2 || meta1 || 1;
  const pctBarra = Math.min(100, (totalGanhos / maxMeta) * 100);
  const pctMeta1 = meta1 > 0 ? (meta1 / maxMeta) * 100 : 0;
  const pctMeta2 = meta2 > 0 ? (meta2 / maxMeta) * 100 : 0;

  const nomeMes = mes ? new Date(mes + '-15').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase()) : '';

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {config && <ConfigModal metaData={metaData} onSave={salvarConfig} onClose={() => setConfig(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-cw-text">Meta do Mês</h1>
          <p className="text-sm text-cw-muted">{nomeMes} · {SDRS_ATIVOS[metaData.sdrId] || 'Configure seu perfil'}</p>
        </div>
        <button onClick={() => setConfig(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cw-elevated border border-cw-border text-cw-muted hover:text-cw-text transition-colors text-sm">
          <Settings className="h-4 w-4" /> Configurar
        </button>
      </div>

      {/* Card principal */}
      <div className="rounded-2xl border border-[#3a1048] bg-[#1a0028] p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-cw-muted uppercase tracking-wider">
            <Target className="h-4 w-4" />
            META DO MÊS — STATUS
            <button onClick={() => buscarGanhos(metaData.sdrId)} disabled={loading}>
              <RefreshCw className={cn('h-3.5 w-3.5 ml-1 text-cw-muted/50 hover:text-cw-muted', loading && 'animate-spin')} />
            </button>
          </div>
          <span className={cn('text-xs font-black px-3 py-1.5 rounded-full border', status === 'no-ritmo' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 'bg-red-500/20 text-red-300 border-red-500/50')}>
            {status === 'no-ritmo' ? 'No Ritmo' : 'Atrasado'}
          </span>
        </div>

        {/* Número grande */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-black text-cw-purple-light">{totalGanhos}</span>
            <span className="text-2xl text-cw-muted font-bold">/ {metaReferencia || '?'}</span>
          </div>
          <p className={cn('text-sm font-semibold mt-1', forecast.nivel >= 2 ? 'text-green-400' : forecast.nivel === 1 ? 'text-cw-yellow' : 'text-cw-purple-light')}>
            {forecast.texto}
          </p>
        </div>

        {/* Barra de progresso */}
        {metaReferencia > 0 && (
          <div className="relative">
            <div className="w-full h-2 bg-cw-bg rounded-full overflow-hidden">
              <div className="h-full bg-cw-purple-light rounded-full transition-all duration-500" style={{ width: `${pctBarra}%` }} />
            </div>
            {/* Marcadores M1 e M2 */}
            {meta1 > 0 && (
              <div className="absolute top-0 h-2 w-0.5 bg-cw-yellow/60" style={{ left: `${pctMeta1}%` }}>
                <span className="absolute -top-5 -translate-x-1/2 text-[9px] text-cw-yellow font-bold">M1</span>
              </div>
            )}
            {meta2 > 0 && meta2 < maxMeta && (
              <div className="absolute top-0 h-2 w-0.5 bg-cw-yellow/60" style={{ left: `${pctMeta2}%` }}>
                <span className="absolute -top-5 -translate-x-1/2 text-[9px] text-cw-yellow font-bold">M2</span>
              </div>
            )}
          </div>
        )}

        {/* Cards Meta 1, 2, 3 */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'META 1', value: meta1 },
            { label: 'META 2', value: meta2 },
            { label: 'META 3 ⭐', value: meta3 },
          ].map(({ label, value }, i) => {
            const batida = totalGanhos >= value && value > 0;
            return (
              <div key={i} className={cn('rounded-xl border p-4', batida ? 'border-green-500/40 bg-green-500/10' : 'border-[#3a1048] bg-[#120018]')}>
                <p className="text-xs font-bold text-cw-muted uppercase tracking-wider mb-1">{label}</p>
                <p className="text-xs text-cw-muted/60">{value > 0 ? `${value} fechamentos` : 'Não definida'}</p>
                {batida ? (
                  <div className="flex items-center gap-1 mt-2 text-green-400">
                    <Check className="h-5 w-5" />
                    <span className="text-xs font-semibold">Meta atingida!</span>
                  </div>
                ) : value > 0 ? (
                  <div className="mt-2">
                    <p className="text-lg font-black text-cw-text">{porDia(value)}<span className="text-xs text-cw-muted font-normal ml-1">/dia</span></p>
                    <p className="text-xs text-cw-muted/70">Falta <span className="text-cw-text font-semibold">{falta(value)}</span> pra meta</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Projeção e dias restantes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#120018] rounded-xl border border-[#3a1048] px-4 py-3 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-cw-purple-light shrink-0" />
            <div>
              <p className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">Projeção Final</p>
              <p className="text-lg font-black text-white">{projecao} <span className="text-sm text-purple-400 font-normal">/ {metaReferencia || '?'}</span></p>
            </div>
          </div>
          <div className="bg-[#120018] rounded-xl border border-[#3a1048] px-4 py-3 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-cw-yellow shrink-0" />
            <div>
              <p className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">Dias Restantes</p>
              <p className="text-lg font-black text-white">{diasRestantes} <span className="text-sm text-purple-400 font-normal">úteis</span></p>
            </div>
          </div>
        </div>

        {/* Meta semanal */}
        {necessarioSemana > 0 && (
          <div className={cn('rounded-xl border px-4 py-3 flex items-center justify-between', totalGanhos >= necessarioSemana ? 'border-green-500/30 bg-green-500/5' : 'border-cw-yellow/30 bg-cw-yellow/5')}>
            <div className="flex items-center gap-2">
              <Zap className={cn('h-4 w-4', totalGanhos >= necessarioSemana ? 'text-green-400' : 'text-cw-yellow')} />
              <span className={cn('text-sm font-semibold', totalGanhos >= necessarioSemana ? 'text-green-400' : 'text-cw-yellow')}>
                {totalGanhos >= necessarioSemana
                  ? `✓ Meta da semana batida! (${totalGanhos}/${necessarioSemana})`
                  : `Faltam ${necessarioSemana - totalGanhos} fechamentos na semana pro forecast`}
              </span>
            </div>
            <span className="text-xs text-cw-muted">{totalGanhos}/{necessarioSemana} esta semana · {diasUteisSemanais} dia(s)</span>
          </div>
        )}
      </div>

      {/* Botões +1 / -1 e Salvar */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => alterarAjuste(-1)}
            disabled={metaData.ajuste <= 0 && (apiData?.ganhos ?? 0) <= 0}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 font-bold text-base hover:bg-red-500/25 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            — -1 ganho
          </button>
          <button
            onClick={() => alterarAjuste(1)}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-colors text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #d946ef, #9333ea)' }}
          >
            + +1 ganho
          </button>
        </div>

        <button
          onClick={() => buscarGanhos(metaData.sdrId)}
          disabled={loading || !metaData.sdrId}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#3a1048] bg-[#1a0028] text-purple-300 hover:text-white hover:border-purple-500/50 font-semibold text-sm transition-colors"
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          Salvar ganhos
        </button>

        <p className="text-center text-xs text-purple-600">
          Ganhos do Pipedrive: {apiData?.ganhos ?? '...'} · Ajuste manual: {metaData.ajuste > 0 ? '+' : ''}{metaData.ajuste}
        </p>
      </div>
    </div>
  );
}
