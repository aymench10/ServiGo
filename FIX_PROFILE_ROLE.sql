-- ============================================
-- CORRECTION: Mettre à jour le rôle en 'provider'
-- ============================================

-- Si vous essayez de créer un profil provider, 
-- assurez-vous que le profil utilisateur a le rôle 'provider'

-- Exemple: Mettre à jour votre propre profil pour devenir provider
-- Remplacez 'votre-email@example.com' par votre vrai email

-- UPDATE public.profiles
-- SET role = 'provider'
-- WHERE email = 'votre-email@example.com';

-- Pour vérifier tous les profils:
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles
ORDER BY created_at DESC;
