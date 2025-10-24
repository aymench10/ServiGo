-- ============================================
-- DÉSACTIVER LE TRIGGER COMPLÈTEMENT
-- On va créer le profil manuellement dans le code
-- ============================================

-- Supprimer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Supprimer la fonction
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Vérifier que le trigger est supprimé
SELECT 
  'Trigger Status' as info,
  COUNT(*) as trigger_count
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Désactiver RLS sur profiles pour permettre la création manuelle
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Vérifier
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '🔒 RLS ON'
    ELSE '🔓 RLS OFF'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'profiles';
