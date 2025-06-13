<<<<<<< HEAD

import { MessageCircle, AlertCircle, CheckCircle, Clock, Star, Phone } from "lucide-react";
=======
import { MessageCircle, AlertCircle, CheckCircle, Clock, Star, StarOff, User, Phone, MessageSquare } from "lucide-react";
>>>>>>> parent of 79ea50e (v.0.7)
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
  compact?: boolean;
}

<<<<<<< HEAD
const ConversationCard = ({ conversation, onClick, selected, compact = false }: ConversationCardProps) => {
  const queryClient = useQueryClient();
=======
const ConversationCard = ({ conversation, compact, onClick, selected }: ConversationCardProps) => {
  const navigate = useNavigate();
  const [isPriority, setIsPriority] = useState(conversation.is_priority);
  const [isRead, setIsRead] = useState(conversation.is_read);
  const [loadingPriority, setLoadingPriority] = useState(false);
  const [loadingRead, setLoadingRead] = useState(false);
>>>>>>> parent of 79ea50e (v.0.7)

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
<<<<<<< HEAD
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden shadow-sm hover:shadow-md",
        selected ? 'ring-2 ring-ninacare-primary/60 border-ninacare-primary/40' : 'border-zinc-200',
        !conversation.is_read ? 'bg-ninacare-primary/5' : 'bg-white/90',
        compact && "p-2 gap-2"
      )}
=======
      className={`group relative flex items-stretch gap-4 p-6 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer bg-white/90 overflow-hidden ${selected ? 'ring-2 ring-ninacare-primary/60 border-ninacare-primary/40' : 'border-zinc-200'}`}
>>>>>>> parent of 79ea50e (v.0.7)
      tabIndex={0}
      onClick={onClick}
      aria-label={`Abrir conversa de ${conversation.pacientes?.nome || 'Paciente'}`}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
<<<<<<< HEAD
      {!conversation.is_read && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-ninacare-primary" aria-label="Não lida"></div>
      )}
      
      <Avatar className={cn("h-11 w-11", compact && "h-8 w-8")}>
        <AvatarFallback className="bg-ninacare-primary/20 text-ninacare-primary font-bold">{getInitials(conversation.pacientes?.nome)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={cn("font-bold text-base text-zinc-800 truncate", compact && "text-sm")}>{conversation.pacientes?.nome || 'Paciente'}</span>
            <span className={cn("text-xs text-zinc-500", compact && "text-[10px]")}>{formatTime(conversation.updated_at)}</span>
          </div>
        </div>
        
        {!compact && (
          <p className="text-sm text-zinc-600 truncate mt-1">
            {conversation.ultima_mensagem || conversation.resumo_conversa || 'Nenhuma mensagem recente.'}
          </p>
        )}

        <div className="flex items-center gap-4 mt-2">
            <Badge className={`${getStatusColor(conversation.status)} px-2 py-0.5 text-xs font-semibold rounded-full shadow-none`}>
              {getStatusLabel(conversation.status)}
            </Badge>
        </div>
      </div>
      
      <div className="absolute top-3 right-3">
        <button
          onClick={handleTogglePriority}
          className={cn(
            "p-1 rounded-full transition-colors",
            conversation.is_priority ? "text-yellow-400 hover:text-yellow-500" : "text-zinc-300 hover:text-yellow-400"
          )}
          aria-label={conversation.is_priority ? "Remover prioridade" : "Marcar como prioridade"}
          disabled={mutationPriority.isPending}
        >
          <Star className={cn("w-5 h-5", conversation.is_priority && "fill-current", compact && "w-4 h-4")} />
        </button>
=======
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
        {/* Badge de status sempre abaixo do nome */}
        <div className="mt-1 mb-1">
          <Badge className={`${getStatusColor(conversation.status)} px-2 py-0.5 text-xs font-semibold rounded-full shadow-none`}>{getStatusLabel(conversation.status)}</Badge>
        </div>
        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
          <Phone className="w-4 h-4" />
          <span className="truncate">{conversation.pacientes?.telefone || ''}</span>
        </div>
        {/* Resumo em balão visual */}
        {conversation.resumo_conversa && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-700 text-sm mt-1 mb-1">
            <span className="font-medium text-zinc-500">Resumo: </span>{conversation.resumo_conversa}
          </div>
        )}
      </div>
      {/* Bloco à direita */}
      <div className="flex flex-col items-end justify-between min-w-[80px]">
        <span className="text-xs text-zinc-400 font-mono mb-2">{formatTime(conversation.updated_at)}</span>
        <span className="text-xs text-zinc-500">Agente:</span>
        <span className="text-xs text-zinc-700 font-semibold">{conversation.agente}</span>
>>>>>>> parent of 79ea50e (v.0.7)
      </div>
    </div>
  );
};

export default ConversationCard;
