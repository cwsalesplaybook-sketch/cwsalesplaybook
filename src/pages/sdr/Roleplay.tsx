/** Roleplay — simulador de call do SDR. Substitui a antiga Tira-dúvidas na
 *  navegação do SDR. Você conduz uma ligação de qualificação (SPIN/BANT)
 *  contra um cliente fictício do funil: quatro medidores ocultos (Confiança,
 *  Informação, Urgência, Paciência) decidem se ele topa marcar a reunião com
 *  o consultor — você nunca vê os números, só a fala, o clima e a postura.
 *  Motor do jogo em src/lib/roleplay/engine.ts, conteúdo em
 *  src/data/roleplay/{conteudo,personas,vozes}.ts, placar via Supabase
 *  (useRoleplayScores) ligado ao usuário logado — sem nome digitado à mão. */
import { useEffect, useMemo, useState } from 'react';
import {
  Sparkles, ArrowRight, RotateCcw, Trophy,
  Lightbulb, AlertTriangle, CheckCircle2, XCircle, Timer, Target,
  Clock, UserMinus, ShieldOff, User as UserIcon, TrendingUp, Smile,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRoleplayScores } from '@/hooks/useRoleplayScores';
import { PERSONAS, type Persona } from '@/data/roleplay/personas';
import { REVELACAO } from '@/data/roleplay/conteudo';
import {
  novaPartida, jogar, carta, sinal, txt, climaAtual, posturaAtual, calcularPontos,
  rotuloFamilia, ORDEM_DIF, type GameState,
} from '@/lib/roleplay/engine';

type Tela = 'menu' | 'briefing' | 'jogo' | 'fim' | 'placar';
const DIFICULDADES = ['todos', 'Treino', 'Média', 'Difícil', 'Muito difícil'] as const;

/** Ícone por postura — sem foto/avatar, só o ícone animado (respiração
 *  contínua + pulso a cada fala + crossfade ao trocar de leitura). */
const POSE_ICON: Record<string, typeof Clock> = {
  relogio: Clock, recuado: UserMinus, cruzado: ShieldOff, neutro: UserIcon,
  inclinado: TrendingUp, aberto: Smile,
};

/** Transform/opacidade por postura, composto com a animação de respiração
 *  (transform no wrapper de fora) e o "falando" (no wrapper de dentro). */
const POSE_TRANSFORM: Record<string, { transform: string; opacity: string }> = {
  relogio: { transform: 'translateX(5px) rotate(-4deg) scale(0.96)', opacity: '0.7' },
  recuado: { transform: 'translateY(5px) scale(0.92)', opacity: '0.8' },
  cruzado: { transform: 'scale(0.96) rotate(1deg)', opacity: '0.88' },
  neutro: { transform: 'scale(1)', opacity: '1' },
  inclinado: { transform: 'translateY(-5px) scale(1.06)', opacity: '1' },
  aberto: { transform: 'scale(1.08) rotate(-1deg)', opacity: '1' },
};

const DIF_COLOR: Record<string, string> = {
  'Treino': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Média': 'bg-cw-purple/10 text-cw-purple border-cw-purple/25',
  'Difícil': 'bg-amber-100 text-amber-700 border-amber-200',
  'Muito difícil': 'bg-cw-red/10 text-cw-red border-cw-red/25',
};

const FIM_COLOR: Record<string, string> = {
  vitoria: 'bg-emerald-100 text-emerald-700',
  parcial: 'bg-amber-100 text-amber-700',
  derrota: 'bg-cw-red/10 text-cw-red',
  tempo: 'bg-cw-red/10 text-cw-red',
};

type Humor = 'irritado' | 'frio' | 'neutro' | 'quente';
function humorDe(sinalAtual: number, pac: number): Humor {
  if (pac < 32) return 'irritado';
  if (sinalAtual < 42) return 'frio';
  if (sinalAtual > 68) return 'quente';
  return 'neutro';
}
const HUMOR_COR: Record<Humor, string> = { irritado: '#FF5959', frio: '#FF9A7A', neutro: '#A543FA', quente: '#22c55e' };
const HUMOR_LABEL: Record<Humor, string> = { irritado: 'Perdendo a paciência', frio: 'Distante', neutro: 'Acompanhando', quente: 'Engajado' };
const HUMOR_DURACAO: Record<Humor, string> = { irritado: '0.6s', frio: '2.8s', neutro: '2s', quente: '1.5s' };

