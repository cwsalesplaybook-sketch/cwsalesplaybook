/** Meta do Mês — layout completo com ritmo diário e insights */
import { useEffect, useState, useCallback } from 'react';
import { Settings, RefreshCw, X, Check, TrendingUp, Calendar, Target, Lightbulb, Zap, AlertTriangle, Star } from 'lucide-react';
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
interface EvolucaoPonto { dia: string; noDia: number; acumulado: number; }
interface ApiData  { ganhos: number; mes: string; diasUteisTotal: number; diasPassados: number; diasRestantes: number; diasUteisSemanais: number; evolucao?: EvolucaoPonto[]; }

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
  const [conversao, setConversao] = useState(50);

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
  useEffect(() => {
    const id = setInterval(() => { if (metaData.sdrId) buscarGanhos(metaData.sdrId); }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [metaData.sdrId, buscarGanhos]);

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
          title="Configurar metas"
          className="h-9 w-9 rounded-xl bg-cw-elevated border border-cw-border text-cw-muted hover:text-cw-text hover:bg-cw-bg flex items-center justify-center transition-all">
          <Settings className="h-[18px] w-[18px]" />
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

      {/* Botões +1 / Salvar / -1 */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
        <button onClick={() => alterarAjuste(-1)}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white border border-cw-red/30 text-cw-red font-bold text-base hover:bg-red-50 transition-colors shadow-sm">
          — 1 ganho
        </button>
        <div className="flex flex-col items-center gap-1">
          <button onClick={() => buscarGanhos(metaData.sdrId)} disabled={loading || !metaData.sdrId}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cw-border bg-white text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 font-semibold text-sm transition-colors disabled:opacity-40 shadow-sm whitespace-nowrap">
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} /> Salvar ganhos
          </button>
          <p className="text-[10px] text-cw-muted whitespace-nowrap">
            Pipedrive: {apiData?.ganhos ?? '...'} · Manual: {metaData.ajuste >= 0 ? '+' : ''}{metaData.ajuste}
          </p>
        </div>
        <button onClick={() => alterarAjuste(1)}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-white gradient-primary shadow-md transition-opacity hover:opacity-90">
          + 1 ganho
        </button>
      </div>

      {/* Seção inferior — Ritmo Diário + Insights */}
      <div className="grid grid-cols-2 gap-4">

        {/* Ritmo Diário por Meta */}
        <div className="cw-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cw-purple/10 flex items-center justify-center">
                <Zap className="h-4 w-4 text-cw-purple" />
              </div>
              <div>
                <h3 className="text-base font-black text-cw-text">Ritmo Diário por Meta</h3>
                <p className="text-xs text-cw-muted">{diasRestantes} dias restantes</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-cw-elevated border border-cw-border rounded-xl px-3 py-1.5">
              <button onClick={() => setConversao(c => Math.max(10, c - 5))} className="text-cw-muted hover:text-cw-text transition-colors font-bold text-sm w-4">−</button>
              <span className="text-xs font-bold text-cw-purple w-16 text-center">{conversao}% conv.</span>
              <button onClick={() => setConversao(c => Math.min(100, c + 5))} className="text-cw-muted hover:text-cw-text transition-colors font-bold text-sm w-4">+</button>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Meta 1', value: meta1, star: false },
              { label: 'Meta 2', value: meta2, star: false },
              { label: 'Meta 3', value: meta3, star: true },
            ].map(({ label, value, star }) => {
              if (!value) return null;
              const fechDia = diasRestantes > 0 ? Math.ceil(Math.max(0, value - totalGanhos) / diasRestantes) : 0;
              const agendDia = conversao > 0 ? Math.ceil(fechDia / (conversao / 100)) : 0;
              const batida = totalGanhos >= value;
              return (
                <div key={label} className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl border',
                  batida ? 'border-green-200 bg-green-50' : 'border-cw-border bg-cw-elevated'
                )}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-cw-purple uppercase tracking-wider">
                      {label}{star && ' ★'}
                    </p>
                    <p className="text-[11px] text-cw-muted">{value} fechamentos</p>
                  </div>
                  {batida ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                      <Check className="h-4 w-4" /> Atingida
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-black text-cw-text leading-none">{fechDia}</p>
                        <p className="text-[10px] text-cw-muted">fech/dia</p>
                      </div>
                      <div className="w-px h-8 bg-cw-border" />
                      <div className="text-right">
                        <p className="text-lg font-black text-cw-purple leading-none">{agendDia}</p>
                        <p className="text-[10px] text-cw-muted">agend/dia</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights Rápidos */}
        <div className="cw-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-cw-text">Insights Rápidos</h3>
              <p className="text-xs text-cw-muted">Análise do seu desempenho</p>
            </div>
          </div>

          <div className="space-y-3">
            {(() => {
              const mediaFechDia = diasPassados > 0 ? (totalGanhos / diasPassados) : 0;
              const ritmoNecessarioM1 = diasUteisTotal > 0 && meta1 > 0 ? meta1 / diasUteisTotal : 0;
              const pctRitmo = ritmoNecessarioM1 > 0 ? ((mediaFechDia - ritmoNecessarioM1) / ritmoNecessarioM1) * 100 : 0;
              const projecaoFinal = diasPassados > 0 ? Math.round((totalGanhos / diasPassados) * diasUteisTotal) : 0;

              const insights: { icon: React.ReactNode; texto: string; sub: string; cor: string }[] = [];

              if (meta1 > 0 && diasPassados > 0) {
                if (pctRitmo < 0) {
                  insights.push({
                    icon: <AlertTriangle className="h-4 w-4" />,
                    texto: `${Math.abs(Math.round(pctRitmo))}% abaixo do ritmo necessário da Meta 1`,
                    sub: 'Acelere o ritmo!',
                    cor: 'text-red-500 bg-red-50 border-red-200',
                  });
                } else {
                  insights.push({
                    icon: <TrendingUp className="h-4 w-4" />,
                    texto: `${Math.round(pctRitmo)}% acima do ritmo necessário da Meta 1`,
                    sub: 'Continue assim!',
                    cor: 'text-green-600 bg-green-50 border-green-200',
                  });
                }
              }

              if (diasPassados > 0) {
                insights.push({
                  icon: <Zap className="h-4 w-4" />,
                  texto: `Média de ${mediaFechDia.toFixed(1)} fechamentos por dia`,
                  sub: 'Continue registrando seus ganhos',
                  cor: 'text-cw-purple bg-cw-purple/5 border-cw-purple/20',
                });
              }

              if (projecaoFinal > 0 && meta3 > 0 && projecaoFinal >= meta3) {
                insights.push({
                  icon: <Star className="h-4 w-4" />,
                  texto: 'Projeção aponta para Meta 3',
                  sub: `Projeção final: ${projecaoFinal} fechamentos`,
                  cor: 'text-amber-600 bg-amber-50 border-amber-200',
                });
              } else if (projecaoFinal > 0 && meta2 > 0 && projecaoFinal >= meta2) {
                insights.push({
                  icon: <Star className="h-4 w-4" />,
                  texto: 'Projeção aponta para Meta 2',
                  sub: `Projeção final: ${projecaoFinal} fechamentos`,
                  cor: 'text-amber-600 bg-amber-50 border-amber-200',
                });
              } else if (projecaoFinal > 0 && meta1 > 0) {
                insights.push({
                  icon: <Star className="h-4 w-4" />,
                  texto: `Projeção final: ${projecaoFinal} fechamentos`,
                  sub: meta1 > 0 ? `Faltam ${Math.max(0, meta1 - projecaoFinal)} para fechar Meta 1` : '',
                  cor: 'text-cw-muted bg-cw-elevated border-cw-border',
                });
              }

              if (meta3 > 0 && totalGanhos >= meta3) {
                insights.push({
                  icon: <Star className="h-4 w-4" />,
                  texto: 'Meta 3 batida!',
                  sub: 'Performance excepcional este mês',
                  cor: 'text-amber-600 bg-amber-50 border-amber-200',
                });
              }

              if (insights.length === 0) {
                return (
                  <div className="flex items-center justify-center py-8 text-cw-muted text-sm">
                    Configure suas metas para ver os insights.
                  </div>
                );
              }

              return insights.map((ins, i) => (
                <div key={i} className={cn('flex items-start gap-3 px-4 py-3 rounded-xl border', ins.cor)}>
                  <span className="shrink-0 mt-0.5">{ins.icon}</span>
                  <div>
                    <p className="text-sm font-semibold leading-snug">{ins.texto}</p>
                    {ins.sub && <p className="text-xs opacity-70 mt-0.5">{ins.sub}</p>}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

      </div>
    </div>
  );
}
