import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🔍 Verificando status do WhatsApp...');
    
    // Get the WhatsApp API token from Supabase Secrets
    const WHATSAPP_API_TOKEN = Deno.env.get('WHATSAPP_API_TOKEN');
    const WHATSAPP_INSTANCE_ID = Deno.env.get('WHATSAPP_INSTANCE_ID') || 'default';
    
    console.log('📋 Configurações:', {
      hasToken: !!WHATSAPP_API_TOKEN,
      instanceId: WHATSAPP_INSTANCE_ID
    });

    if (!WHATSAPP_API_TOKEN) {
      console.error('❌ WHATSAPP_API_TOKEN não configurado');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Configuração do WhatsApp incompleta',
          message: 'Configure apenas WHATSAPP_API_TOKEN nas Supabase Secrets para usar a AvisaAPI.',
          data: {
            configured: false,
            error: 'no configuration'
          }
        }),
        {
          status: 200, // Retorna 200 para não quebrar o frontend
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Endpoints priorizando AvisaAPI (que não precisa de instance ID)
    const endpoints = [
      `https://www.avisaapi.com.br/api/instance/status`,
      `https://api.z-api.io/instances/${WHATSAPP_INSTANCE_ID}/token/${WHATSAPP_API_TOKEN}/status`
    ];

    let lastError: string | null = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🌐 Tentando endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
            'Client-Token': WHATSAPP_API_TOKEN,
          },
          signal: AbortSignal.timeout(10000), // 10 segundos timeout
        });

        console.log(`📡 Resposta do endpoint ${endpoint}:`, {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('✅ Dados recebidos:', responseData);
          
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Status verificado com sucesso',
              data: {
                success: true,
                connected: responseData.connected || responseData.status === 'connected' || false,
                instance: WHATSAPP_INSTANCE_ID,
                ...responseData
              },
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        } else {
          const errorData = await response.text();
          lastError = `${response.status}: ${errorData}`;
          console.log(`⚠️ Endpoint ${endpoint} falhou:`, lastError);
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`❌ Erro no endpoint ${endpoint}:`, lastError);
        continue;
      }
    }

    // Se chegou aqui, todos os endpoints falharam
    console.error('❌ Todos os endpoints falharam. Último erro:', lastError);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Serviço temporariamente indisponível',
        message: 'Não foi possível conectar com o serviço do WhatsApp. Verifique se o token está correto.',
        data: {
          success: false,
          connected: false,
          error: 'service unavailable',
          lastError: lastError
        },
      }),
      {
        status: 200, // Retorna 200 para não quebrar o frontend
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('💥 Erro geral ao verificar status WhatsApp:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro interno. Tente novamente.',
        data: {
          success: false,
          connected: false,
          error: 'internal error'
        }
      }),
      {
        status: 200, // Retorna 200 para não quebrar o frontend
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}); 