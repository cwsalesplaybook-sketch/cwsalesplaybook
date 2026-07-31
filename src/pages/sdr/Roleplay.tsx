/** Roleplay — simulador de call do SDR. Substitui a antiga Tira-dúvidas na
 *  navegação do SDR. Você conduz uma ligação de qualificação (SPIN/BANT)
 *  contra um cliente fictício do funil: quatro medidores ocultos (Confiança,
 *  Informação, Urgência, Paciência) decidem se ele topa marcar a reunião com
 *  o consultor — você nunca vê os números, só a fala, o clima e a postura.
 *  Motor do jogo em src/lib/roleplay/engine.ts, conteúdo em
 *  src/data/roleplay/{conteudo,personas,vozes}.ts, placar via Supabase
 *  (useRoleplayScores) ligado ao usuário logado — sem nome digitado à mão. */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Sparkles, ArrowRight, ArrowLeft, ChevronLeft, RotateCcw, Trophy, Star,
  Lightbulb, AlertTriangle, CheckCircle2, XCircle, Timer, Target,
  Clock, UserMinus, Frown, User as UserIcon, TrendingUp, Smile,
  Phone, Flag, Calendar, Dumbbell, LogOut, Headphones,
  MessageCircle, Gamepad2, ChevronRight, BarChart3,
  Anchor, MessageSquare, HelpCircle, Gem, Scale, VolumeX, RefreshCw,
  Search, SlidersHorizontal, ShieldCheck, Eye, Users, DollarSign,
  LineChart, GitCompare, Crosshair, Gauge, Tag, Wallet, Hand,
  Handshake, Snowflake, Pause, ClipboardCheck, PhoneCall, CalendarClock,
  ArrowRightCircle, HeartHandshake, UserPlus, LifeBuoy, Wrench,
  FileBarChart, Award, Undo2, FlaskConical, Layers, UsersRound,
  ThumbsUp, DoorOpen, Settings2,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRoleplayScores, type RoleplayScore } from '@/hooks/useRoleplayScores';
import { PERSONAS, type Persona } from '@/data/roleplay/personas';
import { REVELACAO } from '@/data/roleplay/conteudo';
import {
  novaPartida, jogar, carta, sinal, txt, climaAtual, posturaAtual, calcularPontos,
  rotuloFamilia, ORDEM_DIF, type GameState,
} from '@/lib/roleplay/engine';

type Tela = 'menu' | 'clientes' | 'briefing' | 'jogo' | 'fim' | 'placar';
const DIFICULDADES = ['todos', 'Treino', 'Média', 'Difícil', 'Muito difícil'] as const;

/** Ícone por postura — sem foto/avatar, só o ícone animado (respiração
 *  contínua + pulso a cada fala + crossfade ao trocar de leitura). */
