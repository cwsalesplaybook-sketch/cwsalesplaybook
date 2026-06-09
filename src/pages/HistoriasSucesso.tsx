/** Hall da Fama CW — grid de cards + modal de detalhe ao clicar. */
import { useState } from 'react';
import { Trophy, TrendingUp, Star, Crown, ArrowRight, Plus, X, Trash2 } from 'lucide-react';
import { useEditor } from '@/admin/EditorContext';
import { useEditableContent, useContentStore } from '@/store/contentStore';

interface Stat {
  icon: 'trending' | 'star' | 'crown';
  valor: string;
  label: string;
}

interface MembroHall {
  id: string;
  nome: string;
  foto: string;
  cargo: string;
  jornada: string[];
  frase: string;
  historia: string;
  stats: Stat[];
}

const STORE_KEY = 'hall.membros';

const MEMBROS_PADRAO: MembroHall[] = [
  {
    id: 'joelma',
    nome: 'Joelma Vieira',
    foto: '/hall/Joelma.jpeg',
    cargo: 'Liderança Comercial',
    jornada: ['SDR', 'Closer', 'Liderança'],
    frase: 'Quem tem canal próprio, bate mais forte.',
    historia:
      'Joelma começou como SDR, mostrou consistência e fome de resultado, foi promovida a Closer e hoje lidera o time comercial. É exemplo vivo de força, foco e cultura — prova de que quem se entrega ao processo, vai longe aqui dentro.',
    stats: [
      { icon: 'trending', valor: '2', label: 'PROMOÇÕES' },
      { icon: 'star', valor: 'Liderança', label: 'CARGO' },
      { icon: 'crown', valor: 'Top performer', label: 'STATUS' },
    ],
  },
];

function StatIcon({ type }: { type: Stat['icon'] }) {
  if (type === 'trending') return <TrendingUp className="h-5 w-5 text-amber-400" />;
  if (type === 'star') return <Star className="h-5 w-5 text-amber-400" />;
  return <Crown className="h-5 w-5 text-amber-400" />;
}

