-- ============================================
-- EXÉCUTEZ CE SCRIPT MAINTENANT DANS SUPABASE
-- ============================================

-- 1. Supprimer les anciennes tables
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.provider_profiles CASCADE;

-- 2. Créer la nouvelle table providers
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT NOT NULL,
  category TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  profile_image TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer la table services_onsite
CREATE TABLE public.services_onsite (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  contact TEXT NOT NULL,
  image TEXT,
  views_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer la table services_online
CREATE TABLE public.services_online (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  delivery_time TEXT NOT NULL,
  contact TEXT NOT NULL,
  image TEXT,
  portfolio_link TEXT,
  views_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Créer les indexes
CREATE INDEX idx_providers_user_id ON public.providers(user_id);
CREATE INDEX idx_services_onsite_provider ON public.services_onsite(provider_id);
CREATE INDEX idx_services_online_provider ON public.services_online(provider_id);

-- 6. Désactiver RLS
ALTER TABLE public.providers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_onsite DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_online DISABLE ROW LEVEL SECURITY;

-- 7. Créer votre profil provider automatiquement
INSERT INTO public.providers (user_id, full_name, email, phone, city, category, experience_years, bio, is_active)
SELECT 
    p.id,
    p.full_name,
    p.email,
    p.phone,
    'Tunis',
    'Autre',
    0,
    'Services professionnels',
    true
FROM public.profiles p
WHERE p.role = 'provider'
AND NOT EXISTS (
    SELECT 1 FROM public.providers pr WHERE pr.user_id = p.id
);

-- 8. Vérification
SELECT 
    'PROFIL CRÉÉ ✅' as status,
    pr.id as provider_id,
    pr.user_id,
    pr.full_name,
    pr.email,
    pr.city,
    pr.category,
    p.email as auth_email
FROM public.providers pr
JOIN public.profiles p ON p.id = pr.user_id
WHERE p.role = 'provider';

SELECT 
    'TABLES CRÉÉES ✅' as status,
    tablename,
    CASE WHEN rowsecurity THEN 'RLS Enabled' ELSE 'RLS Disabled ✅' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('providers', 'services_onsite', 'services_online')
ORDER BY tablename;
