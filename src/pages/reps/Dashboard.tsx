/** Dashboard de REPS — Central de Operações (visão geral). */
import { DashboardSection } from '@/components/reps/DashboardSection';

export default function RepsDashboard() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Dashboard</h1>
        <p className="text-sm text-cw-muted mt-1">Sua central de operações: metas, território e concorrência num só lugar.</p>
      </div>
      <DashboardSection />
    </div>
  );
}
