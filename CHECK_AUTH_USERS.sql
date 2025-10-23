-- Vérifier tous les utilisateurs et leurs profils
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  au.created_at as user_created_at,
  au.raw_user_meta_data->>'full_name' as auth_full_name,
  au.raw_user_meta_data->>'role' as auth_role,
  p.id as profile_exists,
  p.full_name as profile_full_name,
  p.role as profile_role
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
