"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { db, Department } from "@/lib/database"
import { 
  Building2, 
  Search, 
  Plus,
  Users,
  DollarSign,
  MoreHorizontal,
  UserCheck,
  Briefcase
} from "lucide-react"
import { toast } from "sonner"

interface DepartmentFormData {
  name: string
  description: string
  budget: number
}

function AddDepartmentModal({ onDepartmentAdded }: { onDepartmentAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    description: "",
    budget: 0
  })
  const { currentOrganization } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentOrganization?.id) {
      toast.error("No organization selected")
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await db.createDepartment({
        organization_id: currentOrganization.id,
        name: formData.name,
        description: formData.description,
        budget: formData.budget
      })

      if (error) {
        toast.error("Failed to create department")
        console.error("Error creating department:", error)
      } else {
        toast.success("Department created successfully")
        setFormData({ name: "", description: "", budget: 0 })
        setIsOpen(false)
        onDepartmentAdded()
      }
    } catch (error) {
      toast.error("Failed to create department")
      console.error("Error creating department:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Department
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add New Department</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Department Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Engineering, Marketing"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the department"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Budget</label>
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Department"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { currentOrganization, loading: authLoading, createOrganization } = useAuth()

  const loadDepartments = async () => {
    if (!currentOrganization?.id) return

    setIsLoading(true)
    try {
      const { data, error } = await db.getDepartments(currentOrganization.id)
      if (error) {
        toast.error("Failed to load departments")
        console.error("Error loading departments:", error)
      } else {
        setDepartments(data || [])
      }
    } catch (error) {
      toast.error("Failed to load departments")
      console.error("Error loading departments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDepartments()
  }, [currentOrganization?.id])

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (department.description && department.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalBudget = departments.reduce((sum, dept) => sum + (dept.budget || 0), 0)

  const departmentMetrics = [
    {
      title: "Total Departments",
      value: departments.length.toString(),
      change: "0",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Total Budget",
      value: `$${totalBudget.toLocaleString()}`,
      change: "0",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Avg Budget",
      value: departments.length > 0 ? `$${Math.round(totalBudget / departments.length).toLocaleString()}` : "$0",
      change: "0",
      icon: Briefcase,
      color: "text-purple-600",
    },
    {
      title: "Active Depts",
      value: departments.length.toString(),
      change: "0",
      icon: UserCheck,
      color: "text-orange-600",
    },
  ]

  const handleEditDepartment = (department: Department) => {
    toast.info(`Edit functionality for ${department.name} coming soon!`)
  }

  const handleDeleteDepartment = async (department: Department) => {
    try {
      const { error } = await db.deleteDepartment(department.id)
      if (error) {
        toast.error("Failed to delete department")
        console.error("Error deleting department:", error)
      } else {
        toast.success(`${department.name} department deleted`)
        loadDepartments()
      }
    } catch (error) {
      toast.error("Failed to delete department")
      console.error("Error deleting department:", error)
    }
  }

  // Handle case where user needs to create an organization first
  const handleCreateFirstOrganization = async () => {
    const newOrg = await createOrganization({
      name: "My Organization",
      type: "Business",
      phone: "",
      email: "",
      website: "",
      location: ""
    })
    
    if (newOrg) {
      toast.success("Organization created! You can now add departments.")
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentOrganization) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-medium mb-2">No Organization Found</h2>
            <p className="text-sm text-muted-foreground mb-6">
              You need to create an organization first before you can add departments.
            </p>
            <Button onClick={handleCreateFirstOrganization}>
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Departments</h2>
        <div className="flex items-center space-x-2">
          <AddDepartmentModal onDepartmentAdded={loadDepartments} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {departmentMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                +{metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Directory</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium">Loading departments...</p>
              </div>
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
              <div className="text-center">
                <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium">
                  {departments.length === 0 ? "No departments found" : "No departments match your search"}
                </p>
                <p className="text-sm mb-4">
                  {departments.length === 0 ? "Add your first department to get started" : "Try adjusting your search term"}
                </p>
                {departments.length === 0 && (
                  <AddDepartmentModal onDepartmentAdded={loadDepartments} />
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDepartments.map((department) => (
                <Card key={department.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{department.name}</h3>
                          {department.description && (
                            <p className="text-sm text-muted-foreground">{department.description}</p>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditDepartment(department)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteDepartment(department)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      {department.budget && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Budget</span>
                          <Badge variant="secondary">
                            ${department.budget.toLocaleString()}
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Created</span>
                        <span className="text-sm">
                          {department.created_at ? new Date(department.created_at).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}