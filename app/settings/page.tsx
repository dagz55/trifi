"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Bell,
  Shield,
  Palette,
  Monitor,
  Database,
  Download,
  Trash2,
  Settings as SettingsIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
  Laptop,
  Smartphone,
  Tablet,
  Lock,
  Camera,
  Save,
  RefreshCw,
  RotateCcw
} from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSettings } from "@/contexts/settings-context"
import { testSupabaseConnection } from "@/lib/supabase"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("account")
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null)
  
  const {
    settings,
    updateSettings,
    updateNotificationSettings,
    updatePrivacySettings,
    clearBusinessMetrics,
    clearTransactions,
    clearProjects,
    clearInvestments,
    clearPayments,
    clearMeetings,
    clearMembers,
    clearNotifications,
    clearOrganizationData,
    clearAllData
  } = useSettings()
  
  // Demo user data
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    timezone: "utc+8",
    avatar: "",
    language: "en",
    currency: "php",
    dateFormat: "mm-dd-yyyy",
    theme: "system",
    fontSize: 16,
    emailNotifications: false,
    pushNotifications: false,
    smsNotifications: false,
    accountActivity: false,
    newFeatures: false,
    marketing: false,
    frequency: "real-time",
    analyticsSharing: false,
    personalizedAds: false,
    visibility: "private",
    dataRetention: "1-year"
  })

  const updateUserData = (updates: Partial<typeof userData>) => {
    setUserData(prev => ({ ...prev, ...updates }))
  }

  const handleSave = async (section: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`${section} settings saved successfully`)
    } catch (error) {
      toast.error(`Failed to save ${section} settings`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all application data? This action cannot be undone.")) {
      clearAllData()
    }
  }

  const handleResetAll = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      clearAllData()
      
      // Reset user data to defaults
      setUserData({
        fullName: "",
        email: "",
        phone: "",
        timezone: "utc+8",
        avatar: "",
        language: "en",
        currency: "php",
        dateFormat: "mm-dd-yyyy",
        theme: "system",
        fontSize: 16,
        emailNotifications: false,
        pushNotifications: false,
        smsNotifications: false,
        accountActivity: false,
        newFeatures: false,
        marketing: false,
        frequency: "real-time",
        analyticsSharing: false,
        personalizedAds: false,
        visibility: "private",
        dataRetention: "1-year"
      })
    } catch (error) {
      toast.error("Failed to reset application")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestSupabaseConnection = async () => {
    setTestingConnection(true)
    setConnectionStatus(null)
    
    try {
      const result = await testSupabaseConnection()
      setConnectionStatus(result)
      
      if (result.success) {
        toast.success("Supabase connection successful!")
      } else {
        toast.error("Supabase connection failed")
      }
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: `Connection test failed: ${error}`
      })
      toast.error("Connection test failed")
    } finally {
      setTestingConnection(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This is a demo settings page. Changes are saved locally and will be lost when you refresh the page.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="account" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <SettingsIcon className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Account Settings</span>
              </CardTitle>
              <CardDescription>Manage your account information and profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="space-y-4">
                <Label>Profile Picture</Label>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userData.avatar} alt={userData.fullName} />
                    <AvatarFallback className="text-lg">
                      {userData.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2" onClick={() => toast.info("Photo upload functionality would be implemented here")}>
                      <Palette className="h-4 w-4" />
                      <span>Change Photo</span>
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    value={userData.fullName}
                    onChange={(e) => updateUserData({ fullName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => updateUserData({ email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => updateUserData({ phone: e.target.value })}
                    placeholder="+63 XXX XXX XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={userData.timezone} onValueChange={(value) => updateUserData({ timezone: value })}>
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc+8">Philippines Standard Time (UTC+8)</SelectItem>
                      <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="utc+0">Greenwich Mean Time (UTC+0)</SelectItem>
                      <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                      <SelectItem value="utc+9">Japan Standard Time (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("Account")} disabled={isLoading} className="flex items-center space-x-2">
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>{isLoading ? "Saving..." : "Save Changes"}</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>Manage your account's security and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="Enter current password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="Enter new password" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="two-factor" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSave("Security")} disabled={isLoading}>
                  Save Security Settings
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Login History</CardTitle>
                <CardDescription>Recent login activities on your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { date: "Dec 15, 2024", time: "2:30 PM", location: "Manila, Philippines", device: "Chrome on Windows" },
                  { date: "Dec 14, 2024", time: "9:15 AM", location: "Manila, Philippines", device: "Safari on iPhone" },
                  { date: "Dec 13, 2024", time: "6:45 PM", location: "Manila, Philippines", device: "Firefox on Mac" },
                ].map((login, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{login.device}</p>
                      <p className="text-xs text-muted-foreground">{login.location}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm">{login.date}</p>
                      <p className="text-xs text-muted-foreground">{login.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Currently active sessions on your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { device: "Desktop", browser: "Chrome", os: "Windows 11", icon: Monitor, current: true },
                  { device: "Mobile", browser: "Safari", os: "iOS 17", icon: Smartphone, current: false },
                  { device: "Tablet", browser: "Firefox", os: "Android", icon: Tablet, current: false },
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <session.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{session.device}</p>
                        <p className="text-xs text-muted-foreground">{session.browser} on {session.os}</p>
                      </div>
                    </div>
                    {session.current ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Current</span>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => toast.success("Session terminated")}>
                        End Session
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => toast.success("All other sessions have been logged out")}>
                  Log Out All Other Sessions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5" />
                <span>Preferences</span>
              </CardTitle>
              <CardDescription>Customize your dashboard experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Language & Region */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Language & Region</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={userData.language} onValueChange={(value) => updateUserData({ language: value })}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="tl">Filipino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={userData.currency} onValueChange={(value) => updateUserData({ currency: value })}>
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="php">PHP (₱)</SelectItem>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select value={userData.dateFormat} onValueChange={(value) => updateUserData({ dateFormat: value })}>
                        <SelectTrigger id="date-format">
                          <SelectValue placeholder="Select Date Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Appearance */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Appearance</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <RadioGroup value={userData.theme} onValueChange={(value) => updateUserData({ theme: value })}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="theme-light" />
                          <Label htmlFor="theme-light">Light</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dark" id="theme-dark" />
                          <Label htmlFor="theme-dark">Dark</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="system" id="theme-system" />
                          <Label htmlFor="theme-system">System</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="font-size">Font Size: {userData.fontSize}px</Label>
                      <Slider 
                        value={[userData.fontSize]} 
                        onValueChange={([value]) => updateUserData({ fontSize: value })}
                        max={24} 
                        min={12} 
                        step={1} 
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("Preferences")} disabled={isLoading}>
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Notification Channels */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={userData.emailNotifications}
                        onCheckedChange={(checked) => updateUserData({ emailNotifications: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={userData.pushNotifications}
                        onCheckedChange={(checked) => updateUserData({ pushNotifications: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive text message alerts</p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={userData.smsNotifications}
                        onCheckedChange={(checked) => updateUserData({ smsNotifications: checked })}
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Types */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label htmlFor="account-activity">Account Activity</Label>
                        <p className="text-sm text-muted-foreground">Login, purchases, and payments</p>
                      </div>
                      <Switch
                        id="account-activity"
                        checked={userData.accountActivity}
                        onCheckedChange={(checked) => updateUserData({ accountActivity: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label htmlFor="new-features">New Features</Label>
                        <p className="text-sm text-muted-foreground">Updates and new features</p>
                      </div>
                      <Switch
                        id="new-features"
                        checked={userData.newFeatures}
                        onCheckedChange={(checked) => updateUserData({ newFeatures: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label htmlFor="marketing">Marketing</Label>
                        <p className="text-sm text-muted-foreground">Promotions and offers</p>
                      </div>
                      <Switch
                        id="marketing"
                        checked={userData.marketing}
                        onCheckedChange={(checked) => updateUserData({ marketing: checked })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Frequency</h3>
                <Select value={userData.frequency} onValueChange={(value) => updateUserData({ frequency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real-time">Real-time</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("Notifications")} disabled={isLoading}>
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy Settings</span>
              </CardTitle>
              <CardDescription>Manage your privacy and data settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Data Sharing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Sharing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="analytics-sharing">Analytics Data</Label>
                        <p className="text-sm text-muted-foreground">Share anonymous usage data</p>
                      </div>
                      <Switch
                        id="analytics-sharing"
                        checked={userData.analyticsSharing}
                        onCheckedChange={(checked) => updateUserData({ analyticsSharing: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="personalized-ads">Personalized Ads</Label>
                        <p className="text-sm text-muted-foreground">Allow targeted advertisements</p>
                      </div>
                      <Switch
                        id="personalized-ads"
                        checked={userData.personalizedAds}
                        onCheckedChange={(checked) => updateUserData({ personalizedAds: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Account Visibility */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Visibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={userData.visibility}
                      onValueChange={(value) => updateUserData({ visibility: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="visibility-public" />
                        <div>
                          <Label htmlFor="visibility-public">Public</Label>
                          <p className="text-sm text-muted-foreground">Your profile is visible to others</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="visibility-private" />
                        <div>
                          <Label htmlFor="visibility-private">Private</Label>
                          <p className="text-sm text-muted-foreground">Your profile is hidden from others</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Data Retention */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Retention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={userData.dataRetention}
                      onValueChange={(value) => updateUserData({ dataRetention: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6-months">6 Months</SelectItem>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="2-years">2 Years</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Data Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full" onClick={() => toast.success("Data download will be ready in 24 hours")}>
                      Download My Data
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={() => toast.error("Account deletion requires email confirmation")}>
                      Delete My Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("Privacy")} disabled={isLoading}>
                Save Privacy Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Data Management</span>
                </CardTitle>
                <CardDescription>Clear mock data and reset your application to a clean state</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Use these tools to remove demo data and start with a clean application. This will help you get a fresh start without any mock information.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Clear Application Data</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Remove all mock transactions, projects, and other demo data from the application.
                    </p>
                    <Button variant="destructive" onClick={handleClearData}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear All Data
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-2">Database Connection</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Test the connection to your Supabase database to ensure proper configuration.
                    </p>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={handleTestSupabaseConnection} 
                        disabled={testingConnection}
                        variant="outline"
                      >
                        {testingConnection ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing Connection...
                          </>
                        ) : (
                          <>
                            <Database className="mr-2 h-4 w-4" />
                            Test Supabase Connection
                          </>
                        )}
                      </Button>

                      {connectionStatus && (
                        <Alert>
                          {connectionStatus.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <AlertDescription className={connectionStatus.success ? "text-green-700" : "text-red-700"}>
                            {connectionStatus.message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-2">Export Data</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Download your application data for backup or migration purposes.
                    </p>
                    <Button variant="outline" disabled>
                      <Download className="mr-2 h-4 w-4" />
                      Export Data (Coming Soon)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-destructive">
                  <RotateCcw className="h-5 w-5" />
                  <span>Complete Reset</span>
                </CardTitle>
                <CardDescription>Reset the entire application to its original clean state</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Warning:</strong> This will clear ALL demo data from every section of the application. This action cannot be undone.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">This will reset:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• All business metrics and financial data</li>
                      <li>• Notifications and alerts history</li>
                      <li>• Chat conversations and message history</li>
                      <li>• Investment portfolios and holdings</li>
                      <li>• Transaction and payment history</li>
                      <li>• Analytics charts and reports</li>
                      <li>• Organization and member data</li>
                      <li>• Projects and task information</li>
                      <li>• User preferences and settings</li>
                    </ul>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      variant="destructive" 
                      onClick={handleResetAll}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RotateCcw className="mr-2 h-4 w-4" />
                      )}
                      {isLoading ? "Resetting..." : "Reset Everything"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => toast.info("Application backup feature would be available in production")}
                      disabled={isLoading}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Backup First
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
