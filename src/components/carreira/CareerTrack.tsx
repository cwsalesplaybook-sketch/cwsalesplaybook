/** Trilha de carreira com evolução salarial visual.
 *  Mostra: barras comparativas de OTE, cards expansíveis por nível,
 *  tabela de comissões por meta e critérios de elegibilidade.
 *  Tudo editável no Modo Gestor (níveis, faixas, valores, critérios). */
import { useState } from 'react';
import { Star, TrendingUp, Wallet, Target, ChevronDown, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NIVEIS, NIVEL_ORDER, brl } from '@/data/carreira';
import { cn } from '@/lib/utils';
import type { NivelCarreira } from '@/types';
import { EditableText } from '@/admin/EditableText';
import { useEditableContent, useContentStore } from '@/store/contentStore';
import { useEditor } from '@/admin/EditorContext';
import { toast } from '@/hooks/use-toast';

type Tier = 'jr' | 'pl' | 'sr';

const tierStyles: Record<Tier, { btn: string; ring: string; bar: string; label: string }> = {
  jr: {
    btn: 'gradient-primary text-white border-cw-purple/60 shadow-lg shadow-cw-purple/20',
    ring: 'ring-cw-purple/40',
    bar: 'bg-gradient-to-r from-cw-purple to-cw-purple-light',
    label: 'text-cw-purple-light',
  },
  pl: {
    btn: 'gradient-hot text-white border-cw-red/60 shadow-lg shadow-cw-red/20',
    ring: 'ring-cw-red/40',
    bar: 'bg-gradient-to-r from-cw-red to-cw-orange',
    label: 'text-cw-orange',
  },
  sr: {
    btn: 'gradient-gold text-cw-purple-dark border-cw-yellow/60 shadow-lg shadow-cw-yellow/20',
    ring: 'ring-cw-yellow/40',
    bar: 'bg-gradient-to-r from-cw-yellow to-amber-300',
    label: 'text-cw-yellow',
  },
};

const tierOf = (id: string): Tier =>
  id.startsWith('jr') ? 'jr' : id.startsWith('pl') ? 'pl' : 'sr';

const STORE_KEY = 'carreira.niveis';

