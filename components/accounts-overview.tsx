"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Plus, Send, CreditCard, MoreHorizontal } from "lucide-react"
import { AddMoneyModal } from "./add-money-modal"
import { SendMoneyModal } from "./send-money-modal"
import { RequestMoneyModal } from "./request-money-modal"
import { ViewStatementModal } from "./view-statement-modal"
import { AccountSettingsModal } from "./account-settings-modal"
import { ExportDataModal } from "./export-data-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const initialAccounts: { name: string; balance: number }[] = []

export function AccountsOverview() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false)
  const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false)
  const [isRequestMoneyModalOpen, setIsRequestMoneyModalOpen] = useState(false)
  const [isViewStatementModalOpen, setIsViewStatementModalOpen] = useState(false)
  const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = useState(false)
  const [isExportDataModalOpen, setIsExportDataModalOpen] = useState(false)

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  const handleAddMoney = (amount: number) => {
    setAccounts(
      accounts.map((account) =>
        account.name === "Checking" ? { ...account, balance: account.balance + amount } : account,
      ),
    )
  }

  const handleSendMoney = (amount: number, fromAccount: string) => {
    setAccounts(
      accounts.map((account) =>
        account.name === fromAccount ? { ...account, balance: account.balance - amount } : account,
      ),
    )
  }

  const handleRequestMoney = (amount: number, contact: any) => {
    console.log(`Requested ₱${amount} from ${contact.name}`)
  }

  const handleViewStatement = () => {
    setIsViewStatementModalOpen(true)
  }

  const handleAccountSettings = () => {
    setIsAccountSettingsModalOpen(true)
  }

  const handleExportData = () => {
    setIsExportDataModalOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Accounts Overview</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">₱{totalBalance.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">Total balance across all accounts</p>
        <div className="mt-4 space-y-2">
          {accounts.map((account) => (
            <div key={account.name} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{account.name}</span>
              <span className="text-sm font-medium">₱{account.balance.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button size="sm" onClick={() => setIsAddMoneyModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
          <Button size="sm" onClick={() => setIsSendMoneyModalOpen(true)}>
            <Send className="mr-2 h-4 w-4" /> Send
          </Button>
          <Button size="sm" onClick={() => setIsRequestMoneyModalOpen(true)}>
            <CreditCard className="mr-2 h-4 w-4" /> Request
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <MoreHorizontal className="mr-2 h-4 w-4" /> More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewStatement}>
                View Statement
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAccountSettings}>
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportData}>
                Export Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
      
      <AddMoneyModal
        isOpen={isAddMoneyModalOpen}
        onClose={() => setIsAddMoneyModalOpen(false)}
        onAddMoney={handleAddMoney}
      />
      <SendMoneyModal
        isOpen={isSendMoneyModalOpen}
        onClose={() => setIsSendMoneyModalOpen(false)}
        onSendMoney={handleSendMoney}
        accounts={accounts}
      />
      <RequestMoneyModal
        isOpen={isRequestMoneyModalOpen}
        onClose={() => setIsRequestMoneyModalOpen(false)}
        onRequestMoney={handleRequestMoney}
      />
      
      <ViewStatementModal
        open={isViewStatementModalOpen}
        onOpenChange={setIsViewStatementModalOpen}
        accounts={accounts}
      />
      <AccountSettingsModal
        open={isAccountSettingsModalOpen}
        onOpenChange={setIsAccountSettingsModalOpen}
      />
      <ExportDataModal
        open={isExportDataModalOpen}
        onOpenChange={setIsExportDataModalOpen}
        accounts={accounts}
      />
    </Card>
  )
}
