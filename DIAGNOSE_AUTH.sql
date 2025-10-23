-- ============================================
-- DIAGNOSTIC COMPLET - AUTHENTIFICATION SUPABASE
-- ============================================

-- 1. Vérifier les utilisateurs dans auth.users
SELECT 
  'AUTH USERS' as check_type,
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
  COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_users
FROM auth.users;

-- 2. Vérifier la structure de la table profiles
SELECT 
  'PROFILES TABLE' as check_type,
  COUNT(*) as total_profiles
FROM profiles;

-- 3. Vérifier les utilisateurs sans profil
SELECT 
  'USERS WITHOUT PROFILE' as check_type,
  COUNT(*) as count
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 4. Lister les utilisateurs et leurs profils
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  au.created_at as user_created_at,
  au.raw_user_meta_data->>'full_name' as auth_full_name,
  au.raw_user_meta_data->>'role' as auth_role,
  p.id as profile_id,
  p.full_name as profile_full_name,
  p.role as profile_role,
  p.created_at as profile_created_at
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- 5. Vérifier les triggers
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth';

-- 6. Vérifier les politiques RLS sur profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- 7. Vérifier si RLS est activé
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('profiles', 'provider_profiles', 'bookings', 'reviews');
