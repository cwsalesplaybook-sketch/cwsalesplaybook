import { useEffect, useState } from 'react';
import { Crown, ShieldCheck, Target, BarChart2, LayoutDashboard, Zap, Users, Loader2, Eye, Pencil, X, KeyRound, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebarContext, type Papel, type ImpersonationTarget } from '@/context/SidebarContext';
import { useEditor } from '@/admin/EditorContext';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const PLAYBOOKS = [
  { label: 'SDR',    papel: 'SDR' as Papel,          icon: Zap,     desc: 'Prospecção, qualificação e agendamento de reuniões.' },
  { label: 'Closer', papel: 'Closer' as Papel,       icon: Target,  desc: 'Condução de reuniões e fechamento de vendas.' },
];

const FERRAMENTAS = [
  { icon: ShieldCheck,     label: 'Editor de Conteúdo',    desc: 'Editar textos, avisos e links do playbook em tempo real.',     hint: 'Ctrl+Shift+E' },
  { icon: Target,          label: 'Meta do Mês',           desc: 'Acompanhar progresso e metas individuais e do time.'                      },
  { icon: BarChart2,       label: 'Pipeline',              desc: 'Visualizar o funil de vendas em tempo real.'                              },
  { icon: LayoutDashboard, label: 'Sales Enablement',      desc: 'Dashboard geral com indicadores de performance do comercial.'             },
  { icon: Zap,             label: 'Automações',            desc: 'Gerenciar fluxos e regras de automação na Kommo.'                         },
];

const LIDERANCAS = [
  { nome: 'Gabrielly Oliveira', cargo: 'Criadora do Playbook'      },
  { nome: 'Pedro Ferreira',     cargo: 'Liderança de Pré-Vendas'  },
  { nome: 'Joelma Vieira',      cargo: 'Liderança de Pré-Vendas'  },
  { nome: 'Vithoria Pinheiro',  cargo: 'Liderança de Pré-Vendas'  },
  { nome: 'Ana Clara',          cargo: 'Liderança de Pré-Vendas'  },
  { nome: 'Whenna Oliveira',    cargo: 'Liderança de Closer'       },
  { nome: 'Vanessa Alencar',    cargo: 'Coordenadora de Parcerias' },
  { nome: 'Antonio Anderson',   cargo: 'Liderança de Pré-Vendas'  },
  { nome: 'Beatriz Magalhães',  cargo: 'Liderança de Parcerias'    },
];

interface Usuario {
  userId: string;
  email: string;
  apelido: string;
  squad: string | null;
  papel: Papel | null;
  temPerfil: boolean;
}

