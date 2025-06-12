import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Calendar, MessageCircleWarning, Bot } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface OverviewMetricsProps {
  newPatientsMonthly: number;
  scheduledToday: number;
  pendingConversations: number;
  humanActivationsMonthly: number;
}

const OverviewMetrics = ({
  newPatientsMonthly,
  scheduledToday,
  pendingConversations,
  humanActivationsMonthly,
}: OverviewMetricsProps) => {
  const metrics = [
    {
      title: "Novos Pacientes (Mês)",
      value: newPatientsMonthly,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "Pacientes cadastrados nos últimos 30 dias.",
    },
    {
      title: "Consultas Agendadas (Hoje)",
      value: scheduledToday,
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
      description: "Procedimentos marcados para hoje.",
    },
    {
      title: "Conversas Pendentes",
      value: pendingConversations,
      icon: <MessageCircleWarning className="h-4 w-4 text-muted-foreground" />,
      description: "Conversas aguardando resposta.",
      tooltip: "Conversas que receberam uma nova mensagem do paciente e ainda não foram visualizadas pela equipe."
    },
    {
      title: "Acionamentos Humanos (Mês)",
      value: humanActivationsMonthly,
      icon: <Bot className="h-4 w-4 text-muted-foreground" />,
      description: "Intervenções manuais nos últimos 30 dias.",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        metric.tooltip ? (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    {metric.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>{metric.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        )
      ))}
    </div>
  );
};

export default OverviewMetrics; 