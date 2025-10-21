-- ============================================
-- VÉRIFICATION RAPIDE - Exécutez ceci maintenant!
-- ============================================

-- 1. Combien de services dans services_onsite?
SELECT 
  'services_onsite' as table_name,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as actifs
FROM public.services_onsite;

-- 2. Combien de providers?
SELECT 
  'providers' as table_name,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as actifs
FROM public.providers;

-- 3. Voir tous les services_onsite (même inactifs)
SELECT 
  id,
  title,
  category,
  city,
  price,
  is_active,
  created_at
FROM public.services_onsite
ORDER BY created_at DESC;

-- 4. Vérifier si vous avez des services dans l'ancienne table
SELECT 
  'Ancienne table services' as info,
  COUNT(*) as total
FROM public.services
WHERE is_active = true;
