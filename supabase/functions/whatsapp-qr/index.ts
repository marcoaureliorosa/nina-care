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
    console.log('📱 Gerando QR Code do WhatsApp...');
    
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
      {
        url: `https://www.avisaapi.com.br/api/instance/qr`,
        method: 'GET'
      },
      {
        url: `https://api.z-api.io/instances/${WHATSAPP_INSTANCE_ID}/token/${WHATSAPP_API_TOKEN}/qr-code`,
        method: 'GET'
      }
    ];

    let lastError: string | null = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🌐 Tentando endpoint: ${endpoint.url}`);
        
        const response = await fetch(endpoint.url, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
            'Client-Token': WHATSAPP_API_TOKEN,
          },
          signal: AbortSignal.timeout(15000), // 15 segundos timeout para QR
        });

        console.log(`📡 Resposta do endpoint ${endpoint.url}:`, {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('✅ QR Code gerado:', !!responseData.qrcode || !!responseData.qr);
          
          // Normalizar a resposta para diferentes APIs
          const qrCode = responseData.qrcode || responseData.qr || responseData.data?.qrcode || responseData.data?.qr;
          
          if (qrCode) {
            return new Response(
              JSON.stringify({
                success: true,
                message: 'QR Code gerado com sucesso',
                data: {
                  success: true,
                  qrcode: qrCode,
                  instance: WHATSAPP_INSTANCE_ID,
                  ...responseData
                },
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          } else {
            lastError = 'QR Code não encontrado na resposta da API';
            console.log(`⚠️ QR Code não encontrado no endpoint ${endpoint.url}`);
          }
        } else {
          const errorData = await response.text();
          lastError = `${response.status}: ${errorData}`;
          console.log(`⚠️ Endpoint ${endpoint.url} falhou:`, lastError);
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`❌ Erro no endpoint ${endpoint.url}:`, lastError);
        continue;
      }
    }

    // Se chegou aqui, todos os endpoints falharam
    console.error('❌ Todos os endpoints falharam. Último erro:', lastError);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Serviço temporariamente indisponível',
        message: 'Não foi possível gerar o QR Code. Verifique se o token está correto.',
        data: {
          success: false,
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
    console.error('💥 Erro geral ao gerar QR Code WhatsApp:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro interno. Tente novamente.',
        data: {
          success: false,
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