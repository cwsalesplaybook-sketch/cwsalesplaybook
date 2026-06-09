/** Calculadora de Planos CW — comparativo de cenários. */
import { useState } from 'react';
import { Calculator, Minus, Plus, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PLANOS, PERIODOS, MODULOS, PLANOS_PRECO, MODULOS_PRECO,
  PERIODO_MESES, MODULO_TOTEM_POR_DISPOSITIVO,
  type Plano, type Periodo, type ModuloKey,
} from '@/data/calculadora';

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcTotal(plano: Plano, periodo: Periodo, modulos: Set<ModuloKey>, totem: boolean, totemQtd: number) {
  const base    = PLANOS_PRECO[plano][periodo];
  const modTotal  = [...modulos].reduce((acc, m) => acc + MODULOS_PRECO[m][periodo].total,  0);
  const modMensal = [...modulos].reduce((acc, m) => acc + MODULOS_PRECO[m][periodo].mensal, 0);
  const totemM    = totem ? totemQtd * MODULO_TOTEM_POR_DISPOSITIVO : 0;
  const totemT    = totemM * PERIODO_MESES[periodo];
  return {
    mensal: base.mensal + modMensal + totemM,
    total:  base.total  + modTotal  + totemT,
  };
}

const PERIODO_LABEL: Record<Periodo, string> = {
  Mensal: 'Mensal', Trimestral: 'Trimestral', Semestral: 'Semestral', Anual: 'Anual',
};

