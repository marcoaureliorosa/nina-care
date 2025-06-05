
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivityItem {
  time: string
  patient: string
  action: string
  conversationSummary: string
  status: "Em Acompanhamento" | "Humano Solicitado" | "Finalizada" | "Aguardando Ativação"
}

const RecentActivity = () => {
  const activities: ActivityItem[] = [
    {
      time: "Há 5 min",
      patient: "Maria Silva",
      action: "Respondeu ao questionário pós-operatório",
      conversationSummary: "Nina: Como está se sentindo hoje? Maria: Um pouco melhor, mas ainda sinto dor. Nina: Vou anotar isso e avisar sua equipe médica.",
      status: "Em Acompanhamento"
    },
    {
      time: "Há 12 min",
      patient: "João Santos",
      action: "Acionamento humano solicitado - dor intensa",
      conversationSummary: "Nina: Olá! É hora do seu check-in pós-operatório. João: Preciso falar com um médico urgente! Nina: Entendi, vou conectar você com a equipe médica agora.",
      status: "Humano Solicitado"
    },
    {
      time: "Há 18 min",
      patient: "Ana Costa",
      action: "Completou check-in pré-operatório",
      conversationSummary: "Nina: Parabéns! Seu acompanhamento está completo. Ana: Muito obrigada pela ajuda durante todo o processo! Nina: Foi um prazer ajudar.",
      status: "Finalizada"
    },
    {
      time: "Há 25 min",
      patient: "Carlos Oliveira",
      action: "Primeira interação com Nina ativada",
      conversationSummary: "Nina: Olá Carlos! Clique no link para ativar seu acompanhamento pós-operatório. Aguardando resposta...",
      status: "Aguardando Ativação"
    }
  ]

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'Em Acompanhamento':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Humano Solicitado':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Aguardando Ativação':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Finalizada':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>
          Últimas interações dos agentes IA com pacientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-gray-900">{activity.patient}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{activity.action}</p>
              <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-200">
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  {activity.conversationSummary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivity
