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
 *  Pipedrive só pra exibição aqui — guardada no navegador, não escreve de
 *  volta no Pipedrive. O marcador de presença (compareceu ou não) segue o
 *  mesmo esquema. */
import { useEffect, useMemo, useState } from 'react';
import { Users, Clock, Phone, Mail, RefreshCw, CalendarClock, Loader2, User, Check, X, Pencil } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';

interface Lead {
  nome: string | null;
  telefone: string | null;
  email: string | null;
}

interface ReuniaoAgendada {
  id: number;
  agendadaEm: string; // YYYY-MM-DD — dia em que a reunião foi marcada
  data: string; // YYYY-MM-DD — dia em que a reunião vai acontecer
  hora: string | null; // HH:MM
  done: boolean;
  responsavel: string;
  lead: Lead;
}

type Presenca = 'compareceu' | 'nao_compareceu';
interface Override { responsavel?: string; data?: string; hora?: string; }

const PESSOAS = ['Gabrielly', 'Hyorranes'] as const;
const FILTRO_PESSOAS = [{ label: 'Todas', nome: null }, ...PESSOAS.map(p => ({ label: p, nome: p as string }))] as const;

const STORAGE_PRESENCA = 'cw-reps-agenda-presenca';
const STORAGE_OVERRIDES = 'cw-reps-agenda-overrides';

// Correções que a Gabi já passou em chat (17/08) — semeadas uma única vez pra
// não precisar refazer no editor; só valem se ela ainda não tiver corrigido
// manualmente esse id (a edição dela sempre tem prioridade).
const SEED_OVERRIDES: Record<number, Override> = {
  1189599: { responsavel: 'Gabrielly' }, // José Carlos Martinazzo Júnior
  1189540: { responsavel: 'Gabrielly' }, // André kleber
  1189616: { responsavel: 'Gabrielly', hora: '14:00' }, // Rebeca
  1188130: { data: '2026-08-18', hora: '17:00' }, // Eric Cruz — com o Hyorranes, só data/hora erradas
};

function usePresenca() {
  const [status, setStatus] = useState<Record<number, Presenca>>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_PRESENCA) || '{}'); } catch { return {}; }
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_PRESENCA, JSON.stringify(status)); } catch { /* ignore */ }
  }, [status]);
  const marcar = (id: number, valor: Presenca) => {
    setStatus(prev => (prev[id] === valor ? { ...prev, [id]: undefined } : { ...prev, [id]: valor }) as Record<number, Presenca>);
  };
  return { status, marcar };
}

function useOverrides() {
  const [overrides, setOverrides] = useState<Record<number, Override>>(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem(STORAGE_OVERRIDES) || '{}');
      return { ...SEED_OVERRIDES, ...salvo };
    } catch { return { ...SEED_OVERRIDES }; }
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_OVERRIDES, JSON.stringify(overrides)); } catch { /* ignore */ }
  }, [overrides]);
  const salvar = (id: number, patch: Override) => {
    setOverrides(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };
  return { overrides, salvar };
}

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

function EditModal({ r, onSave, onClose }: { r: ReuniaoAgendada; onSave: (patch: Override) => void; onClose: () => void }) {
  const [responsavel, setResponsavel] = useState(r.responsavel);
  const [data, setData] = useState(r.data);
  const [hora, setHora] = useState(r.hora ?? '');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div className="cw-card p-5 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="font-bold text-cw-text text-sm">Corrigir reunião — {r.lead.nome || 'sem nome'}</p>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text"><X className="h-4 w-4" /></button>
        </div>

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

        <button
          onClick={() => { onSave({ responsavel, data, hora: hora || undefined }); onClose(); }}
          className="w-full gradient-primary text-white text-sm font-semibold py-2.5 rounded-xl">
          Salvar correção
        </button>
      </div>
    </div>
  );
}

