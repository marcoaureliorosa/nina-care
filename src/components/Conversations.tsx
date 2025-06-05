import { Search, Filter, MoreVertical, ArrowLeft, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  messages: Message[];
}

const Conversations = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "ativo" | "pendente" | "resolvido">("todos");

  const conversations: Conversation[] = [
    {
      id: 1,
      patientName: "Maria Silva",
      lastMessage: "Estou sentindo um pouco de dor, é normal?",
      timestamp: "10:30",
      unread: 2,
      status: "ativo",
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
      messages: [
        { id: 1, text: "Bom dia Doutora!", timestamp: "08:40", sender: "patient" },
        { id: 2, text: "Bom dia Ana! Como está se sentindo?", timestamp: "08:42", sender: "doctor" },
        { id: 3, text: "Muito melhor! Quando devo retornar para consulta?", timestamp: "08:45", sender: "patient" },
      ]
    },
  ];

  // Filter conversations based on search term and status
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || conversation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Aqui você adicionaria a lógica para enviar a mensagem
    console.log("Enviando mensagem:", newMessage);
    setNewMessage("");
  };

  const handleConversationAction = (action: string, conversation: Conversation) => {
    console.log(`Ação: ${action} para ${conversation.patientName}`);
    // Aqui você implementaria as ações específicas
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedConversation.patientName}</h1>
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
                className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200 transition-colors"
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
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conversation.patientName}
                    </h3>
                    <span className="text-sm text-gray-500">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      conversation.status === 'ativo' ? 'bg-green-100 text-green-800' :
                      conversation.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {conversation.status}
                    </span>
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
                    <DropdownMenuItem onClick={() => handleConversationAction("marcar-lida", conversation)}>
                      Marcar como lida
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleConversationAction("arquivar", conversation)}>
                      Arquivar conversa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleConversationAction("prioridade", conversation)}>
                      Marcar como prioridade
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleConversationAction("transferir", conversation)}>
                      Transferir para outro médico
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
