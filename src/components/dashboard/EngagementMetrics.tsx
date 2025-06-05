
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Phone, ThumbsUp } from "lucide-react"
import MetricCard from "./MetricCard"

interface EngagementMetricsProps {
  responseRate24h: { count: number; percentage: number }
  spontaneousContacts: { count: number; percentage: number }
  humanActivations: { count: number; percentage: number }
  satisfactionClicks: number
}

const EngagementMetrics = ({
  responseRate24h,
  spontaneousContacts,
  humanActivations,
  satisfactionClicks
}: EngagementMetricsProps) => {
  return (
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
                {responseRate24h.count} pacientes ({responseRate24h.percentage}%)
              </span>
            </div>
            <Progress value={responseRate24h.percentage} className="h-3" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Contatos Espontâneos</span>
              <span className="text-sm text-muted-foreground">
                {spontaneousContacts.count} pacientes ({spontaneousContacts.percentage}%)
              </span>
            </div>
            <Progress value={spontaneousContacts.percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <MetricCard
          title="Acionamentos Humanos"
          value={humanActivations.count.toLocaleString()}
          percentage={humanActivations.percentage}
          icon={Phone}
          description="Escalações para atendimento humano"
        />
        
        <MetricCard
          title="Pesquisa de Satisfação"
          value={satisfactionClicks.toLocaleString()}
          icon={ThumbsUp}
          description="Cliques no link da pesquisa"
        />
      </div>
    </div>
  )
}

export default EngagementMetrics
