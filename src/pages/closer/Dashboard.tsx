/** Dashboard de Closer — Central de Operações (visão geral). */
import { DashboardSection } from '@/components/closer/DashboardSection';

export default function CloserDashboard() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Dashboard</h1>
        <p className="text-sm text-cw-muted mt-1">Sua central de operações: metas, templates e descontos num só lugar.</p>
      </div>
      <DashboardSection />
    </div>
  );
}
