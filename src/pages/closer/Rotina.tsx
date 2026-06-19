/** Dashboard de Closer — Rotina & Progressão (Hora Ouro + níveis de carreira).
 *  Conteúdo em construção (próximo bloco). */
import { EmConstrucao } from '@/components/closer/sections';

export default function CloserRotina() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Rotina & Progressão</h1>
        <p className="text-sm text-cw-muted mt-1">Rotinas de alta produtividade (Hora Ouro), checklists do CRM e níveis de carreira.</p>
      </div>
      <EmConstrucao titulo="Rotina & Progressão" />
    </div>
  );
}
