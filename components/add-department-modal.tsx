"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface AddDepartmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDepartmentAdded: (department: any) => void
}

export function AddDepartmentModal({ open, onOpenChange, onDepartmentAdded }: AddDepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    employees: 0,
    budget: "",
    description: "",
    performance: 85, // Default performance score
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Department name is required")
      return
    }

    if (!formData.head.trim()) {
      toast.error("Department head is required")
      return
    }

    if (formData.employees < 0) {
      toast.error("Number of employees must be 0 or greater")
      return
    }

    // Create department object
    const newDepartment = {
      id: Date.now().toString(), // Simple ID generation
      name: formData.name,
      head: formData.head,
      employees: formData.employees,
      budget: formData.budget || "₱0",
      description: formData.description,
      performance: formData.performance,
      createdAt: new Date().toISOString(),
    }

    // Call the callback to add the department
    onDepartmentAdded(newDepartment)

    toast.success(`Department "${formData.name}" added successfully!`)
    
    // Reset form and close modal
    setFormData({
      name: "",
      head: "",
      employees: 0,
      budget: "",
      description: "",
      performance: 85,
    })
    onOpenChange(false)
  }

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: "",
      head: "",
      employees: 0,
      budget: "",
      description: "",
      performance: 85,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dept-name">Department Name *</Label>
              <Input
                id="dept-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Engineering, Marketing, Sales"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dept-head">Department Head *</Label>
              <Input
                id="dept-head"
                value={formData.head}
                onChange={(e) => handleInputChange("head", e.target.value)}
                placeholder="Full name of department head"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dept-employees">Number of Employees</Label>
              <Input
                id="dept-employees"
                type="number"
                min="0"
                value={formData.employees}
                onChange={(e) => handleInputChange("employees", parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dept-budget">Annual Budget</Label>
              <Input
                id="dept-budget"
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                placeholder="₱1,000,000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dept-performance">Performance Score (%)</Label>
              <Input
                id="dept-performance"
                type="number"
                min="0"
                max="100"
                value={formData.performance}
                onChange={(e) => handleInputChange("performance", parseInt(e.target.value) || 0)}
                placeholder="85"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dept-description">Description</Label>
            <Textarea
              id="dept-description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of the department's role and responsibilities"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Add Department
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 