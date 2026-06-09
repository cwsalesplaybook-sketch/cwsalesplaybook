/** Sidebar — visual idêntico ao print de referência. */
import { NavLink } from 'react-router-dom';
import {
  BookOpen, LayoutDashboard, Calendar, BarChart2, Heart, Map as MapIcon,
  TrendingUp, BarChart3, Sword, Sparkles, Award, Lock, Plus, Trash2,
  ArrowUp, ArrowDown, ChevronRight, ChevronDown, Trophy, Target,
  HelpCircle, Zap, ShieldCheck, Calculator,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarContext, type Papel } from '@/context/SidebarContext';
import { useEditor } from '@/admin/EditorContext';
import { useContentStore, useEditableContent } from '@/store/contentStore';
import { EditableText } from '@/admin/EditableText';
import { toast } from '@/hooks/use-toast';
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

const STORE_KEY = 'sidebar.nav';

export function Sidebar() {
  const { papel, setPapel } = useSidebarContext();
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
  const add      = () => update([...items, { to: `/nova-${Date.now()}`, label: 'Nova aba', icon: 'Sparkles', end: false }]);
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

  /* ── Nav item reutilizável ── */
  const NavItemEl = ({ item }: { item: NavItem }) => {
    const idx = items.indexOf(item);
    const Icon = ICON_MAP[item.icon] ?? Sparkles;
    return (
      <div className="group/nav relative">
        <NavLink
          to={item.to}
          end={item.end}
          className={({ isActive }) => cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150',
            isActive
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
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <button onClick={() => move(idx, -1)} disabled={idx === 0} className="h-5 w-5 rounded bg-[#2a0040] border border-[#3a1050] flex items-center justify-center disabled:opacity-30 hover:bg-white/10"><ArrowUp className="h-3 w-3" /></button>
            <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="h-5 w-5 rounded bg-[#2a0040] border border-[#3a1050] flex items-center justify-center disabled:opacity-30 hover:bg-white/10"><ArrowDown className="h-3 w-3" /></button>
            <button onClick={() => remove(idx)} className="h-5 w-5 rounded bg-red-900/30 border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-900/50"><Trash2 className="h-3 w-3" /></button>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-[220px] shrink-0 flex flex-col h-screen sticky top-0 border-r border-[#ffffff08]"
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

        {isEditing && (
          <button onClick={add} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#9b6fc4] border border-dashed border-[#9b6fc4]/30 hover:bg-white/5 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Nova aba
          </button>
        )}
      </nav>

      {/* ── Footer ── */}
      <div className="px-3 pb-4 space-y-2">

        {/* Painel Admin — só visível no Modo Gestor */}
        {isEditing && (
          <NavLink
            to="/admin"
            className={({ isActive }) => cn(
              'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150',
              isActive
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'bg-amber-400/5 text-amber-400/80 hover:bg-amber-400/15 hover:text-amber-300 border border-amber-400/15'
            )}
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Painel Admin</span>
            <ChevronRight className="h-3.5 w-3.5 opacity-40" />
          </NavLink>
        )}

        {/* Modo Gestor */}
        <button
          onClick={() => (isEditing ? lock() : openPasswordModal())}
          title="Ctrl+Shift+E"
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150',
            isEditing
              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20 hover:bg-amber-400/20'
              : 'bg-[#1e1040] text-[#b89fd4] hover:bg-[#2d1760] hover:text-white border border-transparent'
          )}
        >
          <Lock className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{isEditing ? 'Sair do Modo Gestor' : 'Modo Gestor'}</span>
          <ChevronRight className="h-3.5 w-3.5 opacity-40" />
        </button>

        {/* Visão SDR / Closer */}
        <div>
          <p className="px-1 mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7c5aa8]">Visão</p>
          <div className="flex gap-1 bg-[#0d0018] p-1 rounded-xl border border-[#ffffff08]">
            {(['SDR', 'Closer'] as Papel[]).map(p => (
              <button key={p} onClick={() => setPapel(p)}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-150',
                  papel === p ? 'bg-[#6b21a8] text-white shadow-md' : 'text-[#6a4a80] hover:text-[#b89fd4]'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Perfil do usuário */}
        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#1e1040] border border-[#ffffff08] hover:bg-[#2d1760] transition-colors group"
        >
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
              {userProfile.fullName ?? 'Usuário'}
            </p>
            <p className="text-[10px] text-[#7c5aa8] truncate leading-tight">
              {papel}
            </p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-[#7c5aa8] shrink-0 group-hover:text-white transition-colors" />
        </button>

      </div>
    </aside>
  );
}
