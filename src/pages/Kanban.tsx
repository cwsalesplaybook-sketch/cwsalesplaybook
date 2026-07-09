/** Kanban de Reuniões — board pessoal do SDR: cada card é uma reunião marcada,
 *  movida manualmente entre etapas até virar cliente (ou não).
 *  Acesso opcional via ícone na Meta do Mês (não fica no menu principal).
 *  Hoje é 100% manual; a leitura automática do Google Calendar de cada SDR
 *  e a sincronização por etapa com o Pipedrive ficam para uma fase futura. */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, Trash2, Clock, CalendarClock, RefreshCw, LayoutGrid, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ETAPAS, ETAPA_LABEL, useKanbanReunioes, type Etapa, type KanbanCard } from '@/hooks/useKanbanReunioes';
import { useGoogleCalendarConnection } from '@/hooks/useGoogleCalendarConnection';

const COLUNA_COR: Record<Etapa, string> = {
  reuniao_marcada: 'border-t-cw-purple',
  confirmacao_1: 'border-t-cw-purple',
  confirmacao_2: 'border-t-cw-purple',
  no_show: 'border-t-red-400',
  em_atendimento: 'border-t-amber-400',
  link_pagamento: 'border-t-amber-400',
  contratou: 'border-t-green-500',
  nao_contratou: 'border-t-red-400',
};

const ETAPA_BADGE_COR: Record<Etapa, string> = {
  reuniao_marcada: 'bg-cw-purple/10 text-cw-purple',
  confirmacao_1: 'bg-cw-purple/10 text-cw-purple',
  confirmacao_2: 'bg-cw-purple/10 text-cw-purple',
  no_show: 'bg-red-50 text-red-500',
  em_atendimento: 'bg-amber-50 text-amber-600',
  link_pagamento: 'bg-amber-50 text-amber-600',
  contratou: 'bg-green-50 text-green-600',
  nao_contratou: 'bg-red-50 text-red-500',
};

/** Chave 'YYYY-MM-DD' local (não UTC) pra agrupar cards por dia da agenda. */
function chaveDia(iso: string | null): string {
  if (!iso) return 'sem-data';
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function labelDia(chave: string): string {
  if (chave === 'sem-data') return 'Sem data marcada';
  const hoje = new Date();
  const amanha = new Date(hoje); amanha.setDate(hoje.getDate() + 1);
  if (chave === chaveDia(hoje.toISOString())) return 'Hoje';
  if (chave === chaveDia(amanha.toISOString())) return 'Amanhã';
  const [ano, mes, dia] = chave.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  const texto = data.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatHorario(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function NovaReuniaoModal({ onSave, onClose }: {
  onSave: (contato: string, horario: string | null, notas: string) => void;
  onClose: () => void;
}) {
  const [contato, setContato] = useState('');
  const [horario, setHorario] = useState('');
  const [notas, setNotas] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-cw-text">Nova reunião</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Contato / Lead</label>
            <input
              value={contato} onChange={(e) => setContato(e.target.value)}
              placeholder="Nome do lead ou empresa"
              className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Horário da reunião</label>
            <input
              type="datetime-local" value={horario} onChange={(e) => setHorario(e.target.value)}
              className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Notas (opcional)</label>
            <textarea
              value={notas} onChange={(e) => setNotas(e.target.value)} rows={2}
              className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple resize-none"
            />
          </div>
        </div>
        <button
          onClick={() => contato.trim() && onSave(contato.trim(), horario ? new Date(horario).toISOString() : null, notas)}
          disabled={!contato.trim()}
          className="w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white gradient-primary hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Criar card
        </button>
      </div>
    </div>
  );
}

function KanbanCardEl({ card, onMover, onRemover }: {
  card: KanbanCard; onMover: (etapa: Etapa) => void; onRemover: () => void;
}) {
  const horarioFmt = formatHorario(card.horario);
  return (
    <div className="group/card bg-white border border-cw-border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-cw-text leading-tight">{card.contato}</p>
        <button
          onClick={onRemover}
          title="Remover card"
          className="opacity-0 group-hover/card:opacity-100 text-cw-muted/60 hover:text-red-500 transition-opacity shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {horarioFmt && (
        <p className="flex items-center gap-1 text-[11px] text-cw-muted mt-1">
          <Clock className="h-3 w-3" /> {horarioFmt}
        </p>
      )}
      {card.notas && <p className="text-[11px] text-cw-muted mt-1.5 line-clamp-2">{card.notas}</p>}
      <select
        value={card.etapa}
        onChange={(e) => onMover(e.target.value as Etapa)}
        className="w-full mt-2.5 text-[11px] font-semibold bg-cw-elevated border border-cw-border rounded-lg px-2 py-1.5 text-cw-text focus:outline-none focus:border-cw-purple"
      >
        {ETAPAS.map((et) => <option key={et} value={et}>{ETAPA_LABEL[et]}</option>)}
      </select>
    </div>
  );
}

