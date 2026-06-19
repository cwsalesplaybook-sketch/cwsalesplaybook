/** Roteamento e layout global do CW Sales Playbook. */
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider, ForcePapel } from '@/context/SidebarContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { FloatingSearch } from '@/components/FloatingSearch';
import { EditorProvider } from '@/admin/EditorContext';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { EditorBanner } from '@/admin/EditorBanner';
import { PasswordGate } from '@/admin/PasswordGate';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import Login from '@/pages/Login';
import Dashboard from '@/components/dashboard/Dashboard';
import Agenda from '@/components/agenda/Agenda';
import Cultura from '@/components/cultura/Cultura';
import Onboarding from '@/components/onboarding/Onboarding';
import Carreira from '@/components/carreira/Carreira';
import Berserker from '@/components/berserker/Berserker';
import Playbook from '@/components/playbook/Playbook';
import PlaybookCloser from '@/components/playbook/PlaybookCloser';
import PlaybookParcerias from '@/components/playbook/PlaybookParcerias';
import PlaybookRepresentantes from '@/components/playbook/PlaybookRepresentantes';
import Pipeline from '@/components/pipeline/Pipeline';
import Gestao from '@/components/gestao/Gestao';
import Ranking from '@/components/ranking/Ranking';
import MetaMes from '@/components/meta/MetaMes';
import Start from '@/pages/Start';
import BadgesPage from '@/pages/Badges';
import FaqPage from '@/pages/Faq';
import MuralPage from '@/pages/MuralPage';
import ChangelogPage from '@/pages/ChangelogPage';
import HistoriasSucesso from '@/pages/HistoriasSucesso';
import Calculadora from '@/pages/Calculadora';
import GestorAdminPage from '@/pages/GestorAdminPage';
import PainelControle from '@/pages/PainelControle';
import CloserPlanos from '@/pages/closer/Planos';
import CloserObjecoes from '@/pages/closer/Objecoes';
import CloserProcesso from '@/pages/closer/Processo';
import CloserRotina from '@/pages/closer/Rotina';
import CloserConcorrentes from '@/pages/closer/Concorrentes';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const SESSION_KEY = 'cw-login-redirected';

/**
 * Roda dentro do BrowserRouter para ter acesso ao useNavigate.
 * Redireciona para /start UMA única vez por login.
 * sessionStorage garante que o flag sobrevive re-renders mas é limpo ao fechar a aba.
 */
function LoginRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'SIGNED_IN') {
        // Só redireciona se ainda não o fez nesta sessão do browser
        if (!sessionStorage.getItem(SESSION_KEY)) {
          sessionStorage.setItem(SESSION_KEY, '1');
          navigate('/start', { replace: true });
        }
      }
      if (_event === 'SIGNED_OUT') {
        sessionStorage.removeItem(SESSION_KEY);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="min-h-full"
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          {/* Comece Aqui, Cultura, Histórias e Pipeline são idênticos em todos os
              dashboards: ForcePapel="SDR" faz lerem o conteúdo global (sem prefixo). */}
          <Route path="/start" element={<ForcePapel papel="SDR"><Start /></ForcePapel>} />
          <Route path="/playbook" element={<Playbook />} />
          <Route path="/playbook/closer" element={<PlaybookCloser />} />
          <Route path="/playbook/parcerias" element={<PlaybookParcerias />} />
          <Route path="/playbook/representantes" element={<PlaybookRepresentantes />} />
          {/* Seções do dashboard de Closer */}
          <Route path="/closer/planos" element={<CloserPlanos />} />
          <Route path="/closer/objecoes" element={<CloserObjecoes />} />
          <Route path="/closer/processo" element={<CloserProcesso />} />
          <Route path="/closer/rotina" element={<CloserRotina />} />
          <Route path="/closer/concorrentes" element={<CloserConcorrentes />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/pipeline" element={<ForcePapel papel="SDR"><Pipeline /></ForcePapel>} />
          <Route path="/cultura" element={<ForcePapel papel="SDR"><Cultura /></ForcePapel>} />
          <Route path="/historias" element={<ForcePapel papel="SDR"><HistoriasSucesso /></ForcePapel>} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/badges" element={<BadgesPage />} />
          <Route path="/carreira" element={<Carreira />} />
          <Route path="/gestao" element={<Gestao />} />
          <Route path="/berserker" element={<Berserker />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/meta" element={<MetaMes />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/mural" element={<MuralPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/calculadora" element={<Calculadora />} />
          <Route path="/admin" element={<GestorAdminPage />} />
          <Route path="/painel" element={<PainelControle />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppLayout() {
  useActivityTracker();
  return (
    <EditorProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden bg-cw-bg text-cw-text">
          <Sidebar />
          <main className="flex-1 overflow-y-auto scrollbar-cw">
            <EditorBanner />
            <AnimatedRoutes />
          </main>
          <PasswordGate />
          <FloatingSearch />
        </div>
      </SidebarProvider>
    </EditorProvider>
  );
}

const App = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-cw-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cw-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {session ? (
            <>
              <AppLayout />
              <LoginRedirectHandler />
            </>
          ) : (
            <Login />
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
