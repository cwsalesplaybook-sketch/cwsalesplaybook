/** Seção Agenda — lista de rotinas. */
import { useMemo, useState } from 'react';
import { RITUAIS } from '@/data/rituais';
import { useSidebarContext } from '@/context/SidebarContext';
import type { Ritual } from '@/types';
import { RitualCard } from './RitualCard';
import { RitualPanel } from './RitualPanel';

export default function Agenda() {
  const { papel } = useSidebarContext();
  const [selected, setSelected] = useState<Ritual | null>(null);

  const filtered = useMemo(
    () => RITUAIS.filter((r) =>
      papel === 'SDR'
        ? r.participantes === 'SDR' || r.participantes === 'Ambos'
        : r.participantes === 'Closer' || r.participantes === 'Ambos'
    ),
    [papel]
  );

  const diarias = filtered.filter((r) => r.frequencia.includes('Diária'));
  const semanais = filtered.filter((r) => r.frequencia.includes('Semanal') || r.frequencia.includes('Quinzenal'));
  const mensais = filtered.filter((r) => r.frequencia.includes('Mensal'));

  const closerVazio = papel === 'Closer' && filtered.length === 0;

  return (
    <>
      <div className="p-8 space-y-8">
        {closerVazio ? (
          <div className="cw-card p-12 text-center">
            <p className="text-2xl font-bold mb-2">Rituais de Closers em construção</p>
            <p className="text-cw-muted">Em breve aqui. 🚧</p>
          </div>
        ) : (
          <>
            {[
              { titulo: '⏱️ Diárias', items: diarias },
              { titulo: '📆 Semanais & Quinzenais', items: semanais },
              { titulo: '🗓️ Mensais', items: mensais },
            ].map((sec) => sec.items.length > 0 && (
              <div key={sec.titulo}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-cw-muted mb-4">{sec.titulo}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sec.items.map((r) => (
                    <RitualCard key={r.id} ritual={r} onClick={() => setSelected(r)} />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <RitualPanel ritual={selected} onClose={() => setSelected(null)} />
    </>
  );
}
