/** Celebração de promoção na Meta do Mês.
 *  Aparece quando há uma promoção 'pendente' para o usuário logado (marcada por
 *  uma liderança). Mostra confetes + "Ganhei uma promoção"; ao confirmar, troca
 *  o cargo/dashboard da pessoa. */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartyPopper, Rocket, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSidebarContext, type Papel } from '@/context/SidebarContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Confetti } from '@/components/Confetti';

interface Promo { novoPapel: Papel; novoSquad: string | null; promovidoPor: string | null; }

export default function PromocaoCelebration() {
  const { papel, squad, apelido, setPapel } = useSidebarContext();
  const userProfile = useUserProfile();
  const navigate = useNavigate();

  const [promo, setPromo]       = useState<Promo | null>(null);
  const [userId, setUserId]     = useState('');
  const [etapa, setEtapa]       = useState<'oferta' | 'aplicando' | 'feito'>('oferta');
  const [confetti, setConfetti] = useState(false);

  const carregar = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setUserId(session.user.id);
    const { data } = await supabase
      .from('promocoes')
      .select('novo_papel, novo_squad, promovido_por, status')
      .eq('user_id', session.user.id)
      .eq('status', 'pendente')
      .maybeSingle();
    if (data) {
      setPromo({ novoPapel: data.novo_papel as Papel, novoSquad: data.novo_squad ?? null, promovidoPor: data.promovido_por ?? null });
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  // Dispara os confetes assim que a oferta aparece.
  useEffect(() => {
    if (promo && etapa === 'oferta') {
      setConfetti(true);
      const t = setTimeout(() => setConfetti(false), 4600);
      return () => clearTimeout(t);
    }
  }, [promo, etapa]);

  const nome = apelido ?? userProfile.fullName ?? 'guerreiro(a)';

  const confirmar = async () => {
    if (!promo || !userId) return;
    setEtapa('aplicando');
    const novoSquad = promo.novoPapel === 'SDR' ? (promo.novoSquad ?? squad) : null;

    // 1. Metadados do auth (fonte do papel no app).
    await supabase.auth.updateUser({ data: { papel: promo.novoPapel, squad: novoSquad } });
    // 2. Perfil público.
    await supabase.from('sdr_profiles').update({ papel: promo.novoPapel, squad: novoSquad, updated_at: new Date().toISOString() }).eq('user_id', userId);
    // 3. Fecha a promoção.
    await supabase.from('promocoes').update({ status: 'concluida', concluida_at: new Date().toISOString() }).eq('user_id', userId);

    setPapel(promo.novoPapel);
    setEtapa('feito');
    setConfetti(false);
    setTimeout(() => setConfetti(true), 50);   // segunda chuva de confetes 🎉
    setTimeout(() => navigate('/start'), 3800);
  };

  if (!promo) return null;

  return (
    <>
      <Confetti active={confetti} />
      <div className="px-6 pt-6">
        <div className="relative overflow-hidden rounded-2xl border-2 border-cw-purple/40 bg-gradient-to-br from-cw-purple/15 via-white to-amber-50 shadow-lg p-6">
          <Sparkles className="absolute -right-4 -top-4 h-24 w-24 text-cw-purple/10" />
          {etapa === 'feito' ? (
            <div className="relative text-center py-2 space-y-2">
              <div className="mx-auto h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                <PartyPopper className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-black text-cw-text">Parabéns, {nome}! 🎉</h2>
              <p className="text-sm text-cw-muted">
                Bem-vindo(a) ao time de <span className="font-bold text-cw-purple">{promo.novoPapel}</span>. Te levando pro seu novo dashboard…
              </p>
            </div>
          ) : (
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shrink-0">
                <PartyPopper className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black uppercase tracking-widest text-cw-purple">Você foi promovido(a)! 🎉</p>
                <h2 className="text-xl font-black text-cw-text mt-0.5">
                  {nome}, de <span className="text-cw-muted">{papel}</span> para <span className="text-cw-purple">{promo.novoPapel}</span>
                </h2>
                <p className="text-xs text-cw-muted mt-1">
                  {promo.promovidoPor ? `Promoção liberada por ${promo.promovidoPor}.` : 'Sua liderança liberou sua promoção.'}{' '}
                  Confirme para ir pro novo dashboard.
                </p>
              </div>
              <button
                onClick={confirmar}
                disabled={etapa === 'aplicando'}
                className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white gradient-primary hover:opacity-90 shadow-lg disabled:opacity-60 transition-all"
              >
                {etapa === 'aplicando' ? 'Aplicando…' : <>Ganhei uma promoção <Rocket className="h-4 w-4" /></>}
                {etapa !== 'aplicando' && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
