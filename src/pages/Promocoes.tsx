/** Painel de Promoções (liderança) — marca quem foi promovido e para qual cargo.
 *  Protegido: só aparece/funciona para quem lidera squads (RLS reforça no banco).
 *  A pessoa promovida recebe a celebração na Meta do Mês e confirma a troca. */
import { useCallback, useEffect, useState } from 'react';
import { PartyPopper, X, Check, Clock, Rocket, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSidebarContext, type Papel } from '@/context/SidebarContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { cn } from '@/lib/utils';

interface Membro {
  userId: string; apelido: string; papel: string; squad: string | null;
  promoStatus: 'pendente' | 'concluida' | null;
  promoPapel: string | null;
}

const PAPEIS: Papel[] = ['SDR', 'Closer', 'Representante', 'Parcerias', 'Liderança'];

function PromoverModal({ membro, onConfirm, onClose }: {
  membro: Membro; onConfirm: (novoPapel: Papel) => void; onClose: () => void;
}) {
  const [novo, setNovo] = useState<Papel | null>(null);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-cw-text">Promover {membro.apelido}</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text"><X className="h-5 w-5" /></button>
        </div>
        <p className="text-xs text-cw-muted mb-4">Cargo atual: <span className="font-semibold text-cw-text">{membro.papel}</span>{membro.squad ? ` · Squad ${membro.squad}` : ''}</p>
        <p className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-2">Promover para</p>
        <div className="grid grid-cols-1 gap-2">
          {PAPEIS.filter(p => p !== membro.papel).map(p => (
            <button key={p} onClick={() => setNovo(p)}
              className={cn('w-full px-4 py-3 rounded-xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between',
                novo === p ? 'border-cw-purple bg-cw-purple/10 text-cw-purple' : 'border-cw-border bg-cw-elevated text-cw-muted hover:border-cw-purple/40 hover:text-cw-text')}>
              {p}
              {novo === p && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
        <button onClick={() => novo && onConfirm(novo)} disabled={!novo}
          className="w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white gradient-primary hover:opacity-90 disabled:opacity-50 transition-opacity">
          <Rocket className="h-4 w-4" /> Liberar promoção
        </button>
        <p className="text-[11px] text-cw-muted text-center mt-3">
          {membro.apelido.split(' ')[0]} vai ver a celebração na Meta do Mês e confirmar a troca de dashboard.
        </p>
      </div>
    </div>
  );
}

export default function Promocoes() {
  const { papel, squadsLideradas } = useSidebarContext();
  const userProfile = useUserProfile();
  const isLider = (papel === 'Liderança' && squadsLideradas.length > 0) || squadsLideradas.length > 0;

  const [membros, setMembros] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);
  const [promover, setPromover] = useState<Membro | null>(null);

  const carregar = useCallback(async () => {
    if (squadsLideradas.length === 0) { setLoading(false); return; }
    setLoading(true);
    const { data: perfis } = await supabase
      .from('sdr_profiles')
      .select('user_id, apelido, email, papel, squad')
      .in('squad', squadsLideradas);
    const lista = perfis ?? [];
    const ids = lista.map(p => p.user_id);
    const { data: promos } = ids.length
      ? await supabase.from('promocoes').select('user_id, novo_papel, status').in('user_id', ids)
      : { data: [] as any[] };
    const pmap = new Map((promos ?? []).map(p => [p.user_id, p]));
    setMembros(lista.map(p => {
      const pr = pmap.get(p.user_id);
      return {
        userId: p.user_id,
        apelido: p.apelido || p.email || 'Sem nome',
        papel: p.papel || 'SDR',
        squad: p.squad,
        promoStatus: (pr?.status as 'pendente' | 'concluida') ?? null,
        promoPapel: pr?.novo_papel ?? null,
      };
    }));
    setLoading(false);
  }, [squadsLideradas]);

  useEffect(() => { carregar(); }, [carregar]);

  const liberarPromocao = async (membro: Membro, novoPapel: Papel) => {
    await supabase.from('promocoes').upsert({
      user_id: membro.userId, novo_papel: novoPapel, promovido_por: userProfile.fullName ?? userProfile.email ?? null,
      status: 'pendente', created_at: new Date().toISOString(), concluida_at: null,
    }, { onConflict: 'user_id' });
    setPromover(null);
    carregar();
  };

  const cancelar = async (membro: Membro) => {
    await supabase.from('promocoes').delete().eq('user_id', membro.userId);
    carregar();
  };

  if (!isLider) {
    return (
      <div className="p-10 max-w-xl mx-auto text-center space-y-3">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-cw-purple/10 flex items-center justify-center"><PartyPopper className="h-6 w-6 text-cw-purple" /></div>
        <h1 className="text-xl font-black text-cw-text">Painel de Promoções</h1>
        <p className="text-sm text-cw-muted">Esta área é exclusiva das lideranças. Se você lidera um squad e não está vendo o time, fale com o time de produto.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      {promover && <PromoverModal membro={promover} onConfirm={(p) => liberarPromocao(promover, p)} onClose={() => setPromover(null)} />}

      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl gradient-primary flex items-center justify-center shadow-lg"><PartyPopper className="h-6 w-6 text-white" /></div>
        <div>
          <h1 className="text-2xl font-black text-cw-text">Promoções</h1>
          <p className="text-sm text-cw-muted">Marque quem foi promovido — a pessoa confirma e os confetes sobem 🎉</p>
        </div>
      </div>

      <div className="cw-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cw-purple/10 flex items-center justify-center"><Users className="h-4 w-4 text-cw-purple" /></div>
          <div>
            <h3 className="text-base font-black text-cw-text">Seu time</h3>
            <p className="text-xs text-cw-muted">{squadsLideradas.join(' · ')}</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl cw-shimmer" />)}</div>
        ) : membros.length === 0 ? (
          <p className="py-8 text-center text-sm text-cw-muted">Nenhum membro no(s) seu(s) squad(s) ainda.</p>
        ) : (
          <div className="space-y-2">
            {membros.map(m => (
              <div key={m.userId} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-cw-border bg-cw-elevated">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-cw-text truncate">{m.apelido}</p>
                  <p className="text-[11px] text-cw-muted">{m.papel}{m.squad ? ` · ${m.squad}` : ''}</p>
                </div>

                {m.promoStatus === 'pendente' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      <Clock className="h-3 w-3" /> Aguardando confirmar → {m.promoPapel}
                    </span>
                    <button onClick={() => cancelar(m)} title="Cancelar promoção" className="text-cw-muted hover:text-red-500 text-xs font-semibold">Cancelar</button>
                  </div>
                ) : m.promoStatus === 'concluida' ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full shrink-0">
                    <Check className="h-3 w-3" /> Promovido(a)
                  </span>
                ) : (
                  <button onClick={() => setPromover(m)}
                    className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-bold text-white gradient-primary hover:opacity-90 transition-opacity">
                    <Rocket className="h-3.5 w-3.5" /> Promover
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
