/** Meta do Time — visão de liderança por squad.
 *  Bloco único com a meta agregada do squad (fechamentos, meta única) e os
 *  KPIs do squad (clientes, clientes/dia, agendamentos/dia, LTR, no-show),
 *  todos editáveis pelo líder num só modal, e o dashboard de cada membro
 *  (ganhos do Pipedrive × meta individual). O líder também pode ajustar a
 *  meta individual de quem já configurou o perfil.
 *  Acesso é garantido pela RLS (squads_que_lidero / lidero_o_usuario).
 *  Squads trabalham com uma única meta de fechamentos (sem Meta 2/3 nem
 *  Mega Metas) — o líder sempre define o valor completo do mês.
 *  Agendamentos hoje tem dado real vindo de /api/meetime-agendamentos: conta
 *  todo Ganho no Meetime hoje (cadências Standard, foco Inbound
 *  Ativo/Passivo — mesmo filtro do dashboard de metas do Meetime), qualquer
 *  canal (vídeo chamada, WhatsApp, ligação). LTR e no-show ainda não têm
 *  dado real integrado — mostram só a meta. */
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Settings, RefreshCw, X, Users, Target, TrendingUp, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface TeamMeta { meta1: number; }
interface SquadKpis { clientes: number; clientesDia: number; agendamentosDia: number; ltr: number; noShow: number; }
interface Membro {
  userId: string;
  apelido: string;
  sdrId: string | null;
  meta1: number; meta2: number; meta3: number;
  ajuste: number;
  ganhos: number | null;       // null = ainda carregando / sem Pipedrive
  configurado: boolean;        // tem linha em user_metas
}

const META_VAZIA: TeamMeta = { meta1: 0 };
const KPIS_VAZIO: SquadKpis = { clientes: 0, clientesDia: 0, agendamentosDia: 0, ltr: 0, noShow: 0 };

function MetaSquadModal({ meta, kpis, squad, onSave, onClose }: {
  meta: TeamMeta; kpis: SquadKpis; squad: string;
  onSave: (m: TeamMeta, k: SquadKpis) => void; onClose: () => void;
}) {
  const [formMeta, setFormMeta] = useState(meta);
  const [formKpis, setFormKpis] = useState(kpis);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-cw-text">Meta do squad · {squad}</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-bold text-cw-purple uppercase tracking-wider">Fechamentos</p>
          <div>
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Meta</label>
            <input type="number" min={0} value={formMeta.meta1}
              onChange={e => setFormMeta(f => ({ ...f, meta1: Number(e.target.value) }))}
              className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple" placeholder="0" />
          </div>

          <div className="border-t border-cw-border pt-4 space-y-4">
            <p className="text-xs font-bold text-cw-purple uppercase tracking-wider">KPIs do squad</p>
            <div>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Meta de clientes</label>
              <input type="number" min={0} value={formKpis.clientes}
                onChange={e => setFormKpis(f => ({ ...f, clientes: Number(e.target.value) }))}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple" placeholder="0" />
            </div>
            <div>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Meta de clientes diário</label>
              <input type="number" min={0} value={formKpis.clientesDia}
                onChange={e => setFormKpis(f => ({ ...f, clientesDia: Number(e.target.value) }))}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple" placeholder="0" />
            </div>
            <div>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Meta de agendamentos diário</label>
              <input type="number" min={0} value={formKpis.agendamentosDia}
                onChange={e => setFormKpis(f => ({ ...f, agendamentosDia: Number(e.target.value) }))}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple" placeholder="0" />
            </div>
            <div>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Meta de LTR (%)</label>
              <input type="number" min={0} max={100} step="0.1" value={formKpis.ltr}
                onChange={e => setFormKpis(f => ({ ...f, ltr: Number(e.target.value) }))}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple" placeholder="0" />
            </div>
            <div>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Meta de no-show (%)</label>
              <input type="number" min={0} max={100} step="0.1" value={formKpis.noShow}
                onChange={e => setFormKpis(f => ({ ...f, noShow: Number(e.target.value) }))}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple" placeholder="0" />
            </div>
          </div>
        </div>
        <button onClick={() => onSave(formMeta, formKpis)} className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white gradient-primary hover:opacity-90 transition-opacity">
          Salvar meta do squad
        </button>
      </div>
    </div>
  );
}

function MembroMetaModal({ membro, onSave, onClose }: {
  membro: Membro; onSave: (m: { meta1: number; meta2: number; meta3: number }) => void; onClose: () => void;
}) {
  const [form, setForm] = useState({ meta1: membro.meta1, meta2: membro.meta2, meta3: membro.meta3 });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-xs mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-cw-text">Meta de {membro.apelido}</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n}>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Meta {n} {n === 3 && '⭐'}</label>
              <input type="number" min={0} value={(form as any)[`meta${n}`]}
                onChange={e => setForm(f => ({ ...f, [`meta${n}`]: Number(e.target.value) }))}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple" placeholder="0" />
            </div>
          ))}
        </div>
        <button onClick={() => onSave(form)} className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white gradient-primary hover:opacity-90 transition-opacity">
          Salvar meta individual
        </button>
      </div>
    </div>
  );
}

