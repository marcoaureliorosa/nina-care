
import { Search, Filter, MoreVertical, ArrowLeft, Send, Star, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Message {
  id: number;
  text: string;
  timestamp: string;
  sender: "patient" | "doctor";
}

interface Conversation {
  id: number;
  patientName: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: "ativo" | "pendente" | "resolvido";
  isRead: boolean;
  isPriority: boolean;
  messages: Message[];
}

const Conversations = () => {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "ativo" | "pendente" | "resolvido">("todos");
  const [readFilter, setReadFilter] = useState<"todos" | "lidas" | "nao-lidas">("todos");
  const [priorityFilter, setPriorityFilter] = useState<"todos" | "prioridade" | "normal">("todos");

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      patientName: "Maria Silva",
      lastMessage: "Estou sentindo um pouco de dor, é normal?",
      timestamp: "10:30",
      unread: 2,
      status: "ativo",
      isRead: false,
      isPriority: true,
      messages: [
        { id: 1, text: "Olá Doutora, como está?", timestamp: "10:25", sender: "patient" },
        { id: 2, text: "Olá Maria! Estou bem, obrigada. Como posso ajudar?", timestamp: "10:26", sender: "doctor" },
        { id: 3, text: "Estou sentindo um pouco de dor, é normal?", timestamp: "10:30", sender: "patient" },
      ]
    },
    {
      id: 2,
      patientName: "João Santos",
      lastMessage: "Obrigado pelas orientações!",
      timestamp: "09:15",
      unread: 0,
      status: "resolvido",
      isRead: true,
      isPriority: false,
      messages: [
        { id: 1, text: "Doutor, gostaria de tirar uma dúvida", timestamp: "09:10", sender: "patient" },
        { id: 2, text: "Claro João, pode falar!", timestamp: "09:11", sender: "doctor" },
        { id: 3, text: "Posso fazer exercícios já?", timestamp: "09:12", sender: "patient" },
        { id: 4, text: "Sim, exercícios leves são recomendados. Evite impacto por enquanto.", timestamp: "09:13", sender: "doctor" },
        { id: 5, text: "Obrigado pelas orientações!", timestamp: "09:15", sender: "patient" },
      ]
    },
    {
      id: 3,
      patientName: "Ana Costa",
      lastMessage: "Quando devo retornar para consulta?",
      timestamp: "08:45",
      unread: 1,
      status: "pendente",
      isRead: false,
      isPriority: false,
      messages: [
        { id: 1, text: "Bom dia Doutora!", timestamp: "08:40", sender: "patient" },
        { id: 2, text: "Bom dia Ana! Como está se sentindo?", timestamp: "08:42", sender: "doctor" },
        { id: 3, text: "Muito melhor! Quando devo retornar para consulta?", timestamp: "08:45", sender: "patient" },
      ]
    },
  ]);

  // Filter conversations based on search term, status, read status, and priority
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || conversation.status === statusFilter;
    const matchesRead = readFilter === "todos" || 
                       (readFilter === "lidas" && conversation.isRead) ||
                       (readFilter === "nao-lidas" && !conversation.isRead);
    const matchesPriority = priorityFilter === "todos" || 
                           (priorityFilter === "prioridade" && conversation.isPriority) ||
                           (priorityFilter === "normal" && !conversation.isPriority);
    return matchesSearch && matchesStatus && matchesRead && matchesPriority;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const newMsg: Message = {
      id: selectedConversation.messages.length + 1,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      sender: "doctor"
    };

    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, messages: [...conv.messages, newMsg], lastMessage: newMessage }
        : conv
    ));

    setSelectedConversation(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : null);
    setNewMessage("");
    
    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada com sucesso.",
    });
  };

  const handleConversationAction = (action: string, conversation: Conversation) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversation.id) {
        if (action === "marcar-lida") {
          toast({
            title: "Conversa marcada como lida",
            description: `A conversa com ${conversation.patientName} foi marcada como lida.`,
          });
          return { ...conv, isRead: !conv.isRead, unread: conv.isRead ? conv.unread : 0 };
        } else if (action === "marcar-prioridade") {
          toast({
            title: conv.isPriority ? "Prioridade removida" : "Marcada como prioridade",
            description: `A conversa com ${conversation.patientName} ${conv.isPriority ? 'não é mais' : 'agora é'} prioridade.`,
          });
          return { ...conv, isPriority: !conv.isPriority };
        }
      }
      return conv;
    }));
  };

  if (selectedConversation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedConversation(null)}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Avatar>
            <AvatarImage src={`https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face`} />
            <AvatarFallback>
              {selectedConversation.patientName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">{selectedConversation.patientName}</h1>
              {selectedConversation.isPriority && (
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              )}
              {!selectedConversation.isRead && selectedConversation.unread > 0 && (
                <Mail className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              selectedConversation.status === 'ativo' ? 'bg-green-100 text-green-800' :
              selectedConversation.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {selectedConversation.status}
            </span>
          </div>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {selectedConversation.messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === 'doctor' 
                      ? 'bg-ninacare-primary text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <span className={`text-xs mt-1 block ${
                      message.sender === 'doctor' ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-ninacare-primary hover:bg-ninacare-primary/90"
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Conversas</h1>
        <div className="flex space-x-2">
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="resolvido">Resolvido</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={readFilter} onValueChange={(value: any) => setReadFilter(value)}>
            <SelectTrigger className="w-40">
              <Mail className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="lidas">Lidas</SelectItem>
              <SelectItem value="nao-lidas">Não lidas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
            <SelectTrigger className="w-40">
              <Star className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="prioridade">Prioridade</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Buscar conversas..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredConversations.map((conversation) => (
              <div 
                key={conversation.id}
                className={`flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer border transition-colors ${
                  conversation.isPriority ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                } ${!conversation.isRead ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <Avatar>
                  <AvatarImage src={`https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face`} />
                  <AvatarFallback>
                    {conversation.patientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-semibold truncate ${!conversation.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {conversation.patientName}
                      </h3>
                      {conversation.isPriority && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                      {!conversation.isRead && conversation.unread > 0 && (
                        <Mail className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{conversation.timestamp}</span>
                  </div>
                  <p className={`text-sm truncate ${!conversation.isRead ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                    {conversation.lastMessage}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        conversation.status === 'ativo' ? 'bg-green-100 text-green-800' :
                        conversation.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {conversation.status}
                      </span>
                      {conversation.isPriority && (
                        <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                          Prioridade
                        </Badge>
                      )}
                      {!conversation.isRead && (
                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                          Não lida
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {conversation.unread > 0 && (
                  <div className="bg-ninacare-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {conversation.unread}
                  </div>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleConversationAction("marcar-lida", conversation);
                    }}>
                      {conversation.isRead ? "Marcar como não lida" : "Marcar como lida"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleConversationAction("marcar-prioridade", conversation);
                    }}>
                      {conversation.isPriority ? "Remover prioridade" : "Marcar como prioridade"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Conversations;
