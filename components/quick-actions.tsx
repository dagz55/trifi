"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, SendHorizontal, CreditCard } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

function ActionDialog({ title, description, actionText }: { title: string; description: string; actionText: string }) {
  const [amount, setAmount] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    toast.success(`${actionText} completed: ₱${Number(amount).toLocaleString()}`)
    setAmount("")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {title === "Add Funds" && <PlusCircle className="mr-2 h-4 w-4" />}
          {title === "Send Money" && <SendHorizontal className="mr-2 h-4 w-4" />}
          {title === "Top Up" && <CreditCard className="mr-2 h-4 w-4" />}
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                className="col-span-3"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            {actionText}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function QuickActions() {
  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <ActionDialog title="Add Funds" description="Add funds to your account" actionText="Add Funds" />
        <ActionDialog title="Send Money" description="Send money to another account" actionText="Send Money" />
        <ActionDialog title="Top Up" description="Top up your account" actionText="Top Up" />
      </CardContent>
    </Card>
  )
}
