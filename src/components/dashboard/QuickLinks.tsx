/** Links rápidos para ferramentas externas e internas. */
import { ExternalLink, Clock, MessageSquare, LifeBuoy, Globe, BookOpen, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LINKS = [
  {
    label: 'Meetime',
    url: 'https://meetime.com.br/dashboard/goals?cadenceTypes=STANDARD',
    icon: Clock,
    external: true,
    cor: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-400/50',
  },
  {
    label: 'Kommo',
    url: 'https://marketingcardapiowebcom.kommo.com/home/',
    icon: MessageSquare,
    external: true,
    cor: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-400/50',
  },
  {
    label: 'Central de Ajuda',
    url: 'https://marketingcardapiowebcom.kommo.com/home/',
    icon: LifeBuoy,
    external: true,
    cor: 'text-cw-purple-light',
    bg: 'bg-cw-purple/10 border-cw-purple/20 hover:border-cw-purple/50',
  },
  {
    label: 'Portal do Parceiro',
    url: 'https://portal.cardapioweb.com/login',
    icon: Globe,
    external: true,
    cor: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20 hover:border-orange-400/50',
  },
  {
    label: 'Playbook de Vendas',
    url: 'https://docs.google.com/spreadsheets/d/12IUEiWLFcXnLMqfAD0fAbDX0QBlW8hFI9qJrsWxmnUs/edit?gid=1155986548#gid=1155986548',
    icon: BookOpen,
    external: true,
    cor: 'text-cw-yellow',
    bg: 'bg-cw-yellow/10 border-cw-yellow/20 hover:border-cw-yellow/50',
  },
  {
    label: 'Pipedrive',
    url: 'https://cardapioweb.pipedrive.com/share/f3e9ccb120f47676f067065f5f8b1c9a0cfe5124a82608e855ca292e94022ba1',
    icon: BarChart2,
    external: true,
    cor: 'text-cw-red',
    bg: 'bg-cw-red/10 border-cw-red/20 hover:border-cw-red/50',
  },
];

export function QuickLinks() {
  const nav = useNavigate();

  const open = (link: typeof LINKS[number]) => {
    if (link.external) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    } else {
      nav(link.url);
    }
  };

  return (
    <div className="cw-card p-6 h-full">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-cw-muted mb-4">Links Rápidos</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
        {LINKS.map((l) => {
          const Icon = l.icon;
          return (
            <button
              key={l.label}
              onClick={() => open(l)}
              className={`group flex items-center gap-2.5 p-3.5 rounded-xl border transition-all duration-150 text-left ${l.bg}`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${l.cor}`} />
              <span className="text-xs font-semibold text-cw-text flex-1 truncate leading-tight">{l.label}</span>
              <ExternalLink className="h-3 w-3 text-cw-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
