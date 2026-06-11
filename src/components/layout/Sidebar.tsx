/** Sidebar — visual idêntico ao print de referência. */
import { NavLink } from 'react-router-dom';
import {
  BookOpen, LayoutDashboard, Calendar, BarChart2, Heart, Map as MapIcon,
  TrendingUp, BarChart3, Sword, Sparkles, Award, Lock,
  ArrowUp, ArrowDown, ChevronRight, ChevronDown, Trophy, Target,
  HelpCircle, Zap, ShieldCheck, Calculator, LogOut, Trash2,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarContext, type Papel } from '@/context/SidebarContext';
import { useEditor } from '@/admin/EditorContext';
import { useContentStore, useEditableContent } from '@/store/contentStore';
import { EditableText } from '@/admin/EditableText';
import { toast } from '@/hooks/use-toast';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';

interface NavItem { to: string; label: string; icon: keyof typeof ICON_MAP; end?: boolean; }

const ICON_MAP = {
  Sparkles, BookOpen, LayoutDashboard, Calendar, BarChart2, Heart, MapIcon,
  Award, TrendingUp, BarChart3, Sword, Trophy, Target, HelpCircle, Zap, ShieldCheck, Calculator,
} as const satisfies Record<string, LucideIcon>;
const ICON_KEYS = Object.keys(ICON_MAP) as (keyof typeof ICON_MAP)[];

const NAV_PADRAO: NavItem[] = [
  { to: '/start',      label: 'Comece Aqui',  icon: 'Sparkles',        end: false },
  { to: '/meta',       label: 'Meta do Mês',  icon: 'Target',          end: false },
  { to: '/playbook',   label: 'Playbook',     icon: 'BookOpen',        end: false },
  { to: '/',         label: 'Sales Enablement', icon: 'LayoutDashboard', end: true  },
  { to: '/pipeline', label: 'Pipeline',          icon: 'BarChart2',       end: false },
  { to: '/cultura',    label: 'Cultura',           icon: 'Heart',       end: false },
  { to: '/historias',  label: 'Histórias de Sucesso', icon: 'Trophy',  end: false },
  { to: '/onboarding', label: 'Onboarding',        icon: 'MapIcon',    end: false },
  { to: '/carreira',   label: 'Progressão de Carreira', icon: 'TrendingUp', end: false },
  { to: '/gestao',     label: 'Gestão',       icon: 'BarChart3',       end: false },
  { to: '/berserker',  label: 'Berserker',    icon: 'Sword',           end: false },
];

const SECTIONS = [
  { label: 'Comercial',      routes: ['/meta', '/playbook', '/', '/pipeline'] },
  { label: 'Cultura e Time', routes: ['/cultura', '/historias', '/onboarding', '/carreira'] },
  { label: 'Gestão',         routes: ['/gestao', '/berserker'] },
];

/** Mapeamento de papel → rota do playbook */
const PLAYBOOK_ROUTE: Record<Papel, string> = {
  'SDR':           '/playbook',
  'Closer':        '/playbook/closer',
  'Parcerias':     '/playbook/parcerias',
  'Representante': '/playbook/representantes',
  'Liderança':     '/playbook',
};

/** Opções do seletor de playbooks */
const PLAYBOOK_OPTIONS: { label: string; to: string; roles: Papel[] | 'all' }[] = [
  { label: 'Playbook de SDR',             to: '/playbook',                roles: ['SDR', 'Liderança'] },
  { label: 'Playbook de Closer',          to: '/playbook/closer',         roles: ['Closer', 'Liderança'] },
  { label: 'Playbook de Parcerias',       to: '/playbook/parcerias',      roles: ['Parcerias', 'Liderança'] },
  { label: 'Playbook de Representantes',  to: '/playbook/representantes', roles: ['Representante', 'Liderança'] },
];

const STORE_KEY = 'sidebar.nav';

