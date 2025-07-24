"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/database"
import { toast } from "sonner"

interface AddDepartmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDepartmentAdded: () => void
}

export function AddDepartmentModal({ open, onOpenChange, onDepartmentAdded }: AddDepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const { currentOrganization } = useAuth()

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Department name is required")
      return
    }

    if (!currentOrganization?.id) {
      toast.error("No organization selected. Please create an organization first.")
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
        toast.success(`Department "${formData.name}" created successfully!`)
        setFormData({
          name: "",
          description: "",
          budget: 0
        })
        onOpenChange(false)
        onDepartmentAdded()
      }
    } catch (error) {
      toast.error("Failed to create department")
      console.error("Error creating department:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      budget: 0
    })
    onOpenChange(false)
  }

  // Don't render modal if no organization is available
  if (!currentOrganization) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Adding department to: <span className="font-medium">{currentOrganization.name}</span>
          </p>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dept-name">Department Name *</Label>
            <Input
              id="dept-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Engineering, Marketing, Sales"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dept-description">Description</Label>
            <Textarea
              id="dept-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the department's role and responsibilities"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dept-budget">Annual Budget</Label>
            <Input
              id="dept-budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Creating..." : "Add Department"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 