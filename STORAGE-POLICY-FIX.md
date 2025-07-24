# Storage Policy Fix for Profile Photo Upload

## Problem
Profile photo uploads are failing with the error: "Upload failed: new row violates row-level security policy"

## Solution
The storage bucket needs proper RLS (Row Level Security) policies to allow authenticated users to upload photos.

## How to Fix

### Option 1: Apply SQL in Supabase Dashboard
1. Go to your Supabase dashboard: https://app.supabase.com/
2. Select your project
3. Navigate to "SQL Editor" in the left sidebar
4. Copy and paste the entire content of `migrations/fix-storage-policies.sql`
5. Click "Run" to execute the SQL

### Option 2: Manual Policy Creation
1. Go to your Supabase dashboard
2. Navigate to "Storage" → "Policies"
3. Create the following policies:

#### For `storage.buckets` table:
- **Allow authenticated users to view buckets**
  - Target: `authenticated`
  - Operation: `SELECT`
  - Policy: `true`

- **Allow public to view public buckets**
  - Target: `public`
  - Operation: `SELECT`
  - Policy: `public = true`

#### For `storage.objects` table:
- **Allow authenticated users to upload photos**
  - Target: `authenticated`
  - Operation: `INSERT`
  - Policy: `bucket_id = 'photos'`

- **Allow authenticated users to view photos**
  - Target: `authenticated`
  - Operation: `SELECT`
  - Policy: `bucket_id = 'photos'`

- **Allow public to view photos in public bucket**
  - Target: `public`
  - Operation: `SELECT`
  - Policy: `bucket_id = 'photos'`

- **Allow authenticated users to update photos**
  - Target: `authenticated`
  - Operation: `UPDATE`
  - Policy: `bucket_id = 'photos'`

- **Allow authenticated users to delete photos**
  - Target: `authenticated`
  - Operation: `DELETE`
  - Policy: `bucket_id = 'photos'`

## Testing the Fix

After applying the policies:

1. Run the test script:
   ```bash
   node scripts/test-storage.js
   ```

2. Start your development server:
   ```bash
   npm run dev
   ```

3. Navigate to Settings → Account tab

4. Try uploading a profile photo

## What These Policies Do

- **Enable RLS**: Ensures all storage operations go through security checks
- **Authenticated Access**: Allows logged-in users to upload, view, update, and delete photos
- **Public Access**: Allows anyone to view photos in public buckets
- **Bucket Restriction**: Limits operations to the 'photos' bucket only

## If You're Still Having Issues

1. Check that your authentication (Clerk) is working properly
2. Verify that the user is properly authenticated when uploading
3. Check the browser console for any additional error messages
4. Try uploading a different image file type (JPG, PNG, GIF, or WebP)

## Files Modified
- `lib/storage.ts` - Updated with better error handling and instructions
- `migrations/fix-storage-policies.sql` - SQL script to apply the policies
- `scripts/fix-storage-policies.js` - Automated script (requires service role key)