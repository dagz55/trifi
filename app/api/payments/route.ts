import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const invoiceId = searchParams.get('invoiceId')

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    const { data, error } = await db.getPayments(organizationId)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Apply invoice filter if provided
    let filteredData = data || []
    if (invoiceId) {
      filteredData = filteredData.filter(p => p.invoice_id === invoiceId)
    }

    return NextResponse.json({ data: filteredData })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { organizationId, userId, ...paymentData } = body

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

    const payment = {
      ...paymentData,
      organization_id: organizationId,
      created_by: userProfile.id,
      payment_date: paymentData.payment_date || new Date().toISOString().split('T')[0],
      status: paymentData.status || 'completed'
    }

    const { data, error } = await db.createPayment(payment)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}