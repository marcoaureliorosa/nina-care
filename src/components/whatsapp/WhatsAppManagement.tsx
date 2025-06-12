
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
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WhatsAppManagement = () => {
  const { toast } = useToast();
  const [showQRCode, setShowQRCode] = useState(false);
  const { useInstanceStatus, useQRCode, refreshQRCode, checkStatus } = useWhatsApp();

  // Buscar status da instância
  const statusQuery = useInstanceStatus();
  const qrQuery = useQRCode();

  const getStatusColor = (statusData: any) => {
    if (statusData?.data?.success === true || statusData?.connected === true) {
      return 'bg-green-100 text-green-800 border-green-200';
    }

    if (statusData?.data?.error || statusData?.data?.code === 500 || statusData?.error) {
      return 'bg-red-100 text-red-800 border-red-200';
    }

    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (statusData: any) => {
    if (statusData?.data?.success === true || statusData?.connected === true) {
      return <CheckCircle2 className="w-4 h-4" />;
    }

    if (statusData?.data?.error || statusData?.data?.code === 500 || statusData?.error) {
      return <XCircle className="w-4 h-4" />;
    }

    return <AlertCircle className="w-4 h-4" />;
  };

  const getStatusText = (statusData: any) => {
    if (statusData?.data?.success === true || statusData?.connected === true) {
      return 'Conectado';
    }

    if (statusData?.data?.error) {
      switch (statusData.data.error.toLowerCase()) {
        case 'no session':
        case 'no configuration':
          return 'Não configurado';
        case 'disconnected':
          return 'Desconectado';
        default:
          return `Erro: ${statusData.data.error}`;
      }
    }

    if (statusData?.error) {
      return `Erro: ${statusData.error}`;
    }

    if (statusData?.data?.code === 500) {
      return 'Desconectado (Erro 500)';
    }

    if (statusQuery.isLoading) {
      return 'Verificando...';
    }

    return 'Status Indefinido';
  };

  const handleGenerateQR = async () => {
    try {
      setShowQRCode(true);
      refreshQRCode();
      const result = await qrQuery.refetch();
      
      if (result.data?.data?.success) {
        toast({
          title: "QR Code gerado com sucesso!",
          description: "Escaneie o código com seu WhatsApp para conectar.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao gerar QR Code",
          description: result.data?.data?.message || result.data?.error || "Erro desconhecido",
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
        toast({
          title: "Status atualizado",
          description: `Status atual: ${getStatusText(result)}`,
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

  const isConnected = statusQuery.data?.data?.success === true || statusQuery.data?.connected === true;

  // Check for configuration issues
  const hasConfigurationError = statusQuery.data?.data?.error === 'no configuration' || 
                                statusQuery.data?.error?.includes('Configuração do WhatsApp incompleta');

  return (
    <div className="space-y-6">
      {/* Configuration Warning */}
      {hasConfigurationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Configuração do WhatsApp incompleta</p>
              <p className="text-sm">
                Configure os secrets Z_API_TOKEN e Z_API_INSTANCE nas configurações do projeto Supabase para usar esta funcionalidade.
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
              disabled={checkStatus.isPending}
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
            {statusQuery.isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Verificando status...</span>
              </div>
            ) : statusQuery.error ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Não foi possível verificar o status</p>
                    <p className="text-sm">Verifique a configuração ou tente novamente.</p>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(statusQuery.data)}>
                  {getStatusIcon(statusQuery.data)}
                  <span className="ml-2">{getStatusText(statusQuery.data)}</span>
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
                {isConnected 
                  ? "✅ Conexão ativa - Mensagens sendo enviadas automaticamente" 
                  : "❌ Conecte seu WhatsApp escaneando o QR Code para ativar o envio de mensagens"
                }
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isConnected ? (
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
                    disabled={qrQuery.isFetching || hasConfigurationError}
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

                {showQRCode && !isConnected && (
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
                    ) : qrQuery.data ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          QR Code não encontrado na resposta da API. Tente novamente.
                        </AlertDescription>
                      </Alert>
                    ) : null}
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
