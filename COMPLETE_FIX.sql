-- ============================================
-- SOLUTION COMPLÈTE - TOUT RÉPARER
-- Exécutez ce script dans Supabase SQL Editor
-- ============================================

-- ÉTAPE 1: Nettoyer tout
-- ============================================
DELETE FROM public.services;
DELETE FROM public.bookings;
DELETE FROM public.reviews;
DELETE FROM public.favorites;
DELETE FROM public.provider_profiles;

-- ÉTAPE 2: Désactiver RLS (pour le développement)
-- ============================================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites DISABLE ROW LEVEL SECURITY;

-- ÉTAPE 3: Créer les profils provider pour TOUS les utilisateurs provider
-- ============================================
INSERT INTO public.provider_profiles (user_id, business_name, service_category, location, description)
SELECT 
    p.id,
    COALESCE(p.full_name, 'Mon Entreprise'),
    'Autre',
    'Tunis',
    'Services professionnels de qualité'
FROM public.profiles p
WHERE p.role = 'provider'
AND NOT EXISTS (
    SELECT 1 FROM public.provider_profiles pp WHERE pp.user_id = p.id
);

-- ÉTAPE 4: Vérification complète
-- ============================================
-- Voir tous les utilisateurs provider
SELECT 
    'Utilisateurs Provider' as info,
    p.id as user_id,
    p.email,
    p.full_name,
    p.role
FROM public.profiles p
WHERE p.role = 'provider';

-- Voir tous les profils provider créés
SELECT 
    'Profils Provider Créés' as info,
    pp.id as provider_profile_id,
    pp.user_id,
    pp.business_name,
    pp.service_category,
    pp.location,
    p.email
FROM public.provider_profiles pp
JOIN public.profiles p ON p.id = pp.user_id;

-- Vérifier le statut RLS
SELECT 
    'RLS Status' as info,
    schemaname,
    tablename,
    CASE WHEN rowsecurity THEN 'ENABLED ❌' ELSE 'DISABLED ✅' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'provider_profiles', 'services', 'bookings', 'reviews', 'favorites')
ORDER BY tablename;

-- Compter les résultats
SELECT 
    'Résumé' as info,
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'provider') as total_providers,
    (SELECT COUNT(*) FROM public.provider_profiles) as profiles_created,
    (SELECT COUNT(*) FROM public.services) as services_count;
