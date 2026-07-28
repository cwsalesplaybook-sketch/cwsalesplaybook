/** Tira-dúvidas — chat único e contínuo (estilo WhatsApp) com roteamento
 *  100% automático pra pessoa certa do time. O SDR escolhe um TÓPICO e uma
 *  pergunta pré-cadastrada (ou digita livremente) — nunca escolhe quem
 *  responde, isso é sempre automático (src/lib/matchDuvida.ts). Sem IA
 *  generativa: banco fixo em src/data/tiraDuvidas.ts. Fora do banco, cai no
 *  fallback com o Slack da pessoa responsável. */
import { useEffect, useRef, useState } from 'react';
import { MessageCircleQuestion, Send, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIRA_DUVIDAS_PERSONAS, type DuvidaPersona } from '@/data/tiraDuvidas';
import { routeDuvida, suggestDuvidas, type DuvidaSugestao } from '@/lib/matchDuvida';

interface Mensagem {
  id: string;
  autor: 'sdr' | 'persona';
  texto: string;
  intro?: boolean;
  fallback?: boolean;
  persona?: DuvidaPersona;
}

const PENSANDO_MS = 900;

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

export default function TiraDuvidas() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState('');
  const [pensando, setPensando] = useState(false);
  const [topicoAberto, setTopicoAberto] = useState<string | null>(TIRA_DUVIDAS_PERSONAS[0]?.id ?? null);
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

    buscaRef.current = setTimeout(() => {
      const { persona, item } = routeDuvida(texto, TIRA_DUVIDAS_PERSONAS);

      const primeiraVez = !apresentadosRef.current.has(persona.id);
      apresentadosRef.current.add(persona.id);
      const corpo = item
        ? item.resposta
        : `Isso ainda não tá documentado no meu playbook. Já te encaminhei pro Slack d${persona.artigo} ${persona.nome} (${persona.slack}) pra garantir a resposta certa.`;
      const resposta = primeiraVez ? `${persona.saudacao}\n\n${corpo}` : corpo;

      setMensagens((prev) => {
        const ultimaPersonaMsg = [...prev].reverse().find((m) => m.autor === 'persona');
        const trocouDePersona = !ultimaPersonaMsg || ultimaPersonaMsg.persona?.id !== persona.id;
        return [...prev, { id: `resp-${Date.now()}`, autor: 'persona', texto: resposta, intro: trocouDePersona, fallback: !item, persona }];
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
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviar(input);
  };

  const sugestoes: DuvidaSugestao[] = input.trim().length >= 2 && !pensando ? suggestDuvidas(input, TIRA_DUVIDAS_PERSONAS) : [];
  const personaTopicoAberto = TIRA_DUVIDAS_PERSONAS.find((p) => p.id === topicoAberto) ?? null;

  return (
    <div className="p-4 h-[calc(100vh-1.5rem)] flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <MessageCircleQuestion className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-black text-cw-text leading-tight">Tira-dúvidas</h1>
            <p className="text-xs text-cw-muted leading-tight">
              Base de conhecimento oficial das lideranças — escolha um tópico ou pergunte, a resposta certa
              chega automaticamente. Fora do banco, encaminha pro Slack da pessoa responsável.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={resetar}
          disabled={mensagens.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 text-xs font-semibold transition-all shrink-0 disabled:opacity-40 disabled:pointer-events-none"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Resetar chat
        </button>
      </div>

      <div className="cw-card flex-1 flex flex-col overflow-hidden">
        {mensagens.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-cw-muted px-10 text-center">
            <div className="w-14 h-14 rounded-full bg-cw-purple/10 flex items-center justify-center">
              <MessageCircleQuestion className="h-6 w-6 text-cw-purple/70" />
            </div>
            <div className="text-[15px] font-semibold text-cw-text">
              Escolha um tópico abaixo ou digite sua pergunta.
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto scrollbar-cw p-5 space-y-4">
            {mensagens.map((m) => (
              <ChatBubble key={m.id} msg={m} />
            ))}
            {pensando && <ThinkingIndicator />}
            <div ref={fimRef} />
          </div>
        )}

        {/* Tópicos — sempre visíveis, o SDR nunca escolhe a pessoa */}
        <div className="px-4 pt-3 border-t border-cw-border shrink-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-cw-muted shrink-0">Tópicos:</span>
            {TIRA_DUVIDAS_PERSONAS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setTopicoAberto((atual) => (atual === p.id ? null : p.id))}
                className={cn(
                  'px-3 py-1.5 rounded-full border text-[11.5px] font-semibold transition-colors',
                  topicoAberto === p.id
                    ? 'gradient-primary text-white border-transparent'
                    : 'border-cw-border bg-cw-surface text-cw-text hover:border-cw-purple/40',
                )}
              >
                {p.topico}
              </button>
            ))}
          </div>

          {personaTopicoAberto && (
            <div className="flex flex-wrap gap-1.5 pb-1">
              {personaTopicoAberto.perguntas.map((q) => (
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
