/** Conversão — visão individual do SDR: das reuniões que ele deu Ganho no
 *  Meetime (por grupo de tier), quantas viraram cliente pagante no Pipedrive
 *  (telefone do lead casado com a pessoa no Pipedrive, deal Ganho no Funil de
 *  Vendas). Sempre o mês inteiro corrente.
 *  Cada grupo aparece como um bloco visualmente separado, mas os dados dos 5
 *  vêm de UMA chamada só (`grupo=todos`) — tentamos cada bloco com fetch
 *  próprio antes, e 5 requisições concorrentes (uma invocação serverless
 *  cada) não conseguem coordenar rate limit entre si contra o Pipedrive, o
 *  que fazia "convertidos" flutuar a cada refresh. Uma chamada só resolve
 *  todos os grupos internamente com concorrência única e controlada. */
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { RefreshCw, Percent, AlertTriangle, Info } from 'lucide-react';
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

interface DadosGrupo { agendamentos: number; convertidos: number; projecaoGanhos: number; }

function BlocoConversao({ label, dados }: { label: string; dados: DadosGrupo | null }) {
  const agendamentos = dados?.agendamentos ?? null;
  const convertidos = dados?.convertidos ?? null;
  const projecaoGanhos = dados?.projecaoGanhos ?? null;
  const pct = agendamentos !== null && agendamentos > 0 && convertidos !== null
    ? Math.round((convertidos / agendamentos) * 1000) / 10
    : null;
  const conversaoBaixa = pct !== null && agendamentos !== null && agendamentos > 0 && pct < LIMIAR_CONVERSAO_BAIXA;

  return (
    <div className="rounded-2xl border border-cw-border bg-white shadow-sm p-5 space-y-4">
      <span className="text-xs font-bold text-cw-purple uppercase tracking-widest">{label}</span>

      <div className="grid grid-cols-4 gap-3">
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
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Projeção</p>
          <p className="text-lg font-black text-emerald-600 mt-0.5">{projecaoGanhos === null ? '…' : projecaoGanhos}</p>
          <p className="text-[8px] text-emerald-600/60">ganhos até o fim do mês</p>
        </div>
      </div>

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
  const [dados, setDados] = useState<Record<Grupo, DadosGrupo> | null>(null);
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
        {toggle}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-cw-purple uppercase tracking-widest shrink-0">
            <Percent className="h-4 w-4" /> Conversão · {nomeMes}
            <button onClick={() => carregar(true)} disabled={loading} className="ml-1">
              <RefreshCw className={cn('h-3.5 w-3.5 text-cw-muted hover:text-cw-purple', loading && 'animate-spin')} />
            </button>
          </div>
          <p className="flex items-start gap-1.5 text-[11px] leading-snug text-cw-muted bg-cw-elevated border border-cw-border rounded-xl px-3 py-2 max-w-md">
            <Info className="h-3.5 w-3.5 text-cw-purple shrink-0 mt-0.5" />
            <span>"Convertidos" aqui é diferente do total de <strong className="text-cw-text">Ganhos</strong> da Meta do Mês: conta só reuniões <strong className="text-cw-text">deste mês</strong> que eu consegui casar <strong className="text-cw-text">por telefone</strong> com o Pipedrive.</span>
          </p>
        </div>
        {aviso && <p className="text-xs text-amber-500 mt-2">{aviso}</p>}
      </div>

      <div className="space-y-4">
        {GRUPOS.map(g => (
          <BlocoConversao key={g.id} label={g.label} dados={dados?.[g.id] ?? null} />
        ))}
      </div>

      <p className="text-[11px] text-cw-muted/70 px-1">
        Reuniões = Ganho no Meetime nesse grupo, no mês inteiro. Conversão = quantas delas viraram cliente pagante (Ganho no Pipedrive).
        Projeção = estica o ritmo de reuniões até agora pros dias úteis restantes do mês e aplica a taxa de conversão observada.
      </p>
    </div>
  );
}
