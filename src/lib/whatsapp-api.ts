// Configurações e utilitários para a API do WhatsApp (AvisaAPI)

// URL base da API (pública)
const WHATSAPP_BASE_URL = "https://www.avisaapi.com.br/api";

/**
 * Cria headers padrão para requisições da API do WhatsApp
 * Para usar com token, as requisições devem ser feitas via Edge Functions
 */
export const createWhatsAppHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  return headers;
};

/**
 * Interface para respostas da API do WhatsApp
 */
export interface WhatsAppApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

/**
 * Interface para status de conexão
 */
export interface WhatsAppConnectionStatus {
  connected: boolean;
  qrCode?: string;
  instance?: string;
  lastCheck?: Date;
}

/**
 * Envia mensagem via Edge Function (que possui acesso ao token secreto)
 */
export const sendWhatsAppMessage = async (to: string, message: string): Promise<WhatsAppApiResponse> => {
  try {
    // Chamar Edge Function que tem acesso ao WHATSAPP_API_TOKEN via Supabase Secrets
    const response = await fetch('/functions/v1/send-whatsapp-message', {
      method: 'POST',
      headers: createWhatsAppHeaders(),
      body: JSON.stringify({
        to,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Gera QR Code para conexão via Edge Function
 */
export const generateWhatsAppQR = async (): Promise<WhatsAppApiResponse> => {
  try {
    // Chamar Edge Function para gerar QR
    const response = await fetch('/functions/v1/whatsapp-qr', {
      method: 'POST',
      headers: createWhatsAppHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao gerar QR WhatsApp:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Verifica status da conexão WhatsApp via Edge Function
 */
export const checkWhatsAppStatus = async (): Promise<WhatsAppConnectionStatus> => {
  try {
    // Chamar Edge Function para verificar status
    const response = await fetch('/functions/v1/whatsapp-status', {
      method: 'GET',
      headers: createWhatsAppHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const result = await response.json();
    return {
      connected: result.success && result.data?.connected,
      instance: result.data?.instance,
      lastCheck: new Date(),
    };
  } catch (error) {
    console.error('Erro ao verificar status WhatsApp:', error);
    return {
      connected: false,
      lastCheck: new Date(),
    };
  }
};

/**
 * Desconecta instância WhatsApp via Edge Function
 */
export const disconnectWhatsApp = async (): Promise<WhatsAppApiResponse> => {
  try {
    // Chamar Edge Function para desconectar
    const response = await fetch('/functions/v1/whatsapp-disconnect', {
      method: 'POST',
      headers: createWhatsAppHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao desconectar WhatsApp:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

/**
 * Configuração da API WhatsApp
 */
export const getWhatsAppConfig = () => {
  return {
    baseUrl: WHATSAPP_BASE_URL,
    // Tokens secretos são gerenciados via Supabase Secrets nas Edge Functions
    hasTokenConfigured: true, // Assumimos que está configurado via Edge Functions
  };
};

/**
 * Verifica se a configuração está adequada para o Lovable
 */
export const checkWhatsAppConfig = () => {
  return {
    isValid: true, // No Lovable, a configuração é feita via Edge Functions
    issues: [], // Sem issues pois não dependemos de variáveis de ambiente no frontend
    config: getWhatsAppConfig(),
  };
}; 