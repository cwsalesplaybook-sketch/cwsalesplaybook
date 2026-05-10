/** Tracker dos 10 roleplays — cada card aceita feedback positivo e construtivo. */
import { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const STORE_KEY = 'cw-roleplay-feedback';

type Feedback = { positivo: string; construtivo: string };
type Store = Record<number, Feedback>;

const FOCOS: Record<number, string> = {
  1:  'Quebra de gelo + Abertura',
  2:  'Estrutura geral da call',
  3:  'Apresentação pessoal e da CW',
  4:  'Aplicação inicial de SPIN',
  5:  'Contorno de objeções básicas',
  6:  'Abertura e Rapport (foco)',
  7:  'SPIN completo (foco)',
  8:  'BANT — qualificação (foco)',
  9:  'Encerramento e Compromisso',
  10: 'Roleplay final — avaliação completa',
};

function load(): Store {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }
  catch { return {}; }
}

export function RoleplayTracker() {
  const [store, setStore] = useState<Store>(() => load());
  const [openId, setOpenId] = useState<number | null>(1);

  const update = (id: number, field: keyof Feedback, value: string) => {
    const next = { ...store, [id]: { ...(store[id] ?? { positivo: '', construtivo: '' }), [field]: value } };
    setStore(next);
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  };

  const filled = Object.values(store).filter((f) => f.positivo || f.construtivo).length;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-5 w-5 text-cw-purple-light" />
            <h2 className="text-2xl font-bold">Tracker de Roleplays</h2>
          </div>
          <p className="text-cw-muted text-sm">
            Registre o feedback de cada um dos 10 roleplays do programa. Vai virar seu maior diário de aprendizado.
          </p>
        </div>
        <Badge variant="outline" className="border-cw-border text-cw-muted">
          {filled} / 10 registrados
        </Badge>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((id) => {
          const f = store[id] ?? { positivo: '', construtivo: '' };
          const isOpen = openId === id;
          const isDone = !!(f.positivo || f.construtivo);
          return (
            <div key={id} className={cn('cw-card overflow-hidden', isDone && 'border-cw-purple/50')}>
              <button
                onClick={() => setOpenId(isOpen ? null : id)}
                className="w-full flex items-center justify-between p-4 hover:bg-cw-elevated transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={cn(
                    'h-9 w-9 rounded-lg flex items-center justify-center font-bold text-sm',
                    isDone ? 'gradient-primary text-white' : 'bg-cw-bg border border-cw-border text-cw-muted'
                  )}>
                    {id}º
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{id}º Roleplay</p>
                    <p className="text-xs text-cw-muted">{FOCOS[id]}</p>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-cw-muted" /> : <ChevronDown className="h-4 w-4 text-cw-muted" />}
              </button>

              {isOpen && (
                <div className="border-t border-cw-border p-4 space-y-3 bg-cw-bg/40">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cw-yellow font-semibold">Pontos positivos</label>
                    <Textarea
                      value={f.positivo}
                      onChange={(e) => update(id, 'positivo', e.target.value)}
                      placeholder="O que funcionou bem nesse roleplay?"
                      className="mt-1 bg-cw-bg border-cw-border min-h-[64px] text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-cw-purple-light font-semibold">Pontos a evoluir</label>
                    <Textarea
                      value={f.construtivo}
                      onChange={(e) => update(id, 'construtivo', e.target.value)}
                      placeholder="O que dá pra melhorar no próximo?"
                      className="mt-1 bg-cw-bg border-cw-border min-h-[64px] text-sm"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => toast({ title: '✓ Salvo', description: `Feedback do ${id}º roleplay registrado.` })}
                      className="gradient-primary text-white"
                    >
                      <Save className="h-3.5 w-3.5 mr-1" /> Salvar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
