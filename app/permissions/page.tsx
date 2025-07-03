"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { CreateRoleModal } from "@/components/create-role-modal"
import { useAuth } from "@/contexts/auth-context"
import { db, CustomRole } from "@/lib/database"
import { toast } from "sonner"
import { 
  Shield, 
  Users, 
  Eye,
  Edit,
  Trash2,
  Plus,
  Crown,
  Key
} from "lucide-react"

// Use the CustomRole type from database.ts
type Role = CustomRole & {
  users: number // Add users count for display
}

const permissionCategories = [
  { name: "dashboard", label: "Dashboard" },
  { name: "analytics", label: "Analytics" },
  { name: "projects", label: "Projects" },
  { name: "finances", label: "Finances" },
  { name: "settings", label: "Settings" },
]

const getPermissionMetrics = (roles: Role[]) => [
  {
    title: "Total Roles",
    value: roles.length.toString(),
    change: `+${roles.length}`,
    icon: Crown,
    color: "text-purple-600",
  },
  {
    title: "Active Users",
    value: roles.reduce((sum, role) => sum + (role.users || 0), 0).toString(),
    change: "0",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Permissions",
    value: roles.reduce((sum, role) => {
      return sum + Object.values(role.permissions).reduce((permSum, category) => {
        return permSum + Object.values(category).filter(Boolean).length
      }, 0)
    }, 0).toString(),
    change: "0",
    icon: Key,
    color: "text-green-600",
  },
  {
    title: "Admin Roles",
    value: roles.filter(role => 
      role.name.toLowerCase().includes('admin') || 
      role.permissions.settings.write
    ).length.toString(),
    change: "0",
    icon: Shield,
    color: "text-red-600",
  },
]

