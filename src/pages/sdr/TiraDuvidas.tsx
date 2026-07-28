/** Tira-dúvidas — landing premium (estado vazio) + chat único e contínuo
 *  (depois da primeira pergunta), com roteamento 100% automático pra pessoa
 *  certa do time. O SDR escolhe um TÓPICO e uma pergunta pré-cadastrada (ou
 *  digita livremente) — nunca escolhe quem responde, isso é sempre
 *  automático (src/lib/matchDuvida.ts). Fora do banco curado, cai no RAG da
 *  ClarIA (src/lib/tiraDuvidasRag.ts), que busca na base de conhecimento
 *  real (Confluence, Sheets, Central de Ajuda, docs da API) e gera a
 *  resposta. Se nem o RAG tiver contexto, cai no fallback com o Slack da
 *  pessoa responsável. */
import { useEffect, useRef, useState } from 'react';
import {
  Send, Sparkles, ArrowRight, RotateCcw, Shield, RefreshCw, Slack,
  Rocket, Package, DollarSign, MessageSquare, Flame, LayoutGrid, Search, Zap, Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIRA_DUVIDAS_PERSONAS, type DuvidaPersona } from '@/data/tiraDuvidas';
import { routeDuvida, suggestDuvidas, type DuvidaSugestao } from '@/lib/matchDuvida';
import { askRag } from '@/lib/tiraDuvidasRag';

interface Mensagem {
  id: string;
  autor: 'sdr' | 'persona';
  texto: string;
  intro?: boolean;
  fallback?: boolean;
  persona?: DuvidaPersona;
}

const PENSANDO_MS = 900;

/** Agrupa as personas pelo `topico` (Pedrinho e Andy dividem "Scripts &
 *  Objeções") — usado tanto nos cards da landing quanto nos chips do modo
 *  chat, pra nunca mostrar dois botões com o mesmo rótulo. */
function agruparPorTopico(personas: DuvidaPersona[]) {
  const grupos: { topico: string; personas: DuvidaPersona[] }[] = [];
  for (const p of personas) {
    const grupo = grupos.find((g) => g.topico === p.topico);
    if (grupo) grupo.personas.push(p);
    else grupos.push({ topico: p.topico, personas: [p] });
  }
  return grupos;
}
const GRUPOS_TOPICO = agruparPorTopico(TIRA_DUVIDAS_PERSONAS);
const ICONE_TOPICO: Record<string, typeof Rocket> = {
  'Processo & Qualificação': Rocket,
  'Scripts & Objeções': MessageSquare,
  'Planos & Preços': DollarSign,
  Produto: Package,
};

const porId = (id: string) => TIRA_DUVIDAS_PERSONAS.find((p) => p.id === id)!;
const JOELMA = porId('joelma');
const PERGUNTAS_POPULARES = [
  JOELMA.perguntas[0],
  JOELMA.perguntas[1],
  JOELMA.perguntas[2],
  JOELMA.perguntas[3],
  porId('pedro').perguntas[0],
  porId('vithoria').perguntas[0],
  porId('bibi').perguntas[0],
];
const TODAS_PERGUNTAS = TIRA_DUVIDAS_PERSONAS.flatMap((p) => p.perguntas);

function Avatar({ persona, size = 'md' }: { persona: DuvidaPersona; size?: 'sm' | 'md' | 'lg' }) {
  const [erro, setErro] = useState(false);
  const iniciais = persona.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  const dim = size === 'lg' ? 'h-14 w-14 text-base' : size === 'sm' ? 'h-8 w-8 text-[11px]' : 'h-10 w-10 text-xs';

  if (persona.foto && !erro) {
    return (
      <img
        src={persona.foto}
        alt={persona.nome}
        onError={() => setErro(true)}
        className={cn('rounded-full object-cover shrink-0 border border-cw-border', dim)}
      />
    );
  }
  return (
    <div className={cn('rounded-full gradient-primary flex items-center justify-center text-white font-bold shrink-0', dim)}>
      {iniciais}
    </div>
  );
}

