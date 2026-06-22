import { useState, useEffect, useCallback, useRef } from 'react';
import { X, AlertTriangle, CheckCircle2, RefreshCw, Shield, Code2, Pencil, Lightbulb, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useContentStore } from '@/store/contentStore';
import { runAgathaReview, type ReviewProgress } from '@/lib/agathaReview';

const AGENT_OWNERS = new Set([
  'gabrielly.oliveira@cardapioweb.com',
  'pedro.ferreira@cardapioweb.com',
]);
const DIA_MS = 24 * 60 * 60 * 1000;
/** Não renderiza/roda dentro dos iframes de scrape (anti-recursão). */
const IS_SCRAPE_VIEW = new URLSearchParams(window.location.search).get('agatha') === 'scrape';

interface AgentFinding {
  id: string;
  severity: 'error' | 'warning' | 'ok';
  message: string;
  at: string;
}

interface AgentData {
  lastCheck: string;
  status: 'ok' | 'warning' | 'error';
  findings: AgentFinding[];
}

/* ── Revisão de conteúdo da Agatha (content_overrides['agatha.review']) ── */
interface ReviewFinding {
  type: 'erro' | 'sugestao';
  trecho: string;
  sugestao: string;
  severidade: 'baixa' | 'media' | 'alta';
}
interface ReviewTab {
  papel: string;
  route: string;
  label: string;
  findings: ReviewFinding[];
}
interface ReviewData {
  lastRun: string | null;
  running: boolean;
  progress?: { atual: number; total: number; label: string };
  tabs: ReviewTab[];
}

