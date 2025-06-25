"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface AdvancedFiltersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFiltersApply: (filters: any) => void
  currentFilters: any
}

export function AdvancedFiltersModal({ 
  open, 
  onOpenChange, 
  onFiltersApply, 
  currentFilters 
}: AdvancedFiltersModalProps) {
  const [filters, setFilters] = useState({
    minAmount: currentFilters.minAmount || "",
    maxAmount: currentFilters.maxAmount || "",
    accounts: currentFilters.accounts || [],
    categories: currentFilters.categories || [],
    statuses: currentFilters.statuses || [],
    reference: currentFilters.reference || "",
  })

  const accountOptions = [
    "Business Checking",
    "Savings", 
    "Investment",
    "Credit Card"
  ]

  const categoryOptions = [
    "Revenue",
    "Operating Expenses",
    "Investment Income",
    "Software & Tools",
    "Transfer",
    "General"
  ]

  const statusOptions = [
    "completed",
    "pending",
    "failed"
  ]

  const handleAccountToggle = (account: string) => {
    const updatedAccounts = filters.accounts.includes(account)
      ? filters.accounts.filter((a: string) => a !== account)
      : [...filters.accounts, account]
    setFilters({ ...filters, accounts: updatedAccounts })
  }

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = filters.categories.includes(category)
      ? filters.categories.filter((c: string) => c !== category)
      : [...filters.categories, category]
    setFilters({ ...filters, categories: updatedCategories })
  }

  const handleStatusToggle = (status: string) => {
    const updatedStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s: string) => s !== status)
      : [...filters.statuses, status]
    setFilters({ ...filters, statuses: updatedStatuses })
  }

  const handleApplyFilters = () => {
    onFiltersApply(filters)
    onOpenChange(false)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      minAmount: "",
      maxAmount: "",
      accounts: [],
      categories: [],
      statuses: [],
      reference: "",
    }
    setFilters(clearedFilters)
    onFiltersApply(clearedFilters)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.minAmount) count++
    if (filters.maxAmount) count++
    if (filters.accounts.length > 0) count++
    if (filters.categories.length > 0) count++
    if (filters.statuses.length > 0) count++
    if (filters.reference) count++
    return count
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>
            Apply detailed filters to find specific transactions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Amount Range */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Amount Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minAmount">Minimum Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₱</span>
                  <Input
                    id="minAmount"
                    placeholder="0.00"
                    value={filters.minAmount}
                    onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAmount">Maximum Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₱</span>
                  <Input
                    id="maxAmount"
                    placeholder="999,999.00"
                    value={filters.maxAmount}
                    onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Accounts */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Accounts</Label>
            <div className="grid grid-cols-2 gap-2">
              {accountOptions.map((account) => (
                <div key={account} className="flex items-center space-x-2">
                  <Checkbox
                    id={`account-${account}`}
                    checked={filters.accounts.includes(account)}
                    onCheckedChange={() => handleAccountToggle(account)}
                  />
                  <Label htmlFor={`account-${account}`} className="text-sm font-normal">
                    {account}
                  </Label>
                </div>
              ))}
            </div>
            {filters.accounts.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {filters.accounts.map((account: string) => (
                  <Badge key={account} variant="secondary" className="text-xs">
                    {account}
                    <button
                      onClick={() => handleAccountToggle(account)}
                      className="ml-1 hover:bg-muted rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Categories</Label>
            <div className="grid grid-cols-2 gap-2">
              {categoryOptions.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
            {filters.categories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {filters.categories.map((category: string) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                    <button
                      onClick={() => handleCategoryToggle(category)}
                      className="ml-1 hover:bg-muted rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Transaction Status</Label>
            <div className="flex gap-4">
              {statusOptions.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.statuses.includes(status)}
                    onCheckedChange={() => handleStatusToggle(status)}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm font-normal capitalize">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Reference */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Reference</Label>
            <Input
              placeholder="Search by reference number..."
              value={filters.reference}
              onChange={(e) => setFilters({ ...filters, reference: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All
            </Button>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 