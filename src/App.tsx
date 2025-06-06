
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import UserMenu from "./components/UserMenu";
import { AppSidebar } from "./components/AppSidebar";
import Index from "./pages/Index";
import ConversasPage from "./pages/ConversasPage";
import PacientesPage from "./pages/PacientesPage";
import AgendaPage from "./pages/AgendaPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full bg-gray-50">
                    <AppSidebar />
                    <main className="flex-1 flex flex-col">
                      <div className="border-b border-gray-200 bg-white p-4 flex items-center justify-between">
                        <SidebarTrigger className="text-ninacare-primary hover:text-ninacare-primary/80" />
                        <div className="flex items-center">
                          <UserMenu />
                        </div>
                      </div>
                      <div className="flex-1 p-6 overflow-auto">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/conversas" element={<ConversasPage />} />
                          <Route path="/pacientes" element={<PacientesPage />} />
                          <Route path="/agenda" element={<AgendaPage />} />
                          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
                          <Route path="/perfil" element={<ProfilePage />} />
                          <Route path="/admin" element={<AdminPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                    </main>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
