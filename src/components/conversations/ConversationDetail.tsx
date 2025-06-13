import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo, useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ThumbsUp, ThumbsDown, X, MessageCircle } from "lucide-react";

// Função utilitária para buscar telefone do paciente a partir do id da conversa
async function getTelefoneByConversaId(conversaId: string) {
  // 1. Buscar paciente_id na tabela conversas
  const { data: conversa, error: errorConversa } = await supabase
    .from('conversas')
    .select('paciente_id')
    .eq('id', conversaId)
    .single();
  if (errorConversa || !conversa?.paciente_id) throw new Error('Conversa ou paciente_id não encontrado');

  // 2. Buscar telefone na tabela pacientes
  const { data: paciente, error: errorPaciente } = await supabase
    .from('pacientes')
    .select('telefone')
    .eq('id', conversa.paciente_id)
    .single();
  if (errorPaciente || !paciente?.telefone) throw new Error('Telefone do paciente não encontrado');

  return paciente.telefone;
}

const ChatHeader = ({ paciente, status, onBack }: { paciente: any, status: string, onBack: () => void }) => {
  const initials = useMemo(() => {
    if (!paciente?.nome) return "?";
    return paciente.nome.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  }, [paciente]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_acompanhamento':
        return 'bg-blue-100 text-blue-800';
      case 'humano_solicitado':
        return 'bg-red-100 text-red-800';
      case 'finalizada':
        return 'bg-green-100 text-green-800';
      case 'aguardando_ativacao':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="flex items-center gap-4 p-4 border-b bg-white/80 dark:bg-zinc-900/80 rounded-t-lg">
      <button
        className="flex items-center text-ninacare-primary hover:underline font-medium mr-2"
        onClick={onBack}
        aria-label="Voltar para conversas"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <Avatar className="h-12 w-12">
        {/* Se houver avatar_url, use, senão fallback para iniciais */}
        {paciente?.avatar_url ? (
          <AvatarImage src={paciente.avatar_url} alt={paciente.nome} />
        ) : (
          <AvatarFallback>{initials}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col">
        <span className="font-bold text-lg text-zinc-900 dark:text-white">{paciente?.nome || 'Paciente não identificado'}</span>
        <span className="text-xs text-zinc-500 dark:text-zinc-300">{paciente?.telefone || ''}</span>
        <div className="mt-1">
          <Badge className={getStatusColor(status)}>{getStatusLabel(status)}</Badge>
        </div>
      </div>
    </div>
  );
};

// Definição de tipo para mensagem do chat
interface ChatMessage {
  id: number | string;
  created_at: string;
  type: 'human' | 'ai' | string;
  content: string;
}

// Componente para balão de mensagem premium
const ChatBubble = ({ msg, isAgente }: { msg: ChatMessage; isAgente: boolean }) => {
  return (
    <div className={`flex items-end gap-2 ${isAgente ? 'justify-end' : 'justify-start'}`}>
      {!isAgente && (
        <Avatar className="h-7 w-7 text-xs">
          <AvatarFallback>P</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[75%] p-3 rounded-2xl shadow-sm break-words text-sm relative
          ${isAgente
            ? 'bg-ninacare-primary text-white rounded-br-md animate-fade-in-right'
            : 'bg-gray-100 text-gray-900 rounded-bl-md animate-fade-in-left'}
        `}
      >
        <div className="font-semibold mb-1 text-xs opacity-80">
          {isAgente ? 'Agente' : 'Paciente'}
        </div>
        <div>{msg.content || ''}</div>
        <div className={`mt-2 text-[10px] opacity-70 flex ${isAgente ? 'justify-end' : 'justify-start'}`}>
          {msg.created_at ? new Date(String(msg.created_at)).toLocaleString() : ''}
        </div>
      </div>
      {isAgente && (
        <Avatar className="h-7 w-7 text-xs">
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

interface ConversationDetailProps {
  id: string;
  onClose: () => void;
}

const ConversationDetail = ({ id, onClose }: ConversationDetailProps) => {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const sessionId = "mock-session-id";

  // Marcar como lida ao abrir
  useEffect(() => {
    if (!id) return;
    (async () => {
      await supabase
        .from('conversas')
        .update({ is_read: true })
        .eq('id', id);
    })();
  }, [id]);

  // Buscar conversa para header
  const { data: conversa, refetch } = useQuery({
    queryKey: ['conversa', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('conversas')
        .select(`
          id, 
          status, 
          pacientes:pacientes (
            nome, 
            telefone
          ), 
          feedback
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Buscar mensagens do n8n_chat_histories usando o conversa_id
  const { data: mensagens, isLoading } = useQuery<ChatMessage[]>({
    queryKey: ['n8n_chat_histories', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('conversa_id', id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      // Extrair dados do campo message (JSON)
      return data?.map((msg: { id: number; message: any; created_at: string; session_id: string }) => {
        let messageObj: any = {};
        if (typeof msg.message === 'object' && msg.message !== null) {
          messageObj = msg.message;
        }
        return {
          id: msg.id,
          created_at: msg.created_at || '',
          type: messageObj.type || 'human',
          content: messageObj.content || messageObj.texto || '',
        };
      }) || [];
    },
    enabled: !!id,
  });

  // Feedback: like/dislike
  useEffect(() => {
    if (conversa?.feedback) {
      const feedbackValue = conversa.feedback as "like" | "dislike";
      setFeedback(feedbackValue);
    }
  }, [conversa]);

  const handleFeedback = async (type: "like" | "dislike") => {
    setLoadingFeedback(true);
    await supabase
      .from('conversas')
      .update({ feedback: type })
      .eq('id', id);
    setFeedback(type);
    setLoadingFeedback(false);
    refetch();
  };

  // Marcar como NÂO lida manualmente
  const handleMarkAsUnread = async () => {
    await supabase
      .from('conversas')
      .update({ is_read: false })
      .eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
    onClose();
  };

  const getRemetente = (msg: any) => {
    if (msg.type === 'human') return 'Paciente';
    if (msg.type === 'ai') return 'Agente';
    return '';
  };

  // Função mock para enviar mensagem (substitua por integração real depois)
  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    // Envia mensagem real para o Supabase
    await supabase.from('n8n_chat_histories').insert({
      conversa_id: id,
      message: { type: 'human', content: input },
      session_id: sessionId,
    });
    setInput("");
    setSending(false);
    // Refaz o fetch das mensagens
    queryClient.invalidateQueries({ queryKey: ['n8n_chat_histories', id] });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!mensagens || mensagens.length === 0) {
    return (
      <div className="flex-1 h-full min-h-0 flex flex-col justify-center items-center">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <MessageCircle className="w-12 h-12 text-ninacare-primary/40 mb-4" />
          <h2 className="text-xl font-semibold text-zinc-500 mb-2">Nenhuma mensagem ainda</h2>
          <p className="text-zinc-400 text-sm">Inicie a conversa enviando uma mensagem abaixo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow flex flex-col h-[100vh] md:h-[80vh] relative">
      {/* Header com ações rápidas */}
      <div className="flex items-center gap-4 p-4 border-b bg-white/80 rounded-t-lg sticky top-0 z-10">
        <button
          className="flex items-center text-zinc-400 hover:text-zinc-700 font-medium mr-2"
          onClick={onClose}
          aria-label="Fechar painel de conversa"
        >
          <X className="w-6 h-6" />
        </button>
        {conversa && (
          <>
            <Avatar className="h-12 w-12">
              <AvatarFallback>{conversa.pacientes?.nome?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-zinc-900">{conversa.pacientes?.nome || 'Paciente não identificado'}</span>
              <span className="text-xs text-zinc-500">{conversa.pacientes?.telefone || ''}</span>
              <div className="mt-1">
                <Badge className="bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-semibold rounded-full">{conversa.status}</Badge>
              </div>
            </div>
            <div className="flex-1" />
            {/* Like/Dislike */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFeedback('like')}
                disabled={loadingFeedback || feedback === 'like'}
                className={`p-2 rounded-full transition-colors ${feedback === 'like' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'}`}
              >
                <ThumbsUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleFeedback('dislike')}
                disabled={loadingFeedback || feedback === 'dislike'}
                className={`p-2 rounded-full transition-colors ${feedback === 'dislike' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
              >
                <ThumbsDown className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handleMarkAsUnread}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-ninacare-primary text-white hover:bg-ninacare-primary/90 transition-colors"
            >
              Marcar como não lida
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-6 h-6 text-ninacare-primary" />
          <h2 className="text-2xl font-bold text-zinc-900">Histórico de Mensagens</h2>
        </div>
        {isLoading ? (
          <div>Carregando...</div>
        ) : mensagens && mensagens.length > 0 ? (
          <ul className="space-y-3 mb-4">
            {mensagens.map(msg => {
              const isAgente = msg.type === 'ai';
              return (
                <li key={msg.id}>
                  <ChatBubble msg={msg} isAgente={isAgente} />
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default ConversationDetail;
