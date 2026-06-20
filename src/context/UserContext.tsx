import { createContext, useContext, useState, type ReactNode } from 'react';

export const MASTER_EMAILS = [
  'glauton@cardapioweb.com',
  'matheus.lessa@cardapioweb.com',
  'johnnyalves@cardapioweb.com',
  'ana.clara@cardapioweb.com',
  'vanessa.alencar@cardapioweb.com',
  'gabrielly.oliveira@cardapioweb.com',
];

const LS_KEY = 'cw.user.email';

interface UserCtx {
  email: string | null;
  setEmail: (email: string) => void;
  clearEmail: () => void;
  isMaster: boolean;
}

const Ctx = createContext<UserCtx | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [email, setEmailState] = useState<string | null>(() => localStorage.getItem(LS_KEY));

  const setEmail = (e: string) => {
    const normalized = e.trim().toLowerCase();
    localStorage.setItem(LS_KEY, normalized);
    setEmailState(normalized);
  };

  const clearEmail = () => {
    localStorage.removeItem(LS_KEY);
    setEmailState(null);
  };

  const isMaster = !!email && MASTER_EMAILS.includes(email);

  return (
    <Ctx.Provider value={{ email, setEmail, clearEmail, isMaster }}>
      {children}
    </Ctx.Provider>
  );
}

export function useUser() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useUser deve ser usado dentro de UserProvider');
  return ctx;
}
