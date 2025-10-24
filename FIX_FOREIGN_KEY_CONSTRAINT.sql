-- ============================================
-- CORRIGER LA CONTRAINTE FOREIGN KEY
-- ============================================

-- 1. Supprimer la contrainte foreign key existante
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Recréer la contrainte avec ON DELETE CASCADE
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE
DEFERRABLE INITIALLY DEFERRED;  -- Important: permet au trigger de fonctionner

-- 3. Vérifier les contraintes
SELECT
  conname as constraint_name,
  contype as type,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
ORDER BY conname;
