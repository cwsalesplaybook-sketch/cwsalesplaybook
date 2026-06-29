/** Central de Ajuda — documentação oficial da CW embutida via iframe.
 *  Disponível em todos os dashboards (SDR, Closer, Parcerias, Representante).
 *  O site (ajuda.cardapioweb.com / GitBook) permite framing
 *  (CSP: frame-ancestors https:), então renderiza embutido. Mantemos o
 *  "abrir em nova aba" como fallback. */
import { LifeBuoy, ExternalLink } from 'lucide-react';

const AJUDA_URL = 'https://ajuda.cardapioweb.com/';

export default function CentralAjuda() {
  return (
    <div className="p-4 h-[calc(100vh-1.5rem)] flex flex-col gap-3">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <LifeBuoy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-cw-text leading-tight">Central de Ajuda</h1>
            <p className="text-xs text-cw-muted leading-tight">Documentação oficial da Cardápio Web · ajuda.cardapioweb.com</p>
          </div>
        </div>
        <a
          href={AJUDA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple/40 text-xs font-semibold transition-all shrink-0"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Abrir em nova aba
        </a>
      </div>

      {/* Central embutida */}
      <iframe
        src={AJUDA_URL}
        title="Central de Ajuda — Cardápio Web"
        className="flex-1 w-full rounded-xl border border-cw-border bg-white"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
