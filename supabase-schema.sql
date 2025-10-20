-- ServiGO TN Database Schema
-- Run this SQL in your Supabase SQL Editor

-- IMPORTANT: Before running this SQL, create a storage bucket:
-- 1. Go to Storage in Supabase dashboard
-- 2. Click "New bucket"
-- 3. Name: "profiles"
-- 4. Public bucket: YES (check the box)
-- 5. Click "Create bucket"

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('client', 'provider')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Provider profiles (additional info for service providers)
CREATE TABLE public.provider_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  service_category TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  price_unit TEXT DEFAULT 'DT',
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE NOT NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, provider_id)
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_provider_profiles_user_id ON public.provider_profiles(user_id);
CREATE INDEX idx_provider_profiles_category ON public.provider_profiles(service_category);
CREATE INDEX idx_services_provider_id ON public.services(provider_id);
CREATE INDEX idx_services_category ON public.services(category);
CREATE INDEX idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_reviews_provider_id ON public.reviews(provider_id);
CREATE INDEX idx_favorites_client_id ON public.favorites(client_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- RLS Policies for provider_profiles
CREATE POLICY "Provider profiles are viewable by everyone" 
  ON public.provider_profiles FOR SELECT 
  USING (true);

CREATE POLICY "Providers can insert own profile" 
  ON public.provider_profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can update own profile" 
  ON public.provider_profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for services
CREATE POLICY "Services are viewable by everyone" 
  ON public.services FOR SELECT 
  USING (true);

CREATE POLICY "Providers can manage own services" 
  ON public.services FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.provider_profiles 
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings" 
  ON public.bookings FOR SELECT 
  USING (
    auth.uid() = client_id OR 
    EXISTS (
      SELECT 1 FROM public.provider_profiles 
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can create bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update own bookings" 
  ON public.bookings FOR UPDATE 
  USING (
    auth.uid() = client_id OR 
    EXISTS (
      SELECT 1 FROM public.provider_profiles 
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by everyone" 
  ON public.reviews FOR SELECT 
  USING (true);

CREATE POLICY "Clients can create reviews for their bookings" 
  ON public.reviews FOR INSERT 
  WITH CHECK (auth.uid() = client_id);

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites" 
  ON public.favorites FOR SELECT 
  USING (auth.uid() = client_id);

CREATE POLICY "Users can manage own favorites" 
  ON public.favorites FOR ALL 
  USING (auth.uid() = client_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_profiles_updated_at BEFORE UPDATE ON public.provider_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update provider rating
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.provider_profiles
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(2,1) 
      FROM public.reviews 
      WHERE provider_id = NEW.provider_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE provider_id = NEW.provider_id
    )
  WHERE id = NEW.provider_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update provider rating after review
CREATE TRIGGER update_provider_rating_after_review
AFTER INSERT ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_provider_rating();
