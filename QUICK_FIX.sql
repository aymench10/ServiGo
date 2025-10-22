-- =====================================================
-- QUICK FIX - Solution Rapide
-- =====================================================

-- Étape 1 : Supprimer la contrainte qui bloque
ALTER TABLE bookings_onsite DROP CONSTRAINT IF EXISTS fk_provider;
ALTER TABLE bookings_onsite DROP CONSTRAINT IF EXISTS bookings_onsite_provider_id_fkey;
ALTER TABLE bookings_online DROP CONSTRAINT IF EXISTS fk_provider;
ALTER TABLE bookings_online DROP CONSTRAINT IF EXISTS bookings_online_provider_id_fkey;

-- Étape 2 : Corriger les provider_id
UPDATE bookings_onsite b
SET provider_id = s.provider_id
FROM services_onsite s
WHERE b.service_id = s.id;

UPDATE bookings_online b
SET provider_id = s.provider_id
FROM services_online s
WHERE b.service_id = s.id;

-- Étape 3 : Vérifier
SELECT 
  b.id,
  b.provider_id,
  s.provider_id as service_provider_id,
  b.status
FROM bookings_onsite b
JOIN services_onsite s ON b.service_id = s.id
LIMIT 10;

-- Étape 4 : Compter les réservations par provider
SELECT 
  provider_id,
  COUNT(*) as total_bookings
FROM bookings_onsite
GROUP BY provider_id;
