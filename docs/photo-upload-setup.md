# Photo Upload Setup Guide

This guide explains how to set up photo upload functionality in your TriFi application using Supabase Storage.

## Features

The photo upload system includes:

- ✅ Drag-and-drop file upload
- ✅ File validation (size, type)
- ✅ Image preview before upload
- ✅ Progress tracking during upload
- ✅ Support for JPG, PNG, GIF, and WebP formats
- ✅ 1MB file size limit
- ✅ Demo mode when Supabase isn't configured

## Quick Start (Demo Mode)

The photo upload functionality works out of the box in demo mode. When Supabase isn't configured, photos are stored as local blob URLs for preview purposes.

To test the upload functionality:

1. Go to **Settings** → **Account** tab
2. Click **Change Photo** button
3. Select or drag a photo file
4. Click **Upload Photo**

## Production Setup with Supabase

### Step 1: Configure Supabase Environment Variables

Make sure your `.env.local` file contains:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 2: Create Storage Bucket

The application will attempt to create the `photos` bucket automatically. However, you can also create it manually:

1. Go to your Supabase dashboard
2. Navigate to **Storage**
3. Click **New Bucket**
4. Name it `photos`
5. Make it **Public**
6. Set file size limit to **1MB**
7. Allow MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`

### Step 3: Set up Storage Policies (Optional)

For production use, you may want to create RLS policies:

```sql
-- Allow authenticated users to upload photos
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'photos' 
  AND auth.role() = 'authenticated'
);

-- Allow public access to photos
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'photos');

-- Allow users to delete their own photos
CREATE POLICY "Allow users to delete own photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Step 4: Test the Setup

1. Go to **Settings** → **Data** tab
2. Click **Test Supabase Connection**
3. Verify the connection is successful
4. Try uploading a photo in the **Account** tab

## File Organization

Photos are organized in the storage bucket as follows:

```
photos/
├── avatars/
│   ├── avatar-1640995200000-abc123.jpg
│   ├── avatar-1640995300000-def456.png
│   └── ...
└── [other folders for future features]
```

## API Reference

### Components

#### `PhotoUploadModal`

A modal component for uploading photos with drag-and-drop support.

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Called when modal closes
- `onUploadComplete: (url: string) => void` - Called when upload succeeds
- `currentPhotoUrl?: string` - Current photo URL (enables remove option)

**Usage:**
```tsx
<PhotoUploadModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onUploadComplete={(url) => setAvatarUrl(url)}
  currentPhotoUrl={avatarUrl}
/>
```

### Utility Functions

#### `uploadPhoto(file: File, folder?: string)`

Uploads a photo to Supabase Storage.

**Parameters:**
- `file: File` - The file to upload
- `folder: string` - Optional folder name (default: 'avatars')

**Returns:**
```typescript
Promise<{
  success: boolean
  url?: string
  error?: string
}>
```

#### `validateImageFile(file: File)`

Validates if a file meets the requirements.

**Returns:**
```typescript
{
  valid: boolean
  error?: string
}
```

#### `deletePhoto(photoUrl: string)`

Deletes a photo from storage.

**Returns:**
```typescript
Promise<{
  success: boolean
  message: string
}>
```

## Configuration

### File Restrictions

Current file restrictions (configurable in `lib/storage.ts`):

- **Size limit:** 1MB
- **Allowed types:** JPG, PNG, GIF, WebP
- **Naming:** Auto-generated with timestamp and random suffix

### Customization

To modify restrictions, edit the `PHOTO_BUCKET_CONFIG` in `lib/storage.ts`:

```typescript
export const PHOTO_BUCKET_CONFIG: StorageBucketConfig = {
  name: 'photos',
  public: true,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  fileSizeLimit: 1024 * 1024 // 1MB
}
```

## Troubleshooting

### Common Issues

1. **"Upload failed" error**
   - Check Supabase connection
   - Verify storage bucket exists
   - Check file size and type

2. **"Supabase is not configured" warning**
   - Add environment variables
   - Restart development server

3. **Photos not displaying**
   - Check bucket is public
   - Verify correct URL format
   - Check browser console for errors

### Debug Mode

To debug storage issues, check the browser console and network tab. The application logs detailed error messages for troubleshooting.

## Security Considerations

1. **File validation:** All uploads are validated client-side and server-side
2. **Size limits:** Enforced to prevent abuse
3. **Type restrictions:** Only image files are allowed
4. **Authentication:** Configure RLS policies for production use
5. **Public access:** Consider if you need public or private buckets

## Future Enhancements

Planned features for future releases:

- [ ] Image compression before upload
- [ ] Multiple file selection
- [ ] Crop/resize functionality
- [ ] Progress tracking for large files
- [ ] Thumbnail generation
- [ ] CDN integration
- [ ] Backup to multiple storage providers 