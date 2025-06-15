"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, PieChart } from "lucide-react"
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, LineChart, Line } from "recharts"

const portfolioData = [
  { name: "Stocks", value: 45, amount: 450000, color: "#0088FE" },
  { name: "Bonds", value: 25, amount: 250000, color: "#00C49F" },
  { name: "Real Estate", value: 20, amount: 200000, color: "#FFBB28" },
  { name: "Crypto", value: 10, amount: 100000, color: "#FF8042" },
]

const performanceData = [
  { month: "Jan", value: 95000 },
  { month: "Feb", value: 98000 },
  { month: "Mar", value: 102000 },
  { month: "Apr", value: 105000 },
  { month: "May", value: 108000 },
  { month: "Jun", value: 112000 },
]

const topHoldings = [
  { symbol: "AAPL", name: "Apple Inc.", value: 85000, change: "+5.2%" },
  { symbol: "MSFT", name: "Microsoft Corp.", value: 72000, change: "+3.8%" },
  { symbol: "GOOGL", name: "Alphabet Inc.", value: 68000, change: "+2.1%" },
  { symbol: "AMZN", name: "Amazon.com Inc.", value: 55000, change: "-1.2%" },
  { symbol: "TSLA", name: "Tesla Inc.", value: 48000, change: "+8.7%" },
]

export function PortfolioOverview() {
  const totalValue = portfolioData.reduce((sum, item) => sum + item.amount, 0)
  const totalGain = 125000
  const totalGainPercent = ((totalGain / (totalValue - totalGain)) * 100).toFixed(2)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Portfolio Value</p>
            <div className="text-2xl font-bold">₱{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+0.5% from yesterday</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Total Gain</p>
            <div className="text-2xl font-bold text-green-500">+₱{totalGain.toLocaleString()}</div>
            <div className="text-2xl font-bold text-green-500">+₱8,420</div>
            <p className="text-xs text-muted-foreground">+1.2% from last week</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Day's Change</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">+$8,420</div>
          <p className="text-xs text-muted-foreground">+0.84% today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Diversification Score</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8.5/10</div>
          <p className="text-xs text-muted-foreground">Well diversified</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Tooltip formatter={(value, name) => [`₱${value.toLocaleString()}`, name]} />
                <RechartsPieChart data={portfolioData} cx="50%" cy="50%" outerRadius={80} dataKey="amount">
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {portfolioData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm">
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₱${value.toLocaleString()}`, "Portfolio Value"]} />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Top Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topHoldings.map((holding) => (
              <div key={holding.symbol} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">{holding.symbol}</span>
                  </div>
                  <div>
                    <p className="font-medium">{holding.name}</p>
                    <p className="text-sm text-muted-foreground">{holding.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₱{holding.value.toLocaleString()}</p>
                  <p className={`text-sm ${holding.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                    {holding.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
