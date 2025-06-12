import React from 'react';
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AppNavbar from "./AppNavbar";
import Index from "../pages/Index";
import ConversasPage from "../pages/ConversasPage";
import PacientesPage from "../pages/PacientesPage";
import AgendaPage from "../pages/AgendaPage";
import ConfiguracoesPage from "../pages/ConfiguracoesPage";
import ProfilePage from "../pages/ProfilePage";
import AdminPage from "../pages/AdminPage";
import NotFound from "../pages/NotFound";
import ConversationDetail from "./conversations/ConversationDetail";
import ImportacoesPage from '../pages/ImportacoesPage';

const AppLayout = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-gray-50 flex flex-col">
        <AppNavbar />
        <div className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/conversas" element={<ConversasPage />} />
            <Route path="/conversas/:id" element={<ConversationDetail />} />
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/importacoes" element={<ImportacoesPage />} />
            <Route path="/configuracoes" element={<ConfiguracoesPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AppLayout;
