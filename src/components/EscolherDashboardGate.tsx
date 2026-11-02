/** Pergunta em qual dashboard entrar:
 *  - Gestor: toda vez que abre o app (1x por aba), pra não cair no dashboard errado.
 *    A escolha é uma prévia — o papel real dele não muda.
 *  - Quem ficou com papel que não existe mais (ex.: "Parcerias"): escolhe e salva o novo.
 *  Estilo espelha o SquadReassignGate/OnboardingWizard fullscreen. */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Target, Crown, ArrowRight, LayoutDashboard, Check, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useEditor } from '@/admin/EditorContext';
import { useSidebarContext, isPapelValido, type Papel } from '@/context/SidebarContext';
import { toast } from '@/hooks/use-toast';

const ESCOLHIDO_KEY = 'cw-dashboard-escolhido';

const OPCOES: { papel: Papel; desc: string; icon: LucideIcon }[] = [
  { papel: 'SDR',       desc: 'Prospecção, qualificação e agendamento de reuniões.', icon: Zap },
  { papel: 'Closer',    desc: 'Condução de reuniões e fechamento de vendas.',        icon: Target },
  { papel: 'Liderança', desc: 'Gestão, acompanhamento e desenvolvimento do time.',   icon: Crown },
];

function jaEscolheu() {
  try { return sessionStorage.getItem(ESCOLHIDO_KEY) === '1'; } catch { return false; }
}

export function EscolherDashboardGate() {
  const { user, updateProfile } = useAuth();
  const { isGestor } = useEditor();
  const { papel, lockedPapel, setPapel, setPapelPreview, clearPapelPreview, impersonating, papelReady } = useSidebarContext();
  const navigate = useNavigate();
  const [escolhido, setEscolhido] = useState<Papel | null>(null);
  const [fechado, setFechado] = useState(jaEscolheu);
  const [saving, setSaving] = useState(false);

  if (!papelReady || !user || user.onboarding_done !== true || impersonating || fechado) return null;

  const papelInvalido = !!user.papel && !isPapelValido(user.papel);
  if (!isGestor && !papelInvalido) return null;

  // Liderança só aparece pra quem já é Liderança de verdade.
  const opcoes = OPCOES.filter(o => o.papel !== 'Liderança' || user.papel === 'Liderança');
  const selecionado = escolhido ?? (opcoes.some(o => o.papel === papel) ? papel : null);

  const confirmar = async () => {
    if (!selecionado || saving) return;
    setSaving(true);
    if (papelInvalido) {
      // Salva o dashboard novo no perfil (só SDR/Closer passam pela API).
      const r = await updateProfile({ papel: selecionado }, 'PATCH');
      if (!r.ok) {
        toast({ title: 'Não deu pra salvar', description: r.error ?? 'Tente de novo.', variant: 'destructive' });
        setSaving(false);
        return;
      }
      setPapel(selecionado);
    } else if (selecionado === lockedPapel) {
      clearPapelPreview();
    } else {
      setPapelPreview(selecionado);
    }
    try { sessionStorage.setItem(ESCOLHIDO_KEY, '1'); } catch { /* aba anônima: pergunta de novo no reload */ }
    setFechado(true);
    navigate('/start');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8"
      style={{ background: 'linear-gradient(180deg, #1a0f2e 0%, #130a22 100%)' }}>
      <div className="w-full max-w-[480px] mx-4">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl px-6 py-3 shadow-xl">
            <img
              src="https://cardapioweb.com/wp-content/uploads/2024/01/Logo-Cardapio-Web.png"
              alt="Cardápio Web"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        <div className="cw-card p-8 space-y-5">
          <div>
            <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-lg">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-cw-text mb-1.5">Em qual dashboard você quer entrar?</h1>
            <p className="text-sm text-cw-muted leading-relaxed">
              {papelInvalido
                ? 'O dashboard que estava no seu perfil não existe mais. Escolha o dashboard certo pra continuar.'
                : 'Escolha o dashboard do time que você vai acompanhar agora. Dá pra trocar depois pelo Modo Gestor.'}
            </p>
          </div>

          <div className="grid gap-2.5">
            {opcoes.map(o => {
              const Icon = o.icon;
              const ativo = selecionado === o.papel;
              return (
                <button
                  key={o.papel}
                  onClick={() => setEscolhido(o.papel)}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 text-left transition-all duration-150 flex items-center gap-3',
                    ativo ? 'border-cw-purple bg-cw-purple/10' : 'border-cw-border bg-cw-elevated hover:border-cw-purple/40',
                  )}
                >
                  <span className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', ativo ? 'gradient-primary text-white' : 'bg-cw-purple/10 text-cw-purple')}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-black text-cw-text">{o.papel}</span>
                    <span className="block text-[11px] text-cw-muted leading-snug mt-0.5">{o.desc}</span>
                  </span>
                  {ativo && (
                    <span className="h-5 w-5 rounded-full gradient-primary flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={confirmar}
            disabled={!selecionado || saving}
            className="w-full py-3 rounded-xl gradient-primary text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
          >
            {saving ? 'Entrando…' : 'Entrar no dashboard'} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
