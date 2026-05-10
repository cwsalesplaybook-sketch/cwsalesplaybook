/** Quick links para playbooks e onboarding. */
import { ExternalLink, FileSpreadsheet, Target, MessageSquareWarning, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PLAYBOOK_URL = 'https://docs.google.com/spreadsheets/d/12IUEiWLFcXnLMqfAD0fAbDX0QBlW8hFI9qJrsWxmnUs';

const LINKS = [
  { label: 'Playbook Completo', url: '/playbook', icon: FileSpreadsheet, external: false },
  { label: 'SPIN Selling', url: PLAYBOOK_URL + '#gid=spin', icon: Target, external: true },
  { label: 'Matriz de Objeções', url: PLAYBOOK_URL + '#gid=objecoes', icon: MessageSquareWarning, external: true },
  { label: 'Onboarding SDR', url: '/onboarding', icon: Compass, external: false },
];

export function QuickLinks() {
  const nav = useNavigate();

  const open = (link: typeof LINKS[number]) => {
    if (link.external) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
      toast(`Abrindo ${link.label}`, { description: 'Vai para a planilha do playbook.' });
    } else {
      nav(link.url);
    }
  };

  return (
    <div className="cw-card p-6 h-full">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-cw-muted mb-4">Links Rápidos</h3>
      <div className="grid grid-cols-2 gap-2">
        {LINKS.map((l) => {
          const Icon = l.icon;
          return (
            <button
              key={l.label}
              onClick={() => open(l)}
              className="group flex items-center gap-2 p-3 rounded-lg bg-cw-bg border border-cw-border hover:border-cw-purple hover:bg-cw-elevated transition-all duration-150 text-left"
            >
              <Icon className="h-4 w-4 text-cw-purple-light shrink-0" />
              <span className="text-xs font-medium flex-1 truncate">{l.label}</span>
              {l.external && <ExternalLink className="h-3 w-3 text-cw-muted group-hover:text-cw-text" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
