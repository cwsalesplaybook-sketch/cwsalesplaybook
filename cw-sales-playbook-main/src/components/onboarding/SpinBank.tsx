/** Banco de Perguntas SPIN — 3 cenários para o novato preencher. */
import { useState } from 'react';
import { Brain } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const STORE_KEY = 'cw-spin-bank';

const CENARIOS = [
  { id: 'restaurante-iniciante',  nome: 'Restaurante iniciante',  contexto: 'Restaurante pequeno, começando agora no delivery, sem sistema próprio.' },
  { id: 'restaurante-marketplace', nome: 'Dependente de marketplace', contexto: 'Restaurante que vende muito por iFood/Rappi e paga taxas altas.' },
  { id: 'restaurante-rede',       nome: 'Rede em expansão',        contexto: 'Pequena rede com 3-5 unidades buscando padronizar e escalar.' },
];

const CAMPOS = [
  { key: 'situacao',    label: 'Situação',    cor: 'text-blue-300',     hint: 'Coletar fatos. Como funciona hoje?' },
  { key: 'problema',    label: 'Problema',    cor: 'text-cw-yellow',    hint: 'Identificar dores e insatisfações.' },
  { key: 'implicacao',  label: 'Implicação',  cor: 'text-cw-red',       hint: 'Amplificar o impacto do problema.' },
  { key: 'necessidade', label: 'Necessidade', cor: 'text-cw-purple-light', hint: 'Levar o cliente a verbalizar o ganho da solução.' },
] as const;

type Store = Record<string, Record<string, string>>;

function load(): Store {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }
  catch { return {}; }
}

export function SpinBank() {
  const [store, setStore] = useState<Store>(() => load());

  const update = (cenario: string, campo: string, value: string) => {
    const next = { ...store, [cenario]: { ...(store[cenario] ?? {}), [campo]: value } };
    setStore(next);
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  };

  return (
    <section className="cw-card p-6">
      <div className="flex items-center gap-2 mb-1">
        <Brain className="h-5 w-5 text-cw-purple-light" />
        <h2 className="text-xl font-bold">Banco de Perguntas SPIN</h2>
      </div>
      <p className="text-cw-muted text-sm mb-4">
        Para cada cenário, escreva 2-3 perguntas suas para cada etapa do SPIN.
      </p>

      <Tabs defaultValue={CENARIOS[0].id}>
        <TabsList className="bg-cw-bg border border-cw-border w-full grid grid-cols-3">
          {CENARIOS.map((c) => (
            <TabsTrigger key={c.id} value={c.id} className="data-[state=active]:bg-cw-purple data-[state=active]:text-white">
              {c.nome}
            </TabsTrigger>
          ))}
        </TabsList>

        {CENARIOS.map((c) => (
          <TabsContent key={c.id} value={c.id} className="mt-4 space-y-3">
            <div className="p-3 rounded-lg border border-cw-border bg-cw-bg text-sm text-cw-muted">
              <strong className="text-cw-text">Contexto:</strong> {c.contexto}
            </div>
            {CAMPOS.map((f) => (
              <div key={f.key}>
                <div className="flex items-baseline justify-between">
                  <label className={`text-xs uppercase tracking-wider font-semibold ${f.cor}`}>{f.label}</label>
                  <span className="text-[11px] text-cw-muted">{f.hint}</span>
                </div>
                <Textarea
                  value={store[c.id]?.[f.key] ?? ''}
                  onChange={(e) => update(c.id, f.key, e.target.value)}
                  placeholder={`Suas perguntas de ${f.label} para esse cenário...`}
                  className="mt-1 bg-cw-bg border-cw-border min-h-[72px] text-sm"
                />
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
