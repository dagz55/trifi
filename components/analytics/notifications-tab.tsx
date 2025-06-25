"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Users, Plus } from "lucide-react"
import { DateRange } from "react-day-picker"

interface NotificationsTabProps {
  dateRange?: DateRange | undefined
}

const notificationTypes = [
  { id: "account", label: "Account Activity", icon: Bell },
  { id: "security", label: "Security Alerts", icon: AlertTriangle },
  { id: "performance", label: "Performance Updates", icon: TrendingUp },
  { id: "market", label: "Market Trends", icon: TrendingDown },
  { id: "financial", label: "Financial Reports", icon: DollarSign },
  { id: "user", label: "User Behavior", icon: Users },
]

// Empty recent notifications for clean state
const recentNotifications: any[] = []

export function NotificationsTab({ dateRange }: NotificationsTabProps) {
  const [notifications, setNotifications] = useState({
    account: false,
    security: true,
    performance: false,
    market: false,
    financial: false,
    user: false,
  })

  const toggleNotification = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id as keyof typeof prev] }))
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <type.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{type.label}</span>
              </div>
              <Switch checked={notifications[type.id as keyof typeof notifications]} onCheckedChange={() => toggleNotification(type.id)} />
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {recentNotifications.length > 0 ? (
            <div className="space-y-4">
              {recentNotifications.map((notification, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <notification.icon className={`h-5 w-5 ${notification.color}`} />
                  <div>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-muted-foreground mb-2">No Recent Notifications</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                When you enable notification types above, recent alerts will appear here for quick access.
              </p>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Configure Alerts
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button variant="outline" className="text-sm">
          View All Notifications
        </Button>
      </div>
    </div>
  )
}
