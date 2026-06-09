/** Hall da Fama CW — página completa escura, exata ao layout aprovado. */
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
      'Joelma entrou como SDR, mostrou consistência e fome de resultado, foi promovida a Closer e hoje lidera o time comercial. É exemplo vivo de força, foco e cultura — prova de que quem se entrega ao processo, vai longe aqui dentro.',
    stats: [
      { icon: 'trending', valor: '2', label: 'PROMOÇÕES' },
      { icon: 'star', valor: 'Liderança', label: 'TEMPO DE CASA' },
      { icon: 'crown', valor: 'Top performer', label: 'STATUS' },
    ],
  },
];

function StatIcon({ type }: { type: Stat['icon'] }) {
  if (type === 'trending') return <TrendingUp className="h-4 w-4 text-amber-400" />;
  if (type === 'star') return <Star className="h-4 w-4 text-amber-400" />;
  return <Crown className="h-4 w-4 text-amber-400" />;
}

function ModalAdicionar({
  onSave,
  onClose,
}: {
  onSave: (m: MembroHall) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    nome: '',
    foto: '',
    cargo: '',
    jornada: '',
    frase: '',
    historia: '',
  });
  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = form.nome.trim() && form.cargo.trim() && form.historia.trim();

  const handleSave = () => {
    onSave({
      id: `h-${Date.now()}`,
      nome: form.nome.trim(),
      foto: form.foto.trim(),
      cargo: form.cargo.trim(),
      jornada: form.jornada
        .split(/[→,]/)
        .map((s) => s.trim())
        .filter(Boolean),
      frase: form.frase.trim(),
      historia: form.historia.trim(),
      stats: [
        { icon: 'trending', valor: '1', label: 'PROMOÇÕES' },
        { icon: 'star', valor: '-', label: 'TEMPO DE CASA' },
        { icon: 'crown', valor: '-', label: 'STATUS' },
      ],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e0b4a] border border-purple-500/30 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">Novo membro do Hall</h3>
          <button onClick={onClose} className="text-purple-300 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {[
          { k: 'nome', label: 'Nome completo', placeholder: 'Ex: Joelma Vieira' },
          { k: 'foto', label: 'URL da foto (ou /hall/Nome.jpeg)', placeholder: '/hall/...' },
          { k: 'cargo', label: 'Cargo atual', placeholder: 'Ex: Liderança Comercial' },
          {
            k: 'jornada',
            label: 'Jornada (separado por → ou vírgula)',
            placeholder: 'SDR → Closer → Liderança',
          },
          { k: 'frase', label: 'Frase marcante', placeholder: '"Quem tem canal próprio..."' },
        ].map(({ k, label, placeholder }) => (
          <div key={k}>
            <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">
              {label}
            </label>
            <input
              value={(form as Record<string, string>)[k]}
              onChange={set(k as keyof typeof form)}
              placeholder={placeholder}
              className="w-full bg-[#2d1760]/60 border border-purple-500/30 rounded-xl px-3 py-2 text-sm text-white placeholder-purple-400/40 focus:outline-none focus:border-amber-400/60"
            />
          </div>
        ))}

        <div>
          <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">
            História
          </label>
          <textarea
            value={form.historia}
            onChange={set('historia')}
            rows={3}
            placeholder="Conta a jornada desta pessoa..."
            className="w-full bg-[#2d1760]/60 border border-purple-500/30 rounded-xl px-3 py-2 text-sm text-white placeholder-purple-400/40 focus:outline-none focus:border-amber-400/60 resize-none"
          />
        </div>

        <button
          disabled={!valid}
          onClick={handleSave}
          className="w-full py-3 rounded-xl font-black text-sm text-[#1e0b4a] bg-amber-400 hover:bg-amber-300 disabled:opacity-40 transition-colors"
        >
          Adicionar ao Hall da Fama
        </button>
      </div>
    </div>
  );
}

