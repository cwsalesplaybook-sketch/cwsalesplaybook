import { LayoutDashboard } from 'lucide-react';
import { useUser } from '@/context/UserContext';

export default function GestorDashboard() {
  const { email } = useUser();
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cw-text">Dashboard</h1>
        <p className="text-sm text-cw-muted mt-1">Visão geral do time comercial</p>
      </div>
      <div className="flex flex-col items-center justify-center h-64 text-cw-muted gap-4 border border-dashed border-cw-border rounded-xl">
        <LayoutDashboard className="h-10 w-10 opacity-30" />
        <p className="text-sm">Dashboard em construção</p>
        {email && <p className="text-xs opacity-60">{email}</p>}
      </div>
    </div>
  );
}
