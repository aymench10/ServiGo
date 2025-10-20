-- ============================================
-- SOLUTION FINALE - EXÉCUTEZ CECI DANS SUPABASE
-- ============================================

-- 1. DÉSACTIVER RLS COMPLÈTEMENT (temporaire)
ALTER TABLE public.provider_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;

-- 2. SUPPRIMER TOUTES LES POLICIES
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'provider_profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.provider_profiles';
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'services') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.services';
    END LOOP;
END $$;

-- 3. CRÉER LE PROFIL PROVIDER POUR VOTRE COMPTE
-- Remplacez 'aymenchebili022@gmail.com' par votre email si différent
DO $$
DECLARE
    v_user_id UUID;
    v_full_name TEXT;
BEGIN
    -- Récupérer l'ID utilisateur
    SELECT id, full_name INTO v_user_id, v_full_name
    FROM public.profiles 
    WHERE email = 'aymenchebili022@gmail.com' AND role = 'provider'
    LIMIT 1;
    
    -- Si l'utilisateur existe et n'a pas de profil provider
    IF v_user_id IS NOT NULL THEN
        INSERT INTO public.provider_profiles (user_id, business_name, service_category, location, description)
        VALUES (
            v_user_id,
            COALESCE(v_full_name, 'Mon Entreprise'),
            'Autre',
            'Tunis',
            'Services professionnels de qualité'
        )
        ON CONFLICT (user_id) DO NOTHING;
        
        RAISE NOTICE 'Profil provider créé pour user_id: %', v_user_id;
    ELSE
        RAISE NOTICE 'Aucun utilisateur provider trouvé avec cet email';
    END IF;
END $$;

-- 4. CRÉER DES POLICIES ULTRA SIMPLES
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Policies pour provider_profiles
CREATE POLICY "allow_all_select_provider_profiles" 
    ON public.provider_profiles FOR SELECT 
    USING (true);

CREATE POLICY "allow_all_insert_provider_profiles" 
    ON public.provider_profiles FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "allow_all_update_provider_profiles" 
    ON public.provider_profiles FOR UPDATE 
    USING (true);

-- Policies pour services
CREATE POLICY "allow_all_select_services" 
    ON public.services FOR SELECT 
    USING (true);

CREATE POLICY "allow_all_insert_services" 
    ON public.services FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "allow_all_update_services" 
    ON public.services FOR UPDATE 
    USING (true);

CREATE POLICY "allow_all_delete_services" 
    ON public.services FOR DELETE 
    USING (true);

-- 5. VÉRIFICATION
SELECT 
    'Profil trouvé' as status,
    p.id as user_id,
    p.email,
    p.full_name,
    pp.id as provider_profile_id,
    pp.business_name
FROM public.profiles p
LEFT JOIN public.provider_profiles pp ON pp.user_id = p.id
WHERE p.role = 'provider'
ORDER BY p.created_at DESC;

-- 6. AFFICHER LES POLICIES ACTIVES
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('provider_profiles', 'services')
ORDER BY tablename, policyname;
