/** Meta do Mês do papel Representante — mesmo layout/mecânica do Meta do Mês
 *  do SDR (src/components/meta/MetaMes.tsx: status card, barra com marcador
 *  de ritmo do dia, projeção, insights, Meta 1/2/3 ⭐), com um único
 *  indicador principal — meta individual (2026-08-17: sem mais divisão por squad).
 *
 *  Generalizado por FRENTE (cargoRepresentante, 2026-08-17): cada frente tem
 *  seu próprio funil no Pipedrive e seu próprio rótulo pro indicador principal
 *  (ver CARGO_CONFIG em api/reps-metas.js — front só exibe o que o back manda):
 *  - Aquisição de Canal: "Representantes Cadastrados" (Funil de Reunião Agendada).
 *  - PSM: "Reps Ativados" (Funil de Onboarding → 1º Cliente).
 *  O indicador é sincronizado automaticamente com os ganhos do mês; os botões
 *  +/-/lápis continuam valendo como ajuste manual até a próxima sincronização
 *  (api/reps-metas.js, a cada 5 min). O card "Agendamentos" do OKR do squad
 *  (só existe pra Aquisição de Canal) sincroniza com o Funil de Prospecção. */
import { useEffect, useState } from 'react';
import { Settings, X, Check, TrendingUp, Calendar, Lightbulb, Pencil, AlertTriangle, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRepsMetas } from '@/hooks/useRepsMetas';
import { RepsOkrsSection } from '@/components/meta/RepsOkrsSection';
import { supabase } from '@/integrations/supabase/client';
import { useSidebarContext } from '@/context/SidebarContext';

const RUBRICAS_POR_CARGO: Record<string, { titulo: string; singular: string; plural: string; funil: string }> = {
  'Aquisição de Canal': { titulo: 'Representantes Cadastrados', singular: 'representante', plural: 'representantes', funil: 'Funil de Reunião Agendada' },
  'PSM': { titulo: 'Reps Ativados', singular: 'rep ativado', plural: 'reps ativados', funil: 'Funil de Onboarding → 1º Cliente' },
};

function ConfigModal({ meta1, meta2, meta3, diasUteis, onSave, onClose }: {
  meta1: number; meta2: number; meta3: number; diasUteis: number | null;
  onSave: (v: { meta1: number; meta2: number; meta3: number; diasUteis: number | null }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ meta1, meta2, meta3, diasUteis });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-cw-text">Configurar Meta</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n}>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Meta {n} {n === 3 && '⭐'}</label>
              <input type="number" min={0} value={(form as any)[`meta${n}`]}
                onChange={e => setForm(f => ({ ...f, [`meta${n}`]: Number(e.target.value) }))}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple" placeholder="0" />
            </div>
          ))}

          <div className="border-t border-cw-border pt-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5">
              <Calendar className="h-3.5 w-3.5" /> Dias Úteis Restantes <span className="font-normal text-cw-muted normal-case">(opcional)</span>
            </label>
            <input
              type="number" min={0}
              value={form.diasUteis ?? ''}
              onChange={e => setForm(f => ({ ...f, diasUteis: e.target.value === '' ? null : Math.max(0, Number(e.target.value)) }))}
              placeholder="Automático"
              className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple"
            />
            <p className="text-[10px] text-cw-muted mt-1">Por padrão conta os dias úteis do mês automaticamente. Preencha pra sobrepor, ou deixe em branco pra manter o automático.</p>
          </div>
        </div>
        <button
          onClick={() => onSave(form)}
          className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white gradient-primary transition-opacity hover:opacity-90"
        >
          Salvar configurações
        </button>
      </div>
    </div>
  );
}

function AjusteModal({ modo, plural, onConfirm, onClose }: {
  modo: 'add' | 'sub'; plural: string;
  onConfirm: (qtd: number) => void; onClose: () => void;
}) {
  const [qtd, setQtd] = useState('1');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-xs mx-4 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-cw-text">{modo === 'add' ? '+ Adicionar' : '− Remover'} {plural}</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text"><X className="h-4 w-4" /></button>
        </div>
        <div>
          <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Quantos?</label>
          <input
            type="number" min={1} value={qtd}
            onChange={e => setQtd(e.target.value)}
            className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple"
            autoFocus
          />
        </div>
        <button
          onClick={() => { onConfirm(Math.max(1, Number(qtd) || 1)); onClose(); }}
          className="w-full py-3 rounded-xl font-bold text-sm text-white gradient-primary hover:opacity-90 transition-opacity"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}

