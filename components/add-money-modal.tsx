"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, CreditCard, Building, Wallet } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { getDatabase } from "@/lib/database"

interface AddMoneyModalProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function AddMoneyModal({ trigger, onSuccess }: AddMoneyModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<any[]>([])
  const { currentOrganization } = useAuth()
  const db = getDatabase()

  const [formData, setFormData] = useState({
    account: "",
    amount: "",
    method: "",
    description: "",
    reference: "",
  })

  // Fetch accounts when modal opens
  useEffect(() => {
    async function fetchAccounts() {
      if (open && currentOrganization?.id) {
        const { data, error } = await db.getAccounts(currentOrganization.id)
        if (error) {
          console.error("Error fetching accounts:", error)
        } else {
          setAccounts(data || [])
        }
      }
    }
    fetchAccounts()
  }, [open, currentOrganization?.id, db])

  const paymentMethods = [
    { id: "bank_transfer", name: "Bank Transfer", icon: Building },
    { id: "credit_card", name: "Credit Card", icon: CreditCard },
    { id: "digital_wallet", name: "Digital Wallet", icon: Wallet },
    { id: "cash_deposit", name: "Cash Deposit", icon: Plus },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.account || !formData.amount || !formData.method) {
        toast.error("Please fill in all required fields")
        return
      }

      const amount = parseFloat(formData.amount.replace(/,/g, ""))
      if (amount <= 0) {
        toast.error("Amount must be greater than 0")
        return
      }

      // Create a transaction record for the money addition
      const transactionData = {
        organization_id: organizationData?.id,
        account_id: formData.account,
        type: 'income' as const,
        amount: amount,
        description: formData.description || "Funds added to account",
        reference_number: formData.reference || `ADD-${Date.now()}`,
        transaction_date: new Date().toISOString().split('T')[0],
        status: 'completed' as const,
        metadata: {
          payment_method: formData.method,
          source: "add_money_modal"
        }
      }

      const { data: transaction, error: transactionError } = await db.createTransaction(transactionData)
      
      if (transactionError) {
        toast.error("Failed to create transaction record")
        console.error("Transaction error:", transactionError)
        return
      }

      // Update account balance
      const selectedAccount = accounts.find(acc => acc.id === formData.account)
      if (selectedAccount) {
        const newBalance = (selectedAccount.balance || 0) + amount
        const { error: balanceError } = await db.updateAccountBalance(formData.account, newBalance)
        
        if (balanceError) {
          toast.error("Failed to update account balance")
          console.error("Balance update error:", balanceError)
          return
        }

        // Update local state
        setAccounts(accounts.map(acc => 
          acc.id === formData.account 
            ? { ...acc, balance: newBalance }
            : acc
        ))
      }

      toast.success(`₱${amount.toLocaleString()} added successfully!`)
      
      // Reset form
      setFormData({
        account: "",
        amount: "",
        method: "",
        description: "",
        reference: "",
      })
      
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to add money")
      console.error("Add money error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, "")
    const formatted = cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    setFormData({ ...formData, amount: formatted })
  }

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add Money
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Money to Account
          </DialogTitle>
          <DialogDescription>
            Add funds to your account from various payment sources.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account">Destination Account *</Label>
              <Select value={formData.account} onValueChange={(value) => setFormData({ ...formData, account: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{account.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ₱{(account.balance || 0).toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Payment Method *</Label>
            <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {method.name}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description for this transaction"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference Number</Label>
            <Input
              id="reference"
              placeholder="Optional reference number"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Add Money"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
