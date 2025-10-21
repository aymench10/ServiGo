-- ========================================
-- FIX ONLINE SERVICES TABLE
-- Run this in Supabase SQL Editor
-- ========================================

-- 1. Create services_online table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.services_online (
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

-- 2. Disable RLS on services_online
ALTER TABLE public.services_online DISABLE ROW LEVEL SECURITY;

-- 3. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_services_online_provider ON public.services_online(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_online_active ON public.services_online(is_active);

-- 4. Verify table exists and RLS is disabled
SELECT 
    'services_online table status:' as info,
    CASE WHEN EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'services_online'
    ) THEN '✅ Table exists' ELSE '❌ Table missing' END as table_status,
    CASE WHEN (
        SELECT relrowsecurity 
        FROM pg_class 
        WHERE relname = 'services_online'
    ) THEN '❌ RLS Enabled' ELSE '✅ RLS Disabled' END as rls_status;

-- 5. Show all online services
SELECT 
    'Current online services:' as info,
    COUNT(*) as total_services
FROM public.services_online;
