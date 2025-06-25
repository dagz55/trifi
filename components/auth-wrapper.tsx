"use client"

import { useUser } from '@clerk/nextjs'
import { Loader2, User, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AuthWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthWrapper({ children, fallback }: AuthWrapperProps) {
  try {
    const { user, isLoaded, isSignedIn } = useUser()

    // Show loading state while Clerk is initializing
    if (!isLoaded) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    }

    // Show sign-in prompt if user is not authenticated
    if (!isSignedIn) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <User className="h-6 w-6" />
              </div>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please sign in to access this page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                onClick={() => window.location.href = '/sign-in'}
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/sign-up'}
              >
                Create Account
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    // User is authenticated, render children
    return <>{children}</>

  } catch (error) {
    // Handle Clerk configuration issues gracefully
    console.warn('Clerk authentication error:', error)
    
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span>Authentication Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Authentication is not fully configured. For demo purposes, you can continue without signing in.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                To set up authentication:
              </p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Create a Clerk account at clerk.dev</li>
                <li>Add your Clerk keys to .env.local</li>
                <li>Restart the development server</li>
              </ol>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                className="flex-1" 
                onClick={() => window.location.href = '/'}
              >
                Continue to Demo
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.open('https://clerk.dev', '_blank')}
              >
                Setup Clerk
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
} 