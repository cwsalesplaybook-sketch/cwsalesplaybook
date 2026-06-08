/** Histórias de Sucesso — cases reais com CRUD no Modo Gestor. */
import { useState } from 'react';
import { Trophy, Plus, Trash2, X, Check } from 'lucide-react';
import { useEditor } from '@/admin/EditorContext';
import { useEditableContent, useContentStore } from '@/store/contentStore';

interface Historia {
  id: string;
  nome: string;
  foto: string;
  titulo: string;
  descricao: string;
  metrica: string;
}

const HISTORIAS_PADRAO: Historia[] = [
  {
    id: 'h1',
    nome: 'Marcos Vinicius',
    foto: '',
    titulo: 'Como virei o jogo no Berserker de Janeiro',
    metrica: '+47 agendamentos em 1 mês',
    descricao: 'Comecei o mês atrás. Mudei minha cadência de manhã: 100% Hora de Ouro, zero distração. No fim do mês virei o Berserker e levei o Hall.',
  },
  {
    id: 'h2',
    nome: 'Thais Giurizatto',
    foto: '',
    titulo: 'Consistência virou título',
    metrica: 'Maior taxa de conversão de Fevereiro',
    descricao: 'Não foi uma jogada genial — foi rotina. Bati follow-up religiosamente e refiz cada roleplay até a abertura ficar natural.',
  },
  {
    id: 'h3',
    nome: 'Ryan Felipe',
    foto: '',
    titulo: 'De zero a herói em 3 dias',
    metrica: 'Saí de 0 → 12 agendamentos em 72h',
    descricao: 'Nos primeiros dias eu tava travado. O Pedro me passou o framework de SPIN ajustado, fiz roleplay de manhã e cobrei prática de tarde. Virou.',
  },
];

const STORE_KEY = 'historias.entries';

function initials(nome: string) {
  return nome.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function ModalAdicionar({ onSave, onClose }: { onSave: (h: Historia) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<Historia, 'id'>>({ nome: '', foto: '', titulo: '', metrica: '', descricao: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const valid = form.nome.trim() && form.titulo.trim() && form.descricao.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-cw-text">Nova História de Sucesso</h3>
          <button onClick={onClose} className="text-cw-muted hover:text-cw-text"><X className="h-5 w-5" /></button>
        </div>

        {/* Preview foto */}
        <div className="flex items-center gap-3">
          {form.foto ? (
            <img src={form.foto} alt={form.nome} className="h-14 w-14 rounded-full object-cover border border-cw-border" />
          ) : (
            <div className="h-14 w-14 rounded-full bg-cw-purple/20 flex items-center justify-center text-cw-purple font-black text-lg">
              {form.nome ? initials(form.nome) : '?'}
            </div>
          )}
          <div className="flex-1">
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider block mb-1">URL da Foto (opcional)</label>
            <input value={form.foto} onChange={set('foto')} placeholder="https://..." className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cw-purple" />
          </div>
        </div>

        {[
          { label: 'Nome do Colaborador', key: 'nome' as const, placeholder: 'Ex: Gabrielly Oliveira' },
          { label: 'Título da História', key: 'titulo' as const, placeholder: 'Ex: Como bati Meta 3 em 3 semanas' },
          { label: 'Métrica / Destaque', key: 'metrica' as const, placeholder: 'Ex: +30 agendamentos em 1 mês' },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="text-xs font-bold text-cw-purple uppercase tracking-wider block mb-1">{label}</label>
            <input value={form[key]} onChange={set(key)} placeholder={placeholder}
              className="w-full bg-cw-elevated border border-cw-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cw-purple" />
          </div>
        ))}

        <div>
          <label className="text-xs font-bold text-cw-purple uppercase tracking-wider block mb-1">Descrição</label>
          <textarea value={form.descricao} onChange={set('descricao')} rows={3} placeholder="Conta como foi a conquista..."
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

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-cw-yellow" />
          <h2 className="text-xl font-bold text-cw-text">Histórias de Sucesso</h2>
        </div>
        {isEditing && (
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cw-purple/10 border border-cw-purple/30 text-cw-purple text-xs font-bold hover:bg-cw-purple/20 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Adicionar história
          </button>
        )}
      </div>

      <div className="space-y-3">
        {historias.map((h) => (
          <article key={h.id} className="relative group/h p-5 rounded-xl bg-gradient-to-r from-cw-purple/15 to-transparent border border-cw-border hover:border-cw-yellow/40 transition-colors">
            {isEditing && (
              <button onClick={() => remover(h.id)}
                className="absolute top-3 right-3 h-6 w-6 rounded bg-red-100 border border-red-200 text-red-500 flex items-center justify-center opacity-0 group-hover/h:opacity-100 transition-opacity hover:bg-red-200">
                <Trash2 className="h-3 w-3" />
              </button>
            )}
            <div className="flex items-start gap-4">
              {h.foto ? (
                <img src={h.foto} alt={h.nome}
                  className="h-12 w-12 rounded-full object-cover border-2 border-cw-yellow/40 shrink-0" />
              ) : (
                <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-white font-black text-sm shrink-0">
                  {initials(h.nome)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
                  <h3 className="font-bold text-cw-purple-light">{h.titulo}</h3>
                  {h.metrica && (
                    <span className="text-xs px-2 py-0.5 rounded bg-cw-yellow/20 text-cw-yellow font-mono shrink-0">{h.metrica}</span>
                  )}
                </div>
                <p className="text-sm text-cw-text/90 leading-relaxed mb-2">"{h.descricao}"</p>
                <p className="text-xs text-cw-muted font-semibold text-cw-text">{h.nome}</p>
              </div>
            </div>
          </article>
        ))}

        {historias.length === 0 && (
          <div className="text-center py-10 text-cw-muted text-sm">
            Nenhuma história ainda. {isEditing ? 'Clique em "Adicionar história" para começar.' : ''}
          </div>
        )}
      </div>
    </section>
  );
}
