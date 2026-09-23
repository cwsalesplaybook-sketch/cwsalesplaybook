/** Contexto global do papel selecionado (SDR/Closer) com persistência via API própria. */
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useAuth, type AuthUser } from '@/context/AuthContext';

export type Papel = 'SDR' | 'Closer' | 'Parcerias' | 'Liderança';

export interface ImpersonationTarget {
  apelido: string;
  papel: Papel;
  squad: string | null;
  userId: string;
}

interface Ctx {
  papel: Papel;
  setPapel: (p: Papel) => void;
  /** Troca de dashboard do Modo Gestor (preview): "trava" o papel escolhido
   *  localmente até o próprio gestor confirmar a volta, sem deixar o próximo
   *  refresh de sessão (onAuthStateChange) reverter sozinho pro papel real. */
  setPapelPreview: (p: Papel) => void;
  /** Confirma a volta pro papel real e destrava os refreshes de sessão. */
  clearPapelPreview: () => void;
  /** Papel fixado pelo onboarding — null se o usuário ainda não completou. */
  lockedPapel: Papel | null;
  squad: string | null;
  /** Squads que a liderança acompanha (vazio para não-líderes). */
  squadsLideradas: string[];
  apelido: string | null;
  /** Bloqueia navegação na sidebar enquanto o wizard de onboarding está ativo. */
  onboardingActive: boolean;
  setOnboardingActive: (v: boolean) => void;
  /** Impersonação: gestor visualizando como outro usuário. */
  impersonating: ImpersonationTarget | null;
  setImpersonating: (target: ImpersonationTarget | null) => void;
  /** false até a sessão carregar e o papel real (auth) ser aplicado —
   *  evita a Sidebar piscar com o papel padrão antes do papel real chegar. */
  papelReady: boolean;
}

const SidebarContext = createContext<Ctx | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [papel, setPapelState] = useState<Papel>(() => {
    return (localStorage.getItem('cw-papel') as Papel) ?? 'SDR';
  });
  const [lockedPapel, setLockedPapel] = useState<Papel | null>(null);
  const [squad, setSquad] = useState<string | null>(null);
  const [squadsLideradas, setSquadsLideradas] = useState<string[]>([]);
  const [apelido, setApelido] = useState<string | null>(null);
  const [onboardingActive, setOnboardingActive] = useState(false);
  const [impersonating, setImpersonating] = useState<ImpersonationTarget | null>(null);
  const [papelReady, setPapelReady] = useState(false);
  const previewLockRef = useRef(false);
  const { status, user } = useAuth();

  const applyMeta = (m: AuthUser) => {
    const saved = m.papel as Papel | null;
    if (saved) {
      // Enquanto o gestor estiver "travado" numa prévia de outro dashboard,
      // não deixa o refresh de sessão sobrescrever a troca manual.
      if (!previewLockRef.current) {
        setPapelState(saved);
        localStorage.setItem('cw-papel', saved);
      }
      setLockedPapel(saved);
      setOnboardingActive(false);
    } else {
      setOnboardingActive(true);
    }
    setSquad(m.squad ?? null);
    setSquadsLideradas(Array.isArray(m.squads_lideradas) ? m.squads_lideradas : []);
    setApelido(m.apelido ?? null);
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'anon' || !user) {
      previewLockRef.current = false;
      setLockedPapel(null);
      setSquad(null);
      setSquadsLideradas([]);
      setApelido(null);
      setOnboardingActive(false);
      setPapelReady(true);
      return;
    }
    applyMeta(user);
    setPapelReady(true);
  }, [status, user]);

  const setPapel = (p: Papel) => {
    setPapelState(p);
    localStorage.setItem('cw-papel', p);
  };

  const setPapelPreview = (p: Papel) => {
    previewLockRef.current = true;
    setPapelState(p);
    localStorage.setItem('cw-papel', p);
  };

  const clearPapelPreview = () => {
    previewLockRef.current = false;
    const real = lockedPapel ?? papel;
    setPapelState(real);
    localStorage.setItem('cw-papel', real);
  };

  // Quando impersonando, sobrescreve papel/squad/apelido visíveis
  const visiblePapel = impersonating ? impersonating.papel : papel;
  const visibleSquad = impersonating ? impersonating.squad : squad;
  const visibleApelido = impersonating ? impersonating.apelido : apelido;

  return (
    <SidebarContext.Provider value={{
      papel: visiblePapel, setPapel, setPapelPreview, clearPapelPreview, lockedPapel,
      squad: visibleSquad, squadsLideradas, apelido: visibleApelido,
      onboardingActive, setOnboardingActive,
      impersonating, setImpersonating,
      papelReady,
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebarContext deve ser usado dentro de SidebarProvider');
  return ctx;
}

/**
 * Re-provê o contexto com um `papel` fixo, sobrescrevendo o real apenas para a
 * subárvore (ex: uma página de rota). Usado para páginas que devem ser idênticas
 * em todos os dashboards (Comece Aqui, Cultura, Histórias, Pipeline): forçando
 * `papel="SDR"`, o conteúdo lido por useEditableContent usa as chaves sem prefixo
 * de setor — ou seja, o mesmo conteúdo do SDR para qualquer usuário.
 * A Sidebar fica fora dessa subárvore, então mantém o papel real.
 */
export function ForcePapel({ papel, children }: { papel: Papel; children: ReactNode }) {
  const ctx = useSidebarContext();
  return (
    <SidebarContext.Provider value={{ ...ctx, papel }}>
      {children}
    </SidebarContext.Provider>
  );
}
