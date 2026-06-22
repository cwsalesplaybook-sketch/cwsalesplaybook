import { useState, useEffect, useCallback, useRef } from 'react';
import { X, AlertTriangle, CheckCircle2, RefreshCw, Shield, Code2, Pencil, Lightbulb, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useContentStore } from '@/store/contentStore';
import { runAgathaReview, type ReviewProgress } from '@/lib/agathaReview';

const AGENT_OWNER_EMAIL = 'gabrielly.oliveira@cardapioweb.com';
const DIA_MS = 24 * 60 * 60 * 1000;

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
      className={`fixed bottom-28 right-8 w-80 rounded-2xl border ${border} shadow-2xl overflow-hidden`}
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
      className="fixed bottom-28 right-8 w-[360px] rounded-2xl border border-pink-400/30 shadow-2xl overflow-hidden"
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

function Ball({
  color, delay, errors, busy, onClick, title,
}: {
  color: 'blue' | 'pink';
  delay: string;
  errors: number;
  busy?: boolean;
  onClick: () => void;
  title: string;
}) {
  const bg = color === 'blue'
    ? 'radial-gradient(circle at 35% 35%, #93c5fd, #3b82f6)'
    : 'radial-gradient(circle at 35% 35%, #fbcfe8, #f472b6)';
  const shadow = color === 'blue'
    ? '0 0 10px 4px rgba(59,130,246,0.65), 0 0 22px 8px rgba(59,130,246,0.25)'
    : '0 0 10px 4px rgba(244,114,182,0.65), 0 0 22px 8px rgba(244,114,182,0.25)';

  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: 24, height: 24,
        marginLeft: -12, marginTop: -12,
        border: 'none', background: 'none', padding: 0,
        cursor: 'pointer',
        animation: `agentOrbit 4s linear infinite`,
        animationDelay: delay,
      }}
    >
      <div style={{
        width: 24, height: 24,
        borderRadius: '50%',
        background: bg,
        boxShadow: shadow,
        animation: `agentGlow 2s ease-in-out infinite`,
        animationDelay: color === 'pink' ? '1s' : '0s',
      }} />
      {busy ? (
        <span style={{
          position: 'absolute', top: -5, right: -5,
          width: 12, height: 12, borderRadius: '50%',
          border: '2px solid #fff', borderTopColor: 'transparent',
          animation: 'spin 0.7s linear infinite',
        }} />
      ) : errors > 0 ? (
        <span style={{
          position: 'absolute', top: -4, right: -4,
          background: '#ef4444', color: '#fff',
          fontSize: 8, fontWeight: 900, lineHeight: 1,
          borderRadius: '50%', width: 12, height: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {errors > 9 ? '9+' : errors}
        </span>
      ) : null}
    </button>
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null);
    });
  }, []);

  const iniciarRevisao = useCallback(() => {
    runAgathaReview(setProgress);
  }, []);

  const reviewData = overrides['agatha.review'] as ReviewData | undefined;

  // Auto 1×/dia: ao abrir o dashboard, se a última revisão foi há mais de 24h.
  useEffect(() => {
    if (userEmail !== AGENT_OWNER_EMAIL || !loaded || autoFired.current) return;
    const last = reviewData?.lastRun ? new Date(reviewData.lastRun).getTime() : 0;
    const stale = Date.now() - last > DIA_MS;
    if (!reviewData?.running && stale) {
      autoFired.current = true;
      runAgathaReview(setProgress);
    }
  }, [userEmail, loaded, reviewData]);

  if (userEmail !== AGENT_OWNER_EMAIL) return null;

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

      <div className="fixed bottom-8 right-8 flex flex-col items-center gap-1.5" style={{ zIndex: 150 }}>
        <div
          className="relative rounded-full bg-white border border-cw-border shadow-xl"
          style={{ width: 84, height: 84 }}
        >
          <Ball
            color="blue"
            delay="0s"
            errors={rafaelErrors}
            title="Rafael — monitora dashboards"
            onClick={() => { setRafaelOpen(o => !o); setAgathaOpen(false); }}
          />
          <Ball
            color="pink"
            delay="-2s"
            errors={agathaErrors}
            busy={agathaBusy}
            title="Agatha — revisa a escrita das abas"
            onClick={() => { setAgathaOpen(o => !o); setRafaelOpen(false); }}
          />
        </div>
        <div className="flex gap-3">
          <span className="text-[9px] font-bold text-blue-500">Rafael</span>
          <span className="text-[9px] font-bold text-pink-500">Agatha</span>
        </div>
      </div>
    </>
  );
}
