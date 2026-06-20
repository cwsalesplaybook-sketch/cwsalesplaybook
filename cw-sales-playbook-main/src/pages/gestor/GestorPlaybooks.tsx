import { useState } from 'react';
import { BookOpen, Users, Handshake, UserCheck, TrendingUp, Plus, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';

interface Playbook {
  id: string;
  nome: string;
  descricao: string;
  conteudos: number;
  Icon: React.ElementType;
  cor: string;
}

const PLAYBOOKS: Playbook[] = [
  { id: 'sdr',            nome: 'SDR',             descricao: 'Prospecção, qualificação e agendamento de reuniões.',     conteudos: 23, Icon: BookOpen,   cor: 'text-purple-400 bg-purple-500/15' },
  { id: 'closer',         nome: 'Closer',           descricao: 'Condução de reuniões e fechamento de vendas.',            conteudos: 28, Icon: TrendingUp, cor: 'text-blue-400 bg-blue-500/15'   },
  { id: 'parceiros',      nome: 'Parceiros',        descricao: 'Processos e materiais para parcerias estratégicas.',      conteudos: 18, Icon: Handshake,  cor: 'text-orange-400 bg-orange-500/15'},
  { id: 'representantes', nome: 'Representantes',   descricao: 'Gestão de contas e relacionamento.',                      conteudos: 16, Icon: UserCheck,  cor: 'text-pink-400 bg-pink-500/15'   },
  { id: 'lideranca',      nome: 'Liderança',        descricao: 'Gestão de times, processos e performance.',               conteudos: 31, Icon: Users,      cor: 'text-emerald-400 bg-emerald-500/15'},
];

type Aba = 'meus' | 'todos';

export default function GestorPlaybooks() {
  const [aba, setAba] = useState<Aba>('todos');
  const { isMaster } = useUser();

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cw-text">Playbooks</h1>
          <p className="text-sm text-cw-muted mt-1">Gerencie e visualize todos os playbooks disponíveis</p>
        </div>
        {isMaster && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cw-yellow/15 text-cw-yellow text-sm font-semibold border border-cw-yellow/30 hover:bg-cw-yellow/25 transition-colors">
            <Star className="h-4 w-4 fill-cw-yellow" />
            Acesso: Master
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-cw-border">
        {([['meus', 'Meus Playbooks'], ['todos', 'Todos os Playbooks']] as [Aba, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setAba(key)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              aba === key
                ? 'border-cw-purple text-cw-purple-light'
                : 'border-transparent text-cw-muted hover:text-cw-text'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLAYBOOKS.map(({ id, nome, descricao, conteudos, Icon, cor }) => (
          <div
            key={id}
            className="bg-cw-surface border border-cw-border rounded-xl p-5 flex flex-col gap-3 hover:border-cw-purple/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', cor)}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                Ativo
              </span>
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-cw-text group-hover:text-cw-purple-light transition-colors">{nome}</h3>
              <p className="text-xs text-cw-muted leading-relaxed">{descricao}</p>
            </div>
            <p className="text-xs text-cw-muted font-medium">{conteudos} conteúdos</p>
          </div>
        ))}

        {/* Card Novo Playbook */}
        <button className="bg-cw-surface border border-dashed border-cw-border rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:border-cw-purple/50 hover:bg-cw-elevated transition-colors group min-h-[160px]">
          <div className="h-10 w-10 rounded-lg bg-cw-purple/10 flex items-center justify-center group-hover:bg-cw-purple/20 transition-colors">
            <Plus className="h-5 w-5 text-cw-purple-light" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-cw-muted group-hover:text-cw-text transition-colors text-sm">Novo Playbook</p>
            <p className="text-xs text-cw-muted/60 mt-0.5">Criar novo playbook do zero.</p>
          </div>
        </button>
      </div>
    </div>
  );
}
