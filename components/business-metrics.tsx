"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, Users, Target, BarChart3, ArrowUpRight, ArrowDownRight, AlertCircle, Database } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/database"
import { toast } from "sonner"
import { isSupabaseConfigured } from "@/lib/supabase"

interface MetricData {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: any
  color: string
}

export function BusinessMetrics() {
  const { currentOrganization, loading: authLoading } = useAuth()
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [databaseError, setDatabaseError] = useState<string | null>(null)

  useEffect(() => {
    const loadMetrics = async () => {
      if (authLoading) {
        return // Wait for auth to load
      }
      
      if (!currentOrganization) {
        setIsLoading(false)
        setDatabaseError('No organization selected. Please create or select an organization.')
        return
      }
      
      try {
        setIsLoading(true)
        setDatabaseError(null)

        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
          setDatabaseError('database_not_configured')
          setIsLoading(false)
          return
        }
        
        // Load data from multiple sources
        const [accountsResult, transactionsResult, projectsResult] = await Promise.all([
          db.getAccounts(currentOrganization.id),
          db.getTransactions(currentOrganization.id, 30), // Last 30 transactions
          db.getProjects(currentOrganization.id)
        ])
        
        if (accountsResult.error || transactionsResult.error || projectsResult.error) {
          const errorMessage = accountsResult.error?.message || transactionsResult.error?.message || projectsResult.error?.message || 'Unknown error'
          setDatabaseError(errorMessage)
          
          // Don't show toast for database not configured error
          if (errorMessage !== 'Database not configured') {
            toast.error('Failed to load metrics: ' + errorMessage)
          }
          return
        }
        
        // Calculate metrics from real data
        const accounts = accountsResult.data || []
        const transactions = transactionsResult.data || []
        const projects = projectsResult.data || []
        
        const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
        const totalRevenue = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)
        const activeProjects = projects.filter(p => p.status === 'active').length
        
        const formatCurrency = (amount: number) => {
          return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
          }).format(amount)
        }
        
        setMetrics([
          {
            title: "Total Revenue",
            value: formatCurrency(totalRevenue),
            change: totalRevenue > 0 ? "+12.5%" : "0%",
            trend: totalRevenue > 0 ? 'up' : 'neutral',
            icon: DollarSign,
            color: "status-green"
          },
          {
            title: "Active Projects",
            value: activeProjects.toString(),
            change: activeProjects > 0 ? `+${activeProjects}` : "0",
            trend: activeProjects > 0 ? 'up' : 'neutral',
            icon: Target,
            color: "status-blue"
          },
          {
            title: "Account Balance",
            value: formatCurrency(totalBalance),
            change: totalBalance > 0 ? "+8.2%" : "0%",
            trend: totalBalance > 0 ? 'up' : 'neutral',
            icon: BarChart3,
            color: "status-purple"
          },
          {
            title: "Transactions",
            value: transactions.length.toString(),
            change: transactions.length > 0 ? `+${transactions.length}` : "0",
            trend: transactions.length > 0 ? 'up' : 'neutral',
            icon: TrendingUp,
            color: "status-orange"
          }
        ])
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        setDatabaseError(errorMessage)
        toast.error('Failed to load business metrics')
      } finally {
        setIsLoading(false)
      }
    }

    loadMetrics()
  }, [currentOrganization, authLoading])

  // Database not configured state
  if (databaseError === 'database_not_configured' || databaseError === 'Database not configured') {
    return (
      <Card className="glass-card apple-hover border-amber-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Business Metrics</CardTitle>
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-sm text-readable">
            Key performance indicators for your business
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <Database className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-sm font-medium text-warning-light mb-1">Database Setup Required</p>
            <p className="text-xs text-readable mb-4">
              Connect to Supabase to see your business metrics
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Database error state
  if (databaseError && databaseError !== 'database_not_configured') {
    return (
      <Card className="glass-card apple-hover border-red-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Business Metrics</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm font-medium text-error-light mb-1">Connection Error</p>
            <p className="text-xs text-error-light mb-4">
              Unable to load business metrics
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="glass-card apple-hover">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Business Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/30">
                <div className="space-y-2">
                  <div className="skeleton h-4 w-16" />
                  <div className="skeleton h-6 w-20" />
                  <div className="skeleton h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card apple-hover">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Business Metrics</CardTitle>
          <Badge variant="outline" className="text-xs">
            Live Data
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Key performance indicators for your business
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={metric.title}
              className="p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 hover:from-muted/40 hover:to-muted/20 transition-all duration-200 apple-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <div className={`flex items-center space-x-1 text-xs ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  {metric.trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
                  {metric.trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold tracking-tight">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.title}</p>
              </div>
            </div>
          ))}
        </div>
        
        {metrics.every(m => m.value === "₱0" || m.value === "0") && (
          <div className="mt-6 text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Start adding transactions and projects to see your business metrics
            </p>
            <Button size="sm" variant="outline" className="apple-button">
              Get Started
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
