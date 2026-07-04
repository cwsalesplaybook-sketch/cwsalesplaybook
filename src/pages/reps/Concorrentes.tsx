/** Dashboard de REPS — Concorrentes (análise de concorrência). */
import { Sword } from 'lucide-react';
import { PlaceholderSection } from '@/components/reps/PlaceholderSection';

export default function RepsConcorrentes() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Concorrentes</h1>
        <p className="text-sm text-cw-muted mt-1">Comparativos e argumentos de diferenciação frente à concorrência.</p>
      </div>
      <PlaceholderSection
        titulo="Concorrentes"
        descricao="Em breve estará disponível!"
        icon={Sword}
      />
    </div>
  );
}
