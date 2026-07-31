/** Motor do Roleplay — porte quase literal do protótipo standalone original
 *  (que era DOM imperativo) pra funções puras que recebem um GameState e
 *  devolvem um novo GameState, prontas pra usar com useState no React.
 *  A lógica de resolução de carta, jogo de raiz/raiz falsa, interrogatório,
 *  janela de fechamento e pontuação foi mantida fiel ao original — só a
 *  camada de renderização (DOM/innerHTML) foi trocada por componentes. */
import { CARTAS, CLIMA, POSTURAS, REGRAS, REVELACAO, type Carta } from '@/data/roleplay/conteudo';
import { PERSONAS, type Persona } from '@/data/roleplay/personas';

export type Familia = Carta['familia'];

export interface Evento {
  turno: number; fala: string; tell: string; dica?: string;
  aceita: { cartas?: string[]; familias?: string[] };
  bonus: Record<string, number>; penal: Record<string, number>;
  msgFalha: string; armadilha: string;
}

export interface HistoricoItem { turno: number; carta: string; familia: string; delta: number; nota: string }

export interface Fim {
  tipo: 'vitoria' | 'parcial' | 'derrota' | 'tempo';
  titulo: string;
  texto: string;
}

export interface GameState {
  persona: Persona;
  rev: typeof REVELACAO[string];
  conf: number; info: number; urg: number; pac: number;
  turno: number; turnosMax: number;
  raizRevelada: boolean; raizFalsaRevelada: boolean; preparo: number; resistencia: number;
  mao: string[]; usadas: string[]; historico: HistoricoItem[]; jogadas: string[]; serie: number[];
  fim: Fim | null;
  fala: string; tell: string; dica: string; aviso: string; ultimoDelta: number;
  seqDiag: number; exigeEscuta: boolean; exigencia: Evento | null;
  janelaAte: number | null; janelasPerdidas: number; liberaJanela: number; janelaLog: string[];
  eventosOk: number; eventosFalha: number; interrogatorios: number; escutaIgnorada: number; fechouNaJanela: boolean;
  armadilhasVistas: string[]; armadilhasCaiu: string[];
}

const R = REGRAS;

export function clamp(v: number): number { return Math.max(0, Math.min(100, v)); }

export function carta(id: string): Carta | null {
  return CARTAS.find((c) => c.id === id) ?? null;
}

export function persona(id: string): Persona | null {
  return PERSONAS.find((p) => p.id === id) ?? null;
}

/** Substitui {token} pelo ctx da persona — a mesma carta soa coerente com
 *  cada lead (quem usa concorrente não fala em caderno). */
export function txt(state: GameState | null, s?: string): string {
  if (!s) return '';
  if (!state?.persona?.ctx) return s;
  const ctx = state.persona.ctx;
  return s.replace(/\{(\w+)\}/g, (m, k) => (ctx[k] !== undefined ? ctx[k] : m));
}

type NumCond = number | { lt?: number; lte?: number; gt?: number; gte?: number; eq?: number };

function testaNum(v: number, r: NumCond | undefined): boolean {
  if (r == null) return true;
  if (typeof r === 'number') return v === r;
  if (r.lt !== undefined && !(v < r.lt)) return false;
  if (r.lte !== undefined && !(v <= r.lte)) return false;
  if (r.gt !== undefined && !(v > r.gt)) return false;
  if (r.gte !== undefined && !(v >= r.gte)) return false;
  if (r.eq !== undefined && !(v === r.eq)) return false;
  return true;
}

export function condOk(se: Record<string, unknown> | undefined, st: GameState): boolean {
  if (!se) return true;
  const s = se as Record<string, unknown>;
  if (s.conf !== undefined && !testaNum(st.conf, s.conf as NumCond)) return false;
  if (s.info !== undefined && !testaNum(st.info, s.info as NumCond)) return false;
  if (s.urg !== undefined && !testaNum(st.urg, s.urg as NumCond)) return false;
  if (s.pac !== undefined && !testaNum(st.pac, s.pac as NumCond)) return false;
  if (s.turno !== undefined && !testaNum(st.turno, s.turno as NumCond)) return false;
  if (s.raiz !== undefined && s.raiz !== st.raizRevelada) return false;
  if (s.raizFalsa !== undefined && s.raizFalsa !== st.raizFalsaRevelada) return false;
  if (s.usou !== undefined && !st.usadas.includes(s.usou as string)) return false;
  if (s.naoUsou !== undefined && st.usadas.includes(s.naoUsou as string)) return false;
  if (s.usouAlgum !== undefined) {
    const arr = s.usouAlgum as string[];
    if (!arr.some((a) => st.usadas.includes(a))) return false;
  }
  if (s.fase !== undefined) {
    const frac = st.turno / st.turnosMax;
    const f = frac < 0.34 ? 'inicio' : frac < 0.7 ? 'meio' : 'fim';
    if (s.fase !== f) return false;
  }
  return true;
}

