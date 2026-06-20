/** Dashboard de Closer — Concorrentes (comparativo com os principais players). */
import { ConcorrentesSection } from '@/components/closer/ConcorrentesSection';

export default function CloserConcorrentes() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Concorrentes</h1>
        <p className="text-sm text-cw-muted mt-1">Comparativo com os principais concorrentes do mercado.</p>
      </div>
      <ConcorrentesSection />
    </div>
  );
}
