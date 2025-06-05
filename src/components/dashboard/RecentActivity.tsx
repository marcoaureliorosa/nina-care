
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivityItem {
  time: string
  patient: string
  action: string
  conversationSummary: string
  status: "em_acompanhamento" | "humano_solicitado" | "finalizada" | "aguardando_ativacao"
}

const RecentActivity = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      console.log('Fetching recent activities...')
      
      const { data, error } = await supabase
        .from('conversas')
        .select(`
          *,
          pacientes (
            nome
          )
        `)
        .order('updated_at', { ascending: false })
        .limit(10)
      
      if (error) {
        console.error('Error fetching recent activities:', error)
        return []
      }

      console.log('Recent activities data:', data)

      return data?.map(conversa => {
        const timeAgo = new Date(conversa.updated_at)
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - timeAgo.getTime()) / (1000 * 60))
        
        let timeString = ''
        if (diffInMinutes < 1) {
          timeString = 'Agora'
        } else if (diffInMinutes < 60) {
          timeString = `Há ${diffInMinutes} min`
        } else {
          const diffInHours = Math.floor(diffInMinutes / 60)
          timeString = `Há ${diffInHours}h`
        }

        let action = ''
        switch (conversa.status) {
          case 'em_acompanhamento':
            action = 'Respondeu ao questionário pós-operatório'
            break
          case 'humano_solicitado':
            action = 'Acionamento humano solicitado - dor intensa'
            break
          case 'finalizada':
            action = 'Completou check-in pré-operatório'
            break
          case 'aguardando_ativacao':
            action = 'Primeira interação com Nina ativada'
            break
          default:
            action = 'Atividade de acompanhamento'
        }

        return {
          time: timeString,
          patient: conversa.pacientes?.nome || 'Paciente não identificado',
          action,
          conversationSummary: conversa.resumo_conversa || 'Sem resumo disponível',
          status: conversa.status as ActivityItem['status']
        }
      }) || []
    }
  })

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'em_acompanhamento':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'humano_solicitado':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'aguardando_ativacao':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'finalizada':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: ActivityItem['status']) => {
    switch (status) {
      case 'em_acompanhamento':
        return 'Em Acompanhamento'
      case 'humano_solicitado':
        return 'Humano Solicitado'
      case 'aguardando_ativacao':
        return 'Aguardando Ativação'
      case 'finalizada':
        return 'Finalizada'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Carregando atividades...</CardDescription>
        </CardHeader>
      </Card>
    )
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
          {activities && activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{activity.patient}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                      {getStatusLabel(activity.status)}
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
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma atividade recente encontrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivity
