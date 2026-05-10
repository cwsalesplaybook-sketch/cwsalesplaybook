/** Seção Agenda — visão semanal e lista de rotinas. */
import { useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RITUAIS } from '@/data/rituais';
import { useSidebarContext } from '@/context/SidebarContext';
import type { Ritual } from '@/types';
import { WeeklyCalendar } from './WeeklyCalendar';
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
      <Header titulo="Agenda" subtitulo={`Visão de ${papel} · rituais e rotinas do time`} />
      <div className="p-8">
        {closerVazio ? (
          <div className="cw-card p-12 text-center">
            <p className="text-2xl font-bold mb-2">Rituais de Closers em construção</p>
            <p className="text-cw-muted">Em breve aqui. 🚧</p>
          </div>
        ) : (
          <Tabs defaultValue="semana" className="w-full">
            <TabsList className="bg-cw-surface border border-cw-border">
              <TabsTrigger value="semana" className="data-[state=active]:bg-cw-elevated data-[state=active]:text-cw-orange">
                📆 Visão Semanal
              </TabsTrigger>
              <TabsTrigger value="lista" className="data-[state=active]:bg-cw-elevated data-[state=active]:text-cw-orange">
                🗂️ Todas as Rotinas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="semana" className="mt-6">
              <WeeklyCalendar rituais={filtered} onSelect={setSelected} />
            </TabsContent>

            <TabsContent value="lista" className="mt-6 space-y-8">
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
            </TabsContent>
          </Tabs>
        )}
      </div>
      <RitualPanel ritual={selected} onClose={() => setSelected(null)} />
    </>
  );
}
