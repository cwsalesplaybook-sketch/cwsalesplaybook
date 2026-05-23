/** Sidebar fixa com navegação editável (CRUD via Modo Gestor) + toggle SDR/Closer + gatilho do Modo Gestor. */
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpen, LayoutDashboard, Calendar, BarChart2, Heart, Map as MapIcon,
  TrendingUp, BarChart3, Sword, Sparkles, Award, Lock, Plus, Trash2, ArrowUp, ArrowDown,
  ChevronDown, Shield, ExternalLink,
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

interface ArsenalSubItem {
  id: string;
  label: string;
  href: string;
  external: boolean;
  icon: keyof typeof ICON_MAP;
}

const ICON_MAP = {
  Sparkles, BookOpen, LayoutDashboard, Calendar, BarChart2, Heart, MapIcon,
  Award, TrendingUp, BarChart3, Sword,
} as const satisfies Record<string, LucideIcon>;
const ICON_KEYS = Object.keys(ICON_MAP) as (keyof typeof ICON_MAP)[];

const NAV_PADRAO: NavItem[] = [
  { to: '/start',      label: 'Comece Aqui', icon: 'Sparkles',        end: false },
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
];

const ARSENAL_KEY = 'sidebar.arsenal';
const ARSENAL_PADRAO: ArsenalSubItem[] = [
  { id: 'planos', label: 'Planos',            href: '/arsenal/planos', external: false, icon: 'BookOpen'  },
  { id: 'links',  label: 'Links Importantes', href: '/arsenal/links',  external: false, icon: 'BarChart2' },
];

const STORE_KEY = 'sidebar.nav';

