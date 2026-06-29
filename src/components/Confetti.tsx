/** Confetes em canvas — sem dependência externa.
 *  Renderiza enquanto `active` for true; some sozinho ao fim. */
import { useEffect, useRef } from 'react';

interface Particula {
  x: number; y: number; vx: number; vy: number;
  rot: number; vrot: number; size: number; cor: string; forma: 'rect' | 'circ';
}

const CORES = ['#9333ea', '#c084fc', '#f5a623', '#f7b440', '#34d399', '#60a5fa', '#f472b6'];

export function Confetti({ active, durationMs = 4500 }: { active: boolean; durationMs?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    // Sobem de baixo (estouro) e caem com gravidade — "pipipipopo".
    const criar = (): Particula => ({
      x: W() / 2 + (Math.random() - 0.5) * W() * 0.5,
      y: H() + 10,
      vx: (Math.random() - 0.5) * 14,
      vy: -(10 + Math.random() * 14),
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.3,
      size: 6 + Math.random() * 8,
      cor: CORES[(Math.random() * CORES.length) | 0],
      forma: Math.random() > 0.5 ? 'rect' : 'circ',
    });

    let particulas: Particula[] = Array.from({ length: 160 }, criar);
    const inicio = performance.now();
    const gravidade = 0.32;

    const tick = (now: number) => {
      const elapsed = now - inicio;
      ctx.clearRect(0, 0, W(), H());

      // Pequenas rajadas extras nos primeiros instantes.
      if (elapsed < 900 && Math.random() > 0.6) particulas.push(...Array.from({ length: 24 }, criar));

      particulas.forEach(p => {
        p.vy += gravidade;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.rot += p.vrot;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.cor;
        const fade = Math.max(0, 1 - (elapsed - durationMs * 0.6) / (durationMs * 0.4));
        ctx.globalAlpha = elapsed > durationMs * 0.6 ? fade : 1;
        if (p.forma === 'rect') ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      });

      particulas = particulas.filter(p => p.y < H() + 40);

      if (elapsed < durationMs && particulas.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, W(), H());
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active, durationMs]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998, width: '100vw', height: '100vh' }}
    />
  );
}

export default Confetti;
