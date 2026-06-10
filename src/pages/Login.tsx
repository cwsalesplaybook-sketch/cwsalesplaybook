import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/* ─── Decorative background ─── */
function Background() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* ── Burger — top-left ── */}
      <g transform="translate(82,72) rotate(-8)" opacity="0.22">
        <rect x="2" y="16" width="40" height="7" rx="3.5" fill="none" stroke="#c084fc" strokeWidth="2.2"/>
        <rect x="2" y="25" width="40" height="7" rx="3.5" fill="none" stroke="#c084fc" strokeWidth="2.2"/>
        <path d="M6 16 C5 4 39 4 38 16" fill="none" stroke="#c084fc" strokeWidth="2.2"/>
        <path d="M6 32 C5 44 39 44 38 32" fill="none" stroke="#c084fc" strokeWidth="2.2"/>
        <circle cx="14" cy="22" r="3" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
        <circle cx="28" cy="22" r="3" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
      </g>

      {/* ── Cup with straw — left-mid ── */}
      <g transform="translate(52,310) rotate(6)" opacity="0.18">
        <path d="M6 8 L3 46 Q3 50 7 50 L29 50 Q33 50 33 46 L30 8 Z" fill="none" stroke="#c084fc" strokeWidth="2.2"/>
        <circle cx="18" cy="28" r="7" fill="none" stroke="#c084fc" strokeWidth="1.8"/>
        <line x1="22" y1="2" x2="22" y2="22" stroke="#c084fc" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="3" y1="20" x2="33" y2="20" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="3,3"/>
      </g>

      {/* ── Dotted curve: burger → center ── */}
      <path
        d="M 130 90 Q 340 40 540 180"
        fill="none" stroke="#9333ea" strokeWidth="1.8" strokeDasharray="6,10" opacity="0.20"
      />

      {/* ── Dotted curve: cup → bottom-center ── */}
      <path
        d="M 100 370 Q 200 500 380 520"
        fill="none" stroke="#9333ea" strokeWidth="1.8" strokeDasharray="6,10" opacity="0.16"
      />

      {/* ── Pizza slice — top-right ── */}
      <g transform="translate(1290,58) rotate(14)" opacity="0.22">
        <path d="M22 2 L42 42 L2 42 Z" fill="none" stroke="#c084fc" strokeWidth="2.2"/>
        <circle cx="22" cy="28" r="3.5" fill="none" stroke="#c084fc" strokeWidth="1.8"/>
        <circle cx="14" cy="36" r="2.5" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
        <circle cx="30" cy="36" r="2.5" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
        <path d="M14 20 Q22 14 30 20" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
      </g>

      {/* ── Apple/tomato — right-upper-mid ── */}
      <g transform="translate(1350,210) rotate(-5)" opacity="0.18">
        <circle cx="22" cy="28" r="18" fill="none" stroke="#c084fc" strokeWidth="2.2"/>
        <path d="M22 10 Q28 2 34 6" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 10 Q16 2 10 6" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="22" cy="28" r="8" fill="none" stroke="#c084fc" strokeWidth="1.4" strokeDasharray="2,3"/>
      </g>

      {/* ── Chef hat — right-mid ── */}
      <g transform="translate(1370,400) rotate(8)" opacity="0.20">
        <rect x="4" y="36" width="36" height="10" rx="3" fill="none" stroke="#c084fc" strokeWidth="2.2"/>
        <path d="M10 36 C10 20 34 20 34 36" fill="none" stroke="#c084fc" strokeWidth="2.2"/>
        <ellipse cx="22" cy="20" rx="11" ry="10" fill="none" stroke="#c084fc" strokeWidth="2.2"/>
      </g>

      {/* ── Dotted curve: pizza → right-mid ── */}
      <path
        d="M 1310 100 Q 1400 200 1380 350"
        fill="none" stroke="#9333ea" strokeWidth="1.8" strokeDasharray="6,10" opacity="0.18"
      />
      {/* ── Dotted curve: right-mid → bottom-right ── */}
      <path
        d="M 1370 460 Q 1300 560 1150 540"
        fill="none" stroke="#9333ea" strokeWidth="1.8" strokeDasharray="6,10" opacity="0.15"
      />
    </svg>
  );
}

