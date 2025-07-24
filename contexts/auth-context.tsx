"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs'
import { db, UserProfile, Organization } from '@/lib/database'

interface AuthContextType {
  userProfile: UserProfile | null
  currentOrganization: Organization | null
  organizations: Organization[]
  isLoaded: boolean
  isSignedIn: boolean
  loading: boolean
  error: string | null
  createOrganization: (data: Partial<Organization>) => Promise<Organization | null>
  switchOrganization: (organizationId: string) => void
  refreshOrganizations: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, userId, isLoaded: isClerkLoaded } = useClerkAuth()
  const { user: clerkUser } = useUser()
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUserData() {
      if (!isClerkLoaded) return;
      if (!isSignedIn || !userId || !clerkUser) {
        setLoading(false)
        setUserProfile(null)
        setCurrentOrganization(null)
        setOrganizations([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const { data: profile, error: profileError } = await ensureUserProfile(clerkUser)
        
        if (profileError) {
          setError(`Failed to ensure user profile: ${profileError.message}`)
          return
        }
        
        setUserProfile(profile)

        if (profile) {
          const { data: userOrgs, error: orgsError } = await getUserOrganizations(profile.id)
          
          if (orgsError) {
            console.warn('Failed to load organizations:', orgsError)
            setError(`Failed to load organizations: ${orgsError.message}`)
          } else {
            setOrganizations(userOrgs || [])
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
  }, [isSignedIn, userId, isClerkLoaded, clerkUser])
  
  useEffect(() => {
    if (currentOrganization && typeof window !== 'undefined') {
      localStorage.setItem('currentOrganizationId', currentOrganization.id)
    }
  }, [currentOrganization])

  async function ensureUserProfile(clerkUser: any): Promise<{ data: UserProfile | null, error: any }> {
    if (!clerkUser) {
      return { data: null, error: { message: 'No user provided' } }
    }

    const { data: existingProfile, error: getError } = await db.getUserProfileByClerkId(clerkUser.id)
    
    if (existingProfile && !getError) {
      return { data: existingProfile, error: null }
    }

    const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress
    const profileData: Partial<UserProfile> = {
      clerk_user_id: clerkUser.id,
      full_name: clerkUser.fullName || `${clerkUser.firstName} ${clerkUser.lastName}`.trim() || primaryEmail?.split('@')[0],
      email: primaryEmail,
      avatar_url: clerkUser.imageUrl,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: 'en',
      currency: 'PHP',
      date_format: 'MM/dd/yyyy',
      theme: 'system'
    }

    return await db.createUserProfile(profileData)
  }
  
  async function getUserOrganizations(userProfileId: string): Promise<{ data: Organization[], error: any }> {
    // Use the new database service method
    return await db.getUserOrganizations(userProfileId)
  }

  const createOrganization = async (organizationData: Partial<Organization>): Promise<Organization | null> => {
    console.log('🏗️ AuthContext.createOrganization called with:', organizationData)
    
    // Check if Clerk is loaded and user is signed in
    if (!isClerkLoaded || !isSignedIn || !clerkUser) {
      console.error('❌ Authentication not ready')
      const errorMsg = 'Please sign in to create an organization'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
    
    // Ensure user profile exists before creating organization
    if (!userProfile) {
      console.log('👤 User profile not available, attempting to create...')
      try {
        const { data: profile, error: profileError } = await ensureUserProfile(clerkUser)
        if (profileError || !profile) {
          console.error('❌ Failed to create user profile:', profileError)
          const errorMsg = `Failed to create user profile: ${profileError?.message || 'Unknown error'}`
          setError(errorMsg)
          throw new Error(errorMsg)
        }
        setUserProfile(profile)
        console.log('✅ User profile created:', profile.id)
      } catch (err) {
        console.error('💥 Exception creating user profile:', err)
        const errorMsg = `Error creating user profile: ${err instanceof Error ? err.message : 'Unknown error'}`
        setError(errorMsg)
        throw new Error(errorMsg)
      }
    }

    const profileToUse = userProfile || (await ensureUserProfile(clerkUser)).data
    if (!profileToUse) {
      const errorMsg = 'Unable to create or access user profile'
      setError(errorMsg)
      throw new Error(errorMsg)
    }

    console.log('👤 Using user profile:', profileToUse.id)

    try {
      setError(null)
      
      console.log('📡 Calling db.createOrganizationWithOwner...')
      // Use the new database service method
      const { data: newOrg, error } = await db.createOrganizationWithOwner(organizationData, profileToUse.id)

      console.log('📊 Database response:', { newOrg, error })

      if (error) {
        console.error('❌ Database error:', error)
        
        // Propagate specific error codes
        if (error.code === 'SUPABASE_NOT_CONFIGURED') {
          setError(`Database not configured: ${error.message}`)
          throw new Error(error.message)
        } else if (error.code === 'FUNCTION_NOT_FOUND') {
          setError(`Database setup incomplete: ${error.message}`)
          throw new Error(error.message)
        } else {
          setError(`Failed to create organization: ${error.message}`)
          throw new Error(error.message)
        }
      }

      if (newOrg) {
        console.log('✅ Organization created successfully:', newOrg)
        // Refresh organizations to get the updated list
        console.log('🔄 Refreshing organizations...')
        await refreshOrganizations()
        
        // Set the new organization as current
        console.log('🎯 Setting new organization as current')
        setCurrentOrganization(newOrg)
        
        return newOrg
      }
      
      console.warn('⚠️ Organization creation returned null result')
      return null
    } catch (err) {
      console.error('💥 Exception in createOrganization:', err)
      setError(`Error creating organization: ${err instanceof Error ? err.message : 'Unknown error'}`)
      return null
    }
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
      } else {
        setOrganizations(userOrgs || [])
        if (currentOrganization) {
          const updatedCurrentOrg = userOrgs?.find(org => org.id === currentOrganization.id)
          setCurrentOrganization(updatedCurrentOrg || userOrgs?.[0] || null)
        } else {
          setCurrentOrganization(userOrgs?.[0] || null)
        }
      }
    } catch (err) {
      console.error('Error refreshing organizations:', err)
    }
  }

  const value: AuthContextType = {
    userProfile,
    currentOrganization,
    organizations,
    isLoaded: isClerkLoaded,
    isSignedIn: !!isSignedIn,
    loading,
    error,
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