/** Sidebar do Closer — layout próprio: perfil no topo, seções agrupadas em
 *  cards e Modo Gestor destacado no rodapé. Navegação hardcoded (não editável). */
import { NavLink } from 'react-router-dom';
import {
  Rocket, Goal, ChartNoAxesCombined, CalendarClock, Trophy, Target, ShieldCheck, Swords,
  Layers, Percent, FileText, Crown, ChevronRight, Link2, LogOut, PartyPopper,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarContext } from '@/context/SidebarContext';
import { useEditor } from '@/admin/EditorContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface CloserNavItem { to: string; label: string; icon: LucideIcon; }

const CLOSER_SECTIONS: { label: string; items: CloserNavItem[] }[] = [
  { label: 'Acompanhamento', items: [
    { to: '/closer/dashboard', label: 'Metas do Mês',         icon: Goal },
    { to: '/closer/rotina',    label: 'Rotina',               icon: CalendarClock },
    { to: '/closer/carreira',  label: 'Progressão de Carreira', icon: ChartNoAxesCombined },
    { to: '/historias',        label: 'Histórias de Sucesso', icon: Trophy },
  ] },
  { label: 'Vendas', items: [
    { to: '/closer/processo',     label: 'Processo de Venda', icon: Target },
    { to: '/closer/objecoes',     label: 'Objeções',          icon: ShieldCheck },
    { to: '/closer/concorrentes', label: 'Concorrentes',      icon: Swords },
    { to: '/closer/planos',       label: 'Planos e Preços',   icon: Layers },
    { to: '/closer/descontos',    label: 'Descontos',         icon: Percent },
  ] },
  { label: 'Materiais', items: [
    { to: '/closer/templates', label: 'Templates', icon: FileText },
  ] },
];

/** Título com linha decorativa — `centered` põe linhas dos dois lados. */
function SectionTitle({ children, centered }: { children: string; centered?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 px-1">
      {centered && <span className="flex-1 h-px bg-[#7c5aa8]/40" />}
      <p className={cn(
        'text-[10px] font-bold uppercase text-[#a98bd6]',
        centered ? 'tracking-[0.3em]' : 'tracking-[0.22em]',
      )}>
        {children}
      </p>
      <span className="flex-1 h-px bg-[#7c5aa8]/40" />
    </div>
  );
}

