"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { toast } from "sonner"

export interface UserSettings {
  avatar: string
  fullName: string
  email: string
  phone: string
  timezone: string
  language: string
  currency: string
  dateFormat: string
  fontSize: number
  theme: "light" | "dark" | "system"
  layout: "default" | "compact" | "expanded"
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    accountActivity: boolean
    newFeatures: boolean
    marketing: boolean
    frequency: "real-time" | "daily" | "weekly"
    quietHoursStart: string
    quietHoursEnd: string
  }
  privacy: {
    analyticsSharing: boolean
    personalizedAds: boolean
    visibility: "public" | "private"
    dataRetention: "6-months" | "1-year" | "2-years" | "indefinite"
  }
}

const defaultSettings: UserSettings = {
  avatar: "",
  fullName: "",
  email: "",
  phone: "",
  timezone: "utc+8",
  language: "en",
  currency: "php",
  dateFormat: "mm-dd-yyyy",
  fontSize: 16,
  theme: "system",
  layout: "default",
  notifications: {
    email: false,
    push: false,
    sms: false,
    accountActivity: false,
    newFeatures: false,
    marketing: false,
    frequency: "real-time",
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  },
  privacy: {
    analyticsSharing: false,
    personalizedAds: false,
    visibility: "private",
    dataRetention: "1-year",
  },
}

interface SettingsContextType {
  // Data state
  businessMetrics: any[]
  setBusinessMetrics: (data: any[]) => void
  
  transactions: any[]
  setTransactions: (data: any[]) => void
  
  projects: any[]
  setProjects: (data: any[]) => void
  
  investments: any[]
  setInvestments: (data: any[]) => void
  
  payments: any[]
  setPayments: (data: any[]) => void
  
  meetings: any[]
  setMeetings: (data: any[]) => void
  
  members: any[]
  setMembers: (data: any[]) => void
  
  notifications: any[]
  setNotifications: (data: any[]) => void
  
  organizationData: any
  setOrganizationData: (data: any) => void
  
  // Data clearing functions
  clearBusinessMetrics: () => void
  clearTransactions: () => void
  clearProjects: () => void
  clearInvestments: () => void
  clearPayments: () => void
  clearMeetings: () => void
  clearMembers: () => void
  clearNotifications: () => void
  clearOrganizationData: () => void
  clearAllData: () => void
  
  // Settings
  settings: UserSettings
  updateSettings: (newSettings: Partial<UserSettings>) => void
  updateNotificationSettings: (settings: Partial<UserSettings["notifications"]>) => void
  updatePrivacySettings: (settings: Partial<UserSettings["privacy"]>) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Data states
  const [businessMetrics, setBusinessMetrics] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [investments, setInvestments] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [meetings, setMeetings] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [organizationData, setOrganizationData] = useState<any>({
    name: "Your Organization",
    type: "Business",
    location: "Your Location",
    phone: "Not provided",
    email: "Not provided",
    website: "Not provided",
    employees: 0,
    revenue: "₱0",
    founded: "Not set",
  })

  // Settings state
  const [settings, setSettings] = useState<UserSettings>(() => {
    // Try to load settings from localStorage during initialization
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("userSettings")
      if (savedSettings) {
        return JSON.parse(savedSettings)
      }
    }
    return defaultSettings
  })

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userSettings", JSON.stringify(settings))
    }
  }, [settings])

  // Data clearing functions
  const clearBusinessMetrics = () => {
    setBusinessMetrics([])
    toast.success("Business metrics data cleared")
  }

  const clearTransactions = () => {
    setTransactions([])
    toast.success("Transaction data cleared")
  }

  const clearProjects = () => {
    setProjects([])
    toast.success("Project data cleared")
  }

  const clearInvestments = () => {
    setInvestments([])
    toast.success("Investment data cleared")
  }

  const clearPayments = () => {
    setPayments([])
    toast.success("Payment data cleared")
  }

  const clearMeetings = () => {
    setMeetings([])
    toast.success("Meeting data cleared")
  }

  const clearMembers = () => {
    setMembers([])
    toast.success("Member data cleared")
  }

  const clearNotifications = () => {
    setNotifications([])
    toast.success("Notification data cleared")
  }

  const clearOrganizationData = () => {
    setOrganizationData({
      name: "Your Organization",
      type: "Business",
      location: "Your Location",
      phone: "Not provided",
      email: "Not provided",
      website: "Not provided",
      employees: 0,
      revenue: "₱0",
      founded: "Not set",
    })
    toast.success("Organization data cleared")
  }

  const clearAllData = () => {
    clearBusinessMetrics()
    clearTransactions()
    clearProjects()
    clearInvestments()
    clearPayments()
    clearMeetings()
    clearMembers()
    clearNotifications()
    clearOrganizationData()
    toast.success("All application data cleared")
  }

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const updateNotificationSettings = (notificationSettings: Partial<UserSettings["notifications"]>) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...notificationSettings },
    }))
  }

  const updatePrivacySettings = (privacySettings: Partial<UserSettings["privacy"]>) => {
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, ...privacySettings },
    }))
  }

  const value: SettingsContextType = {
    // Data state
    businessMetrics,
    setBusinessMetrics,
    transactions,
    setTransactions,
    projects,
    setProjects,
    investments,
    setInvestments,
    payments,
    setPayments,
    meetings,
    setMeetings,
    members,
    setMembers,
    notifications,
    setNotifications,
    organizationData,
    setOrganizationData,
    
    // Data clearing functions
    clearBusinessMetrics,
    clearTransactions,
    clearProjects,
    clearInvestments,
    clearPayments,
    clearMeetings,
    clearMembers,
    clearNotifications,
    clearOrganizationData,
    clearAllData,
    
    // Settings
    settings,
    updateSettings,
    updateNotificationSettings,
    updatePrivacySettings,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  
  if (!context.organizationData) {
    console.warn("organizationData is undefined in context")
  }
  
  return context
}
