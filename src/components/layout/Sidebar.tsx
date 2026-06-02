/** Sidebar fixa com navegação editável (CRUD via Modo Gestor) + toggle SDR/Closer + gatilho do Modo Gestor. */
import { NavLink } from 'react-router-dom';
import {
  BookOpen, LayoutDashboard, Calendar, BarChart2, Heart, Map as MapIcon,
  TrendingUp, BarChart3, Sword, Sparkles, Award, Lock, Plus, Trash2, ArrowUp, ArrowDown, ChevronRight, Trophy, Target,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarContext, type Papel } from '@/context/SidebarContext';
import { useEditor } from '@/admin/EditorContext';
import { useContentStore, useEditableContent } from '@/store/contentStore';
import { EditableText } from '@/admin/EditableText';
import { toast } from '@/hooks/use-toast';

interface NavItem {
  to: string;
  label: string;
  icon: keyof typeof ICON_MAP;
  end?: boolean;
}

const ICON_MAP = {
  Sparkles, BookOpen, LayoutDashboard, Calendar, BarChart2, Heart, MapIcon,
  Award, TrendingUp, BarChart3, Sword, Trophy, Target,
} as const satisfies Record<string, LucideIcon>;
const ICON_KEYS = Object.keys(ICON_MAP) as (keyof typeof ICON_MAP)[];

const NAV_PADRAO: NavItem[] = [
  { to: '/start',      label: 'Comece Aqui', icon: 'Sparkles',        end: false },
  { to: '/meta',       label: 'Meta do Mês', icon: 'Target',          end: false },
  { to: '/playbook',   label: 'Playbook',    icon: 'BookOpen',        end: false },
  { to: '/',           label: 'Dashboard',   icon: 'LayoutDashboard', end: true  },
  { to: '/agenda',     label: 'Agenda',      icon: 'Calendar',        end: false },
  { to: '/pipeline',   label: 'Pipeline',    icon: 'BarChart2',       end: false },
  { to: '/cultura',    label: 'Cultura',     icon: 'Heart',           end: false },
  { to: '/onboarding', label: 'Onboarding',  icon: 'MapIcon',         end: false },
  { to: '/badges',     label: 'Badges',      icon: 'Award',           end: false },
  { to: '/carreira',   label: 'Carreira',    icon: 'TrendingUp',      end: false },
  { to: '/gestao',     label: 'Gestão',      icon: 'BarChart3',       end: false },
  { to: '/berserker',  label: 'Berserker',   icon: 'Sword',           end: false },
  { to: '/ranking',    label: 'Ranking',     icon: 'Trophy',          end: false },
];

const STORE_KEY = 'sidebar.nav';

