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
import { CreditCard, Smartphone, Wallet, Zap } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { getDatabase } from "@/lib/database"

interface TopUpModalProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function TopUpModal({ trigger, onSuccess }: TopUpModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<any[]>([])
  const { currentOrganization } = useAuth()
  const db = getDatabase()

  const [formData, setFormData] = useState({
    account: "",
    amount: "",
    method: "",
    provider: "",
    description: "",
    phoneNumber: "",
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

  const topUpMethods = [
    { id: "mobile_wallet", name: "Mobile Wallet", icon: Smartphone, providers: ["GCash", "PayMaya", "Coins.ph", "GrabPay"] },
    { id: "online_banking", name: "Online Banking", icon: Wallet, providers: ["BPI", "BDO", "Metrobank", "UnionBank"] },
    { id: "credit_card", name: "Credit/Debit Card", icon: CreditCard, providers: ["Visa", "Mastercard", "JCB", "American Express"] },
    { id: "crypto", name: "Cryptocurrency", icon: Zap, providers: ["Bitcoin", "Ethereum", "USDT", "Binance"] },
  ]

  const selectedMethod = topUpMethods.find(method => method.id === formData.method)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.account || !formData.amount || !formData.method || !formData.provider) {
        toast.error("Please fill in all required fields")
        return
      }

      const amount = parseFloat(formData.amount.replace(/,/g, ""))
      if (amount <= 0) {
        toast.error("Amount must be greater than 0")
        return
      }

      // Validate phone number for mobile wallet
      if (formData.method === "mobile_wallet" && (!formData.phoneNumber || formData.phoneNumber.length < 10)) {
        toast.error("Please enter a valid phone number")
        return
      }

      // Create a transaction record for the top-up
      const transactionData = {
        organization_id: organizationData?.id,
        account_id: formData.account,
        type: 'income' as const,
        amount: amount,
        description: formData.description || `Top-up via ${formData.provider}`,
        reference_number: `TOPUP-${Date.now()}`,
        transaction_date: new Date().toISOString().split('T')[0],
        status: 'completed' as const,
        metadata: {
          top_up_method: formData.method,
          provider: formData.provider,
          phone_number: formData.phoneNumber,
          source: "top_up_modal"
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

      toast.success(`₱${amount.toLocaleString()} topped up successfully via ${formData.provider}!`)
      
      // Reset form
      setFormData({
        account: "",
        amount: "",
        method: "",
        provider: "",
        description: "",
        phoneNumber: "",
      })
      
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to top up")
      console.error("Top up error:", error)
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
      <CreditCard className="mr-2 h-4 w-4" />
      Top Up
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
            <CreditCard className="h-5 w-5" />
            Top Up Account
          </DialogTitle>
          <DialogDescription>
            Add money to your account using various payment methods.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account">Account *</Label>
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
            <Label htmlFor="method">Top-up Method *</Label>
            <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value, provider: "" })}>
              <SelectTrigger>
                <SelectValue placeholder="Select top-up method" />
              </SelectTrigger>
              <SelectContent>
                {topUpMethods.map((method) => {
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

          {selectedMethod && (
            <div className="space-y-2">
              <Label htmlFor="provider">Provider *</Label>
              <Select value={formData.provider} onValueChange={(value) => setFormData({ ...formData, provider: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {selectedMethod.providers.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.method === "mobile_wallet" && (
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                placeholder="09123456789"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description for this top-up"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label>Quick Amounts</Label>
            <div className="grid grid-cols-4 gap-2">
              {["100", "500", "1000", "5000"].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, amount: quickAmount })}
                >
                  ₱{quickAmount}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Top Up"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
