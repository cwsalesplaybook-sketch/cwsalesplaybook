/** Agenda de Reuniões — espelha as reuniões AGENDADAS (ainda não realizadas)
 *  da Gabrielly e do Hyorranes direto do Pipedrive, com os dados do lead
 *  (nome, telefone, email) e quem vai fazer a reunião. Só entram reuniões
 *  ligadas aos funis do programa de Representantes (ver api/reps-agenda.js) —
 *  reuniões internas/outros funis não aparecem aqui. */
import { useEffect, useState } from 'react';
import { Users, Clock, Phone, Mail, RefreshCw, CalendarClock, Loader2, User } from 'lucide-react';
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

const PESSOAS = [
  { label: 'Todas', nome: null },
  { label: 'Gabrielly', nome: 'Gabrielly' },
  { label: 'Hyorranes', nome: 'Hyorranes' },
] as const;

function formatarData(data: string, hora: string | null) {
  const [ano, mes, dia] = data.split('-');
  const base = `${dia}/${mes}/${ano}`;
  return hora ? `${base} às ${hora}` : base;
}

function ehHoje(data: string) {
  const hoje = new Date();
  const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  return data === hojeStr;
}

export default function AgendaReunioes() {
  const [reunioes, setReunioes] = useState<ReuniaoAgendada[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string | null>(null);

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

  const filtradas = reunioes.filter(r => !filtro || r.responsavel === filtro);

  return (
    <>
      <Header
        titulo="Agenda de Reuniões"
        subtitulo="Reuniões marcadas (Gabrielly e Hyorranes) direto do Pipedrive — atualiza automaticamente"
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
        ) : filtradas.length === 0 ? (
          <div className="cw-card p-10 flex flex-col items-center gap-2 text-center">
            <CalendarClock className="h-8 w-8 text-cw-muted/40" />
            <p className="text-sm text-cw-muted">Nenhuma reunião agendada por enquanto.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtradas.map(r => (
              <div key={r.id} className="cw-card p-4 flex items-center gap-4">
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                  ehHoje(r.data) ? 'bg-emerald-500/10' : 'bg-cw-purple/10')}>
                  <CalendarClock className={cn('h-4.5 w-4.5', ehHoje(r.data) ? 'text-emerald-500' : 'text-cw-purple-light')} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <p className="font-semibold text-sm text-cw-text truncate">{r.lead.nome || 'Lead sem nome'}</p>
                    {ehHoje(r.data) && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">HOJE</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-cw-muted">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatarData(r.data, r.hora)}</span>
                    {r.lead.telefone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {r.lead.telefone}</span>}
                    {r.lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {r.lead.email}</span>}
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {r.responsavel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
