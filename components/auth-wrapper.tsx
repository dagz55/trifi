"use client"
import { useUser } from '@clerk/nextjs'
import { LandingPage } from './landing-page'

interface AuthWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthWrapper({ children, fallback }: AuthWrapperProps) {
  const { user, isLoaded, isSignedIn } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return fallback || <LandingPage />
  }

  return <>{children}</>
} 