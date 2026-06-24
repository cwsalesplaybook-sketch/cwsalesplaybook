/** Dashboard de Closer — Descontos (cupons por grupo, fáceis de copiar). */
import { DescontosSection } from '@/components/closer/DescontosSection';

export default function CloserDescontos() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Descontos</h1>
        <p className="text-sm text-cw-muted mt-1">Códigos estratégicos para negociações de alto impacto.</p>
      </div>
      <DescontosSection />
    </div>
  );
}
