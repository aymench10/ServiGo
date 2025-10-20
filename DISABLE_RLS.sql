-- ============================================
-- DÉSACTIVER RLS COMPLÈTEMENT
-- Pour le développement uniquement
-- ============================================

-- Désactiver RLS sur toutes les tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites DISABLE ROW LEVEL SECURITY;

-- Créer le profil provider pour TOUS les utilisateurs provider qui n'en ont pas
INSERT INTO public.provider_profiles (user_id, business_name, service_category, location, description)
SELECT 
    p.id,
    p.full_name,
    'Autre',
    'Tunis',
    'Services professionnels'
FROM public.profiles p
WHERE p.role = 'provider'
AND NOT EXISTS (
    SELECT 1 FROM public.provider_profiles pp WHERE pp.user_id = p.id
);

-- Vérifier les résultats
SELECT 
    'Utilisateurs provider' as type,
    COUNT(*) as count
FROM public.profiles 
WHERE role = 'provider';

SELECT 
    'Profils provider créés' as type,
    COUNT(*) as count
FROM public.provider_profiles;

SELECT 
    'RLS Status' as info,
    'profiles: ' || CASE WHEN relrowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as profiles_rls,
    'provider_profiles: ' || (SELECT CASE WHEN relrowsecurity THEN 'ENABLED' ELSE 'DISABLED' END FROM pg_class WHERE relname = 'provider_profiles') as provider_profiles_rls,
    'services: ' || (SELECT CASE WHEN relrowsecurity THEN 'ENABLED' ELSE 'DISABLED' END FROM pg_class WHERE relname = 'services') as services_rls
FROM pg_class 
WHERE relname = 'profiles';
