"use client"

import React, { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

interface AddTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTransactionAdded: (transaction: any) => void
}

export function AddTransactionModal({ open, onOpenChange, onTransactionAdded }: AddTransactionModalProps) {
  const { currentOrganization, userProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    amount: "",
    category: "",
    account: "",
    reference: "",
  })
  const [date, setDate] = useState<Date>(new Date())
  const [accounts, setAccounts] = useState<any[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(false)

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
    
    if (!formData.type || !formData.description || !formData.amount || !date) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const transactionData = {
        type: formData.type,
        description: formData.description,
        amount: parseFloat(formData.amount.replace(/,/g, "")),
        transaction_date: format(date, "yyyy-MM-dd"),
        category: formData.category || "General",
        account_id: formData.account,
        reference_number: formData.reference || `REF-${Date.now()}`,
        organizationId: currentOrganization.id,
        userId: userProfile.clerk_user_id
      }

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create transaction')
      }

      const { data } = await response.json()
      
      onTransactionAdded(data)
      toast.success("Transaction added successfully!")
      
      // Reset form
      setFormData({
        type: "",
        description: "",
        amount: "",
        category: "",
        account: "",
        reference: "",
      })
      setDate(new Date())
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating transaction:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create transaction')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAmountChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, "")
    // Format with commas
    const formatted = cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    setFormData({ ...formData, amount: formatted })
  }

  // Load accounts when component mounts or organization changes
  useEffect(() => {
    const loadAccounts = async () => {
      if (!currentOrganization) return
      
      setLoadingAccounts(true)
      try {
        const response = await fetch(`/api/accounts?organizationId=${currentOrganization.id}`)
        if (response.ok) {
          const { data } = await response.json()
          setAccounts(data || [])
        }
      } catch (error) {
        console.error('Error loading accounts:', error)
      } finally {
        setLoadingAccounts(false)
      }
    }

    loadAccounts()
  }, [currentOrganization])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Enter the details for your new transaction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => setDate(selectedDate || new Date())}
                    defaultMonth={new Date()}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₱</span>
                <Input
                  id="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                  <SelectItem value="Operating Expenses">Operating Expenses</SelectItem>
                  <SelectItem value="Investment Income">Investment Income</SelectItem>
                  <SelectItem value="Software & Tools">Software & Tools</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account">Account</Label>
              <Select value={formData.account} onValueChange={(value) => setFormData({ ...formData, account: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingAccounts ? "Loading..." : "Select account"} />
                </SelectTrigger>
                <SelectContent>
                  {accounts.length > 0 ? (
                    accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} - ₱{account.balance?.toLocaleString()}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No accounts available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                placeholder="Optional reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 