/** Módulos — mesma mecânica e visual de "Progresso das Metas", mas em
 *  unidades: Meta 1/2/3 Módulos comparadas contra a mesma quantidade feita. */
import { useState } from 'react';
import { Package, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MetaCalculo } from '@/hooks/useCloserMetas';

function ModuloProgressoCard({ idx, alvo, progresso, falta, porDia, batida }: {
  idx: number; alvo: number; progresso: number; falta: number; porDia: number; batida: boolean;
}) {
  const cor = idx === 0 ? 'text-cw-purple-light' : idx === 1 ? 'text-emerald-400' : 'text-cw-yellow';
  const bar = idx === 0 ? 'bg-cw-purple' : idx === 1 ? 'bg-emerald-400' : 'bg-cw-yellow';
  return (
    <div className="cw-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-bold text-sm text-cw-text">Meta {idx + 1} Módulos</p>
        <p className={cn('text-sm font-black', cor)}>{progresso.toFixed(0)}%</p>
      </div>
      <div className="h-1.5 rounded-full bg-cw-elevated overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', bar)} style={{ width: `${Math.min(100, progresso)}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-cw-muted">Meta</p>
          <p className="text-cw-text font-semibold">{alvo} un</p>
        </div>
        <div>
          <p className="text-cw-muted">Falta</p>
          <p className="text-cw-text font-semibold">{falta} un</p>
        </div>
      </div>
      <div className="border-t border-cw-border pt-2">
        <p className="text-cw-muted text-xs">Por dia</p>
        <p className={cn('font-black', batida ? 'text-emerald-400' : 'text-cw-text')}>
          {batida ? 'Meta batida! 🎉' : `${porDia.toFixed(1)} un/dia`}
        </p>
      </div>
    </div>
  );
}

function ConfigModulosModal({ moduloMeta1, moduloMeta2, moduloMeta3, moduloConquistado, onSave, onClose }: {
  moduloMeta1: number; moduloMeta2: number; moduloMeta3: number; moduloConquistado: number;
  onSave: (v: { moduloMeta1: number; moduloMeta2: number; moduloMeta3: number; moduloConquistado: number }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ moduloMeta1, moduloMeta2, moduloMeta3, moduloConquistado });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cw-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-cw-text">Configurar Módulos</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4">
          {([1, 2, 3] as const).map(n => (
            <div key={n}>
              <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Meta {n} Módulos (un)</label>
              <input
                type="number" min={0}
                value={(form as any)[`moduloMeta${n}`]}
                onChange={e => setForm(f => ({ ...f, [`moduloMeta${n}`]: Number(e.target.value) }))}
                className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple"
                placeholder="0"
              />
            </div>
          ))}
          <div className="border-t border-cw-border pt-4">
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider mb-1.5 block">Módulos Feitos (un)</label>
            <input
              type="number" min={0}
              value={form.moduloConquistado}
              onChange={e => setForm(f => ({ ...f, moduloConquistado: Number(e.target.value) }))}
              className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple"
              placeholder="0"
            />
          </div>
        </div>
        <button
          onClick={() => onSave(form)}
          className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white gradient-primary transition-opacity hover:opacity-90"
        >
          Salvar módulos
        </button>
      </div>
    </div>
  );
}

export function ModulosSection({ moduloMeta1, moduloMeta2, moduloMeta3, moduloConquistado, moduloMetas, onSave }: {
  moduloMeta1: number; moduloMeta2: number; moduloMeta3: number; moduloConquistado: number;
  moduloMetas: MetaCalculo[];
  onSave: (v: { moduloMeta1: number; moduloMeta2: number; moduloMeta3: number; moduloConquistado: number }) => void;
}) {
  const [configOpen, setConfigOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-cw-purple" />
          <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest">Módulos <span className="text-cw-muted normal-case font-medium">(unidades)</span></p>
        </div>
        <button onClick={() => setConfigOpen(true)} title="Configurar módulos"
          className="h-7 w-7 rounded-lg bg-cw-elevated border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 flex items-center justify-center transition-all">
          <Settings className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {moduloMetas.map((m, i) => (
          <ModuloProgressoCard key={i} idx={i} alvo={m.valor} progresso={m.progresso} falta={m.falta} porDia={m.porDia} batida={m.batida} />
        ))}
      </div>

      {configOpen && (
        <ConfigModulosModal
          moduloMeta1={moduloMeta1} moduloMeta2={moduloMeta2} moduloMeta3={moduloMeta3} moduloConquistado={moduloConquistado}
          onSave={(v) => { onSave(v); setConfigOpen(false); }}
          onClose={() => setConfigOpen(false)}
        />
      )}
    </div>
  );
}
