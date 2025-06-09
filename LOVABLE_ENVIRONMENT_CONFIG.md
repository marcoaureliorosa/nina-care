# Configuração de Variáveis no Lovable - Ninacare

## 📋 **Importante: O Lovable não usa arquivos .env**

Diferente de projetos tradicionais, o Lovable gerencia variáveis de ambiente através da integração com Supabase, não através de arquivos `.env`.

## 🔧 **Como configurar variáveis no Lovable:**

### **Para APIs públicas (como URLs base):**
Essas podem ser definidas diretamente no código:
```typescript
const API_URL = "https://www.avisaapi.com.br/api"
```

### **Para chaves secretas (como tokens de API):**
Use a funcionalidade de **Supabase Secrets**:
1. Acesse: **Projeto Supabase** → **Settings** → **Edge Functions** → **Secrets**
2. Adicione suas chaves secretas lá
3. Use em Edge Functions com `Deno.env.get('NOME_DA_SECRET')`

## 🔐 **Configuração do WhatsApp:**

### **1. Token da AvisaAPI (SECRETO)**
- **Local**: Supabase Secrets
- **Nome da variável**: `WHATSAPP_API_TOKEN`
- **Valor**: Seu token Bearer da AvisaAPI
- **Acesso**: Apenas via Edge Functions

### **2. URL base (PÚBLICO)**
- **Local**: Código fonte (`src/lib/whatsapp-api.ts`)
- **Valor**: `"https://www.avisaapi.com.br/api"`
- **Motivo**: URL é pública, pode ficar no código

## 🏗️ **Estrutura implementada:**

```
Frontend (React)
├── src/lib/whatsapp-api.ts (URLs públicas)
└── Chama Edge Functions para operações com token

Edge Functions (Supabase)
├── supabase/functions/send-whatsapp-message/
├── supabase/functions/whatsapp-qr/
├── supabase/functions/whatsapp-status/
└── supabase/functions/whatsapp-disconnect/
    └── Acessam Deno.env.get('WHATSAPP_API_TOKEN')
```

## ⚙️ **Configuração necessária:**

### **1. Configurar token no Supabase:**
```bash
# Via Supabase CLI (se instalado)
supabase secrets set WHATSAPP_API_TOKEN=seu_token_aqui

# Ou via Console Web:
# 1. Acesse https://supabase.com/dashboard
# 2. Vá em Settings → Edge Functions → Secrets
# 3. Adicione: WHATSAPP_API_TOKEN = seu_token_aqui
```

### **2. Deploy das Edge Functions:**
```bash
# Se usando Supabase CLI
supabase functions deploy send-whatsapp-message
supabase functions deploy whatsapp-qr
supabase functions deploy whatsapp-status
supabase functions deploy whatsapp-disconnect
```

## 🚀 **Como usar no código:**

### **Frontend (sem token):**
```typescript
import { sendWhatsAppMessage } from '@/lib/whatsapp-api';

// Função automaticamente chama Edge Function
const result = await sendWhatsAppMessage('+5511999999999', 'Olá!');
```

### **Edge Function (com token):**
```typescript
// Token é acessado automaticamente via Supabase Secrets
const WHATSAPP_API_TOKEN = Deno.env.get('WHATSAPP_API_TOKEN');
```

## ✅ **Benefícios desta abordagem:**

1. **Segurança**: Tokens secretos nunca aparecem no frontend
2. **Simplicidade**: Não há arquivos `.env` para gerenciar
3. **Escalabilidade**: Edge Functions são serverless e auto-escaláveis
4. **Auditoria**: Logs centralizados no Supabase
5. **Versionamento**: Código sem secrets pode ser commitado tranquilamente

## 🔍 **Migração realizada:**

### **Antes (problemático):**
```typescript
// ❌ Não funciona no Lovable
const TOKEN = import.meta.env.VITE_WHATSAPP_API_TOKEN;
```

### **Depois (correto):**
```typescript
// ✅ Frontend chama Edge Function
const result = await fetch('/functions/v1/send-whatsapp-message', {
  method: 'POST',
  body: JSON.stringify({ to, message })
});

// ✅ Edge Function acessa secret
const TOKEN = Deno.env.get('WHATSAPP_API_TOKEN');
```

## 📚 **Arquivos atualizados:**

- ✅ `src/lib/whatsapp-api.ts` - Removidas dependências de .env
- ✅ `src/components/dashboard/DashboardError.tsx` - Corrigido erro TypeScript
- ✅ `supabase/functions/*/index.ts` - Edge Functions criadas
- ✅ Documentação atualizada para práticas do Lovable

---

**Data da migração**: Janeiro 2025  
**Status**: ✅ Pronto para uso  
**Próximo passo**: Configurar `WHATSAPP_API_TOKEN` nas Supabase Secrets 