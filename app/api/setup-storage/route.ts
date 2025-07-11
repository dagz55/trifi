import { NextResponse } from 'next/server'
import { ensurePhotosBucketExists } from '@/lib/storage'

export async function POST() {
  try {
    const result = await ensurePhotosBucketExists()
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: `Storage setup failed: ${error.message}`,
      error: error,
      instructions: 'The storage migration has been applied. If you continue to see errors, please check your Supabase configuration or contact support.',
      timestamp: new Date().toISOString()
    })
  }
}