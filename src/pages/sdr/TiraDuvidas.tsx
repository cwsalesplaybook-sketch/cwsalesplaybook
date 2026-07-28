/** Tira-dúvidas — chat único e contínuo (estilo WhatsApp) com roteamento
 *  automático pra "mini IA" da pessoa certa do time, ou escolha manual de
 *  quem perguntar. Enquanto o SDR digita, mostra dicas das perguntas
 *  pré-cadastradas mais parecidas (sem IA generativa — banco fixo em
 *  src/data/tiraDuvidas.ts, casado por palavra-chave em
 *  src/lib/matchDuvida.ts). Fora do banco, cai no fallback com o Slack da
 *  pessoa responsável. */
import { useEffect, useRef, useState } from 'react';
import { MessageCircleQuestion, Send, Sparkles, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIRA_DUVIDAS_PERSONAS, type DuvidaPersona } from '@/data/tiraDuvidas';
import { routeDuvida, matchDuvida, suggestDuvidas, type DuvidaSugestao } from '@/lib/matchDuvida';

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
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 text-[10.5px] font-bold px-2.5 py-1 rounded-lg">
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
  const [alvo, setAlvo] = useState<DuvidaPersona | null>(null);
  const fimRef = useRef<HTMLDivElement>(null);
  const buscaRef = useRef<ReturnType<typeof setTimeout>>();
  const apresentadosRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, pensando]);

  useEffect(() => () => clearTimeout(buscaRef.current), []);

  const enviar = (textoBruto: string, personaClicada?: DuvidaPersona) => {
    const texto = textoBruto.trim();
    if (!texto || pensando) return;
    setInput('');
    setMensagens((prev) => [...prev, { id: `sdr-${Date.now()}`, autor: 'sdr', texto }]);
    setPensando(true);

    buscaRef.current = setTimeout(() => {
      const personaAlvo = personaClicada ?? alvo;
      let persona: DuvidaPersona;
      let item: ReturnType<typeof matchDuvida>;
      if (personaAlvo) {
        persona = personaAlvo;
        item = matchDuvida(texto, personaAlvo);
      } else {
        const rota = routeDuvida(texto, TIRA_DUVIDAS_PERSONAS);
        persona = rota.persona;
        item = rota.item;
      }

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviar(input);
  };

  const escopoSugestao = alvo ? [alvo] : TIRA_DUVIDAS_PERSONAS;
  const sugestoes: DuvidaSugestao[] = input.trim().length >= 2 && !pensando ? suggestDuvidas(input, escopoSugestao) : [];
  const perguntasIniciais = TIRA_DUVIDAS_PERSONAS.map((p) => p.perguntas[0]);

  return (
    <div className="p-4 h-[calc(100vh-1.5rem)] flex flex-col gap-3">
      <div className="flex items-center gap-3 shrink-0">
        <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
          <MessageCircleQuestion className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-black text-cw-text leading-tight">Tira-dúvidas</h1>
          <p className="text-xs text-cw-muted leading-tight">
            Base de conhecimento oficial das lideranças — manda a pergunta e a gente acha quem responde. Fora do
            banco, encaminha automaticamente pro Slack da pessoa certa.
          </p>
        </div>
      </div>

      <div className="cw-card flex-1 flex flex-col overflow-hidden">
        {mensagens.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-cw-muted px-10 text-center">
            <div className="w-14 h-14 rounded-full bg-cw-purple/10 flex items-center justify-center">
              <MessageCircleQuestion className="h-6 w-6 text-cw-purple/70" />
            </div>
            <div className="text-[15px] font-semibold text-cw-text">
              Manda sua pergunta, igual num WhatsApp. A gente acha sozinho quem do time responde.
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-xl">
              {perguntasIniciais.map((p, i) => (
                <button
                  key={p.pergunta}
                  type="button"
                  onClick={() => enviar(p.pergunta, TIRA_DUVIDAS_PERSONAS[i])}
                  className="text-[12.5px] font-semibold px-3.5 py-1.5 rounded-2xl border border-cw-purple/30 bg-cw-surface text-cw-purple hover:bg-cw-purple/5 transition-colors"
                >
                  {p.pergunta}
                </button>
              ))}
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

        {/* Escolher com quem falar */}
        <div className="px-4 pt-3 border-t border-cw-border shrink-0">
          {alvo ? (
            <div className="flex items-center gap-2 pb-2.5">
              <span className="text-[11px] text-cw-muted">Perguntando direto pra:</span>
              <span className="inline-flex items-center gap-1.5 bg-cw-purple/10 text-cw-purple text-[11.5px] font-bold px-2 py-1 rounded-full">
                <Avatar persona={alvo} size="sm" />
                {alvo.nome}
                <button type="button" onClick={() => setAlvo(null)} title="Voltar pro automático" className="ml-0.5 hover:text-cw-text">
                  <X className="h-3 w-3" />
                </button>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 pb-2.5 flex-wrap">
              <span className="text-[11px] text-cw-muted shrink-0">Ou pergunte direto pra:</span>
              {TIRA_DUVIDAS_PERSONAS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setAlvo(p)}
                  title={`Falar direto com ${p.nome}`}
                  className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full border border-cw-border bg-cw-surface hover:border-cw-purple/40 transition-colors"
                >
                  <Avatar persona={p} size="sm" />
                  <span className="text-[11.5px] font-semibold text-cw-text">{p.nome}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dicas de palavras-chave */}
        {sugestoes.length > 0 && (
          <div className="px-4 pb-2 flex flex-col gap-1.5 shrink-0">
            {sugestoes.map((s) => (
              <button
                key={s.persona.id + s.item.pergunta}
                type="button"
                onClick={() => enviar(s.item.pergunta, s.persona)}
                className="flex items-center gap-2 text-left px-3 py-2 rounded-xl border border-cw-border bg-cw-elevated hover:border-cw-purple/40 hover:bg-white transition-colors"
              >
                <Avatar persona={s.persona} size="sm" />
                <span className="text-[12.5px] text-cw-text flex-1 min-w-0 truncate">{s.item.pergunta}</span>
                <span className="text-[10px] font-bold text-cw-purple uppercase tracking-wider shrink-0">{s.persona.nome}</span>
              </button>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="p-4 pt-0 flex items-center gap-2 shrink-0">
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
