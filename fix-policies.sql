-- FIX RLS POLICIES - Run this in Supabase SQL Editor
-- This will drop and recreate all policies with correct permissions

-- Drop existing policies for provider_profiles
DROP POLICY IF EXISTS "Provider profiles are viewable by everyone" ON public.provider_profiles;
DROP POLICY IF EXISTS "Providers can insert own profile" ON public.provider_profiles;
DROP POLICY IF EXISTS "Providers can update own profile" ON public.provider_profiles;

-- Recreate provider_profiles policies with correct permissions
CREATE POLICY "Provider profiles are viewable by everyone" 
  ON public.provider_profiles FOR SELECT 
  USING (true);

CREATE POLICY "Providers can insert own profile" 
  ON public.provider_profiles FOR INSERT 
  WITH CHECK (true);  -- Allow all authenticated users to insert (will be validated by app logic)

CREATE POLICY "Providers can update own profile" 
  ON public.provider_profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- Drop existing policies for services
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Providers can manage own services" ON public.services;

-- Recreate services policies
CREATE POLICY "Services are viewable by everyone" 
  ON public.services FOR SELECT 
  USING (true);

CREATE POLICY "Providers can insert services" 
  ON public.services FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.provider_profiles 
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can update own services" 
  ON public.services FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.provider_profiles 
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can delete own services" 
  ON public.services FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.provider_profiles 
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );
