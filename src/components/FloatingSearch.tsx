/** Assistente flutuante CW — chat com navegação por palavras-chave.
 *  Os destinos são por papel: no dashboard de Closer aponta para /closer/* e
 *  indexa as objeções (digite a frase do lead e ele leva à objeção certa). */
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Send, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarContext } from '@/context/SidebarContext';
import { CLOSER_OBJECOES, CLOSER_CONCORRENTES, CLOSER_CONCORRENTES_HEADERS } from '@/data/playbookCloser';

interface Destino {
  tags: string[];
  label: string;
  descricao: string;
  path: string;
  tab?: string;
  /** Se presente, navega com ?q= (ex: abrir uma objeção específica). */
  query?: string;
  /** Se true, repassa o texto digitado como ?q= (ex: destacar o cupom buscado). */
  passQuery?: boolean;
  cor: string;
}

const DESTINOS_SDR: Destino[] = [
  {
    tags: ['calculadora', 'calcular', 'calcula', 'proposta', 'simular', 'simulação'],
    label: 'Calculadora',
    descricao: 'Monte e compare propostas de planos',
    path: '/', tab: 'calculadora',
    cor: 'bg-cw-purple/20 text-cw-purple-light border-cw-purple/30',
  },
  {
    tags: ['totem', 'autoatendimento', 'dispositivo', 'quiosque'],
    label: 'Totem — FAQ',
    descricao: 'Dúvidas sobre o Totem de Autoatendimento',
    path: '/', tab: 'faq',
    cor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    tags: ['faq', 'dúvida', 'duvida', 'pergunta frequente', 'perguntas'],
    label: 'FAQ',
    descricao: 'Perguntas frequentes sobre produto e planos',
    path: '/', tab: 'faq',
    cor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    tags: ['changelog', 'novidade', 'atualização', 'atualizacao', 'update', 'mudança'],
    label: 'Changelog',
    descricao: 'Últimas atualizações da plataforma',
    path: '/', tab: 'changelog',
    cor: 'bg-cw-yellow/20 text-cw-yellow border-cw-yellow/30',
  },
  {
    tags: ['aviso', 'avisos', 'mural', 'comunicado'],
    label: 'Mural de Avisos',
    descricao: 'Comunicados e atualizações do time',
    path: '/', tab: 'inicio',
    cor: 'bg-cw-red/20 text-cw-red border-cw-red/30',
  },
  {
    tags: ['plano', 'planos', 'preço', 'preco', 'valor', 'mensalidade', 'mesas', 'delivery', 'premium', 'módulo', 'modulo', 'desconto'],
    label: 'Planos & Preços',
    descricao: 'Tabela de planos, módulos e descontos',
    path: '/playbook', tab: 'planos',
    cor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  {
    tags: ['objeção', 'objeções', 'objecao', 'caro', 'concorrente', 'resistência'],
    label: 'Objeções',
    descricao: 'Matriz de objeções com scripts prontos',
    path: '/playbook', tab: 'objecoes',
    cor: 'bg-cw-red/15 text-cw-red border-cw-red/30',
  },
  {
    tags: ['spin', 'situação', 'problema', 'implicação', 'necessidade', 'perguntas de venda'],
    label: 'SPIN Selling',
    descricao: 'Perguntas SPIN por funcionalidade',
    path: '/playbook', tab: 'spin',
    cor: 'bg-cw-purple/15 text-cw-purple-light border-cw-purple/30',
  },
  {
    tags: ['cold call', 'prospecção', 'prospeccao', 'ligação', 'roteiro', 'aida', 'script'],
    label: 'Cold Call — AIDA',
    descricao: 'Roteiro completo de prospecção',
    path: '/playbook', tab: 'aida',
    cor: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  },
  {
    tags: ['hack', 'dica', 'urgência', 'whatsapp', 'follow up'],
    label: 'Hacks de Pré-vendas',
    descricao: 'Scripts para situações difíceis',
    path: '/playbook', tab: 'hacks',
    cor: 'bg-cw-yellow/15 text-cw-yellow border-cw-yellow/30',
  },
  {
    tags: ['produto', 'funcionalidade', 'chatbot', 'ia', 'disparador', 'kds', 'cardápio', 'ifood'],
    label: 'Produto',
    descricao: 'Funcionalidades e integrações',
    path: '/playbook', tab: 'produto',
    cor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  {
    tags: ['bant', 'qualificação', 'budget', 'autoridade', 'timing'],
    label: 'BANT',
    descricao: 'Metodologia de qualificação',
    path: '/playbook', tab: 'bant',
    cor: 'bg-cw-purple/15 text-cw-purple-light border-cw-purple/30',
  },
  {
    tags: ['passagem', 'bastão', 'closer', 'handoff', 'checklist'],
    label: 'Passagem de Bastão',
    descricao: 'Checklist SDR → Closer',
    path: '/playbook', tab: 'passagem',
    cor: 'bg-cw-purple/15 text-cw-purple-light border-cw-purple/30',
  },
  {
    tags: ['cultura', 'missão', 'visão', 'valores', 'memorando', 'commerce first'],
    label: 'Cultura & Estratégia',
    descricao: 'Missão, visão e valores da CW',
    path: '/playbook', tab: 'cultura',
    cor: 'bg-cw-yellow/15 text-cw-yellow border-cw-yellow/30',
  },
];

/** Seções compartilhadas (idênticas em todos os dashboards). */
const DESTINOS_SHARED: Destino[] = [
  {
    tags: ['comece', 'comece aqui', 'início', 'inicio', 'onboarding', 'boas vindas', 'glossário', 'glossario'],
    label: 'Comece Aqui',
    descricao: 'Boas-vindas, onboarding e glossário',
    path: '/start',
    cor: 'bg-cw-yellow/20 text-cw-yellow border-cw-yellow/30',
  },
  {
    tags: ['cultura', 'missão', 'visão', 'valores'],
    label: 'Cultura',
    descricao: 'Cultura e valores da CW',
    path: '/cultura',
    cor: 'bg-cw-yellow/15 text-cw-yellow border-cw-yellow/30',
  },
  {
    tags: ['história', 'historias', 'histórias', 'hall', 'sucesso', 'fama'],
    label: 'Histórias de Sucesso',
    descricao: 'Hall da fama do time',
    path: '/historias',
    cor: 'bg-cw-purple/15 text-cw-purple-light border-cw-purple/30',
  },
  {
    tags: ['pipeline', 'funil de vendas'],
    label: 'Pipeline',
    descricao: 'Visão do pipeline de vendas',
    path: '/pipeline',
    cor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
];

/** Destinos do dashboard de Closer (seções próprias + compartilhadas). */
const DESTINOS_CLOSER: Destino[] = [
  {
    tags: ['plano', 'planos', 'preço', 'preco', 'valor', 'mensalidade', 'mesas', 'delivery', 'premium', 'módulo', 'modulo', 'franquia', 'franquias'],
    label: 'Planos e Preços',
    descricao: 'Planos, módulos e franquias',
    path: '/closer/planos',
    cor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  {
    tags: ['cupom', 'cupons', 'desconto', 'descontos', 'parcerias', 'parceria', 'código', 'codigo', 'reopen', 'negociação', 'negociacao'],
    label: 'Descontos',
    descricao: 'Códigos de desconto (parcerias, negociação, reopen)',
    path: '/closer/descontos',
    passQuery: true,
    cor: 'bg-cw-yellow/15 text-cw-yellow border-cw-yellow/30',
  },
  {
    tags: ['template', 'templates', 'mensagem', 'mensagens', 'follow-up', 'followup', 'cobrança', 'cobranca', 'script', 'copiar'],
    label: 'Templates',
    descricao: 'Mensagens prontas para copiar e enviar',
    path: '/closer/templates',
    cor: 'bg-cw-purple/15 text-cw-purple-light border-cw-purple/30',
  },
  {
    tags: ['meta', 'metas', 'objetivo', 'progresso', 'fechamento', 'mês', 'mes', 'módulos', 'modulos'],
    label: 'Metas',
    descricao: 'Acompanhe sua meta do mês e módulos',
    path: '/closer/metas',
    cor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  {
    tags: ['objeção', 'objeções', 'objecao', 'objecoes', 'contorno', 'caro', 'resistência', 'sócio', 'socio', 'esposa', 'pensar', 'financeiro'],
    label: 'Objeções',
    descricao: 'Contorno de objeções com discurso de solução',
    path: '/closer/objecoes',
    cor: 'bg-cw-red/15 text-cw-red border-cw-red/30',
  },
  {
    tags: ['processo', 'funil', 'funis', 'spin', 'etapa', 'etapas', 'reunião', 'reuniao', 'checklist', 'checklists', 'critério', 'criterios', 'critérios', 'avaliação', 'avaliacao', 'follow', 'followup', 'follow up', 'no-show', 'no show'],
    label: 'Processo de Venda',
    descricao: 'Funis, SPIN, etapas, checklists, critérios e follow-up',
    path: '/closer/processo',
    cor: 'bg-cw-purple/15 text-cw-purple-light border-cw-purple/30',
  },
  {
    tags: ['rotina', 'hora ouro', 'hora de ouro', 'produtividade', 'crm', 'progressão', 'progressao', 'carreira', 'nível', 'niveis', 'níveis', 'promoção', 'promocao'],
    label: 'Rotina & Progressão',
    descricao: 'Hora Ouro, CRM e níveis de carreira',
    path: '/closer/rotina',
    cor: 'bg-cw-yellow/15 text-cw-yellow border-cw-yellow/30',
  },
  {
    tags: ['concorrente', 'concorrentes', 'anota', 'anota ai', 'goomer', 'saipos', 'whatsmenu', 'consumer', 'comparativo', 'comparação'],
    label: 'Concorrentes',
    descricao: 'Comparativo com os principais concorrentes',
    path: '/closer/concorrentes',
    cor: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  },
  ...DESTINOS_SHARED,
];

function norm(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function destinosDoPapel(papel: string): Destino[] {
  if (papel === 'Closer') return DESTINOS_CLOSER;
  if (papel === 'SDR' || papel === 'Liderança') return DESTINOS_SDR;
  return DESTINOS_SHARED;
}

function buscar(query: string, papel: string): Destino[] {
  if (!query.trim()) return [];
  const q = norm(query);
  const base = destinosDoPapel(papel);

  const scored = base.map(d => {
    const score = d.tags.reduce((acc, tag) => {
      const t = norm(tag);
      if (t === q) return acc + 4;
      if (t.startsWith(q) || q.startsWith(t)) return acc + 2;
      if (t.includes(q) || q.includes(t)) return acc + 1;
      return acc;
    }, 0);
    return { d, score };
  }).filter(x => x.score > 0);

  // No dashboard de Closer, indexa as objeções por frase do lead.
  if (papel === 'Closer' && q.length >= 3) {
    for (const o of CLOSER_OBJECOES) {
      const titulo = norm(o.titulo);
      const contorno = norm(o.contorno);
      let score = 0;
      if (titulo === q) score += 7;
      else if (titulo.includes(q)) score += 5;
      else if (q.includes(titulo)) score += 4;
      else if (contorno.includes(q)) score += 2;
      if (score > 0) {
        scored.push({
          score,
          d: {
            tags: [],
            label: 'Objeção',
            descricao: o.titulo,
            path: '/closer/objecoes',
            query: o.titulo,
            cor: 'bg-cw-red/15 text-cw-red border-cw-red/30',
          },
        });
      }
    }
  }

  // Busca por concorrente no dashboard de Closer
  if (papel === 'Closer' && q.length >= 2) {
    for (let i = 1; i < CLOSER_CONCORRENTES_HEADERS.length; i++) {
      const nome = CLOSER_CONCORRENTES_HEADERS[i];
      const nomeNorm = norm(nome);
      const words = nomeNorm.split(' ');
      let score = 0;
      if (nomeNorm === q) score = 8;
      else if (q.length >= 3 && nomeNorm.startsWith(q)) score = 6;
      else if (q.length >= 3 && nomeNorm.includes(q)) score = 5;
      else if (q.length >= 3 && words.some(w => w.length > 3 && w.startsWith(q))) score = 4;
      if (score > 0) {
        let nao = 0;
        for (const cat of CLOSER_CONCORRENTES) {
          for (const f of cat.features) {
            if (f.valores[i] === 'no') nao++;
          }
        }
        scored.push({
          score,
          d: {
            tags: [],
            label: 'Concorrente',
            descricao: nao > 0
              ? `${nome} — ${nao} diferencial${nao > 1 ? 'is' : ''} exclusivo${nao > 1 ? 's' : ''} da CW`
              : `${nome} — funcionalidades similares à CW`,
            path: '/closer/concorrentes',
            query: nome,
            cor: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
          },
        });
      }
    }
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, 5).map(x => x.d);
}

function BotAvatar({ size = 28 }: { size?: number }) {
  return (
    <div
      className="rounded-full gradient-primary shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Zap style={{ width: size * 0.5, height: size * 0.5 }} className="text-white" />
    </div>
  );
}

export function FloatingSearch() {
  const { papel } = useSidebarContext();
  const [aberto, setAberto] = useState(false);
  const [query, setQuery]   = useState('');
  const [novo, setNovo]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  const quickReplies = papel === 'Closer'
    ? ['Planos', 'Objeções', 'Consumer', 'Anota ai', 'Processo']
    : ['Calculadora', 'Totem', 'FAQ', 'Objeções', 'Cold Call'];

  useEffect(() => {
    const jaAbriu = sessionStorage.getItem('cw.assistant.opened');
    if (!jaAbriu) {
      const t = setTimeout(() => {
        setAberto(true);
        sessionStorage.setItem('cw.assistant.opened', '1');
      }, 2000);
      return () => clearTimeout(t);
    } else {
      setNovo(true);
      const t = setTimeout(() => setNovo(false), 4000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (aberto) {
      setNovo(false);
      setTimeout(() => inputRef.current?.focus(), 120);
    } else {
      setQuery('');
    }
  }, [aberto]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setAberto(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  function ir(d: Destino) {
    let url = d.path;
    if (d.passQuery && query.trim()) url = `${d.path}?q=${encodeURIComponent(query.trim())}`;
    else if (d.query) url = `${d.path}?q=${encodeURIComponent(d.query)}`;
    else if (d.tab) url = `${d.path}?tab=${d.tab}`;
    nav(url);
    setAberto(false);
  }

  function handleEnter(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      const res = buscar(query, papel);
      if (res.length >= 1) ir(res[0]);
    }
  }

  const resultados = buscar(query, papel);

  return (
    <>
      {aberto && <div className="fixed inset-0 z-40" onClick={() => setAberto(false)} />}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Painel do assistente */}
        {aberto && (
          <div
            className="w-80 rounded-2xl border border-[#ffffff12] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-3 fade-in duration-200"
            style={{ background: 'linear-gradient(180deg, #1f1040 0%, #150d30 100%)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#ffffff0a]">
              <BotAvatar size={32} />
              <div className="flex-1">
                <p className="text-[13px] font-bold text-white leading-tight">Assistente CW</p>
                <p className="text-[10px] text-[#9b6fc4]">{papel === 'Closer' ? 'Dashboard de Closer' : 'Sales Enablement'}</p>
              </div>
              <button onClick={() => setAberto(false)} className="text-[#7c5aa8] hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Corpo do chat */}
            <div className="px-4 py-4 space-y-3 max-h-72 overflow-y-auto">
              {/* Mensagens do bot */}
              <div className="flex items-end gap-2">
                <BotAvatar size={24} />
                <div className="flex flex-col gap-1.5 max-w-[85%]">
                  <div className="bg-[#2d1760] rounded-2xl rounded-bl-sm px-3 py-2">
                    <p className="text-[13px] text-white leading-snug">Posso ajudar? 👋</p>
                  </div>
                  <div className="bg-[#2d1760] rounded-2xl rounded-bl-sm px-3 py-2">
                    {papel === 'Closer' ? (
                      <p className="text-[12px] text-[#d4c0ee] leading-snug">
                        Digite uma seção (<span className="text-cw-yellow font-semibold">"planos"</span>), a frase do lead (<span className="text-cw-yellow font-semibold">"me manda no whatsapp"</span>) ou um concorrente (<span className="text-cw-yellow font-semibold">"consumer"</span>) para ver os diferenciais da CW.
                      </p>
                    ) : (
                      <p className="text-[12px] text-[#d4c0ee] leading-snug">
                        Digite uma palavra-chave — tipo <span className="text-cw-yellow font-semibold">"totem"</span> ou <span className="text-cw-yellow font-semibold">"calculadora"</span> — e te levo direto pra seção certa.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick replies */}
              {!query && (
                <div className="ml-8 flex flex-wrap gap-1.5">
                  {quickReplies.map(r => (
                    <button
                      key={r}
                      onClick={() => setQuery(r.toLowerCase())}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#2d1760] border border-[#ffffff12] text-[#b89fd4] hover:bg-cw-purple/30 hover:text-white hover:border-cw-purple/40 transition-all"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}

              {/* Resultados */}
              {resultados.length > 0 && (
                <div className="flex items-end gap-2">
                  <BotAvatar size={24} />
                  <div className="flex flex-col gap-1.5 max-w-[85%]">
                    <div className="bg-[#2d1760] rounded-2xl rounded-bl-sm px-3 py-2">
                      <p className="text-[12px] text-[#d4c0ee]">Encontrei isso para você:</p>
                    </div>
                    {resultados.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => ir(d)}
                        className="group flex items-center gap-2 bg-[#1a0f2e] border border-[#ffffff10] hover:border-cw-purple/50 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-[#2d1760]"
                      >
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full border shrink-0', d.cor)}>
                          {d.label}
                        </span>
                        <span className="text-[11px] text-[#b89fd4] flex-1 truncate group-hover:text-white transition-colors">
                          {d.descricao}
                        </span>
                        <ArrowRight className="h-3 w-3 text-[#7c5aa8] group-hover:text-cw-purple shrink-0 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Nenhum resultado */}
              {query.trim() && resultados.length === 0 && (
                <div className="flex items-end gap-2">
                  <BotAvatar size={24} />
                  <div className="bg-[#2d1760] rounded-2xl rounded-bl-sm px-3 py-2 max-w-[85%]">
                    <p className="text-[12px] text-[#d4c0ee]">Hmm, não encontrei nada para <span className="text-white font-semibold">"{query}"</span>.</p>
                    <p className="text-[11px] text-[#7c5aa8] mt-1">
                      {papel === 'Closer' ? 'Tente: planos, objeção, processo, concorrentes...' : 'Tente: totem, calculadora, objeção, spin...'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-3 pb-3 border-t border-[#ffffff08] pt-3">
              <div className="flex items-center gap-2 bg-[#0d0018] border border-[#ffffff10] rounded-xl px-3 py-2 focus-within:border-cw-purple/50 transition-colors">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleEnter}
                  placeholder={papel === 'Closer' ? 'Ex: "me manda no whatsapp", consumer, planos...' : 'Ex: calculadora, totem, objeção...'}
                  className="flex-1 bg-transparent text-[13px] text-white placeholder:text-[#7c5aa8] outline-none"
                />
                {query ? (
                  <button
                    onClick={() => { const res = buscar(query, papel); if (res.length > 0) ir(res[0]); }}
                    className="h-6 w-6 rounded-lg gradient-primary flex items-center justify-center shrink-0"
                  >
                    <Send className="h-3 w-3 text-white" />
                  </button>
                ) : (
                  <Send className="h-3.5 w-3.5 text-[#7c5aa8]" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Botão flutuante */}
        <button
          onClick={() => setAberto(v => !v)}
          title="Assistente CW"
          className="relative h-14 w-14 rounded-full gradient-primary shadow-2xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
          style={{ boxShadow: '0 4px 20px rgba(165,67,250,0.5)' }}
        >
          {aberto ? <X className="h-5 w-5 text-white" /> : <Zap className="h-6 w-6 text-white" />}
          {novo && !aberto && (
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-cw-yellow border-2 border-[#150d30] animate-pulse" />
          )}
        </button>
      </div>
    </>
  );
}
