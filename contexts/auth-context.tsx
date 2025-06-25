"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { authService } from '@/lib/auth'
import { UserProfile, Organization } from '@/lib/database'

interface AuthContextType {
  user: any
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
  const { user, isLoaded, isSignedIn } = useUser()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize user profile and organizations when user signs in
  useEffect(() => {
    async function initializeUser() {
      if (!isLoaded) return
      
      setLoading(true)
      setError(null)

      try {
        if (isSignedIn && user) {
          // Ensure user profile exists
          const { data: profile, error: profileError } = await authService.ensureUserProfile(user)
          
          if (profileError) {
            setError(`Failed to create user profile: ${profileError.message}`)
            return
          }

          setUserProfile(profile)

          if (profile) {
            // Load user's organizations
            const { data: userOrgs, error: orgsError } = await authService.getUserOrganizations(profile.id)
            
            if (orgsError) {
              console.warn('Failed to load organizations:', orgsError)
              setError(`Failed to load organizations: ${orgsError.message}`)
            } else {
              setOrganizations(userOrgs || [])
              
              // Set current organization (first one or from localStorage)
              const savedOrgId = localStorage.getItem('currentOrganizationId')
              const savedOrg = userOrgs?.find(org => org.id === savedOrgId)
              setCurrentOrganization(savedOrg || userOrgs?.[0] || null)
            }
          }
        } else {
          // User signed out, clear state
          setUserProfile(null)
          setCurrentOrganization(null)
          setOrganizations([])
          localStorage.removeItem('currentOrganizationId')
        }
      } catch (err) {
        console.error('Error initializing user:', err)
        setError(`Initialization error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    initializeUser()
  }, [isLoaded, isSignedIn, user])

  // Save current organization to localStorage when it changes
  useEffect(() => {
    if (currentOrganization) {
      localStorage.setItem('currentOrganizationId', currentOrganization.id)
    }
  }, [currentOrganization])

  const createOrganization = async (organizationData: Partial<Organization>): Promise<Organization | null> => {
    if (!userProfile) {
      setError('User profile not available')
      return null
    }

    try {
      const { data: newOrg, error } = await authService.createOrganizationWithMembership(
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

  const switchOrganization = (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId)
    if (org) {
      setCurrentOrganization(org)
    }
  }

  const refreshOrganizations = async () => {
    if (!userProfile) return

    try {
      const { data: userOrgs, error } = await authService.getUserOrganizations(userProfile.id)
      
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
    userProfile,
    currentOrganization,
    organizations,
    isLoaded,
    isSignedIn: isSignedIn || false,
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