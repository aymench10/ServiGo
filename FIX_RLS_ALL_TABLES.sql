-- ============================================
-- COMPLETE RLS FIX FOR ALL TABLES
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Drop all existing policies
-- ============================================

-- Drop profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

-- Drop provider_profiles policies
DROP POLICY IF EXISTS "Provider profiles are viewable by everyone" ON public.provider_profiles;
DROP POLICY IF EXISTS "Providers can insert own profile" ON public.provider_profiles;
DROP POLICY IF EXISTS "Providers can update own profile" ON public.provider_profiles;
DROP POLICY IF EXISTS "Providers can delete own profile" ON public.provider_profiles;

-- Drop services policies
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Providers can manage own services" ON public.services;
DROP POLICY IF EXISTS "Providers can insert services" ON public.services;
DROP POLICY IF EXISTS "Providers can update own services" ON public.services;
DROP POLICY IF EXISTS "Providers can delete own services" ON public.services;

-- Drop bookings policies
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Clients can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Clients can delete own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Providers can update bookings" ON public.bookings;

-- Drop reviews policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Clients can create reviews for their bookings" ON public.reviews;
DROP POLICY IF EXISTS "Clients can update own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Clients can delete own reviews" ON public.reviews;

-- Drop favorites policies
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete favorites" ON public.favorites;

-- Step 2: Ensure RLS is enabled on all tables
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

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
-- PROVIDER_PROFILES TABLE POLICIES
-- ============================================

-- SELECT: Everyone can view all provider profiles (public directory)
CREATE POLICY "provider_profiles_select_all"
  ON public.provider_profiles
  FOR SELECT
  USING (true);

-- INSERT: Only providers can create their provider profile
CREATE POLICY "provider_profiles_insert_own"
  ON public.provider_profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'provider'
    )
  );

-- UPDATE: Providers can only update their own provider profile
CREATE POLICY "provider_profiles_update_own"
  ON public.provider_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Providers can delete their own provider profile
CREATE POLICY "provider_profiles_delete_own"
  ON public.provider_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SERVICES TABLE POLICIES
-- ============================================

-- SELECT: Everyone can view all active services
CREATE POLICY "services_select_all"
  ON public.services
  FOR SELECT
  USING (true);

-- INSERT: Only the provider who owns the provider_profile can create services
CREATE POLICY "services_insert_own"
  ON public.services
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.provider_profiles
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- UPDATE: Only the provider who owns the service can update it
CREATE POLICY "services_update_own"
  ON public.services
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.provider_profiles
      WHERE id = provider_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.provider_profiles
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- DELETE: Only the provider who owns the service can delete it
CREATE POLICY "services_delete_own"
  ON public.services
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.provider_profiles
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- ============================================
-- BOOKINGS TABLE POLICIES
-- ============================================

-- SELECT: Clients can view their own bookings, providers can view bookings for their services
CREATE POLICY "bookings_select_own"
  ON public.bookings
  FOR SELECT
  USING (
    auth.uid() = client_id OR
    EXISTS (
      SELECT 1 FROM public.provider_profiles
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- INSERT: Only clients can create bookings for themselves
CREATE POLICY "bookings_insert_client"
  ON public.bookings
  FOR INSERT
  WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'client'
    )
  );

-- UPDATE: Both clients and providers can update bookings
-- Clients can update their own bookings
-- Providers can update bookings for their services (e.g., change status)
CREATE POLICY "bookings_update_participants"
  ON public.bookings
  FOR UPDATE
  USING (
    auth.uid() = client_id OR
    EXISTS (
      SELECT 1 FROM public.provider_profiles
      WHERE id = provider_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() = client_id OR
    EXISTS (
      SELECT 1 FROM public.provider_profiles
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- DELETE: Only clients can delete their own bookings (cancel before confirmation)
CREATE POLICY "bookings_delete_client"
  ON public.bookings
  FOR DELETE
  USING (auth.uid() = client_id);

-- ============================================
-- REVIEWS TABLE POLICIES
-- ============================================

-- SELECT: Everyone can view all reviews (public)
CREATE POLICY "reviews_select_all"
  ON public.reviews
  FOR SELECT
  USING (true);

-- INSERT: Only clients can create reviews for their completed bookings
CREATE POLICY "reviews_insert_client"
  ON public.reviews
  FOR INSERT
  WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_id 
        AND client_id = auth.uid()
        AND status = 'completed'
    )
  );

-- UPDATE: Clients can update their own reviews
CREATE POLICY "reviews_update_own"
  ON public.reviews
  FOR UPDATE
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- DELETE: Clients can delete their own reviews
CREATE POLICY "reviews_delete_own"
  ON public.reviews
  FOR DELETE
  USING (auth.uid() = client_id);

-- ============================================
-- FAVORITES TABLE POLICIES
-- ============================================

-- SELECT: Users can only view their own favorites
CREATE POLICY "favorites_select_own"
  ON public.favorites
  FOR SELECT
  USING (auth.uid() = client_id);

-- INSERT: Users can add their own favorites
CREATE POLICY "favorites_insert_own"
  ON public.favorites
  FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- UPDATE: Users can update their own favorites (though typically not needed)
CREATE POLICY "favorites_update_own"
  ON public.favorites
  FOR UPDATE
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- DELETE: Users can remove their own favorites
CREATE POLICY "favorites_delete_own"
  ON public.favorites
  FOR DELETE
  USING (auth.uid() = client_id);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify RLS is working:

-- Check RLS is enabled on all tables
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'provider_profiles', 'services', 'bookings', 'reviews', 'favorites')
ORDER BY tablename;

-- Check all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- If you see this message, all RLS policies have been successfully applied!
-- Your tables are now properly secured with Row Level Security.
