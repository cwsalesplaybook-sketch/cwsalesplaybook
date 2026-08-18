/** Agenda de Reuniões — Kanban com uma coluna pra Gabrielly e outra pro
 *  Hyorranes, cada uma organizada por DIA DA REUNIÃO (hoje primeiro), pra dar
 *  aquele check diário rápido de "o que tenho hoje e o que ele tem hoje".
 *  Dados vêm do Pipedrive (ver api/reps-agenda.js), só dos funis do programa
 *  de Representantes.
 *
 *  A aba "Total" é outra visão dos mesmos dados: quanto foi AGENDADO por mês
 *  (retroativo, últimos 60 dias) — pedido separado da Gabi, métrica diferente
 *  de "o que vai acontecer".
 *
 *  "Responsável" vem do perfil do Pipedrive que criou a reunião, que a Gabi
 *  confirmou não ser 100% confiável (ela agenda tanto no perfil dela quanto
 *  no do Hyorranes — e antes de sexta usava só o dele). Por isso cada card
 *  tem edição manual (responsável, data, hora) que sobrescreve o valor do
 *  Pipedrive só pra exibição, e dá pra cadastrar reuniões retroativas que
 *  nem estão certas no Pipedrive — tudo guardado no Supabase (tabela
 *  reps_agenda_reunioes) pra Gabrielly e Hyorranes verem a mesma correção. */
