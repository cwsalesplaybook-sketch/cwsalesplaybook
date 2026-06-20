/** Roteamento e layout global do CW Sales Playbook. */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Users, Trophy, Map, BarChart3, Settings } from 'lucide-react';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/context/SidebarContext';
import { UserProvider } from '@/context/UserContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { EditorProvider } from '@/admin/EditorContext';
import { EditorBanner } from '@/admin/EditorBanner';
import { PasswordGate } from '@/admin/PasswordGate';
import Dashboard from '@/components/dashboard/Dashboard';
import Agenda from '@/components/agenda/Agenda';
import Cultura from '@/components/cultura/Cultura';
import Onboarding from '@/components/onboarding/Onboarding';
import Carreira from '@/components/carreira/Carreira';
import Berserker from '@/components/berserker/Berserker';
import Playbook from '@/components/playbook/Playbook';
import Pipeline from '@/components/pipeline/Pipeline';
import Gestao from '@/components/gestao/Gestao';
import Start from '@/pages/Start';
import BadgesPage from '@/pages/Badges';
import Automacoes from '@/pages/Automacoes';
import Biblioteca from '@/pages/Biblioteca';
import RegrasConduta from '@/pages/RegrasConduta';
import TreinamentoTiers from '@/pages/TreinamentoTiers';
import NotFound from './pages/NotFound';
import { GestorLayout } from '@/pages/gestor/GestorLayout';
import GestorDashboard from '@/pages/gestor/GestorDashboard';
import GestorPlaybooks from '@/pages/gestor/GestorPlaybooks';
import GestorPlaceholder from '@/pages/gestor/GestorPlaceholder';

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
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/badges" element={<BadgesPage />} />
          <Route path="/carreira" element={<Carreira />} />
          <Route path="/gestao" element={<Gestao />} />
          <Route path="/berserker" element={<Berserker />} />
          <Route path="/automacoes" element={<Automacoes />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/regras" element={<RegrasConduta />} />
          <Route path="/treinamento" element={<TreinamentoTiers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UserProvider>
          <EditorProvider>
            <SidebarProvider>
              <Routes>
                {/* Modo Gestor — layout próprio, sem sidebar principal */}
                <Route path="/gestor" element={<GestorLayout />}>
                  <Route index element={<GestorDashboard />} />
                  <Route path="times" element={<GestorPlaceholder titulo="Times" subtitulo="Gerencie os times comerciais" Icon={Users} />} />
                  <Route path="ranking" element={<GestorPlaceholder titulo="Ranking" subtitulo="Performance do time" Icon={Trophy} />} />
                  <Route path="playbooks" element={<GestorPlaybooks />} />
                  <Route path="trilhas" element={<GestorPlaceholder titulo="Trilhas" subtitulo="Trilhas de aprendizado" Icon={Map} />} />
                  <Route path="relatorios" element={<GestorPlaceholder titulo="Relatórios" subtitulo="Análises e relatórios" Icon={BarChart3} />} />
                  <Route path="configuracoes" element={<GestorPlaceholder titulo="Configurações" subtitulo="Configurações do sistema" Icon={Settings} />} />
                </Route>
                {/* App principal */}
                <Route
                  path="/*"
                  element={
                    <div className="dark flex h-screen w-full overflow-hidden bg-cw-bg text-cw-text">
                      <Sidebar />
                      <main className="flex-1 overflow-y-auto scrollbar-cw">
                        <EditorBanner />
                        <AnimatedRoutes />
                      </main>
                      <PasswordGate />
                    </div>
                  }
                />
              </Routes>
            </SidebarProvider>
          </EditorProvider>
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
