/** Dashboard de REPS — Território (gestão de região/carteira). */
import { MapIcon } from 'lucide-react';
import { PlaceholderSection } from '@/components/reps/PlaceholderSection';

export default function RepsTerritorio() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Território</h1>
        <p className="text-sm text-cw-muted mt-1">Sua região, carteira de contas e cobertura em campo.</p>
      </div>
      <PlaceholderSection
        titulo="Território"
        descricao="Em breve estará disponível!"
        icon={MapIcon}
      />
    </div>
  );
}