/** Traço "com vida" — a linha nunca fica parada (fluxo contínuo no
 *  traçado) e pulsa mais rápido quando o humor vira irritado, pra dar ao
 *  SDR uma leitura indireta de que o cliente tá perdendo a paciência,
 *  sem nunca mostrar o número. */
function Sparkline({ serie, humor }: { serie: number[]; humor: Humor }) {
  const w = 100, h = 30;
  const pts = serie.length > 1
    ? serie.map((v, i) => `${(i / (serie.length - 1)) * w},${h - (v / 100) * h}`).join(' ')
    : `0,${h} ${w},${h}`;
  const ultimoX = serie.length > 1 ? w : 0;
  const ultimoY = h - ((serie[serie.length - 1] ?? 0) / 100) * h;
  const cor = HUMOR_COR[humor];
  const duracao = HUMOR_DURACAO[humor];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-10 overflow-visible">
      <polyline
        points={pts} fill="none" stroke={cor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="5 4" className="animate-sparkline-flow" style={{ animationDuration: duracao }}
      />
      <circle cx={ultimoX} cy={ultimoY} r="2.4" fill={cor} />
      <circle
        cx={ultimoX} cy={ultimoY} r="2.4" fill={cor} className="animate-sparkline-pulse"
        style={{ animationDuration: duracao, transformOrigin: `${ultimoX}px ${ultimoY}px` }}
      />
    </svg>
  );
}

