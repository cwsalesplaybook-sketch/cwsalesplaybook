/** Grid "Quem é quem" do time comercial — puxa direto dos perfis (cargo escolhido no wizard),
 *  agrupado por hierarquia. Sem fotos: só iniciais. */
import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { EditableText } from '@/admin/EditableText';

interface PerfilTime {
  apelido: string;
  papel: string;
  cargoLideranca: string | null;
  squad: string | null;
}

// Ordem dos grupos exibidos
const ORDEM_GRUPOS = ['Diretoria', 'Coordenação', 'Liderança', 'Closers', 'SDRs', 'Representantes', 'Parcerias'];

function getGrupo({ papel, cargoLideranca }: PerfilTime): string {
  const cl = (cargoLideranca ?? '').toLowerCase();
  if (cl === 'diretoria') return 'Diretoria';
  if (cl.includes('coorden')) return 'Coordenação';
  if (papel === 'Liderança') return 'Liderança';
  if (papel === 'Closer') return 'Closers';
  if (papel === 'SDR') return 'SDRs';
  if (papel === 'Representante') return 'Representantes';
  if (papel === 'Parcerias') return 'Parcerias';
  return 'Time';
}

export function TimeGrid() {
  const [perfis, setPerfis] = useState<PerfilTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('sdr_profiles')
      .select('apelido, papel, cargo_lideranca, squad')
      .then(({ data }) => {
        if (data) {
          setPerfis(
            data
              .filter((d) => d.apelido && d.papel)
              .map((d) => ({
                apelido: d.apelido as string,
                papel: d.papel as string,
                cargoLideranca: (d.cargo_lideranca as string | null) ?? null,
                squad: (d.squad as string | null) ?? null,
              }))
          );
        }
        setLoading(false);
      });
  }, []);

  // Agrupa por hierarquia mantendo a ordem de ORDEM_GRUPOS
  const grupos: { label: string; pessoas: PerfilTime[] }[] = [];
  perfis.forEach((p) => {
    const label = getGrupo(p);
    let g = grupos.find((x) => x.label === label);
    if (!g) {
      const ordem = ORDEM_GRUPOS.indexOf(label);
      let pos = grupos.findIndex((x) => ORDEM_GRUPOS.indexOf(x.label) > ordem);
      if (pos === -1) pos = grupos.length;
      grupos.splice(pos, 0, { label, pessoas: [] });
      g = grupos[pos];
    }
    g.pessoas.push(p);
  });
  grupos.forEach((g) => g.pessoas.sort((a, b) => a.apelido.localeCompare(b.apelido)));

  return (
    <section className="cw-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cw-purple/10 flex items-center justify-center">
            <Users className="h-4 w-4 text-cw-purple" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-cw-text">
              <EditableText storeKey="start.time.titulo" defaultValue="Quem é quem no time" className="text-xl font-bold text-cw-text" />
            </h2>
            <p className="text-xs text-cw-muted">As pessoas que fazem a Cardápio Web acontecer todos os dias</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-[52px] rounded-xl cw-shimmer" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {grupos.map(({ label, pessoas }) => (
            <div key={label}>
              {/* Separador de grupo */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] font-black uppercase tracking-widest text-cw-purple">{label}</span>
                <div className="flex-1 h-px bg-cw-border" />
                <span className="text-[11px] text-cw-muted">{pessoas.length}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {pessoas.map((p) => {
                  const initials = p.apelido.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
                  return (
                    <div key={p.apelido} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-cw-elevated border border-cw-border hover:border-cw-purple/40 hover:bg-white hover:shadow-sm transition-all duration-150">
                      <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs text-cw-text leading-snug truncate">{p.apelido}</p>
                        <p className="text-[11px] text-cw-muted truncate">
                          {p.papel}{p.squad ? ` · ${p.squad}` : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
