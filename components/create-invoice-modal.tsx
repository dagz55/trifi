"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { useSettings } from "@/contexts/settings-context"

interface InvoiceItem {
  id: number
  description: string
  quantity: number
  rate: number
  amount: number
}

interface CreateInvoiceModalProps {
  trigger?: React.ReactNode
}

export function CreateInvoiceModal({ trigger }: CreateInvoiceModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { payments, setPayments } = useSettings()
  
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    issueDate: new Date(),
    dueDate: addDays(new Date(), 30),
    notes: "",
    terms: "Payment is due within 30 days of invoice date.",
    taxRate: 12,
  })

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: "", quantity: 1, rate: 0, amount: 0 }
  ])

  const addItem = () => {
    const newId = Math.max(...items.map(item => item.id)) + 1
    setItems([...items, { id: newId, description: "", quantity: 1, rate: 0, amount: 0 }])
  }

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate
        }
        return updatedItem
      }
      return item
    }))
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const taxAmount = subtotal * (formData.taxRate / 100)
  const total = subtotal + taxAmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.clientName.trim()) {
        toast.error("Client name is required")
        return
      }

      if (items.some(item => !item.description.trim())) {
        toast.error("All items must have a description")
        return
      }

      const newInvoice = {
        id: formData.invoiceNumber,
        client: formData.clientName,
        clientEmail: formData.clientEmail,
        clientAddress: formData.clientAddress,
        issueDate: format(formData.issueDate, "MMM dd, yyyy"),
        dueDate: format(formData.dueDate, "MMM dd, yyyy"),
        amount: total,
        subtotal: subtotal,
        taxRate: formData.taxRate,
        taxAmount: taxAmount,
        status: "draft",
        items: items.filter(item => item.description.trim()),
        notes: formData.notes,
        terms: formData.terms,
        createdAt: new Date().toISOString(),
      }

      // Add to payments list for demo purposes
      const updatedPayments = [...payments, {
        id: Date.now(),
        type: "invoice",
        description: `Invoice ${formData.invoiceNumber} for ${formData.clientName}`,
        amount: `₱${total.toLocaleString()}`,
        date: format(formData.issueDate, "MMM dd, yyyy"),
        status: "pending",
        category: "Income",
        invoice: newInvoice,
      }]
      setPayments(updatedPayments)
      
      // Reset form
      setFormData({
        clientName: "",
        clientEmail: "",
        clientAddress: "",
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        issueDate: new Date(),
        dueDate: addDays(new Date(), 30),
        notes: "",
        terms: "Payment is due within 30 days of invoice date.",
        taxRate: 12,
      })
      setItems([{ id: 1, description: "", quantity: 1, rate: 0, amount: 0 }])
      
      setOpen(false)
      toast.success("Invoice created successfully!")
    } catch (error) {
      toast.error("Failed to create invoice")
      console.error("Error creating invoice:", error)
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Create Invoice
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Create a professional invoice for your client. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                placeholder="INV-001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={formData.taxRate}
                onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                placeholder="12"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Client Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Acme Corporation"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  placeholder="client@acme.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Client Address</Label>
              <Textarea
                id="clientAddress"
                value={formData.clientAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, clientAddress: e.target.value }))}
                placeholder="123 Business St, City, Country"
                rows={2}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.issueDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.issueDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, issueDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.dueDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, dueDate: date }))}
                    initialFocus
                    disabled={(date) => date < formData.issueDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invoice Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Service or product description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      min="1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Rate</Label>
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Amount</Label>
                    <Input
                      value={`₱${item.amount.toLocaleString()}`}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax ({formData.taxRate}%):</span>
                <span>₱{taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total:</span>
                <span>₱{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes for the client"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="terms">Payment Terms</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                placeholder="Payment terms and conditions"
                rows={2}
              />
            </div>
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
            <Button type="submit" disabled={loading || subtotal === 0}>
              {loading ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}