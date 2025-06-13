import { MessageCircle, AlertCircle, CheckCircle, Clock, Star, StarOff, User, Phone, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  const [isPriority, setIsPriority] = useState(conversation.is_priority);
  const [isRead, setIsRead] = useState(conversation.is_read);
  const [loadingPriority, setLoadingPriority] = useState(false);
  const [loadingRead, setLoadingRead] = useState(false);

  const togglePriority = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingPriority(true);
    const { error } = await supabase
      .from('conversas')
      .update({ is_priority: !isPriority })
      .eq('id', conversation.id);
    if (!error) setIsPriority(!isPriority);
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
      className={`group relative flex items-stretch gap-4 p-6 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer bg-white/90 overflow-hidden ${selected ? 'ring-2 ring-ninacare-primary/60 border-ninacare-primary/40' : 'border-zinc-200'}`}
      tabIndex={0}
      onClick={onClick}
      aria-label={`Abrir conversa de ${conversation.pacientes?.nome || 'Paciente'}`}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      {/* Avatar */}
      <Avatar className="h-12 w-12 shadow border-2 border-white">
        <AvatarFallback className="bg-ninacare-primary text-white text-lg font-bold">{getInitials(conversation.pacientes?.nome)}</AvatarFallback>
      </Avatar>
      {/* Bloco principal */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-zinc-900 truncate">{conversation.pacientes?.nome || 'Paciente não identificado'}</span>
          {conversation.is_priority && (
            <Star className="w-4 h-4 text-yellow-400 ml-1" aria-label="Prioritária" />
          )}
        </div>
        <p className="text-sm text-zinc-600 truncate mt-1">
          {conversation.ultima_mensagem || conversation.resumo_conversa || 'Nenhuma mensagem recente.'}
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
      {/* Overlay de nova mensagem */}
      {!isRead && (
        <div className="absolute inset-0 bg-ninacare-primary/5 pointer-events-none">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-ninacare-primary" aria-label="Não lida"></div>
        </div>
      )}
      {/* Ações rápidas */}
      <div className="absolute top-4 right-4 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={togglePriority}
          className={`p-1.5 rounded-full transition-colors ${isPriority ? "text-yellow-400 hover:bg-yellow-100/50" : "text-zinc-400 hover:text-yellow-400 hover:bg-zinc-100"}`}
          aria-label={isPriority ? "Remover prioridade" : "Marcar como prioridade"}
          disabled={loadingPriority}
        >
          {isPriority ? <StarOff className="w-5 h-5" /> : <Star className="w-5 h-5" />}
        </button>
        {isRead ? (
           <button
             onClick={() => navigate(`/pacientes/${conversation.id}`)}
             className="p-1.5 rounded-full text-zinc-400 hover:text-ninacare-primary hover:bg-zinc-100 transition-colors"
             aria-label="Ver conversa"
           >
             <User className="w-5 h-5" />
           </button>
        ) : (
          <button
            onClick={markAsRead}
            className="p-1.5 rounded-full text-zinc-400 hover:text-green-500 hover:bg-green-100/50 transition-colors"
            aria-label="Marcar como lida"
            disabled={loadingRead}
          >
            <CheckCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ConversationCard;