export default function TeamMetaView({ squads, toggle }: { squads: string[]; toggle?: ReactNode }) {
  const [squad, setSquad]       = useState(squads[0] ?? '');
  const [mes, setMes]           = useState('');
  const [teamMeta, setTeamMeta] = useState<TeamMeta>(META_VAZIA);
  const [squadKpis, setSquadKpis] = useState<SquadKpis>(KPIS_VAZIO);
  const [diasPassados, setDiasPassados] = useState(0);
  const [agendamentosHoje, setAgendamentosHoje] = useState<number | null>(null);
  const [membros, setMembros]   = useState<Membro[]>([]);
  const [loading, setLoading]   = useState(false);
  const [editMeta, setEditMeta] = useState(false);
  const [editMembro, setEditMembro] = useState<Membro | null>(null);

  const carregar = useCallback(async (sq: string, forceRefresh = false) => {
    if (!sq) return;
    setLoading(true);
    const mesAtual = new Date().toISOString().slice(0, 7);
    setMes(mesAtual);
    try {
      // 1. Membros do squad + meta agregada + KPIs do squad (RLS libera para o líder).
      const [{ data: perfis }, { data: tMeta }, { data: kpis }] = await Promise.all([
        supabase.from('sdr_profiles').select('user_id, apelido, email').eq('squad', sq),
        supabase.from('team_metas').select('*').eq('squad', sq).eq('mes', mesAtual).maybeSingle(),
        supabase.from('squad_kpis').select('*').eq('squad', sq).eq('mes', mesAtual).maybeSingle(),
      ]);
      setTeamMeta(tMeta ? { meta1: tMeta.meta1 } : META_VAZIA);
      setSquadKpis(kpis
        ? { clientes: kpis.meta_clientes, clientesDia: kpis.meta_clientes_dia, agendamentosDia: kpis.meta_agendamentos_dia ?? 0, ltr: Number(kpis.meta_ltr), noShow: Number(kpis.meta_no_show) }
        : KPIS_VAZIO);

      const lista = perfis ?? [];
      const ids = lista.map(p => p.user_id);

      // 2. Metas individuais dos membros.
      const { data: metas } = ids.length
        ? await supabase.from('user_metas').select('*').in('user_id', ids).eq('mes', mesAtual)
        : { data: [] as any[] };
      const metaPorUser = new Map((metas ?? []).map(m => [m.user_id, m]));

      // 3. Monta os membros e busca os ganhos no Pipedrive (em paralelo).
      const bust = forceRefresh ? `&_t=${Date.now()}` : '';
      const base: Membro[] = lista.map(p => {
        const m = metaPorUser.get(p.user_id);
        return {
          userId: p.user_id,
          apelido: p.apelido || p.email || 'Sem nome',
          sdrId: m?.sdr_id ?? null,
          meta1: m?.meta1 ?? 0, meta2: m?.meta2 ?? 0, meta3: m?.meta3 ?? 0,
          ajuste: m?.ajuste ?? 0,
          ganhos: m?.sdr_id ? null : 0,
          configurado: !!m,
        };
      });
      setMembros(base);

      // diasPassados vem igual em toda resposta do /api/meta nesse mês —
      // guarda a primeira que chegar pra calcular o ritmo de clientes/dia.
      let diasPassadosCapturado = 0;
      const [comGanhos] = await Promise.all([
        Promise.all(base.map(async (mem) => {
          if (!mem.sdrId) return mem;
          try {
            const r = await fetch(`/api/meta?sdrId=${mem.sdrId}${bust}`);
            const j = await r.json();
            if (j.ok && !diasPassadosCapturado) diasPassadosCapturado = j.diasPassados || 0;
            return { ...mem, ganhos: j.ok ? j.ganhos : 0 };
          } catch { return { ...mem, ganhos: 0 }; }
        })),
        (async () => {
          try {
            const r = await fetch(`/api/meetime-agendamentos?squad=${encodeURIComponent(sq)}${bust}`);
            const j = await r.json();
            setAgendamentosHoje(j.ok ? j.agendamentosHoje : null);
          } catch { setAgendamentosHoje(null); }
        })(),
      ]);
      setMembros(comGanhos);
      setDiasPassados(diasPassadosCapturado);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { carregar(squad); }, [squad, carregar]);

  const salvarMetaSquad = async (m: TeamMeta, k: SquadKpis) => {
    const { data: { session } } = await supabase.auth.getSession();
    const email = session?.user?.email ?? null;
    const agora = new Date().toISOString();
    await Promise.all([
      supabase.from('team_metas').upsert({
        squad, mes, meta1: m.meta1, meta2: 0, meta3: 0, mega1: 0, mega2: 0, mega3: 0,
        updated_by: email, updated_at: agora,
      }, { onConflict: 'squad,mes' }),
      supabase.from('squad_kpis').upsert({
        squad, mes, meta_clientes: k.clientes, meta_clientes_dia: k.clientesDia,
        meta_agendamentos_dia: k.agendamentosDia,
        meta_ltr: k.ltr, meta_no_show: k.noShow, updated_by: email, updated_at: agora,
      }, { onConflict: 'squad,mes' }),
    ]);
    setTeamMeta(m);
    setSquadKpis(k);
    setEditMeta(false);
  };

  const salvarMembroMeta = async (mem: Membro, novo: { meta1: number; meta2: number; meta3: number }) => {
    if (!mem.sdrId) return;
    await supabase.from('user_metas').upsert({
      user_id: mem.userId, sdr_id: mem.sdrId, mes,
      meta1: novo.meta1, meta2: novo.meta2, meta3: novo.meta3, updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,mes' });
    setMembros(prev => prev.map(x => x.userId === mem.userId ? { ...x, ...novo } : x));
    setEditMembro(null);
  };

  const totalGanhos = membros.reduce((s, m) => s + (m.ganhos ?? 0) + m.ajuste, 0);
  const metaRef = teamMeta.meta1;
  const pctBarra = metaRef > 0 ? Math.min(100, (totalGanhos / metaRef) * 100) : 0;
  const nomeMes = mes ? new Date(mes + '-15').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase()) : '';
  const temKpis = squadKpis.clientes > 0 || squadKpis.clientesDia > 0 || squadKpis.agendamentosDia > 0 || squadKpis.ltr > 0 || squadKpis.noShow > 0;
  // Ritmo real de clientes/dia = fechamentos acumulados ÷ dias úteis já passados no mês.
  const clientesDiaAtual = diasPassados > 0 ? Math.round(totalGanhos / diasPassados) : null;

  return (
    <div className="p-6 space-y-4">
      {editMeta && <MetaSquadModal meta={teamMeta} kpis={squadKpis} squad={squad} onSave={salvarMetaSquad} onClose={() => setEditMeta(false)} />}
      {editMembro && <MembroMetaModal membro={editMembro} onSave={(m) => salvarMembroMeta(editMembro, m)} onClose={() => setEditMembro(null)} />}

      {/* Bloco único: meta do squad + KPIs */}
      <div className="rounded-2xl border border-cw-border bg-white shadow-sm p-6 space-y-5">
        {toggle}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-cw-purple uppercase tracking-widest">
            <Target className="h-4 w-4" /> Meta do Squad · {squad} {nomeMes && <span className="text-cw-muted/70 normal-case font-medium">— {nomeMes}</span>}
            <button onClick={() => carregar(squad, true)} disabled={loading} className="ml-1">
              <RefreshCw className={cn('h-3.5 w-3.5 text-cw-muted hover:text-cw-purple', loading && 'animate-spin')} />
            </button>
          </div>
          <button onClick={() => setEditMeta(true)} title="Definir meta do squad"
            className="h-7 w-7 rounded-lg bg-white/60 border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-all">
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-cw-purple">{totalGanhos}</span>
              <span className="text-xl text-cw-muted font-bold">/ {metaRef || '?'}</span>
            </div>
            {/* Seletor de squad (se lidera mais de um) — troca a visão sem sair do bloco */}
            {squads.length > 1 && (
              <div className="flex items-center gap-1.5 shrink-0 mt-1.5">
                {squads.map(s => (
                  <button key={s} onClick={() => setSquad(s)}
                    className={cn('px-3 py-1 rounded-full text-xs font-bold border transition-all',
                      s === squad ? 'bg-cw-purple text-white border-cw-purple' : 'bg-white text-cw-muted border-cw-border hover:border-cw-purple/40')}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-sm text-cw-muted mt-1">Soma dos fechamentos do squad neste mês</p>
          {metaRef > 0 && (
            <div className="mt-3 w-full h-1.5 bg-cw-border rounded-full overflow-hidden">
              <div className="h-full bg-cw-purple rounded-full transition-all duration-700" style={{ width: `${pctBarra}%` }} />
            </div>
          )}
        </div>

        <div className={cn('rounded-xl border p-3', metaRef > 0 && totalGanhos >= metaRef ? 'border-green-200 bg-green-50' : 'border-cw-border bg-cw-elevated')}>
          <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">META</p>
          <p className="text-xs text-cw-muted mt-0.5">{metaRef > 0 ? `${metaRef} fechamentos` : 'Não definida'}</p>
        </div>

        {/* KPIs do squad */}
        <div className="border-t border-cw-border pt-5">
          <p className="flex items-center gap-1.5 text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">
            <BarChart3 className="h-3.5 w-3.5" /> KPIs do Squad
          </p>
          {temKpis ? (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="rounded-xl border border-cw-border bg-cw-elevated p-3">
                <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">Clientes</p>
                <p className="text-lg font-black text-cw-text mt-0.5">
                  {totalGanhos}<span className="text-xs text-cw-muted font-normal"> / {squadKpis.clientes || '?'}</span>
                </p>
              </div>
              <div className="rounded-xl border border-cw-border bg-cw-elevated p-3">
                <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">Clientes/dia</p>
                <p className="text-lg font-black text-cw-text mt-0.5">
                  {clientesDiaAtual === null ? '…' : clientesDiaAtual}<span className="text-xs text-cw-muted font-normal"> / {squadKpis.clientesDia || '?'}</span>
                </p>
              </div>
              <div className="rounded-xl border border-cw-border bg-cw-elevated p-3">
                <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">Agendamentos hoje</p>
                <p className="text-lg font-black text-cw-text mt-0.5">
                  {agendamentosHoje === null ? '…' : agendamentosHoje}
                </p>
                <p className="text-[9px] text-cw-muted/70 mt-0.5">todos os canais, via Meetime</p>
              </div>
              <div className="rounded-xl border border-cw-border bg-cw-elevated p-3">
                <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">LTR</p>
                <p className="text-lg font-black text-cw-text mt-0.5">{squadKpis.ltr || '?'}%</p>
                <p className="text-[9px] text-cw-muted/70 mt-0.5">meta — sem dado real ainda</p>
              </div>
              <div className="rounded-xl border border-cw-border bg-cw-elevated p-3">
                <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">No-show</p>
                <p className="text-lg font-black text-cw-text mt-0.5">{squadKpis.noShow || '?'}%</p>
                <p className="text-[9px] text-cw-muted/70 mt-0.5">meta — sem dado real ainda</p>
              </div>
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-cw-muted">KPIs ainda não definidos pra este squad este mês.</p>
          )}
        </div>
      </div>

      {/* Lista de membros */}
      <div className="cw-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cw-purple/10 flex items-center justify-center"><Users className="h-4 w-4 text-cw-purple" /></div>
          <div>
            <h3 className="text-base font-black text-cw-text">Membros do {squad}</h3>
            <p className="text-xs text-cw-muted">{membros.length} {membros.length === 1 ? 'pessoa' : 'pessoas'} no time</p>
          </div>
        </div>

        {loading && membros.length === 0 ? (
          <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl cw-shimmer" />)}</div>
        ) : membros.length === 0 ? (
          <div className="py-8 text-center text-sm text-cw-muted">
            Ninguém com squad <span className="font-bold text-cw-text">{squad}</span> ainda. Os membros aparecem aqui assim que escolherem esse squad no primeiro acesso.
          </div>
        ) : (
          <div className="space-y-2">
            {membros.map(mem => {
              const total = (mem.ganhos ?? 0) + mem.ajuste;
              const metaM = mem.meta1;
              const batida = metaM > 0 && total >= metaM;
              const pct = metaM > 0 ? Math.min(100, (total / metaM) * 100) : 0;
              return (
                <div key={mem.userId} className="flex items-center gap-4 px-4 py-3 rounded-xl border border-cw-border bg-cw-elevated">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-cw-text truncate">{mem.apelido}</p>
                      {!mem.configurado && <span className="text-[10px] text-amber-500 font-semibold">sem config</span>}
                    </div>
                    {metaM > 0 && (
                      <div className="mt-1.5 h-1.5 w-full max-w-[180px] bg-cw-border rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', batida ? 'bg-green-500' : 'bg-cw-purple')} style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-cw-text leading-none">
                      {mem.ganhos === null ? '…' : total}
                      <span className="text-xs text-cw-muted font-normal"> / {metaM || '?'}</span>
                    </p>
                    <p className="text-[10px] text-cw-muted mt-0.5">fechamentos</p>
                  </div>
                  {mem.sdrId && (
                    <button onClick={() => setEditMembro(mem)} title="Definir meta deste membro"
                      className="h-7 w-7 rounded-lg border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-all shrink-0">
                      <Settings className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <p className="flex items-center gap-1.5 text-[11px] text-cw-muted/70 pt-1">
          <TrendingUp className="h-3 w-3" /> Ganhos vêm do Pipedrive; cada SDR ainda define a própria meta no perfil — aqui você acompanha e pode ajustar.
        </p>
      </div>
    </div>
  );
}
