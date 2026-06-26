/** Hall da Fama CW, branding oficial, grid wide-screen, modal de detalhe. */
import { useState } from 'react';
import { Trophy, TrendingUp, Star, Crown, ArrowRight, Plus, X, Trash2 } from 'lucide-react';
import { useEditor } from '@/admin/EditorContext';
import { useEditableContent, useContentStore } from '@/store/contentStore';

/* ─── Paleta oficial CW (espelha index.css) ─── */
const CW = {
  dark:    '#20092F',
  dark2:   '#2D0D4A',
  purple:  '#A543FA',
  purple2: '#59327A',
  gold:    '#FFB600',
  red:     '#FF5959',
};

interface Stat { icon: 'trending' | 'star' | 'crown'; valor: string; label: string }
interface MembroHall {
  id: string; nome: string; foto: string; cargo: string;
  jornada: string[]; frase: string; historia: string; stats: Stat[];
}

const STORE_KEY = 'hall.membros';

const MEMBROS_PADRAO: MembroHall[] = [
  {
    id: 'fundadores', nome: 'Matheus Lessa, Jhonny Alves & Glauton Santos', foto: '/hall/Fundadores.jpeg',
    cargo: 'Fundadores', jornada: ['Visão de futuro', 'Cardápio Web'],
    frase: 'De uma visão de futuro à criação do ecossistema que move milhares de operações food no país.',
    historia: 'Em um mercado onde o food service mudou drasticamente e o delivery deixou de ser apenas um canal complementar, Matheus Lessa, Jhonny Alves e Glauton Santos enxergaram o futuro antes de todo mundo. Eles entenderam que os restaurantes não podiam mais depender exclusivamente de marketplaces e criaram a Cardápio Web: o e-commerce dos restaurantes. Unindo suas visões, eles tiraram a ideia do papel e construíram a tecnologia que hoje devolve a autonomia, a lucratividade e o controle de dados para milhares de operações food em todo o país.',
    stats: [
      { icon: 'trending', valor: 'Milhares', label: 'OPERAÇÕES' },
      { icon: 'star',     valor: 'Cardápio Web', label: 'CRIAÇÃO' },
      { icon: 'crown',    valor: 'Founders & Creators', label: 'STATUS' },
    ],
  },
  {
    id: 'joelma', nome: 'Joelma Vieira', foto: '/hall/Joelma.jpeg',
    cargo: 'Liderança Pré-Vendas', jornada: ['SDR', 'Closer', 'Liderança'],
    frase: 'Quem tem canal próprio, bate mais forte.',
    historia: 'Joelma começou como SDR, mostrou consistência e fome de resultado, foi promovida a Closer e hoje lidera o time comercial. É exemplo vivo de força, foco e cultura, prova de que quem se entrega ao processo, vai longe aqui dentro.',
    stats: [
      { icon: 'trending', valor: '3', label: 'PROMOÇÕES' },
      { icon: 'star',     valor: 'Liderança', label: 'CARGO' },
      { icon: 'crown',    valor: 'Top performer', label: 'STATUS' },
    ],
  },
  {
    id: 'anaclara', nome: 'Ana Clara', foto: '/hall/AnaClara.jpeg',
    cargo: 'Coordenadora Comercial', jornada: ['SDR', 'Liderança', 'Coordenação'],
    frase: 'Quem lidera pelo exemplo não precisa pedir silêncio, o resultado fala.',
    historia: 'Ana Clara entrou como SDR e não parou: assumiu a liderança comercial do time e construiu autoridade tijolo por tijolo. Hoje coordena o comercial inteiro, não porque foi escolhida, mas porque provou, dia após dia, que sabia o caminho. É referência de postura, visão e resultado dentro da CW.',
    stats: [
      { icon: 'trending', valor: '3', label: 'PROMOÇÕES' },
      { icon: 'star',     valor: 'Coordenação', label: 'CARGO' },
      { icon: 'crown',    valor: 'Referência', label: 'STATUS' },
    ],
  },
  {
    id: 'pedro', nome: 'Pedro Ferreira', foto: '/hall/PedroFerreira.jpeg',
    cargo: 'Liderança Pré-Vendas', jornada: ['SDR', 'Liderança'],
    frase: 'A evolução de um executor de elite para um líder que automatiza e inspira o time.',
    historia: 'Como SDR, o Pedro sempre foi sinônimo de meta batida. Mas foi ao assumir a liderança comercial que ele levou a operação para outro nível. Focando em escala e eficiência, ele desenvolveu automações tecnológicas inteligentes que hoje rodam nos bastidores do time, economizando tempo e eliminando erros. Hoje, ele lidera construindo os processos que sustentam nosso crescimento, sendo uma referência e inspiração para todos.',
    stats: [
      { icon: 'trending', valor: '2', label: 'PROMOÇÕES' },
      { icon: 'star',     valor: 'Liderança', label: 'CARGO' },
      { icon: 'crown',    valor: 'Inovador', label: 'STATUS' },
    ],
  },
  {
    id: 'hyorranes', nome: 'Hyorranes Souza', foto: '/hall/Hyorranes.jpeg',
    cargo: 'Liderança de Representantes', jornada: ['Estágio BDR', 'Liderança BDR', 'Liderança Rep.'],
    frase: 'Estagiário é só o ponto de partida, o destino você escolhe.',
    historia: 'Entrou como estagiário de BDR quando muita gente ainda estava aprendendo o que era prospecção. Enquanto outros esperavam a oportunidade chegar, ele foi construindo a própria. Virou liderança de BDR antes do esperado e hoje comanda os Representantes sendo liderança de representantes.',
    stats: [
      { icon: 'trending', valor: '3', label: 'PROMOÇÕES' },
      { icon: 'star',     valor: 'Liderança Rep.', label: 'CARGO' },
      { icon: 'crown',    valor: 'Em ascensão', label: 'STATUS' },
    ],
  },
  {
    id: 'whenna', nome: 'Whenna Oliveira', foto: '/hall/WhennaOliveira.jpeg',
    cargo: 'Liderança de Closer', jornada: ['Estágio BDR', 'SDR', 'Liderança Pré-Vendas', 'Liderança Closer'],
    frase: 'Cada etapa foi escolha, não sorte.',
    historia: 'Whenna não pulou etapas, ela as dominou. Entrou como estagiária de BDR, foi SDR, assumiu a liderança de pré-vendas e hoje lidera os Closers. Cada promoção veio porque ela entregava mais do que o esperado no cargo que estava, antes de olhar pro próximo. É a prova viva de que a jornada mais longa costuma ser a mais sólida.',
    stats: [
      { icon: 'trending', valor: '4', label: 'PROMOÇÕES' },
      { icon: 'star',     valor: 'Liderança Closer', label: 'CARGO' },
      { icon: 'crown',    valor: 'Completa', label: 'PERFIL' },
    ],
  },
  {
    id: 'joaopablo', nome: 'João Paulo', foto: '/hall/JoaoPaulo.jpeg',
    cargo: 'Closer', jornada: ['SDR JR I', 'SDR JR II', 'SDR JR III', 'Closer'],
    frase: 'Cada "não" que recebi como SDR foi o treino que me fez fechar como Closer.',
    historia: 'João Paulo entrou na CW como SDR JR I e foi subindo cada degrau com consistência e garra. De JR I para JR II, de JR II para JR III, sem pular etapa, sem reclamar do processo. Quando dominou o jogo da prospecção de cabo a rabo, veio a promoção que todo SDR sonha: Closer. A trajetória do João Paulo é a prova de que não existe atalho, existe preparo. Quem aprende a abrir portas, aprende a fechar negócios.',
    stats: [
      { icon: 'trending', valor: '4', label: 'PROMOÇÕES' },
      { icon: 'star',     valor: 'Closer',  label: 'CARGO ATUAL' },
      { icon: 'crown',    valor: 'SDR → Closer', label: 'JORNADA' },
    ],
  },
  {
    id: 'gustavo', nome: 'Gustavo', foto: '/hall/Gustavo.jpeg',
    cargo: 'Closer', jornada: ['SDR JR I', 'Closer'],
    frase: 'Idade não define o que você consegue, define só o quanto tempo você tem pra ir além.',
    historia: 'Gustavo chegou à Cardápio Web aos 19 anos como SDR JR I e, em menos de 1 ano, cruzou para o time de Closer. Não por sorte. Por volume, consistência e uma mentalidade que a maioria demora anos pra desenvolver. Como SDR, fechou exatamente 1.135 clientes, uma marca que fala por si. Cada contrato foi construído com método, cada ligação foi uma aula que ele mesmo aplicou. Quando chegou a hora da promoção, não havia dúvida: Gustavo já operava como Closer muito antes do cargo. Hoje, é referência dentro da CW, não só pelos números, mas pela postura. A prova viva de que, aqui, quem entrega com seriedade cresce sem prazo de validade.',
    stats: [
      { icon: 'trending', valor: '1.135',      label: 'CLIENTES COMO SDR' },
      { icon: 'star',     valor: '19 anos',    label: 'PRIMEIRO CLOSER' },
      { icon: 'crown',    valor: '< 1 ano',    label: 'TEMPO PRA PROMOÇÃO' },
    ],
  },
  {
    id: 'felipe', nome: 'Felipe Alexandrino', foto: '/hall/FelipeAlexandrino.jpeg',
    cargo: 'Diretor do CW Cast', jornada: ['Todos os setores', 'CW Cast'],
    frase: 'Passou por todos os setores para ter a autoridade de liderar o maior podcast da América Latina.',
    historia: 'Um dos pilares da nossa história. O Felipe Alexandrino acompanhou nosso crescimento desde o início e sua trajetória se confunde com a da própria empresa, tendo deixado sua marca em praticamente todos os setores da operação. Hoje, ele usa toda essa bagagem e domínio de mercado para comandar o CW Cast, consolidando o nosso programa como o maior podcast da América Latina.',
    stats: [
      { icon: 'trending', valor: 'Todos', label: 'SETORES' },
      { icon: 'star',     valor: 'Diretor', label: 'CW CAST' },
      { icon: 'crown',    valor: 'Master', label: 'STATUS' },
    ],
  },
  {
    id: 'gregory', nome: 'Gregory Lavor', foto: '/hall/Gregory.jpeg',
    cargo: 'Closer Pleno II', jornada: ['SDR', 'Closer Jr I', 'Closer Jr III', 'Pleno I', 'Pleno II'],
    frase: 'Aprendi aqui do zero. E ainda não parei.',
    historia: 'Gregory chegou sem nenhuma experiência em vendas e aprendeu tudo dentro da CW. No primeiro mês como SDR não bateu meta — no sexto, já entregava Meta 3 de forma antecipada. Passou pelo processo seletivo interno de 3 etapas e migrou pro time de Closer. Manteve a mesma lógica de sempre: consistência mês a mês, entregando Meta 3 ou Mega Meta. Em 1 ano e meio foi de Closer Jr I direto ao Jr III (pulou o nível II), depois Pleno I e, mais recentemente, Pleno II. Segue crescendo.',
    stats: [
      { icon: 'trending', valor: '4', label: 'PROMOÇÕES' },
      { icon: 'star',     valor: 'Closer Pleno II', label: 'CARGO' },
      { icon: 'crown',    valor: 'Do zero ao topo', label: 'JORNADA' },
    ],
  },
  {
    id: 'luan', nome: 'Luan Nicolas', foto: '/hall/LuanNicolas.jpeg',
    cargo: 'Closer', jornada: ['SDR', 'Closer'],
    frase: 'Não tem atalho. Tem consistência.',
    historia: 'Luan não entrou pedindo desconto na jornada, ele foi degrau por degrau, promoção por promoção, sem pular fila. Passou por cada nível do SDR até chegar no Pleno, e quando cruzou pro fechamento, não parou: foi de Closer JR I direto ao III. O que chama atenção no Luan não é a velocidade, é a solidez. Cada subida foi construída em cima da anterior. É o tipo de cara que, quando está num cargo, domina aquele cargo antes de querer o próximo. É o cara.',
    stats: [
      { icon: 'trending', valor: '4+', label: 'PROMOÇÕES' },
      { icon: 'star',     valor: 'Closer', label: 'CARGO' },
      { icon: 'crown',    valor: 'O cara', label: 'STATUS' },
    ],
  },
];

