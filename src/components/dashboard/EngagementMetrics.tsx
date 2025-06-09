import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Phone, ThumbsUp } from "lucide-react"
import MetricCard from "./MetricCard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-muted-foreground cursor-help">
                      {responseRate24h.count} pacientes ({responseRate24h.percentage}%)
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <span>
                      Quantidade de pacientes que responderam um follow-up enviado pelo agente em até 24 horas.
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Progress value={responseRate24h.percentage} className="h-3" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Contatos Espontâneos</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-muted-foreground cursor-help">
                      {spontaneousContacts.count} pacientes ({spontaneousContacts.percentage}%)
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <span>
                      Mensagens enviadas pelo paciente quando o último follow-up recebido foi há mais de 24h ou não houve follow-up anterior.
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Progress value={spontaneousContacts.percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <MetricCard
                  title="Acionamentos Humanos"
                  value={humanActivations.count.toLocaleString()}
                  percentage={humanActivations.percentage}
                  icon={Phone}
                  description="Escalações para atendimento humano"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>
                Quantidade de vezes que a IA acionou a equipe especializada, seja por solicitação do paciente ou por complicação detectada.
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
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
