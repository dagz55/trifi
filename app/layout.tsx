import "./globals.css"
// Temporarily comment out Google Font import to avoid network issues
// import { Inter } from "next/font/google"
import type React from "react"
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/contexts/settings-context"
import { AuthProvider } from "@/contexts/auth-context"
import { LayoutContent } from "@/components/layout-content"
import { Viewport } from 'next'

// Temporarily use system fonts
// const inter = Inter({ 
//   subsets: ["latin"],
//   display: 'swap',
//   fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
//   preload: false
// })

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  initialScale: 1,
  width: 'device-width',
  userScalable: true,
  minimumScale: 1,
  maximumScale: 5,
}

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
        url: '/TriFi-logo.png',
        type: 'image/png',
      },
    ],
    shortcut: '/TriFi-logo.png',
    apple: [
      {
        url: '/TriFi-logo.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/manifest.json',
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
                <LayoutContent>{children}</LayoutContent>
              </AuthProvider>
            </SettingsProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