function Dots({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const dim = size === 'md' ? 'h-2 w-2' : 'h-1.5 w-1.5';
  return (
    <div className="flex gap-1.5">
      {[0, 0.15, 0.3].map((delay) => (
        <span
          key={delay}
          className={cn('rounded-full bg-cw-purple/70 inline-block animate-dot-bounce', dim)}
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}

function ChatBubble({ msg }: { msg: Mensagem }) {
  const isSdr = msg.autor === 'sdr';
  return (
    <div className={cn('flex items-end gap-2', isSdr && 'flex-row-reverse')}>
      <div className={cn('max-w-[70%] flex flex-col gap-1.5', isSdr && 'items-end')}>
        {!isSdr && msg.intro && msg.persona && (
          <div className="flex items-center gap-2 pl-0.5">
            <Avatar persona={msg.persona} size="sm" />
            <span className="text-[12.5px] font-bold text-cw-text">{msg.persona.nome}</span>
          </div>
        )}
        {!isSdr && msg.fallback && msg.persona && (
          <div className="inline-flex items-center gap-1.5 bg-cw-yellow/20 text-cw-purple-dark border border-cw-yellow/40 text-[10.5px] font-bold px-2.5 py-1 rounded-lg">
            <ArrowRight className="h-2.5 w-2.5" />
            Encaminhado pro Slack de {msg.persona.nome}
          </div>
        )}
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line leading-relaxed',
            isSdr
              ? 'gradient-primary text-white rounded-br-sm'
              : 'bg-cw-elevated border border-cw-border text-cw-text rounded-bl-sm',
          )}
        >
          {msg.texto}
        </div>
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <div className="bg-cw-elevated border border-cw-border rounded-2xl rounded-bl-sm px-[18px] py-[13px]">
        <Dots size="md" />
      </div>
      <div className="flex items-center gap-1.5 pl-1 text-[11.5px] text-cw-muted animate-caption-pulse">
        <Sparkles className="h-2.5 w-2.5" />
        buscando no playbook…
      </div>
    </div>
  );
}

function TopBar({ mostrarReset, onResetar }: { mostrarReset: boolean; onResetar: () => void }) {
  return (
    <div className="flex items-center justify-end gap-3 shrink-0">
      {mostrarReset ? (
        <button
          type="button"
          onClick={onResetar}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 text-xs font-semibold transition-all shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Resetar chat
        </button>
      ) : (
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cw-border bg-white text-cw-text text-xs font-semibold hover:border-cw-purple/40 transition-colors shadow-sm shrink-0"
        >
          <Slack className="h-3.5 w-3.5 text-cw-purple" /> Falar no Slack
        </button>
      )}
    </div>
  );
}

function InfoBadge({ icon: Icon, texto }: { icon: typeof Shield; texto: string }) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-cw-border bg-white text-[12px] font-semibold text-cw-text">
      <div className="h-6 w-6 rounded-full bg-cw-purple/10 flex items-center justify-center shrink-0">
        <Icon className="h-3 w-3 text-cw-purple" />
      </div>
      {texto}
    </div>
  );
}

function Hero() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <p className="text-xl">Olá! 👋</p>
        <h1 className="text-[40px] md:text-[52px] font-black text-cw-text leading-[1.05] mt-1">
          Como podemos te <span className="text-cw-purple">ajudar</span> hoje?
        </h1>
        <p className="text-cw-muted text-[15px] mt-4 max-w-md leading-relaxed">
          Faça sua pergunta ou escolha um tópico abaixo para encontrar rapidamente a resposta que procura.
        </p>
        <div className="flex flex-wrap gap-2.5 mt-6">
          <InfoBadge icon={Shield} texto="Respostas oficiais do Playbook" />
          <InfoBadge icon={RefreshCw} texto="Conteúdo sempre atualizado" />
          <InfoBadge icon={Slack} texto="Não encontrou? Encaminhamos para o Slack da liderança" />
        </div>
      </div>

      <div className="relative h-[300px] md:h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Halo roxo — "palco" do mascote, bem visível (não só um blur fraco) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[260px] w-[260px] md:h-[320px] md:w-[320px] lg:h-[440px] lg:w-[440px] rounded-full bg-cw-purple/[0.35] blur-2xl" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[170px] w-[170px] md:h-[210px] md:w-[210px] lg:h-[280px] lg:w-[280px] rounded-full bg-cw-purple/[0.30] blur-xl" />
          <div className="absolute top-4 right-8 h-40 w-40 rounded-full bg-cw-yellow/10 blur-2xl" />
          <svg className="absolute top-8 left-[18%] w-24 h-16 text-cw-purple/40" viewBox="0 0 100 60" fill="none">
            <path d="M2 40 C 30 5, 60 55, 98 15" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 6" strokeLinecap="round" />
          </svg>
          <Star className="absolute top-6 left-[14%] h-5 w-5 text-cw-purple/45" />
          <Sparkles className="absolute bottom-16 right-[16%] h-6 w-6 text-cw-purple/40" />
          <Star className="absolute bottom-8 right-[32%] h-3.5 w-3.5 text-cw-yellow/50" />
        </div>

        <img
          src="/tira-duvidas/cardapinho-mascote.png"
          alt="Mascote Cardápio Web"
          className="relative h-full w-auto object-contain drop-shadow-xl"
        />

        {/* Card em formato de balão de fala, com "rabinho" apontando pro mascote */}
        <div className="absolute right-0 top-6 max-w-[190px] cw-card px-4 py-3 hidden lg:block">
          <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center mb-2">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <p className="text-[11.5px] text-cw-muted leading-snug">
            Respostas rápidas e confiáveis para te ajudar a tomar as{' '}
            <span className="text-cw-purple font-semibold">melhores decisões</span>.
          </p>
          <div className="absolute -bottom-[7px] left-7 h-4 w-4 bg-cw-surface border-b border-r border-cw-border rotate-45" />
        </div>
      </div>
    </div>
  );
}

