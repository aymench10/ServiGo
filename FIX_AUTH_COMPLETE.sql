-- ============================================
-- CORRECTION COMPLETE - AUTHENTIFICATION
-- ============================================

-- 1. Créer ou recréer la fonction de création automatique de profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
    phone = COALESCE(EXCLUDED.phone, profiles.phone);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Supprimer l'ancien trigger s'il existe et créer le nouveau
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 4. Supprimer toutes les anciennes politiques
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

DROP POLICY IF EXISTS "Providers can view their own profile" ON provider_profiles;
DROP POLICY IF EXISTS "Providers can update their own profile" ON provider_profiles;
DROP POLICY IF EXISTS "Providers can insert their own profile" ON provider_profiles;
DROP POLICY IF EXISTS "Public provider profiles are viewable" ON provider_profiles;

DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Providers can view bookings for their services" ON bookings;

DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;

-- 5. Créer les nouvelles politiques RLS pour profiles
CREATE POLICY "Enable read access for all users"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 6. Créer les politiques RLS pour provider_profiles
CREATE POLICY "Enable read access for all users"
  ON provider_profiles FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated providers"
  ON provider_profiles FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'provider')
  );

CREATE POLICY "Enable update for provider owners"
  ON provider_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. Créer les politiques RLS pour bookings
CREATE POLICY "Enable read for booking participants"
  ON bookings FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT user_id FROM provider_profiles WHERE id = provider_id
    )
  );

CREATE POLICY "Enable insert for authenticated users"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for booking participants"
  ON bookings FOR UPDATE
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT user_id FROM provider_profiles WHERE id = provider_id
    )
  )
  WITH CHECK (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT user_id FROM provider_profiles WHERE id = provider_id
    )
  );

-- 8. Créer les politiques RLS pour reviews
CREATE POLICY "Enable read access for all users"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for review owners"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for review owners"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);
