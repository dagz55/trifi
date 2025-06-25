"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const marketIndices: any[] = []

const sectorPerformance: any[] = []

const marketTrends: any[] = []

const economicIndicators: any[] = []

const marketNews: any[] = []

export function MarketAnalysis() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {marketIndices.length > 0 ? (
          marketIndices.map((index) => (
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
          ))
        ) : (
          <div className="col-span-4 text-center py-12">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No market data available</h3>
            <p className="text-muted-foreground">
              Market indices will appear here once data is connected
            </p>
          </div>
        )}
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
                {marketTrends.length > 0 ? (
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
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No market trend data</h3>
                      <p className="text-sm">
                        Market performance charts will appear here once data is connected
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sectorPerformance.length > 0 ? (
              sectorPerformance.map((sector) => (
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
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No sector performance data</h3>
                <p className="text-muted-foreground">
                  Sector performance metrics will appear here once data is connected
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="indicators">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {economicIndicators.length > 0 ? (
              economicIndicators.map((indicator) => (
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
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No economic indicators</h3>
                <p className="text-muted-foreground">
                  Economic indicators will appear here once data is connected
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="news">
          <div className="space-y-4">
            {marketNews.length > 0 ? (
              marketNews.map((news, index) => (
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
              ))
            ) : (
              <div className="text-center py-12">
                <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No market news available</h3>
                <p className="text-muted-foreground">
                  Market news and updates will appear here once data is connected
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