export default function ModoGestor() {
  const { papel, lockedPapel, setPapelPreview, clearPapelPreview, setImpersonating } = useSidebarContext();
  const { isGestor, isEditing, openPasswordModal, lock } = useEditor();
  const navigate = useNavigate();
  const [membros, setMembros] = useState<Usuario[]>([]);
  const [loadingMembros, setLoadingMembros] = useState(true);
  const [switching, setSwitching] = useState<Papel | null>(null);
  const [pendingPapel, setPendingPapel] = useState<Papel | null>(null);
  const [resetando, setResetando] = useState<string | null>(null);
  const [senhaTemp, setSenhaTemp] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isGestor) return;
    supabase.functions.invoke('listar-usuarios').then(({ data }) => {
      const lista = (data as { usuarios?: Usuario[] } | null)?.usuarios ?? [];
      setMembros(lista.map(u => ({ ...u, papel: (u.papel as Papel) ?? null })));
      setLoadingMembros(false);
    }).catch(() => setLoadingMembros(false));
  }, [isGestor]);

  const resetarSenha = async (u: Usuario) => {
    setResetando(u.userId);
    try {
      const { data, error } = await supabase.functions.invoke('admin-reset-password', {
        body: { email: u.email, userId: u.userId },
      });
      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error ?? 'Falhou');
      setSenhaTemp(s => ({ ...s, [u.userId]: data.senha as string }));
    } catch (e) {
      toast({ title: 'Erro ao resetar', description: e instanceof Error ? e.message : 'Tente de novo.', variant: 'destructive' });
    } finally {
      setResetando(null);
    }
  };

  if (!isGestor) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-cw-muted">
        <Crown className="h-8 w-8 opacity-30" />
        <p className="text-sm">Acesso restrito a gestores.</p>
      </div>
    );
  }

  const verComo = (membro: Usuario) => {
    const target: ImpersonationTarget = {
      apelido: membro.apelido,
      papel: membro.papel ?? 'SDR',
      squad: membro.squad,
      userId: membro.userId,
    };
    setImpersonating(target);
    navigate('/start');
  };

  const pedirTroca = (novoPapel: Papel) => {
    if (novoPapel === papel || switching) return;
    setPendingPapel(novoPapel);
  };

  const confirmarTroca = async () => {
    if (!pendingPapel) return;
    const destino = pendingPapel;
    setPendingPapel(null);
    setSwitching(destino);
    await new Promise(r => setTimeout(r, 300));
    if (destino === lockedPapel) clearPapelPreview();
    else setPapelPreview(destino);
    setSwitching(null);
    navigate('/start');
  };

  const pendingLabel = PLAYBOOKS.find(p => p.papel === pendingPapel)?.label ?? pendingPapel;

  return (
    <>
      <Header titulo="Modo Gestor" subtitulo="Dashboards, ferramentas e lideranças do comercial" />

      {pendingPapel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <p className="text-lg font-bold text-cw-text mb-2">Trocar de dashboard?</p>
            <p className="text-sm text-cw-muted mb-6">
              Você deseja ir para o dashboard de <span className="font-bold text-cw-text">{pendingLabel}</span>?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPendingPapel(null)}
                className="flex-1 py-2.5 rounded-xl border border-cw-border text-cw-text font-semibold hover:bg-cw-elevated transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarTroca}
                className="flex-1 py-2.5 rounded-xl bg-cw-purple text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

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
                  onClick={() => pedirTroca(opt)}
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

        {/* Usuários */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-cw-purple-light" />
            <h2 className="text-lg font-bold">Usuários</h2>
            <span className="text-xs text-cw-muted font-normal">Resete a senha ou veja o playbook pelos olhos de qualquer pessoa</span>
          </div>
          {loadingMembros ? (
            <div className="flex items-center gap-2 text-cw-muted text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando usuários...
            </div>
          ) : membros.length === 0 ? (
            <p className="text-sm text-cw-muted">Ninguém criou conta ainda.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {membros.map((m) => (
                <div key={m.userId} className="cw-card p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#4a0080] flex items-center justify-center text-[12px] font-black text-white shrink-0">
                      {(m.apelido ?? '?').split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-cw-text leading-tight truncate">{m.apelido}</p>
                      <p className="text-xs text-cw-muted mt-0.5 truncate">{m.email}</p>
                      <p className="text-[11px] text-cw-muted mt-0.5">
                        {m.papel ?? 'sem papel'}{m.squad ? ` · ${m.squad}` : ''}{!m.temPerfil && ' · sem onboarding'}
                      </p>
                    </div>
                  </div>

                  {senhaTemp[m.userId] ? (
                    <div className="flex flex-wrap items-center gap-2 text-[11px] border-t border-cw-border/50 pt-2">
                      <span className="text-cw-muted">Senha temporária:</span>
                      <code className="px-2 py-1 rounded-md bg-cw-purple/10 border border-cw-purple/30 text-cw-text font-mono tracking-wider">{senhaTemp[m.userId]}</code>
                      <button
                        onClick={() => { navigator.clipboard?.writeText(senhaTemp[m.userId]); toast({ title: 'Copiado', description: 'Repasse pra pessoa. Ela troca em "Trocar senha" depois de entrar.' }); }}
                        className="text-cw-purple-light hover:underline font-semibold"
                      >
                        Copiar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 border-t border-cw-border/50 pt-2">
                      <button
                        onClick={() => resetarSenha(m)}
                        disabled={resetando === m.userId}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-cw-purple-light bg-cw-purple/10 hover:bg-cw-purple/20 px-2.5 py-1.5 rounded-lg disabled:opacity-50"
                      >
                        {resetando === m.userId
                          ? <RefreshCw className="h-3 w-3 animate-spin" />
                          : <KeyRound className="h-3 w-3" />}
                        {resetando === m.userId ? 'Gerando...' : 'Resetar senha'}
                      </button>
                      <button
                        onClick={() => verComo(m)}
                        title={`Ver como ${m.apelido}`}
                        className="flex items-center gap-1 text-[11px] font-bold text-cw-muted hover:text-cw-text px-2 py-1.5 rounded-lg"
                      >
                        <Eye className="h-3 w-3" />
                        Ver como
                      </button>
                    </div>
                  )}
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
