import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { 
  generateWhatsAppQR, 
  checkWhatsAppStatus, 
  sendWhatsAppMessage,
  disconnectWhatsApp,
  checkWhatsAppConfig,
  WhatsAppApiResponse,
  WhatsAppConnectionStatus
} from "@/lib/whatsapp-api";

interface WhatsAppStatus {
  status: string | number | boolean;
  instance?: string;
  error?: string;
  data?: {
    code?: number;
    error?: string;
    success?: boolean;
  };
}

interface WhatsAppQRCode {
  status?: boolean;
  data?: {
    success?: boolean;
    message?: string;
    qrcode?: string;
  };
  error?: string;
}

export const useWhatsApp = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Hook para buscar o status da instância
  const useInstanceStatus = () => {
    return useQuery({
      queryKey: ['whatsapp-status', user?.id],
      queryFn: async (): Promise<WhatsAppConnectionStatus> => {
        try {
          const data = await checkWhatsAppStatus();
          return data;
        } catch (error) {
          console.error('Erro ao buscar status do WhatsApp:', error);
          return {
            connected: false,
            lastCheck: new Date(),
          };
        }
      },
      enabled: !!user?.id,
      retry: 2
    });
  };

  // Hook para buscar o QR Code
  const useQRCode = () => {
    return useQuery({
      queryKey: ['whatsapp-qr', user?.id],
      queryFn: async (): Promise<WhatsAppApiResponse> => {
        try {
          const data = await generateWhatsAppQR();
          return data;
        } catch (error) {
          console.error('Erro ao buscar QR Code do WhatsApp:', error);
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          };
        }
      },
      enabled: false, // Só buscar quando solicitado manualmente
      retry: 1
    });
  };

  // Function para refresh do QR Code
  const refreshQRCode = () => {
    queryClient.invalidateQueries({ queryKey: ['whatsapp-qr'] });
  };

  // Mutation para verificar status manualmente
  const checkStatus = useMutation({
    mutationFn: async (): Promise<WhatsAppConnectionStatus> => {
      try {
        const data = await checkWhatsAppStatus();
        return data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Erro ao verificar status');
      }
    },
    onSuccess: () => {
      // Invalidar cache do status
      queryClient.invalidateQueries({ queryKey: ['whatsapp-status'] });
    }
  });

  // Mutation para enviar mensagem
  const sendMessage = useMutation({
    mutationFn: async ({ to, message }: { to: string; message: string }): Promise<WhatsAppApiResponse> => {
      try {
        const data = await sendWhatsAppMessage(to, message);
        return data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Erro ao enviar mensagem');
      }
    }
  });

  // Mutation para desconectar
  const disconnect = useMutation({
    mutationFn: async (): Promise<WhatsAppApiResponse> => {
      try {
        const data = await disconnectWhatsApp();
        return data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Erro ao desconectar');
      }
    },
    onSuccess: () => {
      // Invalidar cache do status após desconectar
      queryClient.invalidateQueries({ queryKey: ['whatsapp-status'] });
    }
  });

  // Verificar configuração
  const getConfig = () => {
    return checkWhatsAppConfig();
  };

  return {
    useInstanceStatus,
    useQRCode,
    refreshQRCode,
    checkStatus,
    sendMessage,
    disconnect,
    getConfig
  };
}; 