function Medidor({ label, valor, cor }: { label: string; valor: number; cor: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[13px] mb-1.5">
        <b className="font-semibold text-cw-text">{label}</b>
        <span className="font-mono text-cw-muted">{Math.round(valor)}%</span>
      </div>
      <div className="h-2 rounded-full bg-cw-elevated overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${valor}%`, backgroundColor: cor }} />
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold border', className)}>{children}</span>;
}

export default function Roleplay() {
  const [telaAtual, setTelaAtual] = useState<Tela>('menu');
  const [filtroDif, setFiltroDif] = useState<string>('todos');
  const [briefingId, setBriefingId] = useState<string | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [salvarMsg, setSalvarMsg] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const profile = useUserProfile();
  const { scores, loading: loadingScores, salvar } = useRoleplayScores();

  useEffect(() => {
    if (state?.fim && telaAtual === 'jogo') setTelaAtual('fim');
  }, [state?.fim, telaAtual]);

  const personasOrdenadas = useMemo(() => (
    [...PERSONAS].sort((a, b) => (ORDEM_DIF[a.dificuldade] ?? 9) - (ORDEM_DIF[b.dificuldade] ?? 9))
  ), []);
  const personasFiltradas = filtroDif === 'todos' ? personasOrdenadas : personasOrdenadas.filter((p) => p.dificuldade === filtroDif);
  const briefingPersona: Persona | null = briefingId ? PERSONAS.find((p) => p.id === briefingId) ?? null : null;

  function abrirBriefing(pid: string) { setBriefingId(pid); setTelaAtual('briefing'); }
  function iniciar(pid: string) {
    setState(novaPartida(pid));
    setSalvo(false); setSalvarMsg('');
    setTelaAtual('jogo');
  }
  function jogarCarta(id: string) { setState((s) => (s ? jogar(s, id) : s)); }
  function reiniciar() { setState(null); setBriefingId(null); setTelaAtual('menu'); }

  async function salvarPlacar() {
    if (!state?.fim || salvando) return;
    setSalvando(true);
    const nome = profile.fullName || profile.email || 'SDR';
    const r = await salvar(state, nome);
    setSalvando(false);
    if (r.ok) { setSalvo(true); setSalvarMsg('Salvo no placar do time.'); }
    else setSalvarMsg(r.motivo || 'Não consegui salvar. Tenta de novo.');
  }

  return (
    <div className="px-6 md:px-10 pt-4 pb-10 space-y-6">
      {telaAtual === 'menu' && (
        <MenuTela
          filtroDif={filtroDif} setFiltroDif={setFiltroDif}
          personas={personasFiltradas} total={PERSONAS.length}
          onAbrir={abrirBriefing} onVerPlacar={() => setTelaAtual('placar')}
        />
      )}
      {telaAtual === 'briefing' && briefingPersona && (
        <BriefingTela persona={briefingPersona} onEntrar={() => iniciar(briefingPersona.id)} onVoltar={reiniciar} />
      )}
      {telaAtual === 'jogo' && state && (
        <JogoTela state={state} onJogar={jogarCarta} />
      )}
      {telaAtual === 'fim' && state?.fim && (
        <FimTela
          state={state} salvo={salvo} salvando={salvando} salvarMsg={salvarMsg}
          onSalvar={salvarPlacar} onReiniciar={reiniciar} onVerPlacar={() => setTelaAtual('placar')}
        />
      )}
      {telaAtual === 'placar' && (
        <PlacarTela scores={scores} loading={loadingScores} onVoltar={reiniciar} />
      )}
    </div>
  );
}

/* ============================================================ MENU */
function MenuTela({ filtroDif, setFiltroDif, personas, total, onAbrir, onVerPlacar }: {
  filtroDif: string; setFiltroDif: (d: string) => void; personas: Persona[]; total: number;
  onAbrir: (id: string) => void; onVerPlacar: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[28px] border border-cw-border/40 shadow-[0_2px_28px_rgba(89,50,122,0.05)] p-8 md:p-10 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full">
          <p className="text-[11.5px] font-mono uppercase tracking-[0.14em] text-cw-purple font-semibold mb-3">Roleplay · Treinamento de SDR</p>
          <h1 className="text-[32px] md:text-[42px] font-black text-cw-text leading-[1.05]">
            Sala de <span className="text-gradient-primary">Call</span>
          </h1>
          <p className="text-cw-muted text-[15px] mt-3 max-w-2xl leading-relaxed">
            Você liga pra um cliente real do nosso funil. Quatro medidores decidem se ele topa marcar com o
            consultor, e você não vê nenhum deles. Só a fala, o clima e a postura do outro lado.
          </p>
          <button
            type="button" onClick={onVerPlacar}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cw-border bg-white text-cw-text text-[13px] font-semibold hover:border-cw-purple/40 transition-colors"
          >
            <Trophy className="h-4 w-4 text-cw-purple" /> Ver o placar do time
          </button>
        </div>
        <div className="shrink-0 w-full md:w-[260px] flex items-center justify-center">
          <img src="/tira-duvidas/cardapinho-mascote.png" alt="Cardapinho, o mascote da Cardápio Web" className="h-44 md:h-52 w-auto object-contain" />
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-cw-border/40 shadow-[0_2px_28px_rgba(89,50,122,0.05)] p-6 md:p-8">
        <h2 className="font-black text-cw-text text-[15px] mb-3">Como se joga</h2>
        <ul className="space-y-2 text-[13.5px] text-cw-muted leading-relaxed">
          <li>· Cada carta é uma jogada, SPIN, escuta, valor e agenda. O efeito depende do estado da call, não da carta.</li>
          <li>· Enfileirar pergunta atrás de pergunta vira interrogatório, e o cliente reage.</li>
          <li>· A objeção que o cliente declara <b className="text-cw-text">nunca</b> é o motivo real. Existe uma raiz oculta.</li>
          <li>· As cartas certas no momento certo revelam a raiz e liberam uma carta nova.</li>
          <li>· Alguns clientes dão uma explicação falsa antes da verdadeira. Nem toda confissão é a raiz.</li>
          <li>· Convidar pra call cedo demais queima. Tarde demais também: a janela abre e fecha.</li>
          <li>· A paciência é finita e invisível. Diagnóstico consome mais que qualquer coisa.</li>
        </ul>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-cw-text text-[15px]">Escolha o cliente</h2>
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {DIFICULDADES.map((d) => {
            const n = d === 'todos' ? total : personas.filter((p) => p.dificuldade === d).length;
            return (
              <button
                key={d} type="button" onClick={() => setFiltroDif(d)}
                className={cn(
                  'px-3.5 py-2 rounded-full text-[12.5px] font-semibold border transition-colors',
                  filtroDif === d ? 'gradient-primary text-white border-transparent' : 'border-cw-border bg-white text-cw-muted hover:border-cw-purple/40',
                )}
              >
                {d === 'todos' ? 'Todos' : d} <span className="opacity-70 font-mono ml-1">{d === 'todos' ? total : PERSONAS.filter((p) => p.dificuldade === d).length}</span>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {personas.map((p) => (
            <button
              key={p.id} type="button" onClick={() => onAbrir(p.id)}
              className="cw-card cw-card-hover text-left p-5 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="h-10 w-10 rounded-xl gradient-primary text-white flex items-center justify-center font-bold text-[13px]">{p.iniciais}</span>
                <Badge className={DIF_COLOR[p.dificuldade]}>{p.dificuldade}</Badge>
              </div>
              <h3 className="font-bold text-cw-text text-[15.5px]">{p.nome}</h3>
              <p className="text-[13px] text-cw-muted mt-0.5">{p.empresa}</p>
              <p className="text-[11.5px] font-mono text-cw-muted/80 mt-1">{p.segmento}</p>
              <p className="text-[13px] text-cw-text mt-3 border-l-2 border-cw-red pl-2.5 leading-snug">{p.objecaoDeclarada}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================ BRIEFING */
function BriefingTela({ persona, onEntrar, onVoltar }: { persona: Persona; onEntrar: () => void; onVoltar: () => void }) {
  const rev = REVELACAO[persona.dificuldade];
  return (
    <div>
      <div className="cw-card p-7 md:p-10 space-y-5">
        <div className="flex items-center gap-4">
          <span className="h-14 w-14 rounded-2xl gradient-primary text-white flex items-center justify-center font-bold text-[17px] shrink-0">{persona.iniciais}</span>
          <div>
            <h2 className="font-black text-cw-text text-[20px]">{persona.nome}</h2>
            <p className="text-[13px] text-cw-muted">{persona.empresa} · {persona.segmento}</p>
          </div>
        </div>

        <Campo label="Como o cliente chegou">{persona.briefing}</Campo>
        <Campo label="Objeção declarada"><span className="border-l-2 border-cw-red pl-2.5 block">{persona.objecaoDeclarada}</span></Campo>
        <div className="grid grid-cols-2 gap-4">
          <Campo label="Dificuldade">{persona.dificuldade}</Campo>
          <Campo label="Turnos disponíveis">{persona.turnos} jogadas até o fim da ligação</Campo>
        </div>
        <Campo label="Como você joga neste nível">
          {rev.badgeRaiz
            ? 'Você recebe avisos durante a call: quando a raiz aparece e quando a janela de agendamento abre.'
            : 'Sem avisos durante a call. A leitura é só pelo traço, pela postura e pela fala, tudo é explicado no debrief.'}
        </Campo>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onEntrar} className="flex-1 gradient-primary text-white font-bold text-[14.5px] py-3.5 rounded-xl hover:opacity-90 transition-opacity">
            Entrar na call
          </button>
          <button type="button" onClick={onVoltar} className="px-5 py-3.5 rounded-xl border border-cw-border text-cw-muted font-semibold text-[14.5px] hover:border-cw-purple/40 transition-colors">
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10.5px] font-mono uppercase tracking-[0.12em] text-cw-purple font-semibold mb-1">{label}</p>
      <p className="text-[14px] text-cw-text leading-relaxed">{children}</p>
    </div>
  );
}

/* ============================================================ JOGO */
function JogoTela({ state, onJogar }: { state: GameState; onJogar: (id: string) => void }) {
  const p = state.persona, rev = state.rev;
  const pose = posturaAtual(state);
  const s = sinal(state);
  const humor = humorDe(s, state.pac);
  const corSinal = humor === 'irritado' || humor === 'frio' ? 'text-cw-red' : humor === 'quente' ? 'text-emerald-600' : 'text-cw-purple';
  const corGlow = HUMOR_COR[humor];
  const PoseIcon = POSE_ICON[pose.pose] ?? UserIcon;
  const poseStyle = POSE_TRANSFORM[pose.pose] ?? POSE_TRANSFORM.neutro;

  return (
    <div className="space-y-4">
      {/* Fixo ao rolar, pra continuar vendo quem é o cliente e o estado da
          call enquanto escolhe a carta lá embaixo. */}
      <div className="sticky top-0 z-10 bg-cw-bg pt-1 pb-3 -mx-6 px-6 md:-mx-10 md:px-10 space-y-3 shadow-[0_8px_16px_-8px_rgba(89,50,122,0.12)]">
        <div className="cw-card p-4 flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl gradient-primary text-white flex items-center justify-center font-bold text-[13px] shrink-0">{p.iniciais}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-cw-text text-[15px] truncate">{p.nome}</h3>
            <p className="text-[12px] text-cw-muted truncate">{p.empresa}</p>
          </div>
          <span className="font-mono text-[13.5px] bg-cw-purple/10 text-cw-purple px-3 py-1.5 rounded-lg font-semibold shrink-0">
            {Math.min(state.fim ? state.turno : state.turno + 1, state.turnosMax)}/{state.turnosMax}
          </span>
        </div>

        {(state.raizRevelada || state.janelaAte || state.raizFalsaRevelada) && (
          <div className="flex flex-wrap gap-2">
            {rev.badgeRaiz && state.raizRevelada && <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200"><CheckCircle2 className="h-3 w-3" /> Raiz revelada, carta nova na mão</Badge>}
            {rev.badgeJanela && state.janelaAte && !state.fim && <Badge className="bg-cw-red/10 text-cw-red border-cw-red/25"><Timer className="h-3 w-3" /> Janela de agendamento aberta</Badge>}
            {rev.badgeFalsa && state.raizFalsaRevelada && !state.raizRevelada && <Badge className="bg-amber-100 text-amber-700 border-amber-200"><AlertTriangle className="h-3 w-3" /> Ele deu uma explicação. Confere se ela se sustenta.</Badge>}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-[1fr,180px] gap-3">
          <div className="cw-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10.5px] font-mono uppercase tracking-[0.12em] text-cw-muted">Leitura da call</p>
              {rev.clima && (
                <span className="flex items-center gap-1.5 text-[10.5px] font-semibold" style={{ color: HUMOR_COR[humor] }}>
                  <span className="h-1.5 w-1.5 rounded-full animate-posture-talk" style={{ backgroundColor: HUMOR_COR[humor] }} />
                  {HUMOR_LABEL[humor]}
                </span>
              )}
            </div>
            <Sparkline serie={state.serie} humor={humor} />
          </div>
          <div className="cw-card p-4 flex flex-col items-center justify-center gap-1.5 text-center overflow-hidden">
            <p className="text-[10.5px] font-mono uppercase tracking-[0.12em] text-cw-muted">Postura</p>
            <div className="relative h-16 w-16 flex items-center justify-center animate-posture-idle">
              <div
                className="absolute inset-0 rounded-full blur-xl transition-colors duration-700"
                style={{ backgroundColor: corGlow, opacity: 0.28 }}
                aria-hidden="true"
              />
              <div
                key={pose.pose}
                className="relative h-full w-full flex items-center justify-center animate-posture-talk transition-[transform,opacity] duration-500 ease-out"
                style={poseStyle}
              >
                <div
                  className="h-full w-full rounded-full flex items-center justify-center border-2 bg-white"
                  style={{ borderColor: corGlow }}
                >
                  <PoseIcon className="h-7 w-7" style={{ color: corGlow }} />
                </div>
              </div>
            </div>
            <p className={cn('text-[11px] leading-snug', corSinal)}>{pose.rotulo}</p>
          </div>
        </div>

        <div className="cw-card p-5">
          <p className="text-[17px] font-medium text-cw-text leading-relaxed">"{state.fala}"</p>
          {state.tell && <p className="text-[13.5px] text-cw-purple italic mt-2.5 leading-relaxed">{state.tell}</p>}
          {rev.clima && <p className="text-[12.5px] text-cw-muted mt-2 leading-relaxed">{climaAtual(state)}</p>}
          {rev.dica && state.dica && (
            <p className="mt-3 flex items-start gap-2 text-[13px] text-emerald-700 bg-emerald-50 border-l-2 border-emerald-400 rounded-lg px-3 py-2">
              <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5" /> {state.dica}
            </p>
          )}
          {rev.aviso && state.aviso && (
            <p className="mt-3 flex items-start gap-2 text-[13px] text-cw-red bg-cw-red/5 border-l-2 border-cw-red rounded-lg px-3 py-2">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> {state.aviso}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-[10.5px] font-mono uppercase tracking-[0.12em] text-cw-muted mb-2">Sua jogada</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {state.mao.map((id) => {
            const c = carta(id);
            if (!c) return null;
            const usada = state.usadas.includes(id) && c.familia !== 'fechamento';
            return (
              <button
                key={id} type="button" onClick={() => onJogar(id)} disabled={!!state.fim}
                className={cn(
                  'text-left p-3.5 rounded-xl border flex flex-col gap-1 min-h-[92px] transition-all disabled:opacity-40',
                  c.familia === 'raiz' ? 'border-emerald-300 bg-emerald-50/60' : 'border-cw-border bg-white hover:border-cw-purple/40 hover:bg-cw-elevated',
                  usada && 'opacity-60',
                )}
              >
                <span className={cn('text-[9.5px] font-mono uppercase tracking-[0.1em]', c.familia === 'raiz' ? 'text-emerald-700' : 'text-cw-purple')}>{rotuloFamilia(c.familia)}</span>
                <span className="text-[13.5px] font-bold text-cw-text leading-tight">{c.nome}</span>
                <span className="text-[11.5px] text-cw-muted leading-snug">{c.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================ FIM (debrief) */
function FimTela({ state, salvo, salvando, salvarMsg, onSalvar, onReiniciar, onVerPlacar }: {
  state: GameState; salvo: boolean; salvando: boolean; salvarMsg: string;
  onSalvar: () => void; onReiniciar: () => void; onVerPlacar: () => void;
}) {
  const p = state.persona, f = state.fim!;
  const pt = calcularPontos(state);
  const armadilhas = [...(p.armadilhas ?? []), ...state.armadilhasVistas];
  const caiu = [...state.armadilhasCaiu];
  if (state.resistencia > 0) caiu.push(`Cada momento ignorado deixou ele mais fechado: a raiz passou a exigir ${state.resistencia} jogada(s) de escuta a mais do que exigiria.`);
  const janela = [...state.janelaLog, ...(state.janelaAte ? ['A janela estava aberta quando a call terminou.'] : [])];
  const janelaVazio = state.raizRevelada ? 'A janela de agendamento nunca chegou a abrir, faltou confiança ou urgência.' : 'A janela nunca abriu porque a raiz não foi revelada.';

  return (
    <div className="space-y-6">
      <div className="cw-card p-7 md:p-10">
        <Badge className={FIM_COLOR[f.tipo]}>{f.titulo}</Badge>
        <p className="text-[16px] text-cw-text leading-relaxed mt-3">{f.texto}</p>

        <div className="mt-6 rounded-2xl p-5 bg-gradient-to-br from-cw-purple/10 to-cw-purple-dark/5 border border-cw-purple/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-cw-purple font-semibold">Pontuação</p>
              <p className="text-[38px] font-black text-cw-text leading-none mt-1">{pt.total}</p>
            </div>
            <div className="text-center">
              <span className="h-14 w-14 rounded-2xl gradient-primary text-white text-[26px] font-black flex items-center justify-center">{pt.rank.l}</span>
              <p className="text-[11px] text-cw-muted mt-1.5 font-mono">{pt.rank.t}</p>
            </div>
          </div>
          <ul className="mt-4 divide-y divide-cw-purple/10">
            {pt.itens.map((it, i) => (
              <li key={i} className="flex justify-between items-baseline gap-3 py-2 text-[13px]">
                <span className="text-cw-text">{it.label}{it.det && <em className="not-italic font-mono text-[11px] text-cw-muted ml-1.5">{it.det}</em>}</span>
                <b className={cn('font-mono text-[13px]', it.pts >= 0 ? 'text-emerald-600' : 'text-cw-red')}>{it.pts > 0 ? '+' : ''}{it.pts}</b>
              </li>
            ))}
            <li className="flex justify-between py-2 text-[13px] text-cw-muted pt-3">
              <span>Subtotal</span><b className="font-mono">{pt.subtotal}</b>
            </li>
            <li className="flex justify-between py-1 text-[13px] text-cw-muted">
              <span>Multiplicador · {p.dificuldade}</span><b className="font-mono">×{pt.mult}</b>
            </li>
          </ul>

          {!salvo ? (
            <button
              type="button" onClick={onSalvar} disabled={salvando}
              className="mt-4 w-full gradient-primary text-white font-bold text-[13.5px] py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : 'Salvar no placar do time'}
            </button>
          ) : (
            <p className="mt-4 flex items-center gap-2 text-[13px] text-emerald-700 font-semibold"><CheckCircle2 className="h-4 w-4" /> Salvo no placar do time.</p>
          )}
          {salvarMsg && !salvo && <p className="mt-2 text-[12.5px] text-cw-red">{salvarMsg}</p>}
        </div>
      </div>

      <Secao titulo="Os medidores que estavam ocultos">
        <Medidor label="Confiança" valor={state.conf} cor="#A543FA" />
        <Medidor label="Informação" valor={state.info} cor="#22c55e" />
        <Medidor label="Urgência" valor={state.urg} cor="#FF5959" />
        <Medidor label="Paciência" valor={state.pac} cor="#FFB600" />
      </Secao>

      <Secao titulo="A raiz real">
        <div className="rounded-xl p-4 bg-cw-purple/5 border border-cw-purple/20">
          <h4 className="font-bold text-cw-text text-[15px]">{p.raizTitulo}</h4>
          <p className="text-[13.5px] text-cw-text mt-1.5 leading-relaxed">{p.raizOculta}</p>
          <p className={cn('text-[12.5px] font-semibold font-mono mt-2.5', state.raizRevelada ? 'text-emerald-600' : 'text-cw-red')}>
            {state.raizRevelada ? 'Você chegou nela durante a call.' : 'Você não chegou nela. A call girou em torno da objeção declarada.'}
          </p>
        </div>
      </Secao>

      {p.raizFalsa && (
        <Secao titulo="A pista falsa">
          <div className="rounded-xl p-4 bg-amber-50 border border-amber-200">
            <h4 className="font-bold text-cw-text text-[15px]">{p.raizFalsaTitulo || 'Pista falsa'}</h4>
            <p className="text-[13.5px] text-cw-text mt-1.5 leading-relaxed">{p.raizFalsa}</p>
            <p className="text-[12.5px] font-semibold font-mono mt-2.5 text-cw-text">
              {state.raizFalsaRevelada ? 'Ela apareceu na sua call.' : 'Ela não chegou a aparecer.'}
            </p>
          </div>
        </Secao>
      )}

      <Secao titulo="Armadilhas desta call"><ListaDebrief itens={armadilhas} vazio="Nenhuma armadilha específica nesta persona." /></Secao>
      <Secao titulo="Onde você caiu"><ListaDebrief itens={caiu} vazio="Você não caiu em nenhuma armadilha. Muito bom." positivo /></Secao>
      <Secao titulo="Janela de agendamento"><ListaDebrief itens={janela} vazio={janelaVazio} /></Secao>

      <Secao titulo="Suas jogadas">
        <ul className="space-y-1.5">
          {state.historico.map((h, i) => {
            const t = h.delta > 0 ? `+${h.delta}` : `${h.delta}`;
            const cor = h.delta > 4 ? 'text-emerald-600' : h.delta < -4 ? 'text-cw-red' : 'text-cw-muted';
            return (
              <li key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-cw-elevated text-[13.5px]">
                <span className="font-mono text-[11px] text-cw-muted w-5 shrink-0">{h.turno}</span>
                <span className="flex-1 text-cw-text">{h.carta}{h.nota && <em className="not-italic text-emerald-600 text-[11.5px] ml-1.5">· {h.nota}</em>}</span>
                <span className={cn('font-mono text-[12.5px] font-bold', cor)}>{t}</span>
              </li>
            );
          })}
        </ul>
      </Secao>

      <div className="flex gap-3">
        <button type="button" onClick={onReiniciar} className="flex-1 gradient-primary text-white font-bold text-[14px] py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <RotateCcw className="h-4 w-4" /> Jogar de novo
        </button>
        <button type="button" onClick={onVerPlacar} className="px-5 py-3.5 rounded-xl border border-cw-border text-cw-muted font-semibold text-[14px] hover:border-cw-purple/40 transition-colors flex items-center gap-2">
          <Trophy className="h-4 w-4" /> Ver o placar
        </button>
      </div>
    </div>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-cw-purple font-semibold mb-2.5">{titulo}</p>
      {children}
    </div>
  );
}

function ListaDebrief({ itens, vazio, positivo }: { itens: string[]; vazio: string; positivo?: boolean }) {
  if (!itens.length) {
    return (
      <p className={cn('text-[13.5px] italic px-3.5 py-3 rounded-xl border-l-2', positivo ? 'text-emerald-700 bg-emerald-50 border-emerald-400' : 'text-cw-muted bg-cw-elevated border-cw-border')}>
        {vazio}
      </p>
    );
  }
  return (
    <ul className="space-y-1.5">
      {itens.map((t, i) => (
        <li key={i} className="text-[13.5px] text-cw-text leading-relaxed px-3.5 py-2.5 rounded-xl bg-cw-elevated border-l-2 border-cw-purple/40">{t}</li>
      ))}
    </ul>
  );
}

/* ============================================================ PLACAR */
function PlacarTela({ scores, loading, onVoltar }: { scores: import('@/hooks/useRoleplayScores').RoleplayScore[]; loading: boolean; onVoltar: () => void }) {
  const porCenario = useMemo(() => {
    const map = new Map<string, typeof scores[number]>();
    scores.forEach((s) => {
      const atual = map.get(s.personaId);
      if (!atual || s.pontos > atual.pontos) map.set(s.personaId, s);
    });
    return map;
  }, [scores]);

  const porPessoa = useMemo(() => {
    const map = new Map<string, { nome: string; total: number; jogos: number; vitorias: number; recordes: number }>();
    scores.forEach((s) => {
      const o = map.get(s.nome) ?? { nome: s.nome, total: 0, jogos: 0, vitorias: 0, recordes: 0 };
      o.total += s.pontos; o.jogos++;
      if (s.desfecho === 'vitoria') o.vitorias++;
      map.set(s.nome, o);
    });
    porCenario.forEach((s) => {
      const o = map.get(s.nome);
      if (o) o.recordes++;
    });
    return [...map.values()].sort((a, b) => b.recordes - a.recordes || b.total - a.total);
  }, [scores, porCenario]);

  const personasOrdenadas = useMemo(() => (
    [...PERSONAS].sort((a, b) => (ORDEM_DIF[a.dificuldade] ?? 9) - (ORDEM_DIF[b.dificuldade] ?? 9))
  ), []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11.5px] font-mono uppercase tracking-[0.14em] text-cw-purple font-semibold mb-2">Roleplay · Sala de Call</p>
        <h1 className="text-[30px] font-black text-cw-text">Placar do time</h1>
        {!loading && !scores.length && <p className="text-[13.5px] text-cw-muted mt-2">Ainda não há partidas registradas.</p>}
      </div>

      <Secao titulo="Recorde por cliente">
        <ul className="space-y-1.5">
          {personasOrdenadas.map((p) => {
            const s = porCenario.get(p.id);
            return (
              <li key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cw-elevated">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] text-cw-text truncate">{p.nome}</p>
                  <p className="font-mono text-[10.5px] text-cw-muted">{p.dificuldade}</p>
                </div>
                {s ? (
                  <>
                    <span className="text-[13px] text-cw-text">{s.nome}</span>
                    <span className="font-mono text-[12.5px] text-cw-muted flex items-center gap-1.5">
                      {s.pontos}
                      <span className="h-5 min-w-5 px-1 rounded-md gradient-primary text-white text-[10.5px] font-bold flex items-center justify-center">{s.rank}</span>
                    </span>
                  </>
                ) : <span className="text-[12.5px] text-cw-muted">sem registro</span>}
              </li>
            );
          })}
        </ul>
      </Secao>

      <Secao titulo="Ranking do time">
        {porPessoa.length ? (
          <ul className="space-y-1.5">
            {porPessoa.map((o, i) => (
              <li key={o.nome} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cw-elevated">
                <span className="font-mono text-[12px] text-cw-muted w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] text-cw-text truncate">{o.nome}</p>
                  <p className="text-[11px] text-cw-muted">{o.jogos} partida(s) · {o.vitorias} agendada(s)</p>
                </div>
                <span className="font-mono text-[12.5px] text-cw-muted flex items-center gap-1.5">
                  {o.recordes} recorde(s)
                  <span className="px-2 py-0.5 rounded-md bg-cw-purple/15 text-cw-purple text-[11px] font-bold">{o.total}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : <p className="text-[13px] text-cw-muted italic">Ninguém registrado ainda.</p>}
      </Secao>

      <button type="button" onClick={onVoltar} className="w-full gradient-primary text-white font-bold text-[14px] py-3.5 rounded-xl hover:opacity-90 transition-opacity">
        Voltar
      </button>
    </div>
  );
}
