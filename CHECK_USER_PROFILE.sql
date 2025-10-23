-- ============================================
-- CHECK USER PROFILE AND CREATE IF MISSING
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Check if user exists in auth.users
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'role' as role,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE id = '3dd1d8f3-aaa8-4fc7-82f3-085632bd6095';

-- Step 2: Check if profile exists
SELECT 
  id,
  email,
  full_name,
  role,
  phone,
  created_at
FROM profiles
WHERE id = '3dd1d8f3-aaa8-4fc7-82f3-085632bd6095';

-- Step 3: If profile doesn't exist, create it from auth data
-- This will automatically pull data from auth.users
INSERT INTO profiles (id, email, full_name, role, phone)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'User'),
  COALESCE(raw_user_meta_data->>'role', 'client'),
  COALESCE(raw_user_meta_data->>'phone', '')
FROM auth.users
WHERE id = '3dd1d8f3-aaa8-4fc7-82f3-085632bd6095'
ON CONFLICT (id) DO NOTHING;

-- Step 4: Verify profile was created
SELECT 
  id,
  email,
  full_name,
  role,
  phone,
  created_at
FROM profiles
WHERE id = '3dd1d8f3-aaa8-4fc7-82f3-085632bd6095';

-- Step 5: If user is a provider, check provider_profile
SELECT 
  user_id,
  business_name,
  service_category,
  location,
  description,
  created_at
FROM provider_profiles
WHERE user_id = '3dd1d8f3-aaa8-4fc7-82f3-085632bd6095';
