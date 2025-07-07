"use client"

import * as React from "react"
import { useState, useEffect } from "react"

interface ClerkWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

/**
 * Hydration-safe wrapper for Clerk authentication components
 * Prevents SSR hydration mismatches when wrapping custom components
 */
export function ClerkWrapper({
  children,
  fallback = null,
  className,
}: ClerkWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // During SSR and initial hydration, show fallback to prevent mismatch
  if (!isHydrated) {
    return (
      <div className={className} suppressHydrationWarning>
        {fallback}
      </div>
    )
  }

  // After hydration, show the actual Clerk component
  return (
    <div className={className}>
      {children}
    </div>
  )
}

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Simple client-only wrapper for components that need to avoid SSR
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return fallback as React.ReactElement
  }

  return children as React.ReactElement
} 