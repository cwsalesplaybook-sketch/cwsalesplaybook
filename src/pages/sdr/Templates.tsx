/** Dashboard de SDR — Templates (atalhos do Kommo). */
import { TemplatesSection } from '@/components/sdr/TemplatesSection';

export default function SdrTemplates() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Templates</h1>
        <p className="text-sm text-cw-muted mt-1">Atalhos do Kommo prontos pra copiar e usar no chat.</p>
      </div>
      <TemplatesSection />
    </div>
  );
}
