/** Banco de Objeções — o novato escreve seu contorno para as objeções clássicas. */
import { useState } from 'react';
import { ShieldAlert, Copy, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const STORE_KEY = 'cw-objecoes-bank';

const OBJECOES = [
  'Já uso outro sistema.',
  'Achei caro.',
  'Vou pensar e te retorno.',
  'Não tenho tempo agora.',
  'Meu delivery é só pelo WhatsApp / iFood.',
  'Preciso falar com meu sócio.',
  'Tive experiência ruim com tecnologia antes.',
];

function load(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }
  catch { return {}; }
}

export function ObjecoesBank() {
  const [store, setStore] = useState<Record<string, string>>(() => load());
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const update = (objecao: string, value: string) => {
    const next = { ...store, [objecao]: value };
    setStore(next);
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  };

  const handleCopy = (idx: number, text: string) => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <section className="cw-card p-6">
      <div className="flex items-center gap-2 mb-1">
        <ShieldAlert className="h-5 w-5 text-cw-red" />
        <h2 className="text-xl font-bold">Banco de Objeções</h2>
      </div>
      <p className="text-cw-muted text-sm mb-4">
        Escreva seu contorno em até 3 frases. O botão "copiar" salva o texto pronto para a próxima ligação.
      </p>

      <div className="space-y-4">
        {OBJECOES.map((o, idx) => (
          <div key={o} className="p-3 rounded-lg border border-cw-border bg-cw-bg/60">
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-sm font-semibold text-cw-text">"{o}"</p>
              <button
                onClick={() => handleCopy(idx, store[o] ?? '')}
                className="text-xs text-cw-purple-light hover:text-white flex items-center gap-1 shrink-0"
              >
                {copiedIdx === idx ? <><Check className="h-3 w-3" /> copiado</> : <><Copy className="h-3 w-3" /> copiar</>}
              </button>
            </div>
            <Textarea
              value={store[o] ?? ''}
              onChange={(e) => update(o, e.target.value)}
              placeholder="Seu contorno..."
              className="bg-cw-bg border-cw-border min-h-[64px] text-sm"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
