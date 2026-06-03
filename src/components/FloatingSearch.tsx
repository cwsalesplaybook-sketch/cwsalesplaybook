/** Widget flutuante de busca rápida — digita uma dúvida e vai direto pra seção certa. */
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, X, Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Destino {
  tags: string[];       // palavras-chave que ativam
  label: string;        // nome da seção
  descricao: string;    // descrição curta
  path: string;         // rota
  tab?: string;         // aba dentro da rota (query param)
  cor: string;          // cor do badge
}

const DESTINOS: Destino[] = [
  {
    tags: ['objeção', 'objeções', 'objecao', 'valores', 'preço', 'caro', 'concorrente', 'resistencia', 'resistência'],
    label: 'Objeções',
    descricao: 'Matriz de objeções com scripts prontos',
    path: '/playbook',
    tab: 'objecoes',
    cor: 'bg-cw-red/15 text-cw-red border-cw-red/30',
  },
  {
    tags: ['spin', 'situação', 'problema', 'implicação', 'necessidade', 'pergunta', 'perguntas'],
    label: 'SPIN Selling',
    descricao: 'Perguntas SPIN por funcionalidade',
    path: '/playbook',
    tab: 'spin',
    cor: 'bg-cw-purple/15 text-cw-purple-light border-cw-purple/30',
  },
  {
    tags: ['bant', 'budget', 'orçamento', 'autoridade', 'timing', 'qualificação', 'qualificacao'],
    label: 'BANT',
    descricao: 'Metodologia de qualificação BANT',
    path: '/playbook',
    tab: 'bant',
    cor: 'bg-cw-purple/15 text-cw-purple-light border-cw-purple/30',
  },
  {
    tags: ['aida', 'cold call', 'prospecção', 'prospeccao', 'ligação', 'ligacao', 'roteiro'],
    label: 'AIDA — Cold Call',
    descricao: 'Roteiro completo de prospecção',
    path: '/playbook',
    tab: 'aida',
    cor: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  },
  {
    tags: ['hack', 'hacks', 'dica', 'dicas', 'truque', 'urgência', 'urgencia', 'material', 'whatsapp'],
    label: 'Hacks de Pré-vendas',
    descricao: 'Scripts para situações difíceis',
    path: '/playbook',
    tab: 'hacks',
    cor: 'bg-cw-yellow/15 text-cw-yellow border-cw-yellow/30',
  },
  {
    tags: ['plano', 'planos', 'preço', 'preco', 'valor', 'mensalidade', 'mesas', 'delivery', 'premium', 'módulo', 'modulo', 'desconto'],
    label: 'Planos & Preços',
    descricao: 'Tabela de planos, módulos e descontos',
    path: '/playbook',
    tab: 'planos',
    cor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  {
    tags: ['produto', 'funcionalidade', 'chatbot', 'ia', 'disparador', 'kds', 'totem', 'cardápio', 'cardapio'],
    label: 'Produto',
    descricao: 'Funcionalidades e integrações',
    path: '/playbook',
    tab: 'produto',
    cor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  {
    tags: ['concorrente', 'concorrência', 'concorrencia', 'competidor', 'diferencial'],
    label: 'Concorrentes',
    descricao: 'Diferenciais vs concorrentes',
    path: '/playbook',
    tab: 'concorrentes',
    cor: 'bg-cw-red/15 text-cw-red border-cw-red/30',
  },
  {
    tags: ['passagem', 'bastão', 'bastao', 'transferência', 'closer', 'handoff', 'checklist'],
    label: 'Passagem de Bastão',
    descricao: 'Checklist SDR → Closer',
    path: '/playbook',
    tab: 'passagem',
    cor: 'bg-cw-purple/15 text-cw-purple-light border-cw-purple/30',
  },
  {
    tags: ['perda', 'perdeu', 'motivo', 'churn', 'cancelamento'],
    label: 'Motivos de Perda',
    descricao: 'Por que perdemos leads',
    path: '/playbook',
    tab: 'perda',
    cor: 'bg-cw-red/15 text-cw-red border-cw-red/30',
  },
  {
    tags: ['faq', 'dúvida', 'duvida', 'pergunta frequente', 'totem', 'autoatendimento'],
    label: 'FAQ',
    descricao: 'Perguntas frequentes sobre produto e totem',
    path: '/faq',
    cor: 'bg-cw-purple/15 text-cw-purple-light border-cw-purple/30',
  },
  {
    tags: ['missão', 'visão', 'valores', 'cultura', 'estratégia', 'memorando', 'commerce first'],
    label: 'Cultura & Estratégia',
    descricao: 'Missão, visão e valores da CW',
    path: '/playbook',
    tab: 'cultura',
    cor: 'bg-cw-yellow/15 text-cw-yellow border-cw-yellow/30',
  },
  {
    tags: ['jornada', 'funil', 'pipeline', 'etapa', 'processo'],
    label: 'Jornada do Cliente',
    descricao: 'Do lead à implementação',
    path: '/playbook',
    tab: 'jornada',
    cor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  {
    tags: ['cargo', 'sdr', 'bdr', 'closer', 'ldr', 'supervisor', 'função'],
    label: 'Cargos',
    descricao: 'Funções e responsabilidades do time',
    path: '/playbook',
    tab: 'cargos',
    cor: 'bg-cw-purple/15 text-cw-purple-light border-cw-purple/30',
  },
  {
    tags: ['aviso', 'avisos', 'mural', 'comunicado', 'novidade'],
    label: 'Mural de Avisos',
    descricao: 'Comunicados e atualizações do time',
    path: '/mural',
    cor: 'bg-cw-red/15 text-cw-red border-cw-red/30',
  },
];

function norm(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function buscar(query: string): Destino[] {
  if (!query.trim()) return [];
  const q = norm(query);
  const scored = DESTINOS.map(d => {
    const score = d.tags.reduce((acc, tag) => {
      const t = norm(tag);
      if (t === q) return acc + 3;
      if (t.startsWith(q) || q.startsWith(t)) return acc + 2;
      if (t.includes(q) || q.includes(t)) return acc + 1;
      return acc;
    }, 0);
    return { d, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map(x => x.d);
}

export function FloatingSearch() {
  const [aberto, setAberto] = useState(false);
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<Destino[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  useEffect(() => {
    if (aberto) setTimeout(() => inputRef.current?.focus(), 80);
    else { setQuery(''); setResultados([]); }
  }, [aberto]);

  useEffect(() => {
    setResultados(buscar(query));
  }, [query]);

  // Fecha com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setAberto(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  function ir(d: Destino) {
    const url = d.tab ? `${d.path}?tab=${d.tab}` : d.path;
    nav(url);
    setAberto(false);
  }

  return (
    <>
      {/* Backdrop */}
      {aberto && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setAberto(false)}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Painel de busca */}
        {aberto && (
          <div className="w-80 cw-card shadow-2xl border border-cw-border overflow-hidden animate-in slide-in-from-bottom-3 fade-in duration-200">

            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-cw-border bg-cw-elevated">
              <Search className="h-4 w-4 text-cw-purple-light shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ex: objeção de valores, spin..."
                className="flex-1 bg-transparent text-sm text-cw-text placeholder:text-cw-muted outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-cw-muted hover:text-cw-text">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Resultados */}
            <div className="max-h-72 overflow-y-auto">
              {resultados.length > 0 ? (
                <ul>
                  {resultados.map((d, i) => (
                    <li key={i}>
                      <button
                        onClick={() => ir(d)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cw-elevated transition-colors text-left group"
                      >
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0', d.cor)}>
                          {d.label}
                        </span>
                        <span className="text-xs text-cw-muted flex-1 truncate">{d.descricao}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-cw-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : query.trim() ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-cw-muted">Nenhuma seção encontrada.</p>
                  <p className="text-xs text-cw-muted mt-1">Tente: "objeção", "spin", "planos", "totem"...</p>
                </div>
              ) : (
                <div className="px-4 py-4 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-cw-muted mb-2">Sugestões rápidas</p>
                  {['objeção de valores', 'spin delivery', 'cold call', 'planos e preços', 'totem'].map(s => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="flex items-center gap-2 text-xs text-cw-muted hover:text-cw-text transition-colors"
                    >
                      <Search className="h-3 w-3" /> {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botão flutuante */}
        <button
          onClick={() => setAberto(v => !v)}
          title="Busca rápida no Playbook"
          className={cn(
            'h-13 w-13 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110',
            aberto
              ? 'gradient-primary text-white rotate-45'
              : 'gradient-primary text-white'
          )}
          style={{ height: 52, width: 52 }}
        >
          {aberto ? <X className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
        </button>
      </div>
    </>
  );
}