/* ───────────────── Painel do Rafael (monitora dashboards) ───────────────── */
function AgentPanel({
  name, color, icon, data, onClose,
}: {
  name: string;
  color: 'blue' | 'pink';
  icon: React.ReactNode;
  data: AgentData | null;
  onClose: () => void;
}) {
  const border = color === 'blue' ? 'border-blue-500/30' : 'border-pink-400/30';
  const textCls = color === 'blue' ? 'text-blue-300' : 'text-pink-300';
  const bgCls = color === 'blue' ? 'bg-blue-500/10' : 'bg-pink-500/10';

  return (
    <div
      className={`fixed top-24 right-8 w-80 rounded-2xl border ${border} shadow-2xl overflow-hidden`}
      style={{ background: 'linear-gradient(180deg, #1f1040 0%, #150d30 100%)', zIndex: 250 }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#ffffff0a]">
        <div className="flex items-center gap-2">
          {icon}
          <span className={`text-[12px] font-bold uppercase tracking-wider ${textCls}`}>{name}</span>
          {data && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${bgCls} ${textCls} font-bold border ${border}`}>
              {data.status}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-[#7c5aa8] hover:text-white transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="max-h-72 overflow-y-auto">
        {!data ? (
          <div className="flex items-center justify-center gap-2 py-8 text-[#7c5aa8]">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-[12px]">Aguardando verificação...</span>
          </div>
        ) : data.findings.filter(f => f.severity !== 'ok').length === 0 ? (
          <div className="text-center py-8 px-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-[13px] text-white font-bold">Tudo certo por aqui, Gabi!</p>
            <p className="text-[11px] text-[#7c5aa8] mt-0.5">Nenhum problema encontrado.</p>
          </div>
        ) : (
          data.findings.map(f => (
            <div key={f.id} className="flex items-start gap-3 px-4 py-3.5 border-b border-[#ffffff06]">
              <div className="shrink-0 mt-0.5">
                {f.severity === 'error'
                  ? <AlertTriangle className="h-4 w-4 text-red-400" />
                  : f.severity === 'warning'
                    ? <AlertTriangle className="h-4 w-4 text-amber-400" />
                    : <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-[#d4c0ee] leading-snug">{f.message}</p>
                <p className="text-[10px] text-[#7c5aa8] mt-0.5">{f.at}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {data && (
        <div className="px-4 py-2.5 border-t border-[#ffffff08]">
          <p className="text-[10px] text-[#7c5aa8]">Última verificação: {data.lastCheck}</p>
        </div>
      )}
    </div>
  );
}

/* ──────────── Painel da Agatha (revisora de conteúdo / Gemini) ──────────── */
function AgathaPanel({
  data, progress, onReview, onClose,
}: {
  data: ReviewData | null;
  progress: ReviewProgress | null;
  onReview: () => void;
  onClose: () => void;
}) {
  const running = Boolean(progress) || Boolean(data?.running);
  const tabsComFindings = (data?.tabs ?? []).filter(t => t.findings.length > 0);
  const totalErros = (data?.tabs ?? []).reduce(
    (n, t) => n + t.findings.filter(f => f.type === 'erro').length, 0,
  );
  const prog = progress ?? data?.progress ?? null;
  const ultima = data?.lastRun
    ? new Date(data.lastRun).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div
      className="fixed top-24 right-8 w-[360px] rounded-2xl border border-pink-400/30 shadow-2xl overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1f1040 0%, #150d30 100%)', zIndex: 250 }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#ffffff0a]">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-pink-300" />
          <span className="text-[12px] font-bold uppercase tracking-wider text-pink-300">Agatha · Revisão</span>
          {!running && data && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${
              totalErros > 0
                ? 'bg-red-500/10 text-red-300 border-red-400/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30'
            }`}>
              {totalErros > 0 ? `${totalErros} erro${totalErros > 1 ? 's' : ''}` : 'ok'}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-[#7c5aa8] hover:text-white transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Ação / progresso */}
      <div className="px-4 py-3 border-b border-[#ffffff08]">
        {running ? (
          <div className="flex items-center gap-2.5">
            <RefreshCw className="h-4 w-4 text-pink-300 animate-spin shrink-0" />
            <div className="min-w-0">
              <p className="text-[12px] text-white font-semibold truncate">
                Revisando: {prog?.label ?? '…'}
              </p>
              {prog && (
                <p className="text-[10px] text-[#7c5aa8]">Aba {prog.atual} de {prog.total}</p>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={onReview}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-400/30 text-pink-200 text-[12px] font-bold transition-colors"
          >
            <Play className="h-3.5 w-3.5" /> Revisar agora
          </button>
        )}
      </div>

      {/* Findings agrupados por aba */}
      <div className="max-h-80 overflow-y-auto">
        {!data ? (
          <div className="flex items-center justify-center gap-2 py-8 text-[#7c5aa8]">
            <span className="text-[12px]">Nenhuma revisão ainda.</span>
          </div>
        ) : tabsComFindings.length === 0 && !running ? (
          <div className="text-center py-8 px-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-[13px] text-white font-bold">Escrita impecável, Gabi!</p>
            <p className="text-[11px] text-[#7c5aa8] mt-0.5">Nenhum erro ou sugestão nas abas.</p>
          </div>
        ) : (
          tabsComFindings.map(tab => (
            <div key={`${tab.papel}-${tab.route}`} className="border-b border-[#ffffff06]">
              <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-pink-300/80">
                {tab.label}
              </p>
              {tab.findings.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 px-4 py-2">
                  <span className="shrink-0 mt-0.5">
                    {f.type === 'erro'
                      ? <Pencil className="h-3.5 w-3.5 text-red-400" />
                      : <Lightbulb className="h-3.5 w-3.5 text-amber-300" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#e6d6ff] leading-snug">
                      <span className="text-[#9c7fc4]">“{f.trecho}”</span>
                    </p>
                    <p className="text-[11px] text-[#b79be0] leading-snug mt-0.5">→ {f.sugestao}</p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {ultima && (
        <div className="px-4 py-2.5 border-t border-[#ffffff08]">
          <p className="text-[10px] text-[#7c5aa8]">Última revisão: {ultima}</p>
        </div>
      )}
    </div>
  );
}

/* ── Boneco humano (estilo emoji de pessoa) que anda pela tela ── */
const FW = 26; // largura aprox. do boneco
const FH = 46; // altura aprox.

function Figure({
  color, figRef, errors, busy, onClick, title,
}: {
  color: 'blue' | 'pink';
  figRef: React.RefObject<HTMLDivElement>;
  errors: number;
  busy?: boolean;
  onClick: () => void;
  title: string;
}) {
  const main = color === 'blue' ? '#3b82f6' : '#f472b6';
  const head = color === 'blue' ? '#60a5fa' : '#f9a8d4';
  const leg = (delay: string): React.CSSProperties => ({
    position: 'absolute', top: 0, left: 5.5, width: 4, height: 13,
    borderRadius: 2, background: main, transformOrigin: 'top center',
    animation: 'agentStep .42s ease-in-out infinite', animationDelay: delay,
  });
  const eye = (side: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute', top: 6, width: 3, height: 3, borderRadius: '50%', background: '#fff',
    ...(side === 'left' ? { left: 4 } : { right: 4 }),
  });

  return (
    <div
      ref={figRef}
      onClick={onClick}
      title={title}
      style={{
        position: 'absolute', top: 0, left: 0, width: FW, height: FH,
        cursor: 'pointer', pointerEvents: 'auto', willChange: 'transform',
        filter: 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.3))',
      }}
    >
      <div style={{ animation: 'agentBob .42s ease-in-out infinite' }}>
        <div style={{ position: 'relative', width: 18, height: 18, borderRadius: '50%', margin: '0 auto', background: head }}>
          <span style={eye('left')} />
          <span style={eye('right')} />
        </div>
        <div style={{ width: 15, height: 17, borderRadius: 7, margin: '1px auto 0', background: main }} />
        <div style={{ position: 'relative', width: 15, height: 13, margin: '-1px auto 0' }}>
          <span style={leg('0s')} />
          <span style={leg('.21s')} />
        </div>
      </div>
      {busy ? (
        <span style={{
          position: 'absolute', top: -7, left: '50%', marginLeft: -6,
          width: 12, height: 12, borderRadius: '50%',
          border: '2px solid #fff', borderTopColor: 'transparent',
          animation: 'spin 0.7s linear infinite',
        }} />
      ) : errors > 0 ? (
        <span style={{
          position: 'absolute', top: -7, left: '50%', marginLeft: -6,
          background: '#ef4444', color: '#fff', fontSize: 8, fontWeight: 900, lineHeight: 1,
          borderRadius: '50%', width: 12, height: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {errors > 9 ? '9+' : errors}
        </span>
      ) : null}
    </div>
  );
}

export function AgentBalls() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rafaelOpen, setRafaelOpen] = useState(false);
  const [agathaOpen, setAgathaOpen] = useState(false);
  const [progress, setProgress] = useState<ReviewProgress | null>(null);
  const overrides = useContentStore(s => s.overrides);
  const loaded = useContentStore(s => s.loaded);
  const autoFired = useRef(false);

  const playgroundRef = useRef<HTMLDivElement>(null);
  const rafaelRef = useRef<HTMLDivElement>(null);
  const agathaRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null);
    });
  }, []);

  // Pausa a brincadeira enquanto um painel está aberto (pra dar pra clicar com calma).
  useEffect(() => { pausedRef.current = rafaelOpen || agathaOpen; }, [rafaelOpen, agathaOpen]);

  const iniciarRevisao = useCallback(() => {
    runAgathaReview(setProgress);
  }, []);

  const reviewData = overrides['agatha.review'] as ReviewData | undefined;

  // Auto 1×/dia: ao abrir o dashboard, se a última revisão foi há mais de 24h.
  useEffect(() => {
    if (IS_SCRAPE_VIEW || !AGENT_OWNERS.has(userEmail ?? '') || !loaded || autoFired.current) return;
    const last = reviewData?.lastRun ? new Date(reviewData.lastRun).getTime() : 0;
    const stale = Date.now() - last > DIA_MS;
    if (!reviewData?.running && stale) {
      autoFired.current = true;
      runAgathaReview(setProgress);
    }
  }, [userEmail, loaded, reviewData]);

  // Pega-pega: um persegue o outro; ao "pegar", trocam os papéis.
  useEffect(() => {
    if (IS_SCRAPE_VIEW || !AGENT_OWNERS.has(userEmail ?? '')) return;
    const pg = playgroundRef.current;
    if (!pg) return;

    const R = { x: 30, y: 24 };   // Rafael
    const A = { x: 160, y: 90 };  // Agatha
    let it: 'R' | 'A' = 'A';      // quem está "pegando"
    let alvo = { x: 80, y: 40 };  // ponto de passeio do fugitivo
    let retargetAt = 0;
    let raf = 0;

    const dims = () => ({ w: Math.max(FW + 8, pg.clientWidth), h: Math.max(FH + 8, pg.clientHeight) });
    const sorteiaAlvo = () => {
      const { w, h } = dims();
      return { x: 6 + Math.random() * (w - FW - 12), y: 6 + Math.random() * (h - FH - 12) };
    };

    const passo = (t: number) => {
      raf = requestAnimationFrame(passo);
      if (pausedRef.current) return;
      const { w, h } = dims();
      const SPEED = 1.05;

      const cacador = it === 'R' ? R : A;
      const fujao = it === 'R' ? A : R;

      // cacador vai na direção do fujão (um tiquinho mais rápido)
      const cdx = fujao.x - cacador.x, cdy = fujao.y - cacador.y;
      const cd = Math.hypot(cdx, cdy) || 1;
      cacador.x += (cdx / cd) * SPEED * 1.18;
      cacador.y += (cdy / cd) * SPEED * 1.18;

      // fujão passeia até um alvo e foge se o cacador chega perto
      if (t > retargetAt || Math.hypot(alvo.x - fujao.x, alvo.y - fujao.y) < 14) {
        alvo = sorteiaAlvo();
        retargetAt = t + 1400 + Math.random() * 1400;
      }
      const adx = alvo.x - fujao.x, ady = alvo.y - fujao.y;
      const ad = Math.hypot(adx, ady) || 1;
      const fleeW = cd < 95 ? (95 - cd) / 95 : 0;
      fujao.x += ((adx / ad) * (1 - fleeW) + (-cdx / cd) * fleeW) * SPEED;
      fujao.y += ((ady / ad) * (1 - fleeW) + (-cdy / cd) * fleeW) * SPEED;

      // limites da tela
      for (const o of [R, A]) {
        o.x = Math.max(2, Math.min(w - FW, o.x));
        o.y = Math.max(2, Math.min(h - FH, o.y));
      }

      // pegou! troca quem corre atrás
      if (cd < 20) {
        it = it === 'R' ? 'A' : 'R';
        alvo = sorteiaAlvo();
        retargetAt = t + 700;
      }

      if (rafaelRef.current) rafaelRef.current.style.transform = `translate(${R.x}px, ${R.y}px)`;
      if (agathaRef.current) agathaRef.current.style.transform = `translate(${A.x}px, ${A.y}px)`;
    };

    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [userEmail]);

  if (IS_SCRAPE_VIEW || !AGENT_OWNERS.has(userEmail ?? '')) return null;

  const rafaelData = overrides['rafael.status'] as AgentData | undefined;

  const rafaelErrors = (rafaelData?.findings ?? []).filter(f => f.severity === 'error').length;
  const agathaErrors = (reviewData?.tabs ?? []).reduce(
    (n, t) => n + t.findings.filter(f => f.type === 'erro').length, 0,
  );
  const agathaBusy = Boolean(progress) || Boolean(reviewData?.running);

  return (
    <>
      {rafaelOpen && (
        <AgentPanel
          name="Rafael"
          color="blue"
          icon={<Shield className="h-4 w-4 text-blue-300" />}
          data={rafaelData ?? null}
          onClose={() => setRafaelOpen(false)}
        />
      )}
      {agathaOpen && (
        <AgathaPanel
          data={reviewData ?? null}
          progress={progress}
          onReview={iniciarRevisao}
          onClose={() => setAgathaOpen(false)}
        />
      )}

      {/* Playground: Rafael e Agatha brincando de pega-pega pela tela */}
      <div ref={playgroundRef} className="absolute inset-0" style={{ pointerEvents: 'none', zIndex: 20 }}>
        <Figure
          color="blue"
          figRef={rafaelRef}
          errors={rafaelErrors}
          title="Rafael — monitora dashboards"
          onClick={() => { setRafaelOpen(o => !o); setAgathaOpen(false); }}
        />
        <Figure
          color="pink"
          figRef={agathaRef}
          errors={agathaErrors}
          busy={agathaBusy}
          title="Agatha — revisa a escrita das abas"
          onClick={() => { setAgathaOpen(o => !o); setRafaelOpen(false); }}
        />
      </div>
    </>
  );
}
