/** Hero da página Comece por Aqui — boas-vindas com vídeo placeholder. */
import { Sparkles, PlayCircle } from 'lucide-react';
import { EditableText } from '@/admin/EditableText';

export function WelcomeHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-cw-purple/40 gradient-hot p-8 md:p-12">
      <div className="absolute inset-0 gradient-glow pointer-events-none" />
      <div className="relative grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-white text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <EditableText
              storeKey="start.hero.kicker"
              defaultValue="Bem-vindo(a) à Cardápio Web"
              className="text-xs"
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            <EditableText
              storeKey="start.hero.titulo"
              defaultValue="Você acabou de entrar num time que muda o mercado de food."
              multiline
              className="text-3xl md:text-5xl font-black text-white"
            />
          </h1>
          <p className="text-white/90 leading-relaxed mb-6 max-w-md">
            <EditableText
              storeKey="start.hero.descricao"
              defaultValue="Esse portal é o seu mapa. Aqui você encontra cultura, processos, métricas, padrinhos e tudo que precisa para chegar lá rápido e bem."
              multiline
              className="text-white/90"
            />
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-white/80">
            <span>👋 Padrinhos de plantão: <strong className="text-white">
              <EditableText storeKey="start.hero.padrinhos" defaultValue="Joelma & Pedro" className="font-bold text-white" />
            </strong></span>
          </div>
        </div>

        <div className="relative aspect-video rounded-xl bg-black/40 border border-white/20 flex items-center justify-center backdrop-blur">
          <div className="text-center text-white/70">
            <PlayCircle className="h-14 w-14 mx-auto mb-2 opacity-60" />
            <p className="text-sm">
              <EditableText storeKey="start.hero.videoLegenda" defaultValue="Vídeo de boas-vindas do CEO" className="text-sm" />
            </p>
            <p className="text-xs text-white/50">(o gestor pode trocar este vídeo no Modo Edição)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
