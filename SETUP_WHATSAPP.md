# INSTRUÇÕES - Configuração WhatsApp

## 🚀 Como configurar o WhatsApp no Nina Care

### 1. Criar arquivo .env
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

### 2. Configurar as variáveis
Edite o arquivo `.env` e substitua os valores:
```env
VITE_WHATSAPP_API_BASE_URL=https://www.avisaapi.com.br/api
VITE_WHATSAPP_API_TOKEN=seu_token_real_aqui
```

### 3. Obter o token da AvisaAPI
- Entre em contato com a AvisaAPI
- Solicite um token Bearer para sua organização
- Substitua `seu_token_real_aqui` pelo token fornecido

### 4. Testar a configuração
1. Execute o projeto: `npm run dev`
2. Acesse Configurações → WhatsApp
3. Se aparecer erro de configuração, verifique o arquivo `.env`

### 5. Conectar WhatsApp
1. Clique em "Gerar QR Code"
2. Escaneie com seu WhatsApp
3. Aguarde confirmação da conexão

⚠️ **IMPORTANTE**: Nunca commit o arquivo `.env` no Git!
