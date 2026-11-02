/** Seções da aba Progressão de Carreira: jornada Júnior → Pleno → Sênior,
 *  simulador por tempo de casa e detalhes de cada nível. */
import {
  GraduationCap, TrendingUp, Crown, MapPin, ChevronRight, ChevronDown,
  Layers, CalendarRange, Timer, Flag, Minus, Plus, Info, Pencil,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CLOSER_PROGRESSAO } from '@/data/playbookCloser';
import { EditableText } from '@/admin/EditableText';
import { useEditor } from '@/admin/EditorContext';
import { useEditableContent } from '@/store/contentStore';

const GRUPOS: {
  label: string; prefixo: string; icon: LucideIcon;
  card: string; iconBox: string; mini: string; dot: string;
}[] = [
  { label: 'Júnior', prefixo: 'Júnior', icon: GraduationCap,
    card: 'bg-cw-surface border-cw-border', iconBox: 'bg-cw-purple/10 text-cw-purple',
    mini: 'bg-cw-elevated border-cw-border', dot: 'bg-cw-purple/30' },
  { label: 'Pleno', prefixo: 'Pleno', icon: TrendingUp,
    card: 'bg-cw-purple/[0.06] border-cw-purple/25', iconBox: 'bg-cw-purple text-white',
    mini: 'bg-cw-surface border-cw-purple/20', dot: 'bg-cw-purple' },
  { label: 'Sênior', prefixo: 'Sênior', icon: Crown,
    card: 'bg-cw-surface border-cw-yellow/50', iconBox: 'bg-cw-yellow/15 text-[#b07a00]',
    mini: 'bg-cw-yellow/[0.06] border-cw-yellow/30', dot: 'bg-cw-yellow' },
];

/** Meses mínimos de casa do nível ("4 meses" → 4; entrada "—" → 0). */
const meses = (tempo: string) => parseInt(tempo, 10) || 0;

const grupoDe = (nome: string) => GRUPOS.find(g => nome.startsWith(g.prefixo)) ?? GRUPOS[0];
const slug = (nome: string) => nome.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, '-');

const ULTIMO = CLOSER_PROGRESSAO[CLOSER_PROGRESSAO.length - 1];
const MESES_MAX = meses(ULTIMO.tempo);

/** Último nível cujo tempo mínimo já foi atingido com `m` meses de casa. */
export function nivelPorTempo(m: number) {
  let idx = 0;
  CLOSER_PROGRESSAO.forEach((n, i) => { if (m >= meses(n.tempo)) idx = i; });
  return idx;
}

/* ----------------------- RESUMO ----------------------- */

