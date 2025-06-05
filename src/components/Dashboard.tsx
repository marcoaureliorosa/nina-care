
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, Users, UserCheck, Clock, Phone, MessageCircle, ThumbsUp, Bot } from "lucide-react"

const Dashboard = () => {
  // Mock data - in a real application, this would come from your API
  const metrics = {
    procedures: 1248,
    totalPatients: 3456,
    activePatients: { count: 2890, percentage: 83.6 },
    ninaActivation: { count: 2456, percentage: 85.0 },
    responseRate24h: { count: 1890, percentage: 77.0 },
    spontaneousContacts: { count: 456, percentage: 18.6 },
    humanActivations: { count: 234, percentage: 9.5 },
    satisfactionClicks: 1567
  }

  const MetricCard = ({ 
    title, 
    value, 
    percentage, 
    icon: Icon, 
    trend = "up",
    description 
  }: {
    title: string
    value: string | number
    percentage?: number
    icon: any
    trend?: "up" | "down" | "neutral"
    description?: string
  }) => (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-ninacare-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {percentage !== undefined && (
          <div className="flex items-center space-x-2 mt-2">
            <Progress 
              value={percentage} 
              className="flex-1 h-2" 
            />
            <span className="text-sm font-medium text-ninacare-primary">
              {percentage}%
            </span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Ninacare</h1>
        <p className="text-gray-600 mt-2">
          Acompanhamento em tempo real dos agentes IA e métricas de engajamento
        </p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Procedimentos Realizados"
          value={metrics.procedures.toLocaleString()}
          icon={Activity}
          description="Total de procedimentos monitorados"
        />
        
        <MetricCard
          title="Pacientes Cadastrados"
          value={metrics.totalPatients.toLocaleString()}
          percentage={100}
          icon={Users}
          description="Base total de pacientes"
        />
        
        <MetricCard
          title="Pacientes Ativos"
          value={metrics.activePatients.count.toLocaleString()}
          percentage={metrics.activePatients.percentage}
          icon={UserCheck}
          description="Pacientes com atividade recente"
        />
        
        <MetricCard
          title="Ativação da Nina"
          value={metrics.ninaActivation.count.toLocaleString()}
          percentage={metrics.ninaActivation.percentage}
          icon={MessageCircle}
          description="Pacientes que ativaram o agente IA"
        />
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-ninacare-primary" />
              Métricas de Resposta
            </CardTitle>
            <CardDescription>
              Acompanhamento da responsividade dos pacientes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Resposta em 24h</span>
                <span className="text-sm text-muted-foreground">
                  {metrics.responseRate24h.count} pacientes ({metrics.responseRate24h.percentage}%)
                </span>
              </div>
              <Progress value={metrics.responseRate24h.percentage} className="h-3" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Contatos Espontâneos</span>
                <span className="text-sm text-muted-foreground">
                  {metrics.spontaneousContacts.count} pacientes ({metrics.spontaneousContacts.percentage}%)
                </span>
              </div>
              <Progress value={metrics.spontaneousContacts.percentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <MetricCard
            title="Acionamentos Humanos"
            value={metrics.humanActivations.count.toLocaleString()}
            percentage={metrics.humanActivations.percentage}
            icon={Phone}
            description="Escalações para atendimento humano"
          />
          
          <MetricCard
            title="Pesquisa de Satisfação"
            value={metrics.satisfactionClicks.toLocaleString()}
            icon={ThumbsUp}
            description="Cliques no link da pesquisa"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>
            Últimas interações dos agentes IA com pacientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
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
            ].map((activity, index) => (
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

      {/* Nina Conversations Summary */}
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
            {[
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
            ].map((conversation, index) => (
              <div key={index} className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{conversation.patient}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      conversation.status === 'Em Acompanhamento' ? 'bg-green-100 text-green-800' :
                      conversation.status === 'Humano Solicitado' ? 'bg-red-100 text-red-800' :
                      conversation.status === 'Aguardando Ativação' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
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
    </div>
  )
}

export default Dashboard
