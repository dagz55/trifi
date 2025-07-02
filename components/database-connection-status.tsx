"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw, 
  Database,
  AlertTriangle,
  Info
} from "lucide-react"

interface ConnectionStatus {
  isConnected: boolean
  message: string
  isLoading: boolean
  lastChecked?: Date
}

export function DatabaseConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    message: "Checking database connection...",
    isLoading: true
  })

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, isLoading: true }))
    
    try {
      // Check if environment variables are available on client side
      const hasEnvVars = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      
      if (!hasEnvVars) {
        setStatus({
          isConnected: false,
          message: "Missing Supabase environment variables",
          isLoading: false,
          lastChecked: new Date()
        })
        return
      }

      // Test the actual connection by calling our API
      const response = await fetch('/api/test-db-connection', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      setStatus({
        isConnected: result.success,
        message: result.message,
        isLoading: false,
        lastChecked: new Date()
      })
    } catch (error) {
      setStatus({
        isConnected: false,
        message: `Connection failed: ${error instanceof Error ? error.message : String(error)}`,
        isLoading: false,
        lastChecked: new Date()
      })
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const getStatusIcon = () => {
    if (status.isLoading) {
      return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
    }
    if (status.isConnected) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    }
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  const getStatusBadge = () => {
    if (status.isLoading) {
      return <Badge variant="secondary">Checking...</Badge>
    }
    if (status.isConnected) {
      return <Badge className="bg-green-600 text-white">Connected</Badge>
    }
    return <Badge variant="destructive">Disconnected</Badge>
  }

  const getSetupInstructions = () => {
    if (status.isConnected || status.isLoading) return null

    return (
      <Alert className="mt-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Database Connection Setup Required</p>
            <div className="text-sm space-y-1">
              <p>To fix this issue, create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root with:</p>
              <pre className="bg-gray-50 p-2 rounded text-xs mt-2">
{`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`}
              </pre>
              <p className="text-xs text-readable mt-2">
                Get these values from your Supabase project dashboard under Settings → API
              </p>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="border-l-4 border-l-blue-600">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Database Status</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div className="flex-1">
            <p className="text-sm font-medium">{status.message}</p>
            {status.lastChecked && (
              <p className="text-xs text-readable">
                Last checked: {status.lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnection}
            disabled={status.isLoading}
            className="shrink-0"
          >
            {status.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-1">Retry</span>
          </Button>
        </div>

        {getSetupInstructions()}

        {status.isConnected && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-readable">
              Database is connected and ready. All financial data operations are available.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
} 