export default function AgendaReunioes() {
  const [reunioes, setReunioes] = useState<ReuniaoAgendada[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string | null>(null);
  const [editando, setEditando] = useState<number | null>(null);
  const { status, marcar } = usePresenca();
  const { overrides, salvar } = useOverrides();
  const hoje = hojeStr();

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const r = await fetch('/api/reps-agenda');
      const json = await r.json();
      if (!json.ok) throw new Error(json.erro || 'Falha ao carregar a agenda');
      setReunioes(json.reunioes);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao carregar a agenda');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const comOverride = useMemo(() => reunioes.map(r => ({ ...r, ...overrides[r.id] })), [reunioes, overrides]);

  const filtradas = useMemo(
    () => comOverride.filter(r => (!filtro || r.responsavel === filtro) && diaDaSemana(r.agendadaEm) >= 1 && diaDaSemana(r.agendadaEm) <= 5),
    [comOverride, filtro],
  );

  const porDia = useMemo(() => {
    const grupos = new Map<string, typeof filtradas>();
    for (const r of filtradas) {
      if (!grupos.has(r.agendadaEm)) grupos.set(r.agendadaEm, []);
      grupos.get(r.agendadaEm)!.push(r);
    }
    return [...grupos.entries()].sort(([a], [b]) => b.localeCompare(a)); // mais recente primeiro
  }, [filtradas]);

  const editandoReuniao = comOverride.find(r => r.id === editando) ?? null;

  return (
    <>
      <Header
        titulo="Agenda de Reuniões"
        subtitulo="Reuniões marcadas (Gabrielly e Hyorranes), organizadas por dia de agendamento — últimos 60 dias"
        acoes={
          <button onClick={carregar} disabled={loading} title="Atualizar"
            className="h-9 w-9 rounded-lg border border-cw-border bg-cw-elevated text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-all">
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </button>
        }
      />
      <div className="p-8 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {FILTRO_PESSOAS.map(p => (
            <button
              key={p.label}
              onClick={() => setFiltro(p.nome)}
              className={cn('flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors',
                filtro === p.nome
                  ? 'gradient-primary text-white border-transparent'
                  : 'bg-cw-surface text-cw-muted border-cw-border hover:text-cw-text')}
            >
              <Users className="h-3 w-3" /> {p.label}
            </button>
          ))}
          <span className="text-xs text-cw-muted ml-1">{filtradas.length} reunião(ões)</span>
        </div>

        {loading && reunioes.length === 0 ? (
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

                {lista.map(r => {
                  const presenca = status[r.id];
                  return (
                    <div key={r.id} className="cw-card p-4 flex items-center gap-4">
                      <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                        presenca === 'compareceu' ? 'bg-emerald-500/10' : presenca === 'nao_compareceu' ? 'bg-red-500/10' : 'bg-cw-purple/10')}>
                        <CalendarClock className={cn('h-4.5 w-4.5',
                          presenca === 'compareceu' ? 'text-emerald-500' : presenca === 'nao_compareceu' ? 'text-red-500' : 'text-cw-purple-light')} />
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
                        <button onClick={() => setEditando(r.id)} title="Corrigir dados"
                          className="h-8 w-8 rounded-lg border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => marcar(r.id, 'compareceu')}
                          title="Lead compareceu"
                          className={cn('h-8 w-8 rounded-lg border flex items-center justify-center transition-colors',
                            presenca === 'compareceu'
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-cw-border text-cw-muted hover:text-emerald-600 hover:border-emerald-300')}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => marcar(r.id, 'nao_compareceu')}
                          title="Lead não compareceu"
                          className={cn('h-8 w-8 rounded-lg border flex items-center justify-center transition-colors',
                            presenca === 'nao_compareceu'
                              ? 'bg-red-500 border-red-500 text-white'
                              : 'border-cw-border text-cw-muted hover:text-red-500 hover:border-red-300')}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {editandoReuniao && (
        <EditModal r={editandoReuniao} onSave={patch => salvar(editandoReuniao.id, patch)} onClose={() => setEditando(null)} />
      )}
    </>
  );
}
