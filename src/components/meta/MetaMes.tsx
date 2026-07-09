/** Meta do Mês — layout completo com ritmo diário e insights */
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, RefreshCw, X, Check, TrendingUp, Calendar, Target, Lightbulb, Zap, Star, Rocket, XCircle, User, Users, LayoutGrid } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useSidebarContext } from '@/context/SidebarContext';
import TeamMetaView from './TeamMetaView';
import PromocaoCelebration from './PromocaoCelebration';

const SDRS_ATIVOS: Record<string, string> = {
  '1523': 'Miguel Nunes', '1445': 'Gabrielly Oliveira', '1556': 'Thais Giurizatto',
  '1667': 'Luis Lincon', '1686': 'Jonas Sobreira', '1382': 'Tatyanna Freitas',
  '1708': 'Kailane Carvalho', '1407': 'Lara Stefanny', '1727': 'Raquel Alves',
  '1710': 'José Guilherme', '1728': 'Fabíola Azevedo', '1729': 'Enizia Evangelista',
  '1607': 'Caique Silva', '1555': 'Ana Alice', '1608': 'Ryan Felipe',
  '1730': 'Maria Gabriela', '1685': 'Dayana Ferreira',
  '1738': 'Clara Rodrigues', '1706': 'Raissa Fonseca', '1335': 'João Paulo',
};

interface MetaData { meta1: number; meta2: number; meta3: number; mega1: number; mega2: number; mega3: number; ajuste: number; sdrId: string; }
interface EvolucaoPonto { dia: string; noDia: number; acumulado: number; }
interface ApiData  { ganhos: number; mes: string; diasUteisTotal: number; diasPassados: number; diasRestantes: number; diasUteisSemanais: number; evolucao?: EvolucaoPonto[]; }

function getStatus(ganhos: number, meta1: number, diasPassados: number, diasUteisTotal: number) {
  if (!meta1 || !diasPassados) return 'no-ritmo';
  return (ganhos / diasPassados) >= (meta1 / diasUteisTotal) * 0.9 ? 'no-ritmo' : 'atrasado';
}

/** Estado do progresso em relação às metas, em ordem crescente: pra cada uma,
 *  diz se já chegou nela, se tá perto da próxima (80%+ do caminho) ou segue no forecast normal. */
function getMensagemStatus(ganhos: number, metas: { label: string; value: number }[]) {
  const validas = metas.filter((m) => m.value > 0);
  if (validas.length === 0) return { texto: 'Configure suas metas pra acompanhar o progresso', nivel: 0 };

  let alcancada: { label: string; value: number } | null = null;
  let proxima: { label: string; value: number } | null = null;
  for (const m of validas) {
    if (ganhos >= m.value) alcancada = m;
    else { proxima = m; break; }
  }

  if (!proxima) return { texto: `Você bateu a ${alcancada!.label}! Parabéns! 🏆🚀`, nivel: 3 };

  const progresso = ganhos / proxima.value;
  if (alcancada && progresso < 0.8) return { texto: `Você chegou à ${alcancada.label}, parabéns! 🎉`, nivel: 2 };
  if (progresso >= 0.8) return { texto: `Você está perto da ${proxima.label}!`, nivel: 1 };
  return { texto: `Você está no forecast da ${proxima.label}`, nivel: 0 };
}

