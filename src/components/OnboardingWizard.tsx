/** Wizard de onboarding — exibido na primeira entrada do usuário. */
import { useState } from 'react';
import {
  BookOpen, Target, Calendar, Trophy, HelpCircle, Zap,
  Sparkles, ArrowRight, Check, Bell, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import type { Papel } from '@/context/SidebarContext';

const TABS_OVERVIEW = [
  { icon: Sparkles, label: 'Comece Aqui',  desc: 'Checklist de 13 dias, banco de objeções e guia de roleplay' },
  { icon: Target,   label: 'Meta do Mês',  desc: 'Acompanhe sua meta mensal em tempo real' },
  { icon: BookOpen, label: 'Playbook',     desc: 'Scripts, cadências e metodologia de vendas CW' },
  { icon: Calendar, label: 'Rituais',      desc: '1:1s, reuniões e treinamentos do seu squad' },
  { icon: Trophy,   label: 'Ranking',      desc: 'Top guerreiros do mês' },
  { icon: HelpCircle, label: 'FAQ',        desc: 'Dúvidas sobre produto, planos e processos' },
  { icon: Bell,     label: 'Mural',        desc: 'Avisos e comunicados do time' },
  { icon: Zap,      label: 'Changelog',   desc: 'Últimas atualizações da plataforma' },
];

const SQUADS_SDR = ['Lobo', 'Águia', 'Tubarão'];

/** Emails com permissão para selecionar Liderança + cargo específico */
const EMAILS_LIDERANCA: Record<string, string> = {
  'hyorranes.souza@cardapioweb.com':    'Liderança de Representantes',
  'antonio.anderson@cardapioweb.com':   'Liderança Comercial',
  'pedro.ferreira@cardapioweb.com':     'Liderança Comercial',
  'joelma.vieira@cardapioweb.com':      'Liderança Comercial',
  'whenna.oliveira@cardapioweb.com':    'Liderança de Closer',
  'ana.clara@cardapioweb.com':          'Coordenação Comercial',
  'vanessa.alencar@cardapioweb.com':    'Coordenação de Parcerias',
};

const CARGOS_LIDERANCA = [
  'Liderança Comercial',
  'Liderança de Closer',
  'Liderança de Representantes',
  'Coordenação Comercial',
  'Coordenação de Parcerias',
];

const PAPEIS_INFO: Record<Papel, { desc: string; aviso?: string }> = {
  SDR:          { desc: 'Prospecção, qualificação e cadências de outbound' },
  Closer:       { desc: 'Negociação, fechamento e expansão de contas' },
  Representante:{ desc: 'Atendimento e gestão de representantes externos', aviso: 'Escolha seu setor específico para que seu dashboard seja direcionado corretamente.' },
  Parcerias:    { desc: 'Gestão de canais e parcerias estratégicas', aviso: 'Escolha seu setor específico para que seu dashboard seja direcionado corretamente.' },
  Liderança:    { desc: 'Gestão, acompanhamento e desenvolvimento do time comercial' },
};

interface Props {
  onComplete: () => void;
  /** Quando true, renderiza inline na página (sem overlay fullscreen). */
  inline?: boolean;
}

export function OnboardingWizard({ onComplete, inline = false }: Props) {
  const userProfile = useUserProfile();
  const userEmail = userProfile.email?.toLowerCase() ?? '';
  const cargoSugerido = EMAILS_LIDERANCA[userEmail] ?? null;
  const podeEscolherLideranca = cargoSugerido !== null;

  const [step, setStep] = useState(0);
  const [papel, setPapel] = useState<Papel | null>(null);
  const [squad, setSquad] = useState<string | null>(null);
  // cargo específico de liderança (ex: "Liderança Comercial")
  const [cargoLideranca, setCargoLideranca] = useState<string | null>(null);
  // squads que a liderança acompanha (ex: ['Tubarão'])
  const [squadsLideradas, setSquadsLideradas] = useState<string[]>([]);
  const [apelido, setApelido] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleSquadLiderada = (s: string) =>
    setSquadsLideradas(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const needsSquad     = papel === 'SDR';
  const needsSubCargo  = papel === 'Liderança';
  // steps: 0=boas-vindas 1=cargo 2=squad/subcargo 3=apelido
  const totalSteps = (needsSquad || needsSubCargo) ? 4 : 3;

  const stepPosition = () => {
    if (step === 0) return 0;
    if (step === 1) return 1;
    if (step === 2) return 2;
    return totalSteps - 1;
  };

  const handleNext = () => {
    if (step === 0) setStep(1);
    else if (step === 1 && papel) {
      if (needsSquad || needsSubCargo) setStep(2);
      else setStep(3);
    } else if (step === 2) setStep(3);
  };

  const handleBack = () => {
    if (step === 3 && !needsSquad && !needsSubCargo) setStep(1);
    else if (step > 0) setStep(prev => prev - 1);
  };

  const canNext = () => {
    if (step === 0) return true;
    if (step === 1) return papel !== null;
    if (step === 2) return needsSubCargo ? (cargoLideranca !== null && squadsLideradas.length > 0) : squad !== null;
    return true;
  };

  const handleComplete = async () => {
    if (!papel) return;
    setSaving(true);
    const name = apelido.trim() || null;

    const squadsLed = papel === 'Liderança' ? squadsLideradas : [];

    // 1. Atualiza metadados do auth (visão do sidebar)
    const { error, data: authData } = await supabase.auth.updateUser({
      data: {
        papel,
        squad: papel === 'SDR' ? squad : null,
        cargo_lideranca: papel === 'Liderança' ? cargoLideranca : null,
        squads_lideradas: squadsLed,
        apelido: name,
        onboarding_done: true,
      },
    });
    if (error) { setSaving(false); return; }

    // 2. Salva perfil na tabela pública (visível aos gestores)
    const uid = authData?.user?.id;
    const email = authData?.user?.email ?? userEmail;
    if (uid) {
      await supabase.from('sdr_profiles').upsert({
        user_id: uid,
        email,
        apelido: name,
        papel,
        squad: papel === 'SDR' ? squad : null,
        squads_lideradas: squadsLed,
        cargo_lideranca: papel === 'Liderança' ? cargoLideranca : null,
        onboarding_done: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }

    localStorage.setItem('cw-papel', papel);
    onComplete();
  };

  const wrapper = inline
    ? 'w-full'
    : 'fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8';

  const wrapperStyle = inline
    ? {}
    : { background: 'linear-gradient(180deg, #1a0f2e 0%, #130a22 100%)' };

  return (
    <div className={wrapper} style={wrapperStyle}>
      <div className={inline ? 'w-full max-w-[680px] mx-auto' : 'w-full max-w-[520px] mx-4'}>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl px-6 py-3 shadow-xl">
            <img
              src="https://cardapioweb.com/wp-content/uploads/2024/01/Logo-Cardapio-Web.png"
              alt="Cardápio Web"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === stepPosition() ? 'w-7 bg-cw-purple' :
              i < stepPosition() ? 'w-4 bg-cw-purple/50' : 'w-4 bg-white/10'
            )} />
          ))}
        </div>

        {/* Card */}
        <div className="cw-card p-8">

          {/* ── Step 0: Boas-vindas ── */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-black text-cw-text mb-1.5">
                  Bem-vindo ao Sales Playbook!
                </h1>
                <p className="text-sm text-cw-muted leading-relaxed">
                  Tudo que você precisa para vender como guerreiro, em um só lugar.
                  Veja o que te espera:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {TABS_OVERVIEW.map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-2.5 p-3 rounded-xl bg-cw-elevated border border-cw-border">
                    <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center shrink-0 shadow-sm">
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-cw-text leading-tight">{label}</p>
                      <p className="text-[11px] text-cw-muted leading-tight mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 1: Cargo ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-cw-text mb-1">Qual é o seu cargo?</h2>
                <p className="text-sm text-cw-muted">
                  Isso define seu dashboard e como você aparece na plataforma.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {((['SDR', 'Closer', 'Representante', 'Parcerias'] as Papel[]).concat(
                  podeEscolherLideranca ? ['Liderança' as Papel] : []
                )).map(p => {
                  const info = PAPEIS_INFO[p];
                  const selected = papel === p;
                  return (
                    <button
                      key={p}
                      onClick={() => { setPapel(p); setSquad(null); }}
                      className={cn(
                        'w-full p-4 rounded-xl border-2 text-left transition-all duration-150',
                        selected
                          ? 'border-cw-purple bg-cw-purple/10'
                          : 'border-cw-border bg-cw-elevated hover:border-cw-purple/40'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[15px] font-black text-cw-text">{p}</span>
                          <p className="text-[11px] text-cw-muted leading-snug mt-0.5">{info.desc}</p>
                        </div>
                        {selected && (
                          <div className="h-5 w-5 rounded-full gradient-primary flex items-center justify-center shrink-0 ml-3">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      {/* Aviso para Representante e Parcerias */}
                      {selected && info.aviso && (
                        <div className="mt-2.5 flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-amber-300 leading-snug">{info.aviso}</p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 2a: Sub-cargo de Liderança ── */}
          {step === 2 && needsSubCargo && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-cw-text mb-1">Qual é o seu cargo de liderança?</h2>
                <p className="text-sm text-cw-muted">
                  Isso direciona você para o dashboard correto da sua área.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {CARGOS_LIDERANCA.map(c => (
                  <button
                    key={c}
                    onClick={() => setCargoLideranca(c)}
                    className={cn(
                      'w-full px-4 py-3.5 rounded-xl border-2 text-left font-bold text-sm transition-all duration-150 flex items-center justify-between',
                      cargoLideranca === c
                        ? 'border-cw-purple bg-cw-purple/10 text-cw-purple'
                        : 'border-cw-border bg-cw-elevated text-cw-muted hover:border-cw-purple/40 hover:text-cw-text'
                    )}
                  >
                    {c}
                    {cargoLideranca === c && (
                      <div className="h-5 w-5 rounded-full gradient-primary flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Dica: pré-seleciona o cargo sugerido pelo email */}
              {cargoSugerido && cargoLideranca === null && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-cw-purple/10 border border-cw-purple/20">
                  <AlertCircle className="h-3.5 w-3.5 text-cw-purple-light shrink-0 mt-0.5" />
                  <p className="text-[11px] text-cw-muted leading-snug">
                    Baseado no seu email, sugerimos: <span className="font-bold text-cw-text">{cargoSugerido}</span>
                  </p>
                </div>
              )}

              {/* Squads que a liderança acompanha */}
              <div className="pt-4 border-t border-cw-border space-y-2.5">
                <div>
                  <h3 className="text-sm font-black text-cw-text">Quais squads você lidera?</h3>
                  <p className="text-[12px] text-cw-muted">
                    Você vai acompanhar a meta e o desempenho de cada membro desses times. Pode marcar mais de um.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {SQUADS_SDR.map(s => {
                    const sel = squadsLideradas.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSquadLiderada(s)}
                        className={cn(
                          'py-4 rounded-xl border-2 text-center font-bold text-[15px] transition-all duration-150 flex items-center justify-center gap-1.5',
                          sel
                            ? 'border-cw-purple bg-cw-purple/10 text-cw-purple'
                            : 'border-cw-border bg-cw-elevated text-cw-muted hover:border-cw-purple/40 hover:text-cw-text'
                        )}
                      >
                        {sel && <Check className="h-3.5 w-3.5" />}
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2b: Squad (SDR) ── */}
          {step === 2 && needsSquad && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-cw-text mb-1">Qual é o seu squad?</h2>
                <p className="text-sm text-cw-muted">
                  Ajuda a metrificar o desempenho por time dentro da área de SDR.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {SQUADS_SDR.map(s => (
                  <button
                    key={s}
                    onClick={() => setSquad(s)}
                    className={cn(
                      'py-5 rounded-xl border-2 text-center font-bold text-[15px] transition-all duration-150',
                      squad === s
                        ? 'border-cw-purple bg-cw-purple/10 text-cw-purple'
                        : 'border-cw-border bg-cw-elevated text-cw-muted hover:border-cw-purple/40 hover:text-cw-text'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSquad('Outro')}
                className={cn(
                  'w-full py-3 rounded-xl border-2 text-[13px] font-semibold transition-all duration-150',
                  squad === 'Outro'
                    ? 'border-cw-purple bg-cw-purple/10 text-cw-purple'
                    : 'border-cw-border bg-cw-elevated text-cw-muted hover:border-cw-purple/40'
                )}
              >
                Squad ainda não listado
              </button>
            </div>
          )}

          {/* ── Step 3: Apelido ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-cw-text mb-1">Como prefere ser chamado(a)?</h2>
                <p className="text-sm text-cw-muted">
                  Seu nome ou apelido que vai aparecer no Playbook.
                </p>
              </div>

              <input
                type="text"
                value={apelido}
                onChange={e => setApelido(e.target.value)}
                placeholder={userProfile.fullName ?? 'Seu nome ou apelido...'}
                className="w-full px-4 py-3 rounded-xl bg-cw-elevated border border-cw-border text-cw-text placeholder:text-cw-muted text-[15px] font-semibold focus:outline-none focus:border-cw-purple transition-colors"
                autoFocus
              />

              <div className="p-4 rounded-xl bg-cw-purple/5 border border-cw-purple/20 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-cw-purple shrink-0" />
                  <p className="text-[12px] text-cw-muted">
                    Cargo: <span className="font-bold text-cw-text">{papel}</span>
                  </p>
                </div>
                {squad && (
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-cw-purple shrink-0" />
                    <p className="text-[12px] text-cw-muted">
                      Squad: <span className="font-bold text-cw-text">{squad}</span>
                    </p>
                  </div>
                )}
                {cargoLideranca && (
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-cw-purple shrink-0" />
                    <p className="text-[12px] text-cw-muted">
                      Área: <span className="font-bold text-cw-text">{cargoLideranca}</span>
                    </p>
                  </div>
                )}
                {squadsLideradas.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-cw-purple shrink-0" />
                    <p className="text-[12px] text-cw-muted">
                      Squads que lidera: <span className="font-bold text-cw-text">{squadsLideradas.join(', ')}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Navegação ── */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-cw-border">
            {step > 0 ? (
              <button
                onClick={handleBack}
                className="text-[13px] text-cw-muted hover:text-cw-text transition-colors"
              >
                Voltar
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={!canNext()}
                className={cn(
                  'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-150',
                  canNext()
                    ? 'gradient-primary hover:opacity-90 shadow-lg'
                    : 'bg-cw-elevated text-cw-muted cursor-not-allowed'
                )}
              >
                Próximo <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={saving || !papel}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white gradient-primary hover:opacity-90 shadow-lg disabled:opacity-60 transition-all"
              >
                {saving ? 'Salvando...' : 'Entrar no Playbook'}
                {!saving && <ArrowRight className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-[#7c5aa8] mt-4">
          CW Sales Playbook · Time Comercial
        </p>
      </div>
    </div>
  );
}
