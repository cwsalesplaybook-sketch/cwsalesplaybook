/** Seção Pipeline — embed do dashboard Pipedrive em iframe. */
import { useState } from 'react';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PIPEDRIVE_URL =
  'https://cardapioweb.pipedrive.com/share/f3e9ccb120f47676f067065f5f8b1c9a0cfe5124a82608e855ca292e94022ba1';

export default function Pipeline() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      <Header
        titulo="Pipeline em Tempo Real"
        subtitulo="Acompanhe agendamentos e vendas atualizados diretamente do Pipedrive."
        acoes={
          <div className="flex items-center gap-3">
            <Badge className="gap-1.5 border border-cw-red/50 bg-cw-red/15 text-red-300 animate-pulse">
              <span className="inline-block h-2 w-2 rounded-full bg-cw-red" />
              AO VIVO
            </Badge>
            <Button
              size="sm"
              onClick={() => window.open(PIPEDRIVE_URL, '_blank', 'noopener,noreferrer')}
              className="gradient-primary text-white hover:brightness-110 gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir no Pipedrive
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div
          className="cw-card overflow-hidden relative"
          style={{ height: 'calc(100vh - 160px)' }}
        >
          {!loaded && !error && (
            <div className="absolute inset-0 p-4 space-y-3 z-10">
              <div className="h-12 w-1/3 rounded-lg cw-shimmer" />
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-lg cw-shimmer" />
                ))}
              </div>
              <div className="h-[60%] rounded-lg cw-shimmer" />
            </div>
          )}

          {error ? (
            <div className="h-full w-full flex items-center justify-center p-8">
              <div className="cw-card p-8 max-w-md text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-cw-yellow/15 border border-cw-yellow/40 flex items-center justify-center mb-4">
                  <AlertCircle className="h-7 w-7 text-cw-yellow" />
                </div>
                <h3 className="text-xl font-bold text-cw-text mb-2">Dashboard não carregou</h3>
                <p className="text-sm text-cw-muted mb-5 leading-relaxed">
                  O Pipedrive pode estar bloqueando a incorporação neste momento.
                  Acesse diretamente pelo botão abaixo.
                </p>
                <Button
                  onClick={() => window.open(PIPEDRIVE_URL, '_blank', 'noopener,noreferrer')}
                  className="gradient-primary text-white hover:brightness-110 gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir Pipedrive
                </Button>
              </div>
            </div>
          ) : (
            <iframe
              src={PIPEDRIVE_URL}
              width="100%"
              height="100%"
              frameBorder={0}
              allow="fullscreen"
              title="Pipeline Cardápio Web — Pipedrive"
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              className="relative z-0"
            />
          )}
        </div>
      </div>
    </>
  );
}
