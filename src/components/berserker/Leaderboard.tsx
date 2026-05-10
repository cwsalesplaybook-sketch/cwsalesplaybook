/** Leaderboard do Berserker — editável no Modo Gestor. */
import { useState } from 'react';
import { Trophy, ArrowUp, ArrowDown, Minus, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LEADERBOARD as LEADERBOARD_PADRAO } from '@/data/berserker';
import type { BerserkerEntry } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useEditor } from '@/admin/EditorContext';
import { useContentStore, useEditableContent } from '@/store/contentStore';
import { EditableText } from '@/admin/EditableText';

const MEDAL_COLORS = ['text-yellow-400', 'text-slate-300', 'text-amber-700'];
const STORE_KEY = 'berserker.leaderboard';

export function Leaderboard() {
  const [loading, setLoading] = useState(false);
  const { isEditing } = useEditor();
  const board = useEditableContent<BerserkerEntry[]>(STORE_KEY, LEADERBOARD_PADRAO);
  const saveOverride = useContentStore((s) => s.saveOverride);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast('Ranking atualizado', { description: 'Posições recarregadas em tempo real.' });
    }, 1500);
  };

  const update = async (next: BerserkerEntry[]) => {
    // Reordena posições automaticamente por pontos desc
    const reordered = [...next]
      .sort((a, b) => b.pontos - a.pontos)
      .map((e, i) => ({ ...e, posicao: i + 1 }));
    try { await saveOverride(STORE_KEY, reordered); }
    catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao salvar';
      toast.error('Falha ao salvar', { description: msg });
    }
  };

  const setField = (idx: number, field: 'pontos' | 'variacao', value: number) => {
    const next = [...board];
    next[idx] = { ...next[idx], [field]: value };
    update(next);
  };

  const add = () => {
    const novo: BerserkerEntry = {
      posicao: board.length + 1,
      nome: 'Novo guerreiro',
      squad: 'Squad Águia',
      pontos: 0,
      variacao: 0,
    };
    update([...board, novo]);
  };

  const remove = (idx: number) => {
    const next = board.filter((_, i) => i !== idx);
    update(next);
  };

  return (
    <div className="cw-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-bold">Leaderboard</h3>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <Button size="sm" onClick={add} className="gradient-primary text-white h-8">
              <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={refresh}
            disabled={loading}
            className="border-cw-border text-cw-muted hover:text-cw-text hover:bg-cw-elevated"
          >
            <RefreshCw className={cn('h-3 w-3 mr-2', loading && 'animate-spin')} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {board.slice(0, 3).map((e, idx) => (
          <div
            key={e.posicao}
            className={cn(
              'group relative rounded-xl border p-4 bg-gradient-to-br from-cw-elevated to-cw-bg',
              e.posicao === 1 ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/10' : 'border-cw-border',
              e.posicao === 1 && 'animate-fade-in'
            )}
          >
            {isEditing && (
              <button
                onClick={() => remove(idx)}
                className="absolute top-2 right-2 h-6 w-6 rounded bg-cw-red/15 text-cw-red border border-cw-red/30 hover:bg-cw-red/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remover"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
            <Trophy className={cn('h-6 w-6 mb-2', MEDAL_COLORS[e.posicao - 1])} />
            <p className="font-bold text-cw-text">
              <EditableText storeKey={`${STORE_KEY}.${idx}.nome`} defaultValue={e.nome} />
            </p>
            <p className="text-xs text-cw-muted">
              <EditableText storeKey={`${STORE_KEY}.${idx}.squad`} defaultValue={e.squad} className="text-xs" />
            </p>
            <div className="flex items-end justify-between mt-3">
              <span className="text-2xl font-black tabular-nums">
                {isEditing ? (
                  <input
                    type="number"
                    value={e.pontos}
                    onChange={(ev) => setField(idx, 'pontos', Number(ev.target.value))}
                    className="w-16 bg-cw-bg border border-cw-purple-light rounded px-1 text-2xl font-black"
                  />
                ) : (
                  e.pontos
                )}
                <span className="text-xs text-cw-muted ml-1">pts</span>
              </span>
              {isEditing ? (
                <input
                  type="number"
                  value={e.variacao}
                  onChange={(ev) => setField(idx, 'variacao', Number(ev.target.value))}
                  className="w-12 bg-cw-bg border border-cw-purple-light rounded px-1 text-xs text-center"
                  title="Variação"
                />
              ) : (
                <Variation v={e.variacao} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 4 e 5+ */}
      <ul className="divide-y divide-cw-border border-t border-cw-border">
        {board.slice(3).map((e, i) => {
          const idx = i + 3;
          return (
            <li key={e.posicao} className="group flex items-center gap-3 py-3">
              <span className="text-sm font-bold text-cw-muted w-6">{e.posicao}º</span>
              <div className="flex-1">
                <p className="font-semibold text-cw-text text-sm">
                  <EditableText storeKey={`${STORE_KEY}.${idx}.nome`} defaultValue={e.nome} />
                </p>
                <p className="text-xs text-cw-muted">
                  <EditableText storeKey={`${STORE_KEY}.${idx}.squad`} defaultValue={e.squad} className="text-xs" />
                </p>
              </div>
              <span className="text-sm font-bold tabular-nums">
                {isEditing ? (
                  <input
                    type="number"
                    value={e.pontos}
                    onChange={(ev) => setField(idx, 'pontos', Number(ev.target.value))}
                    className="w-16 bg-cw-bg border border-cw-purple-light rounded px-1 text-sm font-bold"
                  />
                ) : (
                  e.pontos
                )}{' '}
                pts
              </span>
              {isEditing ? (
                <input
                  type="number"
                  value={e.variacao}
                  onChange={(ev) => setField(idx, 'variacao', Number(ev.target.value))}
                  className="w-12 bg-cw-bg border border-cw-purple-light rounded px-1 text-xs text-center"
                />
              ) : (
                <Variation v={e.variacao} />
              )}
              {isEditing && (
                <button
                  onClick={() => remove(idx)}
                  className="h-6 w-6 rounded bg-cw-red/15 text-cw-red border border-cw-red/30 hover:bg-cw-red/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-cw-muted mt-4 text-center italic">
        {isEditing
          ? '💡 Edite nomes/squads clicando · pontos reordenam automaticamente'
          : 'Ranking atualizado em tempo real durante a competição.'}
      </p>
    </div>
  );
}

function Variation({ v }: { v: number }) {
  if (v > 0) return <span className="text-xs flex items-center gap-0.5 text-green-400 font-semibold"><ArrowUp className="h-3 w-3" />{v}</span>;
  if (v < 0) return <span className="text-xs flex items-center gap-0.5 text-red-400 font-semibold"><ArrowDown className="h-3 w-3" />{Math.abs(v)}</span>;
  return <span className="text-xs flex items-center gap-0.5 text-cw-muted font-semibold"><Minus className="h-3 w-3" />0</span>;
}
