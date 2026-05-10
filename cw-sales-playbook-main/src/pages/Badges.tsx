/** Página /badges — todos os badges com estado bloqueado/desbloqueado. */
import { Header } from '@/components/layout/Header';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';
import { useBadges } from '@/hooks/useBadges';
import { cn } from '@/lib/utils';

export default function BadgesPage() {
  const { checked } = useOnboardingProgress();
  const badges = useBadges(checked);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <>
      <Header titulo="Badges" subtitulo={`${unlockedCount} de ${badges.length} desbloqueados`} />
      <div className="p-8 max-w-4xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={cn(
                'cw-card p-6 text-center transition-all',
                b.unlocked ? 'border-cw-yellow/60 bg-gradient-to-br from-cw-purple/20 to-transparent' : 'opacity-60'
              )}
            >
              <div
                className={cn(
                  'h-20 w-20 mx-auto rounded-2xl flex items-center justify-center text-5xl border-2 mb-3',
                  b.unlocked ? 'border-cw-yellow gradient-primary' : 'border-cw-border bg-cw-bg grayscale'
                )}
              >
                {b.emoji}
              </div>
              <p className="font-bold text-lg">{b.nome}</p>
              <p className="text-sm text-cw-muted mt-1 leading-relaxed">{b.descricao}</p>
              <p className={cn('text-xs uppercase tracking-wider font-bold mt-3', b.unlocked ? 'text-cw-yellow' : 'text-cw-muted')}>
                {b.unlocked ? '✓ Desbloqueado' : '🔒 Bloqueado'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
