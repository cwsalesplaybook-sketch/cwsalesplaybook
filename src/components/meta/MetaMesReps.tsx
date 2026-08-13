/** Meta do Mês de Aquisição de Canal — mesmo layout/mecânica do Meta do Mês
 *  do SDR (src/components/meta/MetaMes.tsx: status card, barra com marcador
 *  de ritmo do dia, projeção, insights), mas SEM Pipedrive (tudo manual,
 *  localStorage) e com DOIS indicadores em vez de um: Agendamentos (reuniões
 *  marcadas com o representante) e Representantes Cadastrados (meta do squad
 *  dividida entre quem recruta, ex: você + Hyorranes). */
import { useState } from 'react';
import { Settings, X, Check, TrendingUp, Calendar, Target, Lightbulb, Pencil, AlertTriangle, Users, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRepsMetas, type MetricCalc } from '@/hooks/useRepsMetas';

function ConfigModal({ agendamentoMeta, cadastroMetaTotal, squadPessoas, diasUteis, onSave, onClose }: {
  agendamentoMeta: number; cadastroMetaTotal: number; squadPessoas: number; diasUteis: number | null;
  onSave: (v: { agendamentoMeta: number; cadastroMetaTotal: number; squadPessoas: number; diasUteis: number | null }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ agendamentoMeta, cadastroMetaTotal, squadPessoas, diasUteis });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-cw-text">Configurar Metas</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Meta de Agendamentos (reuniões)</label>
            <input type="number" min={0} value={form.agendamentoMeta}
              onChange={e => setForm(f => ({ ...f, agendamentoMeta: Number(e.target.value) }))}
              className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple" placeholder="0" />
          </div>

          <div className="border-t border-cw-border pt-4 space-y-4">
            <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <Users className="h-3.5 w-3.5" /> Meta de Representantes Cadastrados (squad)
            </p>
            <div>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Meta total do squad</label>
              <input type="number" min={0} value={form.cadastroMetaTotal}
                onChange={e => setForm(f => ({ ...f, cadastroMetaTotal: Number(e.target.value) }))}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-emerald-400" placeholder="46" />
            </div>
            <div>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Dividida entre quantas pessoas</label>
              <input type="number" min={1} value={form.squadPessoas}
                onChange={e => setForm(f => ({ ...f, squadPessoas: Math.max(1, Number(e.target.value)) }))}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-emerald-400" placeholder="2" />
              <p className="text-[10px] text-cw-muted mt-1">
                Sua parte: {form.squadPessoas > 0 ? Math.round((form.cadastroMetaTotal / form.squadPessoas) * 10) / 10 : form.cadastroMetaTotal} representantes
              </p>
            </div>
          </div>

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

/** Modal genérico de ajuste manual (+1/-1 com motivo opcional), reusado
 *  pelos dois indicadores. */
function AjusteModal({ titulo, modo, onConfirm, onClose }: {
  titulo: string; modo: 'add' | 'sub';
  onConfirm: (qtd: number) => void; onClose: () => void;
}) {
  const [qtd, setQtd] = useState('1');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-xs mx-4 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-cw-text">{modo === 'add' ? '+ Adicionar' : '− Remover'} {titulo}</h3>
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

function TotalModal({ titulo, valorAtual, onConfirm, onClose }: {
  titulo: string; valorAtual: number;
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

/** Card de status de um indicador — mesmo layout do card principal do Meta
 *  do Mês do SDR (número grande, barra com marcador de ritmo do dia,
 *  projeção + dias restantes), só que sem Pipedrive por trás. */
function StatusCard({ icon: Icon, titulo, unidade, metric, diasRestantes, corBarra, subtitulo, onAdd, onSub, onEditar, onAbrirTotal }: {
  icon: typeof Target; titulo: string; unidade: string; metric: MetricCalc; diasRestantes: number;
  corBarra: string; subtitulo?: React.ReactNode;
  onAdd: () => void; onSub: () => void; onEditar: () => void; onAbrirTotal: () => void;
}) {
  return (
    <div className="cw-card p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-cw-purple uppercase tracking-widest">
          <Icon className="h-4 w-4" />
          {titulo}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={onSub} title={`Remover ${unidade}`}
            className="h-9 w-9 rounded-lg border border-cw-border bg-cw-elevated text-cw-muted hover:text-red-500 hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-all text-lg font-bold">
            −
          </button>
          <button onClick={onAdd} title={`Adicionar ${unidade}`}
            className="h-9 w-9 rounded-lg border border-cw-border bg-cw-elevated text-cw-muted hover:text-cw-purple hover:bg-cw-purple/10 hover:border-cw-purple/40 flex items-center justify-center transition-all text-lg font-bold">
            +
          </button>
          <button onClick={onAbrirTotal} title="Definir total manual"
            className="h-9 w-9 rounded-lg border border-cw-border bg-cw-elevated text-cw-muted hover:text-cw-purple hover:bg-cw-purple/10 hover:border-cw-purple/40 flex items-center justify-center transition-all">
            <Pencil className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-cw-border mx-0.5" />
          <span className={cn('text-xs font-black px-3 py-1 rounded-full border whitespace-nowrap',
            metric.noRitmo ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-200'
          )}>
            {metric.noRitmo ? '↗ No Ritmo' : '↘ Atrasado'}
          </span>
          <button onClick={onEditar} title="Configurar meta"
            className="h-7 w-7 rounded-lg bg-cw-elevated border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-all">
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {subtitulo}

      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-black text-cw-purple">{metric.atual}</span>
          <span className="text-xl text-cw-muted font-bold">/ {metric.meta || '?'}</span>
        </div>
        <p className={cn('text-sm font-semibold mt-1', metric.batida ? 'text-green-600' : 'text-cw-muted')}>
          {metric.meta === 0
            ? 'Defina uma meta pra acompanhar o progresso'
            : metric.batida
              ? `Meta batida! Parabéns 🏆`
              : `Faltam ${metric.falta} ${unidade}`}
        </p>

        {metric.meta > 0 && (
          <div className="mt-4">
            <div className="relative w-full h-1.5 bg-cw-border rounded-full">
              <div className={cn('absolute inset-y-0 left-0 rounded-full transition-all duration-700', corBarra)} style={{ width: `${metric.progresso}%` }} />
              {metric.ritmoHojeValor > 0 && (
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" style={{ left: `${metric.ritmoHojePct}%` }}
                  title={metric.noRitmoHoje ? 'Você está no ritmo hoje!' : 'Você deveria estar aqui hoje pra manter o ritmo'}>
                  <span className={cn('absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-md text-[10px] font-black text-white whitespace-nowrap shadow-sm',
                    metric.noRitmoHoje ? 'bg-blue-500' : 'bg-amber-500')}>
                    {Math.round(metric.ritmoHojeValor)}
                  </span>
                  <div className={cn('w-1 h-5 rounded-full ring-2 ring-white', metric.noRitmoHoje ? 'bg-blue-500' : 'bg-amber-500')} />
                </div>
              )}
            </div>
            <p className={cn('text-[10px] font-bold mt-2', metric.noRitmoHoje ? 'text-blue-600' : 'text-amber-600')}>
              {metric.noRitmoHoje ? 'Você está no ritmo hoje!' : 'Você deveria estar aqui hoje pra manter o ritmo'}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-cw-elevated rounded-xl border border-cw-border px-3 py-2.5">
          <p className="text-[10px] text-cw-muted uppercase font-bold tracking-wider">Por dia</p>
          <p className="text-base font-black text-cw-text">
            {metric.batida ? '—' : <>{metric.porDia}<span className="text-xs text-cw-muted font-normal">/dia</span></>}
          </p>
        </div>
        <div className="bg-cw-elevated rounded-xl border border-cw-border px-3 py-2.5">
          <p className="text-[10px] text-cw-muted uppercase font-bold tracking-wider">Projeção</p>
          <p className="text-base font-black text-cw-text">{metric.meta > 0 ? metric.projecao : '—'}</p>
        </div>
        <div className="bg-cw-elevated rounded-xl border border-cw-border px-3 py-2.5">
          <p className="text-[10px] text-cw-muted uppercase font-bold tracking-wider">Dias restantes</p>
          <p className="text-base font-black text-cw-text">{diasRestantes}</p>
        </div>
      </div>
    </div>
  );
}

export default function MetaMesReps() {
  const { state, update, ajustar, definirTotal, diasRestantes, cadastroMetaIndividual, agendamento, cadastro } = useRepsMetas();
  const [config, setConfig] = useState(false);
  const [ajusteModal, setAjusteModal] = useState<{ campo: 'agendamentos' | 'cadastros'; modo: 'add' | 'sub' } | null>(null);
  const [totalModal, setTotalModal] = useState<'agendamentos' | 'cadastros' | null>(null);

  const insights: { icon: React.ReactNode; texto: string; sub: string; cor: string }[] = [];
  if (agendamento.batida) insights.push({ icon: <Check className="h-4 w-4" />, texto: 'Meta de agendamentos batida!', sub: 'Performance excepcional este mês', cor: 'text-amber-600 bg-amber-50 border-amber-200' });
  if (cadastro.batida) insights.push({ icon: <Check className="h-4 w-4" />, texto: 'Meta de representantes cadastrados batida!', sub: 'Sua parte da meta do squad foi cumprida', cor: 'text-amber-600 bg-amber-50 border-amber-200' });
  if (agendamento.meta > 0 && !agendamento.noRitmo) insights.push({ icon: <AlertTriangle className="h-4 w-4" />, texto: 'Agendamentos abaixo do ritmo necessário', sub: 'No ritmo atual, dificilmente bate a meta do mês', cor: 'text-red-500 bg-red-50 border-red-200' });
  if (cadastro.meta > 0 && !cadastro.noRitmo) insights.push({ icon: <AlertTriangle className="h-4 w-4" />, texto: 'Cadastros abaixo do ritmo necessário', sub: 'No ritmo atual, dificilmente bate sua parte da meta do squad', cor: 'text-red-500 bg-red-50 border-red-200' });
  if (agendamento.meta > 0) {
    const bateMeta = agendamento.projecao >= agendamento.meta;
    insights.push({ icon: <TrendingUp className="h-4 w-4" />, texto: `Na projeção atual, você fecha o mês com ${agendamento.projecao} agendamentos`, sub: bateMeta ? `${agendamento.projecao - agendamento.meta} acima da meta (${agendamento.meta})` : `${agendamento.meta - agendamento.projecao} abaixo da meta (${agendamento.meta})`, cor: bateMeta ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-cw-purple bg-cw-purple/5 border-cw-purple/20' });
  }
  if (cadastro.meta > 0) {
    const bateMeta = cadastro.projecao >= cadastro.meta;
    insights.push({ icon: <TrendingUp className="h-4 w-4" />, texto: `Na projeção atual, você fecha o mês com ${cadastro.projecao} representantes cadastrados`, sub: bateMeta ? `${cadastro.projecao - cadastro.meta} acima da sua parte da meta (${cadastro.meta})` : `${cadastro.meta - cadastro.projecao} abaixo da sua parte da meta (${cadastro.meta})`, cor: bateMeta ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-cw-purple bg-cw-purple/5 border-cw-purple/20' });
  }

  return (
    <div className="p-8 space-y-6">
      {config && (
        <ConfigModal
          agendamentoMeta={state.agendamentoMeta}
          cadastroMetaTotal={state.cadastroMetaTotal}
          squadPessoas={state.squadPessoas}
          diasUteis={state.diasUteis}
          onSave={(v) => { update(v); setConfig(false); }}
          onClose={() => setConfig(false)}
        />
      )}
      {ajusteModal && (
        <AjusteModal
          titulo={ajusteModal.campo === 'agendamentos' ? 'agendamento(s)' : 'representante(s) cadastrado(s)'}
          modo={ajusteModal.modo}
          onConfirm={(qtd) => ajustar(ajusteModal.campo, ajusteModal.modo === 'add' ? qtd : -qtd)}
          onClose={() => setAjusteModal(null)}
        />
      )}
      {totalModal && (
        <TotalModal
          titulo={totalModal === 'agendamentos' ? 'Agendamentos' : 'Representantes Cadastrados'}
          valorAtual={totalModal === 'agendamentos' ? state.agendamentos : state.cadastros}
          onConfirm={(v) => definirTotal(totalModal, v)}
          onClose={() => setTotalModal(null)}
        />
      )}

      <StatusCard
        icon={Calendar}
        titulo="AGENDAMENTOS DO MÊS — STATUS"
        unidade="agendamento(s)"
        metric={agendamento}
        diasRestantes={diasRestantes}
        corBarra="bg-cw-purple"
        onAdd={() => setAjusteModal({ campo: 'agendamentos', modo: 'add' })}
        onSub={() => setAjusteModal({ campo: 'agendamentos', modo: 'sub' })}
        onEditar={() => setConfig(true)}
        onAbrirTotal={() => setTotalModal('agendamentos')}
      />

      <StatusCard
        icon={ClipboardCheck}
        titulo="REPRESENTANTES CADASTRADOS — STATUS"
        unidade="representante(s)"
        metric={cadastro}
        diasRestantes={diasRestantes}
        corBarra="bg-emerald-500"
        subtitulo={
          <p className="flex items-center gap-1.5 text-xs text-cw-muted -mt-2">
            <Users className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            Meta do squad: <span className="font-semibold text-cw-text">{state.cadastroMetaTotal}</span> ÷ {state.squadPessoas} pessoas = <span className="font-semibold text-cw-text">{cadastroMetaIndividual}</span> pra você
          </p>
        }
        onAdd={() => setAjusteModal({ campo: 'cadastros', modo: 'add' })}
        onSub={() => setAjusteModal({ campo: 'cadastros', modo: 'sub' })}
        onEditar={() => setConfig(true)}
        onAbrirTotal={() => setTotalModal('cadastros')}
      />

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
            <p className="text-[11px] leading-snug"><span className="font-semibold">Tudo manual:</span> use os botões +/− ou o lápis pra atualizar agendamentos e cadastros. Seus dados ficam salvos só neste navegador.</p>
          </div>
          {insights.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-cw-muted text-sm">
              Defina suas metas para ver os insights.
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