function TopicCard({
  grupo,
  ativo,
  onClick,
}: {
  grupo: { topico: string; personas: DuvidaPersona[] };
  ativo: boolean;
  onClick: () => void;
}) {
  const Icone = ICONE_TOPICO[grupo.topico] ?? MessageSquare;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'text-left p-5 rounded-2xl border transition-all duration-150',
        ativo ? 'border-cw-purple bg-cw-purple/5' : 'border-cw-border bg-white hover:border-cw-purple/30 hover:shadow-md',
      )}
    >
      <div className="h-11 w-11 rounded-xl bg-cw-purple/10 flex items-center justify-center mb-3">
        <Icone className="h-5 w-5 text-cw-purple" />
      </div>
      <p className="font-bold text-[15px] text-cw-text">{grupo.topico}</p>
      <p className="text-[12.5px] text-cw-muted mt-1 leading-snug">{grupo.personas[0].tema}</p>
    </button>
  );
}

function QuestionCard({ pergunta, onClick }: { pergunta: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between gap-3 text-left px-4 py-3.5 rounded-xl border border-cw-border bg-white hover:border-cw-purple/40 hover:shadow-sm transition-all group"
    >
      <span className="text-[13px] font-medium text-cw-text">{pergunta}</span>
      <ArrowRight className="h-3.5 w-3.5 text-cw-muted group-hover:text-cw-purple group-hover:translate-x-0.5 transition-all shrink-0" />
    </button>
  );
}

