-- ============================================
-- VÉRIFIER QUELLES TABLES EXISTENT ET CONTIENNENT DES DONNÉES
-- ============================================

-- 1. Vérifier si les tables existent
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN 'RLS Enabled' ELSE 'RLS Disabled' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('services', 'services_onsite', 'services_online', 'providers', 'provider_profiles')
ORDER BY tablename;

-- 2. Compter les services dans chaque table
SELECT 'services' as table_name, COUNT(*) as total_services
FROM public.services
WHERE is_active = true
UNION ALL
SELECT 'services_onsite' as table_name, COUNT(*) as total_services
FROM public.services_onsite
WHERE is_active = true
UNION ALL
SELECT 'services_online' as table_name, COUNT(*) as total_services
FROM public.services_online
WHERE is_active = true;

-- 3. Vérifier les providers
SELECT 'providers' as table_name, COUNT(*) as total_providers
FROM public.providers
WHERE is_active = true
UNION ALL
SELECT 'provider_profiles' as table_name, COUNT(*) as total_providers
FROM public.provider_profiles;

-- 4. Voir les derniers services créés (services)
SELECT 
  'OLD TABLE: services' as source,
  id,
  title,
  category,
  city,
  price,
  created_at
FROM public.services
WHERE is_active = true
ORDER BY created_at DESC
LIMIT 5;

-- 5. Voir les derniers services créés (services_onsite)
SELECT 
  'NEW TABLE: services_onsite' as source,
  id,
  title,
  category,
  city,
  price,
  created_at
FROM public.services_onsite
WHERE is_active = true
ORDER BY created_at DESC
LIMIT 5;
