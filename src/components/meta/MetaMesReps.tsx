/** Meta do Mês de Aquisição de Canal — mesmo layout/mecânica do Meta do Mês
 *  do SDR (src/components/meta/MetaMes.tsx: status card, barra com marcador
 *  de ritmo do dia, projeção, insights), mas SEM Pipedrive (tudo manual,
 *  localStorage) e com um único indicador: Representantes Cadastrados (meta
 *  do squad dividida entre quem recruta, ex: você + Hyorranes). */
import { useState } from 'react';
import { Settings, X, Check, TrendingUp, Calendar, Lightbulb, Pencil, AlertTriangle, Users, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRepsMetas } from '@/hooks/useRepsMetas';

function ConfigModal({ cadastroMetaTotal, squadPessoas, diasUteis, onSave, onClose }: {
  cadastroMetaTotal: number; squadPessoas: number; diasUteis: number | null;
  onSave: (v: { cadastroMetaTotal: number; squadPessoas: number; diasUteis: number | null }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ cadastroMetaTotal, squadPessoas, diasUteis });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-cw-text">Configurar Meta</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4">
          <div className="space-y-4">
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

function AjusteModal({ modo, onConfirm, onClose }: {
  modo: 'add' | 'sub';
  onConfirm: (qtd: number) => void; onClose: () => void;
}) {
  const [qtd, setQtd] = useState('1');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-xs mx-4 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-cw-text">{modo === 'add' ? '+ Adicionar' : '− Remover'} representante(s)</h3>
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

function TotalModal({ valorAtual, onConfirm, onClose }: {
  valorAtual: number;
  onConfirm: (valor: number) => void; onClose: () => void;
}) {
  const [valor, setValor] = useState(String(valorAtual));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-xs mx-4 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-cw-text">Definir total — Representantes Cadastrados</h3>
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
  const { state, update, ajustarCadastros, definirCadastros, diasRestantes, cadastroMetaIndividual, cadastro } = useRepsMetas();
  const [config, setConfig] = useState(false);
  const [ajusteModal, setAjusteModal] = useState<'add' | 'sub' | null>(null);
  const [totalModal, setTotalModal] = useState(false);

  const insights: { icon: React.ReactNode; texto: string; sub: string; cor: string }[] = [];
  if (cadastro.batida) {
    insights.push({ icon: <Check className="h-4 w-4" />, texto: 'Meta de representantes cadastrados batida!', sub: 'Sua parte da meta do squad foi cumprida', cor: 'text-amber-600 bg-amber-50 border-amber-200' });
  }
  if (cadastro.meta > 0 && !cadastro.noRitmo) {
    insights.push({ icon: <AlertTriangle className="h-4 w-4" />, texto: 'Cadastros abaixo do ritmo necessário', sub: 'No ritmo atual, dificilmente bate sua parte da meta do squad', cor: 'text-red-500 bg-red-50 border-red-200' });
  }
  if (cadastro.meta > 0) {
    const bateMeta = cadastro.projecao >= cadastro.meta;
    insights.push({
      icon: <TrendingUp className="h-4 w-4" />,
      texto: `Na projeção atual, você fecha o mês com ${cadastro.projecao} representantes cadastrados`,
      sub: bateMeta ? `${cadastro.projecao - cadastro.meta} acima da sua parte da meta (${cadastro.meta})` : `${cadastro.meta - cadastro.projecao} abaixo da sua parte da meta (${cadastro.meta})`,
      cor: bateMeta ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-cw-purple bg-cw-purple/5 border-cw-purple/20',
    });
  }

  return (
    <div className="p-8 space-y-6">
      {config && (
        <ConfigModal
          cadastroMetaTotal={state.cadastroMetaTotal}
          squadPessoas={state.squadPessoas}
          diasUteis={state.diasUteis}
          onSave={(v) => { update(v); setConfig(false); }}
          onClose={() => setConfig(false)}
        />
      )}
      {ajusteModal && (
        <AjusteModal
          modo={ajusteModal}
          onConfirm={(qtd) => ajustarCadastros(ajusteModal === 'add' ? qtd : -qtd)}
          onClose={() => setAjusteModal(null)}
        />
      )}
      {totalModal && (
        <TotalModal
          valorAtual={state.cadastros}
          onConfirm={definirCadastros}
          onClose={() => setTotalModal(false)}
        />
      )}

      {/* Card de status — Representantes Cadastrados */}
      <div className="cw-card p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cw-purple uppercase tracking-widest">
            <ClipboardCheck className="h-4 w-4" />
            REPRESENTANTES CADASTRADOS — STATUS
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setAjusteModal('sub')} title="Remover representante(s)"
              className="h-9 w-9 rounded-lg border border-cw-border bg-cw-elevated text-cw-muted hover:text-red-500 hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-all text-lg font-bold">
              −
            </button>
            <button onClick={() => setAjusteModal('add')} title="Adicionar representante(s)"
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

        <p className="flex items-center gap-1.5 text-xs text-cw-muted">
          <Users className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          Meta do squad: <span className="font-semibold text-cw-text">{state.cadastroMetaTotal}</span> ÷ {state.squadPessoas} pessoas = <span className="font-semibold text-cw-text">{cadastroMetaIndividual}</span> pra você
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
                : `Faltam ${cadastro.falta} representante(s)`}
          </p>

          {cadastro.meta > 0 && (
            <div className="mt-4">
              <div className="relative w-full h-1.5 bg-cw-border rounded-full">
                <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 bg-emerald-500" style={{ width: `${cadastro.progresso}%` }} />
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
              <p className={cn('text-[10px] font-bold mt-2', cadastro.noRitmoHoje ? 'text-blue-600' : 'text-amber-600')}>
                {cadastro.noRitmoHoje ? 'Você está no ritmo hoje!' : 'Você deveria estar aqui hoje pra manter o ritmo'}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-cw-elevated rounded-xl border border-cw-border px-3 py-2.5">
            <p className="text-[10px] text-cw-muted uppercase font-bold tracking-wider">Por dia</p>
            <p className="text-base font-black text-cw-text">
              {cadastro.batida ? '—' : <>{cadastro.porDia}<span className="text-xs text-cw-muted font-normal">/dia</span></>}
            </p>
          </div>
          <div className="bg-cw-elevated rounded-xl border border-cw-border px-3 py-2.5">
            <p className="text-[10px] text-cw-muted uppercase font-bold tracking-wider">Projeção</p>
            <p className="text-base font-black text-cw-text">{cadastro.meta > 0 ? cadastro.projecao : '—'}</p>
          </div>
          <div className="bg-cw-elevated rounded-xl border border-cw-border px-3 py-2.5">
            <p className="text-[10px] text-cw-muted uppercase font-bold tracking-wider">Dias restantes</p>
            <p className="text-base font-black text-cw-text">{diasRestantes}</p>
          </div>
        </div>

        <div className="flex justify-end -mb-2">
          <img src="/onca-andando.gif" alt="" className="h-14 md:h-16 object-contain opacity-90 select-none" />
        </div>
      </div>

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
            <p className="text-[11px] leading-snug"><span className="font-semibold">Tudo manual:</span> use os botões +/− ou o lápis pra atualizar seus cadastros. Seus dados ficam salvos só neste navegador.</p>
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
