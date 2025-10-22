-- =====================================================
-- VÉRIFIER LA STRUCTURE DES TABLES
-- =====================================================

-- 1. Structure de services_onsite
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'services_onsite'
ORDER BY ordinal_position;

-- 2. Structure de bookings_onsite
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings_onsite'
ORDER BY ordinal_position;

-- 3. Voir quelques exemples de services
SELECT * FROM services_onsite LIMIT 3;

-- 4. Voir quelques exemples de bookings
SELECT * FROM bookings_onsite LIMIT 3;

-- 5. Voir la relation entre services et providers
SELECT 
  s.*,
  p.user_id,
  p.full_name
FROM services_onsite s
LEFT JOIN providers p ON p.id = s.provider_id
LIMIT 3;