function TotalModal({ valorAtual, titulo, onConfirm, onClose }: {
  valorAtual: number; titulo: string;
  onConfirm: (valor: number) => void; onClose: () => void;
}) {
  const [valor, setValor] = useState(String(valorAtual));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-xs mx-4 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-cw-text">Definir total — {titulo}</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text"><X className="h-4 w-4" /></button>
        </div>
        <div>
          <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Total neste mês</label>
          <input
            type="number" min={0} value={valor}
            onChange={e => setValor(e.target.value)}
            className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple"
            autoFocus
          />
          <p className="text-[10px] text-cw-muted mt-1.5">Substitui o total atual (não soma).</p>
        </div>
        <button
          onClick={() => { onConfirm(Math.max(0, Number(valor) || 0)); onClose(); }}
          className="w-full py-3 rounded-xl font-bold text-sm text-white gradient-primary hover:opacity-90 transition-opacity"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}

export default function MetaMesReps() {
  const { cargoRepresentante } = useSidebarContext();
  const cargo = cargoRepresentante ?? 'Aquisição de Canal';
  const rubrica = RUBRICAS_POR_CARGO[cargo] ?? RUBRICAS_POR_CARGO['Aquisição de Canal'];

  const { state, update, ajustarCadastros, definirCadastros, diasRestantes, metaReferencia, cadastro } = useRepsMetas();
  const [config, setConfig] = useState(false);
  const [ajusteModal, setAjusteModal] = useState<'add' | 'sub' | null>(null);
  const [totalModal, setTotalModal] = useState(false);

  const { meta1, meta2, meta3 } = state;
  const maxMeta = metaReferencia || 1;
  const porDia = (m: number) => diasRestantes > 0 ? Math.ceil(Math.max(0, m - cadastro.atual) / diasRestantes) : 0;
  const falta = (m: number) => Math.max(0, m - cadastro.atual);

  // Sincroniza com o Pipedrive: cadastros (Funil de Reunião Agendada, pessoal)
  // e agendamentos do squad (Funil de Prospecção) — ver api/reps-metas.js.
  const [agendamentosSquad, setAgendamentosSquad] = useState<number | null>(null);
  const [syncErro, setSyncErro] = useState<string | null>(null);
  useEffect(() => {
    let cancelado = false;
    const sincronizar = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;
      if (!email) return;
      try {
        const r = await fetch(`/api/reps-metas?email=${encodeURIComponent(email)}`);
        const json = await r.json();
        if (cancelado) return;
        if (!json.ok) { setSyncErro(json.erro ?? 'Falha ao sincronizar com o Pipedrive'); return; }
        setSyncErro(null);
        if (json.cadastros != null) definirCadastros(json.cadastros);
        if (json.agendamentos != null) setAgendamentosSquad(json.agendamentos);
      } catch (e) {
        if (!cancelado) setSyncErro(e instanceof Error ? e.message : 'Falha ao sincronizar com o Pipedrive');
      }
    };
    sincronizar();
    const id = setInterval(sincronizar, 5 * 60 * 1000);
    return () => { cancelado = true; clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const insights: { icon: React.ReactNode; texto: string; sub: string; cor: string }[] = [];
  if (cadastro.batida) {
    insights.push({ icon: <Check className="h-4 w-4" />, texto: `Meta de ${rubrica.plural} batida!`, sub: 'Sua Meta 3 foi cumprida 🏆', cor: 'text-amber-600 bg-amber-50 border-amber-200' });
  }
  if (cadastro.meta > 0 && !cadastro.noRitmo) {
    insights.push({ icon: <AlertTriangle className="h-4 w-4" />, texto: 'Cadastros abaixo do ritmo necessário', sub: 'No ritmo atual, dificilmente bate sua meta', cor: 'text-red-500 bg-red-50 border-red-200' });
  }
  if (cadastro.meta > 0) {
    const bateMeta = cadastro.projecao >= cadastro.meta;
    insights.push({
      icon: <TrendingUp className="h-4 w-4" />,
      texto: `Na projeção atual, você fecha o mês com ${cadastro.projecao} ${rubrica.plural}`,
      sub: bateMeta ? `${cadastro.projecao - cadastro.meta} acima da sua meta (${cadastro.meta})` : `${cadastro.meta - cadastro.projecao} abaixo da sua meta (${cadastro.meta})`,
      cor: bateMeta ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-cw-purple bg-cw-purple/5 border-cw-purple/20',
    });
  }

  return (
    <div className="p-8 space-y-6">
      {config && (
        <ConfigModal
          meta1={state.meta1}
          meta2={state.meta2}
          meta3={state.meta3}
          diasUteis={state.diasUteis}
          onSave={(v) => { update(v); setConfig(false); }}
          onClose={() => setConfig(false)}
        />
      )}
      {ajusteModal && (
        <AjusteModal
          modo={ajusteModal}
          plural={rubrica.plural}
          onConfirm={(qtd) => ajustarCadastros(ajusteModal === 'add' ? qtd : -qtd)}
          onClose={() => setAjusteModal(null)}
        />
      )}
      {totalModal && (
        <TotalModal
          valorAtual={state.cadastros}
          titulo={rubrica.titulo}
          onConfirm={definirCadastros}
          onClose={() => setTotalModal(false)}
        />
      )}

      {/* Card de status */}
      <div className="cw-card relative overflow-hidden">
        {/* Cardapinho viking — mesmo mascote e posicionamento do Meta do Mês do SDR */}
        <img src="/cardapinho-viking.png" alt="" className="absolute right-0 bottom-0 h-52 object-contain pointer-events-none select-none" style={{ zIndex: 10 }} />

        <div className="relative p-6 space-y-5" style={{ zIndex: 1 }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cw-purple uppercase tracking-widest">
            <ClipboardCheck className="h-4 w-4" />
            {rubrica.titulo.toUpperCase()} — STATUS
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setAjusteModal('sub')} title={`Remover ${rubrica.plural}`}
              className="h-9 w-9 rounded-lg border border-cw-border bg-cw-elevated text-cw-muted hover:text-red-500 hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-all text-lg font-bold">
              −
            </button>
            <button onClick={() => setAjusteModal('add')} title={`Adicionar ${rubrica.plural}`}
              className="h-9 w-9 rounded-lg border border-cw-border bg-cw-elevated text-cw-muted hover:text-cw-purple hover:bg-cw-purple/10 hover:border-cw-purple/40 flex items-center justify-center transition-all text-lg font-bold">
              +
            </button>
            <button onClick={() => setTotalModal(true)} title="Definir total manual"
              className="h-9 w-9 rounded-lg border border-cw-border bg-cw-elevated text-cw-muted hover:text-cw-purple hover:bg-cw-purple/10 hover:border-cw-purple/40 flex items-center justify-center transition-all">
              <Pencil className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-cw-border mx-0.5" />
            <span className={cn('text-xs font-black px-3 py-1 rounded-full border whitespace-nowrap',
              cadastro.noRitmo ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-200'
            )}>
              {cadastro.noRitmo ? '↗ No Ritmo' : '↘ Atrasado'}
            </span>
            <button onClick={() => setConfig(true)} title="Configurar meta"
              className="h-7 w-7 rounded-lg bg-cw-elevated border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-all">
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="flex items-center gap-1.5 text-[10px] text-cw-muted">
          <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', syncErro ? 'bg-red-400' : 'bg-emerald-400')} />
          {syncErro ? `Sincronização com o Pipedrive falhou: ${syncErro}` : `Sincronizado com o Pipedrive — ${rubrica.funil} (ganhos do mês)`}
        </p>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-cw-purple">{cadastro.atual}</span>
            <span className="text-xl text-cw-muted font-bold">/ {cadastro.meta || '?'}</span>
          </div>
          <p className={cn('text-sm font-semibold mt-1', cadastro.batida ? 'text-green-600' : 'text-cw-muted')}>
            {cadastro.meta === 0
              ? 'Defina uma meta pra acompanhar o progresso'
              : cadastro.batida
                ? 'Meta batida! Parabéns 🏆'
                : `Faltam ${cadastro.falta} ${rubrica.plural}`}
          </p>

          {cadastro.meta > 0 && (
            <div className="mt-4">
              <div className="relative w-full h-1.5 bg-cw-border rounded-full">
                <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 bg-emerald-500" style={{ width: `${cadastro.progresso}%` }} />
                {[{ label: 'Meta 1', value: meta1 }, { label: 'Meta 2', value: meta2 }, { label: 'Meta 3', value: meta3 }].map(({ label, value }) => {
                  if (!(value > 0)) return null;
                  const left = Math.min((value / maxMeta) * 100, 99);
                  const atingida = cadastro.atual >= value;
                  return (
                    <div key={label} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${left}%` }}
                      title={atingida ? `Você chegou à ${label}!` : `Você deveria estar aqui pra bater a ${label}`}>
                      <div className={cn('w-0.5 h-3.5 rounded-full', atingida ? 'bg-green-500' : 'bg-cw-text/40')} />
                    </div>
                  );
                })}
                {cadastro.ritmoHojeValor > 0 && (
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" style={{ left: `${cadastro.ritmoHojePct}%` }}
                    title={cadastro.noRitmoHoje ? 'Você está no ritmo hoje!' : 'Você deveria estar aqui hoje pra manter o ritmo'}>
                    <span className={cn('absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-md text-[10px] font-black text-white whitespace-nowrap shadow-sm',
                      cadastro.noRitmoHoje ? 'bg-blue-500' : 'bg-amber-500')}>
                      {Math.round(cadastro.ritmoHojeValor)}
                    </span>
                    <div className={cn('w-1 h-5 rounded-full ring-2 ring-white', cadastro.noRitmoHoje ? 'bg-blue-500' : 'bg-amber-500')} />
                  </div>
                )}
              </div>
              <div className="relative h-3.5 mt-2.5">
                {[{ label: 'Meta 1', value: meta1 }, { label: 'Meta 2', value: meta2 }, { label: 'Meta 3', value: meta3 }].map(({ label, value }) => {
                  if (!(value > 0)) return null;
                  const left = Math.min((value / maxMeta) * 100, 99);
                  const atingida = cadastro.atual >= value;
                  return (
                    <span key={label} className={cn('absolute -translate-x-1/2 text-[9px] font-bold whitespace-nowrap',
                      atingida ? 'text-green-600' : 'text-cw-muted')} style={{ left: `${left}%` }}>
                      {label}
                    </span>
                  );
                })}
                {cadastro.ritmoHojeValor > 0 && (
                  <span className={cn('absolute -translate-x-1/2 text-[9px] font-bold whitespace-nowrap',
                    cadastro.noRitmoHoje ? 'text-blue-600' : 'text-amber-600')} style={{ left: `${cadastro.ritmoHojePct}%` }}>
                    Hoje
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cards Meta 1/2/3 */}
        <div className="grid grid-cols-3 gap-3">
          {[{ label: 'META 1', value: meta1 }, { label: 'META 2', value: meta2 }, { label: 'META 3 ⭐', value: meta3 }].map(({ label, value }, i) => {
            const batida = value > 0 && cadastro.atual >= value;
            return (
              <div key={i} className={cn('rounded-xl border p-3',
                batida ? 'border-green-200 bg-green-50' : 'border-cw-border bg-cw-elevated'
              )}>
                <p className="text-[10px] font-bold text-cw-purple uppercase tracking-wider">{label}</p>
                <p className="text-xs text-cw-muted mt-0.5">{value > 0 ? `${value} ${rubrica.plural}` : 'Não definida'}</p>
                {batida ? (
                  <div className="flex items-center gap-1 mt-1.5 text-green-600 text-xs font-semibold">
                    <Check className="h-3.5 w-3.5" /> Meta atingida!
                  </div>
                ) : value > 0 ? (
                  <div className="mt-1.5">
                    <p className="text-base font-black text-cw-text">{porDia(value)}<span className="text-xs text-cw-muted ml-1">/dia</span></p>
                    <p className="text-[10px] text-cw-muted">Falta <span className="text-cw-text font-semibold">{falta(value)}</span> pra meta</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cw-elevated rounded-xl border border-cw-border px-4 py-3 flex items-center gap-3">
            <TrendingUp className="h-4 w-4 text-cw-purple shrink-0" />
            <div>
              <p className="text-[10px] text-cw-muted uppercase font-bold tracking-wider">Projeção Final</p>
              <p className="text-base font-black text-cw-text">
                {cadastro.meta > 0 ? <>{cadastro.projecao} <span className="text-sm text-cw-muted font-normal">/ {cadastro.meta}</span></> : <span className="text-sm text-cw-muted font-normal">— defina uma meta</span>}
              </p>
            </div>
          </div>
          <div className="bg-cw-elevated rounded-xl border border-cw-border px-4 py-3 flex items-center gap-3">
            <Calendar className="h-4 w-4 text-cw-yellow shrink-0" />
            <div>
              <p className="text-[10px] text-cw-muted uppercase font-bold tracking-wider">Dias Restantes</p>
              <p className="text-base font-black text-cw-text">{diasRestantes} <span className="text-sm text-cw-muted font-normal">dias</span></p>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* OKRs & Metas do Squad — não entra no cálculo acima */}
      <RepsOkrsSection cargo={cargo} agendamentosAuto={agendamentosSquad} />

      {/* Insights Rápidos */}
      <div className="cw-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-black text-cw-text">Insights Rápidos</h3>
            <p className="text-xs text-cw-muted">Informações importantes</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg border text-cw-purple bg-cw-purple/5 border-cw-purple/20">
            <Pencil className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug"><span className="font-semibold">Sincronizado com o Pipedrive:</span> use os botões +/− ou o lápis só se precisar ajustar entre uma sincronização e outra. O ajuste manual fica salvo só neste navegador.</p>
          </div>
          {insights.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-cw-muted text-sm">
              Defina sua meta para ver os insights.
            </div>
          ) : insights.map((ins, i) => (
            <div key={i} className={cn('flex items-start gap-2 px-3 py-2 rounded-lg border', ins.cor)}>
              <span className="shrink-0 mt-0.5">{ins.icon}</span>
              <div>
                <p className="text-[11px] font-semibold leading-snug">{ins.texto}</p>
                {ins.sub && <p className="text-[10px] opacity-70 mt-0.5">{ins.sub}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
