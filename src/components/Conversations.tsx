
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ConversationsHeader from "./conversations/ConversationsHeader";
import ConversationsFilters from "./conversations/ConversationsFilters";
import ConversationsList from "./conversations/ConversationsList";

const Conversations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Buscar conversas do Supabase
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations', searchTerm, statusFilter],
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
    <div className="space-y-6">
      <ConversationsHeader />
      <ConversationsFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <ConversationsList 
        conversations={conversations}
        isLoading={isLoading}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
      />
    </div>
  );
};

export default Conversations;
