-- ========================================
-- SIMPLE STORAGE FIX - Run this in Supabase
-- ========================================

-- Step 1: Create service-images bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Step 2: Make profiles bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'profiles';

-- Step 3: Enable RLS on storage.objects (required for policies)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop all existing policies to start fresh
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Public Access Profiles" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can upload to profiles" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
    DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
END $$;

-- Step 5: Create simple public read policy for both buckets
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('service-images', 'profiles'));

-- Step 6: Allow authenticated users to upload to service-images
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'service-images');

-- Step 7: Allow authenticated users to upload to profiles
CREATE POLICY "Authenticated users can upload to profiles"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profiles');

-- Step 8: Allow authenticated users to update their files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id IN ('service-images', 'profiles'));

-- Step 9: Allow authenticated users to delete their files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id IN ('service-images', 'profiles'));

-- Step 10: Verify everything is set up correctly
SELECT 
    '✅ STORAGE BUCKETS' as check_type,
    id as bucket_id,
    name as bucket_name,
    CASE WHEN public THEN '✅ PUBLIC' ELSE '❌ PRIVATE' END as status
FROM storage.buckets
WHERE id IN ('service-images', 'profiles')
ORDER BY id;

-- Step 11: Show policies
SELECT 
    '✅ STORAGE POLICIES' as check_type,
    policyname as policy_name,
    cmd as command,
    CASE 
        WHEN roles = '{public}' THEN '👥 Public'
        WHEN roles = '{authenticated}' THEN '🔐 Authenticated'
        ELSE roles::text
    END as who_can_use
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;
