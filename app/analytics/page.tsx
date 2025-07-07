"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/date-range-picker"
import { OverviewTab } from "@/components/analytics/overview-tab"
import { EnhancedOverviewTab } from "@/components/analytics/enhanced-overview-tab"
import { AnalyticsTab } from "@/components/analytics/analytics-tab"
import { ReportsTab } from "@/components/analytics/reports-tab"
import { NotificationsTab } from "@/components/analytics/notifications-tab"
import { ExportDataModal } from "@/components/export-data-modal"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { DateRange } from "react-day-picker"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [useEnhancedView, setUseEnhancedView] = useState(true)

  // Mock accounts data for export functionality
  const mockAccounts = [
    { name: "Checking", balance: 0 },
    { name: "Savings", balance: 0 },
    { name: "Investment", balance: 0 },
  ]

  const handleExportData = () => {
    setIsExportModalOpen(true)
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-financial-heading">Financial Analytics</h2>
          <p className="text-financial-body">
            Comprehensive insights powered by AI and machine learning
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={useEnhancedView ? "default" : "outline"}
            size="sm"
            onClick={() => setUseEnhancedView(!useEnhancedView)}
            className="text-xs"
          >
            {useEnhancedView ? "Enhanced" : "Standard"} View
          </Button>
          <DateRangePicker 
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            className="w-[280px]"
          />
          <Button onClick={handleExportData} variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {useEnhancedView ? (
            <EnhancedOverviewTab dateRange={dateRange} />
          ) : (
            <OverviewTab dateRange={dateRange} />
          )}
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab dateRange={dateRange} />
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <ReportsTab dateRange={dateRange} />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <NotificationsTab dateRange={dateRange} />
        </TabsContent>
      </Tabs>

      {/* Export Data Modal */}
      <ExportDataModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        accounts={mockAccounts}
      />
    </div>
  )
}
