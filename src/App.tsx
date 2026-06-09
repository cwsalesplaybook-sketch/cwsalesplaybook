/** Roteamento e layout global do CW Sales Playbook. */
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/context/SidebarContext';
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
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

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
          <Route path="/start" element={<Start />} />
          <Route path="/playbook" element={<Playbook />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/cultura" element={<Cultura />} />
          <Route path="/historias" element={<HistoriasSucesso />} />
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
    // Pega sessão atual
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    // Escuta mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Carregando sessão
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
          {session ? <AppLayout /> : <Login />}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
