// Certifique-se de instalar o framer-motion: npm install framer-motion
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Phone, ThumbsUp } from "lucide-react"
import MetricCard from "./MetricCard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="col-span-1 lg:col-span-2"
      >
        <Card className="rounded-2xl border-0 bg-white/90 dark:bg-zinc-900/90 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-800 dark:text-white">
              <Clock className="h-6 w-6 text-ninacare-primary" />
              Métricas de Resposta
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-300">
              Acompanhamento da responsividade dos pacientes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-zinc-700 dark:text-zinc-100">Resposta em 24h</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-base text-ninacare-primary font-semibold cursor-help">
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
              <Progress value={responseRate24h.percentage} className="h-4 bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-zinc-700 dark:text-zinc-100">Contatos Espontâneos</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-base text-ninacare-primary font-semibold cursor-help">
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
              <Progress value={spontaneousContacts.percentage} className="h-4 bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <div className="space-y-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <MetricCard
                  title="Acionamentos Humanos"
                  value={humanActivations.count.toLocaleString()}
                  percentage={humanActivations.percentage}
                  icon={Phone}
                  description="Escalações para atendimento humano"
                />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>
                Quantidade de vezes que a IA acionou a equipe especializada, seja por solicitação do paciente ou por complicação detectada.
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <MetricCard
            title="Pesquisa de Satisfação"
            value={satisfactionClicks.toLocaleString()}
            icon={ThumbsUp}
            description="Cliques no link da pesquisa"
          />
        </motion.div>
      </div>
    </div>
  )
}

export default EngagementMetrics
