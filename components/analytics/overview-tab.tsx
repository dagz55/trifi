"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewCards } from "@/components/analytics/overview-cards"
import { RevenueChart } from "@/components/analytics/revenue-chart"
import { RecentTransactions } from "@/components/analytics/recent-transactions"
import { AccountGrowth } from "@/components/analytics/account-growth"
import { TopProducts } from "@/components/analytics/top-products"
import { UserActivity } from "@/components/analytics/user-activity"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRange } from "react-day-picker"

interface OverviewTabProps {
  dateRange?: DateRange | undefined
}

export function OverviewTab({ dateRange }: OverviewTabProps) {
  const [comparisonPeriod, setComparisonPeriod] = useState("previous_month")

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Dashboard Overview</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Compare to:</span>
          <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous_month">Previous Month</SelectItem>
              <SelectItem value="previous_quarter">Previous Quarter</SelectItem>
              <SelectItem value="previous_year">Previous Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <OverviewCards comparisonPeriod={comparisonPeriod} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle style={{ color: '#111827' }}>Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart comparisonPeriod={comparisonPeriod} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle style={{ color: '#111827' }}>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle style={{ color: '#111827' }}>Account Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountGrowth comparisonPeriod={comparisonPeriod} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle style={{ color: '#111827' }}>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProducts />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle style={{ color: '#111827' }}>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <UserActivity />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