const POSE_ICON: Record<string, typeof Clock> = {
  relogio: Clock, recuado: UserMinus, cruzado: Frown, neutro: UserIcon,
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

/** Dica curta por postura, escondida atrás de "Ver dicas de postura" —
 *  não conta como aviso oficial da dificuldade, é só um empurrãozinho de
 *  leitura corporal, sempre disponível. */
const POSTURA_DICA: Record<string, string> = {
  relogio: 'Ele já quer ir embora. Corte o diagnóstico e vá direto ao ponto que importa pra ele.',
  recuado: 'Confiança baixa. Escuta rende mais que argumento agora — tenta silêncio ou validar sem concordar.',
  cruzado: 'Postura de defesa. Nomeie o que ele parece estar sentindo antes de insistir em qualquer proposta.',
  neutro: 'Ele está acompanhando, mas não empolgado. Boa hora pra aprofundar o diagnóstico.',
  inclinado: 'Urgência subindo. Ele já está se inclinando pra dentro da conversa — não deixe esfriar.',
  aberto: 'Confiança alta e clima bom. Se a raiz já apareceu, essa é a hora de convidar pra call.',
};

/** Ícone específico por carta, pra facilitar reconhecer a jogada de
 *  relance no grid — a cor do "chip" vem da família (FAMILIA_CHIP). */
const ICON_CARTA: Record<string, LucideIcon> = {
  passagem_bastao: Anchor, pergunta_aberta: MessageSquare, pergunta_problema: AlertTriangle,
  implicacao: HelpCircle, need_payoff: Gem, checar_contradicao: Scale,
  silencio: VolumeX, espelhamento: RefreshCw, rotulagem: Smile,
  auditoria_acusacao: Search, pergunta_calibrada: SlidersHorizontal, validar_sentimento: ShieldCheck,
  demo_dirigida: Eye, prova_social: Users, custo_inacao: DollarSign,
  ganho_projetado: LineChart, ensinar: Lightbulb, diferencial_concorrente: GitCompare,
  redirecionar_negocio: Target,
  isolar_objecao: Crosshair, escala_010: Gauge, reenquadrar_preco: Tag,
  ancoragem: Wallet, nao_conceder: Hand, concessao_condicionada: Handshake,
  garantia_estendida: ShieldCheck, congelamento: Snowflake, pausa_estrategica: Pause,
  resumo_confirma: ClipboardCheck,
  fechamento_direto: PhoneCall, fechamento_alternativa: CalendarClock, next_step: ArrowRightCircle,
  reparacao: HeartHandshake, trazer_decisor: UserPlus, migracao_sem_risco: LifeBuoy,
  mao_na_massa: Wrench, municao_comparativa: FileBarChart, vitoria_simbolica: Award,
  assumir_falha: Undo2, blindar_comite: ShieldCheck, provar_sem_promessa: FlaskConical,
  dividir_risco: Layers, proteger_rotina: UsersRound, legitimar_escolha: ThumbsUp,
  caminho_saida: DoorOpen, assumir_operacao: Settings2,
};

const FAMILIA_CHIP: Record<string, { bg: string; text: string }> = {
  diagnostico: { bg: 'bg-cw-purple/10', text: 'text-cw-purple' },
  escuta: { bg: 'bg-amber-100', text: 'text-amber-600' },
  valor: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  negociacao: { bg: 'bg-cw-red/10', text: 'text-cw-red' },
  fechamento: { bg: 'bg-cw-purple', text: 'text-white' },
  raiz: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
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
const HUMOR_COR: Record<Humor, string> = { irritado: '#FF5959', frio: '#FF5959', neutro: '#A543FA', quente: '#22c55e' };
const HUMOR_LABEL: Record<Humor, string> = { irritado: 'Perdendo a paciência', frio: 'Distante', neutro: 'Acompanhando', quente: 'Engajado' };

/** Waveform simples (sem player, sem áudio de verdade — é só o formato
 *  visual): número fixo de barras (uma por turno possível da call), altura
 *  = sinal daquele turno, cor = humor atual. Turnos ainda não jogados
 *  ficam como barrinha baixa e apagada, senão no início da call (poucos
 *  pontos) a barra única esticava e virava um bloco só. */
function Sparkline({ serie, humor, total }: { serie: number[]; humor: Humor; total: number }) {
  const cor = HUMOR_COR[humor];
  const n = Math.max(total, serie.length, 1);
  const barras = Array.from({ length: n }, (_, i) => serie[i]);
  return (
    <div className="w-full h-10 flex items-end gap-[3px]">
      {barras.map((v, i) => (
        <div
          key={i} className="flex-1 min-w-[2px] rounded-full transition-all duration-300"
          style={v === undefined
            ? { height: '10%', backgroundColor: '#E9DDF2' }
            : { height: `${Math.max(14, Math.min(100, v))}%`, backgroundColor: cor, opacity: 0.5 + (v / 100) * 0.5 }}
        />
      ))}
    </div>
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

function HeroFeature({ icon: Icon, titulo, desc }: { icon: LucideIcon; titulo: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 bg-cw-elevated rounded-xl p-3">
      <span className="h-8 w-8 rounded-lg bg-cw-purple/10 text-cw-purple flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[12.5px] font-bold text-cw-text leading-tight">{titulo}</p>
        <p className="text-[11px] text-cw-muted leading-snug mt-0.5">{desc}</p>
      </div>
    </div>
  );
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
          onIrParaClientes={() => setTelaAtual('clientes')} onVerPlacar={() => setTelaAtual('placar')}
          scores={scores} userId={profile.id}
        />
      )}
      {telaAtual === 'clientes' && (
        <ClientesTela
          filtroDif={filtroDif} setFiltroDif={setFiltroDif}
          personas={personasFiltradas} total={PERSONAS.length}
          onAbrir={abrirBriefing} onVoltar={() => setTelaAtual('menu')}
        />
      )}
      {telaAtual === 'briefing' && briefingPersona && (
        <BriefingTela persona={briefingPersona} onEntrar={() => iniciar(briefingPersona.id)} onVoltar={() => setTelaAtual('clientes')} />
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

const COMO_SE_JOGA_PASSOS = [
  { icon: Phone, titulo: 'Receba uma ligação', desc: 'Um cliente real do nosso funil liga para você.' },
  { icon: MessageCircle, titulo: 'Converse e descubra', desc: 'Faça as perguntas certas e entenda a necessidade do cliente.' },
  { icon: Target, titulo: 'Apresente a solução', desc: 'Mostre como a Cardápio Web resolve o problema dele.' },
  { icon: CheckCircle2, titulo: 'Conduza para o próximo passo', desc: 'Agende uma reunião ou avance no funil.' },
  { icon: Star, titulo: 'Receba seu feedback', desc: 'Veja seus acertos, pontos de atenção e dicas de melhoria.' },
];

const DICAS_RAPIDAS = [
  'Escute mais do que fala.',
  'Pergunte para entender, não para falar.',
  'Conecte a dor do cliente à sua solução.',
  'Seja claro no próximo passo.',
  'Confiança = Resultado.',
];

function calcularResultados(scores: RoleplayScore[], userId: string | null) {
  const meus = userId ? scores.filter((s) => s.userId === userId) : [];
  const calls = meus.length;
  const reunioes = meus.filter((s) => s.desfecho === 'vitoria').length;
  const taxa = calls ? Math.round((reunioes / calls) * 100) : 0;
  return { calls, reunioes, taxa };
}

function calcularRankingSemana(scores: RoleplayScore[]) {
  const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const recentes = scores.filter((s) => s.data >= seteDiasAtras);
  const porPessoa = new Map<string, { nome: string; calls: number; reunioes: number }>();
  recentes.forEach((s) => {
    const o = porPessoa.get(s.nome) ?? { nome: s.nome, calls: 0, reunioes: 0 };
    o.calls++;
    if (s.desfecho === 'vitoria') o.reunioes++;
    porPessoa.set(s.nome, o);
  });
  return [...porPessoa.values()]
    .map((o) => ({ nome: o.nome, taxa: o.calls ? Math.round((o.reunioes / o.calls) * 100) : 0, calls: o.calls }))
    .sort((a, b) => b.taxa - a.taxa || b.calls - a.calls)
    .slice(0, 3);
}

function DonutConversao({ pct }: { pct: number }) {
  const r = 42, c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, pct)) / 100) * c;
  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#F1E5FB" strokeWidth="10" />
      <circle
        cx="50" cy="50" r={r} fill="none" stroke="#A543FA" strokeWidth="10" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset} className="transition-all duration-700"
      />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central" transform="rotate(90 50 50)" className="fill-cw-text font-black" style={{ fontSize: '20px' }}>
        {pct}%
      </text>
    </svg>
  );
}

