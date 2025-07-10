import { testSupabaseConnection } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await testSupabaseConnection();
  return NextResponse.json(result);
}