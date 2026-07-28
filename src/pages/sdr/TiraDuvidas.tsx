/** Tira-dúvidas — chat único com roteamento automático pra "mini IA" da
 *  pessoa certa do time. O SDR não escolhe a persona: manda a pergunta e o
 *  motor de busca (src/lib/matchDuvida.ts) acha quem tem a resposta no banco
 *  pré-curado (src/data/tiraDuvidas.ts). Sem IA generativa — fora do banco,
 *  cai no fallback com o Slack da pessoa responsável. */
import { useEffect, useRef, useState } from 'react';
import { MessageCircleQuestion, Search, Send, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIRA_DUVIDAS_PERSONAS, type DuvidaPersona } from '@/data/tiraDuvidas';
import { routeDuvida } from '@/lib/matchDuvida';

interface Mensagem {
  id: string;
  autor: 'sdr' | 'persona';
  texto: string;
  intro?: boolean;
  fallback?: boolean;
  persona?: DuvidaPersona;
}

type Fase = 'idle' | 'routing' | 'chatting';

const ROTEAMENTO_MS = 700;
const BUSCA_MS = 1500;

function Avatar({ persona, size = 'md' }: { persona: DuvidaPersona; size?: 'sm' | 'md' | 'lg' }) {
  const [erro, setErro] = useState(false);
  const iniciais = persona.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  const dim = size === 'lg' ? 'h-14 w-14 text-base' : size === 'sm' ? 'h-[26px] w-[26px] text-[10px]' : 'h-10 w-10 text-xs';

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
      <div className={cn('max-w-[65%] flex flex-col gap-1.5', isSdr && 'items-end')}>
        {!isSdr && msg.intro && msg.persona && (
          <div className="flex items-center gap-2 pl-0.5">
            <Avatar persona={msg.persona} size="sm" />
            <span className="text-[11.5px] font-bold text-cw-text">{msg.persona.nome}</span>
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

function RoutingScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3.5 text-cw-muted">
      <Dots size="md" />
      <div className="text-[13px] font-semibold">Encontrando quem sabe responder isso…</div>
    </div>
  );
}

export default function TiraDuvidas() {
  const [fase, setFase] = useState<Fase>('idle');
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState('');
  const [pensando, setPensando] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);
  const roteamentoRef = useRef<ReturnType<typeof setTimeout>>();
  const buscaRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, pensando]);

  useEffect(() => () => {
    clearTimeout(roteamentoRef.current);
    clearTimeout(buscaRef.current);
  }, []);

  const enviar = (textoBruto: string) => {
    const texto = textoBruto.trim();
    if (!texto || fase === 'routing' || pensando) return;
    setInput('');
    setFase('routing');
    roteamentoRef.current = setTimeout(() => {
      const { persona, item } = routeDuvida(texto, TIRA_DUVIDAS_PERSONAS);
      setMensagens([
        { id: `sdr-${Date.now()}`, autor: 'sdr', texto },
        { id: `intro-${Date.now()}`, autor: 'persona', texto: persona.saudacao, intro: true, persona },
      ]);
      setFase('chatting');
      setPensando(true);
      buscaRef.current = setTimeout(() => {
        const resposta = item
          ? item.resposta
          : `Isso ainda não tá documentado no meu playbook. Já te encaminhei pro Slack d${persona.artigo} ${persona.nome} (${persona.slack}) pra garantir a resposta certa.`;
        setMensagens((prev) => [...prev, { id: `resp-${Date.now()}`, autor: 'persona', texto: resposta, fallback: !item, persona }]);
        setPensando(false);
      }, BUSCA_MS);
    }, ROTEAMENTO_MS);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviar(input);
  };

  const perguntasSugeridas = TIRA_DUVIDAS_PERSONAS.map((p) => p.perguntas[0]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-cw-purple/10 border border-cw-purple/20 flex items-center justify-center shrink-0">
          <MessageCircleQuestion className="h-5 w-5 text-cw-purple" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-cw-text">Tira-dúvidas</h1>
          <p className="text-sm text-cw-muted mt-1">
            Manda sua pergunta. A gente acha sozinho quem do time responde certinho.
          </p>
        </div>
      </div>

      <div className="cw-card flex flex-col h-[calc(100vh-13rem)] overflow-hidden">
        {fase === 'routing' && <RoutingScreen />}

        {fase === 'chatting' && (
          <>
            <div className="flex items-start gap-3 p-5 border-b border-cw-border shrink-0">
              <div className="w-[34px] h-[34px] rounded-lg bg-cw-purple/10 flex items-center justify-center shrink-0">
                <MessageCircleQuestion className="h-4 w-4 text-cw-purple" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-cw-text">Tira-dúvidas</p>
                <p className="text-[11.5px] text-cw-muted leading-relaxed mt-0.5">
                  Base de conhecimento oficial das lideranças. As respostas são consultadas diretamente nos
                  playbooks validados. Se a gente não encontrar a informação, sua dúvida é encaminhada
                  automaticamente pro Slack da liderança responsável.
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-cw p-5 space-y-4">
              {mensagens.map((m) => (
                <ChatBubble key={m.id} msg={m} />
              ))}
              {pensando && <ThinkingIndicator />}
              <div ref={fimRef} />
            </div>

            <form onSubmit={onSubmit} className="p-4 border-t border-cw-border flex items-center gap-2 shrink-0">
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
          </>
        )}

        {fase === 'idle' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-[18px] text-cw-muted px-10">
            <div className="w-14 h-14 rounded-full bg-cw-purple/10 flex items-center justify-center">
              <Search className="h-6 w-6 text-cw-purple/70" />
            </div>
            <div className="text-[15px] font-semibold text-center text-cw-text">
              Faça sua pergunta. Encontre respostas oficiais em segundos.
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-xl">
              {perguntasSugeridas.map((p) => (
                <button
                  key={p.pergunta}
                  type="button"
                  onClick={() => enviar(p.pergunta)}
                  className="text-[12.5px] font-semibold px-3.5 py-1.5 rounded-2xl border border-cw-purple/30 bg-cw-surface text-cw-purple hover:bg-cw-purple/5 transition-colors"
                >
                  {p.pergunta}
                </button>
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex items-center gap-2 w-full max-w-xl">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua pergunta..."
                className="flex-1 bg-cw-surface border border-cw-border rounded-full px-4 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="h-10 w-10 rounded-full gradient-primary text-white flex items-center justify-center disabled:opacity-40 shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
