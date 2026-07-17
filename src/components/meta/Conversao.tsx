/** Conversão — visão individual do SDR: das reuniões que ele deu Ganho no
 *  Meetime (por grupo de tier), quantas viraram cliente pagante no Pipedrive
 *  (telefone do lead casado com a pessoa no Pipedrive, deal Ganho no Funil de
 *  Vendas). Sempre o mês inteiro corrente.
 *  Cada grupo é um bloco separado que carrega os próprios dados de forma
 *  independente (fetch próprio) — assim um grupo lento não trava os outros,
 *  e dá pra ver todos de uma vez sem precisar clicar em aba. */
import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { RefreshCw, Percent, AlertTriangle } from 'lucide-react';
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

// Abaixo de que % de conversão mostrar o aviso pro SDR mandar mais oportunidades.
const LIMIAR_CONVERSAO_BAIXA = 20;

function BlocoConversao({ grupo, label, email, indice }: { grupo: Grupo; label: string; email: string; indice: number }) {
  const [agendamentos, setAgendamentos] = useState<number | null>(null);
  const [convertidos, setConvertidos] = useState<number | null>(null);
  const [aviso, setAviso] = useState('');
  const [loading, setLoading] = useState(false);

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

  // Escalona a carga inicial dos blocos (um por tier) — todos batendo no
  // Meetime/Pipedrive ao mesmo tempo estourava o rate limit e fazia
  // "convertidos" flutuar a cada refresh (ver commit de correção).
  useEffect(() => {
    const t = setTimeout(() => carregar(), indice * 350);
    return () => clearTimeout(t);
  }, [carregar, indice]);

  const pct = agendamentos !== null && agendamentos > 0 && convertidos !== null
    ? Math.round((convertidos / agendamentos) * 1000) / 10
    : null;
  const conversaoBaixa = pct !== null && agendamentos !== null && agendamentos > 0 && pct < LIMIAR_CONVERSAO_BAIXA;

  return (
    <div className="rounded-2xl border border-cw-border bg-white shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-cw-purple uppercase tracking-widest">{label}</span>
        <button onClick={() => carregar(true)} disabled={loading}>
          <RefreshCw className={cn('h-3.5 w-3.5 text-cw-muted hover:text-cw-purple', loading && 'animate-spin')} />
        </button>
      </div>

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

      {aviso && <p className="text-xs text-amber-500">{aviso}</p>}
      {conversaoBaixa && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Sua conversão está baixa, mande mais oportunidades
        </p>
      )}
    </div>
  );
}

export default function Conversao({ toggle }: { toggle?: ReactNode }) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? '');
    });
  }, []);

  const nomeMes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());

  return (
    <div className="p-6 space-y-4">
      <div className="rounded-2xl border border-cw-border bg-white shadow-sm p-6 space-y-1">
        {toggle}
        <div className="flex items-center gap-2 text-xs font-bold text-cw-purple uppercase tracking-widest">
          <Percent className="h-4 w-4" /> Conversão · {nomeMes}
        </div>
      </div>

      <div className="space-y-4">
        {GRUPOS.map((g, i) => (
          <BlocoConversao key={g.id} grupo={g.id} label={g.label} email={email} indice={i} />
        ))}
      </div>

      <p className="text-[11px] text-cw-muted/70 px-1">
        Reuniões = Ganho no Meetime nesse grupo, no mês inteiro. Conversão = quantas delas viraram cliente pagante (Ganho no Pipedrive).
      </p>
    </div>
  );
}
