"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, SendHorizontal, CreditCard } from "lucide-react"
import { AddMoneyModal } from "./add-money-modal"
import { SendMoneyModal } from "./send-money-modal"
import { TopUpModal } from "./top-up-modal"

export function QuickActions() {
  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <AddMoneyModal 
          trigger={
            <button className="w-full flex items-center justify-start gap-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <PlusCircle className="h-4 w-4" />
              Add Funds
            </button>
          }
        />
        <SendMoneyModal 
          trigger={
            <button className="w-full flex items-center justify-start gap-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <SendHorizontal className="h-4 w-4" />
              Send Money
            </button>
          }
        />
        <TopUpModal 
          trigger={
            <button className="w-full flex items-center justify-start gap-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <CreditCard className="h-4 w-4" />
              Top Up
            </button>
          }
        />
      </CardContent>
    </Card>
  )
}
