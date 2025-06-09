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
      avatar_url?: string;
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
      </div>
    </div>
  );
};

export default ConversationCard;
