
import { MessageCircle, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConversationCardProps {
  conversation: {
    id: string;
    status: string;
    pacientes?: {
      nome?: string;
      telefone?: string;
    };
    is_priority?: boolean;
    is_read?: boolean;
    unread_count?: number;
    ultima_mensagem?: string;
    resumo_conversa?: string;
    agente: string;
    timestamp_ultima_mensagem?: string;
    updated_at: string;
  };
}

const ConversationCard = ({ conversation }: ConversationCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em_acompanhamento':
        return <MessageCircle className="w-4 h-4" />
      case 'humano_solicitado':
        return <AlertCircle className="w-4 h-4" />
      case 'finalizada':
        return <CheckCircle className="w-4 h-4" />
      case 'aguardando_ativacao':
        return <Clock className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_acompanhamento':
        return 'bg-blue-100 text-blue-800'
      case 'humano_solicitado':
        return 'bg-red-100 text-red-800'
      case 'finalizada':
        return 'bg-green-100 text-green-800'
      case 'aguardando_ativacao':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'em_acompanhamento':
        return 'Em Acompanhamento'
      case 'humano_solicitado':
        return 'Humano Solicitado'
      case 'finalizada':
        return 'Finalizada'
      case 'aguardando_ativacao':
        return 'Aguardando Ativação'
      default:
        return status
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  return (
    <div 
      className={`p-5 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
        !conversation.is_read ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(conversation.status)}
              <h3 className="font-semibold text-gray-900">
                {conversation.pacientes?.nome || 'Paciente não identificado'}
              </h3>
            </div>
            <Badge className={getStatusColor(conversation.status)}>
              {getStatusLabel(conversation.status)}
            </Badge>
            {conversation.is_priority && (
              <Badge variant="destructive">Prioritária</Badge>
            )}
            {!conversation.is_read && conversation.unread_count && conversation.unread_count > 0 && (
              <Badge variant="secondary">
                {conversation.unread_count} nova{conversation.unread_count > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            <strong>Telefone:</strong> {conversation.pacientes?.telefone || 'N/A'}
          </div>

          {conversation.ultima_mensagem && (
            <div className="text-sm text-gray-700 mb-2">
              <strong>Última mensagem:</strong> {conversation.ultima_mensagem}
            </div>
          )}

          {conversation.resumo_conversa && (
            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
              <strong>Resumo:</strong> {conversation.resumo_conversa}
            </div>
          )}
        </div>
        
        <div className="text-right text-sm text-gray-500">
          <div>Agente: {conversation.agente}</div>
          <div>{formatTime(conversation.timestamp_ultima_mensagem || conversation.updated_at)}</div>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
