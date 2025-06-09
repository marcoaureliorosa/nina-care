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
    // Get the WhatsApp API token from Supabase Secrets
    const WHATSAPP_API_TOKEN = Deno.env.get('WHATSAPP_API_TOKEN');
    const WHATSAPP_BASE_URL = "https://www.avisaapi.com.br/api";

    if (!WHATSAPP_API_TOKEN) {
      console.error('WHATSAPP_API_TOKEN não configurado');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Token de API não configurado. Configure WHATSAPP_API_TOKEN nas Supabase Secrets.',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate QR Code via WhatsApp API
    const response = await fetch(`${WHATSAPP_BASE_URL}/generate-qr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Erro da AvisaAPI:', responseData);
      return new Response(
        JSON.stringify({
          success: false,
          error: responseData.message || 'Erro ao gerar QR Code',
          data: responseData,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'QR Code gerado com sucesso',
        data: responseData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Erro ao gerar QR Code WhatsApp:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}); 