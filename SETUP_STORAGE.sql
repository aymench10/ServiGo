-- ========================================
-- SETUP SUPABASE STORAGE FOR SERVICE IMAGES
-- Run this in Supabase SQL Editor
-- ========================================

-- 1. Create storage bucket for service images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Make the profiles bucket public (for existing images)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'profiles';

-- 3. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Profiles" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to profiles" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- 4. Allow public access to read files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'service-images' );

CREATE POLICY "Public Access Profiles"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profiles' );

-- 5. Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'service-images' );

CREATE POLICY "Authenticated users can upload to profiles"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'profiles' );

-- 6. Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'service-images' );

-- 7. Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'service-images' );

-- 8. Verify setup
SELECT 
    'Storage buckets:' as info,
    id,
    name,
    public,
    CASE WHEN public THEN '✅ Public' ELSE '❌ Private' END as status
FROM storage.buckets
WHERE id IN ('service-images', 'profiles');
