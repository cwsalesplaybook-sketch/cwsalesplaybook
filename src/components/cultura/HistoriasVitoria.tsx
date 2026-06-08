/** Histórias de Sucesso — promoções e conquistas do time. */
import { useState } from 'react';
import { Star, Plus, Trash2, X, ArrowUpRight } from 'lucide-react';
import { useEditor } from '@/admin/EditorContext';
import { useEditableContent, useContentStore } from '@/store/contentStore';

interface Historia {
  id: string;
  nome: string;
  foto: string;
  conquista: string;
  historia: string;
}

const HISTORIAS_PADRAO: Historia[] = [
  {
    id: 'h1',
    nome: 'Marcos Vinicius',
    foto: '',
    conquista: 'Promovido a Closer',
    historia: 'Chegou como SDR júnior e em 4 meses bateu Meta 3 três vezes seguidas. A consistência no Berserker e o resultado no roleplay abriram a porta para a promoção.',
  },
  {
    id: 'h2',
    nome: 'Thais Giurizatto',
    foto: '',
    conquista: 'Maior conversão de Fevereiro',
    historia: 'Não foi uma jogada genial — foi rotina. Bati follow-up religiosamente e refiz cada roleplay até a abertura ficar natural.',
  },
  {
    id: 'h3',
    nome: 'Ryan Felipe',
    foto: '',
    conquista: 'SDR do Mês — Março',
    historia: 'Nos primeiros dias estava travado. Com disciplina na Hora de Ouro e prática no roleplay, virou referência de volume e conversão em menos de 30 dias.',
  },
];

const STORE_KEY = 'historias.entries';

function initials(nome: string) {
  return nome.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function ModalAdicionar({ onSave, onClose }: { onSave: (h: Historia) => void; onClose: () => void }) {
  const [form, setForm] = useState({ nome: '', foto: '', conquista: '', historia: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const valid = form.nome.trim() && form.conquista.trim() && form.historia.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-cw-text">Nova História de Sucesso</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text"><X className="h-5 w-5" /></button>
        </div>

        {/* Preview avatar */}
        <div className="flex items-center gap-3">
          {form.foto ? (
            <img src={form.foto} alt={form.nome} className="h-14 w-14 rounded-full object-cover border border-cw-border" />
          ) : (
            <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center text-white font-black text-lg">
              {form.nome ? initials(form.nome) : '?'}
            </div>
          )}
          <div className="flex-1">
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider block mb-1">URL da Foto (opcional)</label>
            <input value={form.foto} onChange={set('foto')} placeholder="https://..."
              className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cw-purple" />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-cw-purple uppercase tracking-wider block mb-1">Nome do Colaborador</label>
          <input value={form.nome} onChange={set('nome')} placeholder="Ex: Luan Nicolas"
            className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cw-purple" />
        </div>

        <div>
          <label className="text-xs font-bold text-cw-purple uppercase tracking-wider block mb-1">Conquista</label>
          <input value={form.conquista} onChange={set('conquista')} placeholder="Ex: Promovido a Closer"
            className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cw-purple" />
        </div>

        <div>
          <label className="text-xs font-bold text-cw-purple uppercase tracking-wider block mb-1">História</label>
          <textarea value={form.historia} onChange={set('historia')} rows={4}
            placeholder="Conta como foi a jornada e o que levou a essa conquista..."
            className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cw-purple resize-none" />
        </div>

        <button
          disabled={!valid}
          onClick={() => onSave({ ...form, id: `h-${Date.now()}` })}
          className="w-full py-3 rounded-xl font-bold text-sm text-white gradient-primary disabled:opacity-40 transition-opacity hover:opacity-90"
        >
          Adicionar História
        </button>
      </div>
    </div>
  );
}

export function HistoriasVitoria() {
  const { isEditing } = useEditor();
  const historias = useEditableContent<Historia[]>(STORE_KEY, HISTORIAS_PADRAO);
  const saveOverride = useContentStore((s) => s.saveOverride);
  const [showModal, setShowModal] = useState(false);

  const save = (next: Historia[]) => saveOverride(STORE_KEY, next);
  const adicionar = (h: Historia) => { save([...historias, h]); setShowModal(false); };
  const remover = (id: string) => save(historias.filter(h => h.id !== id));

  return (
    <section className="cw-card p-6">
      {showModal && <ModalAdicionar onSave={adicionar} onClose={() => setShowModal(false)} />}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-cw-yellow fill-cw-yellow" />
          <h2 className="text-xl font-bold text-cw-text">Histórias de Sucesso</h2>
        </div>
        {isEditing && (
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cw-purple/10 border border-cw-purple/30 text-cw-purple text-xs font-bold hover:bg-cw-purple/20 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Adicionar
          </button>
        )}
      </div>

      <div className="space-y-4">
        {historias.map((h) => (
          <article key={h.id} className="relative group/h flex items-start gap-4 p-5 rounded-2xl border border-cw-border bg-gradient-to-r from-cw-purple/8 to-transparent hover:border-cw-purple/30 transition-colors">
            {isEditing && (
              <button onClick={() => remover(h.id)}
                className="absolute top-3 right-3 h-6 w-6 rounded bg-red-100 border border-red-200 text-red-500 flex items-center justify-center opacity-0 group-hover/h:opacity-100 transition-opacity hover:bg-red-200">
                <Trash2 className="h-3 w-3" />
              </button>
            )}

            {/* Avatar */}
            {h.foto ? (
              <img src={h.foto} alt={h.nome} className="h-14 w-14 rounded-full object-cover border-2 border-cw-yellow/50 shrink-0 mt-0.5" />
            ) : (
              <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center text-white font-black text-base shrink-0 mt-0.5">
                {initials(h.nome)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                <div>
                  <p className="font-bold text-cw-text text-base leading-tight">{h.nome}</p>
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold px-2.5 py-1 rounded-full bg-cw-yellow/20 text-amber-600 border border-cw-yellow/30">
                    <ArrowUpRight className="h-3 w-3" />
                    {h.conquista}
                  </span>
                </div>
              </div>
              <p className="text-sm text-cw-text/80 leading-relaxed">"{h.historia}"</p>
            </div>
          </article>
        ))}

        {historias.length === 0 && (
          <div className="text-center py-10 text-cw-muted text-sm">
            Nenhuma história ainda.{isEditing ? ' Clique em "Adicionar" para começar.' : ''}
          </div>
        )}
      </div>
    </section>
  );
}
