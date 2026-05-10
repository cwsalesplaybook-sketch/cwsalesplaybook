/** Contexto global do papel selecionado (SDR/Closer). */
import { createContext, useContext, useState, ReactNode } from 'react';

export type Papel = 'SDR' | 'Closer';

interface Ctx {
  papel: Papel;
  setPapel: (p: Papel) => void;
}

const SidebarContext = createContext<Ctx | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [papel, setPapel] = useState<Papel>('SDR');
  return (
    <SidebarContext.Provider value={{ papel, setPapel }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebarContext deve ser usado dentro de SidebarProvider');
  return ctx;
}
