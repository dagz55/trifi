"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"

const data = [
  { month: "Jan", revenue: 2000 },
  { month: "Feb", revenue: 2200 },
  { month: "Mar", revenue: 2700 },
  { month: "Apr", revenue: 2400 },
  { month: "May", revenue: 2800 },
  { month: "Jun", revenue: 3200 },
  { month: "Jul", revenue: 3100 },
  { month: "Aug", revenue: 3400 },
  { month: "Sep", revenue: 3700 },
  { month: "Oct", revenue: 3500 },
  { month: "Nov", revenue: 3800 },
  { month: "Dec", revenue: 4200 },
]

export function RevenueChart() {
  const { theme } = useTheme()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Month</span>
              <span className="font-bold text-muted-foreground">{label}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Revenue</span>
              <span className="font-bold">₱{payload[0].value?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis
          dataKey="month"
          stroke={theme === "dark" ? "#888888" : "#333333"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={theme === "dark" ? "#888888" : "#333333"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₱${value}`}
        />
        <Tooltip
          content={CustomTooltip}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={theme === "dark" ? "#adfa1d" : "#0ea5e9"}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
