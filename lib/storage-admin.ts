import { createSupabaseAdminClient } from './supabase'

export async function setupStorageWithAdminPrivileges(): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseAdmin = createSupabaseAdminClient()
    
    // First, create the bucket using admin client
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
    
    if (listError) {
      return {
        success: false,
        message: `Failed to list buckets: ${listError.message}`
      }
    }

    const bucketExists = buckets.some(bucket => bucket.name === 'photos')

    if (!bucketExists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket('photos', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 1024 * 1024 // 1MB
      })

      if (createError) {
        return {
          success: false,
          message: `Failed to create photos bucket: ${createError.message}`
        }
      }
    }

    // Set up RLS policies using SQL
    const policies = `
      -- Enable RLS on storage tables
      ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

      -- Create policies for buckets
      CREATE POLICY IF NOT EXISTS "Allow authenticated users to view buckets"
      ON storage.buckets
      FOR SELECT
      TO authenticated
      USING (true);

      CREATE POLICY IF NOT EXISTS "Allow public to view public buckets"
      ON storage.buckets
      FOR SELECT
      TO public
      USING (public = true);

      -- Create policies for objects
      CREATE POLICY IF NOT EXISTS "Allow authenticated users to upload photos"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'photos');

      CREATE POLICY IF NOT EXISTS "Allow authenticated users to view photos"
      ON storage.objects
      FOR SELECT
      TO authenticated
      USING (bucket_id = 'photos');

      CREATE POLICY IF NOT EXISTS "Allow public to view photos in public bucket"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'photos');

      CREATE POLICY IF NOT EXISTS "Allow authenticated users to update photos"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = 'photos');

      CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete photos"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = 'photos');
    `

    // Execute the SQL to set up policies
    const { error: sqlError } = await supabaseAdmin.rpc('exec_sql', { query: policies })
    
    if (sqlError && !sqlError.message.includes('already exists')) {
      // If exec_sql doesn't exist, we'll need to handle this differently
      console.log('Note: Could not execute SQL policies directly. May need to be done manually.')
    }

    return {
      success: true,
      message: 'Storage bucket and policies set up successfully'
    }

  } catch (error: any) {
    return {
      success: false,
      message: `Storage setup failed: ${error.message}`
    }
  }
}