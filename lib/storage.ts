import { getSupabaseClient, isSupabaseConfigured } from './supabase'

export interface StorageBucketConfig {
  name: string
  public: boolean
  allowedMimeTypes: string[]
  fileSizeLimit: number
}

export const PHOTO_BUCKET_CONFIG: StorageBucketConfig = {
  name: 'photos',
  public: true,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  fileSizeLimit: 1024 * 1024 // 1MB
}

/**
 * Creates the photos storage bucket if it doesn't exist
 * This should be called during app initialization or setup
 */
export async function ensurePhotosBucketExists(): Promise<{ success: boolean; message: string }> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Supabase is not configured'
      }
    }

    const supabase = getSupabaseClient()

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      return {
        success: false,
        message: `Failed to list buckets: ${listError.message}`
      }
    }

    const bucketExists = buckets.some(bucket => bucket.name === PHOTO_BUCKET_CONFIG.name)

    if (bucketExists) {
      return {
        success: true,
        message: 'Photos bucket already exists'
      }
    }

    // Create the bucket
    const { error: createError } = await supabase.storage.createBucket(
      PHOTO_BUCKET_CONFIG.name,
      {
        public: PHOTO_BUCKET_CONFIG.public,
        allowedMimeTypes: PHOTO_BUCKET_CONFIG.allowedMimeTypes,
        fileSizeLimit: PHOTO_BUCKET_CONFIG.fileSizeLimit
      }
    )

    if (createError) {
      return {
        success: false,
        message: `Failed to create photos bucket: ${createError.message}`
      }
    }

    return {
      success: true,
      message: 'Photos bucket created successfully'
    }

  } catch (error) {
    return {
      success: false,
      message: `Storage setup failed: ${error}`
    }
  }
}

/**
 * Uploads a file to the photos bucket
 */
export async function uploadPhoto(file: File, folder: string = 'avatars'): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      // Return a blob URL for demo purposes
      const blobUrl = URL.createObjectURL(file)
      return {
        success: true,
        url: blobUrl
      }
    }

    const supabase = getSupabaseClient()

    // Ensure photos bucket exists before upload
    const { data: bucketList, error: listErr } = await supabase.storage.listBuckets()
    if (listErr) {
      return { success: false, error: `Storage error: ${listErr.message}` }
    }
    const bucketExists = bucketList.some(b => b.name === PHOTO_BUCKET_CONFIG.name)
    if (!bucketExists) {
      const { error: createErr } = await supabase.storage.createBucket(PHOTO_BUCKET_CONFIG.name, {
        public: PHOTO_BUCKET_CONFIG.public,
        allowedMimeTypes: PHOTO_BUCKET_CONFIG.allowedMimeTypes,
        fileSizeLimit: PHOTO_BUCKET_CONFIG.fileSizeLimit,
      })
      if (createErr) {
        return { success: false, error: `Failed to create bucket: ${createErr.message}` }
      }
    }
 
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload file
    const { data, error } = await supabase.storage
      .from(PHOTO_BUCKET_CONFIG.name)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(PHOTO_BUCKET_CONFIG.name)
      .getPublicUrl(fileName)

    return {
      success: true,
      url: urlData.publicUrl
    }

  } catch (error) {
    return {
      success: false,
      error: `Upload failed: ${error}`
    }
  }
}

/**
 * Deletes a photo from storage
 */
export async function deletePhoto(photoUrl: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!isSupabaseConfigured()) {
      // For demo URLs (blob URLs), just revoke the object URL
      if (photoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoUrl)
      }
      return {
        success: true,
        message: 'Photo removed from demo storage'
      }
    }

    const supabase = getSupabaseClient()
    
    // Extract file path from URL
    const url = new URL(photoUrl)
    const pathSegments = url.pathname.split('/')
    const bucketIndex = pathSegments.findIndex(segment => segment === PHOTO_BUCKET_CONFIG.name)
    
    if (bucketIndex === -1) {
      return {
        success: false,
        message: 'Invalid photo URL'
      }
    }

    const filePath = pathSegments.slice(bucketIndex + 1).join('/')

    const { error } = await supabase.storage
      .from(PHOTO_BUCKET_CONFIG.name)
      .remove([filePath])

    if (error) {
      return {
        success: false,
        message: `Delete failed: ${error.message}`
      }
    }

    return {
      success: true,
      message: 'Photo deleted successfully'
    }

  } catch (error) {
    return {
      success: false,
      message: `Delete failed: ${error}`
    }
  }
}

/**
 * Validates if a file is a supported image type and size
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > PHOTO_BUCKET_CONFIG.fileSizeLimit) {
    return {
      valid: false,
      error: `File size must be less than ${PHOTO_BUCKET_CONFIG.fileSizeLimit / (1024 * 1024)}MB`
    }
  }

  // Check file type
  if (!PHOTO_BUCKET_CONFIG.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPG, PNG, GIF, and WebP files are allowed'
    }
  }

  return { valid: true }
} 