/* ─── Modal de detalhe ─── */
function DetailModal({ membro, onClose }: { membro: MembroHall; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,4,30,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
        style={{ background: '#1e0b4a', border: '1px solid rgba(139,92,246,0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Foto */}
        <div className="relative md:w-[42%] shrink-0 min-h-[260px] md:min-h-0">
          {membro.foto ? (
            <img
              src={membro.foto}
              alt={membro.nome}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 bg-purple-900 flex items-center justify-center">
              <span className="text-5xl font-black text-white/20">
                {membro.nome.split(' ').slice(0, 2).map((w) => w[0]).join('')}
              </span>
            </div>
          )}
          {/* Badge de cargo */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
              <Trophy className="h-3 w-3" /> Liderança
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 p-6 md:p-8 flex flex-col gap-4 overflow-y-auto max-h-[85vh] md:max-h-none">
          <div>
            <p className="text-[10px] font-black text-purple-400/70 uppercase tracking-[0.2em] mb-2">
              História de Sucesso
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{membro.nome}</h2>
            <p className="text-amber-400 font-semibold text-sm mt-1">{membro.cargo}</p>
          </div>

          {/* Jornada */}
          <div className="flex flex-wrap items-center gap-2">
            {membro.jornada.map((etapa, i) => (
              <div key={etapa} className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/25 border border-purple-400/30 text-purple-200 text-xs font-bold">
                  {etapa}
                </span>
                {i < membro.jornada.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-purple-400/50 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Frase */}
          {membro.frase && (
            <blockquote className="border-l-2 border-amber-400/60 pl-4">
              <p className="text-white/80 text-sm italic leading-relaxed">
                "{membro.frase}"
              </p>
            </blockquote>
          )}

          {/* História */}
          <p className="text-purple-200/70 text-sm leading-relaxed flex-1">{membro.historia}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-purple-500/20">
            {membro.stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1.5 text-center rounded-xl p-3"
                style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                <StatIcon type={s.icon} />
                <span className="text-white font-black text-sm leading-none">{s.valor}</span>
                <span className="text-purple-400/60 text-[9px] font-bold uppercase tracking-widest leading-tight">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Card foto (thumbnail) ─── */
function PhotoCard({
  membro,
  num,
  onClick,
  onRemove,
}: {
  membro: MembroHall;
  num: number;
  onClick: () => void;
  onRemove?: () => void;
}) {
  return (
    <div
      className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-[3/4] shadow-lg hover:scale-[1.02] transition-transform duration-200"
      onClick={onClick}
    >
      {/* Foto */}
      {membro.foto ? (
        <img
          src={membro.foto}
          alt={membro.nome}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-purple-950 flex items-center justify-center">
          <span className="text-4xl font-black text-white/20">
            {membro.nome.split(' ').slice(0, 2).map((w) => w[0]).join('')}
          </span>
        </div>
      )}

      {/* Gradiente de baixo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Badge topo esquerdo */}
      <div className="absolute top-3 left-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400 text-[#1e0b4a] text-[10px] font-black uppercase tracking-wide">
          <Trophy className="h-2.5 w-2.5" /> #{String(num).padStart(2, '0')}
        </span>
      </div>

      {/* Label cargo topo direito */}
      <div className="absolute top-3 right-3">
        <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white text-[10px] font-bold uppercase tracking-wide">
          {membro.jornada[membro.jornada.length - 1]}
        </span>
      </div>

      {/* Info de baixo */}
      <div className="absolute bottom-0 inset-x-0 p-4">
        <p className="font-black text-white text-lg leading-tight">{membro.nome}</p>
        <p className="text-amber-400 text-xs font-semibold mt-0.5">{membro.cargo}</p>
        <p className="text-white/50 text-[10px] mt-2 flex items-center gap-1">
          <Trophy className="h-2.5 w-2.5" /> Clique para ver a história
        </p>
      </div>

      {/* Botão remover (modo gestor) */}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-3 right-3 z-10 h-7 w-7 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

/* ─── Placeholder "O próximo é você?" ─── */
function PlaceholderCard() {
  return (
    <div
      className="rounded-2xl aspect-[3/4] flex flex-col items-center justify-center gap-3 p-6"
      style={{
        border: '1.5px dashed rgba(139,92,246,0.3)',
        background: 'rgba(139,92,246,0.05)',
      }}
    >
      <div className="h-14 w-14 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
        <Trophy className="h-7 w-7 text-amber-400" />
      </div>
      <div className="text-center">
        <p className="font-black text-white text-base">O próximo é você?</p>
        <p className="text-purple-300/50 text-xs mt-1 leading-relaxed">
          Bata meta, viva a cultura e veja seu nome aqui.
        </p>
      </div>
    </div>
  );
}

/* ─── Modal de adicionar (modo gestor) ─── */
function ModalAdicionar({ onSave, onClose }: { onSave: (m: MembroHall) => void; onClose: () => void }) {
  const [form, setForm] = useState({ nome: '', foto: '', cargo: '', jornada: '', frase: '', historia: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.nome.trim() && form.cargo.trim() && form.historia.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e0b4a] border border-purple-500/30 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">Novo membro do Hall</h3>
          <button onClick={onClose} className="text-purple-300 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        {[
          { k: 'nome', label: 'Nome completo', placeholder: 'Ex: Joelma Vieira' },
          { k: 'foto', label: 'URL da foto (ou /hall/Nome.jpeg)', placeholder: '/hall/...' },
          { k: 'cargo', label: 'Cargo atual', placeholder: 'Ex: Liderança Comercial' },
          { k: 'jornada', label: 'Jornada (separar por →)', placeholder: 'SDR → Closer → Liderança' },
          { k: 'frase', label: 'Frase marcante', placeholder: '"Quem tem canal próprio..."' },
        ].map(({ k, label, placeholder }) => (
          <div key={k}>
            <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">{label}</label>
            <input value={(form as Record<string, string>)[k]} onChange={set(k as keyof typeof form)} placeholder={placeholder}
              className="w-full bg-[#2d1760]/60 border border-purple-500/30 rounded-xl px-3 py-2 text-sm text-white placeholder-purple-400/40 focus:outline-none focus:border-amber-400/60" />
          </div>
        ))}
        <div>
          <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">História</label>
          <textarea value={form.historia} onChange={set('historia')} rows={3}
            className="w-full bg-[#2d1760]/60 border border-purple-500/30 rounded-xl px-3 py-2 text-sm text-white placeholder-purple-400/40 focus:outline-none focus:border-amber-400/60 resize-none" />
        </div>
        <button disabled={!valid}
          onClick={() => onSave({
            id: `h-${Date.now()}`, nome: form.nome.trim(), foto: form.foto.trim(),
            cargo: form.cargo.trim(),
            jornada: form.jornada.split(/[→,]/).map((s) => s.trim()).filter(Boolean),
            frase: form.frase.trim(), historia: form.historia.trim(),
            stats: [
              { icon: 'trending', valor: '1', label: 'PROMOÇÕES' },
              { icon: 'star', valor: form.cargo.trim(), label: 'CARGO' },
              { icon: 'crown', valor: '-', label: 'STATUS' },
            ],
          })}
          className="w-full py-3 rounded-xl font-black text-sm text-[#1e0b4a] bg-amber-400 hover:bg-amber-300 disabled:opacity-40 transition-colors">
          Adicionar ao Hall da Fama
        </button>
      </div>
    </div>
  );
}

/* ─── Página principal ─── */
export default function HistoriasSucesso() {
  const { isEditing } = useEditor();
  const membros = useEditableContent<MembroHall[]>(STORE_KEY, MEMBROS_PADRAO);
  const saveOverride = useContentStore((s) => s.saveOverride);
  const [selected, setSelected] = useState<MembroHall | null>(null);
  const [showModal, setShowModal] = useState(false);

  const save = (next: MembroHall[]) => saveOverride(STORE_KEY, next);
  const adicionar = (m: MembroHall) => { save([...membros, m]); setShowModal(false); };
  const remover = (id: string) => save(membros.filter((m) => m.id !== id));

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1e0b4a 0%, #2d1760 40%, #1e0b4a 100%)' }}>
      {selected && <DetailModal membro={selected} onClose={() => setSelected(null)} />}
      {showModal && <ModalAdicionar onSave={adicionar} onClose={() => setShowModal(false)} />}

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest">
            <Trophy className="h-3.5 w-3.5" /> Hall da Fama
          </span>
        </div>

        {/* Título */}
        <h1 className="text-center text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
          Histórias de <span className="text-amber-400">Sucesso</span>
        </h1>
        <p className="text-center text-purple-300/60 text-sm max-w-md mx-auto mb-10 leading-relaxed">
          Aqui a gente eterniza quem subiu o degrau. Clique em um card pra ver a trajetória completa.
        </p>

        {/* Grid de cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {membros.map((m, i) => (
            <PhotoCard
              key={m.id}
              membro={m}
              num={i + 1}
              onClick={() => setSelected(m)}
              onRemove={isEditing ? () => remover(m.id) : undefined}
            />
          ))}
          <PlaceholderCard />
        </div>

        {/* Botão adicionar (modo gestor) */}
        {isEditing && (
          <div className="flex justify-center mb-6">
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-dashed border-amber-400/40 text-amber-400 text-sm font-bold hover:bg-amber-400/10 transition-colors">
              <Plus className="h-4 w-4" /> Adicionar membro
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-purple-400/40 text-xs">
          Em breve, novos nomes nesse mural.{' '}
          <span className="text-purple-300/70 font-bold">O próximo pode ser você.</span>
        </p>
      </div>
    </div>
  );
}
