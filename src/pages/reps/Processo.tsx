/** Dashboard de REPS — Processo de Atendimento. */
import { Target } from 'lucide-react';
import { PlaceholderSection } from '@/components/reps/PlaceholderSection';

export default function RepsProcesso() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Processo de Atendimento</h1>
        <p className="text-sm text-cw-muted mt-1">Etapas, critérios e cadência de acompanhamento das contas.</p>
      </div>
      <PlaceholderSection
        titulo="Processo de Atendimento"
        descricao="Em breve estará disponível!"
        icon={Target}
      />
    </div>
  );
}
