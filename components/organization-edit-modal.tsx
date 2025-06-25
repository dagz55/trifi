"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/database"
import { Loader2 } from "lucide-react"

interface OrganizationEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrganizationEditModal({ open, onOpenChange }: OrganizationEditModalProps) {
  const { currentOrganization, refreshOrganizations } = useAuth()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    tax_id: "",
    currency: "PHP",
    timezone: "UTC+8",
    address: ""
  })

  // Update form data when currentOrganization changes
  useEffect(() => {
    if (currentOrganization && open) {
      setFormData({
        name: currentOrganization.name || "",
        industry: currentOrganization.industry || "",
        description: currentOrganization.description || "",
        phone: currentOrganization.phone || "",
        email: currentOrganization.email || "",
        website: currentOrganization.website || "",
        tax_id: currentOrganization.tax_id || "",
        currency: currentOrganization.currency || "PHP",
        timezone: currentOrganization.timezone || "UTC+8",
        address: typeof currentOrganization.address === 'string' 
          ? currentOrganization.address 
          : currentOrganization.address 
            ? JSON.stringify(currentOrganization.address, null, 2)
            : ""
      })
    }
  }, [currentOrganization, open])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    if (!currentOrganization) {
      toast.error("No organization selected")
      return
    }

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Organization name is required")
      return
    }

    if (formData.email && !formData.email.includes("@")) {
      toast.error("Valid email address is required")
      return
    }

    setLoading(true)
    try {
      // Prepare update data
      const updateData = {
        name: formData.name.trim(),
        industry: formData.industry.trim() || undefined,
        description: formData.description.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        website: formData.website.trim() || undefined,
        tax_id: formData.tax_id.trim() || undefined,
        currency: formData.currency,
        timezone: formData.timezone,
        address: formData.address.trim() || undefined
      }

      const { data, error } = await db.updateOrganization(currentOrganization.id, updateData)

      if (error) {
        throw new Error(error.message)
      }

      // Refresh organizations to get updated data
      await refreshOrganizations()

      toast.success("Organization details updated successfully!")
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating organization:', error)
      toast.error(`Failed to update organization: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form to original data
    if (currentOrganization) {
      setFormData({
        name: currentOrganization.name || "",
        industry: currentOrganization.industry || "",
        description: currentOrganization.description || "",
        phone: currentOrganization.phone || "",
        email: currentOrganization.email || "",
        website: currentOrganization.website || "",
        tax_id: currentOrganization.tax_id || "",
        currency: currentOrganization.currency || "PHP",
        timezone: currentOrganization.timezone || "UTC+8",
        address: typeof currentOrganization.address === 'string' 
          ? currentOrganization.address 
          : currentOrganization.address 
            ? JSON.stringify(currentOrganization.address, null, 2)
            : ""
      })
    }
    onOpenChange(false)
  }

  if (!currentOrganization) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Organization Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter organization name"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => handleInputChange("industry", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="organization@example.com"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+63 912 345 6789"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://www.example.com"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_id">Tax ID</Label>
              <Input
                id="tax_id"
                value={formData.tax_id}
                onChange={(e) => handleInputChange("tax_id", e.target.value)}
                placeholder="123-456-789-000"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHP">PHP - Philippine Peso</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => handleInputChange("timezone", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC+8">UTC+8 - Philippines</SelectItem>
                  <SelectItem value="UTC+0">UTC+0 - GMT</SelectItem>
                  <SelectItem value="UTC-5">UTC-5 - Eastern Time</SelectItem>
                  <SelectItem value="UTC-8">UTC-8 - Pacific Time</SelectItem>
                  <SelectItem value="UTC+1">UTC+1 - Central European Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter full address"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of your organization"
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 