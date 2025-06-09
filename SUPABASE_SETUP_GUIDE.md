# 🔧 Guia de Configuração Supabase - Nina Care

## 📋 **Situação Atual**

✅ **Projeto Supabase**: `rdexapxvljamxrldsyln` (Ninacare)  
✅ **Status**: ACTIVE_HEALTHY  
✅ **Região**: sa-east-1 (São Paulo)  
✅ **Database**: PostgreSQL 15.8  

## 🎯 **O que Configurar para o Sistema Funcionar**

### **1. Autenticação (CRÍTICO)**

#### **A. Configurar Provedores de Auth**
Acesse: https://supabase.com/dashboard/project/rdexapxvljamxrldsyln/auth/providers

**Email/Senha:**
- ✅ Deve estar habilitado
- ✅ Confirmar se "Disable sign-ups" está desabilitado (para permitir novos usuários)

**Google OAuth:**
- ✅ Deve estar habilitado
- ✅ Configurar Client ID e Client Secret do Google Console
- ✅ URLs de redirecionamento:
  - `http://localhost:5173` (desenvolvimento)
  - `https://seudominio.com` (produção)

#### **B. URLs de Redirecionamento**
Acesse: https://supabase.com/dashboard/project/rdexapxvljamxrldsyln/auth/url-configuration

Adicionar:
- `http://localhost:5173` 
- `http://localhost:5173/`
- `https://seudominio.com` (quando fizer deploy)

### **2. Row Level Security (RLS) - ESSENCIAL**

Várias tabelas têm RLS habilitado. Verificar se as políticas estão configuradas:

#### **Tabelas com RLS:**
- `pacientes` ✅ RLS enabled
- `medicos` ✅ RLS enabled  
- `procedimentos` ✅ RLS enabled
- `conversas` ✅ RLS enabled
- `organizacoes` ✅ RLS enabled
- `user_organizations` ✅ RLS enabled

#### **Configurar Políticas RLS:**
Acesse: https://supabase.com/dashboard/project/rdexapxvljamxrldsyln/auth/policies

**Para cada tabela, criar políticas:**
```sql
-- Exemplo para tabela 'profiles'
-- Permitir leitura para usuários autenticados
CREATE POLICY "Enable read access for authenticated users" ON profiles
FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir update do próprio perfil
CREATE POLICY "Enable update for users based on user_id" ON profiles
FOR UPDATE USING (auth.uid() = id);
```

### **3. Edge Functions (Para WhatsApp)**

#### **A. Verificar se as Functions estão deployadas:**
```bash
# Listar functions deployadas
supabase functions list --project-ref rdexapxvljamxrldsyln
```

#### **B. Deploy manual se necessário:**
```bash
supabase functions deploy send-whatsapp-message --project-ref rdexapxvljamxrldsyln
supabase functions deploy whatsapp-qr --project-ref rdexapxvljamxrldsyln
supabase functions deploy whatsapp-status --project-ref rdexapxvljamxrldsyln
supabase functions deploy whatsapp-disconnect --project-ref rdexapxvljamxrldsyln
```

#### **C. Configurar Secrets:**
Acesse: https://supabase.com/dashboard/project/rdexapxvljamxrldsyln/settings/edge-functions

Adicionar:
- **Nome**: `WHATSAPP_API_TOKEN`
- **Valor**: Token da AvisaAPI

### **4. Database Schema - Verificar Estrutura**

#### **Tabelas Principais (já existem):**
- ✅ `profiles` - Perfis de usuários
- ✅ `organizacoes` - Organizações
- ✅ `pacientes` - Pacientes
- ✅ `medicos` - Médicos
- ✅ `procedimentos` - Procedimentos
- ✅ `conversas` - Conversas
- ✅ `user_organizations` - Relacionamento usuário-organização

#### **Verificar Triggers e Functions:**
```sql
-- Verificar se existe trigger para criar profile automaticamente
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

### **5. Problemas Comuns e Soluções**

#### **A. Erro: "Cannot read properties of null"**
**Causa**: RLS bloqueando acesso ou usuário não autenticado
**Solução**: 
1. Verificar se usuário está logado
2. Configurar políticas RLS adequadas

#### **B. Erro: "User not found"**
**Causa**: Profile não foi criado automaticamente após signup
**Solução**: Criar trigger para auto-criação de profile

#### **C. Erro: "Organization not found"**
**Causa**: Usuário não tem organização associada
**Solução**: Criar organização padrão ou processo de onboarding

### **6. SQL Scripts Essenciais**

#### **A. Criar Profile automaticamente após signup:**
```sql
-- Function para criar profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, organizacao_id, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    (SELECT id FROM organizacoes LIMIT 1), -- Organização padrão
    'admin'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

#### **B. Política RLS básica para profiles:**
```sql
-- Permitir usuários verem seus próprios perfis
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Permitir usuários atualizarem seus próprios perfis  
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);
```

## 🚀 **Checklist de Configuração**

### **Para Funcionar Básico:**
- [ ] Google OAuth configurado (Client ID + Secret)
- [ ] URLs de redirecionamento adicionadas
- [ ] Políticas RLS configuradas para `profiles`
- [ ] Trigger de criação de profile funcionando
- [ ] Pelo menos uma organização criada na tabela `organizacoes`

### **Para WhatsApp funcionar:**
- [ ] Edge Functions deployadas
- [ ] `WHATSAPP_API_TOKEN` configurado nas Secrets
- [ ] Token válido da AvisaAPI

### **Para Produção:**
- [ ] URLs de produção configuradas
- [ ] Políticas RLS completas para todas as tabelas
- [ ] Backup e monitoring configurados

## 🔍 **Como Testar se Está Funcionando**

### **1. Teste de Autenticação:**
```bash
npm run dev
# Abrir http://localhost:5173/login
# Tentar login com Google
```

### **2. Teste de Database:**
```sql
-- No SQL Editor do Supabase
SELECT * FROM profiles LIMIT 5;
SELECT * FROM organizacoes LIMIT 5;
```

### **3. Teste de Edge Functions:**
```bash
curl -X POST https://rdexapxvljamxrldsyln.supabase.co/functions/v1/whatsapp-status
```

## 📞 **Suporte**

Se algo não funcionar:
1. Verificar logs no Supabase Dashboard
2. Verificar console do navegador (F12)
3. Verificar se RLS não está bloqueando queries
4. Confirmar se usuário tem organização associada

---

**⚡ Configuração rápida essencial:**
1. Habilitar Google OAuth + URLs
2. Criar organização padrão  
3. Configurar trigger de profile
4. Configurar políticas RLS básicas

**Status**: Pronto para configuração! 🎯 