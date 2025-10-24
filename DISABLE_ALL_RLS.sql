-- ============================================
-- DÉSACTIVER RLS SUR TOUTES LES TABLES
-- (Pour développement/test uniquement)
-- ============================================

-- Désactiver RLS sur toutes les tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_onsite DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_online DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;

-- Vérifier le statut
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '🔒 RLS Enabled'
    ELSE '🔓 RLS Disabled (DEV MODE)'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'providers', 'services_onsite', 'services_online', 'bookings', 'reviews')
ORDER BY tablename;
