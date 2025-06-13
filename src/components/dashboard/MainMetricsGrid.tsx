import { Activity, Users, UserCheck, MessageCircle } from "lucide-react"
import MetricCard from "./MetricCard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MainMetricsGridProps {
  procedures: number;
  totalPatients: number;
  patientsPercentage: number;
  activePatients: { count: number; percentage: number };
  ninaActivation: { count: number; percentage: number };
  onEditProcedures: () => void;
}

const MainMetricsGrid = ({ 
  procedures, 
  totalPatients, 
  patientsPercentage,
  activePatients,
  ninaActivation,
  onEditProcedures
}: MainMetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 h-full">
      <MetricCard
        title="Procedimentos Realizados"
        value={procedures.toLocaleString()}
        icon={Activity}
        description="Total de procedimentos monitorados"
        onEdit={onEditProcedures}
      />
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <MetricCard
              title="Pacientes Cadastrados"
              value={totalPatients.toLocaleString()}
              percentage={patientsPercentage}
              icon={Users}
              description="Base total de pacientes"
            />
          </TooltipTrigger>
          <TooltipContent side="top">
            <span>
              O percentual representa a razão entre pacientes cadastrados e procedimentos realizados, limitado a 100%.
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <MetricCard
              title="Pacientes Ativos"
              value={activePatients.count.toLocaleString()}
              percentage={activePatients.percentage}
              icon={UserCheck}
              description="Pacientes com atividade nas últimas 24h"
            />
          </TooltipTrigger>
          <TooltipContent side="top">
            <span>
              Pacientes que enviaram pelo menos uma mensagem nas últimas 24 horas.
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <MetricCard
              title="Ativação da Nina"
              value={ninaActivation.count.toLocaleString()}
              percentage={ninaActivation.percentage}
              icon={MessageCircle}
              description="Pacientes que ativaram o agente IA"
            />
          </TooltipTrigger>
          <TooltipContent side="top">
            <span>
              Pacientes que já enviaram pelo menos uma mensagem para a Nina (ou seja, possuem conversa).
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MainMetricsGrid;
