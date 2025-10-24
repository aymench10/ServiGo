-- ============================================
-- DÉSACTIVER RLS SUR PROFILES (TEMPORAIRE)
-- Pour permettre l'inscription
-- ============================================

-- Désactiver RLS sur profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Vérifier le statut
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '🔒 RLS Enabled'
    ELSE '🔓 RLS Disabled'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'profiles';
