-- =====================================================
-- FIX PROVIDER ID - Correction Rapide
-- =====================================================

-- ÉTAPE 1 : Trouvez votre user_id
-- Remplacez 'alexx@gmail.com' par votre email exact
SELECT 
  id as "MON_USER_ID",
  email,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'alexx@gmail.com';

-- Copiez le MON_USER_ID affiché ci-dessus


-- ÉTAPE 2 : Vérifiez vos réservations actuelles
SELECT 
  id,
  provider_id as "Provider ID dans booking",
  client_id,
  service_id,
  status,
  created_at
FROM bookings_onsite
ORDER BY created_at DESC
LIMIT 10;


-- ÉTAPE 3 : Vérifiez votre profil provider
-- Remplacez 'VOTRE_USER_ID_ICI' par l'ID de l'étape 1
SELECT 
  user_id,
  full_name,
  email
FROM providers
WHERE user_id = 'VOTRE_USER_ID_ICI';

-- Si aucun résultat, créez votre profil :
INSERT INTO providers (user_id, full_name, email, phone, city, category)
VALUES (
  'VOTRE_USER_ID_ICI',
  'Alex Ben Abdeljil',
  'alexx@gmail.com',
  '+216 XX XXX XXX',
  'Tunis',
  'Prestataire'
)
ON CONFLICT (user_id) DO NOTHING;


-- ÉTAPE 4 : CORRIGER LES PROVIDER_ID
-- Cette commande met à jour TOUTES les réservations pour qu'elles pointent vers le bon provider

-- Option A : Si vous êtes le propriétaire de TOUS les services
UPDATE bookings_onsite
SET provider_id = 'VOTRE_USER_ID_ICI'
WHERE provider_id != 'VOTRE_USER_ID_ICI';

-- Option B : Corriger en fonction du service (plus précis)
UPDATE bookings_onsite b
SET provider_id = s.user_id
FROM services_onsite s
WHERE b.service_id = s.id
AND b.provider_id != s.user_id;


-- ÉTAPE 5 : VÉRIFIER LE RÉSULTAT
-- Remplacez 'VOTRE_USER_ID_ICI' par votre user_id
SELECT 
  COUNT(*) as "Total de mes réservations"
FROM bookings_onsite
WHERE provider_id = 'VOTRE_USER_ID_ICI';

-- Devrait afficher 3 si tout est correct !


-- ÉTAPE 6 : VOIR LES DÉTAILS
SELECT 
  b.id,
  b.provider_id,
  b.client_id,
  b.status,
  b.location,
  b.scheduled_date,
  s.title as service_name
FROM bookings_onsite b
LEFT JOIN services_onsite s ON b.service_id = s.id
WHERE b.provider_id = 'VOTRE_USER_ID_ICI'
ORDER BY b.created_at DESC;
