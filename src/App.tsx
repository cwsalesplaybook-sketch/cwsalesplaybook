/** Roteamento e layout global do CW Sales Playbook. */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider, ForcePapel, useSidebarContext } from '@/context/SidebarContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { FloatingSearch } from '@/components/FloatingSearch';
import { EditorProvider } from '@/admin/EditorContext';
import { EditorBanner } from '@/admin/EditorBanner';
import { ImpersonationBanner } from '@/components/layout/ImpersonationBanner';
import { PasswordGate } from '@/admin/PasswordGate';
import { SquadReassignGate } from '@/components/SquadReassignGate';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Login from '@/pages/Login';
import TrocarSenha from '@/pages/TrocarSenha';
import Dashboard from '@/components/dashboard/Dashboard';
import Agenda from '@/components/agenda/Agenda';
import Cultura from '@/components/cultura/Cultura';
import Onboarding from '@/components/onboarding/Onboarding';
import Carreira from '@/components/carreira/Carreira';
import Berserker from '@/components/berserker/Berserker';
import Playbook from '@/components/playbook/Playbook';
import PlaybookCloser from '@/components/playbook/PlaybookCloser';
import PlaybookParcerias from '@/components/playbook/PlaybookParcerias';
import Pipeline from '@/components/pipeline/Pipeline';
import Gestao from '@/components/gestao/Gestao';
import MetaMes from '@/components/meta/MetaMes';
import Promocoes from '@/pages/Promocoes';
import Start from '@/pages/Start';
import BadgesPage from '@/pages/Badges';
import FaqPage from '@/pages/Faq';
import MuralPage from '@/pages/MuralPage';
import ChangelogPage from '@/pages/ChangelogPage';
import HistoriasSucesso from '@/pages/HistoriasSucesso';
import Calculadora from '@/pages/Calculadora';
import Planos from '@/pages/Planos';
import CwStore from '@/pages/CwStore';
import GestorAdminPage from '@/pages/GestorAdminPage';
import PainelControle from '@/pages/PainelControle';
import CloserPlanos from '@/pages/closer/Planos';
import CloserObjecoes from '@/pages/closer/Objecoes';
import CloserDashboard from '@/pages/closer/Dashboard';
import CloserTemplates from '@/pages/closer/Templates';
import SdrTemplates from '@/pages/sdr/Templates';
import Roleplay from '@/pages/sdr/Roleplay';
import CloserDescontos from '@/pages/closer/Descontos';
import CloserMetas from '@/pages/closer/Metas';
import CloserProcesso from '@/pages/closer/Processo';
import CloserRotina from '@/pages/closer/Rotina';
import CloserConcorrentes from '@/pages/closer/Concorrentes';
import Comunidade from '@/pages/Comunidade';
import CentralAjuda from '@/pages/CentralAjuda';
import Automacoes from '@/pages/Automacoes';
import Biblioteca from '@/pages/Biblioteca';
import RegrasConduta from '@/pages/RegrasConduta';
import TreinamentoTiers from '@/pages/TreinamentoTiers';
import ModoGestor from '@/pages/ModoGestor';
import NotFound from './pages/NotFound';
import { UserProvider } from '@/context/UserContext';
import { GestorLayout } from '@/pages/gestor/GestorLayout';
import GestorDashboard from '@/pages/gestor/GestorDashboard';
import GestorPlaybooks from '@/pages/gestor/GestorPlaybooks';
import GestorPlaceholder from '@/pages/gestor/GestorPlaceholder';
import { Users, Trophy, Map as GestorMap, BarChart3, Settings } from 'lucide-react';

const queryClient = new QueryClient();

/** Rota "/" (Sales Enablement) é do dashboard padrão/liderança — um Closer que
 *  chegue aqui por link antigo/salvo é levado pro próprio dashboard, já que
 *  a página não faz parte da nav dele. */
function HomeRoute() {
  const { papel } = useSidebarContext();
  if (papel === 'Closer') return <Navigate to="/closer/dashboard" replace />;
  return <Dashboard />;
}

function OnboardingRoute() {
  return <Onboarding />;
}

function PipelineRoute() {
  return <ForcePapel papel="SDR"><Pipeline /></ForcePapel>;
}

