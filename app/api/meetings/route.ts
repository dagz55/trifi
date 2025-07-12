import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    const { data, error } = await db.getMeetings(organizationId)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Apply filters
    let filteredData = data || []
    
    if (type && type !== 'all') {
      filteredData = filteredData.filter(m => m.type === type)
    }
    
    if (status && status !== 'all') {
      filteredData = filteredData.filter(m => m.status === status)
    }

    return NextResponse.json({ data: filteredData })
  } catch (error) {
    console.error('Error fetching meetings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { organizationId, userId, ...meetingData } = body

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user profile to set organizer_id
    const { data: userProfile } = await db.getUserProfileByClerkId(userId)
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const meeting = {
      ...meetingData,
      organization_id: organizationId,
      organizer_id: userProfile.id,
      status: meetingData.status || 'scheduled',
      duration_minutes: meetingData.duration_minutes || 60
    }

    const { data, error } = await db.createMeeting(meeting)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating meeting:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}