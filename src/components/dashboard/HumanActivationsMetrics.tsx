import { Bot, Phone } from "lucide-react"
import MetricCard from "./MetricCard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HumanActivationsMetricsProps {
  humanActivationsToday: number;
  humanActivationsMonthly: number;
}

const HumanActivationsMetrics = ({ 
  humanActivationsToday,
  humanActivationsMonthly
}: HumanActivationsMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 h-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <MetricCard
              title="Acionamentos Humanos (Hoje)"
              value={humanActivationsToday.toLocaleString()}
              icon={Phone}
              description="Escalações para atendimento humano hoje."
            />
          </TooltipTrigger>
          <TooltipContent side="top">
            <span>
              Quantidade de vezes que a IA acionou a equipe hoje.
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <MetricCard
              title="Acionamentos Humanos (Mês)"
              value={humanActivationsMonthly.toLocaleString()}
              icon={Bot}
              description="Intervenções manuais nos últimos 30 dias."
            />
          </TooltipTrigger>
          <TooltipContent side="top">
            <span>
              Quantidade de vezes que a IA precisou de uma intervenção humana nos últimos 30 dias.
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default HumanActivationsMetrics; 