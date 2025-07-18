"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { db } from "@/lib/database"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, CreditCard, PiggyBank, TrendingUp, Banknote, Bitcoin, Receipt } from "lucide-react"

interface AccountType {
  id: string
  name: string
  category: string
  description?: string
  icon?: string
}

interface AddAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onAccountAdded: () => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'CreditCard': CreditCard,
  'PiggyBank': PiggyBank,
  'TrendingUp': TrendingUp,
  'Banknote': Banknote,
  'Bitcoin': Bitcoin,
  'Receipt': Receipt
}

export function AddAccountModal({ isOpen, onClose, onAccountAdded }: AddAccountModalProps) {
  const { currentOrganization, userProfile } = useAuth()
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTypes, setIsLoadingTypes] = useState(true)
  
  // Individual state for each form field
  const [name, setName] = useState("")
  const [accountTypeId, setAccountTypeId] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [bankName, setBankName] = useState("")
  const [balance, setBalance] = useState("")
  const [currency, setCurrency] = useState("PHP")
  const [isActive, setIsActive] = useState(true)
  const [description, setDescription] = useState("")

  // Load account types when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAccountTypes()
    }
  }, [isOpen])

  // Reset form when modal closes
  const handleClose = () => {
    setName("")
    setAccountTypeId("")
    setAccountNumber("")
    setBankName("")
    setBalance("")
    setCurrency("PHP")
    setIsActive(true)
    setDescription("")
    onClose()
  }

  const loadAccountTypes = async () => {
    try {
      setIsLoadingTypes(true)
      const { data, error } = await db.getAccountTypes()
      
      if (error) {
        console.error('Error loading account types:', error)
        toast.error('Failed to load account types')
        return
      }
      
      setAccountTypes(data || [])
    } catch (error) {
      toast.error('Failed to load account types')
    } finally {
      setIsLoadingTypes(false)
    }
  }

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Account name is required')
      return false
    }
    
    if (!accountTypeId) {
      toast.error('Account type is required')
      return false
    }
    
    if (!currentOrganization) {
      toast.error('No organization selected')
      return false
    }
    
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    try {
      setIsLoading(true)
      
      const accountData = {
        organization_id: currentOrganization!.id,
        account_type_id: accountTypeId,
        name: name.trim(),
        account_number: accountNumber.trim() || undefined,
        bank_name: bankName.trim() || undefined,
        balance: balance ? parseFloat(balance) : 0,
        currency: currency,
        is_active: isActive,
        description: description.trim() || undefined,
        created_by: userProfile?.id
      }
      
      const { data, error } = await db.createAccount(accountData)
      
      if (error) {
        console.error('Error creating account:', error)
        toast.error('Failed to create account: ' + error.message)
        return
      }
      
      console.log('Account created successfully:', data)
      
      toast.success('Account created successfully')
      onAccountAdded()
      handleClose()
    } catch (error) {
      console.error('Unexpected error creating account:', error)
      toast.error('Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const getAccountTypeIcon = (iconName?: string) => {
    if (!iconName) return CreditCard
    return iconMap[iconName] || CreditCard
  }

  const selectedAccountType = accountTypes.find(type => type.id === accountTypeId)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedAccountType && (
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                {(() => {
                  const IconComponent = getAccountTypeIcon(selectedAccountType.icon)
                  return <IconComponent className="h-4 w-4 text-green-600" />
                })()}
              </div>
            )}
            Add New Account
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Account Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Account Name *</Label>
            <Input
              id="name"
              placeholder="e.g., My Checking Account"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <Label htmlFor="account_type">Account Type *</Label>
            {isLoadingTypes ? (
              <div className="flex items-center justify-center h-10 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <Select
                value={accountTypeId}
                onValueChange={setAccountTypeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => {
                    const IconComponent = getAccountTypeIcon(type.icon)
                    return (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <span>{type.name}</span>
                          <span className="text-xs text-gray-500 ml-1">({type.category})</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bank_name">Bank/Institution Name</Label>
            <Input
              id="bank_name"
              placeholder="e.g., BPI, BDO, Metrobank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="account_number">Account Number</Label>
            <Input
              id="account_number"
              placeholder="e.g., 1234567890"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          {/* Balance and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="balance">Initial Balance</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={currency}
                onValueChange={setCurrency}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHP">PHP (Philippine Peso)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional notes about this account..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Active Account</Label>
              <p className="text-xs text-gray-600">
                Active accounts are included in balance calculations
              </p>
            </div>
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}