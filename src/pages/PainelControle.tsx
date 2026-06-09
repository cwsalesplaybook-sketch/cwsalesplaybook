/** Painel de Controle — guia do Modo Gestor + metas + acesso. */
import { useState, useEffect } from 'react';
import {
  ShieldCheck, BookOpen, Target, Heart, Zap, Bell, HelpCircle,
  LayoutDashboard, Sparkles, Settings, RefreshCw, Save, X,
  Users, Activity, Edit3, ChevronRight, ArrowUpDown, Type,
  Megaphone, Trophy, Calendar, Map, TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// ── Dados dos SDRs ──────────────────────────────────────────────────────────
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

function getMesAtual() { return new Date().toISOString().slice(0, 7); }
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

// ── Guia por seção ──────────────────────────────────────────────────────────
const GUIDE_SECTIONS = [
  {
    icon: LayoutDashboard,
    label: 'Sidebar (menu lateral)',
    route: 'qualquer aba',
    color: 'text-cw-purple',
    bg: 'bg-cw-purple/10',
    border: 'border-cw-purple/20',
    items: [
      { action: 'Renomear aba', how: 'Clique direto no texto do nome da aba' },
      { action: 'Trocar ícone', how: 'Clique no ícone da aba para ciclar entre os disponíveis' },
      { action: 'Reordenar', how: 'Setas ↑↓ aparecem ao passar o mouse sobre a aba' },
      { action: 'Nova aba', how: 'Botão "+ Nova aba" aparece no final da lista' },
      { action: 'Remover aba', how: 'Ícone de lixeira aparece no hover' },
      { action: 'Subtítulo da logo', how: 'Clique no texto abaixo da logo CW para editar' },
    ],
  },
  {
    icon: Sparkles,
    label: 'Comece Aqui',
    route: '/start',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
    items: [
      { action: 'Texto de boas-vindas', how: 'Clique em qualquer título ou parágrafo da hero section' },
      { action: 'Timeline "A jornada da CW"', how: 'Clique em título ou descrição de cada marco para editar; botão + para adicionar novo marco; lixeira para remover' },
      { action: '"Quem é quem no time"', how: 'Botão "+ Pessoa" para adicionar; clique em nome/cargo para editar; lixeira no hover para remover' },
      { action: 'Checklist de onboarding', how: 'Clique em qualquer item da lista para editar o texto' },
    ],
  },
  {
    icon: Target,
    label: 'Meta do Mês',
    route: '/meta',
    color: 'text-cw-purple',
    bg: 'bg-cw-purple/10',
    border: 'border-cw-purple/20',
    items: [
      { action: 'Título e descrição', how: 'Clique em qualquer texto da seção para editar inline' },
      { action: 'Valores Meta 1 / 2 / 3 por SDR', how: 'Use a aba "Metas dos SDRs" aqui no Painel de Controle' },
    ],
  },
  {
    icon: BookOpen,
    label: 'Playbook',
    route: '/playbook',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    items: [
      { action: 'Todos os textos', how: 'Clique em qualquer bloco de texto para editar diretamente' },
      { action: 'Scripts de venda', how: 'Edite cada linha do script clicando sobre ela' },
      { action: 'Cadências e metodologia', how: 'Todos os campos são editáveis inline no Modo Gestor' },
    ],
  },
  {
    icon: Zap,
    label: 'Changelog',
    route: '/changelog',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    items: [
      { action: 'Nova entrada', how: 'Botão "+ Nova entrada" no topo da página' },
      { action: 'Editar título/data/descrição', how: 'Clique em qualquer campo de cada card para editar' },
      { action: 'Reordenar', how: 'Setas ← → nos cards para mover a posição' },
      { action: 'Remover entrada', how: 'Ícone de lixeira no canto de cada card' },
    ],
  },
  {
    icon: Heart,
    label: 'Cultura',
    route: '/cultura',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
    items: [
      { action: 'Editar cards de valores', how: 'Clique em título, emoji ou descrição para editar' },
      { action: 'Adicionar card', how: 'Botão "+ Valor" aparece no Modo Gestor' },
      { action: 'Remover card', how: 'Ícone de lixeira aparece no hover do card' },
    ],
  },
  {
    icon: Bell,
    label: 'Mural de Avisos',
    route: '/mural',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
    items: [
      { action: 'Novo aviso', how: 'Botão "+ Novo aviso" no topo da página' },
      { action: 'Editar badge e texto', how: 'Clique no texto ou badge de cada aviso para editar inline' },
      { action: 'Trocar ícone', how: 'Clique no ícone do aviso para ciclar entre as opções' },
      { action: 'Reordenar', how: 'Setas ↑↓ aparecem no hover do aviso' },
      { action: 'Remover', how: 'Ícone de lixeira no hover' },
    ],
  },
  {
    icon: HelpCircle,
    label: 'FAQ',
    route: '/faq',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
    items: [
      { action: 'Nova pergunta', how: 'Botão de adicionar no Modo Gestor' },
      { action: 'Editar pergunta / resposta', how: 'Clique em qualquer texto para editar' },
      { action: 'Remover', how: 'Ícone de lixeira no hover' },
    ],
  },
  {
    icon: Trophy,
    label: 'Histórias de Sucesso',
    route: '/historias',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    items: [
      { action: 'Adicionar caso de sucesso', how: 'Botão "+ História" no Modo Gestor' },
      { action: 'Editar textos e destaques', how: 'Clique em qualquer campo do card para editar' },
      { action: 'Remover caso', how: 'Ícone de lixeira no hover' },
    ],
  },
  {
    icon: Calendar,
    label: 'Rituais / Agenda',
    route: '/agenda',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
    items: [
      { action: 'Nome e objetivo do ritual', how: 'Clique nos campos para editar inline' },
      { action: 'Frequência, horário e duração', how: 'Editáveis diretamente no Modo Gestor' },
      { action: 'Regras de ouro e critérios', how: 'Clique em cada item da lista para editar' },
    ],
  },
  {
    icon: Map,
    label: 'Onboarding',
    route: '/onboarding',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
    border: 'border-pink-400/20',
    items: [
      { action: 'Itens do checklist', how: 'Clique em qualquer texto do checklist para editar' },
      { action: 'Adicionar etapa', how: 'Botão de adicionar disponível no Modo Gestor' },
      { action: 'Reordenar e remover', how: 'Controles de ordem e lixeira no hover' },
    ],
  },
  {
    icon: TrendingUp,
    label: 'Progressão de Carreira',
    route: '/carreira',
    color: 'text-teal-400',
    bg: 'bg-teal-400/10',
    border: 'border-teal-400/20',
    items: [
      { action: 'Faixas salariais e critérios', how: 'Todos os campos de cada nível são editáveis inline' },
      { action: 'Metas de comissão', how: 'Clique nos valores para editar diretamente' },
      { action: 'Critérios de elegibilidade', how: 'Texto clicável no Modo Gestor' },
    ],
  },
];

// ── Componente principal ────────────────────────────────────────────────────
export default function PainelControle() {
  const [tab, setTab] = useState<'guia' | 'metas' | 'acesso'>('guia');
  const [metas, setMetas] = useState<MetaRow[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MetaRow>>({});
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

  useEffect(() => {
    if (tab === 'metas' || tab === 'acesso') loadData();
  }, [tab]);

  const allSdrs = Object.entries(SDRS_ATIVOS).map(([sdrId, nome]) => ({
    sdrId, nome, meta: metas.find(m => m.sdr_id === sdrId) ?? null,
  }));

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
      toast({ title: 'Meta salva!', description: `Meta de ${SDRS_ATIVOS[sdrId]} atualizada.` });
    } else {
      toast({ title: 'Atenção', description: 'A meta só pode ser criada pelo próprio SDR na primeira vez.', variant: 'default' });
    }
    setEditingId(null);
    setEditForm({});
    loadData();
  }

  return (
    <div className="p-8 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl flex items-center justify-center border"
          style={{ background: 'rgba(251,191,36,0.10)', borderColor: 'rgba(251,191,36,0.25)' }}>
          <ShieldCheck className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-cw-text">Painel de Controle</h1>
          <p className="text-sm text-cw-muted mt-0.5">Guia do Modo Gestor · Metas dos SDRs · Rastreamento de acesso</p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b border-cw-border">
        {([
          { key: 'guia',   label: 'Guia do Gestor',  icon: ShieldCheck },
          { key: 'metas',  label: 'Metas dos SDRs',  icon: Settings    },
          { key: 'acesso', label: 'Acesso do Time',  icon: Activity    },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-all',
              tab === key
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-cw-muted hover:text-cw-text'
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ABA: GUIA DO GESTOR
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'guia' && (
        <div className="space-y-8">

          {/* Bloco: como funciona */}
          <div className="cw-card p-6 border-amber-400/20" style={{ borderColor: 'rgba(251,191,36,0.20)' }}>
            <h2 className="text-base font-black text-amber-400 mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Como funciona o Modo Gestor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Ativar / Desativar',
                  desc: 'Clique em "Modo Gestor" na sidebar ou use o atalho Ctrl + Shift + E a qualquer momento.',
                },
                {
                  title: 'Lideranças com acesso direto',
                  desc: 'Pedro, Joelma, Whenna, Hyorranes, Anderson e Ana Clara ativam sem precisar de senha.',
                },
                {
                  title: 'Salva automaticamente',
                  desc: 'Toda edição é salva no Supabase em tempo real. Não precisa clicar em "Salvar".',
                },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-[13px] font-bold text-cw-text">{title}</p>
                    <p className="text-[12px] text-cw-muted leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cards por seção */}
          <div>
            <h2 className="text-base font-black text-cw-text mb-4">
              O que você pode editar em cada aba
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {GUIDE_SECTIONS.map(({ icon: Icon, label, route, color, bg, border, items }) => (
                <div key={label} className={cn('cw-card p-5 border', border)}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', bg)}>
                      <Icon className={cn('h-[18px] w-[18px]', color)} />
                    </div>
                    <div>
                      <p className="font-black text-[14px] text-cw-text leading-tight">{label}</p>
                      <span className="text-[10px] font-bold text-cw-muted tracking-wider">
                        {route}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {items.map(({ action, how }) => (
                      <div key={action} className="flex gap-2.5">
                        <ChevronRight className={cn('h-3.5 w-3.5 mt-0.5 shrink-0', color)} />
                        <div>
                          <span className="text-[12px] font-bold text-cw-text">{action}</span>
                          <span className="text-[12px] text-cw-muted"> — {how}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dica final */}
          <div className="cw-card p-5 flex items-start gap-4"
            style={{ background: 'rgba(165,67,250,0.04)', borderColor: 'rgba(165,67,250,0.15)' }}>
            <Type className="h-5 w-5 text-cw-purple mt-0.5 shrink-0" />
            <div>
              <p className="text-[13px] font-bold text-cw-text mb-1">Regra geral — textos inline</p>
              <p className="text-[12px] text-cw-muted leading-relaxed">
                Qualquer texto que apareça sublinhado ao passar o mouse pode ser editado diretamente.
                Basta clicar, digitar e pressionar Enter ou clicar fora para salvar.
                As mudanças ficam visíveis para todo o time em tempo real.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ABA: METAS DOS SDRs
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'metas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-cw-muted">
              Mês de referência: <span className="font-bold text-cw-text">{mes}</span>
            </p>
            <button onClick={loadData}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-cw-elevated border border-cw-border text-cw-muted hover:text-cw-text hover:bg-cw-purple/10 transition-all">
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
              Atualizar
            </button>
          </div>

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
                  const isEdit = editingId === sdrId;
                  const hasMeta = meta !== null;
                  return (
                    <tr key={sdrId} className={cn('border-b border-cw-border/50 transition-colors', isEdit && 'bg-cw-purple/5')}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-cw-purple/20 flex items-center justify-center text-[10px] font-black text-cw-purple shrink-0">
                            {nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                          </div>
                          <span className={cn('font-medium', hasMeta ? 'text-cw-text' : 'text-cw-muted')}>{nome}</span>
                          {!hasMeta && <span className="text-[9px] text-cw-muted bg-cw-elevated px-1.5 py-0.5 rounded border border-cw-border">Sem meta</span>}
                        </div>
                      </td>
                      {isEdit ? (
                        <>
                          {(['meta1', 'meta2', 'meta3', 'ajuste'] as const).map(f => (
                            <td key={f} className="px-3 py-2">
                              <input type="number" min={0}
                                value={(editForm as any)[f] ?? (meta as any)?.[f] ?? 0}
                                onChange={e => setEditForm(prev => ({ ...prev, [f]: e.target.value }))}
                                className="w-20 bg-cw-bg border border-cw-purple/40 rounded-lg px-2 py-1.5 text-center text-sm text-cw-text focus:outline-none focus:border-cw-purple"
                              />
                            </td>
                          ))}
                          <td className="px-3 py-2">
                            <div className="flex gap-1">
                              <button onClick={() => saveMeta(sdrId)} className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 flex items-center justify-center"><Save className="h-3.5 w-3.5" /></button>
                              <button onClick={() => { setEditingId(null); setEditForm({}); }} className="h-7 w-7 rounded-lg bg-cw-elevated border border-cw-border hover:bg-white/10 flex items-center justify-center"><X className="h-3.5 w-3.5" /></button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          {(['meta1', 'meta2', 'meta3', 'ajuste'] as const).map(f => (
                            <td key={f} className="px-3 py-3 text-center text-sm">
                              <span className={cn(hasMeta ? 'text-cw-text font-semibold' : 'text-cw-muted')}>
                                {hasMeta ? (meta as any)[f] ?? 0 : '—'}
                              </span>
                            </td>
                          ))}
                          <td className="px-3 py-3">
                            {hasMeta && (
                              <button onClick={() => { setEditingId(sdrId); setEditForm({}); }}
                                className="h-7 w-7 rounded-lg bg-cw-elevated border border-cw-border text-cw-muted hover:text-cw-purple hover:bg-cw-purple/10 flex items-center justify-center transition-all">
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

      {/* ══════════════════════════════════════════════════════════════════════
          ABA: ACESSO DO TIME
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'acesso' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={loadData}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-cw-elevated border border-cw-border text-cw-muted hover:text-cw-text hover:bg-cw-purple/10 transition-all">
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
              Atualizar
            </button>
          </div>

          {activity.length === 0 ? (
            <div className="cw-card p-10 text-center">
              <Users className="h-10 w-10 text-cw-border mx-auto mb-3" />
              <p className="text-cw-muted text-sm">Nenhum dado de acesso ainda.</p>
              <p className="text-cw-muted text-xs mt-1">Os dados aparecem conforme o time acessa o sistema.</p>
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
                        <span className={cn(
                          'text-xs font-semibold px-2 py-0.5 rounded-full',
                          getDaysAgo(row.last_seen) === 'Hoje' ? 'bg-emerald-500/20 text-emerald-400' :
                          getDaysAgo(row.last_seen) === 'Ontem' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-cw-elevated text-cw-muted border border-cw-border'
                        )}>
                          {getDaysAgo(row.last_seen)}
                        </span>
                        <p className="text-[10px] text-cw-muted mt-0.5">{formatDate(row.last_seen)}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          'text-sm font-bold px-2.5 py-0.5 rounded-lg',
                          row.visit_count >= 10 ? 'bg-purple-500/20 text-purple-300' :
                          row.visit_count >= 3  ? 'bg-blue-500/20 text-blue-300' :
                          'bg-cw-elevated text-cw-muted border border-cw-border'
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
