-- ============================================
-- STATUT FINAL DE LA BASE DE DONNÉES
-- ============================================

-- 1. Vérifier RLS sur toutes les tables
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '🔒 RLS ON'
    ELSE '🔓 RLS OFF (DEV MODE)'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'providers', 'services_onsite', 'services_online', 'bookings', 'reviews')
ORDER BY tablename;

-- 2. Vérifier les contraintes sur profiles
SELECT
  'Constraints on profiles' as info,
  conname as constraint_name,
  contype as type
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;

-- 3. Vérifier le trigger
SELECT 
  'Trigger Status' as info,
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 4. Compter les profils
SELECT 
  'Total Profiles' as metric,
  COUNT(*) as count
FROM public.profiles;

-- 5. Voir les derniers profils
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 5;
