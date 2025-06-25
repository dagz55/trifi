"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// TODO: Replace with actual data from your database/API
interface AnalyticsTabProps {
  comparisonPeriod: string
}

export function AnalyticsTab({ comparisonPeriod }: AnalyticsTabProps) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("last_month")

  // TODO: Fetch real analytics data from your Supabase database
  const customerSegmentationData: any[] = []
  const retentionRateData: any[] = []
  const channelPerformanceData: any[] = []

  const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
      <div className="text-center">
        <p className="text-lg font-medium">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Advanced Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Detailed insights into customer behavior and performance metrics
          </p>
        </div>
        <Select value={selectedTimeFrame} onValueChange={setSelectedTimeFrame}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last_week">Last Week</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="last_quarter">Last Quarter</SelectItem>
            <SelectItem value="last_year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Segmentation</CardTitle>
          </CardHeader>
          <CardContent>
            {customerSegmentationData.length === 0 ? (
              <EmptyState 
                title="No segmentation data" 
                description="Connect your database to see customer segments" 
              />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerSegmentationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {customerSegmentationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {retentionRateData.length === 0 ? (
              <EmptyState 
                title="No retention data" 
                description="Connect your database to see retention metrics" 
              />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={retentionRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Channel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {channelPerformanceData.length === 0 ? (
            <EmptyState 
              title="No channel data" 
              description="Connect your database to see channel performance metrics" 
            />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={channelPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="acquisitions" fill="#3b82f6" name="Acquisitions" />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue (₱)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

