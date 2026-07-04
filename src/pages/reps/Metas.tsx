/** Dashboard de REPS — Metas (tracker pessoal do mês). */
import { MetasSection } from '@/components/reps/MetasSection';

export default function RepsMetas() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Metas</h1>
        <p className="text-sm text-cw-muted mt-1">Acompanhe seu progresso e saiba exatamente quanto precisa fechar.</p>
      </div>
      <MetasSection />
    </div>
  );
}
