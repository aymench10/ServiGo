-- ============================================
-- CONFIRMER MANUELLEMENT UN EMAIL
-- (Pour développement/test uniquement)
-- ============================================

-- Voir tous les utilisateurs non confirmés
SELECT 
  id,
  email,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '❌ Non confirmé'
    ELSE '✅ Confirmé'
  END as status
FROM auth.users
ORDER BY created_at DESC;

-- Pour confirmer manuellement votre email, décommentez et modifiez cette ligne :
-- UPDATE auth.users
-- SET email_confirmed_at = NOW()
-- WHERE email = 'aymench0122@gmail.com';

-- Vérifier le résultat
-- SELECT 
--   id,
--   email,
--   email_confirmed_at,
--   created_at
-- FROM auth.users
-- WHERE email = 'aymench0122@gmail.com';
