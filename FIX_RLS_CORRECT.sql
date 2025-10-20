-- ============================================
-- COMPLETE RLS FIX FOR YOUR ACTUAL TABLES
-- Run this in Supabase SQL Editor
-- ============================================
-- Tables: profiles, providers, services_onsite, services_online
-- ============================================

-- Step 1: Drop all existing policies
-- ============================================

-- Drop profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

-- Drop providers policies
DROP POLICY IF EXISTS "Providers are viewable by everyone" ON public.providers;
DROP POLICY IF EXISTS "Users can insert own provider" ON public.providers;
DROP POLICY IF EXISTS "Users can update own provider" ON public.providers;
DROP POLICY IF EXISTS "Users can delete own provider" ON public.providers;
DROP POLICY IF EXISTS "providers_select_all" ON public.providers;
DROP POLICY IF EXISTS "providers_insert_own" ON public.providers;
DROP POLICY IF EXISTS "providers_update_own" ON public.providers;
DROP POLICY IF EXISTS "providers_delete_own" ON public.providers;

-- Drop services_onsite policies
DROP POLICY IF EXISTS "Services onsite are viewable by everyone" ON public.services_onsite;
DROP POLICY IF EXISTS "Providers can manage own onsite services" ON public.services_onsite;
DROP POLICY IF EXISTS "services_onsite_select_all" ON public.services_onsite;
DROP POLICY IF EXISTS "services_onsite_insert_own" ON public.services_onsite;
DROP POLICY IF EXISTS "services_onsite_update_own" ON public.services_onsite;
DROP POLICY IF EXISTS "services_onsite_delete_own" ON public.services_onsite;

-- Drop services_online policies
DROP POLICY IF EXISTS "Services online are viewable by everyone" ON public.services_online;
DROP POLICY IF EXISTS "Providers can manage own online services" ON public.services_online;
DROP POLICY IF EXISTS "services_online_select_all" ON public.services_online;
DROP POLICY IF EXISTS "services_online_insert_own" ON public.services_online;
DROP POLICY IF EXISTS "services_online_update_own" ON public.services_online;
DROP POLICY IF EXISTS "services_online_delete_own" ON public.services_online;

-- Step 2: Ensure RLS is enabled on all tables
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_onsite ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_online ENABLE ROW LEVEL SECURITY;

-- Step 3: Create comprehensive RLS policies
-- ============================================

-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================

-- SELECT: Everyone can view all profiles (public directory)
CREATE POLICY "profiles_select_all"
  ON public.profiles
  FOR SELECT
  USING (true);

-- INSERT: Users can only insert their own profile (auth.uid() must match id)
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: Users can only update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- DELETE: Users can delete their own profile
CREATE POLICY "profiles_delete_own"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- ============================================
-- PROVIDERS TABLE POLICIES
-- ============================================

-- SELECT: Everyone can view all provider profiles (public directory)
CREATE POLICY "providers_select_all"
  ON public.providers
  FOR SELECT
  USING (true);

-- INSERT: Only authenticated users can create their provider profile
CREATE POLICY "providers_insert_own"
  ON public.providers
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'provider'
    )
  );

-- UPDATE: Providers can only update their own provider profile
CREATE POLICY "providers_update_own"
  ON public.providers
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Providers can delete their own provider profile
CREATE POLICY "providers_delete_own"
  ON public.providers
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SERVICES_ONSITE TABLE POLICIES
-- ============================================

-- SELECT: Everyone can view all onsite services
CREATE POLICY "services_onsite_select_all"
  ON public.services_onsite
  FOR SELECT
  USING (true);

-- INSERT: Only the provider who owns the provider profile can create onsite services
CREATE POLICY "services_onsite_insert_own"
  ON public.services_onsite
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.providers
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- UPDATE: Only the provider who owns the service can update it
CREATE POLICY "services_onsite_update_own"
  ON public.services_onsite
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.providers
      WHERE id = provider_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.providers
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- DELETE: Only the provider who owns the service can delete it
CREATE POLICY "services_onsite_delete_own"
  ON public.services_onsite
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.providers
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- ============================================
-- SERVICES_ONLINE TABLE POLICIES
-- ============================================

-- SELECT: Everyone can view all online services
CREATE POLICY "services_online_select_all"
  ON public.services_online
  FOR SELECT
  USING (true);

-- INSERT: Only the provider who owns the provider profile can create online services
CREATE POLICY "services_online_insert_own"
  ON public.services_online
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.providers
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- UPDATE: Only the provider who owns the service can update it
CREATE POLICY "services_online_update_own"
  ON public.services_online
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.providers
      WHERE id = provider_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.providers
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- DELETE: Only the provider who owns the service can delete it
CREATE POLICY "services_online_delete_own"
  ON public.services_online
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.providers
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check RLS is enabled on all tables
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'providers', 'services_onsite', 'services_online')
ORDER BY tablename;

-- Check all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'providers', 'services_onsite', 'services_online')
ORDER BY tablename, policyname;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- ✅ RLS policies successfully applied!
-- ✅ All tables are now properly secured
-- 
-- Summary:
-- - profiles: Public read, users manage own
-- - providers: Public read, providers manage own
-- - services_onsite: Public read, providers manage own
-- - services_online: Public read, providers manage own
