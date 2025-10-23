-- ============================================
-- FIX RLS POLICIES FOR PROFILES TABLE
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Drop all existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- Step 2: Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create proper policies
-- Allow authenticated users to read their own profile
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Step 4: Check if profile exists for the current user
-- Replace the UUID with your actual user ID from the error logs
SELECT 
  id, 
  email, 
  full_name, 
  role,
  phone,
  created_at
FROM profiles 
WHERE id = '3dd1d8f3-aaa8-4fc7-82f3-085632bd6095';

-- Step 5: If no profile exists, create it
-- IMPORTANT: Update the values below with actual user data
-- You can get the email from Supabase Authentication > Users
/*
INSERT INTO profiles (id, email, full_name, role, phone)
VALUES (
  '3dd1d8f3-aaa8-4fc7-82f3-085632bd6095',  -- User ID from auth
  'user@email.com',                          -- Get from Supabase Auth
  'User Full Name',                          -- User's name
  'client',                                  -- or 'provider'
  '+21612345678'                             -- Phone number
)
ON CONFLICT (id) DO NOTHING;
*/

-- Step 6: Verify the policies were created
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
WHERE tablename = 'profiles';

-- Step 7: Test the query (should work after policies are fixed)
-- This simulates what the app is trying to do
SELECT * FROM profiles WHERE id = auth.uid();
