/** Meta do Squad — visão do SDR que não lidera (somente leitura).
 *  Mostra só o agregado do squad (fechamentos totais e KPIs), pra dar noção
 *  do andamento da meta do time sem detalhar membro a membro — a lista de
 *  colegas e os botões de edição ficam só na visão de liderança
 *  (TeamMetaView). A leitura de sdr_profiles/user_metas dos colegas é
 *  liberada por RLS (mesmo_squad), mas essa tela nunca expõe nome ou meta
 *  individual de ninguém, só a soma. */
import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Target, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface SquadKpis { clientes: number; clientesDia: number; agendamentosDia: number; ltr: number; noShow: number; }
const KPIS_VAZIO: SquadKpis = { clientes: 0, clientesDia: 0, agendamentosDia: 0, ltr: 0, noShow: 0 };

export default function MeuSquadMetaView({ squad }: { squad: string }) {
  const [mes, setMes] = useState('');
  const [meta, setMeta] = useState(0);
  const [squadKpis, setSquadKpis] = useState<SquadKpis>(KPIS_VAZIO);
  const [totalGanhos, setTotalGanhos] = useState<number | null>(null);
  const [diasPassados, setDiasPassados] = useState(0);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async (forceRefresh = false) => {
    if (!squad) return;
    setLoading(true);
    const mesAtual = new Date().toISOString().slice(0, 7);
    setMes(mesAtual);
    try {
      const [{ data: tMeta }, { data: kpis }, { data: perfis }] = await Promise.all([
        supabase.from('team_metas').select('*').eq('squad', squad).eq('mes', mesAtual).maybeSingle(),
        supabase.from('squad_kpis').select('*').eq('squad', squad).eq('mes', mesAtual).maybeSingle(),
        supabase.from('sdr_profiles').select('user_id').eq('squad', squad),
      ]);
      setMeta(tMeta?.meta1 ?? 0);
      setSquadKpis(kpis
        ? { clientes: kpis.meta_clientes, clientesDia: kpis.meta_clientes_dia, agendamentosDia: kpis.meta_agendamentos_dia ?? 0, ltr: Number(kpis.meta_ltr), noShow: Number(kpis.meta_no_show) }
        : KPIS_VAZIO);

      // Soma só o agregado — nunca guarda/renderiza o detalhe de cada colega.
      const ids = (perfis ?? []).map(p => p.user_id);
      const { data: metas } = ids.length
        ? await supabase.from('user_metas').select('sdr_id, ajuste').in('user_id', ids).eq('mes', mesAtual)
        : { data: [] as { sdr_id: string | null; ajuste: number }[] };

      const bust = forceRefresh ? `&_t=${Date.now()}` : '';
      let soma = 0;
      let diasPassadosCapturado = 0;
      await Promise.all((metas ?? []).map(async (m) => {
        soma += m.ajuste ?? 0;
        if (!m.sdr_id) return;
        try {
          const r = await fetch(`/api/meta?sdrId=${m.sdr_id}${bust}`);
          const j = await r.json();
          if (j.ok) {
            soma += j.ganhos;
            if (!diasPassadosCapturado) diasPassadosCapturado = j.diasPassados || 0;
          }
        } catch { /* ignora falha de um colega, não trava o total */ }
      }));
      setTotalGanhos(soma);
      setDiasPassados(diasPassadosCapturado);
    } finally { setLoading(false); }
  }, [squad]);

  useEffect(() => { carregar(); }, [carregar]);

  const nomeMes = mes ? new Date(mes + '-15').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase()) : '';
  const pctBarra = meta > 0 && totalGanhos !== null ? Math.min(100, (totalGanhos / meta) * 100) : 0;
  const temKpis = squadKpis.clientes > 0 || squadKpis.clientesDia > 0 || squadKpis.agendamentosDia > 0 || squadKpis.ltr > 0 || squadKpis.noShow > 0;
  const clientesDiaAtual = diasPassados > 0 && totalGanhos !== null ? Math.round((totalGanhos / diasPassados) * 10) / 10 : null;

  return (
    <div className="p-6 space-y-4">
      <div className="rounded-2xl border border-cw-border bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-cw-purple uppercase tracking-widest">
            <Target className="h-4 w-4" /> Meta do Squad · {squad} {nomeMes && <span className="text-cw-muted/70 normal-case font-medium">— {nomeMes}</span>}
            <button onClick={() => carregar(true)} disabled={loading} className="ml-1">
              <RefreshCw className={cn('h-3.5 w-3.5 text-cw-muted hover:text-cw-purple', loading && 'animate-spin')} />
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-cw-purple">{totalGanhos === null ? '…' : totalGanhos}</span>
            <span className="text-xl text-cw-muted font-bold">/ {meta || '?'}</span>
          </div>
          <p className="text-sm text-cw-muted mt-1">Soma dos fechamentos do squad neste mês</p>
          {meta > 0 && (
            <div className="mt-3 w-full h-1.5 bg-cw-border rounded-full overflow-hidden">
              <div className="h-full bg-cw-purple rounded-full transition-all duration-700" style={{ width: `${pctBarra}%` }} />
            </div>
          )}
        </div>

        {/* KPIs do squad */}
        <div className="border-t border-cw-border pt-5">
          <p className="flex items-center gap-1.5 text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">
            <BarChart3 className="h-3.5 w-3.5" /> KPIs do Squad
          </p>
          {temKpis ? (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="rounded-xl border border-cw-border bg-cw-elevated p-3">
                <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">Clientes</p>
                <p className="text-lg font-black text-cw-text mt-0.5">
                  {totalGanhos === null ? '…' : totalGanhos}<span className="text-xs text-cw-muted font-normal"> / {squadKpis.clientes || '?'}</span>
                </p>
              </div>
              <div className="rounded-xl border border-cw-border bg-cw-elevated p-3">
                <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">Clientes/dia</p>
                <p className="text-lg font-black text-cw-text mt-0.5">
                  {clientesDiaAtual === null ? '…' : clientesDiaAtual}<span className="text-xs text-cw-muted font-normal"> / {squadKpis.clientesDia || '?'}</span>
                </p>
              </div>
              <div className="rounded-xl border border-cw-border bg-cw-elevated p-3">
                <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">Agendamentos/dia</p>
                <p className="text-lg font-black text-cw-text mt-0.5">{squadKpis.agendamentosDia || '?'}</p>
                <p className="text-[9px] text-cw-muted/70 mt-0.5">meta diária</p>
              </div>
              <div className="rounded-xl border border-cw-border bg-cw-elevated p-3">
                <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">LTR</p>
                <p className="text-lg font-black text-cw-text mt-0.5">{squadKpis.ltr || '?'}%</p>
                <p className="text-[9px] text-cw-muted/70 mt-0.5">meta — sem dado real ainda</p>
              </div>
              <div className="rounded-xl border border-cw-border bg-cw-elevated p-3">
                <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">No-show</p>
                <p className="text-lg font-black text-cw-text mt-0.5">{squadKpis.noShow || '?'}%</p>
                <p className="text-[9px] text-cw-muted/70 mt-0.5">meta — sem dado real ainda</p>
              </div>
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-cw-muted">KPIs ainda não definidos pra este squad este mês.</p>
          )}
        </div>
      </div>
    </div>
  );
}
