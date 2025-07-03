import { useUser } from '@clerk/nextjs'
import { db } from './database'
import { UserProfile, Organization } from './database'

export interface OrganizationMembership {
  id: string
  organization_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  permissions?: any
  joined_at?: string
}

export class AuthService {
  // Get or create user profile for the current Clerk user
  async ensureUserProfile(clerkUser: any): Promise<{ data: UserProfile | null, error: any }> {
    if (!clerkUser) {
      return { data: null, error: { message: 'No user provided' } }
    }

    // Try to get existing user profile
    const { data: existingProfile, error: getError } = await db.getUserProfile(clerkUser.id)
    
    if (existingProfile && !getError) {
      return { data: existingProfile, error: null }
    }

    // Create new user profile if it doesn't exist
    const profileData = {
      clerk_user_id: clerkUser.id,
      full_name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      email: clerkUser.emailAddresses?.[0]?.emailAddress,
      avatar_url: clerkUser.imageUrl,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: 'en',
      currency: 'PHP',
      date_format: 'MM/dd/yyyy',
      theme: 'system'
    }

    return await db.createUserProfile(profileData)
  }

  // Create organization membership
  async createOrganizationMembership(organizationId: string, userProfileId: string, role: string = 'owner'): Promise<{ data: any | null, error: any }> {
    if (!db.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const membershipData = {
      organization_id: organizationId,
      user_id: userProfileId,
      role,
      joined_at: new Date().toISOString()
    }

    const { data, error } = await db.getSupabaseClient()
      .from('organization_members')
      .insert(membershipData)
      .select()
      .single()

    return { data, error }
  }

  // Get user's organizations
  async getUserOrganizations(userProfileId: string): Promise<{ data: Organization[], error: any }> {
    if (!db.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await db.getSupabaseClient()
      .from('organization_members')
      .select(`
        organization_id,
        role,
        organizations (*)
      `)
      .eq('user_id', userProfileId)

    if (error) {
      return { data: [], error }
    }

    const organizations = data?.map((membership: any) => membership.organizations).filter(Boolean) || []
    return { data: organizations, error: null }
  }

  // Get user's primary organization (first one or most recently created)
  async getUserPrimaryOrganization(userProfileId: string): Promise<{ data: Organization | null, error: any }> {
    const { data: organizations, error } = await this.getUserOrganizations(userProfileId)
    
    if (error || !organizations.length) {
      return { data: null, error }
    }

    // Return the first organization (could be enhanced to store a preference)
    return { data: organizations[0], error: null }
  }

  // Create organization with membership
  async createOrganizationWithMembership(organizationData: Partial<Organization>, userProfileId: string): Promise<{ data: Organization | null, error: any }> {
    // Create the organization
    const { data: organization, error: orgError } = await db.createOrganization({
      ...organizationData,
      created_by: userProfileId
    })

    if (orgError || !organization) {
      return { data: null, error: orgError }
    }

    // Create membership for the user
    const { error: membershipError } = await this.createOrganizationMembership(
      organization.id,
      userProfileId,
      'owner'
    )

    if (membershipError) {
      console.warn('Failed to create organization membership:', membershipError)
    }

    return { data: organization, error: null }
  }

  // Check if user has access to organization
  async hasOrganizationAccess(userProfileId: string, organizationId: string): Promise<boolean> {
    if (!db.isAvailable()) {
      return false
    }

    const { data, error } = await db.getSupabaseClient()
      .from('organization_members')
      .select('id')
      .eq('user_id', userProfileId)
      .eq('organization_id', organizationId)
      .single()

    return !error && !!data
  }
}

// Hook to use authentication with database integration
export function useAuthWithProfile() {
  const { user, isLoaded, isSignedIn } = useUser()
  
  return {
    user,
    isLoaded,
    isSignedIn,
    authService: new AuthService()
  }
}

// Export a lazy singleton to avoid initialization issues
let _authService: AuthService | null = null
export function getAuthService(): AuthService {
  if (_authService === null) {
    _authService = new AuthService()
  }
  return _authService
}

// Create a Proxy for backwards compatibility that lazily initializes
export const authService = new Proxy({} as AuthService, {
  get(target, prop) {
    const instance = getAuthService()
    const value = (instance as any)[prop]
    return typeof value === 'function' ? value.bind(instance) : value
  }
}) 