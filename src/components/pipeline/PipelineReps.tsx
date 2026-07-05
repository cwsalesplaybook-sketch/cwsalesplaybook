/** Pipeline de Representantes — ainda não integrado ao Pipedrive (mesmo
 *  estado "em construção" do portal real de reps). */
import { ExternalLink } from 'lucide-react';

export default function PipelineReps() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Pipeline</h1>
        <p className="text-sm text-cw-muted mt-1">Acompanhe suas oportunidades em andamento e o status de cada negócio.</p>
      </div>
      <div className="cw-card p-10 flex flex-col items-center text-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-cw-purple/10 border border-cw-purple/20 flex items-center justify-center">
          <span className="text-3xl">🚧</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-cw-text">Pipeline em construção</h3>
          <p className="text-sm text-cw-muted max-w-md mx-auto mt-1 leading-relaxed">
            A visualização de pipeline será integrada ao Pipedrive. Em breve você poderá acompanhar suas oportunidades diretamente aqui.
          </p>
        </div>
        <a
          href="https://www.pipedrive.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 gradient-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl"
        >
          Acessar Pipedrive <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