export default function Calculadora() {
  const [plano, setPlano]       = useState<Plano>('Delivery');
  const [modulos, setModulos]   = useState<Set<ModuloKey>>(new Set());
  const [totem, setTotem]       = useState(false);
  const [totemQtd, setTotemQtd] = useState(1);
  const [periodoA, setPeriodoA] = useState<Periodo | null>(null);
  const [periodoB, setPeriodoB] = useState<Periodo | null>(null);

  const toggleModulo = (m: ModuloKey) =>
    setModulos(prev => { const n = new Set(prev); n.has(m) ? n.delete(m) : n.add(m); return n; });

  const resultA = periodoA ? calcTotal(plano, periodoA, modulos, totem, totemQtd) : null;
  const resultB = periodoB ? calcTotal(plano, periodoB, modulos, totem, totemQtd) : null;

  const economia = resultA && resultB
    ? Math.abs(resultA.total - resultB.total)
    : null;
  const maisBarato = resultA && resultB
    ? (resultA.total < resultB.total ? 'A' : 'B')
    : null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
          <Calculator className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-cw-text tracking-tight">Calculadora de Planos</h1>
          <p className="text-sm text-cw-muted mt-0.5">Monte e compare propostas para o cliente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ── Coluna esquerda: configuração ── */}
        <div className="cw-card p-6 space-y-6">

          {/* Plano */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-2">Escolha o plano</p>
            <select
              value={plano}
              onChange={e => setPlano(e.target.value as Plano)}
              className="w-full bg-cw-bg border border-cw-border rounded-xl px-4 py-2.5 text-sm font-semibold text-cw-text focus:outline-none focus:border-cw-purple cursor-pointer"
            >
              {PLANOS.map(p => (
                <option key={p} value={p}>Plano {p}</option>
              ))}
            </select>
          </div>

          {/* Períodos — grade 2×2 */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-3">Fidelidade / preços</p>
            <div className="grid grid-cols-2 gap-3">
              {PERIODOS.map(p => {
                const preco = calcTotal(plano, p, modulos, totem, totemQtd);
                const isA = periodoA === p;
                const isB = periodoB === p;
                return (
                  <div
                    key={p}
                    className={cn(
                      'rounded-xl border p-4 transition-all',
                      isA ? 'border-cw-purple bg-cw-purple/8'
                        : isB ? 'border-[#59327A] bg-[#59327A]/8'
                        : 'border-cw-border bg-cw-bg hover:border-cw-purple/40'
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted">{p}</p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setPeriodoA(isA ? null : p)}
                          className={cn(
                            'text-[9px] font-black px-1.5 py-0.5 rounded border transition-all',
                            isA
                              ? 'bg-cw-purple text-white border-cw-purple'
                              : 'border-cw-border text-cw-muted hover:border-cw-purple hover:text-cw-purple'
                          )}
                        >
                          A
                        </button>
                        <button
                          onClick={() => setPeriodoB(isB ? null : p)}
                          className={cn(
                            'text-[9px] font-black px-1.5 py-0.5 rounded border transition-all',
                            isB
                              ? 'bg-[#59327A] text-white border-[#59327A]'
                              : 'border-cw-border text-cw-muted hover:border-[#59327A] hover:text-[#59327A]'
                          )}
                        >
                          B
                        </button>
                      </div>
                    </div>
                    <p className="text-xl font-black text-cw-purple">{fmt(preco.total)}</p>
                    <p className="text-xs text-cw-muted mt-0.5">({fmt(preco.mensal)}/mês)</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Módulos */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-3">Módulos adicionais</p>
            <div className="space-y-1.5">
              {MODULOS.map(m => {
                const ativo = modulos.has(m);
                return (
                  <button
                    key={m}
                    onClick={() => toggleModulo(m)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all',
                      ativo ? 'border-cw-purple bg-cw-purple/5' : 'border-cw-border hover:border-cw-purple/40'
                    )}
                  >
                    <div className={cn(
                      'h-4 w-4 rounded border-2 shrink-0 flex items-center justify-center transition-all',
                      ativo ? 'bg-cw-purple border-cw-purple' : 'border-cw-border'
                    )}>
                      {ativo && <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className={cn('flex-1 text-sm font-semibold', ativo ? 'text-cw-text' : 'text-cw-muted')}>{m}</span>
                    <span className={cn('text-sm font-bold shrink-0', ativo ? 'text-cw-purple' : 'text-cw-muted')}>
                      {fmt(MODULOS_PRECO[m]['Mensal'].mensal)}
                    </span>
                  </button>
                );
              })}

              {/* Totem */}
              <div className={cn(
                'rounded-xl border transition-all',
                totem ? 'border-cw-purple bg-cw-purple/5' : 'border-cw-border'
              )}>
                <button
                  onClick={() => setTotem(v => !v)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                >
                  <div className={cn(
                    'h-4 w-4 rounded border-2 shrink-0 flex items-center justify-center transition-all',
                    totem ? 'bg-cw-purple border-cw-purple' : 'border-cw-border'
                  )}>
                    {totem && <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className={cn('flex-1 text-sm font-semibold', totem ? 'text-cw-text' : 'text-cw-muted')}>
                    Totem de Autoatendimento
                  </span>
                  <span className={cn('text-sm font-bold shrink-0', totem ? 'text-cw-purple' : 'text-cw-muted')}>
                    {fmt(MODULO_TOTEM_POR_DISPOSITIVO)}/disp.
                  </span>
                </button>
                {totem && (
                  <div className="px-4 pb-3 flex items-center gap-3 border-t border-cw-purple/15 pt-2.5">
                    <span className="text-xs text-cw-muted flex-1">Quantidade de dispositivos</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setTotemQtd(q => Math.max(1, q - 1))}
                        className="h-7 w-7 rounded-lg border border-cw-border flex items-center justify-center hover:bg-cw-elevated transition-colors">
                        <Minus className="h-3 w-3 text-cw-text" />
                      </button>
                      <span className="w-6 text-center text-sm font-black text-cw-text">{totemQtd}</span>
                      <button onClick={() => setTotemQtd(q => q + 1)}
                        className="h-7 w-7 rounded-xl gradient-primary flex items-center justify-center">
                        <Plus className="h-3 w-3 text-white" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-cw-purple w-20 text-right">
                      {fmt(totemQtd * MODULO_TOTEM_POR_DISPOSITIVO)}/mês
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Coluna direita: comparativo ── */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted">Comparativo de cenários</p>

          {/* Cenário A */}
          <div className={cn(
            'cw-card p-5 min-h-[200px] flex flex-col border-2 transition-all',
            periodoA ? 'border-cw-purple' : 'border-cw-border'
          )}>
            <p className="text-xs font-black text-cw-text uppercase tracking-widest mb-0.5">Cenário A</p>
            {periodoA ? (
              <>
                <p className="text-xs text-cw-muted mb-4">
                  {plano} · {PERIODO_LABEL[periodoA]}
                  {modulos.size > 0 && ` + ${modulos.size} módulo${modulos.size > 1 ? 's' : ''}`}
                  {totem && ` + Totem (${totemQtd}×)`}
                </p>
                <div className="space-y-1.5 flex-1">
                  {[...modulos].map(m => (
                    <div key={m} className="flex justify-between text-xs text-cw-muted">
                      <span>{m}</span>
                      <span>{fmt(MODULOS_PRECO[m][periodoA].mensal)}/mês</span>
                    </div>
                  ))}
                  {totem && (
                    <div className="flex justify-between text-xs text-cw-muted">
                      <span>Totem ({totemQtd}×)</span>
                      <span>{fmt(totemQtd * MODULO_TOTEM_POR_DISPOSITIVO)}/mês</span>
                    </div>
                  )}
                </div>
                <div className="mt-auto pt-4 border-t border-cw-border flex items-end justify-between">
                  <span className="text-xs text-cw-muted">{fmt(resultA!.mensal)}/mês</span>
                  <span className="text-3xl font-black text-cw-purple">{fmt(resultA!.total)}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-cw-muted mt-2">Selecione o período <span className="font-black text-cw-purple">A</span> nos cards ao lado...</p>
            )}
          </div>

          {/* Cenário B */}
          <div className={cn(
            'cw-card p-5 min-h-[200px] flex flex-col border-2 transition-all',
            periodoB ? 'border-[#59327A]' : 'border-cw-border'
          )}>
            <p className="text-xs font-black text-cw-text uppercase tracking-widest mb-0.5">Cenário B</p>
            {periodoB ? (
              <>
                <p className="text-xs text-cw-muted mb-4">
                  {plano} · {PERIODO_LABEL[periodoB]}
                  {modulos.size > 0 && ` + ${modulos.size} módulo${modulos.size > 1 ? 's' : ''}`}
                  {totem && ` + Totem (${totemQtd}×)`}
                </p>
                <div className="space-y-1.5 flex-1">
                  {[...modulos].map(m => (
                    <div key={m} className="flex justify-between text-xs text-cw-muted">
                      <span>{m}</span>
                      <span>{fmt(MODULOS_PRECO[m][periodoB].mensal)}/mês</span>
                    </div>
                  ))}
                  {totem && (
                    <div className="flex justify-between text-xs text-cw-muted">
                      <span>Totem ({totemQtd}×)</span>
                      <span>{fmt(totemQtd * MODULO_TOTEM_POR_DISPOSITIVO)}/mês</span>
                    </div>
                  )}
                </div>
                <div className="mt-auto pt-4 border-t border-cw-border flex items-end justify-between">
                  <span className="text-xs text-cw-muted">{fmt(resultB!.mensal)}/mês</span>
                  <span className="text-3xl font-black text-[#59327A]">{fmt(resultB!.total)}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-cw-muted mt-2">Selecione o período <span className="font-black text-[#59327A]">B</span> nos cards ao lado...</p>
            )}
          </div>

          {/* Botão comparar */}
          {economia !== null ? (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-5 py-4 flex items-center gap-3">
              <TrendingDown className="h-5 w-5 text-emerald-400 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  Cenário {maisBarato} é mais barato
                </p>
                <p className="text-lg font-black text-emerald-300">
                  Economia de {fmt(economia)}
                </p>
              </div>
            </div>
          ) : (
            <button
              disabled
              className="w-full py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400/60 text-sm font-bold cursor-default"
            >
              Selecione os cenários A e B para comparar economia
            </button>
          )}

          <p className="text-[10px] text-cw-muted leading-relaxed">
            * Módulo Fiscal e Roteirização de Entregas podem ter valores excedentes — consulte o CSM.
          </p>
        </div>
      </div>
    </div>
  );
}
