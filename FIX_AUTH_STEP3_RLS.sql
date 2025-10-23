-- ============================================
-- ÉTAPE 3: CONFIGURER RLS (ROW LEVEL SECURITY)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_onsite ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_online ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLITIQUES POUR PROFILES
-- ============================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

-- Tout le monde peut voir les profils
CREATE POLICY "profiles_select_policy"
ON public.profiles FOR SELECT
USING (true);

-- Les utilisateurs peuvent créer leur propre profil
CREATE POLICY "profiles_insert_policy"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "profiles_update_policy"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- POLITIQUES POUR PROVIDERS
-- ============================================

DROP POLICY IF EXISTS "providers_select_policy" ON public.providers;
DROP POLICY IF EXISTS "providers_insert_policy" ON public.providers;
DROP POLICY IF EXISTS "providers_update_policy" ON public.providers;

-- Tout le monde peut voir les providers
CREATE POLICY "providers_select_policy"
ON public.providers FOR SELECT
USING (true);

-- Les utilisateurs authentifiés peuvent créer un profil provider
CREATE POLICY "providers_insert_policy"
ON public.providers FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Les providers peuvent mettre à jour leur propre profil
CREATE POLICY "providers_update_policy"
ON public.providers FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- POLITIQUES POUR SERVICES_ONSITE
-- ============================================

DROP POLICY IF EXISTS "services_onsite_select_policy" ON public.services_onsite;
DROP POLICY IF EXISTS "services_onsite_insert_policy" ON public.services_onsite;
DROP POLICY IF EXISTS "services_onsite_update_policy" ON public.services_onsite;
DROP POLICY IF EXISTS "services_onsite_delete_policy" ON public.services_onsite;

-- Tout le monde peut voir les services
CREATE POLICY "services_onsite_select_policy"
ON public.services_onsite FOR SELECT
USING (true);

-- Les providers peuvent créer des services
CREATE POLICY "services_onsite_insert_policy"
ON public.services_onsite FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- Les providers peuvent mettre à jour leurs services
CREATE POLICY "services_onsite_update_policy"
ON public.services_onsite FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- Les providers peuvent supprimer leurs services
CREATE POLICY "services_onsite_delete_policy"
ON public.services_onsite FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- ============================================
-- POLITIQUES POUR SERVICES_ONLINE
-- ============================================

DROP POLICY IF EXISTS "services_online_select_policy" ON public.services_online;
DROP POLICY IF EXISTS "services_online_insert_policy" ON public.services_online;
DROP POLICY IF EXISTS "services_online_update_policy" ON public.services_online;
DROP POLICY IF EXISTS "services_online_delete_policy" ON public.services_online;

-- Tout le monde peut voir les services
CREATE POLICY "services_online_select_policy"
ON public.services_online FOR SELECT
USING (true);

-- Les providers peuvent créer des services
CREATE POLICY "services_online_insert_policy"
ON public.services_online FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- Les providers peuvent mettre à jour leurs services
CREATE POLICY "services_online_update_policy"
ON public.services_online FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- Les providers peuvent supprimer leurs services
CREATE POLICY "services_online_delete_policy"
ON public.services_online FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- ============================================
-- POLITIQUES POUR BOOKINGS
-- ============================================

DROP POLICY IF EXISTS "bookings_select_policy" ON public.bookings;
DROP POLICY IF EXISTS "bookings_insert_policy" ON public.bookings;
DROP POLICY IF EXISTS "bookings_update_policy" ON public.bookings;

-- Les utilisateurs peuvent voir leurs propres bookings ou ceux de leurs services
CREATE POLICY "bookings_select_policy"
ON public.bookings FOR SELECT
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.providers
    WHERE id = provider_id AND user_id = auth.uid()
  )
);

-- Les utilisateurs authentifiés peuvent créer des bookings
CREATE POLICY "bookings_insert_policy"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Les participants peuvent mettre à jour le booking
CREATE POLICY "bookings_update_policy"
ON public.bookings FOR UPDATE
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

DROP POLICY IF EXISTS "reviews_select_policy" ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert_policy" ON public.reviews;
DROP POLICY IF EXISTS "reviews_update_policy" ON public.reviews;
DROP POLICY IF EXISTS "reviews_delete_policy" ON public.reviews;

-- Tout le monde peut voir les reviews
CREATE POLICY "reviews_select_policy"
ON public.reviews FOR SELECT
USING (true);

-- Les utilisateurs authentifiés peuvent créer des reviews
CREATE POLICY "reviews_insert_policy"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leurs propres reviews
CREATE POLICY "reviews_update_policy"
ON public.reviews FOR UPDATE
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres reviews
CREATE POLICY "reviews_delete_policy"
ON public.reviews FOR DELETE
USING (auth.uid() = user_id);