export default function PermissionsPage() {
  const { currentOrganization, loading: authLoading } = useAuth()
  const [roles, setRoles] = useState<Role[]>([])
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [databaseError, setDatabaseError] = useState<string | null>(null)

  // Load roles from database
  useEffect(() => {
    const loadRoles = async () => {
      if (authLoading) return
      
      if (!currentOrganization) {
        setIsLoading(false)
        setDatabaseError('No organization selected')
        return
      }

      try {
        setIsLoading(true)
        setDatabaseError(null)
        
        const { data, error } = await db.getCustomRoles(currentOrganization.id)
        
        if (error) {
          setDatabaseError(error.message)
          if (error.message !== 'Database not configured') {
            toast.error('Failed to load roles: ' + error.message)
          }
          return
        }
        
        // Transform CustomRole to Role (add users count)
        const rolesWithUsers = (data || []).map(role => ({
          ...role,
          users: 0 // TODO: Get actual user count from organization_members
        }))
        
        setRoles(rolesWithUsers)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setDatabaseError(errorMessage)
        toast.error('Failed to load roles')
      } finally {
        setIsLoading(false)
      }
    }

    loadRoles()
  }, [currentOrganization, authLoading])

  const handleCreateRole = () => {
    setCreateRoleModalOpen(true)
  }

  const handleRoleCreated = async (newRole: Role) => {
    if (!currentOrganization) return

    try {
      const { data, error } = await db.createCustomRole(currentOrganization.id, {
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
        color: newRole.color,
        created_by: currentOrganization.id // TODO: Use actual user ID
      })

      if (error) {
        toast.error('Failed to create role: ' + error.message)
        return
      }

      if (data) {
        const roleWithUsers = { ...data, users: 0 }
        setRoles(prev => [...prev, roleWithUsers])
        toast.success(`Role "${newRole.name}" created successfully!`)
      }
    } catch (error) {
      toast.error('Failed to create role')
      console.error(error)
    }
  }

  const handleEditRole = (roleId: string, roleName: string) => {
    toast.info(`Editing role: ${roleName}`)
  }

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    try {
      const { error } = await db.deleteCustomRole(roleId)
      
      if (error) {
        toast.error('Failed to delete role: ' + error.message)
        return
      }
      
      setRoles(prev => prev.filter(role => role.id !== roleId))
      toast.success(`Role "${roleName}" deleted successfully`)
    } catch (error) {
      toast.error('Failed to delete role')
      console.error(error)
    }
  }

  const handlePermissionChange = async (roleId: string, category: string, permission: string, value: boolean) => {
    try {
      const role = roles.find(r => r.id === roleId)
      if (!role) return

      const updatedPermissions = {
        ...role.permissions,
        [category]: {
          ...role.permissions[category as keyof typeof role.permissions],
          [permission]: value
        }
      }

      const { error } = await db.updateCustomRole(roleId, {
        permissions: updatedPermissions,
        updated_at: new Date().toISOString()
      })

      if (error) {
        toast.error('Failed to update permissions: ' + error.message)
        return
      }

      setRoles(prev => prev.map(role => {
        if (role.id === roleId) {
          return {
            ...role,
            permissions: updatedPermissions,
            updated_at: new Date().toISOString()
          }
        }
        return role
      }))
      
      toast.success(`${value ? 'Granted' : 'Revoked'} ${permission} permission for ${category}`)
    } catch (error) {
      toast.error('Failed to update permissions')
      console.error(error)
    }
  }

  const permissionMetrics = getPermissionMetrics(roles)

  // Database not configured state
  if (databaseError === 'Database not configured') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
        </div>
        <Card className="glass-card apple-hover border-amber-200">
          <CardContent className="p-8">
            <div className="text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-amber-500 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Database Setup Required</h3>
              <p className="text-muted-foreground">
                Connect to Supabase to manage roles and permissions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
          <div className="skeleton h-10 w-32 rounded-lg" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="skeleton h-4 w-24" />
                  <div className="skeleton h-8 w-16" />
                  <div className="skeleton h-4 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="skeleton h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-24 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
        <Button onClick={handleCreateRole}>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      {/* Permission Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {permissionMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
              <Badge variant="secondary" className="mt-2">
                {metric.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Roles and Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roles.length > 0 ? (
              roles.map((role: Role) => (
                <div key={role.id} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold text-lg">{role.name}</h3>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={role.color}>
                        {role.users} users
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleEditRole(role.id, role.name)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-5">
                    {permissionCategories.map((category) => (
                      <div key={category.name} className="space-y-3">
                        <h4 className="font-medium text-sm">{category.label}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Read</span>
                            <Switch 
                              checked={role.permissions[category.name as keyof typeof role.permissions].read} 
                              onCheckedChange={(value) => handlePermissionChange(role.id, category.name, 'read', value)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-sm text-muted-foreground">Write</span>
                             <Switch 
                               checked={role.permissions[category.name as keyof typeof role.permissions].write} 
                               onCheckedChange={(value) => handlePermissionChange(role.id, category.name, 'write', value)}
                             />
                           </div>
                           <div className="flex items-center justify-between">
                             <span className="text-sm text-muted-foreground">Delete</span>
                             <Switch 
                               checked={role.permissions[category.name as keyof typeof role.permissions].delete} 
                               onCheckedChange={(value) => handlePermissionChange(role.id, category.name, 'delete', value)}
                             />
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No roles configured</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first role to start managing permissions
                </p>
                <Button onClick={handleCreateRole}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Role
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  {permissionCategories.map((category) => (
                    <th key={category.name} className="text-center py-3 px-4 font-medium">
                      {category.label}
                    </th>
                  ))}
                  <th className="text-center py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.length > 0 ? (
                  roles.map((role: Role) => (
                    <tr key={role.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span className="font-medium">{role.name}</span>
                          <Badge className={role.color} variant="secondary">
                            {role.users}
                          </Badge>
                        </div>
                      </td>
                      {permissionCategories.map((category) => (
                        <td key={category.name} className="text-center py-3 px-4">
                          <div className="flex justify-center gap-1">
                            {role.permissions[category.name as keyof typeof role.permissions].read && (
                              <Eye className="h-4 w-4 text-green-600" />
                            )}
                            {role.permissions[category.name as keyof typeof role.permissions].write && (
                              <Edit className="h-4 w-4 text-blue-600" />
                            )}
                            {role.permissions[category.name as keyof typeof role.permissions].delete && (
                              <Trash2 className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </td>
                      ))}
                      <td className="text-center py-3 px-4">
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditRole(role.id, role.name)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role.id, role.name)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={permissionCategories.length + 2} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <Key className="h-16 w-16 mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No permission data</h3>
                        <p className="text-muted-foreground">
                          Permission matrix will appear here once roles are created
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Role Modal */}
      <CreateRoleModal
        open={createRoleModalOpen}
        onOpenChange={setCreateRoleModalOpen}
        onRoleCreated={handleRoleCreated}
      />
    </div>
  )
} 