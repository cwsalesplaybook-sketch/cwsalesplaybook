/** Agenda de Reuniões — espelha as reuniões (agendadas e já realizadas, últimos
 *  60 dias) da Gabrielly e do Hyorranes direto do Pipedrive, com os dados do
 *  lead (nome, telefone, email). Só entram reuniões ligadas aos funis do
 *  programa de Representantes (ver api/reps-agenda.js).
 *
 *  Organizada por DIA EM QUE FOI AGENDADA (não pelo dia da reunião em si) —
 *  é um controle retroativo de "quanto eu agendei", a pedido da Gabi.
 *
 *  "Responsável" vem do perfil do Pipedrive que criou a reunião, que a Gabi
 *  confirmou não ser 100% confiável (ela agenda tanto no perfil dela quanto
 *  no do Hyorranes — e antes de sexta usava só o dele). Por isso cada card
 *  tem edição manual (responsável, data, hora) que sobrescreve o valor do
 *  Pipedrive só pra exibição, e dá pra cadastrar reuniões retroativas que
 *  nem estão certas no Pipedrive — tudo guardado no Supabase (tabela
 *  reps_agenda_reunioes) pra Gabrielly e Hyorranes verem a mesma correção. */
import { useEffect, useMemo, useState } from 'react';
import { Users, Clock, Phone, Mail, RefreshCw, CalendarClock, Loader2, User, Check, X, Pencil, Plus, BarChart3, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import { useRepsAgendaOverrides } from '@/hooks/useRepsAgendaOverrides';

interface ReuniaoPipedrive {
  id: number;
  agendadaEm: string; // YYYY-MM-DD — dia em que a reunião foi marcada
  data: string; // YYYY-MM-DD — dia em que a reunião vai acontecer
  hora: string | null; // HH:MM
  done: boolean;
  responsavel: string;
  lead: { nome: string | null; telefone: string | null; email: string | null };
}

interface ReuniaoView {
  chave: string; // id do override (uuid) ou "pd-<id do Pipedrive>"
  pipedriveActivityId: number | null;
  overrideId: string | null; // id da linha no Supabase, se existir
  agendadaEm: string;
  data: string;
  hora: string | null;
  responsavel: string;
  presenca: 'compareceu' | 'nao_compareceu' | null;
  lead: { nome: string | null; telefone: string | null; email: string | null };
}

const PESSOAS = ['Gabrielly', 'Hyorranes'] as const;
const ABAS = [
  { label: 'Todas', valor: null },
  ...PESSOAS.map(p => ({ label: p, valor: p as string })),
] as const;

function hojeStr() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
}

function diaDaSemana(data: string) {
  const [ano, mes, dia] = data.split('-').map(Number);
  return new Date(ano, mes - 1, dia).getDay(); // 0=domingo ... 6=sábado
}

