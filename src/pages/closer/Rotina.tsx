/** Dashboard de Closer — Rotina (Hora de Ouro, boas práticas e CRM). */
import { CalendarClock } from 'lucide-react';
import { HoraOuroSection } from '@/components/closer/RotinaSection';

export default function CloserRotina() {
  return (
    <div className="p-4 sm:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 rounded-xl bg-cw-purple/10 text-cw-purple flex items-center justify-center shrink-0">
          <CalendarClock className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-black text-cw-text">Rotina</h1>
          <p className="text-sm text-cw-muted mt-0.5">Rotinas de alta produtividade, Hora de Ouro e organização do CRM.</p>
        </div>
      </div>
      <HoraOuroSection />
    </div>
  );
}
