/** Agenda de Reuniões — espelha as reuniões AGENDADAS (ainda não realizadas)
 *  da Gabrielly e do Hyorranes direto do Pipedrive, com os dados do lead
 *  (nome, telefone, email) e quem vai fazer a reunião. Só entram reuniões
 *  ligadas aos funis do programa de Representantes (ver api/reps-agenda.js) —
 *  reuniões internas/outros funis não aparecem aqui.
 *
 *  "Responsável" reflete quem estava logado no Pipedrive quando a reunião foi
 *  marcada — a Gabi confirmou que isso varia (ela agenda tanto no perfil dela
 *  quanto no do Hyorranes) e não é 100% confiável; o dado que realmente conta
 *  pra métrica (Meta do Mês) é o campo "[REP] Responsável pela reunião", que só
 *  existe a partir do ganho — antes disso o Pipedrive não tem outro sinal.
 *
 *  Organizada por dia (segunda a sexta), com contagem por dia, e um marcador
 *  de presença (compareceu / não compareceu) por reunião — guardado só neste
 *  navegador (localStorage), é uma lista de controle pessoal, não volta pro
 *  Pipedrive. */
import { useEffect, useMemo, useState } from 'react';
import { Users, Clock, Phone, Mail, RefreshCw, CalendarClock, Loader2, User, Check, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';

interface Lead {
  nome: string | null;
  telefone: string | null;
  email: string | null;
}

interface ReuniaoAgendada {
  id: number;
  data: string; // YYYY-MM-DD
  hora: string | null; // HH:MM
  responsavel: string;
  lead: Lead;
}

type Presenca = 'compareceu' | 'nao_compareceu';

const PESSOAS = [
  { label: 'Todas', nome: null },
  { label: 'Gabrielly', nome: 'Gabrielly' },
  { label: 'Hyorranes', nome: 'Hyorranes' },
] as const;

const STORAGE_KEY = 'cw-reps-agenda-presenca';

function usePresenca() {
  const [status, setStatus] = useState<Record<number, Presenca>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(status)); } catch { /* ignore */ }
  }, [status]);

  const marcar = (id: number, valor: Presenca) => {
    setStatus(prev => (prev[id] === valor ? { ...prev, [id]: undefined } : { ...prev, [id]: valor }) as Record<number, Presenca>);
  };

  return { status, marcar };
}

function formatarHora(hora: string | null) {
  return hora ? `às ${hora}` : '(sem horário)';
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

export default function AgendaReunioes() {
  const [reunioes, setReunioes] = useState<ReuniaoAgendada[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string | null>(null);
  const { status, marcar } = usePresenca();
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

  const filtradas = useMemo(
    () => reunioes.filter(r => (!filtro || r.responsavel === filtro) && diaDaSemana(r.data) >= 1 && diaDaSemana(r.data) <= 5),
    [reunioes, filtro],
  );

  const porDia = useMemo(() => {
    const grupos = new Map<string, ReuniaoAgendada[]>();
    for (const r of filtradas) {
      if (!grupos.has(r.data)) grupos.set(r.data, []);
      grupos.get(r.data)!.push(r);
    }
    return [...grupos.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtradas]);

  return (
    <>
      <Header
        titulo="Agenda de Reuniões"
        subtitulo="Reuniões marcadas (Gabrielly e Hyorranes) direto do Pipedrive — segunda a sexta, atualiza automaticamente"
        acoes={
          <button onClick={carregar} disabled={loading} title="Atualizar"
            className="h-9 w-9 rounded-lg border border-cw-border bg-cw-elevated text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-all">
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </button>
        }
      />
      <div className="p-8 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {PESSOAS.map(p => (
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
          <span className="text-xs text-cw-muted ml-1">{filtradas.length} reunião(ões) agendada(s)</span>
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
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatarHora(r.hora)}</span>
                          {r.lead.telefone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {r.lead.telefone}</span>}
                          {r.lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {r.lead.email}</span>}
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {r.responsavel}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
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
    </>
  );
}
