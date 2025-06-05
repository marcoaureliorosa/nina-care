
import { Activity, Users, UserCheck, MessageCircle } from "lucide-react"
import MetricCard from "./dashboard/MetricCard"
import EngagementMetrics from "./dashboard/EngagementMetrics"
import RecentActivity from "./dashboard/RecentActivity"
import NinaConversations from "./dashboard/NinaConversations"

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
      <EngagementMetrics
        responseRate24h={metrics.responseRate24h}
        spontaneousContacts={metrics.spontaneousContacts}
        humanActivations={metrics.humanActivations}
        satisfactionClicks={metrics.satisfactionClicks}
      />

      {/* Recent Activity */}
      <RecentActivity />

      {/* Nina Conversations Summary */}
      <NinaConversations />
    </div>
  )
}

export default Dashboard
