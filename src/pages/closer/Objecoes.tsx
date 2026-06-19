/** Dashboard de Closer — Objeções (base com discurso de solução, busca e filtro). */
import { ObjecoesSection } from '@/components/closer/sections';

export default function CloserObjecoes() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Objeções</h1>
        <p className="text-sm text-cw-muted mt-1">Base de objeções organizada por fase da venda.</p>
      </div>
      <ObjecoesSection />
    </div>
  );
}
