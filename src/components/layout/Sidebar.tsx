/** Sidebar — visual idêntico ao print de referência. */
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen, LayoutDashboard, BarChart2, Heart, Map as MapIcon,
  TrendingUp, BarChart3, Sword, Sparkles, Award, Lock,
  ArrowUp, ArrowDown, ChevronRight, Trophy, Target,
  HelpCircle, Zap, ShieldCheck, Calculator, LogOut, Trash2,
  Loader2, Users, Library, GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarContext, type Papel } from '@/context/SidebarContext';
import { useEditor } from '@/admin/EditorContext';
import { useContentStore, useGlobalEditableContent } from '@/store/contentStore';
import { toast } from '@/hooks/use-toast';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';

interface NavItem { to: string; label: string; icon: keyof typeof ICON_MAP; end?: boolean; }

const ICON_MAP = {
  Sparkles, BookOpen, LayoutDashboard, BarChart2, Heart, MapIcon,
  Award, TrendingUp, BarChart3, Sword, Trophy, Target, HelpCircle, Zap, ShieldCheck, Calculator, Library, GraduationCap,
} as const satisfies Record<string, LucideIcon>;
const ICON_KEYS = Object.keys(ICON_MAP) as (keyof typeof ICON_MAP)[];

const NAV_PADRAO: NavItem[] = [
  { to: '/start',      label: 'Comece Aqui',             icon: 'Sparkles',       end: false },
  { to: '/meta',       label: 'Meta do Mês',             icon: 'Target',         end: false },
  { to: '/playbook',   label: 'Playbook',                icon: 'BookOpen',       end: false },
  { to: '/',           label: 'Sales Enablement',        icon: 'LayoutDashboard',end: true  },
  { to: '/pipeline',    label: 'Pipeline',                icon: 'BarChart2',       end: false },
  { to: '/automacoes',  label: 'Automações',             icon: 'Zap',             end: false },
  { to: '/cultura',     label: 'Cultura',                icon: 'Heart',           end: false },
  { to: '/historias',   label: 'Histórias de Sucesso',   icon: 'Trophy',          end: false },
  { to: '/biblioteca',  label: 'Biblioteca',             icon: 'Library',         end: false },
  { to: '/regras',      label: 'Regras de Conduta',      icon: 'ShieldCheck',     end: false },
  { to: '/onboarding',  label: 'Onboarding',             icon: 'MapIcon',         end: false },
  { to: '/carreira',    label: 'Progressão de Carreira', icon: 'TrendingUp',      end: false },
  { to: '/treinamento', label: 'Treinamento',            icon: 'GraduationCap',   end: false },
  { to: '/gestao',      label: 'Gestão',                 icon: 'BarChart3',       end: false },
  { to: '/berserker',   label: 'Berserker',              icon: 'Sword',           end: false },
];

const SECTIONS = [
  { label: 'Comercial',      routes: ['/meta', '/playbook', '/', '/pipeline', '/automacoes'] },
  { label: 'Cultura e Time', routes: ['/cultura', '/historias', '/biblioteca', '/regras', '/onboarding', '/carreira', '/treinamento'] },
  { label: 'Gestão',         routes: ['/gestao', '/berserker'] },
];

/** Dashboard de Closer: navegação própria (hardcoded, não editável).
 *  'Comece Aqui', Pipeline, Cultura e Histórias são compartilhados (idênticos ao SDR). */
const NAV_CLOSER: NavItem[] = [
  { to: '/start',               label: 'Comece Aqui',          icon: 'Sparkles',  end: false },
  { to: '/closer/planos',       label: 'Planos e Preços',      icon: 'Calculator',end: false },
  { to: '/closer/cupons',       label: 'Cupons',               icon: 'Award',     end: false },
  { to: '/closer/objecoes',     label: 'Objeções',             icon: 'ShieldCheck',end: false },
  { to: '/closer/processo',     label: 'Processo de Venda',    icon: 'Target',    end: false },
  { to: '/closer/concorrentes', label: 'Concorrentes',         icon: 'Sword',     end: false },
  { to: '/pipeline',            label: 'Pipeline',             icon: 'BarChart2', end: false },
  { to: '/closer/rotina',       label: 'Rotina & Progressão',  icon: 'TrendingUp',end: false },
  { to: '/cultura',             label: 'Cultura',              icon: 'Heart',     end: false },
  { to: '/historias',           label: 'Histórias de Sucesso', icon: 'Trophy',    end: false },
];

const CLOSER_SECTIONS = [
  { label: 'Comercial',         routes: ['/closer/planos', '/closer/cupons', '/closer/objecoes', '/closer/processo', '/closer/concorrentes', '/pipeline'] },
  { label: 'Carreira & Rotina', routes: ['/closer/rotina'] },
  { label: 'Cultura e Time',    routes: ['/cultura', '/historias'] },
];

/** Seletor de playbooks — cada opção troca o papel inteiro do app */
const PLAYBOOK_OPTIONS: { label: string; papel: Papel; icon: LucideIcon; short: string }[] = [
  { label: 'SDR',            papel: 'SDR',          icon: Zap,     short: 'SDR'   },
  { label: 'Closer',         papel: 'Closer',       icon: Target,  short: 'Closer'},
  { label: 'Parcerias',      papel: 'Parcerias',    icon: Users,   short: 'Parc.' },
  { label: 'Representantes', papel: 'Representante',icon: MapIcon, short: 'Rep.'  },
];

const STORE_KEY = 'sidebar.nav';

