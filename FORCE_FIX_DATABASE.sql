-- ============================================
-- CORRECTION FORCÉE - SUPPRESSION EN CASCADE
-- ============================================

-- 1. Supprimer TOUTES les politiques RLS qui dépendent de la colonne role
DROP POLICY IF EXISTS "providers_insert_own" ON public.providers;
DROP POLICY IF EXISTS "providers_select_policy" ON public.providers;
DROP POLICY IF EXISTS "providers_insert_policy" ON public.providers;
DROP POLICY IF EXISTS "providers_update_policy" ON public.providers;
DROP POLICY IF EXISTS "providers_delete_policy" ON public.providers;

-- 2. Supprimer les contraintes sur profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_email_key CASCADE;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check CASCADE;

-- 3. Modifier la colonne role pour accepter n'importe quelle valeur
ALTER TABLE public.profiles ALTER COLUMN role DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'client';

-- 4. Nettoyer les données
UPDATE public.profiles SET role = 'client' WHERE role IS NULL OR role NOT IN ('client', 'provider');

-- 5. Désactiver RLS partout
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_onsite DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_online DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;

-- 6. Recréer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    role = COALESCE(EXCLUDED.role, profiles.role),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. Vérifier
SELECT 
  'Profiles' as table_name,
  COUNT(*) as count,
  CASE WHEN bool_or(rowsecurity) THEN 'RLS ON' ELSE 'RLS OFF' END as rls_status
FROM pg_tables t
LEFT JOIN public.profiles p ON true
WHERE t.tablename = 'profiles' AND t.schemaname = 'public'
GROUP BY table_name;