interface Efeito { se?: Record<string, unknown>; ef: Record<string, number>; fala?: string; tell?: string; dica?: string; exigeEscuta?: boolean }

function resolve(cartaId: string, st: GameState): Efeito {
  const p = st.persona;
  const listas: Efeito[][] = [];
  if (p.overrides?.[cartaId]) listas.push(p.overrides[cartaId] as Efeito[]);
  listas.push((carta(cartaId)?.efeitos ?? []) as Efeito[]);
  for (const lista of listas) {
    for (const item of lista) {
      if (condOk(item.se, st)) return item;
    }
  }
  return { ef: {} };
}

export function sinal(st: GameState): number {
  return st.conf * 0.42 + st.info * 0.22 + st.urg * 0.26 + st.pac * 0.10;
}

function porCond<T extends { se?: Record<string, unknown> }>(lista: T[], st: GameState): T {
  for (const item of lista) { if (condOk(item.se, st)) return item; }
  return lista[lista.length - 1];
}

export function climaAtual(st: GameState): string { return porCond(CLIMA, st).texto; }
export function posturaAtual(st: GameState): { pose: string; rotulo: string } { return porCond(POSTURAS, st); }

/* ---------- partida ---------- */
export function novaPartida(pid: string): GameState {
  const p = persona(pid);
  if (!p) throw new Error(`Persona desconhecida: ${pid}`);
  const mao = CARTAS.filter((c) => !c.bloqueada).map((c) => c.id);
  const st: GameState = {
    persona: p, rev: REVELACAO[p.dificuldade] ?? REVELACAO['Difícil'],
    conf: p.inicio.conf, info: p.inicio.info, urg: p.inicio.urg, pac: p.inicio.pac,
    turno: 0, turnosMax: p.turnos,
    raizRevelada: false, raizFalsaRevelada: false, preparo: 0, resistencia: 0,
    mao, usadas: [], historico: [], jogadas: [], serie: [], fim: null,
    fala: p.abertura, tell: 'A call começou. Leia o traço, a postura e a reação.',
    dica: '', aviso: '', ultimoDelta: 0,
    seqDiag: 0, exigeEscuta: false, exigencia: null,
    janelaAte: null, janelasPerdidas: 0, liberaJanela: 0, janelaLog: [],
    eventosOk: 0, eventosFalha: 0, interrogatorios: 0, escutaIgnorada: 0, fechouNaJanela: false,
    armadilhasVistas: [], armadilhasCaiu: [],
  };
  st.serie.push(sinal(st));
  return st;
}

/** Teto suave: ganho rende menos com medidor alto. Perda vale inteiro. */
function ganho(atual: number, v: number): number {
  if (v <= 0) return v;
  const t = R.tetoSuave;
  if (atual >= t.limite2) return v * t.mult2;
  if (atual >= t.limite1) return v * t.mult1;
  return v;
}

function aplicar(s: GameState, ef: Record<string, number> | undefined): void {
  if (!ef) return;
  s.conf = clamp(s.conf + ganho(s.conf, ef.conf || 0));
  s.info = clamp(s.info + ganho(s.info, ef.info || 0));
  s.urg = clamp(s.urg + ganho(s.urg, ef.urg || 0));
  s.pac = clamp(s.pac + ganho(s.pac, ef.pac || 0));
}

function clonar(state: GameState): GameState {
  return {
    ...state,
    mao: [...state.mao], usadas: [...state.usadas], jogadas: [...state.jogadas],
    serie: [...state.serie], historico: [...state.historico],
    janelaLog: [...state.janelaLog], armadilhasVistas: [...state.armadilhasVistas],
    armadilhasCaiu: [...state.armadilhasCaiu],
  };
}

