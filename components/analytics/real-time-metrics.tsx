"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Zap,
  Eye,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricData {
  id: string
  label: string
  value: string
  change: number
  changeType: 'increase' | 'decrease'
  icon: any
  color: string
  isLive: boolean
}

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      id: 'revenue',
      label: 'Revenue Today',
      value: '₱47,239',
      change: 12.3,
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-fintech-secondary',
      isLive: true
    },
    {
      id: 'visitors',
      label: 'Active Visitors',
      value: '1,247',
      change: 8.1,
      changeType: 'increase', 
      icon: Eye,
      color: 'text-fintech-primary',
      isLive: true
    },
    {
      id: 'orders',
      label: 'Orders/Hour',
      value: '34',
      change: -2.4,
      changeType: 'decrease',
      icon: ShoppingCart,
      color: 'text-fintech-accent',
      isLive: true
    },
    {
      id: 'conversion',
      label: 'Conversion Rate',
      value: '3.47%',
      change: 0.8,
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-fintech-warning',
      isLive: false
    }
  ])

  const [currentTime, setCurrentTime] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      
      // Simulate metric updates every 10 seconds
      if (Math.random() > 0.7) {
        setMetrics(prev => prev.map(metric => {
          if (metric.isLive && Math.random() > 0.5) {
            const variance = (Math.random() - 0.5) * 0.1
            const newChange = metric.change + variance
            return {
              ...metric,
              change: Math.round(newChange * 10) / 10,
              changeType: newChange >= 0 ? 'increase' : 'decrease'
            }
          }
          return metric
        }))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card variant="glass" className="border-fintech-primary/20 bg-gradient-to-r from-fintech-primary/5 to-fintech-accent/5">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-fintech-secondary rounded-full animate-pulse"></div>
              <h4 className="text-lg font-semibold text-fintech-neutral-900 dark:text-fintech-neutral-100">
                Real-Time Metrics
              </h4>
            </div>
            <Badge variant="success" size="sm" className="text-xs">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-sm text-fintech-neutral-600 dark:text-fintech-neutral-400">
            <Clock className="w-4 h-4" />
            <span>Updated {currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="relative overflow-hidden bg-white/60 dark:bg-fintech-neutral-900/60 backdrop-blur-sm rounded-xl p-4 border border-fintech-neutral-200/50 dark:border-fintech-neutral-700/50 hover:border-fintech-primary/30 transition-all duration-300 group"
            >
              {/* Live indicator */}
              {metric.isLive && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-fintech-secondary rounded-full animate-pulse"></div>
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  metric.color === 'text-fintech-secondary' && "bg-fintech-secondary/10",
                  metric.color === 'text-fintech-primary' && "bg-fintech-primary/10",
                  metric.color === 'text-fintech-accent' && "bg-fintech-accent/10",
                  metric.color === 'text-fintech-warning' && "bg-fintech-warning/10"
                )}>
                  <metric.icon className={cn("h-4 w-4", metric.color)} />
                </div>
                
                <div className={cn(
                  "flex items-center text-xs font-medium",
                  metric.changeType === 'increase' ? "text-fintech-secondary" : "text-fintech-danger"
                )}>
                  {metric.changeType === 'increase' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-fintech-neutral-600 dark:text-fintech-neutral-400 leading-tight">
                  {metric.label}
                </p>
                <p className="text-xl font-bold text-fintech-neutral-900 dark:text-fintech-neutral-100 tracking-tight">
                  {metric.value}
                </p>
              </div>

              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fintech-primary/5 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000 ease-out"></div>
            </div>
          ))}
        </div>

        {/* Performance Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-fintech-secondary/10 to-fintech-primary/10 rounded-xl border border-fintech-secondary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-fintech-accent" />
              <span className="text-sm font-semibold text-fintech-neutral-900 dark:text-fintech-neutral-100">
                Performance Summary
              </span>
            </div>
            <Badge variant="premium" size="sm">
              Excellent
            </Badge>
          </div>
          
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-fintech-neutral-600 dark:text-fintech-neutral-400">Revenue Growth</p>
              <p className="text-lg font-bold text-fintech-secondary">+12.3%</p>
            </div>
            <div className="text-center">
              <p className="text-fintech-neutral-600 dark:text-fintech-neutral-400">Customer Satisfaction</p>
              <p className="text-lg font-bold text-fintech-primary">94.8%</p>
            </div>
            <div className="text-center">
              <p className="text-fintech-neutral-600 dark:text-fintech-neutral-400">System Uptime</p>
              <p className="text-lg font-bold text-fintech-accent">99.9%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}