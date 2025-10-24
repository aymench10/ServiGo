-- COMPLETE RLS FIX FOR ALL TABLES
-- Run this in Supabase SQL Editor

-- Drop ALL existing policies
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

DROP POLICY IF EXISTS "provider_profiles_select_all" ON public.provider_profiles;
DROP POLICY IF EXISTS "provider_profiles_insert_own" ON public.provider_profiles;
DROP POLICY IF EXISTS "provider_profiles_update_own" ON public.provider_profiles;
DROP POLICY IF EXISTS "provider_profiles_delete_own" ON public.provider_profiles;

DROP POLICY IF EXISTS "services_onsite_select_all" ON public.services_onsite;
DROP POLICY IF EXISTS "services_onsite_insert_own" ON public.services_onsite;
DROP POLICY IF EXISTS "services_onsite_update_own" ON public.services_onsite;
DROP POLICY IF EXISTS "services_onsite_delete_own" ON public.services_onsite;

DROP POLICY IF EXISTS "services_online_select_all" ON public.services_online;
DROP POLICY IF EXISTS "services_online_insert_own" ON public.services_online;
DROP POLICY IF EXISTS "services_online_update_own" ON public.services_online;
DROP POLICY IF EXISTS "services_online_delete_own" ON public.services_online;

DROP POLICY IF EXISTS "favorites_select_own" ON public.favorites;
DROP POLICY IF EXISTS "favorites_insert_own" ON public.favorites;
DROP POLICY IF EXISTS "favorites_delete_own" ON public.favorites;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_onsite ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_online ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- PROVIDER_PROFILES POLICIES - SIMPLIFIED
CREATE POLICY "provider_profiles_select_all" ON public.provider_profiles FOR SELECT USING (true);
CREATE POLICY "provider_profiles_insert_own" ON public.provider_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "provider_profiles_update_own" ON public.provider_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "provider_profiles_delete_own" ON public.provider_profiles FOR DELETE USING (auth.uid() = user_id);

-- SERVICES_ONSITE POLICIES - SIMPLIFIED
CREATE POLICY "services_onsite_select_all" ON public.services_onsite FOR SELECT USING (true);
CREATE POLICY "services_onsite_insert_own" ON public.services_onsite FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "services_onsite_update_own" ON public.services_onsite FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "services_onsite_delete_own" ON public.services_onsite FOR DELETE USING (auth.uid() IS NOT NULL);

-- SERVICES_ONLINE POLICIES - SIMPLIFIED
CREATE POLICY "services_online_select_all" ON public.services_online FOR SELECT USING (true);
CREATE POLICY "services_online_insert_own" ON public.services_online FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "services_online_update_own" ON public.services_online FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "services_online_delete_own" ON public.services_online FOR DELETE USING (auth.uid() IS NOT NULL);

-- FAVORITES POLICIES
CREATE POLICY "favorites_select_own" ON public.favorites FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "favorites_insert_own" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "favorites_delete_own" ON public.favorites FOR DELETE USING (auth.uid() = client_id);
