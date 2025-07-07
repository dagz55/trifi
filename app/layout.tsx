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
  description: "Modern financial management platform with advanced analytics, investment tracking, and comprehensive business management tools. Built with cutting-edge technology for financial institutions.",
  generator: 'TriFi Platform',
  applicationName: 'TriFi',
  referrer: 'origin-when-cross-origin',
  keywords: ['financial management', 'fintech', 'investment tracking', 'business analytics', 'financial platform', 'accounting software'],
  authors: [{ name: 'TriFi Team' }],
  creator: 'TriFi',
  publisher: 'TriFi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://trifi.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trifi.com',
    title: 'TriFi - Advanced Financial Management Platform',
    description: 'Modern financial management platform with advanced analytics, investment tracking, and comprehensive business management tools.',
    siteName: 'TriFi',
    images: [
      {
        url: '/trifi_logo.png',
        width: 1200,
        height: 630,
        alt: 'TriFi - Advanced Financial Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TriFi - Advanced Financial Management Platform',
    description: 'Modern financial management platform with advanced analytics and investment tracking.',
    images: ['/trifi_logo.png'],
    creator: '@trifi',
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/placeholder-logo.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon.svg',
    apple: [
      {
        url: '/apple-touch-icon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
      },
    ],
  },
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3B82F6' },
    { media: '(prefers-color-scheme: dark)', color: '#1E293B' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