/* ============================================================ MENU */
function MenuTela({ onIrParaClientes, onVerPlacar, scores, userId }: {
  onIrParaClientes: () => void; onVerPlacar: () => void;
  scores: RoleplayScore[]; userId: string | null;
}) {
  const resultados = useMemo(() => calcularResultados(scores, userId), [scores, userId]);
  const ranking = useMemo(() => calcularRankingSemana(scores), [scores]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[28px] border border-cw-border/40 shadow-[0_2px_28px_rgba(89,50,122,0.05)] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 w-full">
          <p className="text-[11.5px] font-mono uppercase tracking-[0.14em] text-cw-purple font-semibold mb-3">Roleplay · Treinamento de SDR</p>
          <h1 className="text-[32px] md:text-[38px] font-black text-cw-text leading-[1.05]">
            Sala de <span className="text-gradient-primary">Call</span>
          </h1>
          <p className="text-cw-muted text-[14px] mt-3 max-w-md leading-relaxed">
            Quanto melhores decisões na ligação, maior a sua conversão e, consequentemente, melhores resultados.
            Está na call, tá criando na prática!
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              type="button" onClick={onIrParaClientes}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-white text-[13.5px] font-bold hover:opacity-90 transition-opacity"
            >
              <Phone className="h-4 w-4" /> Vamos praticar agora!
            </button>
            <button
              type="button" onClick={onVerPlacar}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-cw-border bg-white text-cw-text text-[13px] font-semibold hover:border-cw-purple/40 transition-colors"
            >
              <Trophy className="h-4 w-4 text-cw-purple" /> Ver o placar do time
            </button>
          </div>
        </div>
        <div className="flex items-center shrink-0">
          <img
            src="/roleplay/cardapinho-analista.png" alt="Cardapinho, o mascote da Cardápio Web"
            className="h-40 md:h-48 w-auto object-contain shrink-0 relative z-10 md:-mr-7 drop-shadow-xl"
          />
          <div className="w-[210px] space-y-3 shrink-0">
            <HeroFeature icon={Phone} titulo="Pratique ligações reais" desc="Simule calls com clientes de verdade do funil." />
            <HeroFeature icon={Target} titulo="Melhore sua conversão" desc="Cada decisão certa te aproxima de mais resultados." />
            <HeroFeature icon={TrendingUp} titulo="Evolua a cada call" desc="Receba feedbacks e acompanhe sua evolução." />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-cw-border/40 shadow-[0_2px_28px_rgba(89,50,122,0.05)] p-6 md:p-8">
        <h2 className="font-black text-cw-text text-[15px] mb-5 flex items-center gap-2">
          <Gamepad2 className="h-4 w-4 text-cw-purple" /> Como se joga
        </h2>
        <div className="flex flex-col md:flex-row items-stretch md:items-start gap-3 md:gap-1">
          {COMO_SE_JOGA_PASSOS.map((passo, i) => (
            <div key={passo.titulo} className="flex items-center gap-1 flex-1">
              <div className="flex flex-col items-center text-center gap-2 flex-1 px-2">
                <span className="h-11 w-11 rounded-full bg-cw-purple/10 text-cw-purple flex items-center justify-center shrink-0">
                  <passo.icon className="h-5 w-5" />
                </span>
                <p className="text-[12.5px] font-bold text-cw-text leading-tight">{i + 1}. {passo.titulo}</p>
                <p className="text-[11.5px] text-cw-muted leading-snug">{passo.desc}</p>
              </div>
              {i < COMO_SE_JOGA_PASSOS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-cw-border shrink-0 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-[24px] p-5 bg-amber-50 border border-amber-200">
          <h3 className="font-black text-cw-text text-[14.5px] mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" /> Dicas rápidas
          </h3>
          <ul className="space-y-2">
            {DICAS_RAPIDAS.map((d) => (
              <li key={d} className="flex items-start gap-2 text-[12.5px] text-cw-text leading-snug">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" /> {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] p-5 bg-cw-purple/5 border border-cw-purple/15">
          <h3 className="font-black text-cw-text text-[14.5px] mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-cw-purple" /> Seus resultados
          </h3>
          <div className="flex items-center gap-4">
            <DonutConversao pct={resultados.taxa} />
            <div className="space-y-1.5 flex-1 min-w-0">
              <p className="text-[10.5px] text-cw-muted">Conversão</p>
              <div className="flex justify-between text-[12px]"><span className="text-cw-muted">Calls realizadas</span><b className="text-cw-text">{resultados.calls}</b></div>
              <div className="flex justify-between text-[12px]"><span className="text-cw-muted">Reuniões agendadas</span><b className="text-cw-text">{resultados.reunioes}</b></div>
              <div className="flex justify-between text-[12px]"><span className="text-cw-muted">Taxa de conversão</span><b className="text-cw-text">{resultados.taxa}%</b></div>
            </div>
          </div>
          <button type="button" onClick={onVerPlacar} className="mt-3 text-[12px] font-semibold text-cw-purple flex items-center gap-1 hover:opacity-75 transition-opacity">
            Ver meu desempenho completo <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="rounded-[24px] p-5 bg-amber-50 border border-amber-200">
          <h3 className="font-black text-cw-text text-[14.5px] mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" /> Ranking da semana
          </h3>
          {ranking.length ? (
            <ul className="space-y-2">
              {ranking.map((r, i) => (
                <li key={r.nome} className="flex items-center gap-2.5 text-[12.5px]">
                  <span className="font-mono text-cw-muted w-4">{i + 1}</span>
                  <span className="h-7 w-7 rounded-full gradient-primary text-white flex items-center justify-center text-[10.5px] font-bold shrink-0">
                    {r.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()}
                  </span>
                  <span className="flex-1 text-cw-text font-semibold truncate">{r.nome}</span>
                  <b className="text-amber-600">{r.taxa}%</b>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[12.5px] text-cw-muted italic">Ninguém jogou essa semana ainda.</p>
          )}
          <button type="button" onClick={onVerPlacar} className="mt-3 text-[12px] font-semibold text-cw-purple flex items-center gap-1 hover:opacity-75 transition-opacity">
            Ver ranking completo <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ ESCOLHA O CLIENTE */
function ClientesTela({ filtroDif, setFiltroDif, personas, total, onAbrir, onVoltar }: {
  filtroDif: string; setFiltroDif: (d: string) => void; personas: Persona[]; total: number;
  onAbrir: (id: string) => void; onVoltar: () => void;
}) {
  return (
    <div>
      <button type="button" onClick={onVoltar} className="flex items-center gap-1.5 text-cw-purple text-[13.5px] font-semibold mb-4 hover:opacity-75 transition-opacity">
        <ArrowLeft className="h-4 w-4" /> Voltar para a sala
      </button>

      <h2 className="font-black text-cw-text text-[20px] mb-3">Escolha o cliente</h2>
      <div className="flex flex-wrap gap-2 mb-5">
        {DIFICULDADES.map((d) => {
          const n = d === 'todos' ? total : PERSONAS.filter((p) => p.dificuldade === d).length;
          return (
            <button
              key={d} type="button" onClick={() => setFiltroDif(d)}
              className={cn(
                'px-3.5 py-2 rounded-full text-[12.5px] font-semibold border transition-colors',
                filtroDif === d ? 'gradient-primary text-white border-transparent' : 'border-cw-border bg-white text-cw-muted hover:border-cw-purple/40',
              )}
            >
              {d === 'todos' ? 'Todos' : d} <span className="opacity-70 font-mono ml-1">{n}</span>
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
  );
}

/* ============================================================ BRIEFING */
function dicaTreinador(dificuldade: string): string {
  switch (dificuldade) {
    case 'Treino': return 'Vá com calma: use as dicas que aparecem na tela e teste as cartas de escuta sem medo de errar.';
    case 'Média': return 'Escute antes de argumentar, a raiz só aparece pra quem para de empurrar solução.';
    case 'Difícil': return 'Sem dica na tela neste nível: leia o traço, a postura e a fala com atenção antes de escolher a carta.';
    default: return 'Nível mais alto: cada armadilha é sutil. Prepare o terreno com escuta antes de arriscar a carta de raiz.';
  }
}

function CampoIcon({ icon: Icon, label, children, destaque }: { icon: LucideIcon; label: string; children: React.ReactNode; destaque?: boolean }) {
  return (
    <div className="flex gap-3">
      <span className="h-9 w-9 rounded-xl bg-cw-purple/10 text-cw-purple flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10.5px] font-mono uppercase tracking-[0.12em] text-cw-purple font-semibold mb-1">{label}</p>
        <div className={cn('text-[14px] text-cw-text leading-relaxed', destaque && 'border-l-2 border-cw-red pl-2.5')}>{children}</div>
      </div>
    </div>
  );
}

function BriefingTela({ persona, onEntrar, onVoltar }: { persona: Persona; onEntrar: () => void; onVoltar: () => void }) {
  const rev = REVELACAO[persona.dificuldade];
  const modoTexto = rev.badgeRaiz
    ? 'Você recebe avisos durante a call: quando a raiz aparece e quando a janela de agendamento abre.'
    : 'Sem avisos durante a call. A leitura é só pelo traço, pela postura e pela fala, tudo é explicado no debrief.';

  return (
    <div>
      <button type="button" onClick={onVoltar} className="flex items-center gap-1.5 text-cw-purple text-[13.5px] font-semibold mb-4 hover:opacity-75 transition-opacity">
        <ArrowLeft className="h-4 w-4" /> Voltar para a sala
      </button>

      <div className="cw-card p-7 md:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-4">
            <span className="h-14 w-14 rounded-2xl gradient-primary text-white flex items-center justify-center font-bold text-[17px] shrink-0">{persona.iniciais}</span>
            <div>
              <h2 className="font-black text-cw-text text-[20px]">{persona.nome}</h2>
              <p className="text-[13px] text-cw-muted">{persona.empresa} · {persona.segmento}</p>
            </div>
          </div>
          <Badge className="bg-cw-purple/10 text-cw-purple border-cw-purple/20 shrink-0">
            <Star className="h-3 w-3" /> Cliente em atendimento
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-x-8 gap-y-5 mb-6">
          <CampoIcon icon={Phone} label="Como o cliente chegou">{persona.briefing}</CampoIcon>
          <CampoIcon icon={Target} label="Como você joga neste nível">{modoTexto}</CampoIcon>
          <CampoIcon icon={Flag} label="Objetivo declarado" destaque>{persona.objecaoDeclarada}</CampoIcon>
          <CampoIcon icon={Calendar} label="Turnos disponíveis">{persona.turnos} jogadas até o fim da ligação</CampoIcon>
          <CampoIcon icon={Dumbbell} label="Dificuldade">{persona.dificuldade}</CampoIcon>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex gap-3 md:w-[280px] shrink-0 bg-cw-elevated rounded-xl p-4 border border-cw-border/60">
            <span className="h-9 w-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Lightbulb className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[10.5px] font-mono uppercase tracking-[0.12em] text-amber-700 font-semibold mb-1">Dica do treinador</p>
              <p className="text-[12.5px] text-cw-text leading-snug">{dicaTreinador(persona.dificuldade)}</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2.5">
            <div className="flex gap-3">
              <button type="button" onClick={onEntrar} className="flex-1 gradient-primary text-white font-bold text-[14.5px] py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" /> Entrar na call
              </button>
              <button type="button" onClick={onVoltar} className="px-5 py-3.5 rounded-xl border border-cw-border text-cw-muted font-semibold text-[14.5px] hover:border-cw-purple/40 transition-colors flex items-center justify-center gap-2">
                <LogOut className="h-4 w-4" /> Voltar
              </button>
            </div>
            <p className="flex items-center justify-center gap-2 text-[12px] text-cw-purple bg-cw-purple/5 rounded-lg py-2 px-3">
              <Headphones className="h-3.5 w-3.5 shrink-0" /> Ao entrar, a simulação será iniciada e os avisos serão ativados.
            </p>
          </div>
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
  const [dicaPosturaAberta, setDicaPosturaAberta] = useState(false);
  const turnoAtual = Math.min(state.fim ? state.turno : state.turno + 1, state.turnosMax);

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
          <div className="flex items-center gap-1.5 shrink-0">
            <ChevronLeft className="h-4 w-4 text-cw-border" aria-hidden="true" />
            <span className="font-mono text-[13.5px] bg-cw-purple/10 text-cw-purple px-3 py-1.5 rounded-lg font-semibold">
              {turnoAtual}/{state.turnosMax}
            </span>
            <ChevronRight className="h-4 w-4 text-cw-border" aria-hidden="true" />
          </div>
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
            <p className="text-[10.5px] font-mono uppercase tracking-[0.12em] text-cw-muted mb-2">Leitura da call</p>
            <Sparkline serie={state.serie} humor={humor} total={state.turnosMax} />
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
            <button
              type="button" onClick={() => setDicaPosturaAberta((v) => !v)}
              className="flex items-center gap-1 text-[10px] font-semibold text-cw-purple bg-cw-purple/10 rounded-full px-2 py-1 hover:bg-cw-purple/15 transition-colors"
            >
              <Lightbulb className="h-2.5 w-2.5" /> Ver dicas de postura
            </button>
          </div>
        </div>
        {dicaPosturaAberta && (
          <p className="text-[12px] text-cw-text bg-cw-purple/5 border-l-2 border-cw-purple rounded-lg px-3 py-2 leading-snug">
            {POSTURA_DICA[pose.pose]}
          </p>
        )}

        <div className="cw-card p-5 flex items-end gap-4 overflow-hidden">
          <div className="flex-1 min-w-0">
            <span className="h-8 w-8 rounded-full bg-cw-purple/10 text-cw-purple flex items-center justify-center mb-2 text-[16px] font-black">"</span>
            <p className="text-[17px] font-medium text-cw-text leading-relaxed">{state.fala}</p>
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
          <img
            src="/roleplay/cardapinho-call.png" alt=""
            className="hidden sm:block h-20 md:h-24 w-auto object-contain shrink-0"
            aria-hidden="true"
          />
        </div>
      </div>

      <div>
        <p className="text-[10.5px] font-mono uppercase tracking-[0.12em] text-cw-muted mb-2">Sua jogada</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {state.mao.map((id) => {
            const c = carta(id);
            if (!c) return null;
            const usada = state.usadas.includes(id) && c.familia !== 'fechamento';
            const Icon = ICON_CARTA[id] ?? Sparkles;
            const chip = FAMILIA_CHIP[c.familia] ?? FAMILIA_CHIP.diagnostico;
            return (
              <button
                key={id} type="button" onClick={() => onJogar(id)} disabled={!!state.fim}
                className={cn(
                  'text-left p-3.5 rounded-xl border flex flex-col gap-2 min-h-[104px] transition-all disabled:opacity-40',
                  c.familia === 'raiz' ? 'border-emerald-300 bg-emerald-50/60' : 'border-cw-border bg-white hover:border-cw-purple/40 hover:bg-cw-elevated',
                  usada && 'opacity-60',
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn('h-7 w-7 rounded-lg flex items-center justify-center shrink-0', chip.bg, chip.text)}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className={cn('text-[9.5px] font-mono uppercase tracking-[0.1em]', c.familia === 'raiz' ? 'text-emerald-700' : 'text-cw-purple')}>{rotuloFamilia(c.familia)}</span>
                </div>
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