export default function TiraDuvidas() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState('');
  const [pensando, setPensando] = useState(false);
  const [topicoAberto, setTopicoAberto] = useState<string | null>(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);
  const buscaRef = useRef<ReturnType<typeof setTimeout>>();
  const apresentadosRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, pensando]);

  useEffect(() => () => clearTimeout(buscaRef.current), []);

  const enviar = (textoBruto: string) => {
    const texto = textoBruto.trim();
    if (!texto || pensando) return;
    setInput('');
    setMensagens((prev) => [...prev, { id: `sdr-${Date.now()}`, autor: 'sdr', texto }]);
    setPensando(true);

    buscaRef.current = setTimeout(async () => {
      const { persona, item } = routeDuvida(texto, TIRA_DUVIDAS_PERSONAS);

      let corpo: string;
      let ehFallback: boolean;
      if (item) {
        corpo = item.resposta;
        ehFallback = false;
      } else {
        const respostaRag = await askRag(texto, persona);
        if (respostaRag) {
          corpo = respostaRag;
          ehFallback = false;
        } else {
          corpo = `Isso ainda não tá documentado no meu playbook. Já te encaminhei pro Slack d${persona.artigo} ${persona.nome} (${persona.slack}) pra garantir a resposta certa.`;
          ehFallback = true;
        }
      }

      const primeiraVez = !apresentadosRef.current.has(persona.id);
      apresentadosRef.current.add(persona.id);
      const resposta = primeiraVez ? `${persona.saudacao}\n\n${corpo}` : corpo;

      setMensagens((prev) => {
        const ultimaPersonaMsg = [...prev].reverse().find((m) => m.autor === 'persona');
        const trocouDePersona = !ultimaPersonaMsg || ultimaPersonaMsg.persona?.id !== persona.id;
        return [...prev, { id: `resp-${Date.now()}`, autor: 'persona', texto: resposta, intro: trocouDePersona, fallback: ehFallback, persona }];
      });
      setPensando(false);
    }, PENSANDO_MS);
  };

  const resetar = () => {
    clearTimeout(buscaRef.current);
    apresentadosRef.current.clear();
    setMensagens([]);
    setInput('');
    setPensando(false);
    setTopicoAberto(null);
    setMostrarTodas(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviar(input);
  };

  const sugestoes: DuvidaSugestao[] = input.trim().length >= 2 && !pensando ? suggestDuvidas(input, TIRA_DUVIDAS_PERSONAS) : [];
  const grupoAberto = GRUPOS_TOPICO.find((g) => g.topico === topicoAberto) ?? null;

  if (mensagens.length === 0) {
    return (
      <div className="px-6 md:px-10 py-6 space-y-3">
        <TopBar mostrarReset={false} onResetar={resetar} />
        <Hero />

        <div className="cw-card p-6 md:p-8 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="h-4 w-4 text-cw-purple" />
              <h2 className="font-black text-cw-text text-[15px]">Navegue por assuntos</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {GRUPOS_TOPICO.map((g) => (
                <TopicCard
                  key={g.topico}
                  grupo={g}
                  ativo={topicoAberto === g.topico}
                  onClick={() => setTopicoAberto((atual) => (atual === g.topico ? null : g.topico))}
                />
              ))}
            </div>
            {grupoAberto && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {grupoAberto.personas.flatMap((p) => p.perguntas).map((q) => (
                  <button
                    key={q.pergunta}
                    type="button"
                    onClick={() => enviar(q.pergunta)}
                    className="text-[12px] font-medium px-3 py-1.5 rounded-full border border-cw-border bg-cw-elevated text-cw-text hover:border-cw-purple/40 hover:bg-white transition-colors"
                  >
                    {q.pergunta}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-4 w-4 text-cw-purple" />
              <h2 className="font-black text-cw-text text-[15px]">Perguntas populares</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(mostrarTodas ? TODAS_PERGUNTAS : PERGUNTAS_POPULARES).map((item, i) => (
                <QuestionCard key={item.pergunta + i} pergunta={item.pergunta} onClick={() => enviar(item.pergunta)} />
              ))}
              {!mostrarTodas && (
                <button
                  type="button"
                  onClick={() => setMostrarTodas(true)}
                  className="flex items-center justify-between gap-3 text-left px-4 py-3.5 rounded-xl border border-cw-border bg-cw-elevated hover:border-cw-purple/40 transition-all"
                >
                  <span className="text-[13px] font-bold text-cw-purple">Ver todas as perguntas</span>
                  <LayoutGrid className="h-3.5 w-3.5 text-cw-purple" />
                </button>
              )}
            </div>
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-3 bg-cw-elevated border border-cw-border rounded-[20px] px-5 h-16">
            <Search className="h-[18px] w-[18px] text-cw-muted shrink-0" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua pergunta... Ex.: Como funciona a passagem de bastão pro Closer?"
              className="flex-1 bg-transparent text-sm text-cw-text placeholder:text-cw-muted focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="h-11 w-11 rounded-2xl gradient-primary text-white flex items-center justify-center disabled:opacity-40 shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 rounded-xl bg-cw-elevated/60 text-[11px] text-cw-muted">
          <p>
            As respostas são baseadas no Playbook oficial e, quando necessário, geradas pela ClarIA com base na
            nossa documentação real. Caso não exista resposta, sua pergunta poderá ser enviada para o Slack da
            liderança responsável.
          </p>
          <p className="font-semibold shrink-0">Cardápio Web</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-[calc(100vh-1.5rem)] flex flex-col gap-3">
      <TopBar mostrarReset onResetar={resetar} />

      <div className="cw-card flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-cw p-5 space-y-4">
          {mensagens.map((m) => (
            <ChatBubble key={m.id} msg={m} />
          ))}
          {pensando && <ThinkingIndicator />}
          <div ref={fimRef} />
        </div>

        {/* Tópicos — sempre visíveis, o SDR nunca escolhe a pessoa */}
        <div className="px-4 pt-3 border-t border-cw-border shrink-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-cw-muted shrink-0">Tópicos:</span>
            {GRUPOS_TOPICO.map((g) => (
              <button
                key={g.topico}
                type="button"
                onClick={() => setTopicoAberto((atual) => (atual === g.topico ? null : g.topico))}
                className={cn(
                  'px-3 py-1.5 rounded-full border text-[11.5px] font-semibold transition-colors',
                  topicoAberto === g.topico
                    ? 'gradient-primary text-white border-transparent'
                    : 'border-cw-border bg-cw-surface text-cw-text hover:border-cw-purple/40',
                )}
              >
                {g.topico}
              </button>
            ))}
          </div>

          {grupoAberto && (
            <div className="flex flex-wrap gap-1.5 pb-1">
              {grupoAberto.personas.flatMap((p) => p.perguntas).map((q) => (
                <button
                  key={q.pergunta}
                  type="button"
                  onClick={() => enviar(q.pergunta)}
                  disabled={pensando}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-full border border-cw-border bg-cw-elevated text-cw-text hover:border-cw-purple/40 hover:bg-white transition-colors disabled:opacity-40"
                >
                  {q.pergunta}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dicas de palavras-chave enquanto digita */}
        {sugestoes.length > 0 && (
          <div className="px-4 pt-2 flex flex-col gap-1.5 shrink-0">
            {sugestoes.map((s) => (
              <button
                key={s.persona.id + s.item.pergunta}
                type="button"
                onClick={() => enviar(s.item.pergunta)}
                className="flex items-center gap-2 text-left px-3 py-2 rounded-xl border border-cw-border bg-cw-elevated hover:border-cw-purple/40 hover:bg-white transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-cw-purple/60 shrink-0" />
                <span className="text-[12.5px] text-cw-text flex-1 min-w-0 truncate">{s.item.pergunta}</span>
              </button>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="p-4 pt-2 flex items-center gap-2 shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={pensando}
            placeholder="Digite sua pergunta..."
            className="flex-1 bg-cw-surface border border-cw-border rounded-full px-4 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={pensando || !input.trim()}
            className="h-10 w-10 rounded-full gradient-primary text-white flex items-center justify-center disabled:opacity-40 shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