export function jogar(state: GameState, cartaId: string): GameState {
  if (!state || state.fim) return state;
  const s = clonar(state);
  const c = carta(cartaId);
  if (!c) return state;
  const antes = sinal(s);
  const avisos: string[] = [];
  s.jogadas.push(cartaId);
  s.turno++;

  /* exigência pendente do evento anterior */
  if (s.exigencia) {
    const ex = s.exigencia;
    let atendeu = false;
    if (ex.aceita) {
      if (ex.aceita.cartas?.includes(cartaId)) atendeu = true;
      if (ex.aceita.familias?.includes(c.familia)) atendeu = true;
    }
    if (atendeu) { aplicar(s, ex.bonus); s.eventosOk++; avisos.push('Você leu o momento certo.'); }
    else {
      aplicar(s, ex.penal);
      avisos.push(ex.msgFalha || 'Você ignorou o que ele acabou de pedir.');
      s.eventosFalha++;
      if (ex.armadilha) s.armadilhasCaiu.push(ex.armadilha);
      if (s.rev.resistencia) s.resistencia++;
    }
    s.exigencia = null;
  }

  /* escuta obrigatória */
  if (s.exigeEscuta && c.familia !== 'escuta' && !c.fecha) {
    aplicar(s, R.escutaIgnoradaPenal); s.escutaIgnorada++;
    avisos.push(R.escutaIgnoradaTell);
    s.armadilhasCaiu.push('Você seguiu o roteiro logo depois de ele abrir algo pessoal.');
  }
  s.exigeEscuta = false;

  /* detector de interrogatório */
  if (c.familia === 'diagnostico' && !c.naoConta) s.seqDiag++;
  else if (c.familia !== 'diagnostico') s.seqDiag = 0;
  const limiteInterrog = s.rev.interroga || R.interrogatorioLimite;
  const interrogou = s.seqDiag >= limiteInterrog;
  if (interrogou) {
    aplicar(s, R.interrogatorioPenal); s.interrogatorios++;
    s.armadilhasCaiu.push(`Turno ${s.turno}: três perguntas de diagnóstico seguidas viraram interrogatório.`);
  }

  if (c.fecha) return resolverFechamento(s, c, avisos);

  /* efeito da carta */
  const res = resolve(cartaId, s);
  const ef = res.ef || {};
  const repetida = s.usadas.includes(cartaId);
  const aj: Record<string, number> = {};
  (['conf', 'info', 'urg', 'pac'] as const).forEach((k) => {
    const v = ef[k] || 0;
    aj[k] = v > 0 && repetida ? v * R.repeticaoMult : v;
  });
  aplicar(s, aj);
  if (!repetida) s.usadas.push(cartaId);

  s.pac = clamp(s.pac - R.drenoPaciencia - (c.familia === 'diagnostico' ? R.drenoDiagnostico : 0));

  const p = s.persona;
  let revelouRaiz = false, revelouFalsa = false;

  /* preparo acumulado (escuta que abre caminho pra raiz) */
  const g = p.gatilhoRaiz;
  if (g?.preparo?.includes(cartaId)) s.preparo++;

  /* raiz falsa */
  const gf = p.gatilhoFalso;
  if (!s.raizFalsaRevelada && !s.raizRevelada && gf && gf.cartas.includes(cartaId)
    && s.turno >= (gf.turnoMin || 0)) {
    s.raizFalsaRevelada = true; revelouFalsa = true;
    s.info = clamp(s.info + 6);
    s.armadilhasVistas.push(`A explicação falsa apareceu no turno ${s.turno}.`);
  }

  /* raiz real — exige carta certa, turno mínimo, medidores E preparo */
  if (!s.raizRevelada && g && g.cartas.includes(cartaId)
    && s.turno >= (g.turnoMin || 0) && condOk(g.exige, s)
    && s.preparo >= ((g.minPreparo || 0) + s.resistencia)) {
    s.raizRevelada = true; revelouRaiz = true;
    s.conf = clamp(s.conf + 6); s.info = clamp(s.info + 10); s.pac = clamp(s.pac + 8);
    if (!s.mao.includes(p.cartaRaiz)) s.mao.push(p.cartaRaiz);
  }

  /* textos */
  if (interrogou) { s.fala = R.interrogatorioFala; s.tell = R.interrogatorioTell; s.dica = ''; }
  else if (revelouRaiz) {
    s.fala = p.ctx.falaRaiz || txt(s, '{motivoOculto}');
    s.tell = 'Ele muda o tom. Alguma coisa nova entrou na sua mão.';
    s.dica = 'Essa é a raiz real. A carta nova é o caminho.';
  } else if (revelouFalsa) {
    s.fala = p.falaFalsa || '';
    s.tell = 'Ele te deu uma explicação. Soa ensaiada.';
    s.dica = 'Cuidado: nem toda confissão é a raiz.';
  } else {
    s.fala = txt(s, res.fala) || '...';
    s.tell = txt(s, res.tell) || '';
    s.dica = res.dica || '';
  }
  if (res.exigeEscuta) s.exigeEscuta = true;

  /* janela de fechamento (agendamento) */
  const reg = p.fechar || {};
  const pronto = condOk({ conf: reg.conf, info: reg.info, urg: reg.urg }, s) && (!reg.exigeRaiz || s.raizRevelada);
  if (s.janelaAte && s.turno > s.janelaAte) {
    aplicar(s, R.decaimentoJanela);
    s.janelaLog.push(`Janela aberta no turno ${s.janelaAte - R.janelaTurnos} e perdida no turno ${s.turno}.`);
    s.janelaAte = null; s.janelasPerdidas++; s.liberaJanela = s.turno + R.janelaCooldown;
    avisos.push('A janela passou. Ele já tinha decidido e você continuou apresentando.');
  } else if (pronto && !s.janelaAte && s.turno >= s.liberaJanela) {
    s.janelaAte = s.turno + R.janelaTurnos;
    avisos.push(s.janelasPerdidas > 0
      ? 'Ele volta a perguntar como marcar.'
      : 'Ele pergunta como funciona pra marcar.');
  }

  /* evento do próximo turno */
  if (p.eventos) {
    for (const ev of p.eventos) {
      if (ev.turno === s.turno + 1 && !s.fim) {
        s.fala = txt(s, ev.fala); s.tell = txt(s, ev.tell); s.dica = ev.dica || '';
        s.exigencia = ev; s.exigeEscuta = false;
        if (ev.armadilha) s.armadilhasVistas.push(ev.armadilha);
        break;
      }
    }
  }

  const depois = sinal(s);
  s.ultimoDelta = depois - antes;
  s.serie.push(depois);
  s.aviso = avisos.join(' ');
  s.historico.push({
    turno: s.turno, carta: c.nome, familia: c.familia,
    delta: Math.round(depois - antes),
    nota: interrogou ? 'interrogatório' : revelouRaiz ? 'revelou a raiz' : revelouFalsa ? 'pista falsa' : '',
  });

  if (s.pac <= 0) {
    s.fim = { tipo: 'derrota', titulo: 'Ele encerrou a call', texto: 'A paciência acabou antes do seu argumento. ' + p.derrotaFria };
  } else if (s.turno >= s.turnosMax) {
    s.fim = { tipo: 'tempo', titulo: 'O tempo da ligação acabou', texto: 'A call terminou sem agendamento e sem próximo passo. ' + p.derrotaFria };
  }
  return s;
}

