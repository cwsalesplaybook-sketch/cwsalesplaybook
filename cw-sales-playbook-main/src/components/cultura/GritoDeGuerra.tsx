/** Botão grande de Grito de Guerra — confete + animação + buzina. */
import confetti from 'canvas-confetti';
import { Megaphone } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function GritoDeGuerra() {
  const [shouting, setShouting] = useState(false);

  const fire = () => {
    setShouting(true);

    // Beep sintético via Web Audio (sem dependência de MP3 externo)
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch { /* no-op */ }

    confetti({
      particleCount: 200,
      spread: 100,
      startVelocity: 45,
      origin: { y: 0.6 },
      colors: ['#760F95', '#9B1AC0', '#FBBC04', '#EA4335', '#ffffff'],
    });

    setTimeout(() => setShouting(false), 1500);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl gradient-hot p-8 text-center">
      <div className="absolute inset-0 gradient-glow pointer-events-none" />
      <div className="relative">
        <p className="text-white/80 text-sm uppercase tracking-wider font-bold mb-2">Grito de Guerra</p>
        <p className={cn(
          'text-3xl md:text-5xl font-black text-white mb-6 transition-transform',
          shouting && 'animate-war-pulse'
        )}>
          <span className="text-cw-yellow">VAMO QUE VAMO,</span> CARDAPINHO!
        </p>
        <button
          onClick={fire}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-cw-purple-dark font-black text-lg hover:scale-105 transition-transform shadow-xl"
        >
          <Megaphone className="h-6 w-6" />
          GRITAR
        </button>
      </div>
    </section>
  );
}