export function Sidebar() {
  const { papel, setPapel } = useSidebarContext();
  const { isEditing, openPasswordModal, lock } = useEditor();
  const items = useEditableContent<NavItem[]>(STORE_KEY, NAV_PADRAO);
  const saveOverride = useContentStore((s) => s.saveOverride);

  const update = async (next: NavItem[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) { toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };
  const add = () => update([...items, { to: `/nova-${Date.now()}`, label: 'Nova aba', icon: 'Sparkles', end: false }]);
  const remove = (idx: number) => update(items.filter((_, i) => i !== idx));
  const move = (idx: number, dir: -1 | 1) => {
    const t = idx + dir;
    if (t < 0 || t >= items.length) return;
    const next = [...items];
    [next[idx], next[t]] = [next[t], next[idx]];
    update(next);
  };
  const cycleIcon = (idx: number) => {
    const cur = ICON_KEYS.indexOf(items[idx].icon);
    const next = [...items];
    next[idx] = { ...next[idx], icon: ICON_KEYS[(cur + 1) % ICON_KEYS.length] };
    update(next);
  };

  const SECTIONS = [
    { label: 'Comercial',      routes: ['/playbook', '/', '/agenda', '/pipeline', '/meta'] },
    { label: 'Cultura e Time', routes: ['/cultura', '/onboarding', '/badges', '/carreira'] },
    { label: 'Gestão',         routes: ['/gestao', '/berserker', '/ranking'] },
  ];

  const startItem = items.find((i) => i.to === '/start');
  const sectionItems = (routes: string[]) => items.filter((i) => routes.includes(i.to));
  const allSectionRoutes = SECTIONS.flatMap((s) => s.routes);

  const NavItem = ({ item }: { item: typeof items[0] }) => {
    const idx = items.indexOf(item);
    const Icon = ICON_MAP[item.icon] ?? Sparkles;
    return (
      <div className="group/nav relative">
        <NavLink
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150',
              isActive
                ? 'bg-[#2a0040] text-white font-semibold'
                : 'text-[#c0a8d8] hover:text-white hover:bg-white/5'
            )
          }
        >
          <button
            type="button"
            onClick={isEditing ? (e) => { e.preventDefault(); e.stopPropagation(); cycleIcon(idx); } : undefined}
            disabled={!isEditing}
            className={cn('shrink-0', isEditing && 'cursor-pointer hover:scale-110')}
          >
            <Icon className="h-5 w-5" />
          </button>
          {isEditing ? (
            <EditableText storeKey={`${STORE_KEY}.${idx}.label`} defaultValue={item.label} className="text-[13px] font-medium flex-1" />
          ) : (
            <span className="flex-1">{item.label}</span>
          )}
        </NavLink>
        {isEditing && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover/nav:opacity-100 transition-opacity">
            <button onClick={() => move(idx, -1)} disabled={idx === 0} className="h-5 w-5 rounded bg-cw-bg border border-cw-border flex items-center justify-center disabled:opacity-30 hover:bg-cw-purple/20"><ArrowUp className="h-3 w-3" /></button>
            <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="h-5 w-5 rounded bg-cw-bg border border-cw-border flex items-center justify-center disabled:opacity-30 hover:bg-cw-purple/20"><ArrowDown className="h-3 w-3" /></button>
            <button onClick={() => remove(idx)} className="h-5 w-5 rounded bg-cw-red/20 border border-cw-red/40 text-cw-red flex items-center justify-center hover:bg-cw-red/30"><Trash2 className="h-3 w-3" /></button>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-[250px] shrink-0 flex flex-col h-screen sticky top-0 bg-[#120018] border-r border-[#2a0a3a]">
      {/* Logo */}
      <div className="px-4 pt-4 pb-3">
        <div className="bg-white rounded-2xl px-4 py-3 flex items-center justify-center mb-3">
          <img
            src="https://cardapioweb.com/wp-content/uploads/2024/01/Logo-Cardapio-Web.png"
            alt="Cardápio Web"
            className="h-8 w-auto object-contain"
          />
        </div>
        <p className="text-center text-[11px] text-[#9b6fc4] uppercase tracking-[0.18em] font-bold">
          <EditableText storeKey="sidebar.subtitle" defaultValue="Time Comercial" className="text-[11px] uppercase tracking-[0.18em]" />
        </p>
      </div>

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
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#f5a623] text-[#1a0020] font-bold text-[14px] transition-all duration-150 hover:bg-[#f7b440] shadow-lg shadow-[#f5a623]/20"
              >
                <button
                  type="button"
                  onClick={isEditing ? (e) => { e.preventDefault(); e.stopPropagation(); cycleIcon(idx); } : undefined}
                  disabled={!isEditing}
                  className={cn('shrink-0', isEditing && 'cursor-pointer hover:scale-110')}
                >
                  <Icon className="h-5 w-5" />
                </button>
                {isEditing ? (
                  <EditableText storeKey={`${STORE_KEY}.${idx}.label`} defaultValue={startItem.label} className="text-[14px] font-bold flex-1" />
                ) : (
                  <span className="flex-1">{startItem.label}</span>
                )}
                <ChevronRight className="h-4 w-4 opacity-70" />
              </NavLink>
              {isEditing && (
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover/nav:opacity-100 transition-opacity">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0} className="h-5 w-5 rounded bg-cw-bg border border-cw-border flex items-center justify-center disabled:opacity-30 hover:bg-cw-purple/20"><ArrowUp className="h-3 w-3" /></button>
                  <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="h-5 w-5 rounded bg-cw-bg border border-cw-border flex items-center justify-center disabled:opacity-30 hover:bg-cw-purple/20"><ArrowDown className="h-3 w-3" /></button>
                  <button onClick={() => remove(idx)} className="h-5 w-5 rounded bg-cw-red/20 border border-cw-red/40 text-cw-red flex items-center justify-center hover:bg-cw-red/30"><Trash2 className="h-3 w-3" /></button>
                </div>
              )}
            </div>
          );
        })()}

        {/* Seções agrupadas */}
        {SECTIONS.map((section) => {
          const sItems = sectionItems(section.routes);
          if (sItems.length === 0) return null;
          return (
            <div key={section.label}>
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b4fc8] whitespace-nowrap">
                  {section.label}
                </span>
                <div className="flex-1 h-px bg-[#3a1050]" />
              </div>
              <div className="space-y-0.5">
                {sItems.map((item) => <NavItem key={item.to} item={item} />)}
              </div>
            </div>
          );
        })}

        {/* Itens fora das seções */}
        {items.filter((i) => i.to !== '/start' && !allSectionRoutes.includes(i.to)).map((item) => (
          <NavItem key={item.to} item={item} />
        ))}

        {isEditing && (
          <button onClick={add} className="w-full mt-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-cw-purple-light border border-dashed border-cw-purple-light/30 hover:bg-cw-purple-light/10 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Nova aba
          </button>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 space-y-2">
        <button
          onClick={() => (isEditing ? lock() : openPasswordModal())}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-semibold transition-all duration-150',
            isEditing
              ? 'bg-cw-yellow/10 text-cw-yellow border border-cw-yellow/20 hover:bg-cw-yellow/20'
              : 'bg-[#1e0030] text-[#c0a8d8] hover:bg-[#2a0040] hover:text-white'
          )}
          title="Ctrl+Shift+E"
        >
          <Lock className="h-5 w-5 shrink-0" />
          <span className="flex-1 text-left">{isEditing ? 'Sair do Modo Gestor' : 'Modo Gestor'}</span>
          <ChevronRight className="h-4 w-4 opacity-50" />
        </button>

        <div>
          <p className="px-1 mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6a4a80]">Visão</p>
          <div className="flex gap-1 bg-[#0d0018] p-1 rounded-2xl border border-[#2a0a3a]">
            {(['SDR', 'Closer'] as Papel[]).map((p) => (
              <button
                key={p}
                onClick={() => setPapel(p)}
                className={cn(
                  'flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150',
                  papel === p
                    ? 'bg-[#6b21a8] text-white shadow-md shadow-purple-900/50'
                    : 'text-[#6a4a80] hover:text-[#c0a8d8]'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