export function Sidebar() {
  const { papel, setPapel } = useSidebarContext();
  const { isEditing, openPasswordModal, lock } = useEditor();
  const items = useEditableContent<NavItem[]>(STORE_KEY, NAV_PADRAO);
  const arsenalItems = useEditableContent<ArsenalSubItem[]>(ARSENAL_KEY, ARSENAL_PADRAO);
  const saveOverride = useContentStore((s) => s.saveOverride);
  const [arsenalOpen, setArsenalOpen] = useState(false);

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

  const updateArsenal = async (next: ArsenalSubItem[]) => {
    try { await saveOverride(ARSENAL_KEY, next); }
    catch (e) { toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };
  const addArsenalItem = () => updateArsenal([
    ...arsenalItems,
    { id: `item-${Date.now()}`, label: 'Novo item', href: '/arsenal/novo', external: false, icon: 'Sparkles' },
  ]);
  const removeArsenalItem = (id: string) => updateArsenal(arsenalItems.filter((i) => i.id !== id));
  const cycleArsenalIcon = (id: string) => {
    const idx = arsenalItems.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const cur = ICON_KEYS.indexOf(arsenalItems[idx].icon);
    const next = [...arsenalItems];
    next[idx] = { ...next[idx], icon: ICON_KEYS[(cur + 1) % ICON_KEYS.length] };
    updateArsenal(next);
  };
  const toggleArsenalExternal = (id: string) =>
    updateArsenal(arsenalItems.map((i) => (i.id === id ? { ...i, external: !i.external } : i)));

  return (
    <aside className="w-[240px] shrink-0 gradient-surface border-r border-cw-border flex flex-col h-screen sticky top-0">
      <div className="relative px-5 pt-6 pb-4 border-b border-cw-border">
        <div className="absolute inset-0 gradient-glow pointer-events-none" />
        <div className="relative">
          <img
            src="https://cardapioweb.com/wp-content/uploads/2024/01/Logo-Cardapio-Web.png"
            alt="Cardápio Web"
            className="h-8 w-auto object-contain mb-2"
          />
          <p className="text-xs text-cw-muted uppercase tracking-wider font-medium">
            <EditableText storeKey="sidebar.subtitle" defaultValue="Time Comercial" className="text-xs uppercase tracking-wider" />
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-cw">
        {items.map((item, idx) => {
          const Icon = ICON_MAP[item.icon] ?? Sparkles;
          const isStart = item.to === '/start';
          return (
            <div key={item.to} className="group/nav relative">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 border-l-2',
                    isActive
                      ? 'bg-cw-elevated text-cw-purple-light border-cw-purple'
                      : 'border-transparent text-cw-muted hover:text-cw-text hover:bg-cw-elevated',
                    isStart && !isEditing && 'bg-cw-yellow/10 text-cw-yellow'
                  )
                }
              >
                <button
                  type="button"
                  onClick={isEditing ? (e) => { e.preventDefault(); e.stopPropagation(); cycleIcon(idx); } : undefined}
                  disabled={!isEditing}
                  className={cn('shrink-0', isEditing && 'cursor-pointer hover:scale-110')}
                  title={isEditing ? 'Clique para trocar o ícone' : undefined}
                >
                  <Icon className="h-4 w-4" />
                </button>
                {isEditing ? (
                  <EditableText
                    storeKey={`${STORE_KEY}.${idx}.label`}
                    defaultValue={item.label}
                    className="text-sm font-medium flex-1"
                  />
                ) : (
                  <span className="flex-1">{item.label}</span>
                )}
              </NavLink>
              {isEditing && (
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover/nav:opacity-100 transition-opacity">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0} title="Subir" className="h-5 w-5 rounded bg-cw-bg border border-cw-border flex items-center justify-center disabled:opacity-30 hover:bg-cw-purple/20">
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} title="Descer" className="h-5 w-5 rounded bg-cw-bg border border-cw-border flex items-center justify-center disabled:opacity-30 hover:bg-cw-purple/20">
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button onClick={() => remove(idx)} title="Remover" className="h-5 w-5 rounded bg-cw-red/20 border border-cw-red/40 text-cw-red flex items-center justify-center hover:bg-cw-red/30">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {isEditing && (
          <button
            onClick={add}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-cw-purple-light border border-dashed border-cw-purple-light/40 hover:bg-cw-purple-light/10 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Nova aba
          </button>
        )}

        {/* Arsenal da Águia */}
        <div className="pt-3">
          <p className="px-3 mb-1 text-[10px] text-cw-muted uppercase tracking-wider font-semibold">
            Recursos
          </p>
          <button
            onClick={() => setArsenalOpen((o) => !o)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 border-l-2 border-transparent text-cw-muted hover:text-cw-text hover:bg-cw-elevated"
          >
            <Shield className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Arsenal da Águia</span>
            <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', arsenalOpen && 'rotate-180')} />
          </button>

          {arsenalOpen && (
            <div className="ml-3 mt-1 space-y-0.5 border-l border-cw-border pl-3">
              {arsenalItems.map((item) => {
                const Icon = ICON_MAP[item.icon] ?? Sparkles;
                const baseCls = 'flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium transition-colors duration-150 w-full text-left';
                return (
                  <div key={item.id} className="group/arsenal relative">
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(baseCls, 'text-cw-muted hover:text-cw-text hover:bg-cw-elevated')}
                      >
                        <button
                          type="button"
                          onClick={isEditing ? (e) => { e.preventDefault(); e.stopPropagation(); cycleArsenalIcon(item.id); } : undefined}
                          disabled={!isEditing}
                          className={cn('shrink-0', isEditing && 'cursor-pointer hover:scale-110')}
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                        {isEditing ? (
                          <EditableText storeKey={`${ARSENAL_KEY}.${item.id}.label`} defaultValue={item.label} className="text-sm font-medium flex-1" />
                        ) : (
                          <span className="flex-1">{item.label}</span>
                        )}
                        <ExternalLink className="h-3 w-3 opacity-40 shrink-0" />
                      </a>
                    ) : (
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          cn(baseCls, isActive
                            ? 'text-cw-purple-light bg-cw-elevated border-l-2 border-cw-purple -ml-[1px] pl-[calc(0.5rem+1px)]'
                            : 'text-cw-muted hover:text-cw-text hover:bg-cw-elevated'
                          )
                        }
                      >
                        <button
                          type="button"
                          onClick={isEditing ? (e) => { e.preventDefault(); e.stopPropagation(); cycleArsenalIcon(item.id); } : undefined}
                          disabled={!isEditing}
                          className={cn('shrink-0', isEditing && 'cursor-pointer hover:scale-110')}
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                        {isEditing ? (
                          <EditableText storeKey={`${ARSENAL_KEY}.${item.id}.label`} defaultValue={item.label} className="text-sm font-medium flex-1" />
                        ) : (
                          <span className="flex-1">{item.label}</span>
                        )}
                      </NavLink>
                    )}

                    {isEditing && (
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover/arsenal:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleArsenalExternal(item.id)}
                          title={item.external ? 'Tornar interno' : 'Tornar link externo'}
                          className="h-5 w-5 rounded bg-cw-bg border border-cw-border flex items-center justify-center hover:bg-cw-purple/20"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeArsenalItem(item.id)}
                          title="Remover"
                          className="h-5 w-5 rounded bg-cw-red/20 border border-cw-red/40 text-cw-red flex items-center justify-center hover:bg-cw-red/30"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {isEditing && (
                <button
                  onClick={addArsenalItem}
                  className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold text-cw-purple-light border border-dashed border-cw-purple-light/40 hover:bg-cw-purple-light/10 transition-colors"
                >
                  <Plus className="h-3 w-3" /> Novo item
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      <div className="border-t border-cw-border p-4 space-y-3">
        <button
          onClick={() => (isEditing ? lock() : openPasswordModal())}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
            isEditing
              ? 'bg-cw-yellow/15 text-cw-yellow hover:bg-cw-yellow/25'
              : 'text-cw-muted hover:text-cw-text hover:bg-cw-elevated'
          )}
          title="Ctrl+Shift+E"
        >
          <Lock className="h-3.5 w-3.5" />
          {isEditing ? 'Sair do Modo Gestor' : 'Modo Gestor'}
        </button>

        <div>
          <p className="text-[10px] text-cw-muted uppercase tracking-wider font-semibold mb-2">
            Visão
          </p>
          <div className="flex gap-1 bg-cw-bg p-1 rounded-full border border-cw-border">
            {(['SDR', 'Closer'] as Papel[]).map((p) => (
              <button
                key={p}
                onClick={() => setPapel(p)}
                className={cn(
                  'flex-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150',
                  papel === p
                    ? 'gradient-primary text-white shadow-lg shadow-cw-purple/30'
                    : 'text-cw-muted hover:text-cw-text'
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
