import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
  Shield, 
  Users, 
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Crown,
  Key
} from "lucide-react"

const roles = [
  {
    id: 1,
    name: "Administrator",
    description: "Full access to all features and settings",
    users: 3,
    permissions: {
      dashboard: { read: true, write: true, delete: true },
      analytics: { read: true, write: true, delete: true },
      projects: { read: true, write: true, delete: true },
      finances: { read: true, write: true, delete: true },
      settings: { read: true, write: true, delete: true },
    },
    color: "bg-red-100 text-red-800"
  },
  {
    id: 2,
    name: "Manager",
    description: "Access to most features with some restrictions",
    users: 8,
    permissions: {
      dashboard: { read: true, write: true, delete: false },
      analytics: { read: true, write: true, delete: false },
      projects: { read: true, write: true, delete: false },
      finances: { read: true, write: false, delete: false },
      settings: { read: true, write: false, delete: false },
    },
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: 3,
    name: "Developer",
    description: "Access to technical features and project management",
    users: 15,
    permissions: {
      dashboard: { read: true, write: false, delete: false },
      analytics: { read: true, write: false, delete: false },
      projects: { read: true, write: true, delete: false },
      finances: { read: false, write: false, delete: false },
      settings: { read: false, write: false, delete: false },
    },
    color: "bg-green-100 text-green-800"
  },
  {
    id: 4,
    name: "Viewer",
    description: "Read-only access to basic features",
    users: 25,
    permissions: {
      dashboard: { read: true, write: false, delete: false },
      analytics: { read: true, write: false, delete: false },
      projects: { read: true, write: false, delete: false },
      finances: { read: false, write: false, delete: false },
      settings: { read: false, write: false, delete: false },
    },
    color: "bg-gray-100 text-gray-800"
  },
]

const permissionCategories = [
  { name: "dashboard", label: "Dashboard" },
  { name: "analytics", label: "Analytics" },
  { name: "projects", label: "Projects" },
  { name: "finances", label: "Finances" },
  { name: "settings", label: "Settings" },
]

const permissionMetrics = [
  {
    title: "Total Roles",
    value: "4",
    change: "+1",
    icon: Crown,
    color: "text-purple-600",
  },
  {
    title: "Active Users",
    value: "51",
    change: "+3",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Permissions",
    value: "15",
    change: "0",
    icon: Key,
    color: "text-green-600",
  },
  {
    title: "Admin Users",
    value: "3",
    change: "0",
    icon: Shield,
    color: "text-red-600",
  },
]

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
        <Button>
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
            {roles.map((role) => (
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
                    <Button variant="outline" size="sm">
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
                            disabled
                          />
                        </div>
                                                 <div className="flex items-center justify-between">
                           <span className="text-sm text-muted-foreground">Write</span>
                           <Switch 
                             checked={role.permissions[category.name as keyof typeof role.permissions].write} 
                             disabled
                           />
                         </div>
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-muted-foreground">Delete</span>
                           <Switch 
                             checked={role.permissions[category.name as keyof typeof role.permissions].delete} 
                             disabled
                           />
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
                {roles.map((role) => (
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
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 