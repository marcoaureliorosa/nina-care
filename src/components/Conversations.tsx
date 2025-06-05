
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar"
import { Search, MessageCircle, Clock, User, Bot } from "lucide-react"
import { useState } from "react"

const Conversations = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(0)
  const [searchTerm, setSearchTerm] = useState("")

  // Mock conversation data
  const conversations = [
    {
      id: 1,
      patientName: "Maria Silva",
      patientId: "P001",
      lastMessage: "Estou me sentindo bem melhor hoje, obrigada!",
      timestamp: "Há 5 min",
      status: "active",
      unreadCount: 0,
      procedure: "Cirurgia Cardíaca",
      phase: "Pós-operatório"
    },
    {
      id: 2,
      patientName: "João Santos",
      patientId: "P002",
      lastMessage: "Estou com dor no local da cirurgia",
      timestamp: "Há 12 min",
      status: "escalated",
      unreadCount: 2,
      procedure: "Cirurgia Ortopédica",
      phase: "Pós-operatório"
    },
    {
      id: 3,
      patientName: "Ana Costa",
      patientId: "P003",
      lastMessage: "Quando devo parar de tomar o medicamento?",
      timestamp: "Há 25 min",
      status: "pending",
      unreadCount: 1,
      procedure: "Cirurgia Geral",
      phase: "Recuperação"
    },
    {
      id: 4,
      patientName: "Carlos Oliveira",
      patientId: "P004",
      lastMessage: "Olá Nina, preciso de ajuda com as orientações",
      timestamp: "Há 1h",
      status: "active",
      unreadCount: 0,
      procedure: "Cirurgia Vascular",
      phase: "Pré-operatório"
    }
  ]

  const currentConversation = conversations.find(c => c.id === selectedConversation)

  const messages = currentConversation ? [
    {
      id: 1,
      sender: "nina",
      content: `Olá ${currentConversation.patientName}! Sou a Nina, sua assistente virtual. Como você está se sentindo hoje?`,
      timestamp: "14:30",
      type: "text"
    },
    {
      id: 2,
      sender: "patient",
      content: "Oi Nina! Estou bem, mas tenho algumas dúvidas sobre os medicamentos.",
      timestamp: "14:32",
      type: "text"
    },
    {
      id: 3,
      sender: "nina",
      content: "Claro! Estou aqui para ajudar. Qual é sua dúvida específica sobre os medicamentos?",
      timestamp: "14:33",
      type: "text"
    },
    {
      id: 4,
      sender: "patient",
      content: currentConversation.lastMessage,
      timestamp: "14:45",
      type: "text"
    }
  ] : []

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
      case "escalated":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Escalado</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-2rem)] flex gap-6">
      {/* Conversations List */}
      <div className="w-1/3 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Conversas</h1>
          <p className="text-gray-600 text-sm mb-4">
            Acompanhe as interações entre Nina e os pacientes
          </p>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {filteredConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedConversation === conversation.id ? "ring-2 ring-ninacare-primary bg-ninacare-secondary" : ""
              }`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-ninacare-primary text-white">
                        {conversation.patientName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {conversation.patientName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-ninacare-primary text-white px-2 py-1 text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                          {getStatusBadge(conversation.status)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        {conversation.patientId} • {conversation.procedure}
                      </p>
                      <p className="text-sm text-gray-600 truncate mb-2">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {conversation.timestamp}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {conversation.phase}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {currentConversation ? (
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-ninacare-primary text-white">
                      {currentConversation.patientName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{currentConversation.patientName}</CardTitle>
                    <CardDescription>
                      {currentConversation.patientId} • {currentConversation.procedure} • {currentConversation.phase}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(currentConversation.status)}
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "patient"
                          ? "bg-ninacare-primary text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {message.sender === "nina" ? (
                          <Bot className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                        <span className="text-xs font-medium">
                          {message.sender === "nina" ? "Nina" : currentConversation.patientName}
                        </span>
                        <span className="text-xs opacity-70">{message.timestamp}</span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Input placeholder="Digite uma mensagem..." className="flex-1" />
                <Button className="bg-ninacare-primary hover:bg-ninacare-primary/90">
                  Enviar
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Selecione uma conversa
              </h3>
              <p className="text-gray-600">
                Escolha uma conversa da lista para visualizar as mensagens
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Conversations
