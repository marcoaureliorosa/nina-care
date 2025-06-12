import { MessageCircle, AlertCircle, CheckCircle, Clock, Star, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ConversationCardProps {
  conversation: {
    id: string;
    status: string;
    pacientes?: {
      nome?: string;
      telefone?: string;
      avatar_url?: string;
    };
    is_priority: boolean;
    is_read: boolean;
    ultima_mensagem?: string;
    resumo_conversa?: string;
    updated_at: string;
  };
  onClick?: () => void;
  selected?: boolean;
}

const ConversationCard = ({ conversation, onClick, selected }: ConversationCardProps) => {
  const queryClient = useQueryClient();

  const mutationPriority = useMutation({
    mutationFn: async (newPriority: boolean) => {
      const { error } = await supabase
        .from('conversas')
        .update({ is_priority: newPriority })
        .eq('id', conversation.id);
      if (error) throw new Error("Falha ao atualizar prioridade");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const handleTogglePriority = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutationPriority.mutate(!conversation.is_priority);
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

  const getInitials = (nome?: string) => {
    if (!nome) return "?";
    return nome.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div 
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden shadow-sm hover:shadow-md",
        selected ? 'ring-2 ring-ninacare-primary/60 border-ninacare-primary/40' : 'border-zinc-200',
        !conversation.is_read ? 'bg-ninacare-primary/5' : 'bg-white/90'
      )}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      {!conversation.is_read && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-ninacare-primary" aria-label="Não lida"></div>
      )}
      
      <Avatar className="h-11 w-11">
        <AvatarFallback className="bg-ninacare-primary/20 text-ninacare-primary font-bold">{getInitials(conversation.pacientes?.nome)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-base text-zinc-800 truncate">{conversation.pacientes?.nome || 'Paciente'}</span>
            <span className="text-xs text-zinc-500">{formatTime(conversation.updated_at)}</span>
          </div>
        </div>
        
        <p className="text-sm text-zinc-600 truncate mt-1">
          {conversation.ultima_mensagem || conversation.resumo_conversa || 'Nenhuma mensagem recente.'}
        </p>

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
          <Star className={cn("w-5 h-5", conversation.is_priority && "fill-current")} />
        </button>
      </div>
    </div>
  );
};

export default ConversationCard;
