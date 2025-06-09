-- ⚡ SCRIPTS DE CONFIGURAÇÃO SUPABASE - NINA CARE
-- Execute esses scripts no SQL Editor do Supabase Dashboard

-- =============================================================================
-- 1. CRIAR FUNÇÃO PARA AUTO-CRIAÇÃO DE PROFILE APÓS SIGNUP
-- =============================================================================

-- Função para criar profile automaticamente após novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    org_id uuid;
BEGIN
    -- Buscar ID da primeira organização (ou criar uma padrão)
    SELECT id INTO org_id FROM organizacoes LIMIT 1;
    
    -- Se não existe organização, criar uma padrão
    IF org_id IS NULL THEN
        INSERT INTO organizacoes (nome, email, telefone)
        VALUES ('Organização Padrão', 'admin@ninacare.com', '11999999999')
        RETURNING id INTO org_id;
    END IF;
    
    -- Criar profile para o novo usuário
    INSERT INTO public.profiles (
        id, 
        nome, 
        email, 
        organizacao_id, 
        role,
        is_active,
        email_confirmed_at
    )
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', 
                new.raw_user_meta_data->>'full_name',
                split_part(new.email, '@', 1)),
        new.email,
        org_id,
        'admin',
        true,
        CASE WHEN new.email_confirmed_at IS NOT NULL THEN now() ELSE NULL END
    );
    
    -- Criar relacionamento user-organization
    INSERT INTO user_organizations (user_id, organizacao_id, role, is_primary)
    VALUES (new.id, org_id, 'admin', true);
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar após criação de usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 2. MELHORAR POLÍTICAS RLS PARA PROFILES (mais permissivas para desenvolvimento)
-- =============================================================================

-- Remover políticas existentes que podem estar muito restritivas
DROP POLICY IF EXISTS "safe_admin_select_profiles" ON profiles;
DROP POLICY IF EXISTS "safe_admin_update_profiles" ON profiles;
DROP POLICY IF EXISTS "safe_admin_insert_profiles" ON profiles;

-- Criar políticas mais permissivas para desenvolvimento
CREATE POLICY "Enable read for authenticated users" ON profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- =============================================================================
-- 3. POLÍTICAS RLS PARA ORGANIZAÇÕES
-- =============================================================================

-- Permitir leitura para usuários autenticados
CREATE POLICY "Enable read for authenticated users" ON organizacoes
    FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir update para admins
CREATE POLICY "Enable update for admins" ON organizacoes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.organizacao_id = organizacoes.id 
            AND profiles.role = 'admin'
        )
    );

-- =============================================================================
-- 4. POLÍTICAS RLS PARA USER_ORGANIZATIONS
-- =============================================================================

-- Permitir leitura para usuários autenticados
CREATE POLICY "Enable read for authenticated users" ON user_organizations
    FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir update para próprio usuário
CREATE POLICY "Enable update for own record" ON user_organizations
    FOR UPDATE USING (auth.uid() = user_id);

-- =============================================================================
-- 5. VERIFICAR/CRIAR ORGANIZAÇÃO PADRÃO
-- =============================================================================

-- Garantir que existe pelo menos uma organização
INSERT INTO organizacoes (nome, email, telefone, endereco)
SELECT 'Nina Care - Organização Padrão', 'admin@ninacare.com', '11999999999', 'São Paulo, SP'
WHERE NOT EXISTS (SELECT 1 FROM organizacoes);

-- =============================================================================
-- 6. FUNÇÕES AUXILIARES PARA AUTH
-- =============================================================================

-- Função para verificar se usuário está autenticado
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS boolean AS $$
BEGIN
    RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter organização do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_organization()
RETURNS uuid AS $$
DECLARE
    org_id uuid;
BEGIN
    SELECT organizacao_id INTO org_id
    FROM profiles
    WHERE id = auth.uid();
    
    RETURN org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 7. POLÍTICAS BÁSICAS PARA OUTRAS TABELAS IMPORTANTES
-- =============================================================================

-- PACIENTES - Permitir acesso baseado na organização
DROP POLICY IF EXISTS "Enable access based on organization" ON pacientes;
CREATE POLICY "Enable access based on organization" ON pacientes
    FOR ALL USING (
        organizacao_id = public.get_user_organization() OR
        auth.role() = 'service_role'
    );

-- CONVERSAS - Permitir acesso baseado no paciente da organização
DROP POLICY IF EXISTS "Enable access based on organization" ON conversas;
CREATE POLICY "Enable access based on organization" ON conversas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM pacientes 
            WHERE pacientes.id = conversas.paciente_id 
            AND pacientes.organizacao_id = public.get_user_organization()
        ) OR auth.role() = 'service_role'
    );

-- =============================================================================
-- 8. CONFIGURAÇÕES FINAIS
-- =============================================================================

-- Atualizar tabela profiles para não ter RLS forçado (temporariamente para debug)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Garantir que a função is_admin_user existe (se usada em políticas)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- VERIFICAÇÕES FINAIS
-- =============================================================================

-- Verificar se tudo foi criado corretamente
SELECT 'Funções criadas:' as status;
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('handle_new_user', 'is_authenticated', 'get_user_organization', 'is_admin_user');

SELECT 'Triggers criados:' as status;
SELECT trigger_name, event_object_table FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

SELECT 'Organizações disponíveis:' as status;
SELECT id, nome FROM organizacoes;

SELECT 'Políticas RLS criadas:' as status;
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'organizacoes', 'user_organizations', 'pacientes', 'conversas'); 