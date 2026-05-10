/** Banner do Grito de Guerra. */
import { useState } from 'react';
import { Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditableText } from '@/admin/EditableText';

export function GreetingBanner() {
  const [shout, setShout] = useState(false);

  const trigger = () => {
    setShout(true);
    setTimeout(() => setShout(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cw-purple/40 p-8 gradient-hot">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(251,188,4,0.18),_transparent_60%)] pointer-events-none" />
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className={cn(
            'text-3xl md:text-4xl font-black tracking-tight leading-tight transition-transform',
            shout && 'animate-war-pulse'
          )}>
            <span className="text-white">
              <EditableText storeKey="dashboard.greeting.linha1" defaultValue="Toca a buzina. Meta batida." className="text-white" />
            </span>
            <br />
            <span className="text-gradient-gold drop-shadow">
              <EditableText storeKey="dashboard.greeting.linha2" defaultValue="É A CW QUE DOMINAAAAA! 🔥" className="text-gradient-gold" />
            </span>
          </p>
        </div>
        <button
          onClick={trigger}
          className={cn(
            'shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-cw-purple-dark shadow-lg shadow-black/30 transition-all',
            'bg-cw-yellow hover:brightness-110 hover:scale-105',
            shout && 'scale-110'
          )}
        >
          <Megaphone className="h-5 w-5" />
          <EditableText storeKey="dashboard.greeting.botao" defaultValue="GRITAR" className="font-bold" />
        </button>
      </div>
    </div>
  );
}
