/** Grid "Quem é quem" do time comercial — agrupado por hierarquia, foto via Google OAuth. */
import { Users, Plus, Trash2 } from 'lucide-react';
import { TIME } from '@/data/time';
import { useEditableContent, useContentStore } from '@/store/contentStore';
import { useEditor } from '@/admin/EditorContext';
import { EditableText } from '@/admin/EditableText';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import type { Pessoa } from '@/types';

const STORE_KEY = 'start.time';

// Ordem e rótulos dos grupos por cargo
const GRUPOS = [
  { label: 'Sócio Fundador',         match: (c: string) => c.toLowerCase().includes('sócio') || c.toLowerCase().includes('socio') },
  { label: 'Coordenação',            match: (c: string) => c.toLowerCase().includes('coordenador') },
  { label: 'Supervisão',             match: (c: string) => c.toLowerCase().includes('supervisor') || c.toLowerCase().includes('supervisora') },
  { label: 'Liderança',              match: (c: string) => c.toLowerCase().includes('liderança') || c.toLowerCase().includes('lideranca') },
  { label: 'Analistas & Assessores', match: (c: string) => c.toLowerCase().includes('analista') || c.toLowerCase().includes('assessor') },
  { label: 'Closers',                match: (c: string) => c.toLowerCase().includes('closer') },
  { label: 'SDRs',                   match: (c: string) => c.toLowerCase().includes('sdr') },
];

function getGrupo(cargo: string) {
  for (const g of GRUPOS) { if (g.match(cargo)) return g.label; }
  return 'Time';
}

export function TimeGrid() {
  const { isEditing } = useEditor();
  const items = useEditableContent<Pessoa[]>(STORE_KEY, TIME);
  const saveOverride = useContentStore((s) => s.saveOverride);
  const { avatarUrl, email } = useUserProfile();

  const update = async (next: Pessoa[]) => {
    try { await saveOverride(STORE_KEY, next); }
    catch (e) { toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };
  const add = () => update([...items, { id: `p-${Date.now()}`, nome: 'Nova Pessoa', cargo: 'SDR', slack: '@user', bio: '' }]);
  const remove = (idx: number) => update(items.filter((_, i) => i !== idx));

  // Agrupa por hierarquia mantendo a ordem dos GRUPOS
  const grupos: { label: string; pessoas: { p: Pessoa; idx: number }[] }[] = [];
  items.forEach((p, idx) => {
    const label = getGrupo(p.cargo);
    let g = grupos.find(x => x.label === label);
    if (!g) {
      // Insere na posição correta segundo GRUPOS
      const ordem = GRUPOS.findIndex(x => x.label === label);
      let pos = grupos.findIndex(x => GRUPOS.findIndex(y => y.label === x.label) > ordem);
      if (pos === -1) pos = grupos.length;
      grupos.splice(pos, 0, { label, pessoas: [] });
      g = grupos[pos];
    }
    g.pessoas.push({ p, idx });
  });

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
        {isEditing && (
          <Button size="sm" onClick={add} className="gradient-primary text-white h-8">
            <Plus className="h-3.5 w-3.5 mr-1" /> Pessoa
          </Button>
        )}
      </div>

      <div className="space-y-8">
        {grupos.map(({ label, pessoas }) => (
          <div key={label}>
            {/* Separador de grupo */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-cw-purple">{label}</span>
              <div className="flex-1 h-px bg-cw-border" />
              <span className="text-[11px] text-cw-muted">{pessoas.length}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {pessoas.map(({ p, idx }) => {
                const initials = p.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
                // Verifica se é o usuário logado pelo email (slack ou nome)
                const isMe = email ? p.slack?.includes(email.split('@')[0]) : false;

                return (
                  <div key={p.id} className="group relative p-4 rounded-xl bg-cw-elevated border border-cw-border hover:border-cw-purple/40 hover:bg-white hover:shadow-md transition-all duration-150">
                    {isEditing && (
                      <button
                        onClick={() => remove(idx)}
                        className="absolute top-2 right-2 h-6 w-6 rounded bg-cw-red/10 text-cw-red border border-cw-red/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remover"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}

                    {/* Avatar — foto Google se for o usuário logado, senão iniciais */}
                    {isMe && avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={p.nome}
                        className="h-11 w-11 rounded-full object-cover mb-3 border-2 border-cw-purple/30"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm mb-3">
                        {initials}
                      </div>
                    )}

                    <p className="font-bold text-sm text-cw-text leading-snug">
                      <EditableText storeKey={`${STORE_KEY}.${idx}.nome`} defaultValue={p.nome} className="font-bold text-sm text-cw-text" />
                    </p>
                    <p className="text-xs text-cw-muted mt-0.5">
                      <EditableText storeKey={`${STORE_KEY}.${idx}.cargo`} defaultValue={p.cargo} className="text-xs text-cw-muted" />
                    </p>
                    {p.slack && (
                      <p className="text-[11px] text-cw-purple font-mono mt-1.5 truncate">
                        <EditableText storeKey={`${STORE_KEY}.${idx}.slack`} defaultValue={p.slack} className="text-[11px] text-cw-purple font-mono" />
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
