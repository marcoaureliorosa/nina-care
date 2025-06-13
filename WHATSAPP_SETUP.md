# 🚀 Configuração do WhatsApp - Nina Care

## Visão Geral

O Nina Care possui integração completa com WhatsApp para envio e recebimento de mensagens automatizadas. Esta funcionalidade permite que sua organização conecte uma instância do WhatsApp para comunicação automática com pacientes.

## ✅ Funcionalidades Implementadas

### 1. **Gestão de Conexão**
- ✅ Verificação de status da instância em tempo real
- ✅ Geração de QR Code para conexão
- ✅ Monitoramento automático da conexão
- ✅ Tratamento robusto de erros e fallbacks

### 2. **Interface de Usuário**
- ✅ Página dedicada em Configurações → WhatsApp
- ✅ Status visual com cores e ícones intuitivos
- ✅ Instruções passo a passo para conexão
- ✅ Alertas informativos para diferentes estados

### 3. **Edge Functions Otimizadas**
- ✅ `whatsapp-status`: Verifica status da conexão
- ✅ `whatsapp-qr`: Gera QR Code para conexão
- ✅ Múltiplos endpoints de fallback
- ✅ Logs detalhados para debugging
- ✅ Timeouts e retry automático

## 🔧 Configuração Passo a Passo

### 1. **Configurar Secrets no Supabase**

#### Via Console Web (Recomendado):
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto Nina Care
3. Vá em **Settings** → **Edge Functions** → **Secrets**
4. Adicione as seguintes secrets:

```
WHATSAPP_API_TOKEN = seu_token_da_api_aqui
WHATSAPP_INSTANCE_ID = sua_instancia_aqui
```

#### Via CLI (Opcional):
```bash
supabase secrets set WHATSAPP_API_TOKEN=seu_token_aqui
supabase secrets set WHATSAPP_INSTANCE_ID=sua_instancia_aqui
```

### 2. **Obter Credenciais da API**

O sistema suporta múltiplas APIs de WhatsApp:

#### **Z-API (Recomendado)**
- Site: https://z-api.io
- Crie uma conta e obtenha:
  - `WHATSAPP_API_TOKEN`: Token de autenticação
  - `WHATSAPP_INSTANCE_ID`: ID da sua instância

#### **AvisaAPI (Alternativa)**
- Site: https://www.avisaapi.com.br
- Entre em contato para obter credenciais

### 3. **Deploy das Edge Functions**

As Edge Functions já estão no projeto. Para fazer deploy:

```bash
# Deploy todas as funções
supabase functions deploy whatsapp-status
supabase functions deploy whatsapp-qr
supabase functions deploy whatsapp-disconnect
supabase functions deploy send-whatsapp-message
```

### 4. **Testar a Configuração**

1. Execute o projeto: `npm run dev`
2. Acesse **Configurações** → **WhatsApp**
3. Verifique se não há erros de configuração
4. Clique em "Gerar QR Code"
5. Escaneie com seu WhatsApp

## 📱 Como Conectar o WhatsApp

### Passo a Passo:
1. **Gerar QR Code**: Clique no botão "Gerar QR Code"
2. **Abrir WhatsApp**: No seu celular, abra o WhatsApp
3. **Acessar Menu**: Toque nos três pontos (⋮) no canto superior direito
4. **Dispositivos Conectados**: Selecione "Dispositivos conectados"
5. **Conectar Dispositivo**: Toque em "Conectar um dispositivo"
6. **Escanear QR**: Escaneie o QR Code exibido na tela
7. **Aguardar**: Aguarde a confirmação da conexão

## 🔍 Estados da Interface

### 🟢 **Conectado**
- Badge verde com ícone ✅
- Mensagem: "Conexão ativa - Mensagens sendo enviadas automaticamente"
- QR Code não é exibido

### 🔴 **Desconectado**
- Badge vermelho com ícone ❌
- Botão "Gerar QR Code" disponível
- Instruções de conexão visíveis

### 🟡 **Não Configurado**
- Badge amarelo com ícone ⚠️
- Alerta com instruções de configuração
- Botões desabilitados

### 🟠 **Serviço Indisponível**
- Badge laranja com ícone 📶
- Mensagem: "Serviço temporariamente indisponível"
- Sugestão para tentar novamente

## 🛠️ Troubleshooting

### **Erro: "Configuração do WhatsApp incompleta"**
**Solução**: Configure os secrets `WHATSAPP_API_TOKEN` e `WHATSAPP_INSTANCE_ID` no Supabase.

### **Erro: "Serviço temporariamente indisponível"**
**Possíveis causas**:
- API externa fora do ar
- Token inválido ou expirado
- Problemas de rede

**Soluções**:
1. Verifique se o token está correto
2. Aguarde alguns minutos e tente novamente
3. Verifique os logs das Edge Functions

### **QR Code não aparece**
**Soluções**:
1. Verifique a configuração dos secrets
2. Verifique os logs do navegador (F12)
3. Tente atualizar a página

### **Conexão não persiste**
**Possíveis causas**:
- WhatsApp desconectado manualmente
- Token da API expirado
- Problemas na API externa

## 📊 Logs e Monitoramento

### **Logs das Edge Functions**
Para visualizar logs detalhados:
```bash
supabase functions logs whatsapp-status
supabase functions logs whatsapp-qr
```

### **Logs do Frontend**
Abra o DevTools (F12) e verifique:
- Console: Erros JavaScript
- Network: Requisições para as Edge Functions

## 🔒 Segurança

### **Boas Práticas**:
- ✅ Tokens armazenados como Supabase Secrets (não em código)
- ✅ CORS configurado adequadamente
- ✅ Timeouts para evitar requisições infinitas
- ✅ Validação de entrada nas Edge Functions

### **Não Fazer**:
- ❌ Nunca commitar tokens no código
- ❌ Não compartilhar tokens publicamente
- ❌ Não usar tokens em desenvolvimento para produção

## 🚀 Próximos Passos

Após configurar o WhatsApp, você pode:

1. **Enviar Mensagens**: Use a API para enviar mensagens automáticas
2. **Receber Webhooks**: Configure webhooks para receber mensagens
3. **Automações**: Integre com fluxos de trabalho da clínica
4. **Relatórios**: Monitore métricas de envio e entrega

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** das Edge Functions
2. **Consulte esta documentação** para soluções comuns
3. **Verifique a configuração** dos secrets no Supabase
4. **Entre em contato** com o suporte técnico se necessário

---

**Última atualização**: Dezembro 2024  
**Versão**: 2.0 - Edge Functions Otimizadas 