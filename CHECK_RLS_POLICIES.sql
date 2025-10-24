-- ============================================
-- VÉRIFIER TOUTES LES POLITIQUES RLS
-- ============================================

-- Vérifier que RLS est activé
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '✓ RLS Enabled' ELSE '✗ RLS Disabled' END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'providers', 'services_onsite', 'services_online', 'bookings', 'reviews')
ORDER BY tablename;

-- Lister toutes les politiques pour providers
SELECT 
  policyname as policy,
  cmd as operation,
  CASE 
    WHEN roles::text = '{authenticated}' THEN 'Authenticated Users'
    WHEN roles::text = '{public}' THEN 'Public'
    ELSE roles::text
  END as who_can,
  CASE 
    WHEN qual IS NOT NULL THEN 'Has USING clause'
    ELSE 'No USING clause'
  END as using_check,
  CASE 
    WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause'
    ELSE 'No WITH CHECK clause'
  END as with_check_status
FROM pg_policies
WHERE tablename = 'providers'
ORDER BY cmd, policyname;