function resolverFechamento(s: GameState, c: Carta, avisos: string[]): GameState {
  const p = s.persona, reg = p.fechar || {};
  const ok = condOk({ conf: reg.conf, info: reg.info, urg: reg.urg }, s) && (!reg.exigeRaiz || s.raizRevelada);
  s.historico.push({ turno: s.turno, carta: c.nome, familia: c.familia, delta: 0, nota: '' });

  if (c.encerraSuave) {
    const bom = s.conf >= 48 && s.pac >= 20;
    s.fim = bom
      ? { tipo: 'parcial', titulo: 'Próximo passo travado',
          texto: 'Você não marcou hoje, mas saiu com dia, hora e consultor definidos. Num lead que ainda não estava pronto, isso vale mais que forçar um sim que morreria depois.' }
      : { tipo: 'derrota', titulo: 'Próximo passo vazio',
          texto: 'Você marcou um retorno, mas sem confiança construída ele não vai atender. ' + p.derrotaFria };
  } else if (ok) {
    if (s.janelaAte) s.fechouNaJanela = true;
    s.fim = { tipo: 'vitoria', titulo: 'Reunião marcada', texto: p.vitoria };
  } else {
    aplicar(s, { conf: -24, urg: -16 });
    s.serie.push(sinal(s));
    const motivo = !s.raizRevelada
      ? 'Você tentou marcar sem nunca ter chegado na objeção real.'
      : (s.pac < 25 ? 'A raiz apareceu, mas você chegou nela com a paciência dele no fim.'
        : 'A raiz apareceu, mas confiança e urgência ainda não sustentavam um sim.');
    s.fim = { tipo: 'derrota', titulo: 'Convite fora do timing', texto: motivo + ' ' + p.derrotaFria };
    s.armadilhasCaiu.push(`Turno ${s.turno}: convite pra call feito fora do timing.`);
  }
  s.aviso = avisos.join(' ');
  return s;
}

