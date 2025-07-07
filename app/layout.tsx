import "./globals.css"
// Temporarily comment out Google Font import to avoid network issues
// import { Inter } from "next/font/google"
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'
import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { SettingsProvider } from "@/contexts/settings-context"
import { AuthProvider } from "@/contexts/auth-context"

// Temporarily use system fonts
// const inter = Inter({ 
//   subsets: ["latin"],
//   display: 'swap',
//   fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
//   preload: false
// })

export const metadata = {
  title: "TriFi - Advanced Financial Management Platform",
  description: "Professional financial management with Apple-style design and enterprise features",
  generator: 'TriFi Platform',
  icons: {
    icon: '/placeholder-logo.svg', // Fallback icon (black & white)
    shortcut: '/placeholder-logo.svg',
    apple: '/placeholder-logo.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="font-sans antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SettingsProvider>
              <AuthProvider>
                <TooltipProvider delayDuration={0}>
                  {/* Signed Out - Full screen landing page */}
                  <SignedOut>
                    <main className="w-full animate-fade-in">{children}</main>
                  </SignedOut>
                  
                  {/* Signed In - Dashboard with sidebar and nav */}
                  <SignedIn>
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
                  </SignedIn>
                  
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
              </AuthProvider>
            </SettingsProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