export function Sidebar() {
  const { papel, setPapel, lockedPapel, squad, apelido, onboardingActive } = useSidebarContext();
  const { isEditing, openPasswordModal, lock, isMaster } = useEditor();
  const userProfile = useUserProfile();
  const navigate = useNavigate();
  const isCloser = papel === 'Closer';
  const rawItems = useGlobalEditableContent<NavItem[]>(STORE_KEY, NAV_PADRAO);
  // Closer tem navegação própria, hardcoded (não passa pelo override global).
  const items = isCloser ? NAV_CLOSER : rawItems.filter(i => i.to !== '/mural');
  const sections = isCloser ? CLOSER_SECTIONS : SECTIONS;
  // Edição de nav só vale para o nav global (SDR/Liderança), não para o do Closer.
  const navEditable = isEditing && !isCloser;
  const saveGlobalOverride = useContentStore((s) => s.saveGlobalOverride);

  const update = async (next: NavItem[]) => {
    try { await saveGlobalOverride(STORE_KEY, next); }
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
  const allSectionRoutes = sections.flatMap(s => s.routes);

  const [switching, setSwitching] = useState<Papel | null>(null);

  // Troca o playbook inteiro com animação: breve delay visual antes de mudar
  const switchPlaybook = async (novoPapel: Papel) => {
    if (novoPapel === papel || switching) return;
    setSwitching(novoPapel);
    await new Promise(r => setTimeout(r, 380));
    setPapel(novoPapel);
    navigate('/start');
    setSwitching(null);
  };

  // Seletor visível para Liderança, mestres e quem está editando — demais não veem nada
  const visiblePlaybooks = (papel === 'Liderança' || isEditing || isMaster)
    ? PLAYBOOK_OPTIONS
    : [];

  /* ── Nav item reutilizável ── */
  const NavItemEl = ({ item }: { item: NavItem }) => {
    const idx = items.indexOf(item);
    const Icon = ICON_MAP[item.icon] ?? Sparkles;
    // Gestores em modo edição não ficam bloqueados pelo onboarding
    const locked = onboardingActive && item.to !== '/start' && !isEditing;

    return (
      <div className="group/nav relative">
        <NavLink
          to={locked ? '/start' : item.to}
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
          <button
            type="button"
            onClick={navEditable ? e => { e.preventDefault(); e.stopPropagation(); cycleIcon(idx); } : undefined}
            disabled={!navEditable}
            className={cn('shrink-0', navEditable && 'cursor-pointer hover:scale-110')}
          >
            <Icon className="h-[18px] w-[18px]" />
          </button>
          <span className="flex-1">{item.label}</span>
        </NavLink>

        {navEditable && (
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
    <aside
      className="w-[220px] shrink-0 flex flex-col h-screen sticky top-0 z-30 border-r border-[#ffffff08] overflow-hidden"
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
          Time e Comercial
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
                <button
                  type="button"
                  onClick={isEditing ? e => { e.preventDefault(); e.stopPropagation(); cycleIcon(idx); } : undefined}
                  disabled={!isEditing}
                  className={cn('shrink-0', isEditing && 'cursor-pointer hover:scale-110')}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </button>
                <span className="flex-1">{startItem.label}</span>
                <ChevronRight className="h-4 w-4 opacity-60" />
              </NavLink>
            </div>
          );
        })()}

        {/* Seções */}
        {sections.map(section => {
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
      <div className="px-3 pb-4 space-y-1.5">

        {/* Seletor de Playbooks — troca o contexto inteiro do app */}
        {visiblePlaybooks.length > 0 && (
          <div className="mb-0.5">
            {/* Divider com gradiente */}
            <div className="h-px mx-1 mb-3 bg-gradient-to-r from-transparent via-[#3a1560] to-transparent" />

            <div className="px-2 mb-1.5 flex items-center gap-1.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#4a3060]">
                Trocar Playbook
              </p>
              {isMaster && (
                <span className="inline-flex items-center gap-0.5 text-[8px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/15 border border-amber-400/30 rounded px-1 py-0.5">
                  <ShieldCheck className="h-2.5 w-2.5" /> Mestre
                </span>
              )}
            </div>

            {/* Grid 2x2 com os 4 setores */}
            <div className="grid grid-cols-2 gap-1.5 px-1">
              {visiblePlaybooks.map(opt => {
                const isActive = papel === opt.papel;
                const isSwitching = switching === opt.papel;
                const Icon = opt.icon;

                return (
                  <button
                    key={opt.papel}
                    onClick={() => switchPlaybook(opt.papel)}
                    disabled={!!switching}
                    title={`Playbook de ${opt.label}`}
                    className={cn(
                      'relative flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-[10px] font-bold transition-all duration-300 overflow-hidden',
                      isActive
                        ? 'text-white'
                        : switching
                          ? 'opacity-30 cursor-not-allowed text-[#4a3060]'
                          : 'text-[#6a4a80] hover:text-[#c4a0e8] hover:bg-white/5 cursor-pointer'
                    )}
                    style={isActive ? {
                      background: 'linear-gradient(145deg, #4a0080 0%, #7c3aed 100%)',
                      boxShadow: '0 2px 12px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
                    } : {}}
                  >
                    {isSwitching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icon className="h-4 w-4 shrink-0" />
                    )}
                    <span className="leading-tight text-center">{opt.label}</span>
                    {isActive && !isSwitching && (
                      <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-white/70" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modo Gestor */}
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