function formatDataHora(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function GoogleCalendarBar({ onSincronizado }: { onSincronizado: () => void }) {
  const { connected, lastSyncedAt, connecting, syncing, error, conectar, sincronizar } = useGoogleCalendarConnection();
  const [resultado, setResultado] = useState<string | null>(null);

  const handleSincronizar = async () => {
    setResultado(null);
    const r = await sincronizar();
    if (r) {
      setResultado(`${r.criados} nova${r.criados === 1 ? '' : 's'}, ${r.atualizados} atualizada${r.atualizados === 1 ? '' : 's'}`);
      onSincronizado();
    }
  };

  if (connected === null) return null;

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 bg-cw-elevated/60 border border-cw-border rounded-xl px-4 py-3">
      <div className="text-xs text-cw-muted">
        {connected ? (
          <>
            <span className="font-bold text-cw-text">Google Calendar conectado.</span>{' '}
            {lastSyncedAt ? `Última sincronização: ${formatDataHora(lastSyncedAt)}` : 'Ainda não sincronizado.'}
            {resultado && <span className="ml-2 text-cw-purple font-semibold">{resultado}</span>}
          </>
        ) : (
          'Conecte seu Google Calendar pra puxar as reuniões marcadas automaticamente.'
        )}
        {error && <p className="text-red-500 mt-1">{error}</p>}
      </div>
      {connected ? (
        <button
          onClick={handleSincronizar}
          disabled={syncing}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs text-cw-purple border border-cw-purple/40 hover:bg-cw-purple/10 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', syncing && 'animate-spin')} /> {syncing ? 'Sincronizando...' : 'Sincronizar agora'}
        </button>
      ) : (
        <button
          onClick={conectar}
          disabled={connecting}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs text-white gradient-primary hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <CalendarClock className="h-3.5 w-3.5" /> {connecting ? 'Conectando...' : 'Conectar Google Calendar'}
        </button>
      )}
    </div>
  );
}

