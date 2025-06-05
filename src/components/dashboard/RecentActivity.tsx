
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivityItem {
  time: string
  patient: string
  action: string
  status: "success" | "warning" | "info"
}

const RecentActivity = () => {
  const activities: ActivityItem[] = [
    {
      time: "Há 5 min",
      patient: "Maria Silva",
      action: "Respondeu ao questionário pós-operatório",
      status: "success"
    },
    {
      time: "Há 12 min",
      patient: "João Santos",
      action: "Acionamento humano solicitado - dor intensa",
      status: "warning"
    },
    {
      time: "Há 18 min",
      patient: "Ana Costa",
      action: "Completou check-in pré-operatório",
      status: "success"
    },
    {
      time: "Há 25 min",
      patient: "Carlos Oliveira",
      action: "Primeira interação com Nina ativada",
      status: "info"
    }
  ]

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
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-500' :
                activity.status === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.patient}</p>
                <p className="text-sm text-gray-500 truncate">{activity.action}</p>
              </div>
              <div className="text-xs text-gray-400">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivity
