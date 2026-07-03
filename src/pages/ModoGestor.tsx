import { useEffect, useState } from 'react';
import { Crown, ShieldCheck, Target, BarChart2, LayoutDashboard, Zap, Users, Loader2, Eye, Pencil, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebarContext, type Papel, type ImpersonationTarget } from '@/context/SidebarContext';
import { useEditor } from '@/admin/EditorContext';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/integrations/supabase/client';

const PLAYBOOKS = [
  { label: 'SDR',    papel: 'SDR' as Papel,    icon: Zap,    desc: 'Prospecção, qualificação e agendamento de reuniões.' },
  { label: 'Closer', papel: 'Closer' as Papel, icon: Target, desc: 'Condução de reuniões e fechamento de vendas.' },
];

const FERRAMENTAS = [
  { icon: ShieldCheck,     label: 'Editor de Conteúdo',    desc: 'Editar textos, avisos e links do playbook em tempo real.',     hint: 'Ctrl+Shift+E' },
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

interface SdrProfile {
  userId: string;
  apelido: string;
  squad: string | null;
  papel: Papel;
}

export default function ModoGestor() {
  const { papel, setPapel, setImpersonating } = useSidebarContext();
  const { isGestor, isEditing, openPasswordModal, lock } = useEditor();
  const navigate = useNavigate();
  const [membros, setMembros] = useState<SdrProfile[]>([]);
  const [loadingMembros, setLoadingMembros] = useState(true);
  const [switching, setSwitching] = useState<Papel | null>(null);

  useEffect(() => {
    if (!isGestor) return;
    supabase
      .from('sdr_profiles')
      .select('user_id, apelido, squad, papel')
      .then(({ data }) => {
        if (data) {
          setMembros(
            data
              .filter(d => d.apelido)
              .map(d => ({
                userId: d.user_id,
                apelido: d.apelido as string,
                squad: d.squad ?? null,
                papel: (d.papel as Papel) ?? 'SDR',
              }))
          );
        }
        setLoadingMembros(false);
      });
  }, [isGestor]);

  if (!isGestor) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-cw-muted">
        <Crown className="h-8 w-8 opacity-30" />
        <p className="text-sm">Acesso restrito a gestores.</p>
      </div>
    );
  }

  const verComo = (membro: SdrProfile) => {
    const target: ImpersonationTarget = {
      apelido: membro.apelido,
      papel: membro.papel,
      squad: membro.squad,
      userId: membro.userId,
    };
    setImpersonating(target);
    navigate('/start');
  };

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

        {/* Ativar/desativar edição de conteúdo — antes só dava pelo atalho Ctrl+Shift+E */}
        <section className="cw-card p-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-cw-purple/20 flex items-center justify-center shrink-0">
              <Pencil className="h-4 w-4 text-cw-purple-light" />
            </div>
            <div>
              <p className="text-sm font-semibold text-cw-text">Editor de Conteúdo</p>
              <p className="text-xs text-cw-muted">
                {isEditing ? 'Ativo — os botões de editar aparecem nas páginas.' : 'Ative para editar textos, avisos e listas em tempo real.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => (isEditing ? lock() : openPasswordModal())}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0',
              isEditing
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30'
                : 'bg-cw-purple text-white hover:opacity-90'
            )}
          >
            {isEditing ? <><X className="h-4 w-4" /> Desativar</> : <><Pencil className="h-4 w-4" /> Ativar edição</>}
          </button>
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

        {/* Visualizar como membro */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-cw-purple-light" />
            <h2 className="text-lg font-bold">Visualizar como</h2>
            <span className="text-xs text-cw-muted font-normal">Veja o playbook pelos olhos de cada membro</span>
          </div>
          {loadingMembros ? (
            <div className="flex items-center gap-2 text-cw-muted text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando membros...
            </div>
          ) : membros.length === 0 ? (
            <p className="text-sm text-cw-muted">Nenhum membro configurou o perfil ainda.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {membros.map((m) => (
                <div key={m.userId} className="cw-card p-4 flex items-center gap-3 group">
                  <div className="h-10 w-10 rounded-full bg-[#4a0080] flex items-center justify-center text-[12px] font-black text-white shrink-0">
                    {(m.apelido ?? '?').split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-cw-text leading-tight truncate">{m.apelido}</p>
                    <p className="text-xs text-cw-muted mt-0.5">{m.papel}{m.squad ? ` · ${m.squad}` : ''}</p>
                  </div>
                  <button
                    onClick={() => verComo(m)}
                    title={`Ver como ${m.apelido}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-cw-purple-light bg-cw-purple/10 hover:bg-cw-purple/20 px-2 py-1 rounded-lg shrink-0"
                  >
                    <Eye className="h-3 w-3" />
                    Ver
                  </button>
                </div>
              ))}
            </div>
          )}
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
