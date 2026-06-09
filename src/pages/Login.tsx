import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const loginGoogle = async () => {
    setLoading(true);
    setErro('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) { setErro(error.message); setLoading(false); }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a0f2e 0%, #130a22 60%, #0d0018 100%)' }}
    >
      {/* Background glow decorations */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 20% 30%, rgba(165,67,250,0.12) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 40% 40% at 80% 70%, rgba(107,33,168,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-sm mx-4 z-10">

        {/* Logo card — matches sidebar logo style */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-2xl px-6 py-3.5 mb-5 shadow-lg shadow-black/30">
            <img
              src="https://cardapioweb.com/wp-content/uploads/2024/01/Logo-Cardapio-Web.png"
              alt="Cardápio Web"
              className="h-9 w-auto object-contain"
            />
          </div>

          {/* Cardapinho mascot */}
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 rounded-full bg-white shadow-xl shadow-purple-500/30 flex items-center justify-center overflow-hidden">
              <img
                src="/cardapinho-rock.png"
                alt=""
                className="h-20 w-20 object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">Time Comercial</h1>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.22em] mt-1.5"
            style={{ color: '#7c5aa8' }}
          >
            Sales Playbook
          </p>
        </div>

        {/* Main card */}
        <div
          className="rounded-3xl p-7 border"
          style={{
            background: 'linear-gradient(145deg, #1e1040 0%, #16082e 100%)',
            borderColor: 'rgba(255,255,255,0.06)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.40), 0 0 0 1px rgba(165,67,250,0.08)',
          }}
        >
          {/* Section heading */}
          <div className="mb-6">
            <h2 className="text-[15px] font-bold text-white mb-1">Entrar na plataforma</h2>
            <p className="text-[12px]" style={{ color: '#7c5aa8' }}>
              Acesse com sua conta @cardapioweb.com
            </p>
          </div>

          {/* Divider label */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#4a2e70' }}>
              continue com
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Google button — dark-themed */}
          <button
            onClick={loginGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 font-semibold py-3.5 px-4 rounded-2xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: loading
                ? 'rgba(255,255,255,0.04)'
                : 'linear-gradient(135deg, rgba(165,67,250,0.15) 0%, rgba(107,33,168,0.20) 100%)',
              border: '1px solid rgba(165,67,250,0.25)',
              color: '#e8d5ff',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(165,67,250,0.12)',
            }}
            onMouseEnter={e => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'linear-gradient(135deg, rgba(165,67,250,0.25) 0%, rgba(107,33,168,0.30) 100%)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(165,67,250,0.50)';
              }
            }}
            onMouseLeave={e => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'linear-gradient(135deg, rgba(165,67,250,0.15) 0%, rgba(107,33,168,0.20) 100%)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(165,67,250,0.25)';
              }
            }}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            <span className="text-[14px]">{loading ? 'Entrando...' : 'Entrar com Google'}</span>
          </button>

          {erro && (
            <p
              className="mt-4 text-[12px] text-center rounded-xl px-4 py-2.5"
              style={{ color: '#ff8080', background: 'rgba(255,89,89,0.10)', border: '1px solid rgba(255,89,89,0.20)' }}
            >
              {erro}
            </p>
          )}
        </div>

        {/* Footer tag */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {/* Gold dot — matches "Comece Aqui" CTA accent */}
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, #f5a623, #f7b440)' }}
          />
          <p className="text-[11px] font-semibold" style={{ color: '#4a2e70' }}>
            Acesso restrito ao time da Cardápio Web
          </p>
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, #f5a623, #f7b440)' }}
          />
        </div>
      </div>
    </div>
  );
}
