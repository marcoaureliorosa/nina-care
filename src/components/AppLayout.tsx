
import React from 'react';
import { Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProtectedRoute from "./ProtectedRoute";
import UserMenu from "./UserMenu";
import { AppSidebar } from "./AppSidebar";
import Index from "../pages/Index";
import ConversasPage from "../pages/ConversasPage";
import PacientesPage from "../pages/PacientesPage";
import AgendaPage from "../pages/AgendaPage";
import ConfiguracoesPage from "../pages/ConfiguracoesPage";
import ProfilePage from "../pages/ProfilePage";
import AdminPage from "../pages/AdminPage";
import NotFound from "../pages/NotFound";

const AppLayout = () => {
  return (
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
  );
};

export default AppLayout;
