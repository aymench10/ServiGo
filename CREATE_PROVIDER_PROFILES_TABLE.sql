-- ============================================
-- CRÉER LA TABLE PROVIDER_PROFILES
-- ============================================

-- Créer la table provider_profiles si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.provider_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  service_category TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index sur user_id
CREATE INDEX IF NOT EXISTS idx_provider_profiles_user_id ON public.provider_profiles(user_id);

-- Désactiver RLS pour permettre la création
ALTER TABLE public.provider_profiles DISABLE ROW LEVEL SECURITY;

-- Vérifier
SELECT 
  'provider_profiles' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'provider_profiles'
ORDER BY ordinal_position;
