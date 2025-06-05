
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot } from "lucide-react"

interface ConversationItem {
  time: string
  patient: string
  conversation: string
  status: "Em Acompanhamento" | "Humano Solicitado" | "Finalizada" | "Aguardando Ativação"
}

const NinaConversations = () => {
  const conversations: ConversationItem[] = [
    {
      time: "Há 8 min",
      patient: "Maria Silva",
      conversation: "Nina: Como está se sentindo hoje? Maria: Um pouco melhor, mas ainda sinto dor. Nina: Vou anotar isso e avisar sua equipe médica.",
      status: "Em Acompanhamento"
    },
    {
      time: "Há 15 min",
      patient: "Pedro Oliveira",
      conversation: "Nina: Olá! É hora do seu check-in pós-operatório. Pedro: Preciso falar com um médico urgente! Nina: Entendi, vou conectar você com a equipe médica agora.",
      status: "Humano Solicitado"
    },
    {
      time: "Há 22 min",
      patient: "Ana Costa",
      conversation: "Nina: Parabéns! Seu acompanhamento está completo. Ana: Muito obrigada pela ajuda durante todo o processo! Nina: Foi um prazer ajudar.",
      status: "Finalizada"
    },
    {
      time: "Há 28 min",
      patient: "Carlos Santos",
      conversation: "Nina: Olá Carlos! Clique no link para ativar seu acompanhamento pós-operatório. Aguardando resposta...",
      status: "Aguardando Ativação"
    }
  ]

  const getStatusColor = (status: ConversationItem['status']) => {
    switch (status) {
      case 'Em Acompanhamento':
        return 'bg-green-100 text-green-800'
      case 'Humano Solicitado':
        return 'bg-red-100 text-red-800'
      case 'Aguardando Ativação':
        return 'bg-yellow-100 text-yellow-800'
      case 'Finalizada':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-ninacare-primary" />
          Resumo das Conversas com Nina
        </CardTitle>
        <CardDescription>
          Últimas interações entre pacientes e o agente IA Nina
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conversations.map((conversation, index) => (
            <div key={index} className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">{conversation.patient}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                    {conversation.status}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{conversation.time}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{conversation.conversation}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default NinaConversations
