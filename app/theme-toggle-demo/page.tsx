"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PremiumThemeToggle } from "@/components/ui/premium-theme-toggle"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ThemeToggleDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-4">
            Premium Theme Toggle Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Experience the modern theme toggle components created with MCP servers for TriFi's navigation system.
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Navigation Variant */}
          <Card className="glass-card bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Navigation Variant
                </CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  Compact
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Designed for navigation bars and headers. Features a compact design with smooth animations and ripple effects.
              </p>
              
              <div className="flex items-center justify-center p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
                <PremiumThemeToggle variant="nav" />
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <h4 className="font-semibold text-gray-900 dark:text-white">Features:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Compact 40x40px design</li>
                  <li>• Smooth icon transitions</li>
                  <li>• Interactive ripple effects</li>
                  <li>• Financial-grade styling</li>
                  <li>• Accessibility support</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Standalone Variant */}
          <Card className="glass-card bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Standalone Variant
                </CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  Premium
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Full-featured toggle with sliding animation, ambient glow effects, and enterprise-grade security indicator.
              </p>
              
              <div className="flex items-center justify-center p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
                <PremiumThemeToggle variant="standalone" />
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <h4 className="font-semibold text-gray-900 dark:text-white">Features:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Sliding toggle mechanism</li>
                  <li>• Ambient glow effects</li>
                  <li>• Background pattern overlay</li>
                  <li>• Security status indicator</li>
                  <li>• Floating particle effects</li>
                  <li>• Spring animations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mt-8 glass-card bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Technologies Used</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• <strong>Framer Motion:</strong> Advanced animations</li>
                  <li>• <strong>next-themes:</strong> Theme management</li>
                  <li>• <strong>Tailwind CSS:</strong> Styling system</li>
                  <li>• <strong>TypeScript:</strong> Type safety</li>
                  <li>• <strong>Lucide Icons:</strong> Sun/Moon icons</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Features</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Hydration-safe mounting</li>
                  <li>• Keyboard accessibility</li>
                  <li>• Smooth state transitions</li>
                  <li>• Enterprise-grade design</li>
                  <li>• Mobile responsive</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>✨ MCP Server Integration:</strong> This component was created using the 21st.dev MCP server, 
                demonstrating how AI-assisted development can create sophisticated, production-ready UI components 
                with modern animation libraries and enterprise-grade design principles.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card className="mt-8 glass-card bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Usage Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Navigation Variant</h4>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm">
                  <code className="text-gray-800 dark:text-gray-200">
                    {'<PremiumThemeToggle variant="nav" />'}
                  </code>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Standalone Variant</h4>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm">
                  <code className="text-gray-800 dark:text-gray-200">
                    {'<PremiumThemeToggle variant="standalone" />'}
                  </code>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">With Custom Styling</h4>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm">
                  <code className="text-gray-800 dark:text-gray-200">
                    {'<PremiumThemeToggle variant="nav" className="ml-4" />'}
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 