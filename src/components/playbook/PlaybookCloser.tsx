/** Playbook de Closer — estrutura pronta, conteúdo em construção. */
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TABS = [
  { id: 'cultura',      label: '🧭 Cultura & Estratégia' },
  { id: 'produto',      label: '🛠️ Produto' },
  { id: 'planos',       label: '💰 Planos & Preços' },
  { id: 'concorrentes', label: '⚔️ Concorrentes' },
  { id: 'jornada',      label: '🗺️ Jornada' },
  { id: 'cargos',       label: '📋 Cargos' },
  { id: 'icp',          label: '🎯 ICP' },
  { id: 'aida',         label: '📣 AIDA' },
  { id: 'spin',         label: '🔄 SPIN' },
  { id: 'bant',         label: '✅ BANT' },
  { id: 'hacks',        label: '💡 Hacks' },
  { id: 'objecoes',     label: '⚡ Objeções' },
  { id: 'fechamento',   label: '🤝 Fechamento' },
  { id: 'perda',        label: '❌ Motivos de Perda' },
];

function EmBreve() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-cw-purple/10 border border-cw-purple/20 flex items-center justify-center">
        <span className="text-3xl">🚧</span>
      </div>
      <h3 className="text-lg font-bold text-cw-text">Em construção</h3>
      <p className="text-sm text-cw-muted max-w-xs leading-relaxed">
        O conteúdo do <strong>Playbook de Closer</strong> ainda está sendo preparado pela liderança. Em breve estará disponível!
      </p>
    </div>
  );
}

export default function PlaybookCloser() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-cw-text">Playbook de Closer</h1>
        <p className="text-sm text-cw-muted mt-1">Conteúdo exclusivo para o time de Closers da Cardápio Web.</p>
      </div>
      <Tabs defaultValue="cultura" className="w-full">
        <div className="overflow-x-auto scrollbar-cw -mx-1 pb-2">
          <TabsList className="bg-cw-surface border border-cw-border p-1 inline-flex w-max">
            {TABS.map(t => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="data-[state=active]:gradient-primary data-[state=active]:text-white whitespace-nowrap text-xs font-medium"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {TABS.map(t => (
          <TabsContent key={t.id} value={t.id} className="mt-6">
            <EmBreve />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
