import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const status = searchParams.get('status')

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    const { data, error } = await db.getProjects(organizationId)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Apply status filter
    let filteredData = data || []
    
    if (status && status !== 'all') {
      filteredData = filteredData.filter(p => p.status === status)
    }

    return NextResponse.json({ data: filteredData })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { organizationId, userId, ...projectData } = body

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user profile to set created_by
    const { data: userProfile } = await db.getUserProfileByClerkId(userId)
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const project = {
      ...projectData,
      organization_id: organizationId,
      created_by: userProfile.id,
      status: projectData.status || 'active',
      spent: projectData.spent || 0
    }

    const { data, error } = await db.createProject(project)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}