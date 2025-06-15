"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const marketIndices = [
  { name: "S&P 500", value: 4185.47, change: "+1.2%", changeValue: "+49.82" },
  { name: "NASDAQ", value: 12965.34, change: "+0.8%", changeValue: "+103.52" },
  { name: "DOW JONES", value: 33875.4, change: "+0.5%", changeValue: "+169.38" },
  { name: "RUSSELL 2000", value: 1845.12, change: "-0.3%", changeValue: "-5.54" },
]

const sectorPerformance = [
  { sector: "Technology", performance: "+2.4%", trend: "up" },
  { sector: "Healthcare", performance: "+1.8%", trend: "up" },
  { sector: "Financial", performance: "+1.2%", trend: "up" },
  { sector: "Consumer Disc.", performance: "+0.9%", trend: "up" },
  { sector: "Energy", performance: "-0.5%", trend: "down" },
  { sector: "Utilities", performance: "-1.2%", trend: "down" },
]

const marketTrends = [
  { month: "Jan", sp500: 3800, nasdaq: 11000, dow: 31000 },
  { month: "Feb", sp500: 3900, nasdaq: 11500, dow: 31500 },
  { month: "Mar", sp500: 4000, nasdaq: 12000, dow: 32000 },
  { month: "Apr", sp500: 4100, nasdaq: 12500, dow: 32500 },
  { month: "May", sp500: 4050, nasdaq: 12200, dow: 32200 },
  { month: "Jun", sp500: 4185, nasdaq: 12965, dow: 33875 },
]

const economicIndicators = [
  { indicator: "GDP Growth", value: "2.1%", status: "stable" },
  { indicator: "Inflation Rate", value: "3.2%", status: "rising" },
  { indicator: "Unemployment", value: "3.7%", status: "falling" },
  { indicator: "Interest Rate", value: "5.25%", status: "stable" },
]

const marketNews = [
  {
    title: "Fed Signals Potential Rate Cut in Q4",
    summary: "Federal Reserve hints at possible interest rate reduction based on inflation trends",
    time: "2 hours ago",
    impact: "positive",
  },
  {
    title: "Tech Earnings Beat Expectations",
    summary: "Major technology companies report stronger than expected quarterly results",
    time: "4 hours ago",
    impact: "positive",
  },
  {
    title: "Oil Prices Surge on Supply Concerns",
    summary: "Crude oil prices jump 3% amid geopolitical tensions affecting supply chains",
    time: "6 hours ago",
    impact: "mixed",
  },
  {
    title: "Consumer Confidence Index Rises",
    summary: "Latest consumer confidence data shows improvement in economic sentiment",
    time: "1 day ago",
    impact: "positive",
  },
]

export function MarketAnalysis() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {marketIndices.map((index) => (
          <Card key={index.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{index.name}</CardTitle>
              {index.change.startsWith("+") ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{index.value.toLocaleString()}</div>
              <p className={`text-xs ${index.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                {index.change} ({index.changeValue})
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="sectors">Sector Performance</TabsTrigger>
          <TabsTrigger value="indicators">Economic Indicators</TabsTrigger>
          <TabsTrigger value="news">Market News</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>6-Month Market Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sp500" stroke="#8884d8" name="S&P 500" />
                    <Line type="monotone" dataKey="nasdaq" stroke="#82ca9d" name="NASDAQ" />
                    <Line type="monotone" dataKey="dow" stroke="#ffc658" name="DOW JONES" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sectorPerformance.map((sector) => (
              <Card key={sector.sector}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{sector.sector}</CardTitle>
                  {sector.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${sector.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {sector.performance}
                  </div>
                  <p className="text-xs text-muted-foreground">Today's performance</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="indicators">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {economicIndicators.map((indicator) => (
              <Card key={indicator.indicator}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{indicator.indicator}</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{indicator.value}</div>
                  <Badge
                    variant={
                      indicator.status === "rising"
                        ? "destructive"
                        : indicator.status === "falling"
                          ? "default"
                          : "secondary"
                    }
                    className="mt-2"
                  >
                    {indicator.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="news">
          <div className="space-y-4">
            {marketNews.map((news, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-semibold">{news.title}</h3>
                      <p className="text-sm text-muted-foreground">{news.summary}</p>
                      <p className="text-xs text-muted-foreground">{news.time}</p>
                    </div>
                    <Badge
                      variant={
                        news.impact === "positive"
                          ? "default"
                          : news.impact === "negative"
                            ? "destructive"
                            : "secondary"
                      }
                      className="ml-4"
                    >
                      {news.impact}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