export function ResumoCarreira() {
  const intervalo = meses(CLOSER_PROGRESSAO[1].tempo);
  const stats: { valor: string; label: string; icon: LucideIcon }[] = [
    { valor: String(GRUPOS.length), label: 'etapas', icon: Layers },
    { valor: String(CLOSER_PROGRESSAO.length), label: 'níveis', icon: Flag },
    { valor: `${intervalo} meses`, label: 'mínimo entre níveis', icon: Timer },
    { valor: `${MESES_MAX} meses`, label: `até ${ULTIMO.nome}`, icon: CalendarRange },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(s => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="cw-card px-4 py-3 flex items-center gap-3">
            <span className="h-9 w-9 rounded-xl bg-cw-purple/10 text-cw-purple flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-black text-cw-text leading-none">{s.valor}</p>
              <p className="text-[11px] text-cw-muted mt-1 truncate">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------- SIMULADOR ----------------------- */

export function SimuladorTempo({ mesesCasa, onChange }: { mesesCasa: number; onChange: (m: number) => void }) {
  const idx = nivelPorTempo(mesesCasa);
  const atual = CLOSER_PROGRESSAO[idx];
  const proximo = CLOSER_PROGRESSAO[idx + 1];
  const ini = meses(atual.tempo);
  const pct = proximo ? ((mesesCasa - ini) / (meses(proximo.tempo) - ini)) * 100 : 100;
  const set = (m: number) => onChange(Math.min(MESES_MAX + 5, Math.max(0, m)));

  return (
    <div className="cw-card p-4 sm:p-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
      <div className="space-y-3">
        <div>
          <p className="text-sm font-black text-cw-text">Simule pelo seu tempo de casa</p>
          <p className="text-xs text-cw-muted mt-0.5">Arraste ou ajuste os meses para ver em que nível da jornada você estaria.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => set(mesesCasa - 1)}
            aria-label="Menos um mês"
            className="h-8 w-8 rounded-lg border border-cw-border text-cw-muted hover:text-cw-text hover:bg-cw-elevated flex items-center justify-center shrink-0"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <input
            type="range"
            min={0}
            max={MESES_MAX + 5}
            value={mesesCasa}
            onChange={e => set(Number(e.target.value))}
            aria-label="Meses de casa"
            className="flex-1 accent-[#A543FA] cursor-pointer"
          />
          <button
            onClick={() => set(mesesCasa + 1)}
            aria-label="Mais um mês"
            className="h-8 w-8 rounded-lg border border-cw-border text-cw-muted hover:text-cw-text hover:bg-cw-elevated flex items-center justify-center shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-sm text-cw-text">
          <span className="text-2xl font-black text-cw-purple tabular-nums">{mesesCasa}</span>{' '}
          {mesesCasa === 1 ? 'mês' : 'meses'} de casa
        </p>
      </div>

      <div className="rounded-xl bg-cw-elevated border border-cw-border p-4 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs text-cw-muted">Nível possível pelo tempo</p>
          <p className="text-base font-black text-cw-text flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-cw-purple" /> {atual.nome}
          </p>
        </div>
        {proximo ? (
          <>
            <div className="h-2 rounded-full bg-cw-border overflow-hidden">
              <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-cw-muted">
              Próximo nível: <strong className="text-cw-text">{proximo.nome}</strong> em{' '}
              <strong className="text-cw-text">{meses(proximo.tempo) - mesesCasa}</strong>{' '}
              {meses(proximo.tempo) - mesesCasa === 1 ? 'mês' : 'meses'}
            </p>
          </>
        ) : (
          <p className="text-xs font-semibold text-[#9a6b00] flex items-center gap-1.5">
            <Crown className="h-3.5 w-3.5" /> Topo da jornada de closer
          </p>
        )}
        <p className="text-[11px] text-cw-muted/80 flex items-start gap-1.5 pt-1 border-t border-cw-border">
          <Info className="h-3 w-3 mt-0.5 shrink-0" />
          Considera só o tempo mínimo de empresa. A promoção também depende dos critérios da liderança.
        </p>
      </div>
    </div>
  );
}

/* ----------------------- JORNADA ----------------------- */

/** `nivelAtual` (ex.: "Pleno 1") destaca um nível. `simulado` troca o selo
 *  "Você está aqui" por "Simulação" — o sistema ainda não tem o nível real do closer. */
export function ProgressaoSection({ nivelAtual, simulado }: { nivelAtual?: string; simulado?: boolean }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-stretch gap-2">
      {GRUPOS.map((g, gi) => {
        const Icon = g.icon;
        const niveis = CLOSER_PROGRESSAO.filter(n => n.nome.startsWith(g.prefixo));
        return (
          <div key={g.label} className="contents">
            <div className={cn('flex-1 rounded-2xl border p-4 space-y-3', g.card)}>
              <div className="flex items-center gap-2.5">
                <span className={cn('h-9 w-9 rounded-xl flex items-center justify-center', g.iconBox)}>
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-black uppercase tracking-wider text-cw-text">{g.label}</p>
                  <p className="text-[11px] text-cw-muted">Etapa {gi + 1} de {GRUPOS.length}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {niveis.map(n => {
                  const aqui = n.nome === nivelAtual;
                  return (
                    <div
                      key={n.nome}
                      className={cn(
                        'relative rounded-xl border px-2 pt-3 pb-2.5 text-center transition-colors',
                        aqui ? 'bg-cw-purple border-cw-purple text-white shadow-md' : g.mini,
                      )}
                    >
                      {aqui && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-0.5 rounded-full bg-cw-yellow px-1.5 py-px text-[8px] font-black uppercase text-cw-text whitespace-nowrap">
                          <MapPin className="h-2 w-2" /> {simulado ? 'Simulação' : 'Você está aqui'}
                        </span>
                      )}
                      <p className={cn('text-xs font-bold', aqui ? 'text-white' : 'text-cw-text')}>{n.nome}</p>
                      <p className={cn('text-[11px] mt-0.5', aqui ? 'text-white/80' : 'text-cw-muted')}>
                        {meses(n.tempo) ? n.tempo : 'Entrada'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            {gi < GRUPOS.length - 1 && (
              <div className="flex items-center justify-center text-cw-purple/50 shrink-0">
                <ChevronDown className="h-5 w-5 lg:hidden" />
                <ChevronRight className="h-5 w-5 hidden lg:block" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------- DETALHE POR NÍVEL ----------------------- */

/** Texto que a liderança preenche no Modo Gestor; some para o closer enquanto estiver vazio. */
function TextoGestor({ storeKey, placeholder, className }: { storeKey: string; placeholder: string; className?: string }) {
  const { isEditing } = useEditor();
  const value = useEditableContent<string>(storeKey, '');
  if (!isEditing && !value) return null;
  return (
    <div className={cn(isEditing && !value && 'flex items-center gap-1.5 text-cw-muted/70 italic', className)}>
      {isEditing && !value && <Pencil className="h-3 w-3 shrink-0" />}
      <EditableText storeKey={storeKey} defaultValue="" multiline placeholder={placeholder} className="text-xs leading-relaxed whitespace-pre-line" />
    </div>
  );
}

export function DetalheNiveis({ nivelAtual }: { nivelAtual?: string }) {
  return (
    <ol className="cw-card p-4 sm:p-5">
      {CLOSER_PROGRESSAO.map((n, i) => {
        const g = grupoDe(n.nome);
        const ant = CLOSER_PROGRESSAO[i - 1];
        const ultimo = i === CLOSER_PROGRESSAO.length - 1;
        const novaEtapa = !ant || grupoDe(ant.nome) !== g;
        const aqui = n.nome === nivelAtual;
        return (
          <li key={n.nome} className="relative pl-24 sm:pl-28">
            {/* Marco de meses + linha */}
            <span className="absolute left-0 top-2.5 w-16 sm:w-20 text-right text-[11px] font-bold tabular-nums text-cw-muted">
              {meses(n.tempo) ? `${meses(n.tempo)} meses` : 'Entrada'}
            </span>
            {!ultimo && <span className="absolute left-[85px] sm:left-[101px] top-5 bottom-0 w-px bg-cw-border" />}
            <span className={cn(
              'absolute left-[80px] sm:left-[96px] top-3 h-[11px] w-[11px] rounded-full ring-4 ring-cw-surface',
              aqui ? 'bg-cw-purple scale-125' : g.dot,
            )} />

            <div className={cn('rounded-xl px-3 py-2 mb-1.5', aqui ? 'bg-cw-purple/[0.07] border border-cw-purple/30' : 'hover:bg-cw-elevated')}>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-cw-text">{n.nome}</p>
                {novaEtapa && (
                  <span className="rounded-full bg-cw-purple/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cw-purple">
                    Início {g.label}
                  </span>
                )}
                {ant && (
                  <span className="text-[11px] text-cw-muted">+{meses(n.tempo) - meses(ant.tempo)} meses depois de {ant.nome}</span>
                )}
                {aqui && <MapPin className="h-3.5 w-3.5 text-cw-purple" />}
              </div>
              <TextoGestor
                storeKey={`closer.carreira.nivel.${slug(n.nome)}.desc`}
                placeholder={`O que se espera de um ${n.nome} (Modo Gestor)`}
                className="mt-1 text-cw-muted"
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ----------------------- COMO FUNCIONA ----------------------- */

export function ComoFunciona() {
  const intervalo = meses(CLOSER_PROGRESSAO[1].tempo);
  const itens = [
    `A jornada tem ${GRUPOS.length} etapas — ${GRUPOS.map(g => g.label).join(', ')} — com ${CLOSER_PROGRESSAO.length / GRUPOS.length} níveis cada.`,
    `Todo closer começa em ${CLOSER_PROGRESSAO[0].nome}.`,
    `Cada novo nível exige pelo menos ${intervalo} meses a mais de empresa.`,
    `O tempo é o mínimo: com ${MESES_MAX} meses de casa já é possível chegar a ${ULTIMO.nome}.`,
  ];
  return (
    <div className="cw-card p-4 sm:p-5 space-y-3 self-start">
      <p className="text-sm font-black text-cw-text flex items-center gap-2">
        <Info className="h-4 w-4 text-cw-purple" /> Como funciona
      </p>
      <ul className="space-y-2">
        {itens.map(t => (
          <li key={t} className="flex items-start gap-2 text-xs text-cw-text leading-relaxed">
            <span className="h-1.5 w-1.5 rounded-full bg-cw-purple mt-1.5 shrink-0" /> {t}
          </li>
        ))}
      </ul>
      <TextoGestor
        storeKey="closer.carreira.criterios"
        placeholder="Critérios de promoção definidos pela liderança (Modo Gestor)"
        className="pt-3 border-t border-cw-border text-cw-text"
      />
    </div>
  );
}