export function Sidebar() {
  const { papel, lockedPapel, squad, apelido, onboardingActive } = useSidebarContext();
  const { isEditing, openPasswordModal, lock } = useEditor();
  const userProfile = useUserProfile();
  const rawItems = useEditableContent<NavItem[]>(STORE_KEY, NAV_PADRAO);
  // Remove /mural do sidebar — o sino de avisos fica no canto superior direito
  const items = rawItems.filter(i => i.to !== '/mural');
  const saveOverride = useContentStore((s) => s.saveOverride);
  const update = async (next: NavItem[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) { toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };
  const remove   = (idx: number) => update(items.filter((_, i) => i !== idx));
  const move     = (idx: number, dir: -1 | 1) => {
    const t = idx + dir;
    if (t < 0 || t >= items.length) return;
    const next = [...items]; [next[idx], next[t]] = [next[t], next[idx]]; update(next);
  };
  const cycleIcon = (idx: number) => {
    const cur = ICON_KEYS.indexOf(items[idx].icon);
    const next = [...items]; next[idx] = { ...next[idx], icon: ICON_KEYS[(cur + 1) % ICON_KEYS.length] }; update(next);
  };

  const startItem        = items.find(i => i.to === '/start');
  const sectionItems     = (routes: string[]) => items.filter(i => routes.includes(i.to));
  const allSectionRoutes = SECTIONS.flatMap(s => s.routes);

  // Playbooks visíveis no seletor: Liderança ou gestor vê todos; demais, só o seu
  const visiblePlaybooks = (papel === 'Liderança' || isEditing)
    ? PLAYBOOK_OPTIONS
    : PLAYBOOK_OPTIONS.filter(opt => (opt.roles as Papel[]).includes(papel));

  /* ── Nav item reutilizável ── */
  const NavItemEl = ({ item }: { item: NavItem }) => {
    const idx = items.indexOf(item);
    const Icon = ICON_MAP[item.icon] ?? Sparkles;
    // Gestores em modo edição não ficam bloqueados pelo onboarding
    const locked = onboardingActive && item.to !== '/start' && !isEditing;
    // Rota dinâmica: item /playbook aponta para o playbook do papel do usuário
    const resolvedTo = item.to === '/playbook' ? PLAYBOOK_ROUTE[papel] : item.to;
    return (
      <div className="group/nav relative">
        <NavLink
          to={locked ? '/start' : resolvedTo}
          end={item.end}

          className={({ isActive }) => cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150',
            locked
              ? 'text-[#4a3560] cursor-not-allowed pointer-events-none'
              : isActive
                ? 'bg-[#2d1760] text-white font-semibold'
                : 'text-[#b89fd4] hover:text-white hover:bg-white/5'
          )}
        >
          <button type="button"
            onClick={isEditing ? e => { e.preventDefault(); e.stopPropagation(); cycleIcon(idx); } : undefined}
            disabled={!isEditing}
            className={cn('shrink-0 relative', isEditing && 'cursor-pointer hover:scale-110')}
          >
            <Icon className="h-[18px] w-[18px]" />
          </button>
          {isEditing
            ? <EditableText storeKey={`${STORE_KEY}.${idx}.label`} defaultValue={item.label} className="text-[13px] font-medium flex-1" />
            : <span className="flex-1">{item.label}</span>
          }
        </NavLink>
        {isEditing && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-150">
            <button onClick={() => move(idx, -1)} disabled={idx === 0} className="h-4 w-4 rounded bg-[#2a0040] border border-[#3a1050] flex items-center justify-center disabled:opacity-30 hover:bg-white/10"><ArrowUp className="h-2.5 w-2.5" /></button>
            <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="h-4 w-4 rounded bg-[#2a0040] border border-[#3a1050] flex items-center justify-center disabled:opacity-30 hover:bg-white/10"><ArrowDown className="h-2.5 w-2.5" /></button>
            <button onClick={() => remove(idx)} className="h-4 w-4 rounded bg-red-900/30 border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-900/50"><Trash2 className="h-2.5 w-2.5" /></button>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-[220px] shrink-0 flex flex-col h-screen sticky top-0 z-30 border-r border-[#ffffff08] overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1a0f2e 0%, #130a22 100%)' }}
    >

      {/* ── Logo ── */}
      <div className="px-4 pt-5 pb-2">
        <div className="bg-white rounded-2xl px-3 py-2.5 flex items-center justify-center mb-3">
          <img
            src="https://cardapioweb.com/wp-content/uploads/2024/01/Logo-Cardapio-Web.png"
            alt="Cardápio Web"
            className="h-7 w-auto object-contain"
          />
        </div>
        <p className="text-center text-[10px] text-[#7c5aa8] uppercase tracking-[0.2em] font-bold">
          <EditableText storeKey="sidebar.subtitle" defaultValue="Time e Comercial" className="text-[10px] uppercase tracking-[0.2em]" />
        </p>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-cw space-y-4">

        {/* Comece Aqui */}
        {startItem && (() => {
          const idx = items.indexOf(startItem);
          const Icon = ICON_MAP[startItem.icon] ?? Sparkles;
          return (
            <div className="group/nav relative">
              <NavLink
                to={startItem.to}
                end={startItem.end}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl font-bold text-[13px] text-[#1a0020] transition-all duration-150 hover:brightness-110 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #f5a623 0%, #f7b440 100%)', boxShadow: '0 4px 14px rgba(245,166,35,0.30)' }}
              >
                <button type="button"
                  onClick={isEditing ? e => { e.preventDefault(); e.stopPropagation(); cycleIcon(idx); } : undefined}
                  disabled={!isEditing}
                  className={cn('shrink-0', isEditing && 'cursor-pointer hover:scale-110')}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </button>
                {isEditing
                  ? <EditableText storeKey={`${STORE_KEY}.${idx}.label`} defaultValue={startItem.label} className="text-[13px] font-bold flex-1" />
                  : <span className="flex-1">{startItem.label}</span>
                }
                <ChevronRight className="h-4 w-4 opacity-60" />
              </NavLink>
            </div>
          );
        })()}

        {/* Seções */}
        {SECTIONS.map(section => {
          const sItems = sectionItems(section.routes);
          if (sItems.length === 0) return null;
          return (
            <div key={section.label}>
              <p className="px-1 mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7c5aa8]">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {sItems.map(item => <NavItemEl key={item.to} item={item} />)}
              </div>
            </div>
          );
        })}

        {/* Extras fora das seções */}
        {items.filter(i => i.to !== '/start' && !allSectionRoutes.includes(i.to)).map(item => (
          <NavItemEl key={item.to} item={item} />
        ))}

        {/* Painel de Controle — aba exclusiva do Modo Gestor */}
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
      <div className="px-3 pb-4 space-y-1.5">

        {/* Seletor de Playbooks */}
        {visiblePlaybooks.length > 0 && (
          <div className="mb-0.5">
            <p className="px-1 mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7c5aa8]">Playbook</p>
            <div className="flex flex-col gap-0.5">
              {visiblePlaybooks.map(opt => (
                <NavLink
                  key={opt.to}
                  to={opt.to}
                  end
                  className={({ isActive }) => cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150',
                    isActive
                      ? 'bg-[#6b21a8] text-white shadow-md'
                      : 'text-[#6a4a80] hover:text-[#b89fd4] hover:bg-white/5'
                  )}
                >
                  <BookOpen className="h-3.5 w-3.5 shrink-0" />
                  {opt.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Modo Gestor — minimal */}
        <button
          onClick={() => (isEditing ? lock() : openPasswordModal())}
          title="Ctrl+Shift+E"
          className={cn(
            'w-full flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all',
            isEditing
              ? 'text-amber-400/50 hover:text-amber-300/80 hover:bg-amber-400/5'
              : 'text-[#5a3e70] hover:text-[#9b6fc4] hover:bg-white/5'
          )}
        >
          <Lock className="h-3 w-3 shrink-0" />
          <span>{isEditing ? 'Sair do Modo Gestor' : 'Modo Gestor'}</span>
        </button>

        {/* Sino de notificações */}
        <div className="px-1">
          <NotificationBell />
        </div>

        {/* Perfil do usuário */}
        <div className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#1e1040] border border-[#ffffff08]">
          {userProfile.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.fullName ?? ''}
              className="h-8 w-8 rounded-full object-cover shrink-0 border border-white/10"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-[#4a0080] flex items-center justify-center text-[11px] font-black text-white shrink-0">
              {userProfile.initials}
            </div>
          )}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[12px] font-semibold text-white truncate leading-tight">
              {apelido ?? userProfile.fullName ?? 'Usuário'}
            </p>
            <p className="text-[10px] text-[#7c5aa8] truncate leading-tight">
              {papel}{squad ? ` · Squad ${squad}` : ''}
            </p>
          </div>
        </div>

        {/* Botão de sair */}
        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut className="h-[16px] w-[16px] shrink-0" />
          <span>Sair</span>
        </button>

      </div>
    </aside>
  );
}
