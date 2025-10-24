-- ============================================
-- CORRECTION: Politiques RLS pour PROVIDERS
-- ============================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "providers_select_policy" ON public.providers;
DROP POLICY IF EXISTS "providers_insert_policy" ON public.providers;
DROP POLICY IF EXISTS "providers_update_policy" ON public.providers;
DROP POLICY IF EXISTS "providers_delete_policy" ON public.providers;

-- 1. Tout le monde peut voir les providers (lecture publique)
CREATE POLICY "providers_select_policy"
ON public.providers FOR SELECT
USING (true);

-- 2. Les utilisateurs authentifiés peuvent créer un profil provider
-- IMPORTANT: Vérifier que l'utilisateur crée son propre profil
CREATE POLICY "providers_insert_policy"
ON public.providers FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

-- 3. Les providers peuvent mettre à jour leur propre profil
CREATE POLICY "providers_update_policy"
ON public.providers FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Les providers peuvent supprimer leur propre profil
CREATE POLICY "providers_delete_policy"
ON public.providers FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Vérifier que les politiques sont créées
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'providers'
ORDER BY policyname;
