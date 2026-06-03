/** Seção Carreira — trilha de níveis e mapa de tiers. */
import { Trophy } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { CareerTrack } from './CareerTrack';
import { TierMap } from './TierMap';
import { EditableText } from '@/admin/EditableText';

export default function Carreira() {
  return (
    <>
      <div className="p-8 space-y-8 ">
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cw-muted mb-3">
            <EditableText storeKey="carreira.trilha.titulo" defaultValue="Trilha de Níveis" className="text-sm font-semibold uppercase tracking-wider" />
          </h3>
          <CareerTrack />
        </section>

        <section className="cw-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-5 w-5 text-cw-yellow" />
            <h3 className="text-lg font-bold">
              <EditableText storeKey="carreira.metas.titulo" defaultValue="As 3 Metas" className="text-lg font-bold" />
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="p-4 rounded-lg bg-cw-bg border border-cw-border">
              <p className="text-cw-muted text-xs uppercase tracking-wider mb-1">Meta 1</p>
              <p className="font-bold text-cw-text">
                <EditableText storeKey="carreira.metas.m1.titulo" defaultValue="Patamar mínimo" className="font-bold" />
              </p>
              <p className="text-sm text-cw-muted mt-1">
                <EditableText storeKey="carreira.metas.m1.desc" defaultValue="A linha de base de manutenção do nível." multiline className="text-sm" />
              </p>
            </div>
            <div className="p-4 rounded-lg bg-cw-purple/15 border border-cw-purple/40">
              <p className="text-cw-purple-light text-xs uppercase tracking-wider mb-1">Meta 2</p>
              <p className="font-bold text-cw-text">
                <EditableText storeKey="carreira.metas.m2.titulo" defaultValue="Performance esperada" className="font-bold" />
              </p>
              <p className="text-sm text-cw-muted mt-1">
                <EditableText storeKey="carreira.metas.m2.desc" defaultValue="O padrão sustentado pelo time." multiline className="text-sm" />
              </p>
            </div>
            <div className="p-4 rounded-lg bg-cw-yellow/10 border border-cw-yellow/40">
              <p className="text-cw-yellow text-xs uppercase tracking-wider mb-1">Meta 3</p>
              <p className="font-bold text-cw-text">
                <EditableText storeKey="carreira.metas.m3.titulo" defaultValue="Excelência" className="font-bold" />
              </p>
              <p className="text-sm text-cw-muted mt-1">
                <EditableText storeKey="carreira.metas.m3.desc" defaultValue="Onde o crescimento de fato acontece." multiline className="text-sm" />
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cw-muted mb-3">
            <EditableText storeKey="carreira.tiers.titulo" defaultValue="Mapa de Tiers" className="text-sm font-semibold uppercase tracking-wider" />
          </h3>
          <TierMap />
        </section>
      </div>
    </>
  );
}
