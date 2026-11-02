/** Dashboard de Closer — Progressão de Carreira (jornada, simulador e níveis). */
import { useState } from 'react';
import { ChartNoAxesCombined } from 'lucide-react';
import {
  ResumoCarreira, SimuladorTempo, ProgressaoSection, DetalheNiveis, ComoFunciona, nivelPorTempo,
} from '@/components/closer/CarreiraSection';
import { CLOSER_PROGRESSAO } from '@/data/playbookCloser';

export default function CloserCarreira() {
  const [mesesCasa, setMesesCasa] = useState(0);
  const nivelSimulado = CLOSER_PROGRESSAO[nivelPorTempo(mesesCasa)].nome;

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 rounded-xl bg-cw-purple/10 text-cw-purple flex items-center justify-center shrink-0">
          <ChartNoAxesCombined className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-black text-cw-text">Progressão de Carreira</h1>
          <p className="text-sm text-cw-muted mt-0.5">Níveis, tempo mínimo de empresa e onde você pode chegar na jornada de closer.</p>
        </div>
      </div>

      <ResumoCarreira />

      <SimuladorTempo mesesCasa={mesesCasa} onChange={setMesesCasa} />

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-cw-text">Jornada do closer</h2>
          <p className="text-sm text-cw-muted mt-0.5">Júnior → Pleno → Sênior, com três níveis em cada etapa.</p>
        </div>
        <ProgressaoSection nivelAtual={nivelSimulado} simulado />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-cw-text">Nível a nível</h2>
          <p className="text-sm text-cw-muted mt-0.5">Tempo mínimo de casa para cada nível e o intervalo entre eles.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <DetalheNiveis nivelAtual={nivelSimulado} />
          <ComoFunciona />
        </div>
      </section>
    </div>
  );
}
