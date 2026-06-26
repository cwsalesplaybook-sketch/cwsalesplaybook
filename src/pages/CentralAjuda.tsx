/** Central de Ajuda — documentação oficial da CW embutida (iframe).
 *  Disponível em todos os dashboards (SDR, Closer, Parcerias, Representante). */
import { ExternalLink } from 'lucide-react';

const AJUDA_URL = 'https://ajuda.cardapioweb.com/';

export default function CentralAjuda() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between gap-3 px-6 py-3 border-b border-cw-border shrink-0">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-cw-text">Central de Ajuda</h1>
          <p className="text-xs text-cw-muted truncate">
            Documentação oficial da Cardápio Web — tudo sobre o produto, num só lugar.
          </p>
        </div>
        <a
          href={AJUDA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-cw-border text-cw-text hover:bg-cw-elevated transition-colors shrink-0"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Abrir em nova aba
        </a>
      </div>
      <iframe
        src={AJUDA_URL}
        title="Central de Ajuda Cardápio Web"
        className="flex-1 w-full border-0"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