function StatIcon({ type }: { type: Stat['icon'] }) {
  if (type === 'trending') return <TrendingUp className="h-5 w-5" style={{ color: CW.gold }} />;
  if (type === 'star')     return <Star        className="h-5 w-5" style={{ color: CW.gold }} />;
  return                          <Crown       className="h-5 w-5" style={{ color: CW.gold }} />;
}

/* ─── Modal de detalhe ─── */
function DetailModal({ membro, onClose }: { membro: MembroHall; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,3,20,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
        style={{ background: CW.dark, border: `1px solid ${CW.purple}33` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fechar */}
        <button onClick={onClose}
          className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full flex items-center justify-center text-white transition-colors"
          style={{ background: 'rgba(165,67,250,0.2)', border: `1px solid ${CW.purple}44` }}>
          <X className="h-4 w-4" />
        </button>

        {/* Foto */}
        <div className="relative md:w-[42%] shrink-0 min-h-[260px] md:min-h-0">
          {membro.foto ? (
            <img src={membro.foto} alt={membro.nome}
              className="absolute inset-0 w-full h-full object-cover object-top" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${CW.purple2}, ${CW.dark2})` }}>
              <span className="text-5xl font-black text-white/20">
                {membro.nome.split(' ').slice(0, 2).map((w) => w[0]).join('')}
              </span>
            </div>
          )}
          {/* Badge cargo no modal */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full"
              style={{ background: `linear-gradient(135deg, ${CW.purple}, ${CW.purple2})` }}>
              <Trophy className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-sm"
              style={{ background: 'rgba(10,3,20,0.7)', border: `1px solid ${CW.gold}44`, color: CW.gold }}>
              {membro.cargo}
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 p-6 md:p-8 flex flex-col gap-4 overflow-y-auto max-h-[85vh] md:max-h-none">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2"
              style={{ color: `${CW.purple}99` }}>
              História de Sucesso
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{membro.nome}</h2>
            <p className="text-sm font-semibold mt-1" style={{ color: CW.gold }}>{membro.cargo}</p>
          </div>

          {/* Jornada */}
          <div className="flex flex-wrap items-center gap-2">
            {membro.jornada.map((etapa, i) => (
              <div key={etapa} className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: `${CW.purple}22`, border: `1px solid ${CW.purple}44`, color: '#D4A8FF' }}>
                  {etapa}
                </span>
                {i < membro.jornada.length - 1 && (
                  <ArrowRight className="h-3 w-3 shrink-0" style={{ color: `${CW.purple}66` }} />
                )}
              </div>
            ))}
          </div>

          {/* História */}
          <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(212,168,255,0.7)' }}>
            {membro.historia}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-4"
            style={{ borderTop: `1px solid ${CW.purple}22` }}>
            {membro.stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1.5 text-center rounded-xl p-3"
                style={{ background: `${CW.purple}18`, border: `1px solid ${CW.purple}25` }}>
                <StatIcon type={s.icon} />
                <span className="text-white font-black text-sm leading-none">{s.valor}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest leading-tight"
                  style={{ color: `${CW.purple}99` }}>
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
function PhotoCard({ membro, onClick, onRemove }: {
  membro: MembroHall; onClick: () => void; onRemove?: () => void;
}) {
  return (
    <div
      className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg transition-transform duration-200 hover:scale-[1.03]"
      style={{ aspectRatio: '3/4' }}
      onClick={onClick}
    >
      {membro.foto ? (
        <img src={membro.foto} alt={membro.nome}
          className="absolute inset-0 w-full h-full object-cover object-top" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${CW.purple2}, ${CW.dark2})` }}>
          <span className="text-4xl font-black text-white/20">
            {membro.nome.split(' ').slice(0, 2).map((w) => w[0]).join('')}
          </span>
        </div>
      )}

      {/* Gradiente bottom */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(10,3,20,0.9) 0%, rgba(10,3,20,0.2) 50%, transparent 100%)' }} />

      {/* Badge topo esquerdo */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5">
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full shrink-0"
          style={{ background: `linear-gradient(135deg, ${CW.purple}, ${CW.purple2})` }}>
          <Trophy className="h-3 w-3 text-white" />
        </span>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide backdrop-blur-sm"
          style={{ background: 'rgba(10,3,20,0.65)', border: `1px solid ${CW.gold}55`, color: CW.gold }}>
          {membro.cargo}
        </span>
      </div>

      {/* Info bottom */}
      <div className="absolute bottom-0 inset-x-0 p-4">
        <p className="font-black text-white text-base leading-tight">{membro.nome}</p>
        <p className="text-xs font-semibold mt-0.5" style={{ color: CW.gold }}>{membro.cargo}</p>
        <p className="text-[10px] mt-2 flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <Trophy className="h-2.5 w-2.5" /> Clique para ver a história
        </p>
      </div>

      {/* Remover (gestor) */}
      {onRemove && (
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-3 right-3 z-10 h-7 w-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(255,89,89,0.2)', border: '1px solid rgba(255,89,89,0.4)', color: CW.red }}>
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
      className="rounded-2xl flex flex-col items-center justify-center gap-3 p-6"
      style={{
        aspectRatio: '3/4',
        border: `1.5px dashed ${CW.purple}44`,
        background: `${CW.purple}08`,
      }}
    >
      <div className="h-14 w-14 rounded-full flex items-center justify-center"
        style={{ background: `${CW.gold}22`, border: `1px solid ${CW.gold}44` }}>
        <Trophy className="h-7 w-7" style={{ color: CW.gold }} />
      </div>
      <div className="text-center">
        <p className="font-black text-white text-sm">O próximo é você?</p>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: `${CW.purple}99` }}>
          Bata meta, viva a cultura e veja seu nome aqui.
        </p>
      </div>
    </div>
  );
}

