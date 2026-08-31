import { useState } from 'react';
import { supabase, REMEMBER_KEY } from '@/integrations/supabase/client';

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

const DOMINIO = '@cardapioweb.com';
type Modo = 'login' | 'signup' | 'forgot';

// Guarda o último e-mail usado nesta máquina pra pré-preencher o campo.
// A sessão em si já fica salva (supabase client: persistSession + localStorage).
const EMAIL_KEY = 'cw.login.email';
const lerEmailSalvo = () => { try { return localStorage.getItem(EMAIL_KEY) ?? ''; } catch { return ''; } };
const salvarEmail = (e: string) => { try { localStorage.setItem(EMAIL_KEY, e); } catch { /* ignore */ } };
const lerLembrar = () => { try { return localStorage.getItem(REMEMBER_KEY) !== 'false'; } catch { return true; } };
const salvarLembrar = (v: boolean) => { try { localStorage.setItem(REMEMBER_KEY, String(v)); } catch { /* ignore */ } };

const MIN_SENHA = 6;
// Erro de rede / função Edge fora do ar (inclui o 402 de projeto restrito no Supabase).
const pareceServicoFora = (m: string) =>
  /edge function|failed to send|failed to fetch|networkerror|restricted|exceed_egress|non-2xx/i.test(m);
const MSG_FORA = 'Serviço indisponível no momento. Tente de novo em alguns minutos.';

const inputCls =
  'w-full rounded-xl px-4 py-[13px] text-[14px] text-white placeholder-white/35 outline-none transition-all';
const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(168,85,247,0.25)',
};

