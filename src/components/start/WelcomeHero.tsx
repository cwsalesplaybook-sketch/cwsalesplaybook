/** Hero da página Comece por Aqui — boas-vindas com vídeo placeholder. */
import { Sparkles } from 'lucide-react';
import { EditableText } from '@/admin/EditableText';
import { AgentBalls } from '@/components/layout/AgentBalls';

export function WelcomeHero() {
  return (
    <section className="relative rounded-2xl gradient-hot p-6">
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute inset-0 gradient-glow" />
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
      </div>

      {/* Rafael & Agatha brincando de pega-pega pelo banner (só donos) */}
      <div className="absolute inset-0 z-20 overflow-hidden rounded-2xl pointer-events-none">
        <AgentBalls />
      </div>
<div className="relative grid md:grid-cols-2 gap-7 items-center">
        {/* Coluna esquerda — texto */}
        <div className="flex flex-col justify-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-white text-xs font-semibold uppercase tracking-widest border border-white/20 w-fit">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            <EditableText storeKey="start.hero.kicker" defaultValue="Bem-vindo(a) à Cardápio Web" className="text-xs" />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">
            <EditableText
              storeKey="start.hero.titulo"
              defaultValue="Você acaba de se juntar ao time que está revolucionando o mercado de food."
              multiline
              className="text-3xl md:text-4xl lg:text-5xl font-black text-white"
            />
          </h1>

          <p className="text-white/85 leading-relaxed text-base md:text-lg">
            <EditableText
              storeKey="start.hero.descricao"
              defaultValue="Esse portal é o seu mapa. Aqui você encontra cultura, processos, métricas e práticas: tudo o que precisa para chegar lá rápido e bem."
              multiline
              className="text-white/85"
            />
          </p>

          <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full border border-white/20 text-sm text-white/75 w-fit">
            ⭐ Padrinhos de plantão: <strong className="text-white">
              <EditableText storeKey="start.hero.padrinhos" defaultValue="Joelma, Pedro & Anderson" className="font-bold text-white" />
            </strong>
          </span>
        </div>

        {/* Coluna direita — vídeo 16:9 */}
        <div className="relative w-full rounded-xl overflow-hidden border border-white/20 shadow-xl" style={{ paddingTop: '56.25%' }}>
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