function ConfigModal({ metaData, nomeDetectado, pipedriveUsers, onSave, onClose }: {
  metaData: MetaData;
  nomeDetectado?: string;
  pipedriveUsers: { id: string; name: string }[];
  onSave: (d: MetaData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(metaData);
  const [busca, setBusca] = useState(nomeDetectado || SDRS_ATIVOS[metaData.sdrId] || '');
  const [nomeSelecionado, setNomeSelecionado] = useState(nomeDetectado || SDRS_ATIVOS[metaData.sdrId] || '');
  const [aberto, setAberto] = useState(false);

  // Mescla a lista ao vivo do Pipedrive com a lista fixa de SDRs — a live pode
  // não trazer todo mundo (conta inativa, paginação), mas o time mantém
  // SDRS_ATIVOS como fonte de verdade dos IDs válidos pro campo "[QUAL] SDR/BDR".
  const idsVivos = new Set(pipedriveUsers.map(u => u.id));
  const lista = [
    ...pipedriveUsers,
    ...Object.entries(SDRS_ATIVOS)
      .filter(([id]) => !idsVivos.has(id))
      .map(([id, name]) => ({ id, name })),
  ];
  const filtrados = busca.length >= 1
    ? lista.filter(u => u.name.toLowerCase().includes(busca.toLowerCase())).slice(0, 8)
    : [];

  const selecionarUsuario = (u: { id: string; name: string }) => {
    setForm(f => ({ ...f, sdrId: u.id }));
    setBusca(u.name);
    setNomeSelecionado(u.name);
    setAberto(false);
  };

  // Resolve o SDR mesmo que o usuário não tenha clicado numa sugestão do dropdown
  // (ex: digitou só o primeiro nome, "enizia", e foi direto no Salvar).
  const resolverUsuario = (): { id: string; name: string } | null => {
    const alvo = busca.trim().toLowerCase();
    if (!alvo) return null;
    if (form.sdrId && nomeSelecionado && nomeSelecionado.toLowerCase() === alvo) {
      return { id: form.sdrId, name: nomeSelecionado };
    }
    const exato = lista.find(u => u.name.toLowerCase() === alvo);
    if (exato) return exato;
    const porPrimeiroNome = lista.filter(u => u.name.toLowerCase().split(' ')[0] === alvo);
    if (porPrimeiroNome.length === 1) return porPrimeiroNome[0];
    if (filtrados.length === 1) return filtrados[0];
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-cw-text">Configurar Metas</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Seu nome (SDR)</label>
            <div className="relative">
              <input
                type="text"
                value={busca}
                onChange={e => { setBusca(e.target.value); setNomeSelecionado(''); setAberto(true); }}
                onFocus={() => setAberto(true)}
                placeholder="Digite seu nome..."
                className={cn(
                  'w-full bg-cw-elevated border rounded-xl px-3 py-2.5 pr-8 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none',
                  nomeSelecionado ? 'border-green-400 bg-green-50' : 'border-cw-border focus:border-cw-purple'
                )}
              />
              {nomeSelecionado && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600 pointer-events-none" />
              )}
            </div>
            {aberto && filtrados.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-cw-border rounded-xl shadow-lg overflow-hidden">
                {filtrados.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => selecionarUsuario(u)}
                    className="w-full text-left px-3 py-2.5 text-sm text-cw-text hover:bg-cw-purple/5 hover:text-cw-purple transition-colors"
                  >
                    {u.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {[1, 2, 3].map(n => (
            <div key={n}>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Meta {n} {n === 3 && '⭐'}</label>
              <input type="number" min={0} value={(form as any)[`meta${n}`]}
                onChange={e => setForm(f => ({ ...f, [`meta${n}`]: Number(e.target.value) }))}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple" placeholder="0" />
            </div>
          ))}

          <div className="border-t border-cw-border pt-4 space-y-4">
            <p className="flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider">
              <Rocket className="h-3.5 w-3.5" /> Mega Metas (stretch)
            </p>
            {[1, 2, 3].map(n => (
              <div key={`mega${n}`}>
                <label className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1.5 block">Mega Meta {n}</label>
                <input type="number" min={0} value={(form as any)[`mega${n}`]}
                  onChange={e => setForm(f => ({ ...f, [`mega${n}`]: Number(e.target.value) }))}
                  className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-amber-400" placeholder="0" />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            const resolvido = resolverUsuario();
            if (resolvido) { onSave({ ...form, sdrId: resolvido.id }); return; }
            if (!form.sdrId) { alert('Não encontrei esse SDR pelo nome digitado. Selecione um nome na lista.'); return; }
            onSave(form);
          }}
          className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white gradient-primary transition-opacity hover:opacity-90"
        >
          Salvar configurações
        </button>
      </div>
    </div>
  );
}

function PersonalMetaView() {
  const navigate = useNavigate();
  const [metaData, setMetaData]   = useState<MetaData>({ meta1: 0, meta2: 0, meta3: 0, mega1: 0, mega2: 0, mega3: 0, ajuste: 0, sdrId: '' });
  const [apiData, setApiData]     = useState<ApiData | null>(null);
  const [loading, setLoading]     = useState(false);
  const [config, setConfig]       = useState(false);
  const [userId, setUserId]       = useState('');
  const [mes, setMes]             = useState('');
  // Conversão fixa por tier de carreira: Meta 1/2 converte mais fácil que Meta 3.
  // Parcerias converte melhor ainda (leads mais qualificados).
  // Cada SDR ativa o próprio tier (salvo por pessoa) pra ver a conversão que se aplica a ele.
  const CONV_TIER12 = 62;
  const CONV_TIER3  = 48;
  const CONV_PARCERIAS = 80;
  const [meuTier, setMeuTier] = useState<'1-2' | '3' | 'parcerias'>('1-2');

  useEffect(() => {
    if (!userId) return;
    try {
      const salvo = localStorage.getItem(`cw-sdr-tier:${userId}`);
      if (salvo === '1-2' || salvo === '3' || salvo === 'parcerias') setMeuTier(salvo);
    } catch { /* ignore */ }
  }, [userId]);

  const selecionarTier = (t: '1-2' | '3' | 'parcerias') => {
    setMeuTier(t);
    try { localStorage.setItem(`cw-sdr-tier:${userId}`, t); } catch { /* ignore */ }
  };
  const [autoNome, setAutoNome]   = useState('');
  const [pipedriveUsers, setPipedriveUsers] = useState<{ id: string; name: string }[]>([]);
  const [ajusteModal, setAjusteModal] = useState<'add' | 'sub' | null>(null);
  const [ajusteQtd, setAjusteQtd]   = useState('1');
  const [ajusteMot, setAjusteMot]   = useState('');
  const [perdas, setPerdas] = useState<{ total: number; leads: { titulo: string; nome: string | null; telefone: string | null; motivo: string; data: string }[] } | null>(null);

  // Leads Perdidos acompanha a altura real do card Ritmo Diário (medida via ResizeObserver)
  // em vez de depender do stretch do grid — evita tanto o vão em branco quanto o card estourando
  // de tamanho quando há muitos leads.
  const ritmoCardRef = useRef<HTMLDivElement>(null);
  const [ritmoHeight, setRitmoHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    const el = ritmoCardRef.current;
    if (!el) return;
    // getBoundingClientRect (não o contentRect do ResizeObserver, que exclui padding/borda)
    // pra bater com a altura total do card, já que aplicamos em `height` (border-box).
    const observer = new ResizeObserver(() => setRitmoHeight(el.getBoundingClientRect().height));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const carregarPerfil = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setUserId(session.user.id);
    const mesAtual = new Date().toISOString().slice(0, 7);
    setMes(mesAtual);
    const { data } = await supabase.from('user_metas').select('*').eq('user_id', session.user.id).eq('mes', mesAtual).single();
    if (data) {
      setMetaData({ meta1: data.meta1, meta2: data.meta2, meta3: data.meta3, mega1: data.mega1 ?? 0, mega2: data.mega2 ?? 0, mega3: data.mega3 ?? 0, ajuste: data.ajuste, sdrId: data.sdr_id });
    } else {
      // Auto-detecta o SDR pelo e-mail do login — sem precisar selecionar manualmente
      let autoSdrId = '';
      let autoSdrNome = '';
      try {
        const r = await fetch('/api/pipedrive-users');
        const json = await r.json();
        if (json.ok) {
          const users = json.users as { id: string; name: string; email: string }[];
          setPipedriveUsers(users.map(u => ({ id: u.id, name: u.name })));
          if (session.user.email) {
            // 1º: e-mail exato
            const byEmail = users.find(u => u.email?.toLowerCase() === session.user.email!.toLowerCase());
            if (byEmail) { autoSdrId = byEmail.id; autoSdrNome = byEmail.name; }
            else {
              const fullName = (session.user.user_metadata?.full_name ?? '').toLowerCase().trim();
              if (fullName) {
                // 2º: nome completo contém ou é contido pelo nome do Pipedrive
                let match = users.find(u => {
                  const pn = u.name.toLowerCase();
                  return pn.includes(fullName) || fullName.includes(pn);
                });
                // 3º: 2+ partes do nome (≥3 chars) aparecem no nome do Pipedrive
                if (!match) {
                  const parts = fullName.split(' ').filter(p => p.length >= 3);
                  if (parts.length >= 2) {
                    match = users.find(u => {
                      const pn = u.name.toLowerCase();
                      return parts.filter(p => pn.includes(p)).length >= 2;
                    });
                  }
                }
                // 4º: primeiro nome único (≥4 chars) — só usa se não há ambiguidade
                if (!match) {
                  const first = fullName.split(' ')[0];
                  if (first.length >= 4) {
                    const candidates = users.filter(u => u.name.toLowerCase().startsWith(first));
                    if (candidates.length === 1) match = candidates[0];
                  }
                }
                if (match) { autoSdrId = match.id; autoSdrNome = match.name; }
              }
            }
          }
        }
      } catch { /* ignora falha — usuário digita o nome manualmente */ }

      setAutoNome(autoSdrNome);
      setMetaData(m => ({ ...m, sdrId: autoSdrId }));
      setConfig(true);
    }
  }, []);

  const buscarGanhos = useCallback(async (sdrId: string, forceRefresh = false) => {
    if (!sdrId) return;
    setLoading(true);
    const bust = forceRefresh ? `&_t=${Date.now()}` : '';
    try {
      const [rMeta, rPerdas] = await Promise.all([
        fetch(`/api/meta?sdrId=${sdrId}${bust}`),
        fetch(`/api/perdas?sdrId=${sdrId}${bust}`),
      ]);
      const [jMeta, jPerdas] = await Promise.all([rMeta.json(), rPerdas.json()]);
      if (jMeta.ok) setApiData(jMeta);
      if (jPerdas.ok) setPerdas(jPerdas);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { carregarPerfil(); }, [carregarPerfil]);
  useEffect(() => { if (metaData.sdrId) buscarGanhos(metaData.sdrId); }, [metaData.sdrId, buscarGanhos]);
  useEffect(() => {
    const id = setInterval(() => { if (metaData.sdrId) buscarGanhos(metaData.sdrId); }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [metaData.sdrId, buscarGanhos]);

  const salvarConfig = async (novosDados: MetaData) => {
    await supabase.from('user_metas').upsert({ user_id: userId, sdr_id: novosDados.sdrId, meta1: novosDados.meta1, meta2: novosDados.meta2, meta3: novosDados.meta3, mega1: novosDados.mega1, mega2: novosDados.mega2, mega3: novosDados.mega3, ajuste: novosDados.ajuste, mes, updated_at: new Date().toISOString() }, { onConflict: 'user_id,mes' });
    setMetaData(novosDados);
    setConfig(false);
    if (novosDados.sdrId) buscarGanhos(novosDados.sdrId, true);
  };

  const alterarAjuste = async (delta: number) => {
    const novoAjuste = metaData.ajuste + delta;
    setMetaData(m => ({ ...m, ajuste: novoAjuste }));
    await supabase.from('user_metas').upsert({ user_id: userId, sdr_id: metaData.sdrId, meta1: metaData.meta1, meta2: metaData.meta2, meta3: metaData.meta3, mega1: metaData.mega1, mega2: metaData.mega2, mega3: metaData.mega3, ajuste: novoAjuste, mes, updated_at: new Date().toISOString() }, { onConflict: 'user_id,mes' });
  };

  const totalGanhos   = (apiData?.ganhos ?? 0) + metaData.ajuste;
  const { meta1, meta2, meta3, mega1, mega2, mega3 } = metaData;
  const temMega = mega1 > 0 || mega2 > 0 || mega3 > 0;
  const diasRestantes  = apiData?.diasRestantes  ?? 20;
  // diasPassados só é confiável quando o Pipedrive retornou dados reais (apiData != null).
  // Fallback 0 garante que projeção e insights não calculem com divisor falso (ex: ÷1 → 1100).
  const diasPassados   = apiData?.diasPassados   ?? 0;
  const diasUteisTotal = apiData?.diasUteisTotal ?? 22;
  const metaReferencia = meta3 || meta2 || meta1;
  const status   = getStatus(totalGanhos, meta1, diasPassados, diasUteisTotal);
  const forecast = getMensagemStatus(totalGanhos, [
    { label: 'Meta 1', value: meta1 }, { label: 'Meta 2', value: meta2 }, { label: 'Meta 3', value: meta3 },
    { label: 'Mega Meta 1', value: mega1 }, { label: 'Mega Meta 2', value: mega2 }, { label: 'Mega Meta 3', value: mega3 },
  ]);
  // Projeção só faz sentido com dados reais do Pipedrive
  const projecao = apiData && diasPassados > 0 ? Math.round((totalGanhos / diasPassados) * diasUteisTotal) : 0;
  const porDia   = (m: number) => diasRestantes > 0 ? Math.ceil(Math.max(0, m - totalGanhos) / diasRestantes) : 0;
  const falta    = (m: number) => Math.max(0, m - totalGanhos);
  const maxMeta  = meta3 || meta2 || meta1 || 1;
  const pctBarra = Math.min(100, (totalGanhos / maxMeta) * 100);
  // Ritmo de fechamentos vs. o necessário pra bater a Meta 1 — mostrado dentro do mini-bloco da Meta 1
  const temRitmoM1 = !!apiData && diasPassados > 0 && meta1 > 0;
  const ritmoNecessarioM1 = diasUteisTotal > 0 && meta1 > 0 ? meta1 / diasUteisTotal : 0;
  const pctRitmoM1 = temRitmoM1 && ritmoNecessarioM1 > 0 ? (((totalGanhos / diasPassados) - ritmoNecessarioM1) / ritmoNecessarioM1) * 100 : 0;
  // Onde você deveria estar HOJE se estivesse no ritmo certo pra bater a meta de referência.
  const ritmoHojeValor = apiData && diasPassados > 0 ? (diasPassados / diasUteisTotal) * maxMeta : 0;
  const ritmoHojePct   = Math.min(ritmoHojeValor / maxMeta * 100, 99);
  const noRitmoHoje     = totalGanhos >= ritmoHojeValor;

  const nomeMes = mes ? new Date(mes + '-15').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase()) : '';
  const nomeSDR = SDRS_ATIVOS[metaData.sdrId] || '';

  return (
    <div className="p-6  space-y-4">
      {config && <ConfigModal metaData={metaData} nomeDetectado={autoNome} pipedriveUsers={pipedriveUsers} onSave={salvarConfig} onClose={() => setConfig(false)} />}

      {/* Card principal — status */}
      <div className="relative rounded-2xl border border-cw-border bg-white shadow-sm">
        {/* Cardapinho viking — na frente do conteúdo */}
        <img src="/cardapinho-viking.png" alt="" className="absolute right-0 bottom-0 h-52 object-contain pointer-events-none select-none" style={{ zIndex: 10 }} />

        <div className="relative p-6 space-y-5" style={{ zIndex: 1 }}>
          {/* Topo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-cw-purple uppercase tracking-widest">
              <Target className="h-4 w-4" />
              META DO MÊS — STATUS
              <button onClick={() => buscarGanhos(metaData.sdrId, true)} disabled={loading} className="ml-1">
                <RefreshCw className={cn('h-3.5 w-3.5 text-cw-muted hover:text-cw-purple', loading && 'animate-spin')} />
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Info Pipedrive/Manual */}
              <span className="text-[10px] text-cw-muted/70 whitespace-nowrap hidden sm:inline">
                Pipedrive: {apiData?.ganhos ?? '...'} · Manual: {metaData.ajuste >= 0 ? '+' : ''}{metaData.ajuste}
              </span>
              {/* Controles manuais minimalistas */}
              <button onClick={() => { setAjusteQtd('1'); setAjusteMot(''); setAjusteModal('sub'); }}
                title="Remover ganho"
                className="h-6 w-6 rounded-md text-cw-muted/50 hover:text-red-400 hover:bg-red-50 flex items-center justify-center transition-all text-sm font-bold">
                −
              </button>
              <button onClick={() => { setAjusteQtd('1'); setAjusteMot(''); setAjusteModal('add'); }}
                title="Adicionar ganho"
                className="h-6 w-6 rounded-md text-cw-muted/50 hover:text-cw-purple hover:bg-cw-purple/10 flex items-center justify-center transition-all text-sm font-bold">
                +
              </button>
              <div className="w-px h-4 bg-cw-border mx-0.5" />
              <span className={cn('text-xs font-black px-3 py-1 rounded-full border',
                status === 'no-ritmo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-red-50 text-red-500 border-red-200'
              )}>
                {status === 'no-ritmo' ? '↗ No Ritmo' : '↘ Atrasado'}
              </span>
              <button onClick={() => navigate('/kanban')} title="Kanban de reuniões"
                className="h-7 w-7 rounded-lg bg-white/60 border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-all">
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setConfig(true)} title="Configurar metas"
                className="h-7 w-7 rounded-lg bg-white/60 border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-all">
                <Settings className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Número + forecast */}
          <div>
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
              <div className="mt-4">
                <div className="relative w-full h-1.5 bg-cw-border rounded-full">
                  <div className="absolute inset-y-0 left-0 bg-cw-purple rounded-full transition-all duration-700" style={{ width: `${pctBarra}%` }} />
                  {[{ label: 'Meta 1', value: meta1 }, { label: 'Meta 2', value: meta2 }, { label: 'Meta 3', value: meta3 }].map(({ label, value }) => {
                    if (!(value > 0)) return null;
                    const left = Math.min((value / maxMeta) * 100, 99);
                    const atingida = totalGanhos >= value;
                    return (
                      <div key={label} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${left}%` }}
                        title={atingida ? `Você chegou à ${label}!` : `Você deveria estar aqui pra bater a ${label}`}>
                        <div className={cn('w-0.5 h-3.5 rounded-full', atingida ? 'bg-green-500' : 'bg-cw-text/40')} />
                      </div>
                    );
                  })}
                  {ritmoHojeValor > 0 && (
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" style={{ left: `${ritmoHojePct}%` }}
                      title={noRitmoHoje ? 'Você está no ritmo hoje!' : 'Você deveria estar aqui hoje pra manter o ritmo'}>
                      <span className={cn('absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-md text-[10px] font-black text-white whitespace-nowrap shadow-sm',
                        noRitmoHoje ? 'bg-blue-500' : 'bg-amber-500')}>
                        {Math.round(ritmoHojeValor)}
                      </span>
                      <div className={cn('w-1 h-5 rounded-full ring-2 ring-white', noRitmoHoje ? 'bg-blue-500' : 'bg-amber-500')} />
                    </div>
                  )}
                </div>
                <div className="relative h-3.5 mt-2.5">
                  {[{ label: 'Meta 1', value: meta1 }, { label: 'Meta 2', value: meta2 }, { label: 'Meta 3', value: meta3 }].map(({ label, value }) => {
                    if (!(value > 0)) return null;
                    const left = Math.min((value / maxMeta) * 100, 99);
                    const atingida = totalGanhos >= value;
                    return (
                      <span key={label} className={cn('absolute -translate-x-1/2 text-[9px] font-bold whitespace-nowrap',
                        atingida ? 'text-green-600' : 'text-cw-muted')} style={{ left: `${left}%` }}>
                        {label}
                      </span>
                    );
                  })}
                  {ritmoHojeValor > 0 && (
                    <span className={cn('absolute -translate-x-1/2 text-[9px] font-bold whitespace-nowrap',
                      noRitmoHoje ? 'text-blue-600' : 'text-amber-600')} style={{ left: `${ritmoHojePct}%` }}>
                      Hoje
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-[10px] text-cw-muted">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cw-text/40 shrink-0" /> Você deveria estar aqui pra bater cada meta</span>
                  {ritmoHojeValor > 0 && (
                    <span className="flex items-center gap-1">
                      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', noRitmoHoje ? 'bg-blue-500' : 'bg-amber-500')} />
                      {noRitmoHoje ? 'Você está no ritmo hoje!' : 'Você deveria estar aqui hoje pra manter o ritmo'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cards Meta 1/2/3 */}
          <div className="grid grid-cols-3 gap-3">
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

          {/* Cards Mega Meta 1/2/3 */}
          {temMega && (
            <div>
              <p className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">
                <Rocket className="h-3.5 w-3.5" /> Mega Metas (stretch)
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[{ label: 'MEGA META 1', value: mega1 }, { label: 'MEGA META 2', value: mega2 }, { label: 'MEGA META 3', value: mega3 }].map(({ label, value }, i) => {
                  const batida = value > 0 && totalGanhos >= value;
                  return (
                    <div key={i} className={cn('rounded-xl border p-3',
                      batida ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50/60'
                    )}>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">{label}</p>
                      <p className="text-xs text-cw-muted mt-0.5">{value > 0 ? `${value} fechamentos` : 'Não definida'}</p>
                      {batida ? (
                        <div className="flex items-center gap-1 mt-1.5 text-green-600 text-xs font-semibold">
                          <Check className="h-3.5 w-3.5" /> Mega meta atingida!
                        </div>
                      ) : value > 0 ? (
                        <div className="mt-1.5">
                          <p className="text-base font-black text-cw-text">{porDia(value)}<span className="text-xs text-cw-muted ml-1">/dia</span></p>
                          <p className="text-[10px] text-cw-muted">Falta <span className="text-cw-text font-semibold">{falta(value)}</span> pra mega</p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Projeção + dias */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cw-elevated rounded-xl border border-cw-border px-4 py-3 flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-cw-purple shrink-0" />
              <div>
                <p className="text-[10px] text-cw-muted uppercase font-bold tracking-wider">Projeção Final</p>
                <p className="text-base font-black text-cw-text">
                  {apiData ? <>{projecao} <span className="text-sm text-cw-muted font-normal">/ {metaReferencia || '?'}</span></> : <span className="text-sm text-cw-muted font-normal">— configure seu perfil</span>}
                </p>
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

      {/* Modal de ajuste manual */}
      {ajusteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-xs mx-4 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-cw-text">
                {ajusteModal === 'add' ? '+ Adicionar ganhos' : '− Remover ganhos'}
              </h3>
              <button onClick={() => setAjusteModal(null)} className="text-cw-muted hover:text-cw-text"><X className="h-4 w-4" /></button>
            </div>
            <div>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Quantos fechamentos?</label>
              <input
                type="number" min={1} value={ajusteQtd}
                onChange={e => setAjusteQtd(e.target.value)}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Motivo <span className="font-normal text-cw-muted normal-case">(opcional)</span></label>
              <input
                type="text" value={ajusteMot} placeholder="Ex: fechamento registrado fora do Pipedrive"
                onChange={e => setAjusteMot(e.target.value)}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple"
              />
            </div>
            <button
              onClick={() => {
                const qtd = Math.max(1, Number(ajusteQtd) || 1);
                alterarAjuste(ajusteModal === 'add' ? qtd : -qtd);
                setAjusteModal(null); setAjusteQtd('1'); setAjusteMot('');
              }}
              className="w-full py-3 rounded-xl font-bold text-sm text-white gradient-primary hover:opacity-90 transition-opacity"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}


      {/* Seção inferior — Ritmo Diário + Leads Perdidos (centralizados, sem precisar rolar) */}
      <div className="grid grid-cols-2 gap-4">

        {/* Ritmo Diário por Meta */}
        <div ref={ritmoCardRef} className="cw-card p-6 space-y-4">
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
            <div className="flex flex-col items-end gap-1.5">
              {/* Cada SDR ativa o próprio tier pra ver a conversão que se aplica a ele */}
              <div className="flex items-center gap-1 bg-cw-elevated border border-cw-border rounded-xl p-1">
                <button onClick={() => selecionarTier('1-2')}
                  className={cn('px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all',
                    meuTier === '1-2' ? 'bg-cw-purple text-white' : 'text-cw-muted hover:text-cw-text')}>
                  Tier 1/2
                </button>
                <button onClick={() => selecionarTier('3')}
                  className={cn('px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all',
                    meuTier === '3' ? 'bg-amber-500 text-white' : 'text-cw-muted hover:text-cw-text')}>
                  Tier 3
                </button>
                <button onClick={() => selecionarTier('parcerias')}
                  className={cn('px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all',
                    meuTier === 'parcerias' ? 'bg-emerald-500 text-white' : 'text-cw-muted hover:text-cw-text')}>
                  Parcerias
                </button>
              </div>
              <span className="text-xs font-bold text-cw-purple bg-cw-elevated border border-cw-border rounded-xl px-2.5 py-1.5">
                {meuTier === '3' ? CONV_TIER3 : meuTier === 'parcerias' ? CONV_PARCERIAS : CONV_TIER12}% conv.
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Meta 1', value: meta1, star: false, mega: false },
              { label: 'Meta 2', value: meta2, star: false, mega: false },
              { label: 'Meta 3', value: meta3, star: true, mega: false },
              { label: 'Mega Meta 1', value: mega1, star: false, mega: true },
              { label: 'Mega Meta 2', value: mega2, star: false, mega: true },
              { label: 'Mega Meta 3', value: mega3, star: false, mega: true },
            ].map(({ label, value, star, mega }) => {
              if (!value) return null;
              const convAtual = meuTier === '3' ? CONV_TIER3 : meuTier === 'parcerias' ? CONV_PARCERIAS : CONV_TIER12;
              const fechDia = diasRestantes > 0 ? Math.ceil(Math.max(0, value - totalGanhos) / diasRestantes) : 0;
              const agendDia = convAtual > 0 ? Math.ceil(fechDia / (convAtual / 100)) : 0;
              const batida = totalGanhos >= value;
              return (
                <div key={label} className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl border',
                  batida ? 'border-green-200 bg-green-50' : mega ? 'border-amber-200 bg-amber-50/60' : 'border-cw-border bg-cw-elevated'
                )}>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-xs font-bold uppercase tracking-wider', mega ? 'text-amber-600' : 'text-cw-purple')}>
                      {label}{star && ' ★'}{mega && ' 🚀'}
                    </p>
                    <p className="text-[11px] text-cw-muted">{value} fechamentos</p>
                    {label === 'Meta 1' && temRitmoM1 && (
                      <p className={cn('text-[10px] font-semibold mt-0.5', pctRitmoM1 < 0 ? 'text-red-500' : 'text-green-600')}>
                        {pctRitmoM1 < 0
                          ? `${Math.abs(Math.round(pctRitmoM1))}% abaixo do ritmo necessário`
                          : `${Math.round(pctRitmoM1)}% acima do ritmo necessário`}
                      </p>
                    )}
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
                        <p className="text-[8px] text-cw-muted/60">{convAtual}% conv.</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Leads Perdidos */}
        {metaData.sdrId && (
          <div className="cw-card p-6 space-y-4 flex flex-col" style={ritmoHeight ? { height: ritmoHeight } : undefined}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-cw-text">Leads Perdidos</h3>
                <p className="text-xs text-cw-muted">
                  {perdas ? `${perdas.total} negócio${perdas.total !== 1 ? 's' : ''} perdido${perdas.total !== 1 ? 's' : ''} este mês` : 'Carregando...'}
                </p>
              </div>
            </div>

            {!perdas ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <div key={i} className="h-10 rounded-xl cw-shimmer" />)}
              </div>
            ) : perdas.total === 0 ? (
              <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-2 text-center">
                <Check className="h-8 w-8 text-emerald-400" />
                <p className="text-sm font-semibold text-cw-text">Nenhuma perda registrada este mês!</p>
              </div>
            ) : (
              <div className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-1">
                {perdas.leads.map((lead, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-xl border border-cw-border bg-white shadow-sm">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-cw-text truncate">{lead.titulo}</p>
                      {(lead.nome || lead.telefone) && (
                        <p className="text-[11px] text-cw-purple font-medium truncate">
                          {lead.nome || 'Contato'}{lead.telefone ? ` - ${lead.telefone}` : ''}
                        </p>
                      )}
                      <span className="inline-block mt-1.5 max-w-full truncate text-[10px] font-medium text-red-500 bg-red-50 border border-red-200 rounded-md px-1.5 py-0.5">
                        {lead.motivo}
                      </span>
                    </div>
                    <span className="text-[11px] text-cw-muted shrink-0">
                      {new Date(lead.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Insights Rápidos */}
      <div className="cw-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-black text-cw-text">Insights Rápidos</h3>
            <p className="text-xs text-cw-muted">Informações importantes</p>
          </div>
        </div>

        <div className="space-y-2">
          {/* Como funciona a aba — sempre visível, independente de ter dados */}
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg border text-cw-purple bg-cw-purple/5 border-cw-purple/20">
            <RefreshCw className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug"><span className="font-semibold">Conectado ao Pipedrive:</span> os ganhos são atualizados em tempo real. Se algum não aparecer, sinalize a Gabi.</p>
          </div>

          {(() => {
            // Insights só fazem sentido com dados reais do Pipedrive (diasPassados > 0)
            if (!apiData || diasPassados === 0) {
              return (
                <div className="flex items-center justify-center py-8 text-cw-muted text-sm">
                  Configure seu perfil para ver os insights.
                </div>
              );
            }

            const insights: { icon: React.ReactNode; texto: string; sub: string; cor: string }[] = [];

            if (meta3 > 0 && totalGanhos >= meta3) {
              insights.push({
                icon: <Star className="h-4 w-4" />,
                texto: 'Meta 3 batida!',
                sub: 'Performance excepcional este mês',
                cor: 'text-amber-600 bg-amber-50 border-amber-200',
              });
            }

            return insights.map((ins, i) => (
              <div key={i} className={cn('flex items-start gap-2 px-3 py-2 rounded-lg border', ins.cor)}>
                <span className="shrink-0 mt-0.5">{ins.icon}</span>
                <div>
                  <p className="text-[11px] font-semibold leading-snug">{ins.texto}</p>
                  {ins.sub && <p className="text-[10px] opacity-70 mt-0.5">{ins.sub}</p>}
                </div>
              </div>
            ));
          })()}

          {/* O que é o card de Leads Perdidos — nota fixa, sempre por último */}
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg border text-red-500 bg-red-50 border-red-200">
            <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug"><span className="font-semibold">Leads Perdidos:</span> leads perdidos pelo closer após a reunião, nome, número e motivo. Use pra fazer follow-up e tentar reativar.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Wrapper: quem tem squads_lideradas (líderes, ou acesso equivalente
 *  concedido manualmente) vê o toggle Meta do Time / Minha Meta — não
 *  depende do papel do dashboard, então dá pra dar essa visão sem trocar
 *  o dashboard principal da pessoa (ex: um Representante que também
 *  acompanha o time todo).
 *  Demais usuários veem direto a visão individual.
 *  A celebração de promoção aparece no topo para quem tiver uma pendente. */
export default function MetaMes() {
  const { squadsLideradas } = useSidebarContext();
  const isLider = squadsLideradas.length > 0;
  const [vista, setVista] = useState<'time' | 'individual'>('time');

  if (!isLider) {
    return (
      <>
        <PromocaoCelebration />
        <PersonalMetaView />
      </>
    );
  }

  return (
    <div className="space-y-2">
      <PromocaoCelebration />
      {/* Toggle de visão */}
      <div className="px-6 pt-6">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-cw-elevated border border-cw-border">
          <button onClick={() => setVista('time')}
            className={cn('flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all',
              vista === 'time' ? 'bg-cw-purple text-white shadow-sm' : 'text-cw-muted hover:text-cw-text')}>
            <Users className="h-3.5 w-3.5" /> Meta do Time
          </button>
          <button onClick={() => setVista('individual')}
            className={cn('flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all',
              vista === 'individual' ? 'bg-cw-purple text-white shadow-sm' : 'text-cw-muted hover:text-cw-text')}>
            <User className="h-3.5 w-3.5" /> Minha Meta
          </button>
        </div>
      </div>

      {vista === 'time' ? <TeamMetaView squads={squadsLideradas} /> : <PersonalMetaView />}
    </div>
  );
}
