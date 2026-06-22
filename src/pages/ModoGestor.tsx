import { useState } from 'react';
import { Crown, ShieldCheck, BookOpen, Target, BarChart2, LayoutDashboard, Zap, Users, Map, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebarContext, type Papel } from '@/context/SidebarContext';
import { useEditor } from '@/admin/EditorContext';
import { Header } from '@/components/layout/Header';

const PLAYBOOKS = [
  { label: 'SDR',            papel: 'SDR' as Papel,           icon: Zap,     desc: 'Prospecção, qualificação e agendamento de reuniões.' },
  { label: 'Closer',         papel: 'Closer' as Papel,        icon: Target,  desc: 'Condução de reuniões e fechamento de vendas.' },
  { label: 'Parcerias',      papel: 'Parcerias' as Papel,     icon: Users,   desc: 'Processos e materiais para parcerias estratégicas.' },
  { label: 'Representantes', papel: 'Representante' as Papel, icon: Map,     desc: 'Gestão de contas e relacionamento.' },
];

const FERRAMENTAS = [
  { icon: ShieldCheck,     label: 'Editor de Conteúdo',    desc: 'Editar textos, avisos e links do playbook em tempo real.',     hint: 'Ctrl+Shift+E' },
  { icon: BookOpen,        label: 'Todos os Playbooks',    desc: 'Acessar o playbook de qualquer role usando o seletor acima.'              },
  { icon: Target,          label: 'Meta do Mês',           desc: 'Acompanhar progresso e metas individuais e do time.'                      },
  { icon: BarChart2,       label: 'Pipeline',              desc: 'Visualizar o funil de vendas em tempo real.'                              },
  { icon: LayoutDashboard, label: 'Sales Enablement',      desc: 'Dashboard geral com indicadores de performance do comercial.'             },
  { icon: Zap,             label: 'Automações',            desc: 'Gerenciar fluxos e regras de automação na Kommo.'                         },
];

const LIDERANCAS = [
  { nome: 'Ana Clara',          cargo: 'Coordenadora Comercial'    },
  { nome: 'Vanessa Alencar',    cargo: 'Coordenadora de Parcerias' },
  { nome: 'Gabrielly Oliveira', cargo: 'Criadora do Playbook'      },
  { nome: 'Pedro Ferreira',     cargo: 'Liderança de Pré-Vendas'  },
  { nome: 'Whenna Oliveira',    cargo: 'Liderança de Closer'       },
  { nome: 'Antonio Anderson',   cargo: 'Liderança de Pré-Vendas'  },
  { nome: 'Joelma Vieira',      cargo: 'Liderança de Pré-Vendas'  },
  { nome: 'Beatriz Magalhães',  cargo: 'Liderança de Parcerias'    },
];

export default function ModoGestor() {
  const { papel, setPapel } = useSidebarContext();
  const { isGestor } = useEditor();
  const navigate = useNavigate();
  const [switching, setSwitching] = useState<Papel | null>(null);

  if (!isGestor) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-cw-muted">
        <Crown className="h-8 w-8 opacity-30" />
        <p className="text-sm">Acesso restrito a gestores.</p>
      </div>
    );
  }

  const switchPlaybook = async (novoPapel: Papel) => {
    if (novoPapel === papel || switching) return;
    setSwitching(novoPapel);
    await new Promise(r => setTimeout(r, 300));
    setPapel(novoPapel);
    setSwitching(null);
    navigate('/start');
  };

  return (
    <>
      <Header titulo="Modo Gestor" subtitulo="Dashboards, ferramentas e lideranças do comercial" />
      <div className="p-8 space-y-10">

        {/* Trocar Playbook */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-cw-yellow" />
            <h2 className="text-lg font-bold">Trocar Playbook</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLAYBOOKS.map(({ label, papel: opt, icon: Icon, desc }) => {
              const isActive = papel === opt;
              const isSwitching = switching === opt;
              return (
                <button
                  key={opt}
                  onClick={() => switchPlaybook(opt)}
                  disabled={!!switching}
                  className={cn(
                    'relative flex flex-col items-center gap-3 p-6 rounded-2xl border text-sm font-bold transition-all duration-300',
                    isActive
                      ? 'bg-[#2d1760] border-cw-purple text-white shadow-lg shadow-cw-purple/20'
                      : switching
                        ? 'opacity-40 cursor-not-allowed bg-cw-surface border-cw-border text-cw-muted'
                        : 'bg-cw-surface border-cw-border text-cw-muted hover:border-cw-purple/50 hover:text-cw-text cursor-pointer'
                  )}
                >
                  {isSwitching ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Icon className={cn('h-6 w-6', isActive ? 'text-cw-yellow' : '')} />
                  )}
                  <div className="text-center">
                    <p className="leading-tight">{label}</p>
                    <p className={cn('text-[10px] font-normal mt-1 leading-snug', isActive ? 'text-white/60' : 'text-cw-muted/60')}>{desc}</p>
                  </div>
                  {isActive && !isSwitching && (
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-cw-yellow" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Ferramentas */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-cw-purple-light" />
            O que o gestor pode fazer
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FERRAMENTAS.map(({ icon: Icon, label, desc, hint }) => (
              <div key={label} className="cw-card p-4 flex gap-3">
                <div className="h-9 w-9 rounded-lg bg-cw-purple/20 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-cw-purple-light" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-semibold text-cw-text">{label}</p>
                    {hint && (
                      <span className="text-[9px] font-mono bg-cw-elevated text-cw-muted px-1.5 py-0.5 rounded border border-cw-border">{hint}</span>
                    )}
                  </div>
                  <p className="text-xs text-cw-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lideranças */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-cw-purple-light" />
            Lideranças e Coordenações
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {LIDERANCAS.map(({ nome, cargo }) => (
              <div key={nome} className="cw-card p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#4a0080] flex items-center justify-center text-[12px] font-black text-white shrink-0">
                  {nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-cw-text leading-tight">{nome}</p>
                  <p className="text-xs text-cw-muted mt-0.5">{cargo}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
