-- =====================================================
-- FIX FOREIGN KEY - Solution Complète
-- =====================================================

-- PROBLÈME : 
-- La contrainte de clé étrangère "fk_provider" empêche l'insertion
-- car le provider_id n'existe pas dans la table providers

-- =====================================================
-- SOLUTION 1 : Supprimer temporairement la contrainte
-- =====================================================

-- Supprimer la contrainte de clé étrangère
ALTER TABLE bookings_onsite 
DROP CONSTRAINT IF EXISTS fk_provider;

ALTER TABLE bookings_onsite 
DROP CONSTRAINT IF EXISTS bookings_onsite_provider_id_fkey;

-- Faire de même pour bookings_online
ALTER TABLE bookings_online 
DROP CONSTRAINT IF EXISTS fk_provider;

ALTER TABLE bookings_online 
DROP CONSTRAINT IF EXISTS bookings_online_provider_id_fkey;


-- =====================================================
-- SOLUTION 2 : Corriger les provider_id existants
-- =====================================================

-- Mettre à jour tous les bookings avec le provider_id du service
UPDATE bookings_onsite b
SET provider_id = s.provider_id
FROM services_onsite s
WHERE b.service_id = s.id;

UPDATE bookings_online b
SET provider_id = s.provider_id
FROM services_online s
WHERE b.service_id = s.id;


-- =====================================================
-- SOLUTION 3 : Recréer la contrainte correctement
-- =====================================================

-- Ajouter la contrainte qui pointe vers providers.user_id (pas providers.id)
ALTER TABLE bookings_onsite
ADD CONSTRAINT bookings_onsite_provider_id_fkey 
FOREIGN KEY (provider_id) 
REFERENCES auth.users(id)
ON DELETE CASCADE;

ALTER TABLE bookings_online
ADD CONSTRAINT bookings_online_provider_id_fkey 
FOREIGN KEY (provider_id) 
REFERENCES auth.users(id)
ON DELETE CASCADE;


-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Voir les contraintes actuelles
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name IN ('bookings_onsite', 'bookings_online')
  AND tc.constraint_type = 'FOREIGN KEY';


-- =====================================================
-- TEST : Compter les réservations
-- =====================================================

SELECT 
  COUNT(*) as total_bookings,
  COUNT(DISTINCT provider_id) as unique_providers
FROM bookings_onsite;

-- Voir les réservations par provider
SELECT 
  b.provider_id,
  u.email as provider_email,
  COUNT(b.id) as total_bookings
FROM bookings_onsite b
LEFT JOIN auth.users u ON b.provider_id = u.id
GROUP BY b.provider_id, u.email
ORDER BY total_bookings DESC;
