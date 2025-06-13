import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { 
  MessageCircle, 
  QrCode, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  Wifi,
  WifiOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WhatsAppManagement = () => {
  const { toast } = useToast();
  const [showQRCode, setShowQRCode] = useState(false);
  const { useInstanceStatus, useQRCode, refreshQRCode, checkStatus } = useWhatsApp();

  // Buscar status da instância
  const statusQuery = useInstanceStatus();
  const qrQuery = useQRCode();

  const getStatusInfo = (statusData: any) => {
    // Verificar se há erro de configuração
    if (statusData?.data?.error === 'no configuration' || 
        statusData?.error?.includes('Configuração do WhatsApp incompleta') ||
        statusData?.message?.includes('Configure WHATSAPP_API_TOKEN')) {
      return {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <AlertCircle className="w-4 h-4" />,
        text: 'Não Configurado',
        isConfigError: true
      };
    }

    // Verificar se está conectado
    if (statusData?.data?.success === true && statusData?.data?.connected === true) {
      return {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle2 className="w-4 h-4" />,
        text: 'Conectado',
        isConnected: true
      };
    }

    // Verificar se há erro de serviço
    if (statusData?.data?.error === 'service unavailable' || 
        statusData?.error?.includes('temporariamente indisponível')) {
      return {
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: <WifiOff className="w-4 h-4" />,
        text: 'Serviço Indisponível',
        isServiceError: true
      };
    }

    // Verificar se está desconectado
    if (statusData?.data?.connected === false || statusData?.data?.success === false) {
      return {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="w-4 h-4" />,
        text: 'Desconectado',
        isDisconnected: true
      };
    }

    // Estado de carregamento
    if (statusQuery.isLoading) {
      return {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        text: 'Verificando...',
        isLoading: true
      };
    }

    // Estado padrão
    return {
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: <AlertCircle className="w-4 h-4" />,
      text: 'Status Indefinido',
      isUnknown: true
    };
  };

  const statusInfo = getStatusInfo(statusQuery.data);

  const handleGenerateQR = async () => {
    try {
      setShowQRCode(true);
      refreshQRCode();
      const result = await qrQuery.refetch();
      
      if (result.data?.data?.success && result.data?.data?.qrcode) {
        toast({
          title: "QR Code gerado com sucesso!",
          description: "Escaneie o código com seu WhatsApp para conectar.",
        });
             } else if (result.data?.error?.includes('no configuration')) {
         toast({
           variant: "destructive",
           title: "Configuração necessária",
           description: "Configure o token do WhatsApp nas configurações do Supabase.",
         });
       } else {
         toast({
           variant: "destructive",
           title: "Erro ao gerar QR Code",
           description: result.data?.error || "Erro desconhecido",
         });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao gerar QR Code",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  const handleCheckStatus = async () => {
    try {
      const result = await checkStatus.mutateAsync();
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Erro ao verificar status",
          description: result.error,
        });
      } else {
        const statusInfo = getStatusInfo(result);
        toast({
          title: "Status atualizado",
          description: `Status atual: ${statusInfo.text}`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao verificar status",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Warning */}
      {statusInfo.isConfigError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Configuração do WhatsApp incompleta</p>
              <p className="text-sm">
                Configure os secrets WHATSAPP_API_TOKEN e WHATSAPP_INSTANCE_ID nas configurações do projeto Supabase para usar esta funcionalidade.
              </p>
              <div className="mt-3 p-3 bg-muted/50 rounded-md">
                <p className="text-xs font-mono">
                  1. Acesse: Supabase Dashboard → Settings → Edge Functions → Secrets<br/>
                  2. Adicione: WHATSAPP_API_TOKEN = seu_token_aqui<br/>
                  3. Adicione: WHATSAPP_INSTANCE_ID = sua_instancia_aqui
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Service Error Warning */}
      {statusInfo.isServiceError && (
        <Alert>
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Serviço temporariamente indisponível</p>
              <p className="text-sm">
                Não foi possível conectar com o serviço do WhatsApp. Tente novamente em alguns minutos.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Status da Instância WhatsApp</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Status atual da conexão do agente
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCheckStatus}
              disabled={checkStatus.isPending || statusInfo.isConfigError}
            >
              {checkStatus.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusQuery.error ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Erro ao verificar status</p>
                    <p className="text-sm">Verifique a configuração ou tente novamente.</p>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex items-center gap-4">
                <Badge className={statusInfo.color}>
                  {statusInfo.icon}
                  <span className="ml-2">{statusInfo.text}</span>
                </Badge>
                                 {statusQuery.data?.instance && (
                   <span className="text-sm text-muted-foreground">
                     Instância: {statusQuery.data.instance}
                   </span>
                 )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* QR Code Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <QrCode className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Conexão WhatsApp</CardTitle>
              <p className="text-sm text-muted-foreground">
                {statusInfo.isConnected 
                  ? "✅ Conexão ativa - Mensagens sendo enviadas automaticamente" 
                  : "❌ Conecte seu WhatsApp escaneando o QR Code para ativar o envio de mensagens"
                }
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusInfo.isConnected ? (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">WhatsApp conectado com sucesso! ✅</p>
                    <p>O agente está ativo e pode enviar e receber mensagens automaticamente.</p>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">WhatsApp não conectado</p>
                      <p>Para ativar o envio de mensagens, conecte sua conta do WhatsApp.</p>
                    </div>
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleGenerateQR}
                    disabled={qrQuery.isFetching || statusInfo.isConfigError}
                    className="flex items-center gap-2"
                  >
                    {qrQuery.isFetching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <QrCode className="w-4 h-4" />
                    )}
                    {qrQuery.isFetching ? 'Gerando...' : 'Gerar QR Code'}
                  </Button>
                </div>

                {showQRCode && !statusInfo.isConnected && (
                  <div className="space-y-4 pt-4">
                    {qrQuery.isLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="ml-2">Carregando QR Code...</span>
                      </div>
                    ) : qrQuery.error ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Erro ao carregar QR Code: {qrQuery.error.message}
                        </AlertDescription>
                      </Alert>
                    ) : qrQuery.data?.error ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {qrQuery.data.error}
                        </AlertDescription>
                      </Alert>
                    ) : qrQuery.data?.data?.qrcode ? (
                      <div className="space-y-4">
                        <div className="flex justify-center p-4 bg-white rounded-lg border">
                          <img 
                            src={qrQuery.data.data.qrcode} 
                            alt="QR Code WhatsApp"
                            className="max-w-[200px] max-h-[200px]"
                          />
                        </div>
                        <Alert>
                          <QrCode className="h-4 w-4" />
                          <AlertDescription>
                            <div className="space-y-2">
                              <p className="font-medium">QR Code gerado com sucesso!</p>
                              <p>1. Abra o WhatsApp no seu celular</p>
                              <p>2. Vá em "Dispositivos conectados"</p>
                              <p>3. Toque em "Conectar um dispositivo"</p>
                              <p>4. Escaneie este QR Code</p>
                            </div>
                          </AlertDescription>
                        </Alert>
                      </div>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          QR Code não encontrado na resposta da API. Tente novamente.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Como conectar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Clique em "Gerar QR Code" acima</p>
            <p>2. Abra o WhatsApp no seu celular</p>
            <p>3. Toque nos três pontos (menu) no canto superior direito</p>
            <p>4. Selecione "Dispositivos conectados"</p>
            <p>5. Toque em "Conectar um dispositivo"</p>
            <p>6. Escaneie o QR Code exibido na tela</p>
            <p>7. Aguarde a confirmação da conexão</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppManagement;