import { useEffect, useMemo, useState } from 'react';
import { Clock, Phone, Mail, RefreshCw, CalendarClock, Loader2, Check, X, Pencil, Plus, BarChart3, LayoutGrid, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import { useRepsAgendaOverrides } from '@/hooks/useRepsAgendaOverrides';

const NOME_COMPLETO: Record<string, string> = { Gabrielly: 'Gabrielly Oliveira', Hyorranes: 'Hyorranes Alencar' };

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

function addDias(data: string, delta: number) {
  const [ano, mes, dia] = data.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);
  d.setDate(d.getDate() + delta);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function tituloDiaLongo(data: string) {
  const [ano, mes, dia] = data.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/);
  return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase();
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
  const [vista, setVista] = useState<'agenda' | 'total'>('agenda');
  const [editando, setEditando] = useState<ReuniaoView | null | 'novo'>(null);
  const { rows: overrides, salvarOverride, adicionarManual, atualizar, remover } = useRepsAgendaOverrides();
  const hoje = hojeStr();
  const [dataSelecionada, setDataSelecionada] = useState(hoje);

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

  // Agenda do dia selecionado: uma lista por pessoa, só as reuniões daquele
  // dia específico — navega com as setas/date picker, como um calendário.
  const doDia = useMemo(() => {
    const porPessoa: Record<string, ReuniaoView[]> = {};
    for (const pessoa of PESSOAS) {
      porPessoa[pessoa] = todas
        .filter(r => r.responsavel === pessoa && r.data === dataSelecionada)
        .sort((a, b) => (a.hora || '99:99').localeCompare(b.hora || '99:99'));
    }
    return porPessoa;
  }, [todas, dataSelecionada]);

  const totalDia = PESSOAS.reduce((soma, p) => soma + doDia[p].length, 0);
  const responsaveisDia = PESSOAS.filter(p => doDia[p].length > 0).length;

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

  /** Detalhamento dia a dia do mês (mesma janela do totalMes) — a Gabi quer
   *  ver as datas, não só o total agregado. */
  const detalhamentoMes = useMemo(() => {
    const mesAtual = hoje.slice(0, 7);
    const doMes = todas.filter(r => r.agendadaEm.startsWith(mesAtual) && diaDaSemana(r.agendadaEm) >= 1 && diaDaSemana(r.agendadaEm) <= 5);
    const porDia = new Map<string, ReuniaoView[]>();
    for (const r of doMes) {
      if (!porDia.has(r.agendadaEm)) porDia.set(r.agendadaEm, []);
      porDia.get(r.agendadaEm)!.push(r);
    }
    return [...porDia.entries()]
      .map(([data, lista]) => ({
        data,
        total: lista.length,
        compareceram: lista.filter(r => r.presenca === 'compareceu').length,
        naoCompareceram: lista.filter(r => r.presenca === 'nao_compareceu').length,
        porPessoa: PESSOAS.map(p => lista.filter(r => r.responsavel === p).length),
      }))
      .sort((a, b) => b.data.localeCompare(a.data)); // mais recente primeiro
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
        subtitulo="Gabrielly e Hyorranes — navegue por dia ou veja o retroativo"
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
          <button
            onClick={() => setVista('agenda')}
            className={cn('flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors',
              vista === 'agenda'
                ? 'gradient-primary text-white border-transparent'
                : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text')}
          >
            <LayoutGrid className="h-3 w-3" /> Agenda
          </button>
          <button
            onClick={() => setVista('total')}
            className={cn('flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors',
              vista === 'total'
                ? 'gradient-primary text-white border-transparent'
                : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text')}
          >
            <BarChart3 className="h-3 w-3" /> Total
          </button>
        </div>

        {vista === 'agenda' && (
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold text-cw-purple uppercase tracking-widest">Agenda</p>
              <h2 className="text-2xl font-black text-cw-text capitalize mt-0.5">{tituloDiaLongo(dataSelecionada)}</h2>
              <p className="text-xs text-cw-muted mt-1">
                {totalDia} reunião(ões) · {responsaveisDia} responsável(is)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setDataSelecionada(d => addDias(d, -1))} title="Dia anterior"
                className="h-9 w-9 rounded-full border border-cw-border bg-cw-surface text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <input type="date" value={dataSelecionada} onChange={e => setDataSelecionada(e.target.value)}
                className="h-9 bg-cw-surface border border-cw-border rounded-full px-3.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple/50" />
              <button onClick={() => setDataSelecionada(d => addDias(d, 1))} title="Próximo dia"
                className="h-9 w-9 rounded-full border border-cw-border bg-cw-surface text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
              <button onClick={() => setDataSelecionada(hoje)}
                className="h-9 px-4 rounded-full gradient-primary text-white text-xs font-bold transition-opacity hover:opacity-90">
                Hoje
              </button>
            </div>
          </div>
        )}

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
        ) : vista === 'total' ? (
          <div className="cw-card p-6 space-y-5">
            <h3 className="text-sm font-black text-cw-text">Esse mês (dias úteis) — reuniões agendadas</h3>
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

            <div className="pt-2 border-t border-cw-border space-y-3">
              <h4 className="text-xs font-black text-cw-muted uppercase tracking-wider">Detalhamento por dia</h4>
              {detalhamentoMes.length === 0 ? (
                <p className="text-xs text-cw-muted">Nada agendado esse mês ainda.</p>
              ) : (
                <div className="overflow-x-auto scrollbar-cw">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-cw-muted border-b border-cw-border">
                        <th className="py-2 pr-3 font-semibold">Data</th>
                        <th className="py-2 px-3 font-semibold text-center">Agendadas</th>
                        <th className="py-2 px-3 font-semibold text-center">Gabrielly</th>
                        <th className="py-2 px-3 font-semibold text-center">Hyorranes</th>
                        <th className="py-2 px-3 font-semibold text-center">No show</th>
                        <th className="py-2 pl-3 font-semibold text-center">Não compareceu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalhamentoMes.map(d => (
                        <tr key={d.data} className={cn('border-b border-cw-border/60', d.data === hoje && 'bg-emerald-50')}>
                          <td className="py-2 pr-3 font-semibold text-cw-text whitespace-nowrap">
                            {rotuloDia(d.data)}{d.data === hoje && <span className="ml-1.5 text-[10px] font-bold text-emerald-600">HOJE</span>}
                          </td>
                          <td className="py-2 px-3 text-center text-cw-text">{d.total}</td>
                          <td className="py-2 px-3 text-center text-cw-muted">{d.porPessoa[0]}</td>
                          <td className="py-2 px-3 text-center text-cw-muted">{d.porPessoa[1]}</td>
                          <td className="py-2 px-3 text-center text-emerald-600 font-semibold">{d.compareceram}</td>
                          <td className="py-2 pl-3 text-center text-red-500 font-semibold">{d.naoCompareceram}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PESSOAS.map(pessoa => {
              const lista = doDia[pessoa] ?? [];
              return (
                <div key={pessoa} className="cw-card p-4 space-y-4">
                  <div className="flex items-center gap-3 px-1">
                    <div className="h-9 w-9 rounded-full gradient-primary text-white text-xs font-black flex items-center justify-center shrink-0">
                      {iniciais(NOME_COMPLETO[pessoa])}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-cw-text truncate">{NOME_COMPLETO[pessoa]}</p>
                      <p className="text-xs text-cw-muted">{lista.length} reunião(ões)</p>
                    </div>
                  </div>

                  {lista.length === 0 ? (
                    <div className="py-10 flex flex-col items-center gap-2 text-center">
                      <CalendarClock className="h-7 w-7 text-cw-muted/40" />
                      <p className="text-xs text-cw-muted">Nada agendado nesse dia.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {lista.map(r => (
                        <div key={r.chave} className="rounded-xl border border-cw-border bg-cw-elevated p-3.5 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1 text-xs font-bold text-cw-purple">
                              <Clock className="h-3.5 w-3.5" /> {r.hora ?? '—'}
                            </span>
                            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0',
                              r.presenca === 'compareceu' ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                                : r.presenca === 'nao_compareceu' ? 'text-red-500 bg-red-50 border-red-200'
                                : 'text-cw-purple bg-cw-purple/10 border-cw-purple/20')}>
                              {r.presenca === 'compareceu' ? 'Compareceu' : r.presenca === 'nao_compareceu' ? 'Não compareceu' : 'Agendada'}
                            </span>
                          </div>

                          <p className="font-semibold text-sm text-cw-text">{r.lead.nome || 'Lead sem nome'}</p>

                          {(r.lead.telefone || r.lead.email) && (
                            <div className="space-y-1 text-[11px] text-cw-muted">
                              {r.lead.telefone && <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 shrink-0" /> {r.lead.telefone}</span>}
                              {r.lead.email && <span className="flex items-center gap-1.5 truncate"><Mail className="h-3 w-3 shrink-0" /> {r.lead.email}</span>}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-cw-border">
                            <span className="text-[10px] text-cw-muted">Origem: Pipedrive</span>
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => setEditando(r)} title="Corrigir dados"
                                className="h-7 w-7 rounded-lg border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-colors">
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => marcarPresenca(r, 'compareceu')}
                                title="Lead compareceu"
                                className={cn('h-7 w-7 rounded-lg border flex items-center justify-center transition-colors',
                                  r.presenca === 'compareceu'
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : 'border-cw-border text-cw-muted hover:text-emerald-600 hover:border-emerald-300')}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => marcarPresenca(r, 'nao_compareceu')}
                                title="Lead não compareceu"
                                className={cn('h-7 w-7 rounded-lg border flex items-center justify-center transition-colors',
                                  r.presenca === 'nao_compareceu'
                                    ? 'bg-red-500 border-red-500 text-white'
                                    : 'border-cw-border text-cw-muted hover:text-red-500 hover:border-red-300')}
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