/* ─── Google SVG icon ─── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

const FEATURES = [
  {
    label: 'Cardápio\nDigital',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
  {
    label: 'Food\nMarketing',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
      </svg>
    ),
  },
  {
    label: 'Gestão do seu\nNegócio',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
];

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const loginGoogle = async () => {
    setLoading(true);
    setErro('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) { setErro(error.message); setLoading(false); }
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #2e0b5c 0%, #210845 55%, #160330 100%)',
      }}
    >
      <Background />

      {/* ── Mascote esquerda — rock (grande) ── */}
      <img
        src="/cardapinho-rock.png"
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute bottom-0 left-0"
        style={{ height: '62vh', maxHeight: 520, width: 'auto', objectFit: 'contain', objectPosition: 'bottom', zIndex: 1 }}
      />

      {/* ── Mascote viking — centro-direita ── */}
      <img
        src="/cardapinho-vinkin.png"
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute bottom-0"
        style={{ right: '14vw', height: '48vh', maxHeight: 400, width: 'auto', objectFit: 'contain', objectPosition: 'bottom', zIndex: 1 }}
      />

      {/* ── Mascote laptop — direita ── */}
      <img
        src="/cardapinho-not.png"
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute bottom-0 right-0"
        style={{ height: '44vh', maxHeight: 360, width: 'auto', objectFit: 'contain', objectPosition: 'bottom', zIndex: 1 }}
      />

      {/* ── Conteúdo central ── */}
      <div className="relative flex flex-col items-center w-full max-w-[440px] px-5" style={{ zIndex: 2 }}>

        {/* Logo CW */}
        <img
          src="/cardapio-web-logotype-fundo-off-rgb-2800px-w-144ppi.jpg"
          alt="Cardápio Web"
          className="mb-5 drop-shadow-xl"
          style={{ height: 130, width: 'auto', mixBlendMode: 'luminosity' }}
        />

        {/* Boas-vindas */}
        <h1 className="text-[28px] font-black text-white text-center mb-2 tracking-tight leading-tight">
          Bem-vindo de volta! 👋
        </h1>
        <p className="text-[14px] text-white/65 text-center mb-7">
          Acesse sua plataforma{' '}
          <span className="font-bold" style={{ color: '#f59e0b' }}>Cardápio Web</span>
        </p>

        {/* Card */}
        <div
          className="w-full rounded-2xl px-6 py-6"
          style={{
            background: 'rgba(15,4,40,0.55)',
            border: '1px solid rgba(168,85,247,0.20)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.40)',
          }}
        >
          {/* Google button */}
          <button
            onClick={loginGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-[14px] rounded-xl font-bold text-[15px] text-white transition-all duration-150 disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
              boxShadow: '0 6px 24px rgba(124,58,237,0.50)',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.12)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = ''; }}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : (
              <GoogleIcon />
            )}
            <span>{loading ? 'Entrando...' : 'Entrar com Google'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(168,85,247,0.20)' }}/>
            <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.30)' }}>ou</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(168,85,247,0.20)' }}/>
          </div>

          {/* Acesso restrito */}
          <div className="flex items-center justify-center gap-2">
            <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: 13 }}>🔒</span>
            <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.30)' }}>
              Acesso restrito ao time da Cardápio Web
            </span>
            <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: 13 }}>🔒</span>
          </div>

          {erro && (
            <p className="mt-4 text-[12px] text-center rounded-xl px-4 py-2" style={{ color: '#f87171', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.20)' }}>
              {erro}
            </p>
          )}
        </div>

        {/* Features */}
        <div className="flex items-start justify-center gap-8 mt-8">
          {FEATURES.map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2.5">
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center text-white/75"
                style={{ background: 'rgba(168,85,247,0.18)', border: '1px solid rgba(168,85,247,0.25)' }}
              >
                {icon}
              </div>
              <span className="text-[11px] font-semibold text-white/60 text-center whitespace-pre-line leading-snug">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Rodapé */}
        <p className="text-[11px] mt-7 text-center" style={{ color: 'rgba(255,255,255,0.22)' }}>
          Tecnologia e resultado para o crescimento do seu restaurante. 💜
        </p>
      </div>
    </div>
  );
}
