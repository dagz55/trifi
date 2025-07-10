'use client'

import type React from "react"
import { useUser } from "@clerk/nextjs"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

// Layout content component to access auth context
export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      {/* Signed Out - Full screen landing page */}
      {!isSignedIn && (
        <main className="w-full animate-fade-in">{children}</main>
      )}
      
      {/* Signed In - Dashboard with sidebar and nav */}
      {isSignedIn && (
        <div className="min-h-screen flex bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <TopNav />
            <div className="flex-1 page-transition">
              <div className="container mx-auto p-6 max-w-7xl">
                <main className="w-full animate-fade-in">{children}</main>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Toaster 
        position="top-right"
        richColors
        expand={false}
        closeButton
        toastOptions={{
          style: {
            background: 'var(--glass-bg)',
            backdropFilter: 'var(--glass-backdrop)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
          },
        }}
      />
    </TooltipProvider>
  )
}