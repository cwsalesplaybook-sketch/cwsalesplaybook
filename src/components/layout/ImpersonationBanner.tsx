import { Eye, X } from 'lucide-react';
import { useSidebarContext } from '@/context/SidebarContext';
import { useNavigate } from 'react-router-dom';

export function ImpersonationBanner() {
  const { impersonating, setImpersonating } = useSidebarContext();
  const navigate = useNavigate();

  if (!impersonating) return null;

  const sair = () => {
    setImpersonating(null);
    navigate('/modo-gestor');
  };

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-amber-500 px-6 py-2.5 text-black shadow-md">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Eye className="h-4 w-4 shrink-0" />
        <span>
          Visualizando como <strong>{impersonating.apelido}</strong>
          {impersonating.squad && <span className="font-normal opacity-70"> · Squad {impersonating.squad}</span>}
          {' '}· <span className="font-normal opacity-70">{impersonating.papel}</span>
        </span>
      </div>
      <button
        onClick={sair}
        className="flex items-center gap-1.5 rounded-lg bg-black/15 px-3 py-1 text-xs font-bold hover:bg-black/25 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
        Sair da visualização
      </button>
    </div>
  );
}