export function CareerTrack() {
  const { isEditing } = useEditor();
  const niveis = useEditableContent<NivelCarreira[]>(STORE_KEY, NIVEIS);
  const saveOverride = useContentStore((s) => s.saveOverride);
  const [selected, setSelected] = useState<NivelCarreira | null>(null);
  const [expanded, setExpanded] = useState<string | null>(niveis[0]?.id ?? 'jr1');

  const update = async (next: NivelCarreira[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) { toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };

  const removeNivel = (id: string) => update(niveis.filter((n) => n.id !== id));
  const addNivel = () => {
    const id = `novo-${Date.now()}`;
    update([...niveis, {
      id, nome: 'NOVO', baseSalarial: 0,
      faixas: [{
        nome: 'Faixa 1 — Base', criterioElegibilidade: 'Critério.',
        meta1: { percentual: 0.2, valor: 0, ote: 0 },
        meta2: { percentual: 0.25, valor: 0, ote: 0 },
        meta3: { percentual: 0.3, valor: 0, ote: 0 },
      }],
    }]);
  };

  const updateField = (idx: number, patch: Partial<NivelCarreira>) => {
    const next = niveis.map((n, i) => i === idx ? { ...n, ...patch } : n);
    update(next);
  };

  const ordered = NIVEL_ORDER
    .map((id) => niveis.find((n) => n.id === id))
    .filter((n): n is NivelCarreira => !!n)
    .concat(niveis.filter((n) => !NIVEL_ORDER.includes(n.id)));

  const maxOte = Math.max(
    1,
    ...ordered.flatMap((n) => n.faixas.flatMap((f) => [f.meta1?.ote, f.meta2?.ote, f.meta3?.ote])).filter((v): v is number => !!v)
  );

  return (
    <>
      {/* === TRILHA HORIZONTAL DE BOTÕES === */}
      <div className="cw-card p-6 overflow-x-auto scrollbar-cw mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs uppercase tracking-wider text-cw-muted">Clique em qualquer nível para ver os critérios completos</p>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full gradient-primary" /> Junior</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full gradient-hot" /> Pleno</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full gradient-gold" /> Senior</span>
          </div>
        </div>
        <div className="flex items-center gap-2 min-w-max">
          {ordered.map((n, i) => {
            const t = tierOf(n.id);
            const styles = tierStyles[t];
            return (
              <div key={n.id} className="flex items-center gap-2">
                <button
                  onClick={() => setSelected(n)}
                  className={cn(
                    'min-w-[100px] px-4 py-3 rounded-xl border-2 font-bold transition-all hover:scale-105 hover:brightness-110 flex flex-col items-center gap-1',
                    styles.btn,
                  )}
                >
                  <span>{n.nome}</span>
                  {n.baseSalarial != null && n.baseSalarial > 0 && (
                    <span className="text-[10px] font-medium opacity-80">{brl(n.baseSalarial)}</span>
                  )}
                </button>
                {i < ordered.length - 1 && (
                  <div className="h-[2px] w-6 gradient-primary" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* === EVOLUÇÃO SALARIAL === */}
      <div className="cw-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-5 w-5 text-cw-yellow" />
          <h3 className="text-lg font-bold">
            <EditableText storeKey="carreira.evolucao.titulo" defaultValue="Evolução de OTE (Salário + Comissão na Meta 3)" className="text-lg font-bold" />
          </h3>
        </div>
        <p className="text-sm text-cw-muted mb-5">
          <EditableText
            storeKey="carreira.evolucao.subtitulo"
            defaultValue="Comparativo do potencial total mensal por nível, considerando a faixa Estrela ⭐ com Meta 3 batida."
            multiline
            className="text-sm"
          />
        </p>

        <div className="space-y-3">
          {ordered.map((n) => {
            const t = tierOf(n.id);
            const styles = tierStyles[t];
            const estrela = n.faixas[1] ?? n.faixas[0];
            const ote = estrela?.meta3?.ote ?? 0;
            const pct = (ote / maxOte) * 100;
            return (
              <div key={n.id} className="grid grid-cols-[60px_1fr_120px] items-center gap-3">
                <span className={cn('font-bold text-sm', styles.label)}>{n.nome}</span>
                <div className="relative h-7 rounded-md bg-cw-bg border border-cw-border overflow-hidden">
                  <div
                    className={cn('h-full transition-all duration-700 ease-out flex items-center justify-end pr-2', styles.bar)}
                    style={{ width: `${pct}%` }}
                  >
                    <span className="text-[10px] font-bold text-cw-purple-dark">⭐ Meta 3</span>
                  </div>
                </div>
                <span className="text-right font-mono font-semibold text-cw-text">{brl(ote)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* === CARDS EXPANSÍVEIS === */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cw-muted">Tabela completa de comissões e critérios</h3>
          {isEditing && (
            <Button size="sm" variant="outline" onClick={addNivel} className="border-dashed border-cw-purple-light/40 text-cw-purple-light h-8">
              <Plus className="h-3.5 w-3.5 mr-1" /> Nível
            </Button>
          )}
        </div>
        {ordered.map((n) => {
          const idxInList = niveis.findIndex((x) => x.id === n.id);
          const t = tierOf(n.id);
          const styles = tierStyles[t];
          const isOpen = expanded === n.id;
          return (
            <div
              key={n.id}
              className={cn(
                'cw-card overflow-hidden transition-all relative group/lvl',
                isOpen && `ring-2 ${styles.ring}`,
              )}
            >
              {isEditing && (
                <button
                  onClick={() => removeNivel(n.id)}
                  className="absolute top-2 right-12 z-10 h-7 w-7 rounded bg-cw-red/15 text-cw-red border border-cw-red/30 hover:bg-cw-red/25 flex items-center justify-center opacity-0 group-hover/lvl:opacity-100"
                  title="Remover nível"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                onClick={() => setExpanded(isOpen ? null : n.id)}
                className="w-full p-5 flex items-center justify-between gap-4 hover:bg-cw-bg/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center font-bold text-sm', styles.btn)}>
                    {n.nome}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-3.5 w-3.5 text-cw-muted" />
                      <span className="text-sm text-cw-muted">Base salarial:</span>
                      <span className="font-bold text-cw-text">{n.baseSalarial ? brl(n.baseSalarial) : '—'}</span>
                    </div>
                    <p className="text-xs text-cw-muted mt-0.5">
                      OTE estrela em Meta 3: <span className={cn('font-semibold', styles.label)}>{n.faixas[1]?.meta3 ? brl(n.faixas[1].meta3.ote) : '—'}</span>
                    </p>
                  </div>
                </div>
                <ChevronDown className={cn('h-5 w-5 text-cw-muted transition-transform', isOpen && 'rotate-180')} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-5 border-t border-cw-border pt-4">
                  {isEditing && (
                    <div className="grid grid-cols-2 gap-3 mb-2 p-3 bg-cw-bg rounded-lg border border-cw-border">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-cw-muted block mb-1">Nome do nível</label>
                        <input
                          defaultValue={n.nome}
                          onBlur={(e) => updateField(idxInList, { nome: e.target.value })}
                          className="w-full bg-cw-elevated border border-cw-border rounded px-2 py-1 text-sm text-cw-text"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-cw-muted block mb-1">Base salarial (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={n.baseSalarial ?? 0}
                          onBlur={(e) => updateField(idxInList, { baseSalarial: Number(e.target.value) || 0 })}
                          className="w-full bg-cw-elevated border border-cw-border rounded px-2 py-1 text-sm text-cw-text"
                        />
                      </div>
                    </div>
                  )}
                  {n.faixas.map((f, fIdx) => {
                    const isEstrela = f.nome.toLowerCase().includes('estrela');
                    return (
                      <div
                        key={fIdx}
                        className={cn(
                          'rounded-lg border p-4',
                          isEstrela ? 'bg-cw-yellow/5 border-cw-yellow/30' : 'bg-cw-bg border-cw-border',
                        )}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          {isEstrela && <Star className="h-4 w-4 text-cw-yellow fill-cw-yellow" />}
                          <h4 className={cn('font-bold', isEstrela ? 'text-cw-yellow' : 'text-cw-text')}>
                            <EditableText storeKey={`${STORE_KEY}.${idxInList}.faixas.${fIdx}.nome`} defaultValue={f.nome} className="font-bold" />
                          </h4>
                        </div>

                        {(f.meta1 || f.meta2 || f.meta3) && (
                          <div className="overflow-x-auto -mx-2 px-2 mb-3">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-cw-border/50">
                                  <th className="text-left py-2 pr-3 text-xs uppercase tracking-wider text-cw-muted font-semibold">Meta</th>
                                  <th className="text-right py-2 px-3 text-xs uppercase tracking-wider text-cw-muted font-semibold">% Comissão</th>
                                  <th className="text-right py-2 px-3 text-xs uppercase tracking-wider text-cw-muted font-semibold">Valor R$</th>
                                  <th className="text-right py-2 pl-3 text-xs uppercase tracking-wider text-cw-muted font-semibold">OTE Total</th>
                                </tr>
                              </thead>
                              <tbody className="font-mono">
                                {f.meta1 && (
                                  <tr className="border-b border-cw-border/30">
                                    <td className="py-2 pr-3 font-sans"><span className="px-2 py-0.5 rounded bg-cw-bg border border-cw-border text-xs font-semibold">Meta 1</span></td>
                                    <td className="py-2 px-3 text-right text-cw-muted">{(f.meta1.percentual * 100).toFixed(0)}%</td>
                                    <td className="py-2 px-3 text-right">{brl(f.meta1.valor)}</td>
                                    <td className="py-2 pl-3 text-right font-semibold">{brl(f.meta1.ote)}</td>
                                  </tr>
                                )}
                                {f.meta2 && (
                                  <tr className="border-b border-cw-border/30 bg-cw-purple/5">
                                    <td className="py-2 pr-3 font-sans"><span className="px-2 py-0.5 rounded bg-cw-purple/20 border border-cw-purple/40 text-xs font-semibold text-cw-purple-light">Meta 2</span></td>
                                    <td className="py-2 px-3 text-right text-cw-muted">{(f.meta2.percentual * 100).toFixed(0)}%</td>
                                    <td className="py-2 px-3 text-right">{brl(f.meta2.valor)}</td>
                                    <td className="py-2 pl-3 text-right font-semibold">{brl(f.meta2.ote)}</td>
                                  </tr>
                                )}
                                {f.meta3 && (
                                  <tr className="bg-cw-yellow/5">
                                    <td className="py-2 pr-3 font-sans"><span className="px-2 py-0.5 rounded bg-cw-yellow/20 border border-cw-yellow/40 text-xs font-semibold text-cw-yellow flex items-center gap-1 w-fit"><Target className="h-3 w-3" />Meta 3</span></td>
                                    <td className="py-2 px-3 text-right text-cw-muted">{(f.meta3.percentual * 100).toFixed(0)}%</td>
                                    <td className="py-2 px-3 text-right">{brl(f.meta3.valor)}</td>
                                    <td className="py-2 pl-3 text-right font-bold text-cw-yellow">{brl(f.meta3.ote)}</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}

                        <div className="space-y-1.5 text-sm">
                          <p className="text-cw-muted whitespace-pre-line leading-relaxed">
                            <span className="text-cw-text font-semibold">✅ Elegibilidade: </span>
                            <EditableText
                              storeKey={`${STORE_KEY}.${idxInList}.faixas.${fIdx}.criterioElegibilidade`}
                              defaultValue={f.criterioElegibilidade}
                              multiline
                              className="text-cw-muted"
                            />
                          </p>
                          {(f.criterioDesclassificacao || isEditing) && (
                            <p className="text-red-300/90 leading-relaxed">
                              <span className="font-semibold">⚠️ Desclassificação: </span>
                              <EditableText
                                storeKey={`${STORE_KEY}.${idxInList}.faixas.${fIdx}.criterioDesclassificacao`}
                                defaultValue={f.criterioDesclassificacao || ''}
                                multiline
                                className="text-red-300/90"
                              />
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="bg-cw-surface border-cw-border text-cw-text max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-cw">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center font-bold', tierStyles[tierOf(selected.id)].btn)}>
                    {selected.nome}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl text-gradient-primary">Nível {selected.nome}</DialogTitle>
                    {selected.baseSalarial && (
                      <DialogDescription className="text-cw-muted">
                        Base salarial: <span className="font-bold text-cw-text">{brl(selected.baseSalarial)}</span>
                      </DialogDescription>
                    )}
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                {selected.faixas.map((f, fIdx) => {
                  const isEstrela = f.nome.toLowerCase().includes('estrela');
                  return (
                    <div
                      key={fIdx}
                      className={cn(
                        'border rounded-lg p-4',
                        isEstrela ? 'border-cw-yellow/40 bg-cw-yellow/5' : 'border-cw-border bg-cw-bg',
                      )}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {isEstrela && <Star className="h-4 w-4 text-cw-yellow fill-cw-yellow" />}
                        <h4 className={cn('font-bold', isEstrela ? 'text-cw-yellow' : 'text-cw-purple-light')}>
                          {f.nome}
                        </h4>
                      </div>
                      {f.meta3 && (
                        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                          {(['meta1', 'meta2', 'meta3'] as const).map((mk, i) => {
                            const m = f[mk];
                            if (!m) return null;
                            const labels = ['Meta 1', 'Meta 2', 'Meta 3'];
                            const colors = ['bg-cw-bg', 'bg-cw-purple/15 border-cw-purple/40', 'bg-cw-yellow/10 border-cw-yellow/40'];
                            return (
                              <div key={mk} className={cn('rounded-lg border border-cw-border p-2', colors[i])}>
                                <p className="text-[10px] uppercase tracking-wider text-cw-muted">{labels[i]}</p>
                                <p className="text-xs text-cw-muted">{(m.percentual * 100).toFixed(0)}%</p>
                                <p className="text-sm font-bold mt-1">{brl(m.ote)}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <p className="text-sm text-cw-muted leading-relaxed mb-2 whitespace-pre-line">
                        <span className="text-cw-text font-semibold">Elegibilidade: </span>
                        {f.criterioElegibilidade}
                      </p>
                      {f.criterioDesclassificacao && (
                        <p className="text-sm text-red-300/90 leading-relaxed">
                          <span className="font-semibold">Desclassificação: </span>{f.criterioDesclassificacao}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
