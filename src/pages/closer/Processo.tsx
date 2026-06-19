/** Dashboard de Closer — Processo de Venda
 *  (Funis de Vendas + SPIN + Etapas da reunião + Checklists + Critérios + Follow-up).
 *  Conteúdo em construção (próximo bloco). */
import { EmConstrucao } from '@/components/closer/sections';

export default function CloserProcesso() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Processo de Venda</h1>
        <p className="text-sm text-cw-muted mt-1">Funis, SPIN, etapas da reunião, checklists, critérios de avaliação e follow-up.</p>
      </div>
      <EmConstrucao titulo="Processo de Venda" />
    </div>
  );
}
