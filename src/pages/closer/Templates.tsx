/** Dashboard de Closer — Templates (arsenal de mensagens). */
import { TemplatesSection } from '@/components/closer/TemplatesSection';

export default function CloserTemplates() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Templates</h1>
        <p className="text-sm text-cw-muted mt-1">Mensagens prontas para copiar e fechar negócios mais rápido.</p>
      </div>
      <TemplatesSection />
    </div>
  );
}
