-- Fix Storage RLS Policies for Profile Photo Upload
-- This SQL should be run in the Supabase SQL Editor

-- Enable RLS on storage tables
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Allow authenticated users to view buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Allow public to view public buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Allow authenticated users to upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view photos in public bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete photos" ON storage.objects;

-- Create policies for buckets
CREATE POLICY "Allow authenticated users to view buckets"
ON storage.buckets
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow public to view public buckets"
ON storage.buckets
FOR SELECT
TO public
USING (public = true);

-- Create policies for objects with proper bucket access
CREATE POLICY "Allow authenticated users to upload photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Allow authenticated users to view photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'photos');

CREATE POLICY "Allow public to view photos in public bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'photos');

CREATE POLICY "Allow authenticated users to update photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'photos')
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Allow authenticated users to delete photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'photos');

-- Also create a policy for anon users to upload photos (for cases where JWT is not properly recognized)
CREATE POLICY "Allow anon users to upload photos"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'photos');

-- And allow anon users to view photos
CREATE POLICY "Allow anon users to view photos"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'photos');

-- Also add policies for anon users to update and delete their own photos
CREATE POLICY "Allow anon users to update photos"
ON storage.objects
FOR UPDATE
TO anon
USING (bucket_id = 'photos')
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Allow anon users to delete photos"
ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'photos');