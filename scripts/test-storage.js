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

async function testStorageSetup() {
  console.log('🧪 Testing Storage Setup...\n')
  
  // Load environment variables
  loadEnvFile()
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables')
    console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
    process.exit(1)
  }
  
  console.log('✅ Environment variables configured')
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // Test database connection
    console.log('🔌 Testing database connection...')
    const { data: pingData, error: pingError } = await supabase.rpc('ping')
    
    if (pingError && !pingError.message.includes('function public.ping')) {
      console.error('❌ Database connection failed:', pingError.message)
      process.exit(1)
    }
    
    console.log('✅ Database connection successful')
    
    // Test storage bucket listing
    console.log('🪣 Testing storage bucket access...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Failed to list storage buckets:', listError.message)
      process.exit(1)
    }
    
    console.log('✅ Storage access successful')
    
    // Check if photos bucket exists
    const photosBucket = buckets.find(bucket => bucket.name === 'photos')
    
    if (photosBucket) {
      console.log('✅ Photos bucket exists')
      console.log(`   - Name: ${photosBucket.name}`)
      console.log(`   - Public: ${photosBucket.public}`)
      console.log(`   - File size limit: ${photosBucket.file_size_limit} bytes`)
    } else {
      console.log('⚠️  Photos bucket not found - will be created automatically on first upload')
    }
    
    // Test storage policies
    console.log('🔐 Testing storage policies...')
    
    // Try to create a test bucket (this will fail if policies aren't set up correctly)
    const testBucketName = `test-${Date.now()}`
    const { error: createError } = await supabase.storage.createBucket(testBucketName, {
      public: false,
      fileSizeLimit: 1024
    })
    
    if (createError) {
      console.log('⚠️  Storage policies may need adjustment:', createError.message)
    } else {
      console.log('✅ Storage policies working correctly')
      
      // Clean up test bucket
      await supabase.storage.deleteBucket(testBucketName)
      console.log('🧹 Test bucket cleaned up')
    }
    
    console.log('\n🎉 Storage setup test completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Start your development server: npm run dev')
    console.log('2. Go to Settings → Account tab')
    console.log('3. Try uploading a profile photo')
    
  } catch (error) {
    console.error('❌ Storage test failed:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  testStorageSetup()
}

module.exports = { testStorageSetup } 