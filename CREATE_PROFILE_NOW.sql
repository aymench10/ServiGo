-- ============================================
-- CRÉER VOTRE PROFIL PROVIDER MAINTENANT
-- Copiez et exécutez dans Supabase SQL Editor
-- ============================================

-- 1. DÉSACTIVER RLS
ALTER TABLE public.provider_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;

-- 2. VOIR VOS INFORMATIONS
SELECT 
    'VOS INFOS' as info,
    id as user_id,
    email,
    full_name,
    role
FROM public.profiles
WHERE role = 'provider'
ORDER BY created_at DESC
LIMIT 1;

-- 3. SUPPRIMER L'ANCIEN PROFIL S'IL EXISTE (pour éviter les doublons)
DELETE FROM public.provider_profiles
WHERE user_id IN (
    SELECT id FROM public.profiles WHERE role = 'provider'
);

-- 4. CRÉER VOTRE PROFIL PROVIDER
INSERT INTO public.provider_profiles (user_id, business_name, service_category, location, description)
SELECT 
    id,
    full_name,
    'Autre',
    'Tunis',
    'Services professionnels de qualité'
FROM public.profiles
WHERE role = 'provider'
ORDER BY created_at DESC
LIMIT 1;

-- 5. VÉRIFIER QUE C'EST CRÉÉ
SELECT 
    'PROFIL CRÉÉ ✅' as status,
    pp.id as provider_profile_id,
    pp.user_id,
    pp.business_name,
    pp.service_category,
    pp.location,
    p.email,
    p.full_name
FROM public.provider_profiles pp
JOIN public.profiles p ON p.id = pp.user_id
WHERE p.role = 'provider';

-- 6. VÉRIFIER RLS
SELECT 
    'RLS STATUS' as info,
    tablename,
    CASE WHEN rowsecurity THEN '❌ ENABLED (problème!)' ELSE '✅ DISABLED (bon!)' END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('provider_profiles', 'services');
