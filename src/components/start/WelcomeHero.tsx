/** Hero da página Comece por Aqui — boas-vindas com vídeo placeholder. */
import { Sparkles, PlayCircle } from 'lucide-react';
import { EditableText } from '@/admin/EditableText';

export function WelcomeHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl gradient-hot p-7 md:p-8">
      <div className="absolute inset-0 gradient-glow pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

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

        <div className="relative aspect-video rounded-xl bg-black/30 border border-white/20 flex items-center justify-center backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <div className="relative text-center text-white/80">
            <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-2 hover:bg-white/30 transition-colors cursor-pointer">
              <PlayCircle className="h-6 w-6 text-white" />
            </div>
            <p className="text-xs font-medium">
              <EditableText storeKey="start.hero.videoLegenda" defaultValue="Vídeo de boas-vindas do CEO" className="text-xs font-medium" />
            </p>
            <p className="text-[10px] text-white/50 mt-0.5">Dê play para conhecer mais sobre nossa missão e direção</p>
          </div>
        </div>
      </div>
    </section>
  );
}
