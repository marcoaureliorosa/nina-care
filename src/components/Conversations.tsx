import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ConversationsHeader from "./conversations/ConversationsHeader";
import ConversationsFilters from "./conversations/ConversationsFilters";
import ConversationsList from "./conversations/ConversationsList";
import ConversationDetail from "./conversations/ConversationDetail";
import { useSearchParams, useNavigate } from "react-router-dom";

const Conversations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [extraFilter, setExtraFilter] = useState<string>("all");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Responsividade: detectar mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sincronizar selectedConversationId com o parâmetro da URL
  useEffect(() => {
    const id = searchParams.get("id");
    setSelectedConversationId(id);
  }, [searchParams]);

  // Atualizar URL ao selecionar conversa
  const handleSelectConversation = (id: string) => {
    setSearchParams({ ...Object.fromEntries(searchParams.entries()), id });
  };

  // Fechar aside/modal
  const handleCloseDetail = () => {
    searchParams.delete("id");
    setSearchParams(Object.fromEntries(searchParams.entries()));
    setSelectedConversationId(null);
  };

  // Buscar conversas do Supabase
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations', searchTerm, statusFilter, extraFilter],
    queryFn: async () => {
      console.log('Fetching conversations...')
      
      let query = supabase
        .from('conversas')
        .select(`
          *,
          pacientes (
            nome,
            telefone
          )
        `)
        .order('updated_at', { ascending: false })

      if (searchTerm) {
        // Buscar por nome do paciente através do JOIN
        query = query.or(`pacientes.nome.ilike.%${searchTerm}%`)
      }

      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter)
      }

      // Filtro extra
      if (extraFilter === "priority") {
        query = query.eq('is_priority', true)
      } else if (extraFilter === "read") {
        query = query.eq('is_read', true)
      } else if (extraFilter === "unread") {
        query = query.eq('is_read', false)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching conversations:', error)
        return []
      }

      console.log('Conversations data:', data)
      return data
    }
  });

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col bg-zinc-50">
      {/* Container principal igual ao dashboard */}
      <div className="w-full flex flex-col max-w-7xl mx-auto">
        {/* Banner premium */}
        <div className="w-full pt-8 pb-4">
          <ConversationsHeader />
        </div>
        {/* Filtros e busca premium ocupando toda a largura */}
        <div className="w-full">
          <ConversationsFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            extraFilter={extraFilter}
            setExtraFilter={setExtraFilter}
          />
        </div>
        {/* Lista de conversas centralizada, alinhada ao container */}
        <div className="w-full flex-1 min-h-0 flex justify-center">
          <div className="w-full max-w-2xl flex-1 min-h-0">
            <ConversationsList
              conversations={conversations}
              isLoading={isLoading}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversationId}
            />
          </div>
          {/* Aside de detalhes */}
          {selectedConversationId && (
            <aside className="flex-1 h-full bg-white rounded-2xl shadow-lg overflow-y-auto min-h-0 flex flex-col ml-8 max-w-3xl">
              <ConversationDetail id={selectedConversationId} onClose={handleCloseDetail} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