/* ─── Modal de adicionar (gestor) ─── */
function ModalAdicionar({ onSave, onClose }: { onSave: (m: MembroHall) => void; onClose: () => void }) {
  const [form, setForm] = useState({ nome: '', foto: '', cargo: '', jornada: '', frase: '', historia: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.nome.trim() && form.cargo.trim() && form.historia.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4"
        style={{ background: CW.dark, border: `1px solid ${CW.purple}44` }}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">Novo membro do Hall</h3>
          <button onClick={onClose} style={{ color: `${CW.purple}cc` }}><X className="h-5 w-5" /></button>
        </div>
        {[
          { k: 'nome',    label: 'Nome completo',              placeholder: 'Ex: Joelma Vieira' },
          { k: 'foto',    label: 'Foto (/hall/Nome.jpeg)',     placeholder: '/hall/...' },
          { k: 'cargo',   label: 'Cargo atual',                placeholder: 'Ex: Liderança Pré-Vendas' },
          { k: 'jornada', label: 'Jornada (separar por →)',    placeholder: 'SDR → Closer → Liderança' },
          { k: 'frase',   label: 'Frase marcante',             placeholder: '"Quem tem canal próprio..."' },
        ].map(({ k, label, placeholder }) => (
          <div key={k}>
            <label className="text-[10px] font-black uppercase tracking-widest block mb-1"
              style={{ color: CW.gold }}>{label}</label>
            <input value={(form as Record<string, string>)[k]} onChange={set(k as keyof typeof form)}
              placeholder={placeholder}
              className="w-full rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              style={{ background: `${CW.purple}18`, border: `1px solid ${CW.purple}44` }} />
          </div>
        ))}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest block mb-1"
            style={{ color: CW.gold }}>História</label>
          <textarea value={form.historia} onChange={set('historia')} rows={3}
            className="w-full rounded-xl px-3 py-2 text-sm text-white focus:outline-none resize-none"
            style={{ background: `${CW.purple}18`, border: `1px solid ${CW.purple}44` }} />
        </div>
        <button disabled={!valid}
          onClick={() => onSave({
            id: `h-${Date.now()}`, nome: form.nome.trim(), foto: form.foto.trim(),
            cargo: form.cargo.trim(),
            jornada: form.jornada.split(/[→,]/).map((s) => s.trim()).filter(Boolean),
            frase: form.frase.trim(), historia: form.historia.trim(),
            stats: [
              { icon: 'trending', valor: '1',              label: 'PROMOÇÕES' },
              { icon: 'star',     valor: form.cargo.trim(), label: 'CARGO' },
              { icon: 'crown',    valor: '-',               label: 'STATUS' },
            ],
          })}
          className="w-full py-3 rounded-xl font-black text-sm disabled:opacity-40 transition-opacity"
          style={{ background: `linear-gradient(135deg, ${CW.gold}, ${CW.red})`, color: CW.dark }}>
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
    <div className="min-h-screen" style={{ background: `linear-gradient(160deg, ${CW.dark} 0%, ${CW.dark2} 50%, ${CW.dark} 100%)` }}>
      {selected  && <DetailModal    membro={selected} onClose={() => setSelected(null)} />}
      {showModal && <ModalAdicionar onSave={adicionar} onClose={() => setShowModal(false)} />}

      <div className="px-8 lg:px-14 py-12">
        {/* Badge topo */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
            style={{ background: `${CW.gold}22`, border: `1px solid ${CW.gold}44`, color: CW.gold }}>
            <Trophy className="h-3.5 w-3.5" /> Hall da Fama
          </span>
        </div>

        {/* Título */}
        <h1 className="text-center text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
          Histórias de{' '}
          <span style={{ background: `linear-gradient(135deg, ${CW.gold}, ${CW.red})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Sucesso
          </span>
        </h1>
        <p className="text-center text-sm max-w-md mx-auto mb-10 leading-relaxed" style={{ color: `${CW.purple}99` }}>
          Aqui a gente eterniza quem subiu o degrau. Clique em um card pra ver a trajetória completa.
        </p>

        {/* Grid, ocupa a tela toda */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
          {membros.map((m) => (
            <PhotoCard key={m.id} membro={m}
              onClick={() => setSelected(m)}
              onRemove={isEditing ? () => remover(m.id) : undefined} />
          ))}
          <PlaceholderCard />
        </div>

        {/* Botão adicionar (gestor) */}
        {isEditing && (
          <div className="flex justify-center mb-8">
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
              style={{ border: `1.5px dashed ${CW.gold}55`, color: CW.gold }}>
              <Plus className="h-4 w-4" /> Adicionar membro
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs" style={{ color: `${CW.purple}66` }}>
          Em breve, novos nomes nesse mural.{' '}
          <span className="font-bold" style={{ color: `${CW.purple}cc` }}>O próximo pode ser você.</span>
        </p>
      </div>
    </div>
  );
}
