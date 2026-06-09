/** Wizard de onboarding — exibido na primeira entrada do usuário. */
import { useState } from 'react';
import {
  BookOpen, Target, Calendar, Trophy, HelpCircle, Zap,
  Sparkles, ArrowRight, Check, Bell,
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

interface Props {
  onComplete: () => void;
  /** Quando true, renderiza inline na página (sem overlay fullscreen). */
  inline?: boolean;
}

export function OnboardingWizard({ onComplete, inline = false }: Props) {
  const userProfile = useUserProfile();
  const [step, setStep] = useState(0);
  const [papel, setPapel] = useState<Papel | null>(null);
  const [squad, setSquad] = useState<string | null>(null);
  const [apelido, setApelido] = useState('');
  const [saving, setSaving] = useState(false);

  /* ── Navegação ── */
  const totalSteps = papel === 'Closer' ? 3 : 4;

  const stepPosition = () => {
    if (step === 0) return 0;
    if (step === 1) return 1;
    if (step === 2) return 2;
    return totalSteps - 1;
  };

  const handleNext = () => {
    if (step === 0) setStep(1);
    else if (step === 1 && papel) {
      if (papel === 'Closer') setStep(3);
      else setStep(2);
    } else if (step === 2) setStep(3);
  };

  const handleBack = () => {
    if (step === 3 && papel === 'Closer') setStep(1);
    else if (step > 0) setStep(prev => prev - 1);
  };

  const canNext = () => {
    if (step === 0) return true;
    if (step === 1) return papel !== null;
    if (step === 2) return squad !== null;
    return true;
  };

  const handleComplete = async () => {
    if (!papel) return;
    setSaving(true);
    const name = apelido.trim() || null;
    await supabase.auth.updateUser({
      data: {
        papel,
        squad: papel === 'SDR' ? squad : null,
        apelido: name,
        onboarding_done: true,
      },
    });
    localStorage.setItem('cw-papel', papel);
    setSaving(false);
    onComplete();
  };

  const wrapper = inline
    ? 'min-h-screen flex items-start justify-center py-12 px-4'
    : 'fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8';

  const wrapperStyle = inline
    ? {}
    : { background: 'linear-gradient(180deg, #1a0f2e 0%, #130a22 100%)' };

  return (
    <div className={wrapper} style={wrapperStyle}>
      <div className="w-full max-w-[520px] mx-4">

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
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-cw-text mb-1">Qual é o seu cargo?</h2>
                <p className="text-sm text-cw-muted">
                  Isso define o conteúdo do Playbook e como você aparece no Ranking.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(['SDR', 'Closer'] as Papel[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPapel(p)}
                    className={cn(
                      'p-5 rounded-xl border-2 text-left transition-all duration-150',
                      papel === p
                        ? 'border-cw-purple bg-cw-purple/10'
                        : 'border-cw-border bg-cw-elevated hover:border-cw-purple/40'
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[18px] font-black text-cw-text">{p}</span>
                      {papel === p && (
                        <div className="h-5 w-5 rounded-full gradient-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-[12px] text-cw-muted leading-snug">
                      {p === 'SDR'
                        ? 'Prospecção, qualificação e cadências de outbound'
                        : 'Negociação, fechamento e expansão de contas'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Squad (SDR) ── */}
          {step === 2 && (
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
