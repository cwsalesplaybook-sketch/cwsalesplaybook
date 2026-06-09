/** Calculadora de Planos CW — ferramenta interna para fechamento. */
import { useState } from 'react';
import { Calculator, Check, Minus, Plus, Copy, CheckCircle2, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PLANOS, PERIODOS, MODULOS, PLANOS_PRECO, MODULOS_PRECO,
  PERIODO_MESES, MODULO_TOTEM_POR_DISPOSITIVO,
  type Plano, type Periodo, type ModuloKey,
} from '@/data/calculadora';

const PLANO_DESC: Record<Plano, string> = {
  Mesas:    'Gestão de mesas e atendimento presencial',
  Delivery: 'Delivery online e pedidos digitais',
  Premium:  'Completo: mesas + delivery + recursos avançados',
};

const PERIODO_BADGE: Partial<Record<Periodo, string>> = {
  Anual: 'Melhor preço',
};

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Calculadora() {
  const [plano, setPlano]           = useState<Plano>('Delivery');
  const [periodo, setPeriodo]       = useState<Periodo>('Anual');
  const [modulos, setModulos]       = useState<Set<ModuloKey>>(new Set());
  const [totem, setTotemAtivo]      = useState(false);
  const [totemQtd, setTotemQtd]     = useState(1);
  const [copied, setCopied]         = useState(false);

  const toggleModulo = (m: ModuloKey) =>
    setModulos(prev => { const next = new Set(prev); next.has(m) ? next.delete(m) : next.add(m); return next; });

  const meses = PERIODO_MESES[periodo];
  const baseMensal = PLANOS_PRECO[plano][periodo].mensal;
  const baseTotal  = PLANOS_PRECO[plano][periodo].total;

  const modulosMensal = [...modulos].reduce((acc, m) => acc + MODULOS_PRECO[m][periodo].mensal, 0);
  const modulosTotal  = [...modulos].reduce((acc, m) => acc + MODULOS_PRECO[m][periodo].total,  0);

  const totemMensal = totem ? totemQtd * MODULO_TOTEM_POR_DISPOSITIVO : 0;
  const totemTotal  = totemMensal * meses;

  const totalMensal = baseMensal + modulosMensal + totemMensal;
  const totalGeral  = baseTotal  + modulosTotal  + totemTotal;

  // Economia vs mensal puro
  const mensalPuro = PLANOS_PRECO[plano]['Mensal'].mensal
    + [...modulos].reduce((acc, m) => acc + MODULOS_PRECO[m]['Mensal'].mensal, 0)
    + totemMensal;
  const economiaMensal = mensalPuro * meses - totalGeral;

  const copyResumo = () => {
    const modulosText = modulos.size > 0 || totem
      ? '\n\nMódulos:\n' + [...modulos].map(m => `• ${m}: ${fmt(MODULOS_PRECO[m][periodo].mensal)}/mês`).join('\n')
        + (totem ? `\n• Totem (${totemQtd}x): ${fmt(totemMensal)}/mês` : '')
      : '';

    const text = `Proposta CW — ${plano} ${periodo}${modulosText}

Mensalidade: ${fmt(totalMensal)}/mês
Valor total (${meses} meses): ${fmt(totalGeral)}${economiaMensal > 0.01 ? `\nEconomia vs mensal: ${fmt(economiaMensal)}` : ''}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-cw-text tracking-tight">Calculadora de Planos</h1>
            <p className="text-sm text-cw-muted mt-0.5">Monte a proposta ideal para o cliente</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Coluna de configuração */}
        <div className="lg:col-span-3 space-y-6">

          {/* 1. Plano base */}
          <div className="cw-card p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-cw-muted">1. Plano base</p>
            <div className="grid grid-cols-3 gap-2">
              {PLANOS.map(p => (
                <button
                  key={p}
                  onClick={() => setPlano(p)}
                  className={cn(
                    'relative rounded-xl border p-3 text-left transition-all',
                    plano === p
                      ? 'border-cw-purple bg-cw-purple/10 ring-1 ring-cw-purple'
                      : 'border-cw-border bg-cw-bg hover:border-cw-purple/40'
                  )}
                >
                  {plano === p && (
                    <span className="absolute top-2 right-2 h-4 w-4 rounded-full gradient-primary flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </span>
                  )}
                  <p className="font-bold text-sm text-cw-text">{p}</p>
                  <p className="text-[10px] text-cw-muted leading-snug mt-0.5">{PLANO_DESC[p]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Período */}
          <div className="cw-card p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-cw-muted">2. Fidelidade</p>
            <div className="grid grid-cols-4 gap-2">
              {PERIODOS.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={cn(
                    'relative rounded-xl border py-2.5 px-2 text-center transition-all',
                    periodo === p
                      ? 'border-cw-purple bg-cw-purple/10 ring-1 ring-cw-purple'
                      : 'border-cw-border bg-cw-bg hover:border-cw-purple/40'
                  )}
                >
                  {PERIODO_BADGE[p] && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-cw-yellow text-[#1a0020] whitespace-nowrap">
                      {PERIODO_BADGE[p]}
                    </span>
                  )}
                  <p className={cn('text-xs font-semibold', periodo === p ? 'text-cw-purple' : 'text-cw-text')}>{p}</p>
                  <p className="text-[10px] text-cw-muted mt-0.5">{PERIODO_MESES[p]}x</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Módulos */}
          <div className="cw-card p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-cw-muted">3. Módulos adicionais</p>
            <div className="space-y-2">
              {MODULOS.map(m => {
                const ativo = modulos.has(m);
                const preco = MODULOS_PRECO[m][periodo];
                return (
                  <button
                    key={m}
                    onClick={() => toggleModulo(m)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                      ativo
                        ? 'border-cw-purple bg-cw-purple/8'
                        : 'border-cw-border bg-cw-bg hover:border-cw-purple/30'
                    )}
                  >
                    <div className={cn(
                      'h-5 w-5 rounded flex items-center justify-center shrink-0 border transition-all',
                      ativo ? 'gradient-primary border-transparent' : 'border-cw-border bg-cw-elevated'
                    )}>
                      {ativo && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="flex-1 text-sm font-medium text-cw-text">{m}</span>
                    <div className="text-right shrink-0">
                      <p className={cn('text-sm font-bold', ativo ? 'text-cw-purple' : 'text-cw-muted')}>
                        {fmt(preco.mensal)}<span className="text-[10px] font-normal">/mês</span>
                      </p>
                      {periodo !== 'Mensal' && (
                        <p className="text-[10px] text-cw-muted">{fmt(preco.total)} total</p>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Totem */}
              <div className={cn(
                'rounded-xl border transition-all',
                totem ? 'border-cw-purple bg-cw-purple/8' : 'border-cw-border bg-cw-bg'
              )}>
                <button
                  onClick={() => setTotemAtivo(v => !v)}
                  className="w-full flex items-center gap-3 p-3 text-left"
                >
                  <div className={cn(
                    'h-5 w-5 rounded flex items-center justify-center shrink-0 border transition-all',
                    totem ? 'gradient-primary border-transparent' : 'border-cw-border bg-cw-elevated'
                  )}>
                    {totem && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <Monitor className="h-4 w-4 text-cw-muted shrink-0" />
                  <span className="flex-1 text-sm font-medium text-cw-text">Totem de Autoatendimento</span>
                  <div className="text-right shrink-0">
                    <p className={cn('text-sm font-bold', totem ? 'text-cw-purple' : 'text-cw-muted')}>
                      {fmt(MODULO_TOTEM_POR_DISPOSITIVO)}<span className="text-[10px] font-normal">/dispositivo</span>
                    </p>
                  </div>
                </button>

                {totem && (
                  <div className="px-3 pb-3 flex items-center gap-3 border-t border-cw-purple/20 pt-2">
                    <span className="text-xs text-cw-muted flex-1">Quantidade de dispositivos:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTotemQtd(q => Math.max(1, q - 1))}
                        className="h-7 w-7 rounded-lg border border-cw-border flex items-center justify-center hover:bg-cw-elevated transition-colors"
                      >
                        <Minus className="h-3 w-3 text-cw-text" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-cw-text">{totemQtd}</span>
                      <button
                        onClick={() => setTotemQtd(q => q + 1)}
                        className="h-7 w-7 rounded-lg border border-cw-purple/50 gradient-primary flex items-center justify-center"
                      >
                        <Plus className="h-3 w-3 text-white" />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-cw-purple w-24 text-right">
                      {fmt(totemMensal)}/mês
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Coluna de resultado */}
        <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl overflow-hidden border border-cw-purple/30"
            style={{ background: 'linear-gradient(160deg, #20092F 0%, #2d1760 100%)' }}
          >
            {/* Header do resultado */}
            <div className="px-5 pt-5 pb-4 border-b border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#b89fd4]">Proposta</p>
              <p className="text-lg font-black text-white mt-0.5">{plano} · {periodo}</p>
              {periodo !== 'Mensal' && (
                <p className="text-[11px] text-[#9b6fc4] mt-0.5">{PERIODO_MESES[periodo]} meses de contrato</p>
              )}
            </div>

            {/* Valores */}
            <div className="px-5 py-4 space-y-3">
              {/* Plano base */}
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-[#b89fd4]">Plano {plano}</span>
                <span className="text-[12px] font-semibold text-white">{fmt(baseMensal)}/mês</span>
              </div>

              {/* Módulos ativos */}
              {[...modulos].map(m => (
                <div key={m} className="flex justify-between items-center">
                  <span className="text-[12px] text-[#b89fd4]">{m}</span>
                  <span className="text-[12px] font-semibold text-white">{fmt(MODULOS_PRECO[m][periodo].mensal)}/mês</span>
                </div>
              ))}
              {totem && (
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-[#b89fd4]">Totem ({totemQtd}×)</span>
                  <span className="text-[12px] font-semibold text-white">{fmt(totemMensal)}/mês</span>
                </div>
              )}

              {/* Separador */}
              <div className="border-t border-white/10 pt-3 mt-1 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] text-[#9b6fc4] uppercase tracking-wider">Mensalidade</span>
                  <span className="text-2xl font-black text-white">{fmt(totalMensal)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] text-[#9b6fc4] uppercase tracking-wider">Total {periodo.toLowerCase()}</span>
                  <span className="text-base font-bold text-[#b89fd4]">{fmt(totalGeral)}</span>
                </div>
              </div>

              {/* Economia */}
              {economiaMensal > 0.01 && (
                <div className="mt-2 rounded-xl bg-cw-yellow/15 border border-cw-yellow/30 px-3 py-2.5 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cw-yellow shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-cw-yellow uppercase tracking-wider">Economia vs mensal</p>
                    <p className="text-[13px] font-black text-cw-yellow">{fmt(economiaMensal)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Botão copiar */}
            <div className="px-5 pb-5">
              <button
                onClick={copyResumo}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold transition-all"
              >
                {copied
                  ? <><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Copiado!</>
                  : <><Copy className="h-4 w-4" /> Copiar proposta</>
                }
              </button>
            </div>
          </div>

          {/* Aviso fiscal */}
          <p className="text-[10px] text-cw-muted leading-relaxed px-1">
            * Módulo Fiscal e Roteirização de Entregas podem ter valores excedentes — consulte o CSM.
          </p>
        </div>
      </div>
    </div>
  );
}
