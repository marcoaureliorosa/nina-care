import { MessageCircle, AlertCircle, CheckCircle, Clock, Star, StarOff, User, Phone, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";

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
  compact?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

const ConversationCard = ({ conversation, compact, onClick, selected }: ConversationCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isPriority, setIsPriority] = useState(conversation.is_priority);
  const [isRead, setIsRead] = useState(conversation.is_read);
  const [loadingPriority, setLoadingPriority] = useState(false);
  const [loadingRead, setLoadingRead] = useState(false);

  const togglePriority = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingPriority(true);
    const { error } = await supabase
      .from('conversas')
      .update({ is_priority: !conversation.is_priority })
      .eq('id', conversation.id);
    
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
    setLoadingPriority(false);
  };

  const markAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingRead(true);
    const { error } = await supabase
      .from('conversas')
      .update({ is_read: true })
      .eq('id', conversation.id);
    if (!error) setIsRead(true);
    setLoadingRead(false);
  };

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
      case 'aguardando_ativacao':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'em_acompanhamento':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'humano_solicitado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'finalizada':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'em_acompanhamento':
        return 'Em Acompanhamento';
      case 'humano_solicitado':
        return 'Humano Solicitado';
      case 'finalizada':
        return 'Finalizada';
      case 'aguardando_ativacao':
        return 'Aguardando Ativação';
      default:
        return status;
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

  // Acessibilidade: iniciais do paciente
  const getInitials = (nome?: string) => {
    if (!nome) return "?";
    return nome.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div 
      className={`group relative flex items-stretch gap-4 p-4 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer overflow-hidden 
        ${selected ? 'ring-2 ring-ninacare-primary/60 border-ninacare-primary/40' : 'border-zinc-200'}
        ${!conversation.is_read ? 'bg-ninacare-primary/5' : 'bg-white/90'}
      `}
      tabIndex={0}
      onClick={onClick}
      aria-label={`Abrir conversa de ${conversation.pacientes?.nome || 'Paciente'}`}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={togglePriority}
          className={`p-1.5 rounded-full transition-colors disabled:opacity-50
            ${conversation.is_priority ? "text-yellow-400 hover:bg-yellow-100/50" : "text-zinc-400 hover:text-yellow-400 hover:bg-zinc-100"}
          `}
          aria-label={conversation.is_priority ? "Remover prioridade" : "Marcar como prioridade"}
          disabled={loadingPriority}
        >
          <Star className={`w-5 h-5 ${conversation.is_priority ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Avatar */}
      <Avatar className="h-12 w-12 shadow border-2 border-white">
        <AvatarFallback className="bg-ninacare-primary text-white text-lg font-bold">{getInitials(conversation.pacientes?.nome)}</AvatarFallback>
      </Avatar>
      {/* Bloco principal */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-lg text-zinc-900 truncate ${!conversation.is_read ? 'font-bold' : 'font-semibold'}`}>
            {conversation.pacientes?.nome || 'Paciente não identificado'}
          </span>
        </div>
        <p className="text-sm text-zinc-600 truncate mt-1">
          {conversation.ultima_mensagem || ''}
        </p>
        {/* Rodapé do card */}
        <div className="flex items-center justify-between mt-3">
          <Badge className={`${getStatusColor(conversation.status)} px-2 py-0.5 text-xs font-semibold rounded-full shadow-none`}>
            {getStatusIcon(conversation.status)}
            <span className="ml-1.5">{getStatusLabel(conversation.status)}</span>
          </Badge>
          <span className="text-xs text-zinc-500">{formatTime(conversation.timestamp_ultima_mensagem || conversation.updated_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
