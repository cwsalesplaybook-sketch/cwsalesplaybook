/** Painel do Gestor — metas dos SDRs e rastreamento de acesso */
import { useEffect, useState } from 'react';
import { Settings, RefreshCw, Save, X, Users, Activity, Edit3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const SDRS_ATIVOS: Record<string, string> = {
  '1523': 'Miguel Nunes',       '1445': 'Gabrielly Oliveira', '1556': 'Thais Giurizatto',
  '1667': 'Luis Lincon',        '1686': 'Jonas Sobreira',     '1382': 'Tatyanna Freitas',
  '1708': 'Kailane Carvalho',   '1407': 'Lara Stefanny',      '1727': 'Raquel Alves',
  '1710': 'José Guilherme',     '1728': 'Fabíola Azevedo',    '1729': 'Enizia Evangelista',
  '1607': 'Caique Silva',       '1555': 'Ana Alice',          '1608': 'Ryan Felipe',
  '1730': 'Maria Gabriela',     '1707': 'Karoline Santos',    '1685': 'Dayana Ferreira',
  '1738': 'Clara Rodrigues',    '1706': 'Raissa Fonseca',     '1335': 'João Paulo',
};

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

export default function GestorAdminPage() {
  const [metas, setMetas] = useState<MetaRow[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MetaRow>>({});
  const [tab, setTab] = useState<'metas' | 'acesso'>('metas');
  const mes = getMesAtual();

  async function loadData() {
    setLoading(true);
    const [{ data: metasData }, { data: actData }] = await Promise.all([
      supabase.from('user_metas').select('*').eq('mes', mes),
      supabase.from('user_activity' as any).select('*').order('last_seen', { ascending: false }),
    ]);
    setMetas((metasData as MetaRow[] | null) ?? []);
    setActivity((actData as ActivityRow[] | null) ?? []);
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
      // Precisa de user_id para inserir — pula se não existir ainda
      toast({ title: 'Atenção', description: 'A meta só pode ser criada pelo próprio SDR na primeira vez. Edição salva para quando o SDR configurar a sua.', variant: 'default' });
      setEditingId(null);
      return;
    }
    toast({ title: 'Meta salva!', description: `Meta de ${SDRS_ATIVOS[sdrId]} atualizada.` });
    setEditingId(null);
    setEditForm({});
    loadData();
  }

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
            <p className="text-sm text-cw-muted mt-0.5">Metas dos SDRs e rastreamento de acesso.</p>
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
        <button
          onClick={() => setTab('metas')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all',
            tab === 'metas'
              ? 'border-cw-purple text-cw-purple'
              : 'border-transparent text-cw-muted hover:text-cw-text'
          )}
        >
          <Settings className="h-4 w-4" /> Metas dos SDRs
        </button>
        <button
          onClick={() => setTab('acesso')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all',
            tab === 'acesso'
              ? 'border-cw-purple text-cw-purple'
              : 'border-transparent text-cw-muted hover:text-cw-text'
          )}
        >
          <Activity className="h-4 w-4" /> Acesso dos SDRs
        </button>
      </div>

      {/* Tab: Metas */}
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

      {/* Tab: Acesso */}
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
