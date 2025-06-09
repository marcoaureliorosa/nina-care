# INSTRUÇÕES - Configuração WhatsApp (Lovable)

## 🚀 Como configurar o WhatsApp no Nina Care

### ⚠️ IMPORTANTE: Lovable não usa arquivos .env

Este projeto usa **Supabase Secrets** para gerenciar tokens secretos, não arquivos `.env`.

### 1. Configurar token no Supabase Secrets

#### Via Console Web (Recomendado):
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto Nina Care
3. Vá em **Settings** → **Edge Functions** → **Secrets**
4. Adicione uma nova secret:
   - **Nome**: `WHATSAPP_API_TOKEN`
   - **Valor**: Seu token Bearer da AvisaAPI

#### Via CLI (Opcional):
```bash
# Se você tem o Supabase CLI instalado
supabase secrets set WHATSAPP_API_TOKEN=seu_token_real_aqui
```

### 2. Obter o token da AvisaAPI
- Entre em contato com a AvisaAPI
- Solicite um token Bearer para sua organização
- Use este token na configuração acima

### 3. Deploy das Edge Functions

As Edge Functions já estão criadas no projeto:
- `supabase/functions/send-whatsapp-message/`
- `supabase/functions/whatsapp-qr/`
- `supabase/functions/whatsapp-status/`
- `supabase/functions/whatsapp-disconnect/`

#### Deploy via CLI:
```bash
supabase functions deploy send-whatsapp-message
supabase functions deploy whatsapp-qr
supabase functions deploy whatsapp-status
supabase functions deploy whatsapp-disconnect
```

### 4. Testar a configuração
1. Execute o projeto: `npm run dev`
2. Acesse Configurações → WhatsApp
3. As Edge Functions automaticamente:
   - ✅ Verificam se o token está configurado
   - ⚠️ Mostram erro se falta configuração
   - 🔒 Adicionam headers de autenticação nas requisições

### 5. Conectar WhatsApp
1. Clique em "Gerar QR Code"
2. Escaneie com seu WhatsApp
3. Aguarde confirmação da conexão

## 🏗️ Como funciona no Lovable:

### Frontend → Edge Functions → AvisaAPI
```
React App (nina-care)
├── Chama /functions/v1/whatsapp-qr
└── Edge Function acessa Deno.env.get('WHATSAPP_API_TOKEN')
    └── Faz requisição autenticada para AvisaAPI
```

## ✅ Benefícios desta abordagem:

1. **🔒 Segurança**: Token nunca aparece no frontend
2. **🚀 Serverless**: Edge Functions são auto-escaláveis
3. **📊 Logs**: Centralizados no Supabase
4. **🔄 Versionamento**: Código sem secrets pode ser commitado
5. **🌍 CORS**: Edge Functions lidam com CORS automaticamente

## 🔧 Troubleshooting:

### Erro: "Token não configurado"
- Verifique se `WHATSAPP_API_TOKEN` está nas Supabase Secrets
- Confirme que as Edge Functions foram deployadas

### Erro: "Function not found"
- Execute o deploy das Edge Functions
- Verifique se está chamando a URL correta: `/functions/v1/nome-da-funcao`

### Erro de CORS
- As Edge Functions já incluem headers CORS
- Verifique se está fazendo requisições para o domínio correto

---

**✅ Migração completa para Lovable realizada!**  
**🔗 Documentação completa**: [LOVABLE_ENVIRONMENT_CONFIG.md](./LOVABLE_ENVIRONMENT_CONFIG.md)
