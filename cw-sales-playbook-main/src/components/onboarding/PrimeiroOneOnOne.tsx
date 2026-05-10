/** Template do 1º 1:1 — perguntas para o novato preparar. */
import { Coffee } from 'lucide-react';

const PERGUNTAS = [
  'Como você prefere receber feedback?',
  'O que te motiva no trabalho?',
  'Qual foi sua melhor experiência profissional até hoje?',
  'O que você espera dos próximos 90 dias na CW?',
  'Tem algo da cultura que ainda gerou dúvida?',
  'O que pode te tirar do jogo?',
  'Como prefere se comunicar (Slack, ligação, presencial)?',
  'Tem algum hobby ou interesse fora do trabalho que queira compartilhar?',
  'O que você esperaria de um ótimo líder?',
  'O que você esperaria de um ótimo time?',
  'Tem algum objetivo de carreira para os próximos 12 meses?',
  'Onde você acha que mais precisa evoluir tecnicamente?',
  'Tem alguma dúvida sobre comissionamento ou meta?',
  'Tem algo que eu deveria saber e não perguntei?',
];

export function PrimeiroOneOnOne() {
  return (
    <section className="cw-card p-6 border-l-4 border-l-cw-yellow bg-cw-yellow/5">
      <div className="flex items-center gap-2 mb-2">
        <Coffee className="h-5 w-5 text-cw-yellow" />
        <h2 className="text-xl font-bold">Seu 1º 1:1 com a liderança</h2>
      </div>
      <p className="text-cw-muted text-sm mb-4">
        Pense nessas 14 perguntas antes do encontro. Não precisa responder por escrito —
        é para você chegar com clareza do que falar.
      </p>
      <ol className="space-y-2 list-decimal list-inside marker:text-cw-yellow marker:font-bold">
        {PERGUNTAS.map((p) => (
          <li key={p} className="text-sm text-cw-text leading-relaxed pl-1">{p}</li>
        ))}
      </ol>
    </section>
  );
}
