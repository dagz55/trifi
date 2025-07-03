"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Eye, Crown, Key, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface RolePermissions {
  dashboard: {
    read: boolean
    write: boolean
    delete: boolean
  }
  analytics: {
    read: boolean
    write: boolean
    delete: boolean
  }
  projects: {
    read: boolean
    write: boolean
    delete: boolean
  }
  finances: {
    read: boolean
    write: boolean
    delete: boolean
  }
  settings: {
    read: boolean
    write: boolean
    delete: boolean
  }
}

interface Role {
  id: string
  name: string
  description: string
  permissions: RolePermissions
  users: number
  color: string
  createdAt: string
  updatedAt: string
}

interface CreateRoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRoleCreated: (role: Role & { users: number }) => void
}

const permissionCategories = [
  { 
    name: "dashboard", 
    label: "Dashboard", 
    description: "Access to dashboard overview and metrics",
    icon: Crown,
    color: "text-purple-600"
  },
  { 
    name: "analytics", 
    label: "Analytics", 
    description: "View reports and business intelligence",
    icon: Eye,
    color: "text-blue-600"
  },
  { 
    name: "projects", 
    label: "Projects", 
    description: "Manage projects and tasks",
    icon: Users,
    color: "text-green-600"
  },
  { 
    name: "finances", 
    label: "Finances", 
    description: "Access financial data and transactions",
    icon: Key,
    color: "text-orange-600"
  },
  { 
    name: "settings", 
    label: "Settings", 
    description: "Configure system and organization settings",
    icon: Shield,
    color: "text-red-600"
  },
]

const roleTemplates = [
  {
    name: "Admin",
    description: "Full access to all features and settings",
    permissions: {
      dashboard: { read: true, write: true, delete: true },
      analytics: { read: true, write: true, delete: true },
      projects: { read: true, write: true, delete: true },
      finances: { read: true, write: true, delete: true },
      settings: { read: true, write: true, delete: true },
    }
  },
  {
    name: "Manager",
    description: "Manage projects and view financial data",
    permissions: {
      dashboard: { read: true, write: true, delete: false },
      analytics: { read: true, write: false, delete: false },
      projects: { read: true, write: true, delete: true },
      finances: { read: true, write: true, delete: false },
      settings: { read: true, write: false, delete: false },
    }
  },
  {
    name: "Member",
    description: "Basic access to assigned projects",
    permissions: {
      dashboard: { read: true, write: false, delete: false },
      analytics: { read: false, write: false, delete: false },
      projects: { read: true, write: true, delete: false },
      finances: { read: false, write: false, delete: false },
      settings: { read: false, write: false, delete: false },
    }
  },
  {
    name: "Viewer",
    description: "Read-only access to basic features",
    permissions: {
      dashboard: { read: true, write: false, delete: false },
      analytics: { read: false, write: false, delete: false },
      projects: { read: true, write: false, delete: false },
      finances: { read: false, write: false, delete: false },
      settings: { read: false, write: false, delete: false },
    }
  }
]

