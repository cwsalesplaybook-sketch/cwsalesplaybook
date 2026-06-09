/** Hero da página Comece por Aqui — boas-vindas com vídeo placeholder. */
import { Sparkles } from 'lucide-react';
import { EditableText } from '@/admin/EditableText';
import { NotificationBell } from '@/components/layout/NotificationBell';

export function WelcomeHero() {
  return (
    <section className="relative rounded-2xl gradient-hot p-6">
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute inset-0 gradient-glow" />
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
      </div>
      <div className="absolute top-4 right-4 z-20">
        <NotificationBell />
      </div>

      <div className="relative grid md:grid-cols-2 gap-7 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-semibold uppercase tracking-widest mb-4 border border-white/20">
            <Sparkles className="h-3 w-3 text-yellow-300" />
            <EditableText
              storeKey="start.hero.kicker"
              defaultValue="Bem-vindo(a) à Cardápio Web"
              className="text-xs"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white leading-[1.15] tracking-tight mb-3">
            <EditableText
              storeKey="start.hero.titulo"
              defaultValue="Você acabou de entrar num time que muda o mercado de food."
              multiline
              className="text-2xl md:text-3xl font-black text-white"
            />
          </h1>
          <p className="text-white/85 leading-relaxed mb-5 max-w-md text-sm">
            <EditableText
              storeKey="start.hero.descricao"
              defaultValue="Esse portal é o seu mapa. Aqui você encontra cultura, processos, métricas e práticas: tudo o que precisa para chegar lá rápido e bem."
              multiline
              className="text-white/85"
            />
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-white/75">
            <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full border border-white/20 text-xs">
              ⭐ Padrinhos de plantão: <strong className="text-white">
                <EditableText storeKey="start.hero.padrinhos" defaultValue="Joelma, Pedro & Anderson" className="font-bold text-white" />
              </strong>
            </span>
          </div>
        </div>

        <div className="relative w-full rounded-xl overflow-hidden border border-white/20 shadow-lg" style={{ paddingTop: '56.25%' }}>
          <iframe
            src="https://www.youtube.com/embed/At4i9h8-fNI"
            title="Vídeo de boas-vindas do CEO"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
