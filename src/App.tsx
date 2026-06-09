/** Roteamento e layout global do CW Sales Playbook. */
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
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
import { OnboardingWizard } from '@/components/OnboardingWizard';
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
import PainelControle from '@/pages/PainelControle';
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
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        setNeedsOnboarding(data.session.user.user_metadata?.onboarding_done !== true);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
      if (s) {
        setNeedsOnboarding(s.user.user_metadata?.onboarding_done !== true);
        // SDRs que concluíram onboarding abrem direto em "Comece Aqui"
        if (_event === 'SIGNED_IN') {
          const meta = s.user.user_metadata;
          if (meta?.papel === 'SDR' && meta?.onboarding_done === true) {
            setLoginRedirect('/start');
          }
        }
      } else {
        setNeedsOnboarding(false);
        setLoginRedirect(null);
      }
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
              {loginRedirect && <Navigate to={loginRedirect} replace />}
              {needsOnboarding && (
                <OnboardingWizard onComplete={() => setNeedsOnboarding(false)} />
              )}
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
