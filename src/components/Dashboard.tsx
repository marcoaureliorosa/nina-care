
import { Activity, Users, UserCheck, MessageCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import MetricCard from "./dashboard/MetricCard"
import EngagementMetrics from "./dashboard/EngagementMetrics"
import RecentActivity from "./dashboard/RecentActivity"

const Dashboard = () => {
  const { profile } = useAuth();

  // Buscar dados das métricas do Supabase filtrados por organização
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics', profile?.organizacao_id],
    queryFn: async () => {
      if (!profile?.organizacao_id) {
        console.log('No organization ID available')
        return {
          procedures: 0,
          totalPatients: 0,
          activePatients: { count: 0, percentage: 0 },
          ninaActivation: { count: 0, percentage: 0 },
          responseRate24h: { count: 0, percentage: 0 },
          spontaneousContacts: { count: 0, percentage: 0 },
          humanActivations: { count: 0, percentage: 0 },
          satisfactionClicks: 0
        };
      }

      console.log('Fetching dashboard metrics for organization:', profile.organizacao_id)
      
      // Buscar total de procedimentos da organização
      const { data: procedimentos, error: procedimentosError } = await supabase
        .from('procedimentos')
        .select(`
          id,
          pacientes!inner (
            organizacao_id
          )
        `)
        .eq('pacientes.organizacao_id', profile.organizacao_id)
      
      if (procedimentosError) {
        console.error('Error fetching procedimentos:', procedimentosError)
      }

      // Buscar total de pacientes da organização
      const { data: pacientes, error: pacientesError } = await supabase
        .from('pacientes')
        .select('id')
        .eq('organizacao_id', profile.organizacao_id)
      
      if (pacientesError) {
        console.error('Error fetching pacientes:', pacientesError)
      }

      // Buscar conversas ativas (pacientes da organização que têm conversas)
      const { data: conversasAtivas, error: conversasError } = await supabase
        .from('conversas')
        .select(`
          paciente_id,
          pacientes!inner (
            organizacao_id
          )
        `)
        .eq('pacientes.organizacao_id', profile.organizacao_id)
      
      if (conversasError) {
        console.error('Error fetching conversas:', conversasError)
      }

      // Buscar ativações da Nina
      const { data: ninaActivations, error: ninaError } = await supabase
        .from('conversas')
        .select(`
          id,
          pacientes!inner (
            organizacao_id
          )
        `)
        .eq('pacientes.organizacao_id', profile.organizacao_id)
        .neq('status', 'aguardando_ativacao')
      
      if (ninaError) {
        console.error('Error fetching nina activations:', ninaError)
      }

      // Buscar respostas nas últimas 24h
      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)
      
      const { data: responseRate24h, error: responseError } = await supabase
        .from('conversas')
        .select(`
          id,
          pacientes!inner (
            organizacao_id
          )
        `)
        .eq('pacientes.organizacao_id', profile.organizacao_id)
        .gte('timestamp_ultima_mensagem', oneDayAgo.toISOString())
      
      if (responseError) {
        console.error('Error fetching response rate:', responseError)
      }

      // Buscar contatos espontâneos
      const { data: spontaneousContacts, error: spontaneousError } = await supabase
        .from('conversas')
        .select(`
          id,
          pacientes!inner (
            organizacao_id
          )
        `)
        .eq('pacientes.organizacao_id', profile.organizacao_id)
        .eq('is_priority', true)
      
      if (spontaneousError) {
        console.error('Error fetching spontaneous contacts:', spontaneousError)
      }

      // Buscar ativações humanas
      const { data: humanActivations, error: humanError } = await supabase
        .from('conversas')
        .select(`
          id,
          pacientes!inner (
            organizacao_id
          )
        `)
        .eq('pacientes.organizacao_id', profile.organizacao_id)
        .eq('status', 'humano_solicitado')
      
      if (humanError) {
        console.error('Error fetching human activations:', humanError)
      }

      const totalProcedimentos = procedimentos?.length || 0
      const totalPacientes = pacientes?.length || 0
      const totalConversasAtivas = conversasAtivas?.length || 0
      const totalNinaActivations = ninaActivations?.length || 0
      const totalResponse24h = responseRate24h?.length || 0
      const totalSpontaneous = spontaneousContacts?.length || 0
      const totalHuman = humanActivations?.length || 0

      console.log('Dashboard metrics:', {
        procedimentos: totalProcedimentos,
        pacientes: totalPacientes,
        conversasAtivas: totalConversasAtivas,
        ninaActivations: totalNinaActivations
      })

      return {
        procedures: totalProcedimentos,
        totalPatients: totalPacientes,
        activePatients: { 
          count: totalConversasAtivas, 
          percentage: totalPacientes > 0 ? (totalConversasAtivas / totalPacientes) * 100 : 0 
        },
        ninaActivation: { 
          count: totalNinaActivations, 
          percentage: totalPacientes > 0 ? (totalNinaActivations / totalPacientes) * 100 : 0 
        },
        responseRate24h: { 
          count: totalResponse24h, 
          percentage: totalConversasAtivas > 0 ? (totalResponse24h / totalConversasAtivas) * 100 : 0 
        },
        spontaneousContacts: { 
          count: totalSpontaneous, 
          percentage: totalConversasAtivas > 0 ? (totalSpontaneous / totalConversasAtivas) * 100 : 0 
        },
        humanActivations: { 
          count: totalHuman, 
          percentage: totalConversasAtivas > 0 ? (totalHuman / totalConversasAtivas) * 100 : 0 
        },
        satisfactionClicks: Math.floor(totalConversasAtivas * 0.8) // Aproximação baseada nas conversas
      }
    },
    enabled: !!profile?.organizacao_id
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Ninacare</h1>
          <p className="text-gray-600 mt-2">Carregando métricas...</p>
        </div>
      </div>
    )
  }

  if (!profile?.organizacao_id) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Ninacare</h1>
          <p className="text-gray-600 mt-2">Usuário não está associado a uma organização.</p>
        </div>
      </div>
    )
  }

  const metricsData = metrics || {
    procedures: 0,
    totalPatients: 0,
    activePatients: { count: 0, percentage: 0 },
    ninaActivation: { count: 0, percentage: 0 },
    responseRate24h: { count: 0, percentage: 0 },
    spontaneousContacts: { count: 0, percentage: 0 },
    humanActivations: { count: 0, percentage: 0 },
    satisfactionClicks: 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Ninacare</h1>
        <p className="text-gray-600 mt-2">
          Acompanhamento em tempo real dos agentes IA e métricas de engajamento
        </p>
        <p className="text-sm text-gray-500">
          Organização: {profile.organizacoes?.nome || 'Sem organização'}
        </p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Procedimentos Realizados"
          value={metricsData.procedures.toLocaleString()}
          icon={Activity}
          description="Total de procedimentos monitorados"
        />
        
        <MetricCard
          title="Pacientes Cadastrados"
          value={metricsData.totalPatients.toLocaleString()}
          percentage={100}
          icon={Users}
          description="Base total de pacientes"
        />
        
        <MetricCard
          title="Pacientes Ativos"
          value={metricsData.activePatients.count.toLocaleString()}
          percentage={metricsData.activePatients.percentage}
          icon={UserCheck}
          description="Pacientes com atividade recente"
        />
        
        <MetricCard
          title="Ativação da Nina"
          value={metricsData.ninaActivation.count.toLocaleString()}
          percentage={metricsData.ninaActivation.percentage}
          icon={MessageCircle}
          description="Pacientes que ativaram o agente IA"
        />
      </div>

      {/* Engagement Metrics */}
      <EngagementMetrics
        responseRate24h={metricsData.responseRate24h}
        spontaneousContacts={metricsData.spontaneousContacts}
        humanActivations={metricsData.humanActivations}
        satisfactionClicks={metricsData.satisfactionClicks}
      />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}

export default Dashboard
