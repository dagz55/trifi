"use client"

import { useMemo } from "react"
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart,
  Area,
  ComposedChart,
  Bar
} from "recharts"

interface EnhancedRevenueChartProps {
  data: Array<{
    month: string
    revenue: number
    expenses: number
    profit: number
    customers: number
    orders: number
  }>
  comparisonPeriod: string
  height?: number
}

// Custom tooltip with proper text fitting
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-fintech-neutral-900 border border-fintech-neutral-200 dark:border-fintech-neutral-700 rounded-xl p-4 shadow-fintech-lg backdrop-blur-sm">
        <p className="text-sm font-semibold text-fintech-neutral-900 dark:text-fintech-neutral-100 mb-2">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs font-medium text-fintech-neutral-600 dark:text-fintech-neutral-400">
                  {entry.name}
                </span>
              </div>
              <span className="text-sm font-bold text-fintech-neutral-900 dark:text-fintech-neutral-100">
                {entry.name === 'Revenue' || entry.name === 'Expenses' || entry.name === 'Profit' 
                  ? `₱${entry.value.toLocaleString()}`
                  : entry.value.toLocaleString()
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

// Custom axis label formatter for better text fitting
const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `₱${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `₱${(value / 1000).toFixed(0)}K`
  }
  return `₱${value}`
}

// Custom dot component for data points
const CustomDot = (props: any) => {
  const { cx, cy, stroke, fill } = props
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={4} 
      fill={fill} 
      stroke={stroke} 
      strokeWidth={2}
      className="drop-shadow-sm"
    />
  )
}

export function EnhancedRevenueChart({ data, comparisonPeriod, height = 300 }: EnhancedRevenueChartProps) {
  // Calculate trend data for better insights
  const trendData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      profitMargin: ((item.profit / item.revenue) * 100).toFixed(1),
      trend: index > 0 ? item.revenue - data[index - 1].revenue : 0
    }))
  }, [data])

  // Responsive font sizes based on container width
  const responsiveStyle = {
    fontSize: {
      axis: '12px',
      legend: '11px',
      tooltip: '13px'
    }
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-fintech-neutral-500">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-fintech-neutral-100 dark:bg-fintech-neutral-800 rounded-xl flex items-center justify-center">
            <div className="w-8 h-8 bg-fintech-neutral-300 dark:bg-fintech-neutral-600 rounded animate-pulse" />
          </div>
          <p className="text-sm font-medium">No data available</p>
          <p className="text-xs">Connect your data source to see analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={trendData}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 20,
          }}
        >
          <defs>
            {/* Gradient definitions for better visual appeal */}
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(239, 68, 68)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="rgb(239, 68, 68)" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(34, 197, 94)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="rgb(34, 197, 94)" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgb(226, 232, 240)"
            strokeOpacity={0.6}
            vertical={false}
          />
          
          <XAxis 
            dataKey="month" 
            stroke="rgb(100, 116, 139)"
            fontSize={12}
            fontWeight={500}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          
          <YAxis 
            stroke="rgb(100, 116, 139)"
            fontSize={11}
            fontWeight={500}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatCurrency}
            width={60}
            dx={-5}
          />
          
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ 
              stroke: 'rgb(59, 130, 246)', 
              strokeWidth: 1,
              strokeDasharray: '4 4'
            }}
          />

          {/* Area charts for background fill */}
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="none"
            fill="url(#revenueGradient)"
            strokeWidth={0}
          />

          {/* Bar chart for profit */}
          <Bar
            dataKey="profit"
            fill="rgb(34, 197, 94)"
            fillOpacity={0.2}
            radius={[2, 2, 0, 0]}
          />
          
          {/* Line charts with custom styling */}
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="rgb(59, 130, 246)"
            strokeWidth={3}
            dot={<CustomDot />}
            activeDot={{ 
              r: 6, 
              stroke: 'rgb(59, 130, 246)', 
              strokeWidth: 2,
              fill: 'white'
            }}
            name="Revenue"
          />
          
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="rgb(239, 68, 68)"
            strokeWidth={2.5}
            strokeDasharray="5 5"
            dot={<CustomDot />}
            activeDot={{ 
              r: 6, 
              stroke: 'rgb(239, 68, 68)', 
              strokeWidth: 2,
              fill: 'white'
            }}
            name="Expenses"
          />

          <Line
            type="monotone"
            dataKey="profit"
            stroke="rgb(34, 197, 94)"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ 
              r: 6, 
              stroke: 'rgb(34, 197, 94)', 
              strokeWidth: 2,
              fill: 'white'
            }}
            name="Profit"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}