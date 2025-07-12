import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    const { data, error } = await db.getTransactions(organizationId, limit)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Apply filters
    let filteredData = data || []
    
    if (type && type !== 'all') {
      filteredData = filteredData.filter(t => t.type === type)
    }
    
    if (status && status !== 'all') {
      filteredData = filteredData.filter(t => t.status === status)
    }
    
    if (startDate) {
      filteredData = filteredData.filter(t => new Date(t.transaction_date) >= new Date(startDate))
    }
    
    if (endDate) {
      filteredData = filteredData.filter(t => new Date(t.transaction_date) <= new Date(endDate))
    }

    return NextResponse.json({ data: filteredData })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { organizationId, userId, ...transactionData } = body

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

    const transaction = {
      ...transactionData,
      organization_id: organizationId,
      created_by: userProfile.id,
      transaction_date: transactionData.transaction_date || new Date().toISOString().split('T')[0],
      status: transactionData.status || 'completed'
    }

    const { data, error } = await db.createTransaction(transaction)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}