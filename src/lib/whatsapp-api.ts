// Configurações e utilitários para a API do WhatsApp (AvisaAPI)

const WHATSAPP_BASE_URL = import.meta.env.VITE_WHATSAPP_API_BASE_URL || "https://www.avisaapi.com.br/api";
const WHATSAPP_API_TOKEN = import.meta.env.VITE_WHATSAPP_API_TOKEN;

/**
 * Cria headers padrão para requisições da API do WhatsApp
 */
export const createWhatsAppHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (WHATSAPP_API_TOKEN) {
    headers['Authorization'] = `Bearer ${WHATSAPP_API_TOKEN}`;
  } else {
    console.warn('VITE_WHATSAPP_API_TOKEN não configurado. Requisições podem falhar.');
  }

  return headers;
};

/**
 * Faz uma requisição para a API do WhatsApp
 */
export const whatsappApiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${WHATSAPP_BASE_URL}${endpoint}`;
  const defaultHeaders = createWhatsAppHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro na API WhatsApp: ${response.statusText} (${response.status})`);
  }

  return response.json();
};

/**
 * Verifica se as variáveis de ambiente estão configuradas
 */
export const checkWhatsAppConfig = () => {
  const issues: string[] = [];

  if (!WHATSAPP_BASE_URL) {
    issues.push('VITE_WHATSAPP_API_BASE_URL não configurada');
  }

  if (!WHATSAPP_API_TOKEN) {
    issues.push('VITE_WHATSAPP_API_TOKEN não configurada');
  }

  return {
    isValid: issues.length === 0,
    issues,
    config: {
      baseUrl: WHATSAPP_BASE_URL,
      hasToken: !!WHATSAPP_API_TOKEN,
    }
  };
}; 