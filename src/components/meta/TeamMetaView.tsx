/** Meta do Time — visão de liderança por squad.
 *  Mostra a meta agregada do squad (editável pelo líder) e o dashboard de
 *  cada membro (ganhos do Pipedrive × meta individual). O líder também pode
 *  ajustar a meta individual de quem já configurou o perfil.
 *  Acesso é garantido pela RLS (squads_que_lidero / lidero_o_usuario). */
import { useCallback, useEffect, useState } from 'react';
import { Settings, RefreshCw, X, Users, Target, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface TeamMeta { meta1: number; meta2: number; meta3: number; mega1: number; mega2: number; mega3: number; }
interface Membro {
  userId: string;
  apelido: string;
  sdrId: string | null;
  meta1: number; meta2: number; meta3: number;
  ajuste: number;
  ganhos: number | null;       // null = ainda carregando / sem Pipedrive
  configurado: boolean;        // tem linha em user_metas
}

const META_VAZIA: TeamMeta = { meta1: 0, meta2: 0, meta3: 0, mega1: 0, mega2: 0, mega3: 0 };

function TeamMetaModal({ meta, squad, onSave, onClose }: {
  meta: TeamMeta; squad: string; onSave: (m: TeamMeta) => void; onClose: () => void;
}) {
  const [form, setForm] = useState(meta);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-cw-text">Meta do time · {squad}</h3>
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
          <div className="border-t border-cw-border pt-4 space-y-4">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">🚀 Mega Metas (stretch)</p>
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
        <button onClick={() => onSave(form)} className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white gradient-primary hover:opacity-90 transition-opacity">
          Salvar meta do time
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

export default function TeamMetaView({ squads }: { squads: string[] }) {
  const [squad, setSquad]       = useState(squads[0] ?? '');
  const [mes, setMes]           = useState('');
  const [teamMeta, setTeamMeta] = useState<TeamMeta>(META_VAZIA);
  const [membros, setMembros]   = useState<Membro[]>([]);
  const [loading, setLoading]   = useState(false);
  const [editTime, setEditTime] = useState(false);
  const [editMembro, setEditMembro] = useState<Membro | null>(null);

  const carregar = useCallback(async (sq: string, forceRefresh = false) => {
    if (!sq) return;
    setLoading(true);
    const mesAtual = new Date().toISOString().slice(0, 7);
    setMes(mesAtual);
    try {
      // 1. Membros do squad + meta agregada (RLS libera para o líder).
      const [{ data: perfis }, { data: tMeta }] = await Promise.all([
        supabase.from('sdr_profiles').select('user_id, apelido, email').eq('squad', sq),
        supabase.from('team_metas').select('*').eq('squad', sq).eq('mes', mesAtual).maybeSingle(),
      ]);
      setTeamMeta(tMeta
        ? { meta1: tMeta.meta1, meta2: tMeta.meta2, meta3: tMeta.meta3, mega1: tMeta.mega1, mega2: tMeta.mega2, mega3: tMeta.mega3 }
        : META_VAZIA);

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

      const comGanhos = await Promise.all(base.map(async (mem) => {
        if (!mem.sdrId) return mem;
        try {
          const r = await fetch(`/api/meta?sdrId=${mem.sdrId}${bust}`);
          const j = await r.json();
          return { ...mem, ganhos: j.ok ? j.ganhos : 0 };
        } catch { return { ...mem, ganhos: 0 }; }
      }));
      setMembros(comGanhos);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { carregar(squad); }, [squad, carregar]);

  const salvarTeamMeta = async (m: TeamMeta) => {
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from('team_metas').upsert({
      squad, mes, ...m, updated_by: session?.user?.email ?? null, updated_at: new Date().toISOString(),
    }, { onConflict: 'squad,mes' });
    setTeamMeta(m);
    setEditTime(false);
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
  const metaRef = teamMeta.meta3 || teamMeta.meta2 || teamMeta.meta1;
  const pctBarra = metaRef > 0 ? Math.min(100, (totalGanhos / metaRef) * 100) : 0;
  const nomeMes = mes ? new Date(mes + '-15').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase()) : '';

  return (
    <div className="p-6 space-y-4">
      {editTime && <TeamMetaModal meta={teamMeta} squad={squad} onSave={salvarTeamMeta} onClose={() => setEditTime(false)} />}
      {editMembro && <MembroMetaModal membro={editMembro} onSave={(m) => salvarMembroMeta(editMembro, m)} onClose={() => setEditMembro(null)} />}

      {/* Seletor de squad (se lidera mais de um) */}
      {squads.length > 1 && (
        <div className="flex items-center gap-2">
          {squads.map(s => (
            <button key={s} onClick={() => setSquad(s)}
              className={cn('px-4 py-1.5 rounded-full text-sm font-bold border transition-all',
                s === squad ? 'bg-cw-purple text-white border-cw-purple' : 'bg-white text-cw-muted border-cw-border hover:border-cw-purple/40')}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Card agregado do time */}
      <div className="rounded-2xl border border-cw-border bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-cw-purple uppercase tracking-widest">
            <Target className="h-4 w-4" /> Meta do Time · {squad} {nomeMes && <span className="text-cw-muted/70 normal-case font-medium">— {nomeMes}</span>}
            <button onClick={() => carregar(squad, true)} disabled={loading} className="ml-1">
              <RefreshCw className={cn('h-3.5 w-3.5 text-cw-muted hover:text-cw-purple', loading && 'animate-spin')} />
            </button>
          </div>
          <button onClick={() => setEditTime(true)} title="Definir meta do time"
            className="h-7 w-7 rounded-lg bg-white/60 border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-all">
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-cw-purple">{totalGanhos}</span>
            <span className="text-xl text-cw-muted font-bold">/ {metaRef || '?'}</span>
          </div>
          <p className="text-sm text-cw-muted mt-1">Soma dos fechamentos do squad neste mês</p>
          {metaRef > 0 && (
            <div className="mt-3 w-full h-1.5 bg-cw-border rounded-full overflow-hidden">
              <div className="h-full bg-cw-purple rounded-full transition-all duration-700" style={{ width: `${pctBarra}%` }} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[{ label: 'META 1', value: teamMeta.meta1 }, { label: 'META 2', value: teamMeta.meta2 }, { label: 'META 3 ⭐', value: teamMeta.meta3 }].map(({ label, value }, i) => {
            const batida = value > 0 && totalGanhos >= value;
            return (
              <div key={i} className={cn('rounded-xl border p-3', batida ? 'border-green-200 bg-green-50' : 'border-cw-border bg-cw-elevated')}>
                <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">{label}</p>
                <p className="text-xs text-cw-muted mt-0.5">{value > 0 ? `${value} fechamentos` : 'Não definida'}</p>
              </div>
            );
          })}
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
