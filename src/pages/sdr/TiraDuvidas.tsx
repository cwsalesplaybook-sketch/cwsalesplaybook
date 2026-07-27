/** Tira-dúvidas — chat com "mini IAs" por pessoa do time. O SDR escolhe a
 *  persona relacionada ao assunto (ex: Parcerias → Vanessa) e conversa com
 *  ela. Não é IA generativa: cada persona responde só com o banco de
 *  perguntas pré-curadas em src/data/tiraDuvidas.ts, casado por palavra-chave
 *  (src/lib/matchDuvida.ts). Fora desse banco, cai no fallback com o Slack
 *  da pessoa real. */
import { useEffect, useRef, useState } from 'react';
import { MessageCircleQuestion, Send, ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIRA_DUVIDAS_PERSONAS, type DuvidaPersona } from '@/data/tiraDuvidas';
import { matchDuvida } from '@/lib/matchDuvida';

interface Mensagem {
  id: string;
  autor: 'sdr' | 'persona';
  texto: string;
}

function Avatar({ persona, size = 'md' }: { persona: DuvidaPersona; size?: 'md' | 'lg' }) {
  const [erro, setErro] = useState(false);
  const iniciais = persona.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  const dim = size === 'lg' ? 'h-14 w-14 text-base' : 'h-10 w-10 text-xs';

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

function PersonaCard({ persona, onClick }: { persona: DuvidaPersona; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="cw-card p-4 flex items-center gap-3 text-left hover:border-cw-purple/40 hover:bg-white transition-all duration-150"
    >
      <Avatar persona={persona} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm text-cw-text truncate">{persona.nome}</p>
        <p className="text-[11px] text-cw-muted truncate">{persona.cargo}</p>
        <p className="text-xs text-cw-purple font-medium mt-1 leading-snug">{persona.tema}</p>
      </div>
    </button>
  );
}

function ChatBubble({ msg, persona }: { msg: Mensagem; persona: DuvidaPersona }) {
  const isSdr = msg.autor === 'sdr';
  return (
    <div className={cn('flex items-end gap-2', isSdr && 'flex-row-reverse')}>
      {!isSdr && <Avatar persona={persona} />}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line leading-relaxed',
          isSdr
            ? 'gradient-primary text-white rounded-br-sm'
            : 'bg-cw-elevated border border-cw-border text-cw-text rounded-bl-sm',
        )}
      >
        {msg.texto}
      </div>
    </div>
  );
}

function ChatView({ persona, onVoltar }: { persona: DuvidaPersona; onVoltar: () => void }) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { id: 'saudacao', autor: 'persona', texto: persona.saudacao },
  ]);
  const [input, setInput] = useState('');
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const responder = (pergunta: string) => {
    const encontrada = matchDuvida(pergunta, persona);
    const resposta = encontrada
      ? encontrada.resposta
      : `Ainda não tenho uma resposta pronta pra isso 🤔 Manda esse papo direto pra mim (${persona.slack}) no Slack que eu te ajudo certinho.`;
    setMensagens((prev) => [
      ...prev,
      { id: `sdr-${Date.now()}`, autor: 'sdr', texto: pergunta },
      { id: `persona-${Date.now() + 1}`, autor: 'persona', texto: resposta },
    ]);
  };

  const enviar = () => {
    const texto = input.trim();
    if (!texto) return;
    responder(texto);
    setInput('');
  };

  return (
    <div className="cw-card flex flex-col h-[calc(100vh-13rem)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-cw-border shrink-0">
        <button onClick={onVoltar} className="text-cw-muted hover:text-cw-text shrink-0" title="Trocar de persona">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Avatar persona={persona} />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm text-cw-text truncate">{persona.nome}</p>
          <p className="text-[11px] text-cw-muted truncate">{persona.cargo}</p>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto scrollbar-cw p-4 space-y-4">
        {mensagens.map((m) => (
          <ChatBubble key={m.id} msg={m} persona={persona} />
        ))}
        <div ref={fimRef} />
      </div>

      {/* Sugestões rápidas */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5 shrink-0">
        {persona.perguntas.slice(0, 4).map((p) => (
          <button
            key={p.pergunta}
            onClick={() => responder(p.pergunta)}
            className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-cw-border bg-cw-surface text-cw-muted hover:text-cw-text hover:border-cw-purple/40 transition-colors"
          >
            {p.pergunta}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-cw-border flex items-center gap-2 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviar()}
          placeholder={`Pergunta pra ${persona.nome.split(' ')[0]}...`}
          className="flex-1 bg-cw-surface border border-cw-border rounded-xl px-3.5 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50"
        />
        <button
          onClick={enviar}
          disabled={!input.trim()}
          className="h-10 w-10 rounded-xl gradient-primary text-white flex items-center justify-center disabled:opacity-40 shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function TiraDuvidas() {
  const [personaId, setPersonaId] = useState<string | null>(null);
  const persona = TIRA_DUVIDAS_PERSONAS.find((p) => p.id === personaId) ?? null;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-cw-purple/10 border border-cw-purple/20 flex items-center justify-center shrink-0">
          <MessageCircleQuestion className="h-5 w-5 text-cw-purple" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-cw-text">Tira-dúvidas</h1>
          <p className="text-sm text-cw-muted mt-1">
            Escolha quem você quer perguntar. Cada pessoa responde com base no que já tá documentado no playbook.
          </p>
        </div>
      </div>

      <div className="cw-card p-3 flex items-start gap-2.5 bg-cw-purple/5 border-cw-purple/20">
        <Sparkles className="h-4 w-4 text-cw-purple shrink-0 mt-0.5" />
        <p className="text-xs text-cw-muted leading-relaxed">
          Isso <strong className="text-cw-text">não é a pessoa real</strong> nem uma IA generativa — são respostas
          pré-escritas com o estilo de cada um, puxadas do conteúdo já existente no playbook. Se a dúvida não estiver
          no banco, o assistente te manda direto pro Slack da pessoa.
        </p>
      </div>

      {!persona ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TIRA_DUVIDAS_PERSONAS.map((p) => (
            <PersonaCard key={p.id} persona={p} onClick={() => setPersonaId(p.id)} />
          ))}
        </div>
      ) : (
        <ChatView persona={persona} onVoltar={() => setPersonaId(null)} />
      )}
    </div>
  );
}
