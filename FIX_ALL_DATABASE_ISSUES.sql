-- ============================================
-- CORRECTION COMPLÈTE DE TOUS LES PROBLÈMES
-- ============================================

-- 1. Supprimer la contrainte UNIQUE sur email dans profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_email_key;

-- 2. Recréer la table profiles avec la bonne structure
-- D'abord, sauvegarder les données existantes
CREATE TEMP TABLE profiles_backup AS SELECT * FROM public.profiles;

-- Supprimer et recréer la table
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,  -- Pas de UNIQUE ici car auth.users gère déjà l'unicité
  full_name TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'provider')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurer les données
INSERT INTO public.profiles 
SELECT * FROM profiles_backup
ON CONFLICT (id) DO NOTHING;

-- 3. Désactiver RLS sur profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 4. Recréer le trigger
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
    RAISE WARNING 'Erreur création profil: %', SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Vérifier la structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 6. Vérifier les contraintes
SELECT
  conname as constraint_name,
  contype as constraint_type
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;
