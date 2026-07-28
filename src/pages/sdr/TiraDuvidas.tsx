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

function TopBar({ onResetar }: { onResetar: () => void }) {
  return (
    <div className="flex items-center justify-end gap-3 shrink-0">
      <button
        type="button"
        onClick={onResetar}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 text-xs font-semibold transition-all shrink-0"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Resetar chat
      </button>
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

function Hero({
  input,
  setInput,
  onSubmit,
  disabled,
}: {
  input: string;
  setInput: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-white min-h-[40vh] flex items-center">
      {/* Fundo: gradiente radial (é background, não um elemento com tamanho —
          nunca "corta quadrado" contra as bordas arredondadas do painel). */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 70% at 78% 45%, rgba(165,67,250,0.16), transparent 70%),' +
            'radial-gradient(ellipse 35% 35% at 12% 88%, rgba(255,182,0,0.10), transparent 70%)',
        }}
      />
      {/* Grafismos — presos dentro deste painel único, não vazam mais pro resto da página. */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-12 left-[22%] w-20 h-14 text-cw-purple/25" viewBox="0 0 100 60" fill="none">
          <path d="M2 40 C 30 5, 60 55, 98 15" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
        </svg>
        <Star className="absolute top-9 left-[18%] h-4 w-4 text-cw-purple/30" />
        <Sparkles className="absolute bottom-20 right-[40%] h-4 w-4 text-cw-purple/25" />
        <span className="absolute bottom-16 left-[8%] h-1.5 w-1.5 rounded-full bg-[#FF5959]/50" />
      </div>

      <button
        type="button"
        className="absolute right-6 top-6 z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cw-border bg-white text-cw-text text-xs font-semibold hover:border-cw-purple/40 transition-colors shadow-sm"
      >
        <Slack className="h-3.5 w-3.5 text-cw-purple" /> Falar no Slack
      </button>

      <div className="relative grid md:grid-cols-2 gap-10 items-center w-full px-8 md:px-14 py-14 md:py-20">
        <div>
          <p className="text-xl">Olá! 👋</p>
          <h1 className="text-[42px] md:text-[58px] font-black text-cw-text leading-[1.03] mt-1">
            Como podemos te <span className="text-cw-purple">ajudar</span> hoje?
          </h1>
          <p className="text-cw-muted text-[15px] mt-4 max-w-md leading-relaxed">
            Faça sua pergunta ou escolha um tópico abaixo para encontrar rapidamente a resposta que procura.
          </p>

          <form
            onSubmit={onSubmit}
            className="flex items-center gap-3 bg-white border border-cw-border/50 shadow-[0_4px_20px_rgba(89,50,122,0.07)] rounded-[20px] px-5 h-16 mt-7 max-w-lg"
          >
            <Search className="h-[18px] w-[18px] text-cw-muted shrink-0" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua pergunta..."
              className="flex-1 bg-transparent text-sm text-cw-text placeholder:text-cw-muted focus:outline-none"
            />
            <button
              type="submit"
              disabled={disabled || !input.trim()}
              className="h-11 w-11 rounded-2xl gradient-primary text-white flex items-center justify-center disabled:opacity-40 shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="flex flex-wrap gap-2 mt-6">
            <InfoBadge icon={Shield} texto="Respostas oficiais do Playbook" />
            <InfoBadge icon={RefreshCw} texto="Conteúdo sempre atualizado" />
            <InfoBadge icon={Slack} texto="Encaminhamos pro Slack da liderança" />
          </div>
        </div>

        <div
          className="relative flex items-center justify-center h-[260px] sm:h-[340px] md:h-[420px]"
          style={{
            background: 'radial-gradient(ellipse 62% 68% at 50% 46%, rgba(165,67,250,0.32), transparent 72%)',
          }}
        >
          <img
            src="/tira-duvidas/cardapinho-mascote.png"
            alt="Mascote Cardápio Web"
            className="relative h-full w-auto object-contain drop-shadow-2xl"
          />

          {/* Card em formato de balão de fala, com "rabinho" apontando pro mascote */}
          <div className="absolute right-0 top-4 max-w-[190px] cw-card px-4 py-3 hidden lg:block">
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
        'text-left p-4 rounded-2xl border bg-white transition-all duration-200',
        ativo
          ? 'border-cw-purple/40 shadow-[0_6px_20px_rgba(165,67,250,0.14)]'
          : 'border-transparent shadow-[0_1px_2px_rgba(89,50,122,0.04),0_2px_8px_rgba(89,50,122,0.03)] hover:shadow-[0_10px_28px_rgba(89,50,122,0.09)] hover:-translate-y-0.5',
      )}
    >
      <div className="h-9 w-9 rounded-lg bg-cw-purple/10 flex items-center justify-center mb-2.5">
        <Icone className="h-4 w-4 text-cw-purple" />
      </div>
      <p className="font-bold text-[14px] text-cw-text">{grupo.topico}</p>
      <p className="text-[12px] text-cw-muted mt-1 leading-snug">{grupo.personas[0].tema}</p>
    </button>
  );
}

function QuestionCard({ pergunta, onClick }: { pergunta: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between gap-3 text-left px-3.5 py-3 rounded-xl hover:bg-cw-elevated transition-colors group"
    >
      <span className="text-[13px] font-medium text-cw-text">{pergunta}</span>
      <ArrowRight className="h-3.5 w-3.5 text-cw-muted/60 group-hover:text-cw-purple group-hover:translate-x-0.5 transition-all shrink-0" />
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
      <div className="px-6 md:px-10 pt-4 pb-8 space-y-8">
        <Hero input={input} setInput={setInput} onSubmit={onSubmit} disabled={pensando} />

        <div className="bg-white rounded-[28px] border border-cw-border/40 shadow-[0_2px_28px_rgba(89,50,122,0.05)] p-8 md:p-12 space-y-12">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <LayoutGrid className="h-4 w-4 text-cw-purple" />
              <h2 className="font-black text-cw-text text-[15px]">Navegue por assuntos</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="flex flex-wrap gap-1.5 mt-4">
                {grupoAberto.personas.flatMap((p) => p.perguntas).map((q) => (
                  <button
                    key={q.pergunta}
                    type="button"
                    onClick={() => enviar(q.pergunta)}
                    className="text-[12px] font-medium px-3 py-1.5 rounded-full bg-cw-elevated text-cw-text hover:bg-cw-purple/10 hover:text-cw-purple transition-colors"
                  >
                    {q.pergunta}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-5">
              <Flame className="h-4 w-4 text-cw-purple" />
              <h2 className="font-black text-cw-text text-[15px]">Perguntas populares</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-1">
              {(mostrarTodas ? TODAS_PERGUNTAS : PERGUNTAS_POPULARES).map((item, i) => (
                <QuestionCard key={item.pergunta + i} pergunta={item.pergunta} onClick={() => enviar(item.pergunta)} />
              ))}
              {!mostrarTodas && (
                <button
                  type="button"
                  onClick={() => setMostrarTodas(true)}
                  className="flex items-center justify-between gap-3 text-left px-3.5 py-3 rounded-xl hover:bg-cw-elevated transition-colors"
                >
                  <span className="text-[13px] font-bold text-cw-purple">Ver todas as perguntas</span>
                  <LayoutGrid className="h-3.5 w-3.5 text-cw-purple" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 text-[11px] text-cw-muted">
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
      <TopBar onResetar={resetar} />

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
