-- ============================================
-- NOUVEAU SCHÉMA - SYSTÈME COMPLET
-- Exécutez ce script dans Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 1: DROP OLD TABLES (Clean Start)
-- ============================================
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.provider_profiles CASCADE;

-- Keep profiles table but clean it
-- DELETE FROM public.profiles; -- Uncomment if you want to start fresh

-- ============================================
-- STEP 2: CREATE NEW PROVIDERS TABLE
-- ============================================
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

-- ============================================
-- STEP 3: CREATE ONSITE SERVICES TABLE
-- ============================================
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

-- ============================================
-- STEP 4: CREATE ONLINE SERVICES TABLE
-- ============================================
CREATE TABLE public.services_online (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  delivery_time TEXT NOT NULL, -- e.g., "3 days", "1 week"
  contact TEXT NOT NULL,
  image TEXT,
  portfolio_link TEXT,
  views_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 5: CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_providers_user_id ON public.providers(user_id);
CREATE INDEX idx_providers_city ON public.providers(city);
CREATE INDEX idx_providers_category ON public.providers(category);

CREATE INDEX idx_services_onsite_provider ON public.services_onsite(provider_id);
CREATE INDEX idx_services_onsite_city ON public.services_onsite(city);
CREATE INDEX idx_services_onsite_category ON public.services_onsite(category);

CREATE INDEX idx_services_online_provider ON public.services_online(provider_id);
CREATE INDEX idx_services_online_category ON public.services_online(category);

-- ============================================
-- STEP 6: DISABLE RLS (For Development)
-- ============================================
ALTER TABLE public.providers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_onsite DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_online DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 7: CREATE STORAGE BUCKETS
-- ============================================
-- Run these in Supabase Storage UI or via SQL:
-- 1. Create bucket "provider-profiles" (public)
-- 2. Create bucket "service-images" (public)

-- ============================================
-- STEP 8: VERIFICATION
-- ============================================
SELECT 
    'Tables Created' as status,
    tablename,
    CASE WHEN rowsecurity THEN 'RLS Enabled' ELSE 'RLS Disabled' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('providers', 'services_onsite', 'services_online')
ORDER BY tablename;

-- Check structure
SELECT 
    'providers' as table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'providers'
ORDER BY ordinal_position;

SELECT 
    'services_onsite' as table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'services_onsite'
ORDER BY ordinal_position;

SELECT 
    'services_online' as table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'services_online'
ORDER BY ordinal_position;
