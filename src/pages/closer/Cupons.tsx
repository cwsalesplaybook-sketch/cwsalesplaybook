/** Dashboard de Closer — Cupons (códigos de desconto por tipo, fáceis de copiar). */
import { CuponsSection } from '@/components/closer/sections';

export default function CloserCupons() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Cupons</h1>
        <p className="text-sm text-cw-muted mt-1">Códigos de desconto: parcerias, negociação e reopen.</p>
      </div>
      <CuponsSection />
    </div>
  );
}
