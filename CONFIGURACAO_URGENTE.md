# 🚨 CONFIGURAÇÃO URGENTE - SUPABASE

## ⚡ **PASSOS OBRIGATÓRIOS PARA O SISTEMA FUNCIONAR**

### **1. SCRIPTS SQL JÁ APLICADOS ✅**
- ✅ Função `handle_new_user()` criada
- ✅ Trigger para criar profile automaticamente
- ✅ Políticas RLS ajustadas para todas as tabelas
- ✅ Organização padrão garantida
- ✅ Funções auxiliares de auth criadas
- ✅ Políticas para organizações, user_organizations, pacientes, conversas

**🎯 TODAS AS CONFIGURAÇÕES DE DATABASE FORAM APLICADAS AUTOMATICAMENTE!**

### **2. CONFIGURAR NO DASHBOARD SUPABASE (SÓ ISSO FALTA!)**

#### **A. Autenticação - Google OAuth**
🔗 **Link direto**: https://supabase.com/dashboard/project/rdexapxvljamxrldsyln/auth/providers

**Passos:**
1. Clicar em "Google" 
2. Habilitar o provider
3. Adicionar:
   - **Client ID**: (do Google Console)
   - **Client Secret**: (do Google Console)

#### **B. URLs de Redirecionamento**
🔗 **Link direto**: https://supabase.com/dashboard/project/rdexapxvljamxrldsyln/auth/url-configuration

**Adicionar essas URLs:**
```
http://localhost:8080
http://localhost:8080/
```
*(O projeto está rodando na porta 8080)*

#### **C. Verificar Email/Senha**
🔗 **Link direto**: https://supabase.com/dashboard/project/rdexapxvljamxrldsyln/auth/providers

**Confirmar:**
- ✅ Email provider habilitado
- ✅ "Disable sign-ups" = **DESABILITADO** (permitir novos usuários)

### **3. PARA WHATSAPP FUNCIONAR (OPCIONAL AGORA)**

#### **A. Edge Functions Secrets**
🔗 **Link direto**: https://supabase.com/dashboard/project/rdexapxvljamxrldsyln/settings/edge-functions

**Adicionar secret:**
- **Nome**: `WHATSAPP_API_TOKEN`
- **Valor**: [Seu token da AvisaAPI]

#### **B. Deploy das Functions (se necessário)**
```bash
# Executar no terminal:
npx supabase functions deploy send-whatsapp-message --project-ref rdexapxvljamxrldsyln
npx supabase functions deploy whatsapp-qr --project-ref rdexapxvljamxrldsyln
npx supabase functions deploy whatsapp-status --project-ref rdexapxvljamxrldsyln
npx supabase functions deploy whatsapp-disconnect --project-ref rdexapxvljamxrldsyln
```

## 🎯 **TESTE IMEDIATO**

### **Após configurar Google OAuth:**
1. Abrir: http://localhost:8080/login
2. Clicar em "Entrar com Google"
3. Fazer login com conta Google
4. Verificar se:
   - Login funciona
   - Profile é criado automaticamente
   - Dashboard carrega sem erros

## 🔥 **PROBLEMAS COMUNS**

### **❌ "Session not found" ou "User not found"**
**Causa**: Google OAuth não configurado  
**Solução**: Configurar Client ID + Secret no link acima

### **❌ "Cannot read properties of null"**
**Causa**: RLS bloqueando ou profile não criado  
**Solução**: ✅ **JÁ RESOLVIDO** - Trigger configurado automaticamente

### **❌ "Organização não encontrada"**
**Causa**: Usuário sem organização  
**Solução**: ✅ **JÁ RESOLVIDO** - Organização padrão criada automaticamente

## 📋 **STATUS ATUAL**

### **✅ CONFIGURADO AUTOMATICAMENTE:**
- ✅ Database schema completo
- ✅ Triggers para auto-criação de profile
- ✅ Políticas RLS configuradas para todas as tabelas
- ✅ Funções auxiliares de autenticação
- ✅ Organização padrão criada
- ✅ Edge Functions criadas (código)
- ✅ Sistema de permissões baseado em organização

### **⚠️ FALTA CONFIGURAR (APENAS NO DASHBOARD):**
- Google OAuth (Client ID + Secret)
- URLs de redirecionamento
- Token do WhatsApp (opcional)

## 🚀 **PRIORIDADE MÁXIMA**

**1º** → Configurar Google OAuth  
**2º** → Adicionar URLs de redirecionamento  
**3º** → Testar login  

**Tempo estimado**: 3 minutos

---

**🎯 Projeto rodando em: http://localhost:8080**  
**🎯 Após configurar OAuth, o sistema funcionará 100%!** 