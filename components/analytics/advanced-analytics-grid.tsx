"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ScatterChart,
  Scatter
} from "recharts"
import { 
  Users, 
  ShoppingCart, 
  CreditCard, 
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Target,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  ArrowUpRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdvancedAnalyticsGridProps {
  data: Array<{
    month: string
    revenue: number
    expenses: number
    profit: number
    customers: number
    orders: number
  }>
  viewMode: string
  comparisonPeriod: string
}

// Color palette for charts
const CHART_COLORS = [
  'rgb(59, 130, 246)',   // Primary blue
  'rgb(34, 197, 94)',    // Success green
  'rgb(139, 92, 246)',   // Accent purple
  'rgb(245, 158, 11)',   // Warning amber
  'rgb(239, 68, 68)',    // Danger red
  'rgb(6, 182, 212)',    // Cyan
  'rgb(168, 85, 247)',   // Violet
  'rgb(34, 197, 94)',    // Emerald
]

// Custom tooltip for better text fitting
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-fintech-neutral-900 border border-fintech-neutral-200 dark:border-fintech-neutral-700 rounded-lg p-3 shadow-lg text-xs">
        {label && <p className="font-semibold mb-1">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-fintech-neutral-600 dark:text-fintech-neutral-400">
              {entry.name}:
            </span>
            <span className="font-semibold text-fintech-neutral-900 dark:text-fintech-neutral-100">
              {typeof entry.value === 'number' && entry.value > 1000 
                ? `₱${entry.value.toLocaleString()}`
                : entry.value
              }
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function AdvancedAnalyticsGrid({ data, viewMode, comparisonPeriod }: AdvancedAnalyticsGridProps) {
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  // Generate customer segmentation data
  const customerSegments = useMemo(() => [
    { name: 'Enterprise', value: 45, customers: 1254, color: CHART_COLORS[0] },
    { name: 'SMB', value: 32, customers: 2847, color: CHART_COLORS[1] },
    { name: 'Startup', value: 18, customers: 1893, color: CHART_COLORS[2] },
    { name: 'Individual', value: 5, customers: 672, color: CHART_COLORS[3] }
  ], [])

  // Generate channel performance data
  const channelData = useMemo(() => [
    { channel: 'Web', revenue: 125000, orders: 450, conversion: 3.2 },
    { channel: 'Mobile', revenue: 89000, orders: 320, conversion: 4.1 },
    { channel: 'API', revenue: 67000, orders: 180, conversion: 5.8 },
    { channel: 'Partner', revenue: 45000, orders: 120, conversion: 2.9 }
  ], [])

  // Generate device analytics
  const deviceData = useMemo(() => [
    { device: 'Desktop', sessions: 2847, revenue: 156000 },
    { device: 'Mobile', sessions: 1923, revenue: 89000 },
    { device: 'Tablet', sessions: 634, revenue: 23000 }
  ], [])

  // Generate regional performance
  const regionalData = useMemo(() => [
    { region: 'NCR', revenue: 145000, growth: 12.3 },
    { region: 'Cebu', revenue: 89000, growth: 8.7 },
    { region: 'Davao', revenue: 67000, growth: 15.2 },
    { region: 'Baguio', revenue: 34000, growth: 6.1 }
  ], [])

  return (
    <div className="space-y-6">
      {/* Customer Segmentation & Channel Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer Segmentation Pie Chart */}
        <Card variant="elevated">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-fintech-accent" />
                  Customer Segments
                </CardTitle>
                <p className="text-sm text-fintech-neutral-600 dark:text-fintech-neutral-400">
                  Revenue distribution by customer type
                </p>
              </div>
              <Badge variant="info" size="sm">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex-1 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3 min-w-[140px]">
                {customerSegments.map((segment, index) => (
                  <div key={segment.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: segment.color }}
                      />
                      <span className="font-medium text-fintech-neutral-700 dark:text-fintech-neutral-300">
                        {segment.name}
                      </span>
                    </div>
                    <span className="font-bold text-fintech-neutral-900 dark:text-fintech-neutral-100">
                      {segment.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Channel Performance */}
        <Card variant="elevated">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-fintech-primary" />
              Channel Performance
            </CardTitle>
            <p className="text-sm text-fintech-neutral-600 dark:text-fintech-neutral-400">
              Revenue and conversion by sales channel
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(226, 232, 240)" strokeOpacity={0.6} />
                  <XAxis 
                    dataKey="channel" 
                    stroke="rgb(100, 116, 139)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="rgb(100, 116, 139)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₱${(value/1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="revenue" 
                    fill="rgb(59, 130, 246)" 
                    radius={[4, 4, 0, 0]}
                    name="Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Analytics & Regional Performance */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Device Analytics */}
        <Card variant="elevated">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Monitor className="h-4 w-4 text-fintech-accent" />
              Device Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {deviceData.map((device, index) => {
                const percentage = (device.sessions / deviceData.reduce((sum, d) => sum + d.sessions, 0)) * 100
                const IconComponent = device.device === 'Desktop' ? Monitor : 
                                   device.device === 'Mobile' ? Smartphone : 
                                   Target
                
                return (
                  <div key={device.device} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-fintech-neutral-600" />
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <span className="font-bold">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-fintech-neutral-200 dark:bg-fintech-neutral-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-fintech-primary to-fintech-accent h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-fintech-neutral-600 dark:text-fintech-neutral-400">
                      {device.sessions.toLocaleString()} sessions • ₱{device.revenue.toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Regional Performance */}
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-fintech-secondary" />
              Regional Performance
            </CardTitle>
            <p className="text-sm text-fintech-neutral-600 dark:text-fintech-neutral-400">
              Revenue and growth by region
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-4 md:grid-cols-2">
              {regionalData.map((region, index) => (
                <div 
                  key={region.region}
                  className="p-4 bg-fintech-neutral-50 dark:bg-fintech-neutral-800 rounded-xl hover:bg-fintech-neutral-100 dark:hover:bg-fintech-neutral-700 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-fintech-neutral-900 dark:text-fintech-neutral-100">
                      {region.region}
                    </h4>
                    <div className="flex items-center text-sm text-fintech-secondary font-medium">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{region.growth}%
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-fintech-neutral-900 dark:text-fintech-neutral-100">
                      ₱{region.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-fintech-neutral-600 dark:text-fintech-neutral-400">
                      Revenue this month
                    </p>
                  </div>

                  <div className="mt-3 w-full bg-fintech-neutral-200 dark:bg-fintech-neutral-600 rounded-full h-1.5">
                    <div 
                      className="bg-fintech-secondary h-1.5 rounded-full transition-all duration-700 group-hover:bg-fintech-primary"
                      style={{ width: `${(region.revenue / Math.max(...regionalData.map(r => r.revenue))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel Analysis */}
      {viewMode === "detailed" && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-fintech-warning" />
              Conversion Funnel Analysis
            </CardTitle>
            <p className="text-sm text-fintech-neutral-600 dark:text-fintech-neutral-400">
              Track user journey and identify optimization opportunities
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { stage: "Visitors", count: 12847, rate: 100, color: "bg-fintech-primary" },
                { stage: "Product Views", count: 4231, rate: 32.9, color: "bg-fintech-accent" },
                { stage: "Add to Cart", count: 1847, rate: 14.4, color: "bg-fintech-warning" },
                { stage: "Purchase", count: 634, rate: 4.9, color: "bg-fintech-secondary" }
              ].map((step, index) => (
                <div key={step.stage} className="text-center">
                  <div className={cn(
                    "mx-auto w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3",
                    step.color
                  )}>
                    {step.rate.toFixed(1)}%
                  </div>
                  <h4 className="font-semibold text-fintech-neutral-900 dark:text-fintech-neutral-100 mb-1">
                    {step.stage}
                  </h4>
                  <p className="text-lg font-bold text-fintech-neutral-700 dark:text-fintech-neutral-300">
                    {step.count.toLocaleString()}
                  </p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 transform -translate-y-1/2 right-0 translate-x-1/2">
                      <ArrowUpRight className="h-5 w-5 text-fintech-neutral-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}