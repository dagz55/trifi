#!/usr/bin/env node

// Test script to debug chat channel creation
const { createClient } = require('@supabase/supabase-js')

// Manual environment loading since dotenv might not be available
const fs = require('fs')
const path = require('path')

function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf8')
    const lines = envContent.split('\n')
    
    for (const line of lines) {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim()
      }
    }
  } catch (error) {
    console.warn('Could not load .env.local file:', error.message)
  }
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testChannelCreation() {
  console.log('🔍 Testing chat channel creation...')
  
  try {
    // First, let's check if organizations table exists and has data
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id, name')
      .limit(1)
    
    console.log('Organizations query result:', { orgs, orgError })
    
    if (!orgs || orgs.length === 0) {
      console.log('❌ No organizations found - creating test organization...')
      
      const { data: newOrg, error: createOrgError } = await supabase
        .from('organizations')
        .insert({
          name: 'Test Organization',
          description: 'Test organization for chat testing'
        })
        .select()
        .single()
      
      if (createOrgError) {
        console.error('Failed to create test organization:', createOrgError)
        return
      }
      
      console.log('✅ Created test organization:', newOrg)
      orgs.push(newOrg)
    }
    
    const testOrgId = orgs[0].id
    console.log('Using organization ID:', testOrgId)
    
    // Check user_profiles
    const { data: users, error: userError } = await supabase
      .from('user_profiles')
      .select('id, full_name')
      .limit(1)
    
    console.log('User profiles query result:', { users, userError })
    
    if (!users || users.length === 0) {
      console.log('❌ No user profiles found - creating test user...')
      
      const { data: newUser, error: createUserError } = await supabase
        .from('user_profiles')
        .insert({
          clerk_user_id: 'test_user_' + Date.now(),
          full_name: 'Test User',
          email: 'test@example.com'
        })
        .select()
        .single()
      
      if (createUserError) {
        console.error('Failed to create test user:', createUserError)
        return
      }
      
      console.log('✅ Created test user:', newUser)
      users.push(newUser)
    }
    
    const testUserId = users[0].id
    console.log('Using user ID:', testUserId)
    
    // Now try to create a chat channel
    const channelData = {
      name: 'Test Channel ' + Date.now(),
      description: 'Test channel for debugging',
      type: 'public',
      organization_id: testOrgId,
      created_by: testUserId
    }
    
    console.log('Attempting to create channel with data:', channelData)
    
    const { data: newChannel, error: channelError } = await supabase
      .from('chat_channels')
      .insert(channelData)
      .select()
      .single()
    
    if (channelError) {
      console.error('❌ Channel creation failed:', channelError)
      console.error('Error details:', JSON.stringify(channelError, null, 2))
    } else {
      console.log('✅ Channel created successfully:', newChannel)
    }
    
  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

testChannelCreation()