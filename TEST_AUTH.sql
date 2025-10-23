-- ============================================
-- TEST COMPLET DE L'AUTHENTIFICATION
-- ============================================

-- 1. Compter les profils
SELECT 'Total Profiles' as metric, COUNT(*) as count FROM profiles;

-- 2. Compter les providers
SELECT 'Total Providers' as metric, COUNT(*) as count FROM providers;

-- 3. Compter les services
SELECT 'Services Onsite' as metric, COUNT(*) as count FROM services_onsite
UNION ALL
SELECT 'Services Online' as metric, COUNT(*) as count FROM services_online;

-- 4. Compter les bookings
SELECT 'Total Bookings' as metric, COUNT(*) as count FROM bookings;

-- 5. Compter les reviews
SELECT 'Total Reviews' as metric, COUNT(*) as count FROM reviews;

-- 6. Vérifier les derniers profils créés
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 5;
