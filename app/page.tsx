"use client"

import { LandingPage } from "@/components/landing-page"
import { AnalyticsTab } from "@/components/analytics/analytics-tab"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return <LandingPage />
  }

  return <AnalyticsTab comparisonPeriod="last_month" />
}
