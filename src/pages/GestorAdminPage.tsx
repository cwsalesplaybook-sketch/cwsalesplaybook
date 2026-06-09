/** Painel do Gestor — metas dos SDRs, rastreamento de acesso e acompanhamento de onboarding */
import { useEffect, useState } from 'react';
import { Settings, RefreshCw, Save, X, Users, Activity, Edit3, ClipboardList, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { ONBOARDING } from '@/data/onboarding';

const SDRS_ATIVOS: Record<string, string> = {
  '1523': 'Miguel Nunes',       '1445': 'Gabrielly Oliveira', '1556': 'Thais Giurizatto',
  '1667': 'Luis Lincon',        '1686': 'Jonas Sobreira',     '1382': 'Tatyanna Freitas',
  '1708': 'Kailane Carvalho',   '1407': 'Lara Stefanny',      '1727': 'Raquel Alves',
  '1710': 'José Guilherme',     '1728': 'Fabíola Azevedo',    '1729': 'Enizia Evangelista',
  '1607': 'Caique Silva',       '1555': 'Ana Alice',          '1608': 'Ryan Felipe',
  '1730': 'Maria Gabriela',     '1707': 'Karoline Santos',    '1685': 'Dayana Ferreira',
  '1738': 'Clara Rodrigues',    '1706': 'Raissa Fonseca',     '1335': 'João Paulo',
};

// Dias únicos do checklist, ordenados
const DIAS_ONBOARDING = Array.from(new Set(ONBOARDING.map(i => i.dia))).sort((a, b) => {
  const n = (s: string) => parseInt(s.replace(/\D/g, ''));
  return n(a) - n(b);
});

// Items por dia
const ITEMS_POR_DIA: Record<string, typeof ONBOARDING> = {};
for (const dia of DIAS_ONBOARDING) {
  ITEMS_POR_DIA[dia] = ONBOARDING.filter(i => i.dia === dia);
}

interface MetaRow {
  id?: string;
  user_id?: string;
  sdr_id: string;
  meta1: number;
  meta2: number;
  meta3: number;
  ajuste: number;
  mes: string;
}

interface ActivityRow {
  user_id: string;
  user_email: string;
  user_name: string;
  last_seen: string;
  visit_count: number;
}

interface SdrProfile {
  user_id: string;
  email: string;
  apelido: string | null;
  squad: string | null;
  papel: string;
  onboarding_done: boolean;
  registered_at: string;
}

interface OnboardingProgressRow {
  user_id: string;
  checked_ids: string[];
  done_items: number;
  total_items: number;
  percent: number;
  updated_at: string;
}

function getMesAtual() {
  return new Date().toISOString().slice(0, 7);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function getDaysAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  return `${days} dias atrás`;
}

function initials(name: string) {
  return (name ?? '?').split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
}

/** Barra de progresso por dia */
function DayProgressBar({ dia, checkedIds }: { dia: string; checkedIds: string[] }) {
  const items = ITEMS_POR_DIA[dia] ?? [];
  const done = items.filter(i => checkedIds.includes(i.id)).length;
  const total = items.length;
  const complete = done === total;
  const started = done > 0;

  return (
    <div className="flex flex-col items-center gap-0.5" title={`${dia}: ${done}/${total}`}>
      <div className={cn(
        'h-6 w-6 rounded-md flex items-center justify-center text-[9px] font-black border',
        complete
          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
          : started
          ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
          : 'bg-cw-elevated border-cw-border text-cw-muted'
      )}>
        {dia.replace('Dia ', 'D')}
      </div>
      <div className={cn(
        'h-1 w-6 rounded-full',
        complete ? 'bg-emerald-500' : started ? 'bg-amber-500' : 'bg-cw-border'
      )} style={started && !complete ? { background: `linear-gradient(to right, #f59e0b ${Math.round((done/total)*100)}%, #1e1040 0%)` } : undefined} />
    </div>
  );
}

/** Card de um SDR na aba de onboarding */
function SdrOnboardingCard({ profile, progress }: {
  profile: SdrProfile;
  progress: OnboardingProgressRow | null;
}) {
  const [open, setOpen] = useState(false);
  const checkedIds = progress?.checked_ids ?? [];
  const percent = progress?.percent ?? 0;
  const done = progress?.done_items ?? 0;
  const total = ONBOARDING.length;
  const nome = profile.apelido ?? profile.email.split('@')[0];

  return (
    <div className={cn('cw-card overflow-hidden transition-all', open && 'ring-1 ring-cw-purple/30')}>
      {/* Header do card */}
      <button
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        {/* Avatar */}
        <div className="h-9 w-9 rounded-full bg-cw-purple/20 flex items-center justify-center text-[11px] font-black text-cw-purple shrink-0">
          {initials(nome)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-cw-text text-sm">{nome}</span>
            {profile.squad && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cw-purple/15 text-cw-purple-light border border-cw-purple/20">
                Squad {profile.squad}
              </span>
            )}
            {percent === 100 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                ✓ Concluído
              </span>
            )}
          </div>
          <p className="text-[11px] text-cw-muted mt-0.5">{profile.email}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-sm font-black text-cw-text">{percent}%</p>
            <p className="text-[10px] text-cw-muted">{done}/{total} itens</p>
          </div>
          {/* Mini barra */}
          <div className="w-20 h-1.5 bg-cw-border rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', percent === 100 ? 'bg-emerald-500' : 'bg-cw-purple')}
              style={{ width: `${percent}%` }}
            />
          </div>
          {open ? <ChevronDown className="h-4 w-4 text-cw-muted" /> : <ChevronRight className="h-4 w-4 text-cw-muted" />}
        </div>
      </button>

      {/* Detalhe expandido — progresso por dia */}
      {open && (
        <div className="px-4 pb-4 border-t border-cw-border/50 pt-3 space-y-3">
          {/* Grade de dias */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-cw-muted mb-2">Progresso por dia</p>
            <div className="flex flex-wrap gap-1.5">
              {DIAS_ONBOARDING.map(dia => (
                <DayProgressBar key={dia} dia={dia} checkedIds={checkedIds} />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-[10px] text-cw-muted">
                <span className="h-2 w-2 rounded-sm bg-emerald-500/70 inline-block" /> Completo
              </span>
              <span className="flex items-center gap-1 text-[10px] text-cw-muted">
                <span className="h-2 w-2 rounded-sm bg-amber-500/70 inline-block" /> Em progresso
              </span>
              <span className="flex items-center gap-1 text-[10px] text-cw-muted">
                <span className="h-2 w-2 rounded-sm bg-cw-border inline-block" /> Não iniciado
              </span>
            </div>
          </div>

          {/* Rodapé */}
          <div className="flex items-center gap-4 text-[11px] text-cw-muted border-t border-cw-border/50 pt-2">
            <span>Cadastrado: <strong className="text-cw-text">{formatDate(profile.registered_at)}</strong></span>
            {progress?.updated_at && (
              <span>Último check: <strong className="text-cw-text">{getDaysAgo(progress.updated_at)}</strong></span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GestorAdminPage() {
  const [metas, setMetas] = useState<MetaRow[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [sdrProfiles, setSdrProfiles] = useState<SdrProfile[]>([]);
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MetaRow>>({});
  const [tab, setTab] = useState<'metas' | 'acesso' | 'onboarding'>('onboarding');
  const [squadFiltro, setSquadFiltro] = useState<string>('Todos');
  const mes = getMesAtual();

  async function loadData() {
    setLoading(true);
    const [{ data: metasData }, { data: actData }, { data: profilesData }, { data: progressData }] = await Promise.all([
      supabase.from('user_metas').select('*').eq('mes', mes),
      supabase.from('user_activity' as any).select('*').order('last_seen', { ascending: false }),
      supabase.from('sdr_profiles').select('*').eq('papel', 'SDR').order('registered_at', { ascending: false }),
      supabase.from('onboarding_progress').select('*'),
    ]);
    setMetas((metasData as MetaRow[] | null) ?? []);
    setActivity((actData as ActivityRow[] | null) ?? []);
    setSdrProfiles((profilesData as SdrProfile[] | null) ?? []);
    setOnboardingProgress((progressData as OnboardingProgressRow[] | null) ?? []);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  // Monta lista mostrando todos os SDRs, com meta se existir
  const allSdrs = Object.entries(SDRS_ATIVOS).map(([sdrId, nome]) => {
    const meta = metas.find(m => m.sdr_id === sdrId);
    return { sdrId, nome, meta: meta ?? null };
  });

  async function saveMeta(sdrId: string) {
    const meta = allSdrs.find(s => s.sdrId === sdrId)?.meta;
    const payload: MetaRow = {
      sdr_id: sdrId,
      meta1: Number(editForm.meta1 ?? meta?.meta1 ?? 0),
      meta2: Number(editForm.meta2 ?? meta?.meta2 ?? 0),
      meta3: Number(editForm.meta3 ?? meta?.meta3 ?? 0),
      ajuste: Number(editForm.ajuste ?? meta?.ajuste ?? 0),
      mes,
    };

    if (meta?.id) {
      await supabase.from('user_metas').update(payload).eq('id', meta.id);
    } else {
      toast({ title: 'Atenção', description: 'A meta só pode ser criada pelo próprio SDR na primeira vez.', variant: 'default' });
      setEditingId(null);
      return;
    }
    toast({ title: 'Meta salva!', description: `Meta de ${SDRS_ATIVOS[sdrId]} atualizada.` });
    setEditingId(null);
    setEditForm({});
    loadData();
  }

  // --- Onboarding tab ---
  const squads = ['Todos', ...Array.from(new Set(sdrProfiles.map(p => p.squad ?? 'Sem squad'))).sort()];
  const filteredProfiles = squadFiltro === 'Todos'
    ? sdrProfiles
    : sdrProfiles.filter(p => (p.squad ?? 'Sem squad') === squadFiltro);

  const progressMap: Record<string, OnboardingProgressRow> = {};
  for (const row of onboardingProgress) progressMap[row.user_id] = row;

  const totalSDRs = sdrProfiles.length;
  const concluiramOnboarding = sdrProfiles.filter(p => {
    const prog = progressMap[p.user_id];
    return prog && prog.percent === 100;
  }).length;
  const mediaPercent = totalSDRs === 0 ? 0 : Math.round(
    sdrProfiles.reduce((sum, p) => sum + (progressMap[p.user_id]?.percent ?? 0), 0) / totalSDRs
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-cw-text">Painel do Gestor</h1>
            <p className="text-sm text-cw-muted mt-0.5">Metas, acesso e onboarding dos SDRs.</p>
          </div>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-cw-elevated border border-cw-border text-cw-muted hover:text-cw-text hover:bg-cw-purple/10 transition-all"
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          Atualizar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-cw-border">
        {([
          { key: 'onboarding', label: 'Onboarding SDRs', icon: ClipboardList },
          { key: 'metas',      label: 'Metas dos SDRs',  icon: Settings },
          { key: 'acesso',     label: 'Acesso',           icon: Activity },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all',
              tab === key
                ? 'border-cw-purple text-cw-purple'
                : 'border-transparent text-cw-muted hover:text-cw-text'
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {/* ───── Tab: Onboarding ───── */}
      {tab === 'onboarding' && (
        <div className="space-y-5 max-w-4xl">

          {/* Resumo estatístico */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'SDRs cadastrados', value: totalSDRs, color: 'text-cw-purple' },
              { label: 'Concluíram o onboarding', value: `${concluiramOnboarding}/${totalSDRs}`, color: 'text-emerald-400' },
              { label: 'Progresso médio', value: `${mediaPercent}%`, color: 'text-amber-400' },
            ].map(stat => (
              <div key={stat.label} className="cw-card p-4 flex flex-col gap-1">
                <p className={cn('text-2xl font-black', stat.color)}>{stat.value}</p>
                <p className="text-xs text-cw-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filtro por squad */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs font-bold uppercase tracking-wider text-cw-muted">Filtrar squad:</p>
            {squads.map(s => (
              <button
                key={s}
                onClick={() => setSquadFiltro(s)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold border transition-all',
                  squadFiltro === s
                    ? 'bg-cw-purple text-white border-cw-purple'
                    : 'bg-cw-elevated text-cw-muted border-cw-border hover:border-cw-purple/40 hover:text-cw-text'
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Lista de SDRs */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="h-6 w-6 animate-spin text-cw-purple" />
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="cw-card p-12 text-center">
              <Users className="h-10 w-10 text-cw-border mx-auto mb-3" />
              <p className="text-cw-muted text-sm font-semibold">Nenhum SDR cadastrado ainda</p>
              <p className="text-cw-muted text-xs mt-1">Os SDRs aparecerão aqui conforme concluírem o onboarding inicial do Playbook.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProfiles.map(profile => (
                <SdrOnboardingCard
                  key={profile.user_id}
                  profile={profile}
                  progress={progressMap[profile.user_id] ?? null}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ───── Tab: Metas ───── */}
      {tab === 'metas' && (
        <div className="space-y-3 max-w-4xl">
          <p className="text-xs text-cw-muted">Mês de referência: <span className="font-semibold text-cw-text">{mes}</span></p>
          <div className="cw-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cw-border">
                  <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-cw-muted">SDR</th>
                  <th className="text-center px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-cw-muted">Meta 1</th>
                  <th className="text-center px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-cw-muted">Meta 2</th>
                  <th className="text-center px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-cw-muted">Meta 3 ⭐</th>
                  <th className="text-center px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-cw-muted">Ajuste</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {allSdrs.map(({ sdrId, nome, meta }) => {
                  const isEditing = editingId === sdrId;
                  const hasMeta = meta !== null;
                  return (
                    <tr key={sdrId} className={cn('border-b border-cw-border/50 transition-colors', isEditing && 'bg-cw-purple/5')}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-cw-purple/20 flex items-center justify-center text-[10px] font-black text-cw-purple shrink-0">
                            {nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <span className={cn('font-medium', hasMeta ? 'text-cw-text' : 'text-cw-muted')}>{nome}</span>
                          {!hasMeta && <span className="text-[9px] text-cw-muted bg-cw-elevated px-1.5 py-0.5 rounded border border-cw-border">Sem meta</span>}
                        </div>
                      </td>
                      {isEditing ? (
                        <>
                          {(['meta1', 'meta2', 'meta3', 'ajuste'] as const).map(field => (
                            <td key={field} className="px-3 py-2">
                              <input
                                type="number"
                                min={0}
                                value={(editForm as any)[field] ?? (meta as any)?.[field] ?? 0}
                                onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                                className="w-20 bg-cw-bg border border-cw-purple/40 rounded-lg px-2 py-1.5 text-center text-sm text-cw-text focus:outline-none focus:border-cw-purple"
                              />
                            </td>
                          ))}
                          <td className="px-3 py-2">
                            <div className="flex gap-1">
                              <button onClick={() => saveMeta(sdrId)} className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 flex items-center justify-center">
                                <Save className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => { setEditingId(null); setEditForm({}); }} className="h-7 w-7 rounded-lg bg-cw-elevated border border-cw-border hover:bg-white/10 flex items-center justify-center">
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          {(['meta1', 'meta2', 'meta3', 'ajuste'] as const).map(field => (
                            <td key={field} className="px-3 py-3 text-center text-sm">
                              <span className={cn(hasMeta ? 'text-cw-text font-semibold' : 'text-cw-muted')}>
                                {hasMeta ? (meta as any)[field] ?? 0 : '—'}
                              </span>
                            </td>
                          ))}
                          <td className="px-3 py-3">
                            {hasMeta && (
                              <button
                                onClick={() => { setEditingId(sdrId); setEditForm({}); }}
                                className="h-7 w-7 rounded-lg bg-cw-elevated border border-cw-border text-cw-muted hover:text-cw-purple hover:bg-cw-purple/10 flex items-center justify-center transition-all"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-cw-muted">
            💡 Apenas SDRs que já configuraram suas metas podem ter os valores editados aqui.
          </p>
        </div>
      )}

      {/* ───── Tab: Acesso ───── */}
      {tab === 'acesso' && (
        <div className="space-y-3 max-w-3xl">
          {activity.length === 0 ? (
            <div className="cw-card p-10 text-center">
              <Users className="h-10 w-10 text-cw-border mx-auto mb-3" />
              <p className="text-cw-muted text-sm">Nenhum dado de acesso ainda.</p>
              <p className="text-cw-muted text-xs mt-1">Os dados aparecem conforme os SDRs acessam o sistema.</p>
            </div>
          ) : (
            <div className="cw-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cw-border">
                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-cw-muted">Usuário</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-cw-muted">Email</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-cw-muted">Último acesso</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-cw-muted">Visitas</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map(row => (
                    <tr key={row.user_id} className="border-b border-cw-border/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-cw-purple/20 flex items-center justify-center text-[10px] font-black text-cw-purple shrink-0">
                            {(row.user_name ?? '?').split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                          </div>
                          <span className="font-medium text-cw-text">{row.user_name ?? 'Usuário'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-cw-muted text-xs">{row.user_email}</td>
                      <td className="px-4 py-3 text-center">
                        <div>
                          <span className={cn(
                            'text-xs font-semibold px-2 py-0.5 rounded-full',
                            getDaysAgo(row.last_seen) === 'Hoje'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : getDaysAgo(row.last_seen) === 'Ontem'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-cw-elevated text-cw-muted border border-cw-border'
                          )}>
                            {getDaysAgo(row.last_seen)}
                          </span>
                          <p className="text-[10px] text-cw-muted mt-0.5">{formatDate(row.last_seen)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          'text-sm font-bold px-2.5 py-0.5 rounded-lg',
                          row.visit_count >= 10
                            ? 'bg-purple-500/20 text-purple-300'
                            : row.visit_count >= 3
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-cw-elevated text-cw-muted border border-cw-border'
                        )}>
                          {row.visit_count}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
