"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, CreditCard, Wifi, Car, Plus, Clock } from "lucide-react"
import { PaymentModal } from "@/components/payment-modal"
import { toast } from "sonner"

interface QuickBill {
  id: string
  name: string
  provider: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid' | 'overdue'
  icon: any
}

export function QuickBillPay() {
  const [bills] = useState<QuickBill[]>([
    // Empty array - no mock data
  ])
  const [selectedBill, setSelectedBill] = useState<QuickBill | null>(null)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("")

  const commonProviders = [
    { name: "Meralco", icon: Zap, category: "Electric" },
    { name: "Smart/Globe", icon: Wifi, category: "Internet" },
    { name: "Credit Card", icon: CreditCard, category: "Finance" },
    { name: "Gas Station", icon: Car, category: "Fuel" },
  ]

  const handleQuickPay = (provider: string, amount: string) => {
    if (!amount || !provider) {
      toast.error("Please select a provider and enter an amount")
      return
    }
    
    // Open payment modal with selected details
    setPaymentModalOpen(true)
    toast.info(`Preparing payment for ${provider}`)
  }

  const handlePayBill = (bill: QuickBill) => {
    setSelectedBill(bill)
    setPaymentModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <>
      <Card className="glass-card apple-hover">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium">Quick Bill Pay</CardTitle>
          <p className="text-xs text-readable">
            Pay your bills quickly and securely
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Scheduled Bills */}
            {bills.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-readable">Upcoming Bills</h4>
                {bills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <bill.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{bill.name}</p>
                        <p className="text-xs text-readable">{bill.provider}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">{formatCurrency(bill.amount)}</p>
                      <Badge className={`text-xs h-4 ${getStatusColor(bill.status)}`}>
                        {bill.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 px-4">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-readable mb-1">No scheduled bills</p>
                <p className="text-xs text-readable mb-4">
                  Set up recurring bills or make a quick payment below
                </p>
              </div>
            )}

            {/* Quick Pay Options */}
            <div className="space-y-3 pt-4 border-t border-border/50">
              <h4 className="text-sm font-medium text-readable">Quick Pay</h4>
              
              {/* Provider Selection */}
              <div className="space-y-2">
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger className="apple-input">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonProviders.map((provider) => (
                      <SelectItem key={provider.name} value={provider.name}>
                        <div className="flex items-center space-x-2">
                          <provider.icon className="h-4 w-4" />
                          <span>{provider.name}</span>
                          <Badge variant="outline" className="ml-auto text-xs">
                            {provider.category}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Amount Input */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-readable text-sm">₱</span>
                  <Input
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="apple-input pl-8"
                  />
                </div>
                
                {/* Pay Button */}
                <Button
                  className="w-full apple-button gradient-blue text-white border-0"
                  onClick={() => handleQuickPay(selectedProvider, customAmount)}
                  disabled={!selectedProvider || !customAmount}
                >
                  Pay Now
                </Button>
              </div>

              {/* Quick Access Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {commonProviders.slice(0, 4).map((provider) => (
                  <Button
                    key={provider.name}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 apple-button"
                    onClick={() => setSelectedProvider(provider.name)}
                  >
                    <provider.icon className="h-4 w-4" />
                    <span className="text-xs">{provider.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PaymentModal
        bill={{
          id: selectedBill ? parseInt(selectedBill.id) : 1,
          name: selectedBill?.name || 'Quick Payment',
          amount: selectedBill?.amount || parseFloat(customAmount) || 0,
          dueDate: selectedBill?.dueDate || new Date().toISOString()
        }}
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentSuccess={() => {
          toast.success('Payment successful!')
          setPaymentModalOpen(false)
          setCustomAmount("")
          setSelectedProvider("")
        }}
      />
    </>
  )
}
