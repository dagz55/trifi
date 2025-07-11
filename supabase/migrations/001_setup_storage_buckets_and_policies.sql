-- Migration: Setup storage buckets and RLS policies
-- Description: Creates the photos bucket and sets up proper RLS policies for storage operations

-- Note: RLS is already enabled on storage tables by default in Supabase
-- We only need to create the policies, not enable RLS

-- Create RLS policies for bucket operations
CREATE POLICY "Allow authenticated users to create buckets"
ON storage.buckets
FOR INSERT
TO authenticated
WITH CHECK (true);

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

-- Create RLS policies for object operations in the photos bucket
CREATE POLICY "Allow authenticated users to upload photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photos'
);

CREATE POLICY "Allow authenticated users to view photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'photos'
);

CREATE POLICY "Allow public to view photos in public bucket"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'photos'
);

CREATE POLICY "Allow authenticated users to update photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'photos'
);

CREATE POLICY "Allow authenticated users to delete photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'photos'
);

-- Create the photos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'photos',
  'photos',
  true,
  false,
  1048576, -- 1MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;