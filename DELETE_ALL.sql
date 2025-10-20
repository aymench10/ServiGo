-- ============================================
-- SUPPRIMER TOUTES LES DONNÉES DE SERVICES
-- ============================================

-- 1. SUPPRIMER TOUS LES SERVICES
DELETE FROM public.services;

-- 2. SUPPRIMER TOUS LES PROFILS PROVIDER
DELETE FROM public.provider_profiles;

-- 3. SUPPRIMER TOUTES LES BOOKINGS (réservations)
DELETE FROM public.bookings;

-- 4. SUPPRIMER TOUS LES REVIEWS (avis)
DELETE FROM public.reviews;

-- 5. SUPPRIMER TOUS LES FAVORITES
DELETE FROM public.favorites;

-- 6. VÉRIFIER QUE TOUT EST VIDE
SELECT 'services' as table_name, COUNT(*) as count FROM public.services
UNION ALL
SELECT 'provider_profiles', COUNT(*) FROM public.provider_profiles
UNION ALL
SELECT 'bookings', COUNT(*) FROM public.bookings
UNION ALL
SELECT 'reviews', COUNT(*) FROM public.reviews
UNION ALL
SELECT 'favorites', COUNT(*) FROM public.favorites;

-- Résultat attendu: tous les counts doivent être 0
