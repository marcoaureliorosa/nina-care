import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

export const useDashboardMetrics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-metrics', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return null;
      }

      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*, organizacoes!inner(nome, procedures_performed)')
        .eq('id', user.id)
        .single();

      if (profileError || !userProfile?.organizacao_id) {
        return {
          procedures: 0,
          totalPatients: 0,
          patientsPercentage: 0,
          activePatients: { count: 0, percentage: 0 },
          ninaActivation: { count: 0, percentage: 0 },
          responseRate24h: { count: 0, percentage: 0 },
          spontaneousContacts: { count: 0, percentage: 0 },
          humanActivations: { count: 0, percentage: 0 },
          satisfactionClicks: 0,
          userProfile: null,
          newPatientsMonthly: 0,
          scheduledToday: 0,
          humanActivationsMonthly: 0,
          upcomingAppointments: [],
        };
      }

      const organizacao_id = userProfile.organizacao_id;
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(today.setHours(23, 59, 59, 999));
      const twentyFourHoursAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      // Base data fetching
      const { data: pacientesData, count: pacientesCount } = await supabase
        .from('pacientes')
        .select('id', { count: 'exact' })
        .eq('organizacao_id', organizacao_id);
      const patientIds = pacientesData?.map(p => p.id) || [];

      const { data: conversasData } = await supabase
        .from('conversas')
        .select('id, paciente_id')
        .in('paciente_id', patientIds);
      const conversationIds = conversasData?.map(c => c.id) || [];

      // Metrics calculations
      const { count: newPatientsMonthly } = await supabase
        .from('pacientes')
        .select('id', { count: 'exact', head: true })
        .eq('organizacao_id', organizacao_id)
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { count: humanActivationsMonthly } = await supabase
        .from('acionamentos_humanos')
        .select('id', { count: 'exact', head: true })
        .in('conversa_id', conversationIds)
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { data: upcomingAppointments } = await supabase
        .from('procedimentos')
        .select('id, data_procedimento, pacientes(nome), medicos(nome)')
        .in('paciente_id', patientIds)
        .gte('data_procedimento', todayStart.toISOString())
        .lte('data_procedimento', todayEnd.toISOString())
        .order('data_procedimento', { ascending: true })
        .limit(5);

      const procedures = userProfile.organizacoes?.procedures_performed ? Number(userProfile.organizacoes.procedures_performed) : 0;
      
      const patientsPercentage = procedures > 0 ? Math.min(100, Math.round((pacientesCount || 0) / procedures * 100)) : 0;
      
      const ninaActivationCount = new Set(conversasData?.map(c => c.paciente_id)).size;
      const ninaActivationPercentage = pacientesCount && pacientesCount > 0 ? Math.round((ninaActivationCount / pacientesCount) * 100) : 0;

      const { data: mensagens } = await supabase
        .from('n8n_chat_histories')
        .select('conversa_id, message, created_at')
        .in('conversa_id', conversationIds);

      const activePatientsSet = new Set<string>();
      if (mensagens) {
        for (const msg of mensagens) {
          if (new Date(msg.created_at).getTime() > twentyFourHoursAgo.getTime() && msg.message?.type === 'human') {
            const conv = conversasData?.find(c => c.id === msg.conversa_id);
            if (conv) {
              activePatientsSet.add(conv.paciente_id);
            }
          }
        }
      }
      const activePatientsCount = activePatientsSet.size;
      const activePatientsPercentage = pacientesCount && pacientesCount > 0 ? Math.round((activePatientsCount / pacientesCount) * 100) : 0;

      // Fetch follow-ups to calculate response rates and spontaneous contacts
      const { data: followUps } = await supabase
        .from('follow_up')
        .select('userid, dt_envio')
        .in('userid', patientIds);

      // Spontaneous contacts calculation
      const spontaneousContactsSet = new Set<string>();
      if (mensagens && followUps) {
        const patientMessages = mensagens.filter(m => m.message?.type === 'human');
        
        for (const pId of patientIds) {
          const patientFollowUps = followUps.filter(f => f.userid === pId);
          const patientMsgs = patientMessages.filter(m => {
            const conv = conversasData?.find(c => c.id === m.conversa_id);
            return conv?.paciente_id === pId;
          });

          for (const msg of patientMsgs) {
            const msgDate = new Date(msg.created_at);
            const recentFollowUp = patientFollowUps.some(f => {
              const followUpDate = new Date(f.dt_envio);
              const diffHours = (msgDate.getTime() - followUpDate.getTime()) / (1000 * 60 * 60);
              return diffHours > 0 && diffHours <= 24;
            });

            if (!recentFollowUp) {
              spontaneousContactsSet.add(pId);
              break; 
            }
          }
        }
      }
      const spontaneousContactsCount = spontaneousContactsSet.size;
      const spontaneousContactsPercentage = pacientesCount && pacientesCount > 0 ? Math.round((spontaneousContactsCount / pacientesCount) * 100) : 0;

      // This is a simplified placeholder, real logic might be more complex
      const { count: humanActivationsToday } = await supabase
        .from('acionamentos_humanos')
        .select('id', { count: 'exact', head: true })
        .in('conversa_id', conversationIds)
        .gte('created_at', todayStart.toISOString())
        .lte('created_at', todayEnd.toISOString());
      
      // Simplified placeholders for other complex metrics
      const responseRate24h = { count: 0, percentage: 0 };
      const { count: satisfactionClicks } = await supabase
        .from('satisfacao_cliques')
        .select('id', { count: 'exact', head: true })
        .in('paciente_id', patientIds);

      return {
        procedures,
        totalPatients: pacientesCount || 0,
        patientsPercentage,
        activePatients: { count: activePatientsCount, percentage: activePatientsPercentage },
        ninaActivation: { count: ninaActivationCount, percentage: ninaActivationPercentage },
        responseRate24h,
        spontaneousContacts: { count: spontaneousContactsCount, percentage: spontaneousContactsPercentage },
        humanActivations: { count: humanActivationsToday || 0, percentage: 0 }, // percentage needs logic
        satisfactionClicks: satisfactionClicks || 0,
        userProfile,
        newPatientsMonthly: newPatientsMonthly || 0,
        humanActivationsMonthly: humanActivationsMonthly || 0,
        upcomingAppointments: upcomingAppointments || [],
      };
    },
    enabled: !!user?.id,
  });
};
