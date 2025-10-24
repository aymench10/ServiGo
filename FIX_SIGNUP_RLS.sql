-- ============================================
-- CORRECTION: Permettre l'inscription (Sign Up)
-- ============================================

-- Supprimer les anciennes politiques pour profiles
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

-- 1. Tout le monde peut voir les profils
CREATE POLICY "profiles_select_policy"
ON public.profiles FOR SELECT
USING (true);

-- 2. IMPORTANT: Permettre l'insertion pour les utilisateurs authentifiés
-- Le trigger handle_new_user() s'exécute avec SECURITY DEFINER
-- donc il peut insérer même si l'utilisateur vient de s'inscrire
CREATE POLICY "profiles_insert_policy"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 3. Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "profiles_update_policy"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Optionnel: Permettre la suppression de son propre profil
CREATE POLICY "profiles_delete_policy"
ON public.profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Vérifier les politiques
SELECT 
  tablename,
  policyname,
  cmd as operation,
  roles::text as who
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;
