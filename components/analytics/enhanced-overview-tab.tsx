"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnhancedRevenueChart } from "@/components/analytics/enhanced-revenue-chart"
import { EnhancedMetricsCards } from "@/components/analytics/enhanced-metrics-cards"
import { AdvancedAnalyticsGrid } from "@/components/analytics/advanced-analytics-grid"
import { RealTimeMetrics } from "@/components/analytics/real-time-metrics"
import { PredictiveAnalytics } from "@/components/analytics/predictive-analytics"
import { DateRange } from "react-day-picker"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Users, 
  ShoppingCart,
  CreditCard,
  Target,
  Activity,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Filter,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedOverviewTabProps {
  dateRange?: DateRange | undefined
}

// Generate realistic mock data with proper scaling
const generateMockData = () => {
  const now = new Date()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const baseRevenue = 150000
  const revenueData = months.slice(0, 7).map((month, index) => {
    const variance = (Math.random() - 0.5) * 0.3
    const trend = index * 0.1
    const value = baseRevenue * (1 + trend + variance)
    return {
      month,
      revenue: Math.round(value),
      expenses: Math.round(value * (0.6 + Math.random() * 0.2)),
      profit: Math.round(value * (0.2 + Math.random() * 0.15)),
      customers: Math.round(500 + index * 50 + Math.random() * 100),
      orders: Math.round(200 + index * 20 + Math.random() * 50)
    }
  })

  const kpiData = [
    {
      title: "Total Revenue",
      value: "₱2,847,392",
      change: "+12.3%",
      trend: "up",
      description: "vs last month",
      icon: DollarSign,
      color: "text-fintech-secondary",
      bgColor: "bg-fintech-secondary/10",
      borderColor: "border-fintech-secondary/20"
    },
    {
      title: "Active Customers",
      value: "4,321",
      change: "+8.7%", 
      trend: "up",
      description: "vs last month",
      icon: Users,
      color: "text-fintech-primary",
      bgColor: "bg-fintech-primary/10",
      borderColor: "border-fintech-primary/20"
    },
    {
      title: "Total Orders",
      value: "1,847",
      change: "+15.2%",
      trend: "up", 
      description: "vs last month",
      icon: ShoppingCart,
      color: "text-fintech-accent",
      bgColor: "bg-fintech-accent/10",
      borderColor: "border-fintech-accent/20"
    },
    {
      title: "Conversion Rate",
      value: "3.47%",
      change: "-0.8%",
      trend: "down",
      description: "vs last month",
      icon: Target,
      color: "text-fintech-warning",
      bgColor: "bg-fintech-warning/10", 
      borderColor: "border-fintech-warning/20"
    }
  ]

  return { revenueData, kpiData }
}

export function EnhancedOverviewTab({ dateRange }: EnhancedOverviewTabProps) {
  const [comparisonPeriod, setComparisonPeriod] = useState("previous_month")
  const [viewMode, setViewMode] = useState("overview")
  const [refreshing, setRefreshing] = useState(false)
  
  const { revenueData, kpiData } = useMemo(() => generateMockData(), [])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const handleExport = () => {
    // Simulate export functionality
    console.log('Exporting analytics data...')
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-financial-heading">Financial Analytics Dashboard</h3>
          <p className="text-financial-body">
            Comprehensive insights into your business performance and growth metrics
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success" className="text-xs font-semibold">
            <Activity className="w-3 h-3 mr-1" />
            Live Data
          </Badge>
          
          <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Compare to" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous_month">Previous Month</SelectItem>
              <SelectItem value="previous_quarter">Previous Quarter</SelectItem>
              <SelectItem value="previous_year">Previous Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="View mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
              <SelectItem value="comparison">Comparison</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-9"
            >
              <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-9"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Real-time Metrics Bar */}
      <RealTimeMetrics />

      {/* Enhanced KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiData.map((metric, index) => (
          <Card 
            key={metric.title}
            variant="elevated"
            className={cn(
              "fintech-hover border transition-all duration-300",
              metric.borderColor
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <div className={cn(
                  "p-2 rounded-xl",
                  metric.bgColor
                )}>
                  <metric.icon className={cn("h-5 w-5", metric.color)} />
                </div>
                <div className={cn(
                  "flex items-center text-sm font-medium",
                  metric.trend === "up" ? "text-fintech-secondary" : "text-fintech-danger"
                )}>
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {metric.change}
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-financial-caption">{metric.title}</p>
                <p className="text-money-medium">{metric.value}</p>
                <p className="text-xs text-fintech-neutral-500">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Revenue Chart - Spans 2 columns */}
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold">Revenue & Expenses</CardTitle>
                <p className="text-financial-caption">Monthly performance overview</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-fintech-primary rounded-full"></div>
                  <span className="text-fintech-neutral-600">Revenue</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-fintech-danger rounded-full"></div>
                  <span className="text-fintech-neutral-600">Expenses</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <EnhancedRevenueChart 
              data={revenueData} 
              comparisonPeriod={comparisonPeriod}
              height={320}
            />
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card variant="elevated">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Performance Metrics</CardTitle>
            <p className="text-financial-caption">Key business indicators</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {[
                { label: "Customer Satisfaction", value: "94.5%", change: "+2.3%", positive: true },
                { label: "Order Fulfillment", value: "98.2%", change: "+0.8%", positive: true },
                { label: "Return Rate", value: "2.1%", change: "-0.5%", positive: true },
                { label: "Avg. Order Value", value: "₱1,547", change: "+12.4%", positive: true }
              ].map((metric, index) => (
                <div key={metric.label} className="flex items-center justify-between p-3 bg-fintech-neutral-50 dark:bg-fintech-neutral-800 rounded-xl">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-fintech-neutral-700 dark:text-fintech-neutral-300">
                      {metric.label}
                    </p>
                    <p className="text-lg font-bold text-fintech-neutral-900 dark:text-fintech-neutral-100">
                      {metric.value}
                    </p>
                  </div>
                  <div className={cn(
                    "flex items-center text-sm font-medium",
                    metric.positive ? "text-fintech-secondary" : "text-fintech-danger"
                  )}>
                    {metric.positive ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Grid */}
      <AdvancedAnalyticsGrid 
        data={revenueData}
        viewMode={viewMode}
        comparisonPeriod={comparisonPeriod}
      />

      {/* Predictive Analytics Section */}
      {viewMode === "detailed" && (
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-fintech-accent" />
              <CardTitle className="text-lg font-semibold">AI-Powered Insights</CardTitle>
            </div>
            <p className="text-financial-caption">Predictive analytics and forecasting</p>
          </CardHeader>
          <CardContent>
            <PredictiveAnalytics data={revenueData} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}