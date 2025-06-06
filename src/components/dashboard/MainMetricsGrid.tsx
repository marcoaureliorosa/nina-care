
import { Activity, Users, UserCheck, MessageCircle } from "lucide-react"
import MetricCard from "./MetricCard"

interface MainMetricsGridProps {
  procedures: number;
  totalPatients: number;
  activePatients: { count: number; percentage: number };
  ninaActivation: { count: number; percentage: number };
}

const MainMetricsGrid = ({ 
  procedures, 
  totalPatients, 
  activePatients, 
  ninaActivation 
}: MainMetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Procedimentos Realizados"
        value={procedures.toLocaleString()}
        icon={Activity}
        description="Total de procedimentos monitorados"
      />
      
      <MetricCard
        title="Pacientes Cadastrados"
        value={totalPatients.toLocaleString()}
        percentage={100}
        icon={Users}
        description="Base total de pacientes"
      />
      
      <MetricCard
        title="Pacientes Ativos"
        value={activePatients.count.toLocaleString()}
        percentage={activePatients.percentage}
        icon={UserCheck}
        description="Pacientes com atividade recente"
      />
      
      <MetricCard
        title="Ativação da Nina"
        value={ninaActivation.count.toLocaleString()}
        percentage={ninaActivation.percentage}
        icon={MessageCircle}
        description="Pacientes que ativaram o agente IA"
      />
    </div>
  );
};

export default MainMetricsGrid;