export function CloserSidebar() {
  const { papel, squad, squadsLideradas, apelido, onboardingActive, papelReady } = useSidebarContext();
  const { isEditing, isGestor } = useEditor();
  const { logout } = useAuth();
  const userProfile = useUserProfile();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copiado' });
    } catch {
      toast({ title: 'Não foi possível copiar o link', variant: 'destructive' });
    }
  };

  return (
    <aside
      className="w-[220px] shrink-0 flex flex-col h-screen sticky top-0 z-30 border-r border-[#ffffff08] overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg, #1a0f2e 0%, #130a22 100%)' }}
    >
      {/* Brilho roxo do canto superior */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-[#6b2bd9]/25 blur-3xl" />

      {/* Onda decorativa do rodapé — atrás de tudo, não recebe cliques */}
      <svg
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 w-full h-[130px] z-0"
        viewBox="0 0 220 130"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="closer-wave-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A23AFF" />
            <stop offset="45%" stopColor="#8C2CF5" />
            <stop offset="100%" stopColor="#4B1499" />
          </linearGradient>
          <radialGradient id="closer-wave-glow" cx="0.85" cy="0.3" r="0.45">
            <stop offset="0%" stopColor="#C77DFF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#C77DFF" stopOpacity="0" />
          </radialGradient>
          <filter id="closer-wave-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        {/* Camada de fundo, bem sutil, para dar profundidade */}
        <path d="M0 34 C 45 26, 85 44, 125 58 C 165 72, 195 46, 220 26 V130 H0 Z" fill="#8C2CF5" opacity="0.16" />
        {/* Halo suave atrás da crista da direita */}
        <ellipse cx="190" cy="44" rx="50" ry="22" fill="#A23AFF" opacity="0.35" filter="url(#closer-wave-blur)" />
        {/* Onda principal */}
        <path d="M0 50 C 38 40, 72 54, 110 72 C 150 90, 185 68, 220 42 V130 H0 Z" fill="url(#closer-wave-fill)" />
        <path d="M0 50 C 38 40, 72 54, 110 72 C 150 90, 185 68, 220 42 V130 H0 Z" fill="url(#closer-wave-glow)" />
      </svg>

      {/* ── Logo ── */}
      <div className="relative px-4 pt-5 pb-3 space-y-3">
        <div className="bg-white rounded-2xl px-3 py-2.5 flex items-center justify-center shadow-lg">
          <img
            src="https://cardapioweb.com/wp-content/uploads/2024/01/Logo-Cardapio-Web.png"
            alt="Cardápio Web"
            className="h-7 w-auto object-contain"
          />
        </div>
        <SectionTitle centered>Time Comercial</SectionTitle>
      </div>

      <nav className="relative flex-1 px-3 pb-2 overflow-y-auto scrollbar-cw space-y-4">

        {/* ── Perfil ── */}
        <div className="flex items-center gap-2 px-2.5 py-2.5 rounded-2xl bg-white/[0.03] border border-[#7c5aa8]/25">
          {userProfile.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.fullName ?? ''}
              className="h-9 w-9 rounded-full object-cover shrink-0 border border-white/10"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#7b2fd6] to-[#4a0080] flex items-center justify-center text-[12px] font-black text-white shrink-0 shadow-[0_0_12px_rgba(123,47,214,0.45)]">
              {userProfile.initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white truncate leading-tight">
              {apelido ?? userProfile.fullName ?? 'Usuário'}
            </p>
            <p className="text-[10px] text-[#9b84b8] truncate leading-tight">
              {papel}{squad ? ` · Squad ${squad}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-0.5 pl-1.5 border-l border-[#7c5aa8]/25">
            <button
              onClick={copyLink}
              title="Copiar link da página"
              className="h-6 w-6 rounded-md flex items-center justify-center text-[#b89fd4] hover:text-white hover:bg-white/5"
            >
              <Link2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => logout()}
              title="Sair"
              className="h-6 w-6 rounded-md flex items-center justify-center text-[#b89fd4] hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ── Comece Aqui ── */}
        <NavLink
          to="/start"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl font-bold text-[13px] text-[#1a0020] transition-all duration-150 hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #f5a623 0%, #f7b440 100%)', boxShadow: '0 4px 16px rgba(245,166,35,0.35)' }}
        >
          <Rocket className="h-[18px] w-[18px] shrink-0" />
          <span className="flex-1">Comece Aqui</span>
          <ChevronRight className="h-4 w-4" />
        </NavLink>

        {/* Enquanto o papel real (auth) ainda não carregou, não renderiza a nav. */}
        {!papelReady ? (
          <div className="space-y-1.5">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 rounded-xl cw-shimmer" />)}
          </div>
        ) : CLOSER_SECTIONS.map(section => (
          <div key={section.label} className="space-y-2">
            <SectionTitle>{section.label}</SectionTitle>
            <div className="rounded-2xl bg-white/[0.03] border border-[#7c5aa8]/20 p-1">
              {section.items.map((item, i) => {
                // Gestores em modo edição não ficam bloqueados pelo onboarding
                const locked = onboardingActive && !isEditing;
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={locked ? '/start' : item.to}
                    className={({ isActive }) => cn(
                      'relative flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] transition-all duration-150',
                      i > 0 && !isActive && 'before:absolute before:top-0 before:left-2.5 before:right-2.5 before:h-px before:bg-[#7c5aa8]/15',
                      locked
                        ? 'text-[#4a3560] cursor-not-allowed pointer-events-none'
                        : isActive
                          ? 'bg-gradient-to-r from-[#4b1d96] to-[#6a2bc4] text-white font-semibold shadow-[0_2px_12px_rgba(106,43,196,0.35)]'
                          : 'text-[#d6c6ec] font-medium hover:text-white hover:bg-white/5',
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && !locked && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-cw-yellow" />
                        )}
                        <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-white' : 'text-[#b89fd4]')} />
                        <span className="flex-1 truncate">{item.label}</span>
                        <ChevronRight className={cn('h-3.5 w-3.5 shrink-0', isActive ? 'text-white' : 'text-[#7c5aa8]')} />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        {/* Painel de Controle — exclusivo do Modo Gestor */}
        {isEditing && (
          <NavLink
            to="/painel"
            className={({ isActive }) => cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all border',
              isActive
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                : 'bg-amber-400/5 text-amber-400/80 hover:bg-amber-400/15 hover:text-amber-300 border-amber-400/15'
            )}
          >
            <ShieldCheck className="h-[18px] w-[18px] shrink-0" />
            <span className="flex-1">Painel de Controle</span>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          </NavLink>
        )}
      </nav>

      {/* ── Footer ── */}
      <div className="relative z-10 px-3 pb-3 pt-1 space-y-1.5">
        {/* Promoções — visível só para quem lidera squad */}
        {squadsLideradas.length > 0 && (
          <NavLink
            to="/promocoes"
            className={({ isActive }) => cn(
              'w-full flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all',
              isActive
                ? 'text-cw-purple-light bg-cw-purple/15'
                : 'text-cw-purple-light/70 hover:text-cw-purple-light hover:bg-cw-purple/10'
            )}
          >
            <PartyPopper className="h-3 w-3 shrink-0" />
            <span>Promoções</span>
          </NavLink>
        )}

        {/* Modo Gestor — visível só para gestores */}
        {isGestor && (
          <NavLink
            to="/modo-gestor"
            className={({ isActive }) => cn(
              'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-[13px] font-bold border transition-all',
              isActive
                ? 'text-amber-300 bg-amber-400/15 border-amber-400/40'
                : 'text-amber-400 bg-amber-400/[0.04] border-amber-400/25 hover:bg-amber-400/10'
            )}
          >
            <Crown className="h-[18px] w-[18px] shrink-0" />
            <span className="flex-1">Modo Gestor</span>
            <ChevronRight className="h-4 w-4" />
          </NavLink>
        )}

        {/* Cardapinho sobre a onda — some em telas baixas pra não apertar o menu */}
        <div className="pointer-events-none flex justify-center pt-3 [@media(max-height:760px)]:hidden">
          <img
            src="/cardapinho-trofeu-delivery.webp"
            alt=""
            className="w-[150px] h-auto drop-shadow-[0_6px_14px_rgba(18,5,31,0.45)]"
          />
        </div>
      </div>
    </aside>
  );
}
