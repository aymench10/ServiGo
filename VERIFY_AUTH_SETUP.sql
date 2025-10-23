-- ============================================
-- VÉRIFICATION FINALE DE LA CONFIGURATION AUTH
-- ============================================

-- 1. Vérifier que toutes les tables existent
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN 'RLS Enabled ✓' ELSE 'RLS Disabled ✗' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'providers', 'services_onsite', 'services_online', 'bookings', 'reviews')
ORDER BY tablename;
