/** Central de Ajuda — atalho in-dashboard para a documentação oficial da CW.
 *  Disponível em todos os dashboards (SDR, Closer, Parcerias, Representante).
 *  Obs: a central (GitBook) não renderiza dentro de iframe (bloqueio de
 *  armazenamento de terceiros), por isso abrimos em nova aba. */
import { LifeBuoy, ExternalLink, Search, BookOpen, Settings } from 'lucide-react';

const AJUDA_URL = 'https://ajuda.cardapioweb.com/';

const ATALHOS = [
  { icon: Search,   titulo: 'Busca rápida',      desc: 'Pesquise qualquer dúvida do cliente na hora.' },
  { icon: BookOpen, titulo: 'Guias do produto',  desc: 'Cardápio, pedidos, fidelidade, ChatBot e mais.' },
  { icon: Settings, titulo: 'Configurações',     desc: 'Passo a passo de módulos e integrações.' },
];

export default function CentralAjuda() {
  return (
    <div className="p-8 flex items-center justify-center min-h-[calc(100vh-3rem)]">
      <div className="cw-card w-full max-w-xl p-8 text-center space-y-6">
        <div className="mx-auto h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
          <LifeBuoy className="h-8 w-8 text-white" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-cw-text">Central de Ajuda</h1>
          <p className="text-sm text-cw-muted mt-2 leading-relaxed">
            Toda a documentação oficial da Cardápio Web num só lugar — produto, configurações,
            módulos, integrações e passo a passo. Ideal pra tirar dúvidas do cliente na hora.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ATALHOS.map(a => (
            <div key={a.titulo} className="rounded-xl border border-cw-border bg-cw-bg p-3 text-left">
              <a.icon className="h-4 w-4 text-cw-purple mb-1.5" />
              <p className="text-xs font-bold text-cw-text">{a.titulo}</p>
              <p className="text-[11px] text-cw-muted leading-snug mt-0.5">{a.desc}</p>
            </div>
          ))}
        </div>

        <a
          href={AJUDA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <ExternalLink className="h-4 w-4" /> Abrir Central de Ajuda
        </a>
        <p className="text-[11px] text-cw-muted">Abre em uma nova aba · ajuda.cardapioweb.com</p>
      </div>
    </div>
  );
}
