/** Dashboard de Closer — Planos e Preços (planos + módulos + cupons + franquias). */
import { PlanosSection, FranquiasSection } from '@/components/closer/sections';

export default function CloserPlanos() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Planos e Preços</h1>
        <p className="text-sm text-cw-muted mt-1">Planos oficiais, módulos extras, cupons de desconto e condições de franquia.</p>
      </div>
      <PlanosSection />
      <FranquiasSection />
    </div>
  );
}