function AgendaView({ cards, onMover, onRemover }: {
  cards: KanbanCard[];
  onMover: (id: string, etapa: Etapa) => void;
  onRemover: (id: string) => void;
}) {
  const grupos = new Map<string, KanbanCard[]>();
  for (const card of cards) {
    const chave = chaveDia(card.horario);
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave)!.push(card);
  }
  const chaves = [...grupos.keys()].sort((a, b) => {
    if (a === 'sem-data') return 1;
    if (b === 'sem-data') return -1;
    return a.localeCompare(b);
  });

  if (chaves.length === 0) {
    return <p className="text-sm text-cw-muted text-center py-8">Nenhuma reunião marcada ainda.</p>;
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {chaves.map((chave) => (
        <div key={chave}>
          <p className="text-xs font-black text-cw-purple uppercase tracking-wider mb-2">{labelDia(chave)}</p>
          <div className="space-y-2">
            {grupos.get(chave)!.map((card) => {
              const horarioFmt = card.horario
                ? new Date(card.horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                : null;
              return (
                <div key={card.id} className="group/row flex items-center gap-3 bg-white border border-cw-border rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-bold text-cw-muted w-12 shrink-0">{horarioFmt ?? '--:--'}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-cw-text truncate">{card.contato}</p>
                    {card.notas && <p className="text-[11px] text-cw-muted line-clamp-1">{card.notas}</p>}
                  </div>
                  <select
                    value={card.etapa}
                    onChange={(e) => onMover(card.id, e.target.value as Etapa)}
                    className={cn('text-[11px] font-semibold rounded-lg px-2 py-1.5 border-0 shrink-0 focus:outline-none focus:ring-1 focus:ring-cw-purple', ETAPA_BADGE_COR[card.etapa])}
                  >
                    {ETAPAS.map((et) => <option key={et} value={et}>{ETAPA_LABEL[et]}</option>)}
                  </select>
                  <button
                    onClick={() => onRemover(card.id)}
                    title="Remover card"
                    className="opacity-0 group-hover/row:opacity-100 text-cw-muted/60 hover:text-red-500 transition-opacity shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Kanban() {
  const { cards, loading, criar, moverEtapa, remover, recarregar } = useKanbanReunioes();
  const [showNova, setShowNova] = useState(false);
  const [visao, setVisao] = useState<'board' | 'agenda'>('agenda');

  return (
    <div className="p-8 space-y-6">
      {showNova && (
        <NovaReuniaoModal
          onSave={(contato, horario, notas) => { criar(contato, horario, notas); setShowNova(false); }}
          onClose={() => setShowNova(false)}
        />
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link to="/meta" className="flex items-center gap-1.5 text-xs font-semibold text-cw-muted hover:text-cw-purple mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar pra Meta do Mês
          </Link>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-cw-purple" />
            <h1 className="text-2xl font-black text-cw-text">Kanban de Reuniões</h1>
          </div>
          <p className="text-sm text-cw-muted mt-1">Acompanhe cada reunião marcada até virar cliente (ou não).</p>
        </div>
        <button
          onClick={() => setShowNova(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white gradient-primary hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Nova reunião
        </button>
      </div>

      <GoogleCalendarBar onSincronizado={recarregar} />

      <div className="flex items-center gap-1 bg-cw-elevated/60 border border-cw-border rounded-lg p-1 w-fit">
        <button
          onClick={() => setVisao('agenda')}
          className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors', visao === 'agenda' ? 'bg-white text-cw-purple shadow-sm' : 'text-cw-muted hover:text-cw-text')}
        >
          <CalendarDays className="h-3.5 w-3.5" /> Agenda por dia
        </button>
        <button
          onClick={() => setVisao('board')}
          className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors', visao === 'board' ? 'bg-white text-cw-purple shadow-sm' : 'text-cw-muted hover:text-cw-text')}
        >
          <LayoutGrid className="h-3.5 w-3.5" /> Board por etapa
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-cw-muted">Carregando board...</p>
      ) : visao === 'agenda' ? (
        <AgendaView cards={cards} onMover={moverEtapa} onRemover={remover} />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {ETAPAS.map((etapa) => {
            const cardsDaEtapa = cards.filter((c) => c.etapa === etapa);
            return (
              <div key={etapa} className="shrink-0 w-64">
                <div className={cn('rounded-t-xl border-t-4 bg-cw-elevated px-3 py-2.5', COLUNA_COR[etapa])}>
                  <p className="text-xs font-black text-cw-text uppercase tracking-wide">{ETAPA_LABEL[etapa]}</p>
                  <p className="text-[11px] text-cw-muted font-semibold">{cardsDaEtapa.length} card{cardsDaEtapa.length === 1 ? '' : 's'}</p>
                </div>
                <div className="bg-cw-elevated/40 border border-t-0 border-cw-border rounded-b-xl p-2 space-y-2 min-h-[120px]">
                  {cardsDaEtapa.length === 0 && <p className="text-[11px] text-cw-muted/60 text-center py-4">Vazio</p>}
                  {cardsDaEtapa.map((card) => (
                    <KanbanCardEl
                      key={card.id}
                      card={card}
                      onMover={(et) => moverEtapa(card.id, et)}
                      onRemover={() => remover(card.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
