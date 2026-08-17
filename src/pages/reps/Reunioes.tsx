/** Reuniões — espelha as reuniões do tl;dv da Gabrielly e do Hyorranes
 *  (squad de Aquisição de Canal), atualiza sozinho a cada reunião nova
 *  gravada. Filtro por pessoa; nenhuma outra reunião da empresa aparece. */
import { useEffect, useState } from 'react';
import { Users, Clock, ExternalLink, RefreshCw, Video, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';

interface Reuniao {
  id: string;
  nome: string;
  aconteceuEm: string;
  duracaoSegundos: number;
  organizador: { nome: string; email: string } | null;
  convidados: { nome: string; email: string }[];
  url: string;
}

const PESSOAS = [
  { label: 'Todas', email: null },
  { label: 'Gabrielly', email: 'gabrielly.oliveira@cardapioweb.com' },
  { label: 'Hyorranes', email: 'hyorranes.souza@cardapioweb.com' },
] as const;

function formatarDuracao(segundos: number) {
  const min = Math.round(segundos / 60);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h${m}min` : `${h}h`;
}

export default function Reunioes() {
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string | null>(null);

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const r = await fetch('/api/reps-meetings');
      const json = await r.json();
      if (!json.ok) throw new Error(json.erro || 'Falha ao carregar reuniões');
      setReunioes(json.reunioes);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao carregar reuniões');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const filtradas = reunioes.filter(r => {
    if (!filtro) return true;
    if (r.organizador?.email === filtro) return true;
    return r.convidados.some(c => c.email === filtro);
  });

  return (
    <>
      <Header
        titulo="Reuniões"
        subtitulo="Reuniões da Gabrielly e do Hyorranes (tl;dv) — atualiza automaticamente"
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
              onClick={() => setFiltro(p.email)}
              className={cn('flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors',
                filtro === p.email
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
            <p className="text-sm">Carregando reuniões...</p>
          </div>
        ) : erro ? (
          <div className="cw-card p-6 text-center space-y-2">
            <p className="text-sm text-red-500 font-semibold">Não deu pra carregar as reuniões</p>
            <p className="text-xs text-cw-muted">{erro}</p>
            <button onClick={carregar} className="text-xs font-semibold text-cw-purple-light hover:underline">Tentar de novo</button>
          </div>
        ) : filtradas.length === 0 ? (
          <div className="cw-card p-10 flex flex-col items-center gap-2 text-center">
            <Video className="h-8 w-8 text-cw-muted/40" />
            <p className="text-sm text-cw-muted">Nenhuma reunião encontrada.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtradas.map(r => (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cw-card p-4 flex items-center gap-4 hover:border-cw-purple/40 transition-colors group"
              >
                <div className="h-10 w-10 rounded-lg bg-cw-purple/10 flex items-center justify-center shrink-0">
                  <Video className="h-4.5 w-4.5 text-cw-purple-light" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-cw-text truncate">{r.nome || 'Reunião sem título'}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[11px] text-cw-muted">
                    <span>{new Date(r.aconteceuEm).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatarDuracao(r.duracaoSegundos)}</span>
                    {r.organizador && <span>Organizou: {r.organizador.nome || r.organizador.email}</span>}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-cw-muted/40 group-hover:text-cw-purple-light shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