function rotuloDia(data: string) {
  const [ano, mes, dia] = data.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);
  const nome = d.toLocaleDateString('pt-BR', { weekday: 'long' });
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)}, ${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}`;
}

function formatarDataCurta(data: string) {
  const [, mes, dia] = data.split('-');
  return `${dia}/${mes}`;
}

function ReuniaoModal({ inicial, manual, onSave, onDelete, onClose }: {
  inicial: ReuniaoView | null; // null = criando nova
  manual: boolean; // true = tem campos de lead editáveis
  onSave: (v: { responsavel: string; data: string; hora: string; leadNome: string; leadTelefone: string; leadEmail: string; agendadaEm: string }) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [responsavel, setResponsavel] = useState(inicial?.responsavel ?? 'Gabrielly');
  const [data, setData] = useState(inicial?.data ?? hojeStr());
  const [hora, setHora] = useState(inicial?.hora ?? '');
  const [agendadaEm, setAgendadaEm] = useState(inicial?.agendadaEm ?? hojeStr());
  const [leadNome, setLeadNome] = useState(inicial?.lead.nome ?? '');
  const [leadTelefone, setLeadTelefone] = useState(inicial?.lead.telefone ?? '');
  const [leadEmail, setLeadEmail] = useState(inicial?.lead.email ?? '');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div className="cw-card p-5 w-full max-w-sm space-y-4 max-h-[90vh] overflow-y-auto scrollbar-cw" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="font-bold text-cw-text text-sm">
            {inicial ? `Corrigir reunião${inicial.lead.nome ? ' — ' + inicial.lead.nome : ''}` : 'Nova reunião (retroativo)'}
          </p>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text"><X className="h-4 w-4" /></button>
        </div>

        {manual && (
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-cw-muted">Nome do lead</span>
              <input value={leadNome} onChange={e => setLeadNome(e.target.value)} placeholder="Nome"
                className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium text-cw-muted">Telefone</span>
                <input value={leadTelefone} onChange={e => setLeadTelefone(e.target.value)} placeholder="—"
                  className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50" />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-cw-muted">Email</span>
                <input value={leadEmail} onChange={e => setLeadEmail(e.target.value)} placeholder="—"
                  className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-medium text-cw-muted">Agendada em (dia que você marcou)</span>
              <input type="date" value={agendadaEm} onChange={e => setAgendadaEm(e.target.value)}
                className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple/50" />
            </label>
          </div>
        )}

        <div>
          <span className="text-xs font-medium text-cw-muted">Quem vai fazer</span>
          <div className="flex gap-2 mt-1.5">
            {PESSOAS.map(p => (
              <button key={p} onClick={() => setResponsavel(p)}
                className={cn('flex-1 text-xs font-semibold py-2 rounded-xl border transition-colors',
                  responsavel === p ? 'gradient-primary text-white border-transparent' : 'border-cw-border text-cw-muted hover:text-cw-text')}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-medium text-cw-muted">Data da reunião</span>
            <input type="date" value={data} onChange={e => setData(e.target.value)}
              className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple/50" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-cw-muted">Horário</span>
            <input type="time" value={hora} onChange={e => setHora(e.target.value)}
              className="mt-1 w-full bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple/50" />
          </label>
        </div>

        <div className="flex gap-2">
          {onDelete && (
            <button onClick={() => { onDelete(); onClose(); }}
              className="h-10 w-10 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors shrink-0">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => { onSave({ responsavel, data, hora, leadNome, leadTelefone, leadEmail, agendadaEm: manual ? agendadaEm : data }); onClose(); }}
            disabled={manual && !leadNome.trim()}
            className="flex-1 gradient-primary text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-40">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AgendaReunioes() {
  const [pipedrive, setPipedrive] = useState<ReuniaoPipedrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aba, setAba] = useState<string | null>(null);
  const [editando, setEditando] = useState<ReuniaoView | null | 'novo'>(null);
  const { rows: overrides, salvarOverride, adicionarManual, atualizar, remover } = useRepsAgendaOverrides();
  const hoje = hojeStr();

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const r = await fetch('/api/reps-agenda');
      const json = await r.json();
      if (!json.ok) throw new Error(json.erro || 'Falha ao carregar a agenda');
      setPipedrive(json.reunioes);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao carregar a agenda');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const todas = useMemo<ReuniaoView[]>(() => {
    const overridesPorPd = new Map(overrides.filter(o => o.pipedriveActivityId != null).map(o => [o.pipedriveActivityId as number, o]));
    const dasPipedrive: ReuniaoView[] = pipedrive.map(r => {
      const ov = overridesPorPd.get(r.id);
      return {
        chave: `pd-${r.id}`,
        pipedriveActivityId: r.id,
        overrideId: ov?.id ?? null,
        agendadaEm: r.agendadaEm, // não é corrigível — sempre vem do Pipedrive (add_time da atividade)
        data: ov?.data ?? r.data,
        hora: ov ? ov.hora : r.hora,
        responsavel: ov?.responsavel ?? r.responsavel,
        presenca: ov?.presenca ?? null,
        lead: {
          nome: ov?.leadNome ?? r.lead.nome,
          telefone: ov?.leadTelefone ?? r.lead.telefone,
          email: ov?.leadEmail ?? r.lead.email,
        },
      };
    });
    const manuais: ReuniaoView[] = overrides.filter(o => o.pipedriveActivityId == null).map(o => ({
      chave: o.id,
      pipedriveActivityId: null,
      overrideId: o.id,
      agendadaEm: o.agendadaEm,
      data: o.data,
      hora: o.hora,
      responsavel: o.responsavel,
      presenca: o.presenca,
      lead: { nome: o.leadNome, telefone: o.leadTelefone, email: o.leadEmail },
    }));
    return [...dasPipedrive, ...manuais];
  }, [pipedrive, overrides]);

  const filtradas = useMemo(
    () => todas.filter(r => (!aba || aba === 'total' || r.responsavel === aba) && diaDaSemana(r.agendadaEm) >= 1 && diaDaSemana(r.agendadaEm) <= 5),
    [todas, aba],
  );

  const porDia = useMemo(() => {
    const grupos = new Map<string, ReuniaoView[]>();
    for (const r of filtradas) {
      if (!grupos.has(r.agendadaEm)) grupos.set(r.agendadaEm, []);
      grupos.get(r.agendadaEm)!.push(r);
    }
    return [...grupos.entries()].sort(([a], [b]) => b.localeCompare(a)); // mais recente primeiro
  }, [filtradas]);

  const totalMes = useMemo(() => {
    const mesAtual = hoje.slice(0, 7);
    const doMes = todas.filter(r => r.agendadaEm.startsWith(mesAtual) && diaDaSemana(r.agendadaEm) >= 1 && diaDaSemana(r.agendadaEm) <= 5);
    const compareceram = doMes.filter(r => r.presenca === 'compareceu').length;
    const naoCompareceram = doMes.filter(r => r.presenca === 'nao_compareceu').length;
    return {
      total: doMes.length,
      compareceram,
      naoCompareceram,
      semRetorno: doMes.length - compareceram - naoCompareceram,
      porPessoa: PESSOAS.map(p => ({ pessoa: p, total: doMes.filter(r => r.responsavel === p).length })),
    };
  }, [todas, hoje]);

  const marcarPresenca = (r: ReuniaoView, valor: 'compareceu' | 'nao_compareceu') => {
    const novoValor = r.presenca === valor ? null : valor;
    if (r.pipedriveActivityId != null) {
      salvarOverride(r.pipedriveActivityId, { responsavel: r.responsavel, data: r.data, hora: r.hora, agendadaEm: r.agendadaEm, presenca: novoValor });
    } else if (r.overrideId) {
      atualizar(r.overrideId, { presenca: novoValor });
    }
  };

  return (
    <>
      <Header
        titulo="Agenda de Reuniões"
        subtitulo="Reuniões marcadas (Gabrielly e Hyorranes), organizadas por dia de agendamento — últimos 60 dias"
        acoes={
          <div className="flex items-center gap-2">
            <button onClick={() => setEditando('novo')} title="Adicionar reunião retroativa"
              className="h-9 px-3 rounded-lg border border-cw-border bg-cw-elevated text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center gap-1.5 text-xs font-semibold transition-all">
              <Plus className="h-3.5 w-3.5" /> Adicionar
            </button>
            <button onClick={carregar} disabled={loading} title="Atualizar"
              className="h-9 w-9 rounded-lg border border-cw-border bg-cw-elevated text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-all">
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </button>
          </div>
        }
      />
      <div className="p-8 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {ABAS.map(p => (
            <button
              key={p.label}
              onClick={() => setAba(p.valor)}
              className={cn('flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors',
                aba === p.valor
                  ? 'gradient-primary text-white border-transparent'
                  : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text')}
            >
              <Users className="h-3 w-3" /> {p.label}
            </button>
          ))}
          <button
            onClick={() => setAba('total')}
            className={cn('flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors',
              aba === 'total'
                ? 'gradient-primary text-white border-transparent'
                : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text')}
          >
            <BarChart3 className="h-3 w-3" /> Total
          </button>
          {aba !== 'total' && <span className="text-xs text-cw-muted ml-1">{filtradas.length} reunião(ões)</span>}
        </div>

        {loading && pipedrive.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-cw-muted">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">Carregando agenda...</p>
          </div>
        ) : erro ? (
          <div className="cw-card p-6 text-center space-y-2">
            <p className="text-sm text-red-500 font-semibold">Não deu pra carregar a agenda</p>
            <p className="text-xs text-cw-muted">{erro}</p>
            <button onClick={carregar} className="text-xs font-semibold text-cw-purple-light hover:underline">Tentar de novo</button>
          </div>
        ) : aba === 'total' ? (
          <div className="cw-card p-6 space-y-5">
            <h3 className="text-sm font-black text-cw-text">Esse mês (dias úteis)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-cw-border bg-cw-elevated p-4">
                <p className="text-[11px] font-bold text-cw-purple uppercase tracking-wider">Agendadas</p>
                <p className="text-2xl font-black text-cw-text mt-1">{totalMes.total}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">No show</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{totalMes.compareceram}</p>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider">Não compareceu</p>
                <p className="text-2xl font-black text-red-500 mt-1">{totalMes.naoCompareceram}</p>
              </div>
              <div className="rounded-xl border border-cw-border bg-cw-elevated p-4">
                <p className="text-[11px] font-bold text-cw-muted uppercase tracking-wider">Sem retorno ainda</p>
                <p className="text-2xl font-black text-cw-text mt-1">{totalMes.semRetorno}</p>
              </div>
            </div>
            <div className="flex gap-4">
              {totalMes.porPessoa.map(p => (
                <p key={p.pessoa} className="text-xs text-cw-muted">
                  <span className="font-bold text-cw-text">{p.pessoa}:</span> {p.total} agendadas
                </p>
              ))}
            </div>
          </div>
        ) : porDia.length === 0 ? (
          <div className="cw-card p-10 flex flex-col items-center gap-2 text-center">
            <CalendarClock className="h-8 w-8 text-cw-muted/40" />
            <p className="text-sm text-cw-muted">Nenhuma reunião agendada por enquanto.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {porDia.map(([data, lista]) => (
              <div key={data} className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <h3 className={cn('text-sm font-black', data === hoje ? 'text-emerald-600' : 'text-cw-text')}>
                    {rotuloDia(data)}
                  </h3>
                  {data === hoje && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">HOJE</span>
                  )}
                  <span className="text-xs text-cw-muted">
                    — foram marcadas {lista.length} {lista.length === 1 ? 'reunião' : 'reuniões'}
                  </span>
                </div>

                {lista.map(r => (
                  <div key={r.chave} className="cw-card p-4 flex items-center gap-4">
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                      r.presenca === 'compareceu' ? 'bg-emerald-500/10' : r.presenca === 'nao_compareceu' ? 'bg-red-500/10' : 'bg-cw-purple/10')}>
                      <CalendarClock className={cn('h-4.5 w-4.5',
                        r.presenca === 'compareceu' ? 'text-emerald-500' : r.presenca === 'nao_compareceu' ? 'text-red-500' : 'text-cw-purple-light')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-cw-text truncate">{r.lead.nome || 'Lead sem nome'}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-cw-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> reunião {formatarDataCurta(r.data)}{r.hora ? ` às ${r.hora}` : ''}
                        </span>
                        {r.lead.telefone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {r.lead.telefone}</span>}
                        {r.lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {r.lead.email}</span>}
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {r.responsavel}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => setEditando(r)} title="Corrigir dados"
                        className="h-8 w-8 rounded-lg border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => marcarPresenca(r, 'compareceu')}
                        title="Lead compareceu"
                        className={cn('h-8 w-8 rounded-lg border flex items-center justify-center transition-colors',
                          r.presenca === 'compareceu'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-cw-border text-cw-muted hover:text-emerald-600 hover:border-emerald-300')}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => marcarPresenca(r, 'nao_compareceu')}
                        title="Lead não compareceu"
                        className={cn('h-8 w-8 rounded-lg border flex items-center justify-center transition-colors',
                          r.presenca === 'nao_compareceu'
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'border-cw-border text-cw-muted hover:text-red-500 hover:border-red-300')}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {editando === 'novo' && (
        <ReuniaoModal
          inicial={null}
          manual
          onSave={v => adicionarManual({ leadNome: v.leadNome.trim(), leadTelefone: v.leadTelefone.trim() || null, leadEmail: v.leadEmail.trim() || null, responsavel: v.responsavel, data: v.data, hora: v.hora || null, agendadaEm: v.agendadaEm })}
          onClose={() => setEditando(null)}
        />
      )}

      {editando && editando !== 'novo' && (
        <ReuniaoModal
          inicial={editando}
          manual={editando.pipedriveActivityId == null}
          onSave={v => {
            if (editando.pipedriveActivityId != null) {
              salvarOverride(editando.pipedriveActivityId, { responsavel: v.responsavel, data: v.data, hora: v.hora || null, agendadaEm: editando.agendadaEm, presenca: editando.presenca });
            } else if (editando.overrideId) {
              atualizar(editando.overrideId, {
                leadNome: v.leadNome.trim(), leadTelefone: v.leadTelefone.trim() || null, leadEmail: v.leadEmail.trim() || null,
                responsavel: v.responsavel, data: v.data, hora: v.hora || null, agendadaEm: v.agendadaEm,
              });
            }
          }}
          onDelete={editando.overrideId ? () => remover(editando.overrideId as string) : undefined}
          onClose={() => setEditando(null)}
        />
      )}
    </>
  );
}