function MetaRoute() {
  return <MetaMes />;
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
        className="h-full"
      >
        <Routes location={location}>
          <Route path="/" element={<HomeRoute />} />
          {/* Comece Aqui, Cultura, Histórias e Pipeline são idênticos em todos os
              dashboards: ForcePapel="SDR" faz lerem o conteúdo global (sem prefixo). */}
          <Route path="/start" element={<ForcePapel papel="SDR"><Start /></ForcePapel>} />
          <Route path="/playbook" element={<Playbook />} />
          <Route path="/sdr/templates" element={<SdrTemplates />} />
          <Route path="/sdr/roleplay" element={<Roleplay />} />
          {/* Tira-dúvidas saiu da nav, virou Roleplay — redireciona link antigo. */}
          <Route path="/sdr/tira-duvidas" element={<Navigate to="/sdr/roleplay" replace />} />
          <Route path="/playbook/closer" element={<PlaybookCloser />} />
          <Route path="/playbook/parcerias" element={<PlaybookParcerias />} />
          {/* Seções do dashboard de Closer */}
          <Route path="/closer/dashboard" element={<CloserDashboard />} />
          <Route path="/closer/planos" element={<CloserPlanos />} />
          <Route path="/closer/templates" element={<CloserTemplates />} />
          <Route path="/closer/descontos" element={<CloserDescontos />} />
          <Route path="/closer/metas" element={<CloserMetas />} />
          {/* Cupons migrou para Descontos — redireciona links antigos. */}
          <Route path="/closer/cupons" element={<Navigate to="/closer/descontos" replace />} />
          <Route path="/closer/objecoes" element={<CloserObjecoes />} />
          <Route path="/closer/processo" element={<CloserProcesso />} />
          <Route path="/closer/rotina" element={<CloserRotina />} />
          <Route path="/closer/concorrentes" element={<CloserConcorrentes />} />
          <Route path="/comunidade" element={<Comunidade />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/pipeline" element={<PipelineRoute />} />
          <Route path="/cultura" element={<ForcePapel papel="SDR"><Cultura /></ForcePapel>} />
          <Route path="/historias" element={<ForcePapel papel="SDR"><HistoriasSucesso /></ForcePapel>} />
          <Route path="/onboarding" element={<OnboardingRoute />} />
          <Route path="/badges" element={<BadgesPage />} />
          <Route path="/carreira" element={<Carreira />} />
          <Route path="/gestao" element={<Gestao />} />
          <Route path="/berserker" element={<Berserker />} />
          <Route path="/meta" element={<MetaRoute />} />
          <Route path="/promocoes" element={<Promocoes />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/ajuda" element={<CentralAjuda />} />
          <Route path="/mural" element={<MuralPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/trocar-senha" element={<TrocarSenha />} />
          <Route path="/calculadora" element={<Calculadora />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/cw-store" element={<CwStore />} />
          <Route path="/admin" element={<GestorAdminPage />} />
          <Route path="/painel" element={<PainelControle />} />
          <Route path="/automacoes" element={<Automacoes />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/regras" element={<RegrasConduta />} />
          <Route path="/treinamento" element={<TreinamentoTiers />} />
          <Route path="/modo-gestor" element={<ModoGestor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppLayout() {
  return (
    <EditorProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden bg-cw-bg text-cw-text">
          <Sidebar />
          <main className="flex-1 overflow-y-auto scrollbar-cw">
            <ImpersonationBanner />
            <EditorBanner />
            <AnimatedRoutes />
          </main>
          <PasswordGate />
          <SquadReassignGate />
          <FloatingSearch />
        </div>
      </SidebarProvider>
    </EditorProvider>
  );
}

function AppShell() {
  const { status } = useAuth();

  if (status === 'loading') {
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
          <Routes>
            <Route path="/gestor" element={<UserProvider><GestorLayout /></UserProvider>}>
              <Route index element={<GestorDashboard />} />
              <Route path="times" element={<GestorPlaceholder titulo="Times" subtitulo="Gerencie os times do comercial" Icon={Users} />} />
              <Route path="ranking" element={<GestorPlaceholder titulo="Ranking" subtitulo="Performance individual e por squad" Icon={Trophy} />} />
              <Route path="playbooks" element={<GestorPlaybooks />} />
              <Route path="trilhas" element={<GestorPlaceholder titulo="Trilhas" subtitulo="Trilhas de desenvolvimento por role" Icon={GestorMap} />} />
              <Route path="relatorios" element={<GestorPlaceholder titulo="Relatórios" subtitulo="Análises e dados do time" Icon={BarChart3} />} />
              <Route path="configuracoes" element={<GestorPlaceholder titulo="Configurações" subtitulo="Configurações do sistema" Icon={Settings} />} />
            </Route>
            <Route path="/*" element={status === 'authed' ? <AppLayout /> : <Login />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

const App = () => (
  <AuthProvider>
    <AppShell />
  </AuthProvider>
);

export default App;
