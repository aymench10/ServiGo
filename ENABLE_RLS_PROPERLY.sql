-- ============================================
-- ACTIVER RLS AVEC LES BONNES POLITIQUES
-- ============================================

-- ÉTAPE 1: Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_onsite ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_online ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLITIQUES POUR PROFILES
-- ============================================

-- Supprimer les anciennes
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

-- SELECT: Tout le monde peut voir tous les profils
CREATE POLICY "profiles_select_all"
ON public.profiles FOR SELECT
TO public
USING (true);

-- INSERT: Les utilisateurs authentifiés peuvent créer leur propre profil
-- IMPORTANT: Utiliser 'public' au lieu de 'authenticated' pour permettre l'inscription
CREATE POLICY "profiles_insert_own"
ON public.profiles FOR INSERT
TO public
WITH CHECK (true);  -- Permissif pour l'inscription

-- UPDATE: Seulement son propre profil
CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- DELETE: Seulement son propre profil
CREATE POLICY "profiles_delete_own"
ON public.profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- ============================================
-- POLITIQUES POUR PROVIDERS
-- ============================================

DROP POLICY IF EXISTS "providers_select_all" ON public.providers;
DROP POLICY IF EXISTS "providers_insert_own" ON public.providers;
DROP POLICY IF EXISTS "providers_update_own" ON public.providers;
DROP POLICY IF EXISTS "providers_delete_own" ON public.providers;

-- SELECT: Tout le monde peut voir les providers
CREATE POLICY "providers_select_all"
ON public.providers FOR SELECT
TO public
USING (true);

-- INSERT: Les utilisateurs authentifiés peuvent créer leur profil provider
CREATE POLICY "providers_insert_own"
ON public.providers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Seulement son propre profil
CREATE POLICY "providers_update_own"
ON public.providers FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE: Seulement son propre profil
CREATE POLICY "providers_delete_own"
ON public.providers FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- POLITIQUES POUR SERVICES_ONSITE
-- ============================================

DROP POLICY IF EXISTS "services_onsite_select_all" ON public.services_onsite;
DROP POLICY IF EXISTS "services_onsite_insert_own" ON public.services_onsite;
DROP POLICY IF EXISTS "services_onsite_update_own" ON public.services_onsite;
DROP POLICY IF EXISTS "services_onsite_delete_own" ON public.services_onsite;

-- SELECT: Tout le monde peut voir les services
CREATE POLICY "services_onsite_select_all"
ON public.services_onsite FOR SELECT
TO public
USING (true);

-- INSERT: Les providers peuvent créer des services
CREATE POLICY "services_onsite_insert_own"
ON public.services_onsite FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- UPDATE: Les providers peuvent modifier leurs services
CREATE POLICY "services_onsite_update_own"
ON public.services_onsite FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- DELETE: Les providers peuvent supprimer leurs services
CREATE POLICY "services_onsite_delete_own"
ON public.services_onsite FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- ============================================
-- POLITIQUES POUR SERVICES_ONLINE
-- ============================================

DROP POLICY IF EXISTS "services_online_select_all" ON public.services_online;
DROP POLICY IF EXISTS "services_online_insert_own" ON public.services_online;
DROP POLICY IF EXISTS "services_online_update_own" ON public.services_online;
DROP POLICY IF EXISTS "services_online_delete_own" ON public.services_online;

-- SELECT: Tout le monde peut voir les services
CREATE POLICY "services_online_select_all"
ON public.services_online FOR SELECT
TO public
USING (true);

-- INSERT: Les providers peuvent créer des services
CREATE POLICY "services_online_insert_own"
ON public.services_online FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- UPDATE: Les providers peuvent modifier leurs services
CREATE POLICY "services_online_update_own"
ON public.services_online FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- DELETE: Les providers peuvent supprimer leurs services
CREATE POLICY "services_online_delete_own"
ON public.services_online FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- ============================================
-- POLITIQUES POUR BOOKINGS
-- ============================================

DROP POLICY IF EXISTS "bookings_select_own" ON public.bookings;
DROP POLICY IF EXISTS "bookings_insert_own" ON public.bookings;
DROP POLICY IF EXISTS "bookings_update_own" ON public.bookings;

-- SELECT: Voir ses propres bookings (client ou provider)
CREATE POLICY "bookings_select_own"
ON public.bookings FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- INSERT: Les clients peuvent créer des bookings
CREATE POLICY "bookings_insert_own"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Client et provider peuvent modifier
CREATE POLICY "bookings_update_own"
ON public.bookings FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- ============================================
-- POLITIQUES POUR REVIEWS
-- ============================================

DROP POLICY IF EXISTS "reviews_select_all" ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert_own" ON public.reviews;
DROP POLICY IF EXISTS "reviews_update_own" ON public.reviews;
DROP POLICY IF EXISTS "reviews_delete_own" ON public.reviews;

-- SELECT: Tout le monde peut voir les avis
CREATE POLICY "reviews_select_all"
ON public.reviews FOR SELECT
TO public
USING (true);

-- INSERT: Les utilisateurs authentifiés peuvent créer des avis
CREATE POLICY "reviews_insert_own"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Seulement ses propres avis
CREATE POLICY "reviews_update_own"
ON public.reviews FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- DELETE: Seulement ses propres avis
CREATE POLICY "reviews_delete_own"
ON public.reviews FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- VÉRIFICATION
-- ============================================

SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as rls_status,
  (SELECT COUNT(*) FROM pg_policies WHERE pg_policies.tablename = pg_tables.tablename) as policies_count
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'providers', 'services_onsite', 'services_online', 'bookings', 'reviews')
ORDER BY tablename;
