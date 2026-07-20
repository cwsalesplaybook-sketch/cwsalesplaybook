/** Conversão — visão individual do SDR: quantas reuniões ele deu Ganho no
 *  Meetime neste mês, por grupo de tier. Sempre o mês inteiro corrente.
 *  Temporariamente só usa a API do Meetime (sem Pipedrive): a aba consumia
 *  parte considerável da cota diária de chamadas do Pipedrive (sobretudo o
 *  grupo Adição Manual, que casava telefone por telefone), então "Convertidos"
 *  e "Projeção de Ganhos" ficam fora por ora — ver api/conversao.js. */
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { RefreshCw, Percent, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

type Grupo = '1-2' | '3' | '4-5' | 'manual' | 'parcerias';
const GRUPOS: { id: Grupo; label: string }[] = [
  { id: '1-2',       label: 'Tier 1 e 2' },
  { id: '3',         label: 'Tier 3' },
  { id: '4-5',       label: 'Tier 4 e 5' },
  { id: 'manual',    label: 'Adição Manual' },
  { id: 'parcerias', label: 'Parcerias' },
];

interface DadosGrupo { agendamentos: number; }

function BlocoConversao({ label, dados }: { label: string; dados: DadosGrupo | null }) {
  const agendamentos = dados?.agendamentos ?? null;

  return (
    <div className="rounded-2xl border border-cw-border bg-white shadow-sm p-5 flex items-center justify-between gap-4">
      <span className="text-xs font-bold text-cw-purple uppercase tracking-widest">{label}</span>
      <div className="rounded-xl border border-cw-border bg-cw-elevated px-4 py-2 text-right">
        <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">Reuniões</p>
        <p className="text-lg font-black text-cw-text mt-0.5">{agendamentos === null ? '…' : agendamentos}</p>
      </div>
    </div>
  );
}

export default function Conversao({ toggle }: { toggle?: ReactNode }) {
  const [email, setEmail] = useState('');
  const [dados, setDados] = useState<Record<Grupo, DadosGrupo> | null>(null);
  const [aviso, setAviso] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      setEmail(session.user.email ?? '');
    });
  }, []);

  const carregar = useCallback(async (forceRefresh = false) => {
    if (!email) return;
    setLoading(true);
    setAviso('');
    try {
      const bust = forceRefresh ? `&_t=${Date.now()}` : '';
      const r = await fetch(`/api/conversao?email=${encodeURIComponent(email)}&grupo=todos${bust}`);
      const j = await r.json();
      if (j.ok) {
        setDados(j.grupos);
        setAviso(j.aviso || '');
      } else {
        setDados(null);
      }
    } catch {
      setDados(null);
    } finally { setLoading(false); }
  }, [email]);

  useEffect(() => { carregar(); }, [carregar]);

  const nomeMes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());

  return (
    <div className="p-6 space-y-4">
      <div className="rounded-2xl border border-cw-border bg-white shadow-sm p-6 space-y-1">
        <div className="flex items-center justify-between gap-4">
          {toggle}
          <p className="flex items-start gap-2 text-sm leading-relaxed text-cw-muted bg-cw-elevated border border-cw-border rounded-xl px-4 py-3 flex-1">
            <Info className="h-5 w-5 text-cw-purple shrink-0 mt-0.5" />
            <span>Por ora essa aba mostra só <strong className="text-cw-text">Reuniões</strong> (Ganho no Meetime, deste mês) — "Convertidos" e "Projeção" ficaram fora temporariamente pra não estourar a cota diária da API do Pipedrive.</span>
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 mt-3">
          <div className="flex items-center gap-2 text-xs font-bold text-cw-purple uppercase tracking-widest shrink-0">
            <Percent className="h-4 w-4" /> Conversão · {nomeMes}
            <button onClick={() => carregar(true)} disabled={loading} className="ml-1">
              <RefreshCw className={cn('h-3.5 w-3.5 text-cw-muted hover:text-cw-purple', loading && 'animate-spin')} />
            </button>
          </div>
        </div>
        {aviso && <p className="text-xs text-amber-500 mt-2">{aviso}</p>}
      </div>

      <div className="space-y-4">
        {GRUPOS.map(g => (
          <BlocoConversao key={g.id} label={g.label} dados={dados?.[g.id] ?? null} />
        ))}
      </div>

      <p className="text-[11px] text-cw-muted/70 px-1">
        Reuniões = Ganho no Meetime nesse grupo, no mês inteiro.
      </p>
    </div>
  );
}
