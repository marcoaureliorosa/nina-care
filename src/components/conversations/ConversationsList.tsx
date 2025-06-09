import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConversationCard from "./ConversationCard";

interface ConversationsListProps {
  conversations?: any[];
  isLoading: boolean;
  searchTerm: string;
  statusFilter: string;
  onSelectConversation?: (id: string) => void;
  selectedConversationId?: string | null;
  compact?: boolean;
}

const ConversationsList = ({ conversations, isLoading, searchTerm, statusFilter, onSelectConversation, selectedConversationId, compact }: ConversationsListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Conversas Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Carregando conversas...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Conversas Ativas</CardTitle>
          {conversations && (
            <div className="text-sm text-gray-500">
              {conversations.length} {conversations.length === 1 ? 'conversa encontrada' : 'conversas encontradas'}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {conversations && conversations.length > 0 ? (
            conversations.map((conversation) => (
              <ConversationCard 
                key={conversation.id} 
                conversation={conversation} 
                onClick={() => onSelectConversation && onSelectConversation(conversation.id)}
                selected={selectedConversationId === conversation.id}
                compact={compact}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" 
                  ? 'Nenhuma conversa encontrada' 
                  : 'Nenhuma conversa ativa'
                }
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {searchTerm || statusFilter !== "all" 
                  ? 'Tente ajustar os filtros para encontrar outras conversas' 
                  : 'As conversas aparecerão aqui quando os pacientes iniciarem o acompanhamento'
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationsList;
