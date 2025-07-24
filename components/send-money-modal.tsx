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
import { Send, User, Building, CreditCard } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { getDatabase } from "@/lib/database"

interface SendMoneyModalProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function SendMoneyModal({ trigger, onSuccess }: SendMoneyModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<any[]>([])
  const { currentOrganization } = useAuth()
  const db = getDatabase()

  const [formData, setFormData] = useState({
    fromAccount: "",
    toAccount: "",
    recipientType: "internal", // internal, external, bank
    recipientInfo: "",
    amount: "",
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

  const recipientTypes = [
    { id: "internal", name: "Internal Account", icon: Building },
    { id: "external", name: "External User", icon: User },
    { id: "bank", name: "Bank Transfer", icon: CreditCard },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.fromAccount || !formData.amount || !formData.recipientInfo) {
        toast.error("Please fill in all required fields")
        return
      }

      const amount = parseFloat(formData.amount.replace(/,/g, ""))
      if (amount <= 0) {
        toast.error("Amount must be greater than 0")
        return
      }

      // Check source account balance
      const sourceAccount = accounts.find(acc => acc.id === formData.fromAccount)
      if (!sourceAccount) {
        toast.error("Source account not found")
        return
      }

      if ((sourceAccount.balance || 0) < amount) {
        toast.error("Insufficient balance in source account")
        return
      }

      // Create outgoing transaction
      const outgoingTransactionData = {
        organization_id: organizationData?.id,
        account_id: formData.fromAccount,
        type: 'expense' as const,
        amount: amount,
        description: formData.description || `Money sent to ${formData.recipientInfo}`,
        reference_number: formData.reference || `SEND-${Date.now()}`,
        transaction_date: new Date().toISOString().split('T')[0],
        status: 'completed' as const,
        metadata: {
          recipient_type: formData.recipientType,
          recipient_info: formData.recipientInfo,
          transfer_type: "outgoing",
          source: "send_money_modal"
        }
      }

      const { data: outgoingTransaction, error: outgoingError } = await db.createTransaction(outgoingTransactionData)
      
      if (outgoingError) {
        toast.error("Failed to create outgoing transaction")
        console.error("Outgoing transaction error:", outgoingError)
        return
      }

      // Update source account balance
      const newSourceBalance = (sourceAccount.balance || 0) - amount
      const { error: sourceBalanceError } = await db.updateAccountBalance(formData.fromAccount, newSourceBalance)
      
      if (sourceBalanceError) {
        toast.error("Failed to update source account balance")
        console.error("Source balance update error:", sourceBalanceError)
        return
      }

      // Handle internal transfers
      if (formData.recipientType === "internal" && formData.toAccount) {
        const incomingTransactionData = {
          organization_id: organizationData?.id,
          account_id: formData.toAccount,
          type: 'income' as const,
          amount: amount,
          description: formData.description || `Money received from ${sourceAccount.name}`,
          reference_number: formData.reference || `RECV-${Date.now()}`,
          transaction_date: new Date().toISOString().split('T')[0],
          status: 'completed' as const,
          metadata: {
            sender_account: formData.fromAccount,
            transfer_type: "incoming",
            source: "send_money_modal"
          }
        }

        const { error: incomingError } = await db.createTransaction(incomingTransactionData)
        
        if (incomingError) {
          toast.error("Failed to create incoming transaction")
          console.error("Incoming transaction error:", incomingError)
          return
        }

        // Update destination account balance
        const destinationAccount = accounts.find(acc => acc.id === formData.toAccount)
        if (destinationAccount) {
          const newDestBalance = (destinationAccount.balance || 0) + amount
          const { error: destBalanceError } = await db.updateAccountBalance(formData.toAccount, newDestBalance)
          
          if (!destBalanceError) {
            // Update local state for destination account
            setAccounts(accounts.map(acc => 
              acc.id === formData.toAccount 
                ? { ...acc, balance: newDestBalance }
                : acc.id === formData.fromAccount
                ? { ...acc, balance: newSourceBalance }
                : acc
            ))
          }
        }
      } else {
        // Update local state for source account only (external transfers)
        setAccounts(accounts.map(acc => 
          acc.id === formData.fromAccount 
            ? { ...acc, balance: newSourceBalance }
            : acc
        ))
      }

      toast.success(`₱${amount.toLocaleString()} sent successfully!`)
      
      // Reset form
      setFormData({
        fromAccount: "",
        toAccount: "",
        recipientType: "internal",
        recipientInfo: "",
        amount: "",
        description: "",
        reference: "",
      })
      
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to send money")
      console.error("Send money error:", error)
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
      <Send className="mr-2 h-4 w-4" />
      Send Money
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
            <Send className="h-5 w-5" />
            Send Money
          </DialogTitle>
          <DialogDescription>
            Transfer funds to another account or external recipient.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromAccount">From Account *</Label>
              <Select value={formData.fromAccount} onValueChange={(value) => setFormData({ ...formData, fromAccount: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source account" />
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
            <Label htmlFor="recipientType">Recipient Type *</Label>
            <Select value={formData.recipientType} onValueChange={(value) => setFormData({ ...formData, recipientType: value, toAccount: "", recipientInfo: "" })}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipient type" />
              </SelectTrigger>
              <SelectContent>
                {recipientTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {type.name}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {formData.recipientType === "internal" ? (
            <div className="space-y-2">
              <Label htmlFor="toAccount">To Account *</Label>
              <Select value={formData.toAccount} onValueChange={(value) => {
                setFormData({ ...formData, toAccount: value })
                const account = accounts.find(acc => acc.id === value)
                if (account) {
                  setFormData(prev => ({ ...prev, toAccount: value, recipientInfo: account.name }))
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.filter(acc => acc.id !== formData.fromAccount).map((account) => (
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
          ) : (
            <div className="space-y-2">
              <Label htmlFor="recipientInfo">
                {formData.recipientType === "external" ? "Recipient Email/Phone *" : "Bank Account Details *"}
              </Label>
              <Input
                id="recipientInfo"
                placeholder={
                  formData.recipientType === "external" 
                    ? "Enter email or phone number" 
                    : "Account number, bank name, etc."
                }
                value={formData.recipientInfo}
                onChange={(e) => setFormData({ ...formData, recipientInfo: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description for this transfer"
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
              {loading ? "Processing..." : "Send Money"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