export default function Login() {
  const [modo, setModo] = useState<Modo>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState(lerEmailSalvo);
  const [senha, setSenha] = useState('');
  const [senha2, setSenha2] = useState('');
  const [lembrar, setLembrar] = useState(lerLembrar);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [okMsg, setOkMsg] = useState('');

  const limpar = () => { setErro(''); setOkMsg(''); };
  const trocarModo = (m: Modo) => { limpar(); setSenha(''); setSenha2(''); setModo(m); };

  const entrar = async () => {
    limpar();
    setLoading(true);
    salvarLembrar(lembrar);
    const mail = email.trim().toLowerCase();
    const { error } = await supabase.auth.signInWithPassword({ email: mail, password: senha });
    if (error) {
      const m = error.message || '';
      setErro(/invalid login/i.test(m) ? 'E-mail ou senha incorretos.' : pareceServicoFora(m) ? MSG_FORA : m);
      setLoading(false);
      return;
    }
    salvarEmail(mail);
    // sucesso → App.tsx (onAuthStateChange) redireciona pra /start
  };

  const criarConta = async () => {
    limpar();
    const mail = email.trim().toLowerCase();
    if (!mail.endsWith(DOMINIO)) { setErro(`Use seu e-mail ${DOMINIO}`); return; }
    if (senha.length < MIN_SENHA) { setErro(`A senha precisa ter pelo menos ${MIN_SENHA} caracteres.`); return; }
    if (senha !== senha2) { setErro('As senhas não conferem.'); return; }
    if (nome.trim().length < 3) { setErro('Informe seu nome completo.'); return; }

    setLoading(true);
    salvarLembrar(lembrar);

    // 1) Tenta a edge function (cria já confirmado + vínculo no Pipedrive + Slack).
    try {
      const { data, error } = await supabase.functions.invoke('signup', {
        body: { email: mail, password: senha, nome: nome.trim() },
      });
      if (!error && data && !data.ok) {
        setErro(data.error ?? 'Não foi possível criar a conta.');
        setLoading(false);
        return;
      }
      if (!error && data?.ok) {
        salvarEmail(mail);
        await supabase.auth.signInWithPassword({ email: mail, password: senha });
        return; // sucesso → App.tsx redireciona
      }
      // error (ex.: função ainda não publicada) → cai no fallback abaixo
    } catch { /* fallback abaixo */ }

    // 2) Fallback: cadastro direto no Supabase, sem depender da edge function.
    try {
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: mail,
        password: senha,
        options: { data: { full_name: nome.trim(), name: nome.trim() } },
      });
      if (signUpErr) {
        const m = signUpErr.message || '';
        if (/already registered|already exists|user already/i.test(m)) {
          setErro("Já existe uma conta com esse e-mail. Use 'Entrar' ou 'Esqueci a senha'.");
        } else {
          setErro(pareceServicoFora(m) ? MSG_FORA : (m || 'Não foi possível criar a conta.'));
        }
        setLoading(false);
        return;
      }
      salvarEmail(mail);
      if (signUpData.session) return; // já logou → App.tsx redireciona
      // Sem sessão: tenta entrar (funciona se "Confirm email" estiver desligado).
      const { error: signErr } = await supabase.auth.signInWithPassword({ email: mail, password: senha });
      if (signErr) {
        setOkMsg('Conta criada! Se não entrar direto, confirme pelo e-mail ou fale com o gestor.');
        trocarModo('login');
        setEmail(mail);
        setLoading(false);
      }
    } catch (e) {
      const m = e instanceof Error ? e.message : '';
      setErro(pareceServicoFora(m) ? MSG_FORA : (m || 'Não foi possível criar a conta.'));
      setLoading(false);
    }
  };

  const pedirReset = async () => {
    limpar();
    const mail = email.trim().toLowerCase();
    if (!mail.endsWith(DOMINIO)) { setErro(`Use seu e-mail ${DOMINIO}`); return; }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('password-reset-request', { body: { email: mail } });
      if (error) throw error;
      setOkMsg('Avisamos o gestor. Ele vai te enviar uma senha temporária para você entrar e cadastrar uma nova.');
    } catch {
      setErro('Não conseguimos avisar o gestor agora. Tente de novo em alguns minutos ou fale direto com ele.');
    }
    setLoading(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (modo === 'login') entrar();
    else if (modo === 'signup') criarConta();
    else pedirReset();
  };

  const titulo =
    modo === 'login' ? 'Bem-vindo de volta! 👋'
    : modo === 'signup' ? 'Criar sua conta ✨'
    : 'Recuperar acesso 🔑';

  const btnLabel =
    loading ? 'Aguarde...'
    : modo === 'login' ? 'Entrar'
    : modo === 'signup' ? 'Criar conta'
    : 'Avisar o gestor';

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #2e0b5c 0%, #210845 55%, #160330 100%)' }}
    >
      <Background />

      <img src="/cardapinho-rock.png" alt="" aria-hidden
        className="pointer-events-none select-none absolute bottom-0 left-0"
        style={{ height: '62vh', maxHeight: 520, width: 'auto', objectFit: 'contain', objectPosition: 'bottom', zIndex: 1 }} />
      <img src="/cardapinho-vinkin.png" alt="" aria-hidden
        className="pointer-events-none select-none absolute bottom-0"
        style={{ right: '14vw', height: '48vh', maxHeight: 400, width: 'auto', objectFit: 'contain', objectPosition: 'bottom', zIndex: 1 }} />
      <img src="/cardapinho-not.png" alt="" aria-hidden
        className="pointer-events-none select-none absolute bottom-0 right-0"
        style={{ height: '44vh', maxHeight: 360, width: 'auto', objectFit: 'contain', objectPosition: 'bottom', zIndex: 1 }} />

      <div className="relative flex flex-col items-center w-full max-w-[440px] px-5" style={{ zIndex: 2 }}>
        <img
          src="/cardapio-web-logotype-fundo-off-rgb-2800px-w-144ppi.jpg"
          alt="Cardápio Web"
          className="mb-5 drop-shadow-xl"
          style={{ height: 130, width: 'auto', mixBlendMode: 'luminosity' }}
        />

        <h1 className="text-[28px] font-black text-white text-center mb-2 tracking-tight leading-tight">
          {titulo}
        </h1>
        <p className="text-[14px] text-white/65 text-center mb-7">
          Acesse sua plataforma{' '}
          <span className="font-bold" style={{ color: '#f59e0b' }}>Cardápio Web</span>
        </p>

        <div
          className="w-full rounded-2xl px-6 py-6"
          style={{
            background: 'rgba(15,4,40,0.55)',
            border: '1px solid rgba(168,85,247,0.20)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.40)',
          }}
        >
          <form onSubmit={submit} className="flex flex-col gap-3">
            {modo === 'signup' && (
              <input
                className={inputCls} style={inputStyle}
                type="text" placeholder="Nome completo" autoComplete="name"
                value={nome} onChange={e => setNome(e.target.value)} disabled={loading}
              />
            )}

            <input
              className={inputCls} style={inputStyle}
              type="email" placeholder={`seu.nome${DOMINIO}`} autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)} disabled={loading} required
            />

            {modo !== 'forgot' && (
              <input
                className={inputCls} style={inputStyle}
                type="password" placeholder="Senha"
                autoComplete={modo === 'signup' ? 'new-password' : 'current-password'}
                value={senha} onChange={e => setSenha(e.target.value)} disabled={loading} required
              />
            )}

            {modo === 'signup' && (
              <input
                className={inputCls} style={inputStyle}
                type="password" placeholder="Confirmar senha" autoComplete="new-password"
                value={senha2} onChange={e => setSenha2(e.target.value)} disabled={loading} required
              />
            )}

            {modo !== 'forgot' && (
              <label className="flex items-center gap-2 mt-0.5 text-[12.5px] text-white/60 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={e => setLembrar(e.target.checked)}
                  disabled={loading}
                  className="h-4 w-4 rounded accent-[#7c3aed] cursor-pointer"
                />
                Lembrar de mim neste computador
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full flex items-center justify-center gap-3 py-[14px] rounded-xl font-bold text-[15px] text-white transition-all duration-150 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                boxShadow: '0 6px 24px rgba(124,58,237,0.50)',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = ''; }}
            >
              {loading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              )}
              <span>{btnLabel}</span>
            </button>
          </form>

          {/* Links de navegação entre modos */}
          <div className="mt-4 flex items-center justify-between text-[12px]">
            {modo === 'login' ? (
              <>
                <button onClick={() => trocarModo('forgot')} className="text-white/45 hover:text-white/80 transition-colors">
                  Esqueci a senha
                </button>
                <button onClick={() => trocarModo('signup')} className="font-semibold transition-colors" style={{ color: '#c4b5fd' }}>
                  Criar conta
                </button>
              </>
            ) : (
              <button onClick={() => trocarModo('login')} className="text-white/45 hover:text-white/80 transition-colors">
                ← Voltar para o login
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(168,85,247,0.20)' }}/>
            <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.30)' }}>🔒</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(168,85,247,0.20)' }}/>
          </div>

          {modo !== 'forgot' && (
            <div
              className="mb-3 rounded-xl px-3.5 py-3 text-[11.5px] leading-relaxed"
              style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.25)', color: '#fcd9a0' }}
            >
              <span className="font-bold" style={{ color: '#f59e0b' }}>Entrando de outro computador?</span>{' '}
              Com <span className="font-semibold">Lembrar de mim</span> seu acesso fica salvo neste aparelho.
              Numa máquina nova, use <span className="font-semibold">Criar conta</span> com o seu e-mail{' '}
              <span className="font-semibold">{DOMINIO}</span>, é esse e-mail que vincula você ao Pipedrive.
            </div>
          )}

          <div className="flex items-center justify-center gap-2">
            <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.30)' }}>
              Acesso restrito ao time da Cardápio Web
            </span>
          </div>

          {erro && (
            <p className="mt-4 text-[12px] text-center rounded-xl px-4 py-2" style={{ color: '#f87171', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.20)' }}>
              {erro}
            </p>
          )}
          {okMsg && (
            <p className="mt-4 text-[12px] text-center rounded-xl px-4 py-2" style={{ color: '#6ee7b7', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.20)' }}>
              {okMsg}
            </p>
          )}
        </div>

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

        <p className="text-[11px] mt-7 text-center" style={{ color: 'rgba(255,255,255,0.22)' }}>
          Tecnologia e resultado para o crescimento do seu restaurante. 💜
        </p>
      </div>
    </div>
  );
}
