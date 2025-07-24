"use client"

import { useState, useEffect } from "react"
import { Bell, X, Info, AlertTriangle, CheckCircle, AlertCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSettings } from "@/contexts/settings-context"
import { useAuth } from "@/contexts/auth-context"
import { db, Notification } from "@/lib/database"
import { toast } from "sonner"

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircle
    case 'warning': return AlertTriangle  
    case 'error': return AlertCircle
    default: return Info
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'success': return 'text-green-600'
    case 'warning': return 'text-yellow-600'
    case 'error': return 'text-red-600'
    default: return 'text-blue-600'
  }
}

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { userProfile, currentOrganization } = useAuth()

  const loadNotifications = async () => {
    if (!userProfile?.id || !currentOrganization?.id) return

    setIsLoading(true)
    try {
      const { data, error } = await db.getNotifications(userProfile.id, currentOrganization.id)
      if (error) {
        console.error('Error loading notifications:', error)
      } else {
        setNotifications(data || [])
      }

      // Load unread count
      const { data: count, error: countError } = await db.getUnreadNotificationCount(userProfile.id, currentOrganization.id)
      if (!countError) {
        setUnreadCount(count || 0)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await db.markNotificationAsRead(notificationId)
      if (error) {
        toast.error('Failed to mark notification as read')
      } else {
        // Update local state
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      toast.error('Failed to mark notification as read')
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await db.deleteNotification(notificationId)
      if (error) {
        toast.error('Failed to delete notification')
      } else {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        toast.success('Notification deleted')
      }
    } catch (error) {
      toast.error('Failed to delete notification')
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [userProfile?.id, currentOrganization?.id])

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-96 z-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close notifications">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading notifications...</p>
                  </div>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type || 'info')
                  const iconColor = getNotificationColor(notification.type || 'info')
                  
                  return (
                    <Card 
                      key={notification.id} 
                      className={`mb-4 last:mb-0 border shadow-sm cursor-pointer transition-colors ${
                        !notification.is_read ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => !notification.is_read && markAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-full bg-opacity-10">
                            <IconComponent className={`h-5 w-5 ${iconColor}`} />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <p className={`text-sm leading-none ${!notification.is_read ? 'font-semibold' : 'font-medium'}`}>
                                {notification.title}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                {notification.created_at ? new Date(notification.created_at).toLocaleDateString() : 'Just now'}
                              </p>
                              {!notification.is_read && (
                                <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-muted-foreground mb-2">No Notifications</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                    You're all caught up! New notifications will appear here when you have updates.
                  </p>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Notification Settings
                  </Button>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
