-- ============================================
-- ÉTAPE 4: SYNCHRONISER LES PROFILS EXISTANTS
-- ============================================

-- Créer des profils pour tous les utilisateurs qui n'en ont pas
INSERT INTO public.profiles (id, email, full_name, role, phone)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 'User'),
  COALESCE(au.raw_user_meta_data->>'role', 'client'),
  COALESCE(au.raw_user_meta_data->>'phone', '')
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Vérifier le résultat
SELECT 
  COUNT(*) as total_profiles
FROM public.profiles;
