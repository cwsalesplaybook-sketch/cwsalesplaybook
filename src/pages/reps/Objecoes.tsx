/** Dashboard de REPS — Objeções (banco de contorno de objeções). */
import { ShieldCheck } from 'lucide-react';
import { PlaceholderSection } from '@/components/reps/PlaceholderSection';

export default function RepsObjecoes() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Objeções</h1>
        <p className="text-sm text-cw-muted mt-1">Pesquise a objeção do lead e veja como contorná-la.</p>
      </div>
      <PlaceholderSection
        titulo="Objeções"
        descricao="Em breve estará disponível!"
        icon={ShieldCheck}
      />
    </div>
  );
}
