import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Settings2, Bot } from 'lucide-react';

function FoodBg() {
  return (
    <svg className="pointer-events-none absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Burger — top left */}
      <g transform="translate(80,80) rotate(-12)" opacity="0.18">
        <rect x="0" y="22" width="44" height="6" rx="3" fill="none" stroke="white" strokeWidth="2"/>
        <rect x="0" y="30" width="44" height="6" rx="3" fill="none" stroke="white" strokeWidth="2"/>
        <path d="M4 22 C4 8 40 8 40 22" fill="none" stroke="white" strokeWidth="2"/>
        <path d="M4 36 C4 46 40 46 40 36" fill="none" stroke="white" strokeWidth="2"/>
      </g>
      {/* Cup with straw — left mid */}
      <g transform="translate(40,340) rotate(8)" opacity="0.15">
        <path d="M8 6 L4 42 Q4 46 8 46 L28 46 Q32 46 32 42 L28 6 Z" fill="none" stroke="white" strokeWidth="2"/>
        <line x1="18" y1="0" x2="18" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="6" y1="18" x2="30" y2="18" stroke="white" strokeWidth="1.5" strokeDasharray="3,2"/>
      </g>
      {/* Dotted curve top-left to center */}
      <path d="M 120 120 Q 300 60 480 200" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="5,8" opacity="0.12"/>
      {/* Pizza — top right */}
      <g transform="translate(1280,70) rotate(15)" opacity="0.18">
        <path d="M20 2 L38 38 L2 38 Z" fill="none" stroke="white" strokeWidth="2"/>
        <circle cx="20" cy="24" r="3" fill="none" stroke="white" strokeWidth="1.5"/>
        <circle cx="14" cy="32" r="2" fill="none" stroke="white" strokeWidth="1.5"/>
        <circle cx="26" cy="32" r="2" fill="none" stroke="white" strokeWidth="1.5"/>
      </g>
      {/* Coconut — right upper */}
      <g transform="translate(1340,200) rotate(-8)" opacity="0.15">
        <ellipse cx="20" cy="26" rx="18" ry="16" fill="none" stroke="white" strokeWidth="2"/>
        <path d="M20 10 Q28 2 36 6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 10 Q20 2 28 0" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </g>
      {/* Chef hat — right mid */}
      <g transform="translate(1360,380) rotate(5)" opacity="0.16">
        <rect x="2" y="32" width="36" height="10" rx="2" fill="none" stroke="white" strokeWidth="2"/>
        <path d="M8 32 C8 14 32 14 32 32" fill="none" stroke="white" strokeWidth="2"/>
        <circle cx="20" cy="14" r="10" fill="none" stroke="white" strokeWidth="2"/>
      </g>
      {/* Dotted curve right side */}
      <path d="M 1320 300 Q 1150 360 1000 280" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="5,8" opacity="0.12"/>
    </svg>
  );
}

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
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(155deg, #3d0d6e 0%, #2b0858 45%, #1c0440 100%)' }}
    >
      <FoodBg />

      {/* Mascote esquerda — rock */}
      <img
        src="/rock.png"
        alt=""
        className="pointer-events-none select-none absolute bottom-0 left-0 w-[260px] xl:w-[300px] object-contain object-bottom"
        style={{ zIndex: 1 }}
      />

      {/* Mascote centro-direita — beserker */}
      <img
        src="/cardapinho-beserker.png"
        alt=""
        className="pointer-events-none select-none absolute bottom-0 right-[200px] xl:right-[260px] w-[200px] xl:w-[230px] object-contain object-bottom"
        style={{ zIndex: 1 }}
      />

      {/* Mascote direita — automação */}
      <img
        src="/cardapinho-automação.png"
        alt=""
        className="pointer-events-none select-none absolute bottom-0 right-0 w-[180px] xl:w-[210px] object-contain object-bottom"
        style={{ zIndex: 1 }}
      />

      {/* Conteúdo principal */}
      <div className="relative flex flex-col items-center w-full max-w-[420px] mx-6 pb-8" style={{ zIndex: 2 }}>

        {/* Logo */}
        <img
          src="/cardapio-web-logotype-fundo-off-rgb-2800px-w-144ppi.png"
          alt="Cardápio Web"
          className="h-[110px] w-auto mb-5 drop-shadow-lg"
        />

        {/* Boas-vindas */}
        <h1 className="text-[26px] font-black text-white mb-1.5 text-center tracking-tight">
          Bem-vindo de volta! 👋
        </h1>
        <p className="text-[14px] text-white/70 mb-7 text-center">
          Acesse sua plataforma{' '}
          <span className="font-bold" style={{ color: '#f5a623' }}>Cardápio Web</span>
        </p>

        {/* Card de login */}
        <div
          className="w-full rounded-2xl px-6 py-6"
          style={{
            background: 'rgba(0,0,0,0.28)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Botão Google */}
          <button
            onClick={loginGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-[15px] text-white transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: loading
                ? 'rgba(93,20,160,0.6)'
                : 'linear-gradient(135deg, #6b1fc1 0%, #5012a0 100%)',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(107,31,193,0.45)',
            }}
            onMouseEnter={e => {
              if (!loading) (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.12)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.filter = '';
            }}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span>{loading ? 'Entrando...' : 'Entrar com Google'}</span>
          </button>

          {/* Divisor */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }}/>
            <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.30)' }}>ou</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }}/>
          </div>

          {/* Acesso restrito */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>🔒</span>
            <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Acesso restrito ao time da Cardápio Web
            </span>
            <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>🔒</span>
          </div>

          {erro && (
            <p className="mt-4 text-[12px] text-center rounded-xl px-4 py-2" style={{ color: '#ff8080', background: 'rgba(255,89,89,0.10)', border: '1px solid rgba(255,89,89,0.20)' }}>
              {erro}
            </p>
          )}
        </div>

        {/* Features */}
        <div className="flex items-start justify-center gap-10 mt-8">
          {[
            { icon: <TrendingUp className="h-6 w-6" />, label: 'Aumento\nde vendas' },
            { icon: <Settings2 className="h-6 w-6" />, label: 'Administração\ndo negócio' },
            { icon: <Bot className="h-6 w-6" />, label: 'Automação de\natendimento' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className="h-11 w-11 rounded-xl flex items-center justify-center text-white/70"
                style={{ background: 'rgba(255,255,255,0.10)' }}
              >
                {icon}
              </div>
              <span className="text-[11px] font-medium text-white/60 text-center whitespace-pre-line leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Rodapé */}
        <p className="text-[11px] mt-8 text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Tecnologia e resultado para o crescimento do seu restaurante. 💜
        </p>
      </div>
    </div>
  );
}
