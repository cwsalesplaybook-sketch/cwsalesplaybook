/** Contexto global do papel selecionado (SDR/Closer) com persistência via Supabase. */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Papel = 'SDR' | 'Closer';

interface Ctx {
  papel: Papel;
  setPapel: (p: Papel) => void;
  /** Papel fixado pelo onboarding — null se o usuário ainda não completou. */
  lockedPapel: Papel | null;
  squad: string | null;
  apelido: string | null;
  /** Bloqueia navegação na sidebar enquanto o wizard de onboarding está ativo. */
  onboardingActive: boolean;
  setOnboardingActive: (v: boolean) => void;
}

const SidebarContext = createContext<Ctx | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [papel, setPapelState] = useState<Papel>(() => {
    return (localStorage.getItem('cw-papel') as Papel) ?? 'SDR';
  });
  const [lockedPapel, setLockedPapel] = useState<Papel | null>(null);
  const [squad, setSquad] = useState<string | null>(null);
  const [apelido, setApelido] = useState<string | null>(null);
  const [onboardingActive, setOnboardingActive] = useState(false);

  const applyMeta = (m: Record<string, unknown>) => {
    const saved = m?.papel as Papel | undefined;
    if (saved) {
      setPapelState(saved);
      setLockedPapel(saved);
      localStorage.setItem('cw-papel', saved);
    }
    setSquad((m?.squad as string) ?? null);
    setApelido((m?.apelido as string) ?? null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) applyMeta(data.session.user.user_metadata ?? {});
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) {
        setLockedPapel(null);
        setSquad(null);
        setApelido(null);
        return;
      }
      applyMeta(session.user.user_metadata ?? {});
    });

    return () => subscription.unsubscribe();
  }, []);

  const setPapel = (p: Papel) => {
    setPapelState(p);
    localStorage.setItem('cw-papel', p);
  };

  return (
    <SidebarContext.Provider value={{ papel, setPapel, lockedPapel, squad, apelido, onboardingActive, setOnboardingActive }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebarContext deve ser usado dentro de SidebarProvider');
  return ctx;
}
