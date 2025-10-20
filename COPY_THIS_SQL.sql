-- COPY THIS ENTIRE FILE AND RUN IN SUPABASE SQL EDITOR
-- This fixes all RLS policy issues

-- Fix provider_profiles policies
DROP POLICY IF EXISTS "Provider profiles are viewable by everyone" ON public.provider_profiles;
DROP POLICY IF EXISTS "Providers can insert own profile" ON public.provider_profiles;
DROP POLICY IF EXISTS "Providers can update own profile" ON public.provider_profiles;

CREATE POLICY "Provider profiles are viewable by everyone" 
  ON public.provider_profiles FOR SELECT USING (true);

CREATE POLICY "Providers can insert own profile" 
  ON public.provider_profiles FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Providers can update own profile" 
  ON public.provider_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Fix services policies
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Providers can manage own services" ON public.services;
DROP POLICY IF EXISTS "Providers can insert services" ON public.services;
DROP POLICY IF EXISTS "Providers can update own services" ON public.services;
DROP POLICY IF EXISTS "Providers can delete own services" ON public.services;

CREATE POLICY "Services are viewable by everyone" 
  ON public.services FOR SELECT USING (true);

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
