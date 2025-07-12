"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { format } from "date-fns"
import { useAuth } from "@/contexts/auth-context"
import { DateRangePicker } from "@/components/date-range-picker"
import { DateRange } from "react-day-picker"

interface AddProjectModalProps {
  trigger?: React.ReactNode
  onProjectAdded?: (project: any) => void
}

export function AddProjectModal({ trigger, onProjectAdded }: AddProjectModalProps) {
  const { currentOrganization, userProfile } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    priority: "medium",
    budget: "",
    dateRange: undefined as DateRange | undefined,
    projectManager: "",
    department: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentOrganization) {
      toast.error("Please select an organization first")
      return
    }

    if (!userProfile) {
      toast.error("User profile not available")
      return
    }

    if (!formData.name.trim()) {
      toast.error("Project name is required")
      return
    }

    setLoading(true)

    try {
      const projectData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        budget: formData.budget ? parseFloat(formData.budget.replace(/[₱,]/g, "")) : 0,
        start_date: formData.dateRange?.from ? format(formData.dateRange.from, "yyyy-MM-dd") : undefined,
        end_date: formData.dateRange?.to ? format(formData.dateRange.to, "yyyy-MM-dd") : undefined,
        project_manager_id: formData.projectManager || undefined,
        department_id: formData.department || undefined,
        organizationId: currentOrganization.id,
        userId: userProfile.clerk_user_id
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create project')
      }

      const { data } = await response.json()
      
      if (onProjectAdded) {
        onProjectAdded(data)
      }
      
      setFormData({
        name: "",
        description: "",
        status: "active",
        priority: "medium",
        budget: "",
        dateRange: undefined,
        projectManager: "",
        department: "",
      })
      
      setOpen(false)
      toast.success("Project created successfully!")
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error(error instanceof Error ? error.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      New Project
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project to your organization. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter project description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="₱100,000"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Project Timeline</Label>
            <DateRangePicker
              dateRange={formData.dateRange}
              onDateRangeChange={(range) => setFormData(prev => ({ ...prev, dateRange: range }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="projectManager">Project Manager</Label>
            <Input
              id="projectManager"
              value={formData.projectManager}
              onChange={(e) => setFormData(prev => ({ ...prev, projectManager: e.target.value }))}
              placeholder="Enter project manager name"
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}