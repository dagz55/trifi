import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    
    // Test if chat tables exist by trying to query them
    const tests = []
    
    // Test chat_channels table
    const { data: channels, error: channelsError } = await supabase
      .from('chat_channels')
      .select('count(*)')
      .limit(1)
    
    tests.push({
      name: 'chat_channels_table',
      success: !channelsError,
      error: channelsError?.message || null
    })
    
    // Test chat_messages table
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('count(*)')
      .limit(1)
    
    tests.push({
      name: 'chat_messages_table',
      success: !messagesError,
      error: messagesError?.message || null
    })
    
    // Test user_profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('count(*)')
      .limit(1)
    
    tests.push({
      name: 'user_profiles_table',
      success: !profilesError,
      error: profilesError?.message || null
    })
    
    // Test organizations table
    const { data: orgs, error: orgsError } = await supabase
      .from('organizations')
      .select('count(*)')
      .limit(1)
    
    tests.push({
      name: 'organizations_table',
      success: !orgsError,
      error: orgsError?.message || null
    })
    
    return NextResponse.json({
      success: true,
      tests
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    })
  }
}