function FeaturedCard({
  membro,
  num,
  onRemove,
}: {
  membro: MembroHall;
  num: number;
  onRemove?: () => void;
}) {
  return (
    <div className="relative group/card rounded-2xl overflow-hidden border border-purple-500/20 bg-[#2d1760]/50">
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 z-20 h-7 w-7 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-red-500/30"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Foto */}
        <div className="relative md:w-[42%] shrink-0 min-h-[280px] md:min-h-[420px]">
          {membro.foto ? (
            <img
              src={membro.foto}
              alt={membro.nome}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center">
              <span className="text-6xl font-black text-white/20">
                {membro.nome
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')}
              </span>
            </div>
          )}
          {/* Badge overlay */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-sm border border-amber-400/50 text-amber-400 text-xs font-black uppercase tracking-widest">
              <Trophy className="h-3 w-3" /> Destaque #{String(num).padStart(2, '0')}
            </span>
          </div>
          {/* Gradient bottom fade para fundiu com o conteúdo no mobile */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#2d1760]/80 to-transparent md:hidden" />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-5">
          {/* Topo */}
          <div>
            <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-2">
              Liderança em Destaque
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-1">
              {membro.nome}
            </h2>
            <p className="text-amber-400 font-semibold text-sm mb-4">{membro.cargo}</p>

            {/* Jornada pills */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {membro.jornada.map((etapa, i) => (
                <div key={etapa} className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold">
                    {etapa}
                  </span>
                  {i < membro.jornada.length - 1 && (
                    <ArrowRight className="h-3 w-3 text-purple-400/60 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Frase */}
            {membro.frase && (
              <blockquote className="border-l-2 border-amber-400/60 pl-4 mb-4">
                <p className="text-white/80 text-sm italic leading-relaxed">
                  "{membro.frase}"
                </p>
              </blockquote>
            )}

            {/* História */}
            <p className="text-purple-200/70 text-sm leading-relaxed">{membro.historia}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-purple-500/20">
            {membro.stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 text-center">
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

function RegularCard({
  membro,
  num,
  onRemove,
}: {
  membro: MembroHall;
  num: number;
  onRemove?: () => void;
}) {
  return (
    <div className="relative group/card rounded-2xl overflow-hidden border border-purple-500/20 bg-[#2d1760]/40">
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 z-20 h-7 w-7 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
      <div className="flex gap-4 p-5">
        <div className="relative h-20 w-16 rounded-xl overflow-hidden shrink-0">
          {membro.foto ? (
            <img
              src={membro.foto}
              alt={membro.nome}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-purple-700/50 flex items-center justify-center text-white font-black text-lg">
              {membro.nome.split(' ').slice(0, 2).map((w) => w[0]).join('')}
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 bg-black/50 py-0.5 text-center">
            <span className="text-amber-400 text-[8px] font-black">#{num}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-base leading-tight">{membro.nome}</p>
          <p className="text-amber-400 text-xs font-semibold mb-2">{membro.cargo}</p>
          <div className="flex flex-wrap items-center gap-1 mb-2">
            {membro.jornada.map((etapa, i) => (
              <div key={etapa} className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-[10px] font-bold">
                  {etapa}
                </span>
                {i < membro.jornada.length - 1 && (
                  <ArrowRight className="h-2.5 w-2.5 text-purple-400/50" />
                )}
              </div>
            ))}
          </div>
          <p className="text-purple-200/60 text-xs leading-relaxed line-clamp-2">{membro.historia}</p>
        </div>
      </div>
    </div>
  );
}

export default function HistoriasSucesso() {
  const { isEditing } = useEditor();
  const membros = useEditableContent<MembroHall[]>(STORE_KEY, MEMBROS_PADRAO);
  const saveOverride = useContentStore((s) => s.saveOverride);
  const [showModal, setShowModal] = useState(false);

  const save = (next: MembroHall[]) => saveOverride(STORE_KEY, next);
  const adicionar = (m: MembroHall) => { save([...membros, m]); setShowModal(false); };
  const remover = (id: string) => save(membros.filter((m) => m.id !== id));

  const [featured, ...rest] = membros;

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #1e0b4a 0%, #2d1760 40%, #1e0b4a 100%)' }}
    >
      {showModal && (
        <ModalAdicionar onSave={adicionar} onClose={() => setShowModal(false)} />
      )}

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
          Aqui a gente eterniza quem subiu o degrau. Começou como SDR, virou Closer, virou
          Liderança. Esse caminho é real.
        </p>

        {/* Card em destaque */}
        {featured && (
          <div className="mb-8">
            <FeaturedCard
              membro={featured}
              num={1}
              onRemove={isEditing ? () => remover(featured.id) : undefined}
            />
          </div>
        )}

        {/* Grid demais membros */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {rest.map((m, i) => (
              <RegularCard
                key={m.id}
                membro={m}
                num={i + 2}
                onRemove={isEditing ? () => remover(m.id) : undefined}
              />
            ))}
          </div>
        )}

        {/* Botão adicionar (modo gestor) */}
        {isEditing && (
          <div className="flex justify-center mb-10">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-dashed border-amber-400/40 text-amber-400 text-sm font-bold hover:bg-amber-400/10 transition-colors"
            >
              <Plus className="h-4 w-4" /> Adicionar membro
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-purple-400/50 text-sm">
          Em breve, novos nomes nesse mural.{' '}
          <span className="text-purple-300/80 font-bold">O próximo pode ser você.</span>
        </p>
      </div>
    </div>
  );
}