/* ============================================================
   PONTUAÇÃO
   ============================================================ */
const MULT_DIF: Record<string, number> = { 'Treino': 1.0, 'Média': 1.25, 'Difícil': 1.6, 'Muito difícil': 2.0 };

export interface ItemPontuacao { label: string; pts: number; det: string }
export interface Pontuacao { itens: ItemPontuacao[]; subtotal: number; mult: number; total: number; rank: { l: string; t: string } }

export function calcularPontos(s: GameState): Pontuacao {
  const p = s.persona, f = s.fim!;
  const it: ItemPontuacao[] = [];
  const add = (label: string, pts: number, det = '') => { if (pts !== 0) it.push({ label, pts: Math.round(pts), det }); };

  const base = f.tipo === 'vitoria' ? 500 : f.tipo === 'parcial' ? 260 : 0;
  add(f.tipo === 'vitoria' ? 'Marcou a reunião' : f.tipo === 'parcial' ? 'Próximo passo travado' : 'Não agendou', base);

  add('Chegou na raiz oculta', s.raizRevelada ? 200 : 0);
  if (!s.raizRevelada) add('Não chegou na raiz', -120);
  add('Momentos lidos corretamente', s.eventosOk * 70, `${s.eventosOk}×`);
  add('Momentos ignorados', s.eventosFalha * -60, `${s.eventosFalha}×`);
  add('Virou interrogatório', s.interrogatorios * -55, `${s.interrogatorios}×`);
  add('Ignorou abertura emocional', s.escutaIgnorada * -60, `${s.escutaIgnorada}×`);
  add('Agendou dentro da janela', s.fechouNaJanela ? 150 : 0);
  add('Janelas de agendamento perdidas', s.janelasPerdidas * -90, `${s.janelasPerdidas}×`);

  const med = s.conf * 1.2 + s.info * 0.8 + s.urg * 1.0 + s.pac * 0.4;
  add('Estado final da call', med, `conf ${Math.round(s.conf)} · info ${Math.round(s.info)} · urg ${Math.round(s.urg)} · pac ${Math.round(s.pac)}`);

  if (f.tipo === 'vitoria' && s.turno < s.turnosMax) {
    const poupados = Math.min(6, s.turnosMax - s.turno);
    add('Eficiência (turnos poupados)', poupados * 11, `${poupados} turnos`);
  }

  let soma = 0; it.forEach((x) => { soma += x.pts; });
  const mult = MULT_DIF[p.dificuldade] || 1;
  const total = Math.max(0, Math.round(soma * mult));

  const rank = total >= 1400 ? { l: 'S', t: 'Excepcional' }
    : total >= 1100 ? { l: 'A', t: 'Muito bom' }
    : total >= 800 ? { l: 'B', t: 'Sólido' }
    : total >= 500 ? { l: 'C', t: 'Precisa treinar' }
    : { l: 'D', t: 'Refazer' };
  return { itens: it, subtotal: Math.round(soma), mult, total, rank };
}

export const ORDEM_DIF: Record<string, number> = { 'Treino': 0, 'Média': 1, 'Difícil': 2, 'Muito difícil': 3 };

export function rotuloFamilia(f: Familia | string): string {
  return ({ diagnostico: 'Diagnóstico', escuta: 'Escuta', valor: 'Valor', negociacao: 'Agenda', fechamento: 'Agendamento', raiz: 'Nova carta' } as Record<string, string>)[f] || f;
}

/** Replay determinístico: reconstrói o resultado de uma partida a partir da
 *  sequência de cartas jogadas — usado pra recalcular pontos na hora de
 *  salvar/exibir o placar, em vez de confiar num número que veio do cliente. */
export function jogarSequencia(pid: string, jogadas: string[]): { pontuacao: Pontuacao; estado: GameState } | null {
  if (!pid || !Array.isArray(jogadas) || !persona(pid)) return null;
  try {
    let s = novaPartida(pid);
    for (const id of jogadas) {
      if (s.fim) break;
      if (!carta(id)) return null;
      s = jogar(s, id);
    }
    if (!s.fim) return null;
    return { pontuacao: calcularPontos(s), estado: s };
  } catch {
    return null;
  }
}
