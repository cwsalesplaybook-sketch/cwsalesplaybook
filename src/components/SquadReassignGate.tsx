/** Bloqueia o dashboard de quem ainda está com squad "Tubarão" (dissolvido)
 *  até escolher um squad ativo. Estilo espelha o OnboardingWizard fullscreen —
 *  é uma continuação do mesmo fluxo, não um modal dispensável. */
import { useState } from 'react';
import { Users, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useSidebarContext } from '@/context/SidebarContext';

const SQUAD_DISSOLVIDO = 'Tubarão';
const SQUADS_DISPONIVEIS = ['Águia', 'Lobo', 'Serpentes'];

export function SquadReassignGate() {
  const { papel, squad, papelReady } = useSidebarContext();
  const [novoSquad, setNovoSquad] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const precisaEscolher = papelReady && papel === 'SDR' && squad === SQUAD_DISSOLVIDO;
  if (!precisaEscolher) return null;

  const confirmar = async () => {
    if (!novoSquad || saving) return;
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setSaving(false); return; }

    const { error } = await supabase.auth.updateUser({ data: { squad: novoSquad } });
    if (error) { setSaving(false); return; }

    await supabase.from('sdr_profiles').update({
      squad: novoSquad, updated_at: new Date().toISOString(),
    }).eq('user_id', session.user.id);

    // SidebarContext escuta onAuthStateChange (USER_UPDATED) e reaplica o squad
    // novo sozinho — assim que isso acontecer, precisaEscolher vira false e
    // o gate some, sem precisar de estado local extra aqui.
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8"
      style={{ background: 'linear-gradient(180deg, #1a0f2e 0%, #130a22 100%)' }}>
      <div className="w-full max-w-[480px] mx-4">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl px-6 py-3 shadow-xl">
            <img
              src="https://cardapioweb.com/wp-content/uploads/2024/01/Logo-Cardapio-Web.png"
              alt="Cardápio Web"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        <div className="cw-card p-8 space-y-5">
          <div>
            <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-cw-text mb-1.5">Squad Tubarão foi encerrado</h1>
            <p className="text-sm text-cw-muted leading-relaxed">
              O time Tubarão foi desfeito. Escolha o seu squad atual pra continuar acompanhando sua meta certinho.
            </p>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-300 leading-snug">
              Essa escolha é obrigatória — o resto do Playbook libera assim que você confirmar.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {SQUADS_DISPONIVEIS.map(s => (
              <button
                key={s}
                onClick={() => setNovoSquad(s)}
                className={cn(
                  'py-5 rounded-xl border-2 text-center font-bold text-[15px] transition-all duration-150',
                  novoSquad === s
                    ? 'border-cw-purple bg-cw-purple/10 text-cw-purple'
                    : 'border-cw-border bg-cw-elevated text-cw-muted hover:border-cw-purple/40 hover:text-cw-text'
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={confirmar}
            disabled={!novoSquad || saving}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-150',
              novoSquad && !saving
                ? 'gradient-primary hover:opacity-90 shadow-lg'
                : 'bg-cw-elevated text-cw-muted cursor-not-allowed'
            )}
          >
            {saving ? 'Salvando...' : 'Confirmar squad'}
            {!saving && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>

        <p className="text-center text-[11px] text-[#7c5aa8] mt-4">
          CW Sales Playbook · Time Comercial
        </p>
      </div>
    </div>
  );
}