export function CreateRoleModal({ open, onOpenChange, onRoleCreated }: CreateRoleModalProps) {
  const [step, setStep] = useState(1)
  const [roleName, setRoleName] = useState("")
  const [roleDescription, setRoleDescription] = useState("")
  const [permissions, setPermissions] = useState<RolePermissions>({
    dashboard: { read: false, write: false, delete: false },
    analytics: { read: false, write: false, delete: false },
    projects: { read: false, write: false, delete: false },
    finances: { read: false, write: false, delete: false },
    settings: { read: false, write: false, delete: false },
  })
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleTemplateSelect = (template: {
    name: string
    description: string
    permissions: RolePermissions
  }) => {
    setSelectedTemplate(template.name)
    setRoleName(template.name)
    setRoleDescription(template.description)
    setPermissions(template.permissions)
  }

  const handlePermissionChange = (category: string, permission: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof RolePermissions],
        [permission]: value
      }
    }))
  }

  const getTotalPermissions = () => {
    let total = 0
    Object.values(permissions).forEach(category => {
      Object.values(category).forEach(permission => {
        if (permission) total++
      })
    })
    return total
  }

  const handleCreateRole = async () => {
    if (!roleName.trim()) {
      toast.error("Role name is required")
      return
    }

    if (getTotalPermissions() === 0) {
      toast.error("At least one permission must be granted")
      return
    }

    setIsCreating(true)
    
    try {
      // Create role object
      const newRole = {
        id: Date.now().toString(), // Temporary ID - would be UUID in real implementation
        organization_id: "", // Will be set by parent component
        name: roleName,
        description: roleDescription,
        permissions: permissions,
        users: 0, // New role starts with 0 users
        color: "bg-blue-100 text-blue-800",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // TODO: Save to database
      // await db.createRole(organizationId, newRole)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onRoleCreated(newRole)
      toast.success(`Role "${roleName}" created successfully!`)
      
      // Reset form
      setRoleName("")
      setRoleDescription("")
      setPermissions({
        dashboard: { read: false, write: false, delete: false },
        analytics: { read: false, write: false, delete: false },
        projects: { read: false, write: false, delete: false },
        finances: { read: false, write: false, delete: false },
        settings: { read: false, write: false, delete: false },
      })
      setSelectedTemplate(null)
      setStep(1)
      onOpenChange(false)
      
    } catch (error) {
      toast.error("Failed to create role")
      console.error(error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    if (!isCreating) {
      setStep(1)
      setRoleName("")
      setRoleDescription("")
      setPermissions({
        dashboard: { read: false, write: false, delete: false },
        analytics: { read: false, write: false, delete: false },
        projects: { read: false, write: false, delete: false },
        finances: { read: false, write: false, delete: false },
        settings: { read: false, write: false, delete: false },
      })
      setSelectedTemplate(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Create New Role
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {step > 1 ? <CheckCircle2 className="h-4 w-4" /> : '1'}
              </div>
              <span className="text-sm font-medium">Template</span>
            </div>
            <div className={`h-px w-8 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {step > 2 ? <CheckCircle2 className="h-4 w-4" /> : '2'}
              </div>
              <span className="text-sm font-medium">Details</span>
            </div>
            <div className={`h-px w-8 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
              <span className="text-sm font-medium">Permissions</span>
            </div>
          </div>

          {/* Step 1: Template Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Choose a Role Template</h3>
                <p className="text-sm text-muted-foreground">
                  Start with a pre-configured template or create a custom role
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {roleTemplates.map((template) => (
                  <Card 
                    key={template.name} 
                    className={`cursor-pointer transition-all ${selectedTemplate === template.name ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(template.permissions).map(([category, perms]) => {
                          const hasAnyPermission = Object.values(perms).some(Boolean)
                          return hasAnyPermission ? (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!selectedTemplate}
                  className="w-32"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Role Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Role Details</h3>
                <p className="text-sm text-muted-foreground">
                  Configure the basic information for this role
                </p>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                <div className="space-y-2">
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    id="roleName"
                    placeholder="e.g. Project Manager"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="apple-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roleDescription">Description</Label>
                  <Textarea
                    id="roleDescription"
                    placeholder="Brief description of this role's responsibilities"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    className="apple-input"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!roleName.trim()}
                  className="w-32"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Permissions */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Configure Permissions</h3>
                <p className="text-sm text-muted-foreground">
                  Fine-tune what this role can access and modify
                </p>
              </div>

              <div className="grid gap-4">
                {permissionCategories.map((category) => (
                  <Card key={category.name} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center`}>
                          <category.icon className={`h-4 w-4 ${category.color}`} />
                        </div>
                        <div>
                          <h4 className="font-medium">{category.label}</h4>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Read</span>
                        <Switch
                          checked={permissions[category.name as keyof RolePermissions].read}
                          onCheckedChange={(value) => handlePermissionChange(category.name, 'read', value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Write</span>
                        <Switch
                          checked={permissions[category.name as keyof RolePermissions].write}
                          onCheckedChange={(value) => handlePermissionChange(category.name, 'write', value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Delete</span>
                        <Switch
                          checked={permissions[category.name as keyof RolePermissions].delete}
                          onCheckedChange={(value) => handlePermissionChange(category.name, 'delete', value)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Permissions Granted:</span>
                  <Badge variant="secondary">{getTotalPermissions()} / 15</Badge>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={handleCreateRole}
                  disabled={isCreating || getTotalPermissions() === 0}
                  className="w-32"
                >
                  {isCreating ? "Creating..." : "Create Role"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}