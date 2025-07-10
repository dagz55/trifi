"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase'
import { db, UserProfile, Organization } from '@/lib/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  userProfile: UserProfile | null
  currentOrganization: Organization | null
  organizations: Organization[]
  isLoaded: boolean
  isSignedIn: boolean
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  createOrganization: (data: Partial<Organization>) => Promise<Organization | null>
  switchOrganization: (organizationId: string) => void
  refreshOrganizations: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = getSupabaseClient()

  // Initialize auth state
  useEffect(() => {
    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          setError(error.message)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (err) {
        console.error('Error in getInitialSession:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoaded(true)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoaded(true)
        
        if (event === 'SIGNED_OUT') {
          setUserProfile(null)
          setCurrentOrganization(null)
          setOrganizations([])
          if (typeof window !== 'undefined') {
            localStorage.removeItem('currentOrganizationId')
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Load user profile and organizations when user signs in
  useEffect(() => {
    async function loadUserData() {
      if (!user || !isLoaded) return

      setLoading(true)
      setError(null)

      try {
        // Get or create user profile
        const { data: profile, error: profileError } = await ensureUserProfile(user)
        
        if (profileError) {
          setError(`Failed to create user profile: ${profileError.message}`)
          return
        }

        setUserProfile(profile)

        if (profile) {
          // Load user's organizations
          const { data: userOrgs, error: orgsError } = await getUserOrganizations(profile.id)
          
          if (orgsError) {
            console.warn('Failed to load organizations:', orgsError)
            setError(`Failed to load organizations: ${orgsError.message}`)
          } else {
            setOrganizations(userOrgs || [])
            
            // Set current organization (first one or from localStorage)
            if (typeof window !== 'undefined') {
              const savedOrgId = localStorage.getItem('currentOrganizationId')
              const savedOrg = userOrgs?.find(org => org.id === savedOrgId)
              setCurrentOrganization(savedOrg || userOrgs?.[0] || null)
            } else {
              setCurrentOrganization(userOrgs?.[0] || null)
            }
          }
        }
      } catch (err) {
        console.error('Error loading user data:', err)
        setError(`Error loading user data: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user, isLoaded])

  // Save current organization to localStorage when it changes
  useEffect(() => {
    if (currentOrganization && typeof window !== 'undefined') {
      localStorage.setItem('currentOrganizationId', currentOrganization.id)
    }
  }, [currentOrganization])

  // Auth methods
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  }

  // Helper functions
  async function ensureUserProfile(user: User): Promise<{ data: UserProfile | null, error: any }> {
    if (!user) {
      return { data: null, error: { message: 'No user provided' } }
    }

    // Try to get existing user profile
    const { data: existingProfile, error: getError } = await db.getUserProfile(user.id)
    
    if (existingProfile && !getError) {
      return { data: existingProfile, error: null }
    }

    // Create new user profile if it doesn't exist
    const profileData = {
      clerk_user_id: user.id, // Keep this field name for now to maintain compatibility
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      email: user.email,
      avatar_url: user.user_metadata?.avatar_url,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: 'en',
      currency: 'PHP',
      date_format: 'MM/dd/yyyy',
      theme: 'system'
    }

    return await db.createUserProfile(profileData)
  }

  async function getUserOrganizations(userProfileId: string): Promise<{ data: Organization[], error: any }> {
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

  const createOrganization = async (organizationData: Partial<Organization>): Promise<Organization | null> => {
    if (!userProfile) {
      setError('User profile not available')
      return null
    }

    try {
      const { data: newOrg, error } = await createOrganizationWithMembership(
        organizationData,
        userProfile.id
      )

      if (error) {
        setError(`Failed to create organization: ${error.message}`)
        return null
      }

      if (newOrg) {
        setOrganizations(prev => [newOrg, ...prev])
        setCurrentOrganization(newOrg)
        return newOrg
      }

      return null
    } catch (err) {
      setError(`Error creating organization: ${err instanceof Error ? err.message : 'Unknown error'}`)
      return null
    }
  }

  async function createOrganizationWithMembership(organizationData: Partial<Organization>, userProfileId: string): Promise<{ data: Organization | null, error: any }> {
    // Create the organization
    const { data: organization, error: orgError } = await db.createOrganization({
      ...organizationData,
      created_by: userProfileId
    })

    if (orgError || !organization) {
      return { data: null, error: orgError }
    }

    // Create membership for the user
    const { error: membershipError } = await createOrganizationMembership(
      organization.id,
      userProfileId,
      'owner'
    )

    if (membershipError) {
      console.warn('Failed to create organization membership:', membershipError)
    }

    return { data: organization, error: null }
  }

  async function createOrganizationMembership(organizationId: string, userProfileId: string, role: string = 'owner'): Promise<{ data: any | null, error: any }> {
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

  const switchOrganization = (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId)
    if (org) {
      setCurrentOrganization(org)
    }
  }

  const refreshOrganizations = async () => {
    if (!userProfile) return

    try {
      const { data: userOrgs, error } = await getUserOrganizations(userProfile.id)
      
      if (error) {
        console.warn('Failed to refresh organizations:', error)
        setError(`Failed to refresh organizations: ${error.message}`)
      } else {
        setOrganizations(userOrgs || [])
        
        // Update current organization if it still exists
        if (currentOrganization) {
          const updatedCurrentOrg = userOrgs?.find(org => org.id === currentOrganization.id)
          if (updatedCurrentOrg) {
            setCurrentOrganization(updatedCurrentOrg)
          } else {
            setCurrentOrganization(userOrgs?.[0] || null)
          }
        }
      }
    } catch (err) {
      console.error('Error refreshing organizations:', err)
      setError(`Error refreshing organizations: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    userProfile,
    currentOrganization,
    organizations,
    isLoaded,
    isSignedIn: !!user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    createOrganization,
    switchOrganization,
    refreshOrganizations
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 