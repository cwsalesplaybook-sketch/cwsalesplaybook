/** Conversão — visão individual do SDR: das reuniões que ele deu Ganho no
 *  Meetime (filtrando por grupo de tier), quantas viraram cliente pagante no
 *  Pipedrive (telefone do lead casado com a pessoa no Pipedrive, deal Ganho
 *  no Funil de Vendas). Sempre o mês inteiro corrente — o único filtro é o
 *  grupo de tier, pra cada SDR entender a própria conversão. */
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { RefreshCw, Percent } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

type Grupo = '1-2' | '3' | '4-5' | 'manual';
const GRUPOS: { id: Grupo; label: string }[] = [
  { id: '1-2',    label: 'Tier 1 e 2' },
  { id: '3',      label: 'Tier 3' },
  { id: '4-5',    label: 'Tier 4 e 5' },
  { id: 'manual', label: 'Adição Manual' },
];

export default function Conversao({ toggle }: { toggle?: ReactNode }) {
  const [grupo, setGrupo] = useState<Grupo>('1-2');
  const [email, setEmail] = useState('');
  const [agendamentos, setAgendamentos] = useState<number | null>(null);
  const [convertidos, setConvertidos] = useState<number | null>(null);
  const [aviso, setAviso] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? '');
    });
  }, []);

  const carregar = useCallback(async (forceRefresh = false) => {
    if (!email) return;
    setLoading(true);
    setAviso('');
    try {
      const bust = forceRefresh ? `&_t=${Date.now()}` : '';
      const r = await fetch(`/api/conversao?email=${encodeURIComponent(email)}&grupo=${grupo}${bust}`);
      const j = await r.json();
      if (j.ok) {
        setAgendamentos(j.agendamentos);
        setConvertidos(j.convertidos);
        setAviso(j.aviso || '');
      } else {
        setAgendamentos(null);
        setConvertidos(null);
      }
    } catch {
      setAgendamentos(null);
      setConvertidos(null);
    } finally { setLoading(false); }
  }, [email, grupo]);

  useEffect(() => { carregar(); }, [carregar]);

  const nomeMes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());
  const pct = agendamentos !== null && agendamentos > 0 && convertidos !== null
    ? Math.round((convertidos / agendamentos) * 1000) / 10
    : null;

  return (
    <div className="p-6 space-y-4">
      <div className="rounded-2xl border border-cw-border bg-white shadow-sm p-6 space-y-5">
        {toggle}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-cw-purple uppercase tracking-widest">
            <Percent className="h-4 w-4" /> Conversão · {nomeMes}
            <button onClick={() => carregar(true)} disabled={loading} className="ml-1">
              <RefreshCw className={cn('h-3.5 w-3.5 text-cw-muted hover:text-cw-purple', loading && 'animate-spin')} />
            </button>
          </div>
        </div>

        {/* Seletor de grupo de tier */}
        <div className="flex items-center gap-1.5">
          {GRUPOS.map(g => (
            <button key={g.id} onClick={() => setGrupo(g.id)}
              className={cn('px-3 py-1.5 rounded-full text-xs font-bold border transition-all',
                grupo === g.id ? 'bg-cw-purple text-white border-cw-purple' : 'bg-white text-cw-muted border-cw-border hover:border-cw-purple/40')}>
              {g.label}
            </button>
          ))}
        </div>

        <div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-cw-border bg-cw-elevated p-3">
              <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">Reuniões</p>
              <p className="text-lg font-black text-cw-text mt-0.5">{agendamentos === null ? '…' : agendamentos}</p>
            </div>
            <div className="rounded-xl border border-cw-border bg-cw-elevated p-3">
              <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">Convertidos</p>
              <p className="text-lg font-black text-cw-text mt-0.5">{convertidos === null ? '…' : convertidos}</p>
            </div>
            <div className="rounded-xl border border-cw-purple bg-cw-purple/10 p-3">
              <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">Conversão</p>
              <p className="text-lg font-black text-cw-purple mt-0.5">{pct === null ? '…' : `${pct}%`}</p>
            </div>
          </div>
          {aviso && <p className="text-xs text-amber-500 mt-2">{aviso}</p>}
        </div>

        <p className="text-[11px] text-cw-muted/70 border-t border-cw-border pt-3">
          Reuniões = Ganho no Meetime nesse grupo de tier, no mês inteiro. Conversão = quantas delas viraram cliente pagante (Ganho no Pipedrive).
        </p>
      </div>
    </div>
  );
}
