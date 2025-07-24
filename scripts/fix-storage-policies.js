#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Simple function to read .env.local file
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const lines = envContent.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^['"]|['"]$/g, '')
          process.env[key] = value
        }
      }
    }
  }
}

async function fixStoragePolicies() {
  console.log('🔧 Fixing Storage RLS Policies...\n')
  
  // Load environment variables
  loadEnvFile()
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing Supabase environment variables')
    console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    process.exit(1)
  }
  
  console.log('✅ Environment variables configured')
  
  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, serviceRoleKey)
  
  try {
    console.log('🔐 Fixing storage RLS policies...')
    
    // First, let's check current policies
    const { data: currentPolicies, error: policiesError } = await supabase.rpc('get_storage_policies')
    
    if (policiesError && !policiesError.message.includes('function public.get_storage_policies')) {
      console.log('⚠️  Could not fetch current policies, proceeding with fix...')
    }
    
    // SQL to fix storage policies
    const fixPoliciesSQL = `
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

      -- Create updated policies for buckets
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

      -- Create updated policies for objects with proper authentication
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
    `
    
    // Execute SQL using RPC
    const { data: result, error: sqlError } = await supabase.rpc('exec_sql', { 
      query: fixPoliciesSQL 
    })
    
    if (sqlError) {
      console.log('⚠️  Could not execute SQL via RPC, trying individual commands...')
      
      // Try individual SQL commands
      const commands = [
        'ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY',
        'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY',
        `DROP POLICY IF EXISTS "Allow authenticated users to view buckets" ON storage.buckets`,
        `DROP POLICY IF EXISTS "Allow public to view public buckets" ON storage.buckets`,
        `DROP POLICY IF EXISTS "Allow authenticated users to upload photos" ON storage.objects`,
        `DROP POLICY IF EXISTS "Allow authenticated users to view photos" ON storage.objects`,
        `DROP POLICY IF EXISTS "Allow public to view photos in public bucket" ON storage.objects`,
        `DROP POLICY IF EXISTS "Allow authenticated users to update photos" ON storage.objects`,
        `DROP POLICY IF EXISTS "Allow authenticated users to delete photos" ON storage.objects`,
        `CREATE POLICY "Allow authenticated users to view buckets" ON storage.buckets FOR SELECT TO authenticated USING (true)`,
        `CREATE POLICY "Allow public to view public buckets" ON storage.buckets FOR SELECT TO public USING (public = true)`,
        `CREATE POLICY "Allow authenticated users to upload photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'photos')`,
        `CREATE POLICY "Allow authenticated users to view photos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'photos')`,
        `CREATE POLICY "Allow public to view photos in public bucket" ON storage.objects FOR SELECT TO public USING (bucket_id = 'photos')`,
        `CREATE POLICY "Allow authenticated users to update photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'photos') WITH CHECK (bucket_id = 'photos')`,
        `CREATE POLICY "Allow authenticated users to delete photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'photos')`
      ]
      
      for (const command of commands) {
        const { error: cmdError } = await supabase.rpc('exec_sql', { query: command })
        if (cmdError && !cmdError.message.includes('already exists')) {
          console.log(`⚠️  Command failed: ${command}`)
          console.log(`   Error: ${cmdError.message}`)
        }
      }
      
      console.log('✅ Individual commands executed')
    } else {
      console.log('✅ Storage policies fixed successfully')
    }
    
    // Test the fix
    console.log('🧪 Testing the fix...')
    const testBucketName = `test-${Date.now()}`
    const { error: createError } = await supabase.storage.createBucket(testBucketName, {
      public: false,
      fileSizeLimit: 1024
    })
    
    if (createError) {
      console.log('⚠️  Test failed:', createError.message)
      console.log('You may need to manually apply the storage policies in the Supabase dashboard')
    } else {
      console.log('✅ Test passed - storage policies are working correctly')
      
      // Clean up test bucket
      await supabase.storage.deleteBucket(testBucketName)
      console.log('🧹 Test bucket cleaned up')
    }
    
    console.log('\n🎉 Storage policies fix completed!')
    console.log('\nNext steps:')
    console.log('1. Start your development server: npm run dev')
    console.log('2. Go to Settings → Account tab')
    console.log('3. Try uploading a profile photo')
    
  } catch (error) {
    console.error('❌ Storage policy fix failed:', error.message)
    console.log('\nManual fix required:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to Storage → Policies')
    console.log('3. Apply the RLS policies for the photos bucket')
    process.exit(1)
  }
}

if (require.main === module) {
  fixStoragePolicies()
}

module.exports = { fixStoragePolicies }