-- =====================================================
-- FIX PROVIDERS V2 - Version Corrigée
-- =====================================================

-- =====================================================
-- OPTION 1 : Si services_onsite a une colonne provider_id
-- =====================================================

-- Corriger les bookings_onsite en utilisant provider_id du service
UPDATE bookings_onsite b
SET provider_id = s.provider_id
FROM services_onsite s
WHERE b.service_id = s.id
AND (b.provider_id IS NULL OR b.provider_id != s.provider_id);

-- Corriger les bookings_online
UPDATE bookings_online b
SET provider_id = s.provider_id
FROM services_online s
WHERE b.service_id = s.id
AND (b.provider_id IS NULL OR b.provider_id != s.provider_id);


-- =====================================================
-- OPTION 2 : Si services_onsite a provider_id qui pointe vers providers.id
-- et vous voulez le user_id du provider
-- =====================================================

-- Corriger bookings_onsite avec le user_id du provider
UPDATE bookings_onsite b
SET provider_id = p.user_id
FROM services_onsite s
JOIN providers p ON s.provider_id = p.id
WHERE b.service_id = s.id
AND (b.provider_id IS NULL OR b.provider_id != p.user_id);

-- Corriger bookings_online avec le user_id du provider
UPDATE bookings_online b
SET provider_id = p.user_id
FROM services_online s
JOIN providers p ON s.provider_id = p.id
WHERE b.service_id = s.id
AND (b.provider_id IS NULL OR b.provider_id != p.user_id);


-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Voir la structure actuelle
SELECT 
  b.id,
  b.service_id,
  b.provider_id as booking_provider_id,
  s.provider_id as service_provider_id,
  p.user_id as provider_user_id,
  p.full_name as provider_name
FROM bookings_onsite b
LEFT JOIN services_onsite s ON b.service_id = s.id
LEFT JOIN providers p ON s.provider_id = p.id
ORDER BY b.created_at DESC
LIMIT 10;


-- =====================================================
-- STATISTIQUES
-- =====================================================

-- Compter les réservations
SELECT 
  COUNT(*) as total_bookings,
  COUNT(DISTINCT b.provider_id) as unique_providers
FROM bookings_onsite b;

-- Réservations par provider
SELECT 
  p.full_name,
  p.email,
  COUNT(b.id) as total_bookings
FROM providers p
LEFT JOIN bookings_onsite b ON b.provider_id = p.user_id
GROUP BY p.id, p.full_name, p.email
ORDER BY total_bookings DESC;
