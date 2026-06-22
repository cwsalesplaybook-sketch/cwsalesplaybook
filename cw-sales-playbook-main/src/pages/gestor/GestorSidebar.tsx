import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Trophy, BookOpen, Map, BarChart3,
  Settings, LogOut, type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  label: string;
  Icon: LucideIcon;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: '/gestor',               label: 'Dashboard',    Icon: LayoutDashboard, end: true },
  { to: '/gestor/times',         label: 'Times',        Icon: Users },
  { to: '/gestor/ranking',       label: 'Ranking',      Icon: Trophy },
  { to: '/gestor/playbooks',     label: 'Playbooks',    Icon: BookOpen },
  { to: '/gestor/trilhas',       label: 'Trilhas',      Icon: Map },
  { to: '/gestor/relatorios',    label: 'Relatórios',   Icon: BarChart3 },
  { to: '/gestor/configuracoes', label: 'Configurações',Icon: Settings },
];

export function GestorSidebar() {
  const sair = () => window.close();

  return (
    <aside className="w-[240px] shrink-0 gradient-surface border-r border-cw-border flex flex-col h-screen sticky top-0">
      <div className="relative px-5 pt-6 pb-4 border-b border-cw-border">
        <div className="absolute inset-0 gradient-glow pointer-events-none" />
        <div className="relative space-y-2">
          <img
            src="https://cardapioweb.com/wp-content/uploads/2024/01/Logo-Cardapio-Web.png"
            alt="Cardápio Web"
            className="h-8 w-auto object-contain"
          />
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
              Modo Gestor ativo
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-cw">
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 border-l-2',
                isActive
                  ? 'bg-cw-elevated text-cw-purple-light border-cw-purple'
                  : 'border-transparent text-cw-muted hover:text-cw-text hover:bg-cw-elevated'
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-cw-border p-4">
        <button
          onClick={sair}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sair do Modo Gestor
        </button>
      </div>
    </aside>
  );
}
