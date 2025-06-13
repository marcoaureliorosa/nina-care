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

      // Buscar perfil do usuário para pegar organizacao_id
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*, organizacoes!inner(nome, procedures_performed)')
        .eq('id', user.id)
        .single();

      if (profileError || !userProfile?.organizacao_id) {
        return {
          procedures: 0,
          totalPatients: 0,
          activePatients: { count: 0, percentage: 0 },
          ninaActivation: { count: 0, percentage: 0 },
          responseRate24h: { count: 0, percentage: 0 },
          spontaneousContacts: { count: 0, percentage: 0 },
          humanActivations: { count: 0, percentage: 0 },
          satisfactionClicks: 0,
          userProfile: null,
          newPatientsMonthly: 0,
          scheduledToday: 0,
          pendingConversations: 0,
          humanActivationsMonthly: 0,
          upcomingAppointments: [],
        };
      }

      const organizacao_id = userProfile.organizacao_id;
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(today.setHours(23, 59, 59, 999));

      // Novas Métricas
      const { count: newPatientsMonthly } = await supabase
        .from('pacientes')
        .select('*', { count: 'exact', head: true })
        .eq('organizacao_id', organizacao_id)
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { count: scheduledToday } = await supabase
        .from('procedimentos')
        .select('id', { count: 'exact', head: true })
        .in('paciente_id', (await supabase.from('pacientes').select('id').eq('organizacao_id', organizacao_id)).data?.map(p => p.id) || [])
        .gte('data_procedimento', todayStart.toISOString())
        .lte('data_procedimento', todayEnd.toISOString());

      const { count: pendingConversations } = await supabase
        .from('conversas')
        .select('id', { count: 'exact', head: true })
        .in('paciente_id', (await supabase.from('pacientes').select('id').eq('organizacao_id', organizacao_id)).data?.map(p => p.id) || [])
        .eq('is_read', false);

      const { count: humanActivationsMonthly } = await supabase
        .from('acionamentos_humanos')
        .select('id', { count: 'exact', head: true })
        .in('conversa_id', (await supabase.from('conversas').select('id').in('paciente_id', (await supabase.from('pacientes').select('id').eq('organizacao_id', organizacao_id)).data?.map(p => p.id) || [])).data?.map(c => c.id) || [])
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { data: upcomingAppointments } = await supabase
        .from('procedimentos')
        .select(`
          id,
          data_procedimento,
          pacientes (nome),
          medicos (nome)
        `)
        .in('paciente_id', (await supabase.from('pacientes').select('id').eq('organizacao_id', organizacao_id)).data?.map(p => p.id) || [])
        .gte('data_procedimento', todayStart.toISOString())
        .lte('data_procedimento', todayEnd.toISOString())
        .order('data_procedimento', { ascending: true })
        .limit(5);

      // 1. Número de procedimentos (agora manual)
      const procedures = userProfile.organizacoes?.procedures_performed ? Number(userProfile.organizacoes.procedures_performed) : 0;

      // 2. Número de pacientes cadastrados
      const { count: pacientesCount, data: pacientesData } = await supabase
        .from('pacientes')
        .select('*', { count: 'exact' })
        .eq('organizacao_id', organizacao_id);

      // Percentual de pacientes: razão entre pacientes e procedimentos
      let patientsPercentage = 0;
      if (procedures > 0) {
        patientsPercentage = Math.round((pacientesCount / procedures) * 100);
        if (patientsPercentage > 100) patientsPercentage = 100;
      }

      // 3. Pacientes que ativaram a Nina: pacientes que possuem conversa
      const { data: conversasData } = await supabase
        .from('conversas')
        .select('id, paciente_id')
        .in('paciente_id', pacientesData?.map((p: any) => p.id) || []);
      const pacientesComConversaSet = new Set(conversasData?.map((c: any) => c.paciente_id));
      const ninaActivationCount = pacientesComConversaSet.size;
      const ninaActivationPercentage = pacientesCount && pacientesCount > 0 ? Math.round((ninaActivationCount / pacientesCount) * 100) : 0;

      // 4. Touchpoints enviados (follow_up)
      const { data: followUps } = await supabase
        .from('follow_up')
        .select('id, userid, dt_envio, tag, status')
        .in('userid', pacientesData?.map((p: any) => p.id) || []);

      // 5. Mensagens (n8n_chat_histories)
      // Buscar todas as mensagens das conversas dos pacientes da organização
      const conversasIds = conversasData?.map((c: any) => c.id) || [];

      let mensagens: any[] = [];
      if (conversasIds.length > 0) {
        // Buscar mensagens em lotes de 100 conversas para evitar limite do Supabase
        for (let i = 0; i < conversasIds.length; i += 100) {
          const batch = conversasIds.slice(i, i + 100);
          const { data: batchMsgs } = await supabase
            .from('n8n_chat_histories')
            .select('id, conversa_id, message, created_at')
            .in('conversa_id', batch);
          if (batchMsgs) mensagens = mensagens.concat(batchMsgs);
        }
      }

      // 6. Cliques na pesquisa de satisfação
      const { count: satisfactionClicks } = await supabase
        .from('satisfacao_cliques')
        .select('*', { count: 'exact', head: true })
        .in('paciente_id', pacientesData?.map((p: any) => p.id) || []);

      // --- Cálculo das métricas avançadas ---
      // Pacientes ativos: pacientes com pelo menos 1 mensagem nos últimos 30 dias
      const now = new Date();
      const dias30 = 1000 * 60 * 60 * 24 * 30;
      const ativosSet = new Set();
      mensagens.forEach(msg => {
        const created = new Date(msg.created_at);
        if (now.getTime() - created.getTime() < dias30) {
          if (msg.message && typeof msg.message === 'object' && msg.message.type === 'human') {
            // Buscar o paciente_id através da conversa_id
            const conversa = conversasData?.find(c => c.id === msg.conversa_id);
            if (conversa) {
              ativosSet.add(conversa.paciente_id);
            }
          }
        }
      });
      const activePatientsCount = ativosSet.size;
      const activePatientsPercentage = pacientesCount && pacientesCount > 0 ? Math.round((activePatientsCount / pacientesCount) * 100) : 0;

      // Resposta em até 24h após touchpoint (follow_up)
      let respostas24h = 0;
      let totalTouchpoints = 0;
      if (followUps && mensagens.length > 0) {
        for (const touch of followUps) {
          totalTouchpoints++;
          // Busca mensagem do paciente (type: 'human') após o dt_envio e até 24h depois
          const dtEnvio = new Date(touch.dt_envio);
          const dtLimite = new Date(dtEnvio.getTime() + 24 * 60 * 60 * 1000);
          const respondeu = mensagens.some(msg => {
            const created = new Date(msg.created_at);
            return created > dtEnvio && created <= dtLimite && msg.message && msg.message.type === 'human' && msg.userid === touch.userid;
          });
          if (respondeu) respostas24h++;
        }
      }
      const responseRate24hPercentage = totalTouchpoints > 0 ? Math.round((respostas24h / totalTouchpoints) * 100) : 0;

      // Contatos espontâneos: pacientes únicos que enviaram mensagem sem follow-up anterior nos últimos 24h
      const pacientesComContatoEspontaneo = new Set();
      if (mensagens.length > 0 && followUps) {
        for (const msg of mensagens) {
          if (msg.message && msg.message.type === 'human') {
            const msgDate = new Date(msg.created_at);
            // Encontrar o follow-up mais recente anterior à mensagem
            let lastFollowup: any = null;
            for (const touch of followUps) {
              const dtEnvio = new Date(touch.dt_envio);
              if (dtEnvio <= msgDate && touch.userid === msg.userid) {
                if (!lastFollowup || dtEnvio > new Date(lastFollowup.dt_envio)) {
                  lastFollowup = touch;
                }
              }
            }
            if (!lastFollowup) {
              pacientesComContatoEspontaneo.add(msg.userid);
            } else {
              const dtEnvio = new Date(lastFollowup.dt_envio);
              const diff = msgDate.getTime() - dtEnvio.getTime();
              if (diff > 24 * 60 * 60 * 1000) {
                pacientesComContatoEspontaneo.add(msg.userid);
              }
            }
          }
        }
      }
      const espontaneos = pacientesComContatoEspontaneo.size;
      const espontaneosPercentage = pacientesCount && pacientesCount > 0 ? Math.round((espontaneos / pacientesCount) * 100) : 0;

      // Buscar acionamentos humanos vinculados às conversas da organização
      let humanActivationsCount = 0;
      if (conversasIds.length > 0) {
        const { count: acionamentosCount } = await supabase
          .from('acionamentos_humanos')
          .select('*', { count: 'exact', head: true })
          .in('conversa_id', conversasIds);
        humanActivationsCount = acionamentosCount || 0;
      }
      const humanActivationsPercentage = pacientesCount && pacientesCount > 0 ? Math.round((humanActivationsCount / pacientesCount) * 100) : 0;

      // Acionamentos humanos HOJE
      let humanActivationsToday = 0;
      if (conversasIds.length > 0) {
        const { count: acionamentosHoje } = await supabase
          .from('acionamentos_humanos')
          .select('*', { count: 'exact', head: true })
          .in('conversa_id', conversasIds)
          .gte('created_at', todayStart.toISOString())
          .lte('created_at', todayEnd.toISOString());
        humanActivationsToday = acionamentosHoje || 0;
      }

      return {
        procedures,
        totalPatients: pacientesCount || 0,
        patientsPercentage,
        activePatients: { count: activePatientsCount, percentage: activePatientsPercentage },
        ninaActivation: { count: ninaActivationCount, percentage: ninaActivationPercentage },
        responseRate24h: { count: respostas24h, percentage: responseRate24hPercentage },
        spontaneousContacts: { count: espontaneos, percentage: espontaneosPercentage },
        humanActivations: { count: humanActivationsToday, percentage: 0 },
        satisfactionClicks: satisfactionClicks || 0,
        userProfile,
        newPatientsMonthly: newPatientsMonthly || 0,
        scheduledToday: scheduledToday || 0,
        pendingConversations: pendingConversations || 0,
        humanActivationsMonthly: humanActivationsMonthly || 0,
        upcomingAppointments: upcomingAppointments || [],
      };
    },
    enabled: !!user?.id,
    retry: 2
  });
};
