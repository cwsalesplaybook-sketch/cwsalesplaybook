/** Sino de notificações — painel lateral com mural de avisos */
import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, X, Megaphone } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Swords, Target, Calendar, Sparkles, Trophy } from 'lucide-react';
import { useMuralNotifications } from '@/hooks/useMuralNotifications';
import { useEditableContent } from '@/store/contentStore';
import { AVISOS_PADRAO, type Aviso } from '@/data/avisos';
import { cn } from '@/lib/utils';

const ICON_MAP = { BookOpen, Swords, Target, Megaphone, Calendar, Sparkles, Trophy } as const;

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const avisos = useEditableContent<Aviso[]>('dashboard.avisos', AVISOS_PADRAO);
  const { unreadCount, markOneRead, markAllRead, isRead } = useMuralNotifications();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150',
          open
            ? 'bg-[#2d1760] text-white'
            : 'text-[#b89fd4] hover:text-white hover:bg-white/5'
        )}
      >
        <div className="relative shrink-0">
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-0.5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <span className="flex-1 text-left">Avisos</span>
      </button>

      {open && (
        <div
          className="fixed z-50 w-80 rounded-2xl border border-[#ffffff12] shadow-2xl overflow-hidden"
          style={{
            left: '228px',
            top: '76px',
            background: 'linear-gradient(180deg, #1f1040 0%, #150d30 100%)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#ffffff0a]">
            <div className="flex items-center gap-2">
              <Bell className="h-3.5 w-3.5 text-[#9b6fc4]" />
              <span className="text-[12px] font-bold text-white uppercase tracking-wider">Mural de Avisos</span>
              {unreadCount > 0 && (
                <span className="h-4 px-1.5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center">
                  {unreadCount} novo{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-[#9b6fc4] hover:text-white transition-colors"
                >
                  Ler todos
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-[#7c5aa8] hover:text-white transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Lista de avisos */}
          <div className="max-h-80 overflow-y-auto">
            {avisos.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-8 w-8 text-[#3a1a60] mx-auto mb-2" />
                <p className="text-[12px] text-[#7c5aa8]">Nenhum aviso por enquanto.</p>
              </div>
            ) : (
              avisos.map(a => {
                const Icon = ICON_MAP[a.icon] ?? Megaphone;
                const lido = isRead(a.id);
                return (
                  <div
                    key={a.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3.5 border-b border-[#ffffff06] transition-all',
                      lido ? 'opacity-50' : 'bg-[#ffffff03]'
                    )}
                  >
                    <div className="relative shrink-0 mt-0.5">
                      {!lido && (
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 animate-pulse z-10" />
                      )}
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold uppercase text-[#7c5aa8] tracking-wider">{a.badge}</span>
                      <p className="text-[12px] text-[#d4c0ee] leading-snug mt-0.5 line-clamp-3">{a.text}</p>
                    </div>

                    {!lido ? (
                      <button
                        onClick={() => markOneRead(a.id)}
                        title="Marcar como lido"
                        className="shrink-0 mt-1 text-[#7c5aa8] hover:text-emerald-400 transition-colors"
                      >
                        <CheckCheck className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="shrink-0 mt-1 text-emerald-500">
                        <CheckCheck className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <NavLink
            to="/mural"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 py-3 text-[11px] font-semibold text-[#9b6fc4] hover:text-white border-t border-[#ffffff08] transition-colors"
          >
            Ver mural completo →
          </NavLink>
        </div>
      )}
    </div>
  );
}
