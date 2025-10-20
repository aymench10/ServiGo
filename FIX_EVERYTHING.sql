-- ========================================
-- RUN THIS ENTIRE SCRIPT IN SUPABASE
-- It will fix ALL problems at once
-- ========================================

-- STEP 1: Disable RLS temporarily to fix policies
ALTER TABLE public.provider_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;

-- STEP 2: Drop all existing policies
DROP POLICY IF EXISTS "Provider profiles are viewable by everyone" ON public.provider_profiles;
DROP POLICY IF EXISTS "Providers can insert own profile" ON public.provider_profiles;
DROP POLICY IF EXISTS "Providers can update own profile" ON public.provider_profiles;
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Providers can manage own services" ON public.services;
DROP POLICY IF EXISTS "Providers can insert services" ON public.services;
DROP POLICY IF EXISTS "Providers can update own services" ON public.services;
DROP POLICY IF EXISTS "Providers can delete own services" ON public.services;

-- STEP 3: Create provider profile for ALL users with role 'provider' who don't have one
INSERT INTO public.provider_profiles (user_id, business_name, service_category, location, description)
SELECT 
  p.id,
  p.full_name,
  'Autre',
  'Tunis',
  'Services professionnels'
FROM public.profiles p
WHERE p.role = 'provider'
AND NOT EXISTS (
  SELECT 1 FROM public.provider_profiles pp WHERE pp.user_id = p.id
);

-- STEP 4: Re-enable RLS with SIMPLE policies
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create SIMPLE policies that WORK
CREATE POLICY "Everyone can view provider profiles" 
  ON public.provider_profiles FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert provider profiles" 
  ON public.provider_profiles FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own provider profile" 
  ON public.provider_profiles FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view services" 
  ON public.services FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert services" 
  ON public.services FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own services" 
  ON public.services FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.provider_profiles 
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own services" 
  ON public.services FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.provider_profiles 
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- STEP 6: Verify everything worked
SELECT 'Profiles created:' as status, COUNT(*) as count FROM public.profiles WHERE role = 'provider';
SELECT 'Provider profiles created:' as status, COUNT(*) as count FROM public.provider_profiles;
SELECT 'RLS enabled on provider_profiles:' as status, relrowsecurity as enabled FROM pg_class WHERE relname = 'provider_profiles';
SELECT 'RLS enabled on services:' as status, relrowsecurity as enabled FROM pg_class WHERE relname = 'services';
