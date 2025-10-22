-- =====================================================
-- FIX ALL PROVIDERS - Correction Générale
-- =====================================================
-- Ce script corrige TOUTES les réservations pour TOUS les providers

-- =====================================================
-- PROBLÈME
-- =====================================================
-- Les réservations ont un provider_id incorrect.
-- Le provider_id doit correspondre au user_id du propriétaire du service.

-- =====================================================
-- SOLUTION AUTOMATIQUE
-- =====================================================

-- 1. Corriger les bookings_onsite
-- Cette requête met à jour automatiquement le provider_id 
-- en fonction du propriétaire du service
UPDATE bookings_onsite b
SET provider_id = s.user_id
FROM services_onsite s
WHERE b.service_id = s.id
AND (b.provider_id IS NULL OR b.provider_id != s.user_id);

-- 2. Corriger les bookings_online
UPDATE bookings_online b
SET provider_id = s.user_id
FROM services_online s
WHERE b.service_id = s.id
AND (b.provider_id IS NULL OR b.provider_id != s.user_id);


-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Voir toutes les réservations avec leur provider correct
SELECT 
  b.id,
  b.service_id,
  s.title as service_name,
  s.user_id as service_owner_id,
  b.provider_id as booking_provider_id,
  p.full_name as provider_name,
  p.email as provider_email,
  CASE 
    WHEN b.provider_id = s.user_id THEN '✅ Correct'
    ELSE '❌ Incorrect'
  END as status
FROM bookings_onsite b
JOIN services_onsite s ON b.service_id = s.id
LEFT JOIN providers p ON b.provider_id = p.user_id
ORDER BY b.created_at DESC;


-- =====================================================
-- STATISTIQUES
-- =====================================================

-- Nombre de réservations par provider
SELECT 
  p.full_name as provider_name,
  p.email,
  COUNT(b.id) as total_bookings,
  COUNT(CASE WHEN b.status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as confirmed,
  COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed
FROM providers p
LEFT JOIN bookings_onsite b ON b.provider_id = p.user_id
GROUP BY p.user_id, p.full_name, p.email
ORDER BY total_bookings DESC;


-- =====================================================
-- CRÉER UN TRIGGER POUR AUTOMATISER À L'AVENIR
-- =====================================================
-- Ce trigger s'assure que le provider_id est toujours correct lors de l'insertion

-- Fonction pour définir automatiquement le provider_id
CREATE OR REPLACE FUNCTION set_provider_id_from_service()
RETURNS TRIGGER AS $$
BEGIN
  -- Récupérer le user_id du service et le définir comme provider_id
  SELECT user_id INTO NEW.provider_id
  FROM services_onsite
  WHERE id = NEW.service_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour bookings_onsite
DROP TRIGGER IF EXISTS set_provider_id_onsite ON bookings_onsite;
CREATE TRIGGER set_provider_id_onsite
  BEFORE INSERT ON bookings_onsite
  FOR EACH ROW
  EXECUTE FUNCTION set_provider_id_from_service();

-- Fonction pour services_online
CREATE OR REPLACE FUNCTION set_provider_id_from_service_online()
RETURNS TRIGGER AS $$
BEGIN
  SELECT user_id INTO NEW.provider_id
  FROM services_online
  WHERE id = NEW.service_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour bookings_online
DROP TRIGGER IF EXISTS set_provider_id_online ON bookings_online;
CREATE TRIGGER set_provider_id_online
  BEFORE INSERT ON bookings_online
  FOR EACH ROW
  EXECUTE FUNCTION set_provider_id_from_service_online();


-- =====================================================
-- TEST FINAL
-- =====================================================

-- Cette requête doit montrer que tous les provider_id sont corrects
SELECT 
  COUNT(*) as total_bookings,
  COUNT(CASE WHEN b.provider_id = s.user_id THEN 1 END) as correct_provider_id,
  COUNT(CASE WHEN b.provider_id != s.user_id THEN 1 END) as incorrect_provider_id
FROM bookings_onsite b
JOIN services_onsite s ON b.service_id = s.id;

-- Si incorrect_provider_id = 0, tout est bon ! ✅
