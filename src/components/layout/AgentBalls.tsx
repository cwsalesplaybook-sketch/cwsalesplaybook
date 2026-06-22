import { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle2, RefreshCw, Shield, Code2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useContentStore } from '@/store/contentStore';

const AGENT_OWNER_EMAIL = 'gabrielly.oliveira@cardapioweb.com';

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
        ) : data.findings.length === 0 ? (
          <div className="text-center py-8 px-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-[12px] text-[#d4c0ee] font-semibold">Tudo certo!</p>
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

function Ball({
  color, delay, errors, onClick, title,
}: {
  color: 'blue' | 'pink';
  delay: string;
  errors: number;
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
        width: 20, height: 20,
        marginLeft: -10, marginTop: -10,
        border: 'none', background: 'none', padding: 0,
        cursor: 'pointer',
        animation: `agentOrbit 4s linear infinite`,
        animationDelay: delay,
      }}
    >
      <div style={{
        width: 20, height: 20,
        borderRadius: '50%',
        background: bg,
        boxShadow: shadow,
        animation: `agentGlow 2s ease-in-out infinite`,
        animationDelay: color === 'pink' ? '1s' : '0s',
      }} />
      {errors > 0 && (
        <span style={{
          position: 'absolute', top: -4, right: -4,
          background: '#ef4444', color: '#fff',
          fontSize: 8, fontWeight: 900, lineHeight: 1,
          borderRadius: '50%', width: 12, height: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {errors > 9 ? '9+' : errors}
        </span>
      )}
    </button>
  );
}

export function AgentBalls() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rafaelOpen, setRafaelOpen] = useState(false);
  const [agathaOpen, setAgathaOpen] = useState(false);
  const overrides = useContentStore(s => s.overrides);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null);
    });
  }, []);

  if (userEmail !== AGENT_OWNER_EMAIL) return null;

  const rafaelData = overrides['rafael.status'] as AgentData | undefined;
  const agathaData = overrides['agatha.status'] as AgentData | undefined;

  const rafaelErrors = (rafaelData?.findings ?? []).filter(f => f.severity === 'error').length;
  const agathaErrors = (agathaData?.findings ?? []).filter(f => f.severity === 'error').length;

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
        <AgentPanel
          name="Agatha"
          color="pink"
          icon={<Code2 className="h-4 w-4 text-pink-300" />}
          data={agathaData ?? null}
          onClose={() => setAgathaOpen(false)}
        />
      )}

      <div
        style={{ position: 'fixed', bottom: 40, right: 40, zIndex: 150, width: 64, height: 64 }}
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
          title="Agatha — monitora código"
          onClick={() => { setAgathaOpen(o => !o); setRafaelOpen(false); }}
        />

        <div style={{
          position: 'absolute', bottom: -18, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', padding: '0 2px',
        }}>
          <span style={{ fontSize: 8, color: 'rgba(147,197,253,0.55)', fontWeight: 700 }}>Rafael</span>
          <span style={{ fontSize: 8, color: 'rgba(249,168,212,0.55)', fontWeight: 700 }}>Agatha</span>
        </div>
      </div>
    </>
  );
}
