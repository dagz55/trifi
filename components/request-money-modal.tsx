"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2 } from "lucide-react"

const steps = ["Select Contact", "Enter Amount", "OTP Verification", "Confirmation"]

interface Contact {
  id: string
  name: string
  phoneNumber: string
}

interface RequestMoneyModalProps {
  isOpen: boolean
  onClose: () => void
  onRequestMoney: (amount: number, contact: Contact | null) => void
}

export function RequestMoneyModal({ isOpen, onClose, onRequestMoney }: RequestMoneyModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedContact, setSelectedContact] = useState<string>("")
  const [amount, setAmount] = useState("")
  const [otp, setOtp] = useState("")
  const [showOtpInput, setShowOtpInput] = useState(false)

  // TODO: Fetch real contacts from your database/API
  const contacts: Contact[] = []

  const handleRequestMoney = () => {
    if (!selectedContact || !amount) {
      alert("Please select a contact and enter an amount")
      return
    }
    
    const contact = contacts.find(c => c.id === selectedContact)
    if (!contact) {
      alert("Contact not found")
      return
    }
    
    setShowOtpInput(true)
  }

  const handleConfirmRequest = () => {
    if (!otp) {
      alert("Please enter OTP")
      return
    }
    
    const contact = contacts.find(c => c.id === selectedContact)
    onRequestMoney(parseFloat(amount), contact || null)
    
    // Reset form
    setSelectedContact("")
    setAmount("")
    setOtp("")
    setShowOtpInput(false)
    onClose()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Label htmlFor="contact">Select Contact</Label>
            <Select value={selectedContact} onValueChange={setSelectedContact}>
              <SelectTrigger>
                <SelectValue placeholder="Select a contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.name} ({contact.phoneNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="amount">Amount (₱)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Enter the OTP sent to your registered mobile number</p>
            <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          </div>
        )
      case 3:
        return (
          <div className="text-center space-y-4">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <p className="text-lg font-medium">Money Request Sent</p>
            <p className="text-sm text-muted-foreground">
              ₱{amount} has been requested from {contacts.find(c => c.id === selectedContact)?.name}.
            </p>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Money</DialogTitle>
          <DialogDescription>
            Send a money request to someone in your contacts.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg font-medium">No contacts available</p>
              <p className="text-sm">Connect your database to see contacts</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {renderStepContent()}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                {showOtpInput ? (
                  <Button onClick={handleConfirmRequest}>
                    Confirm Request
                  </Button>
                ) : (
                  <Button onClick={handleRequestMoney}>
                    Send Request
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
