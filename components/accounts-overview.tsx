"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Wallet, Eye, EyeOff, AlertCircle, Database } from "lucide-react"
import { AddMoneyModal } from "@/components/add-money-modal"
import { useAuth } from "@/contexts/auth-context"
import { db, Account } from "@/lib/database"
import { toast } from "sonner"
import { isSupabaseConfigured } from "@/lib/supabase"

export function AccountsOverview() {
  const { currentOrganization, loading: authLoading } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showBalance, setShowBalance] = useState(true)
  const [addMoneyModalOpen, setAddMoneyModalOpen] = useState(false)
  const [databaseError, setDatabaseError] = useState<string | null>(null)

  useEffect(() => {
    const loadAccounts = async () => {
      if (authLoading) {
        return // Wait for auth to load
      }
      
      if (!currentOrganization) {
        setIsLoading(false)
        setDatabaseError('No organization selected. Please create or select an organization.')
        return
      }
      
      try {
        setIsLoading(true)
        setDatabaseError(null)

        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
          setDatabaseError('database_not_configured')
          setIsLoading(false)
          return
        }
        
        const { data, error } = await db.getAccounts(currentOrganization.id)
        
        if (error) {
          const errorMessage = error.message || 'Unknown error occurred'
          setDatabaseError(errorMessage)
          
          // Don't show toast for database not configured error
          if (errorMessage !== 'Database not configured') {
            toast.error('Failed to load accounts: ' + errorMessage)
          }
          return
        }
        
        setAccounts(data || [])
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        setDatabaseError(errorMessage)
        toast.error('Failed to load accounts')
      } finally {
        setIsLoading(false)
      }
    }

    loadAccounts()
  }, [currentOrganization, authLoading])

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const handleAddMoney = (amount: number) => {
    // TODO: Implement actual add money functionality
    toast.success(`₱${amount} added successfully`)
    // Refresh accounts after adding money
    if (currentOrganization && !databaseError) {
      db.getAccounts(currentOrganization.id).then(({ data }) => {
        if (data) setAccounts(data)
      })
    }
  }

  // Database not configured state
  if (databaseError === 'database_not_configured' || databaseError === 'Database not configured') {
    return (
      <Card className="glass-card apple-hover border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accounts Overview</CardTitle>
          <AlertCircle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <Database className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-sm font-medium text-warning-light mb-1">Database Setup Required</p>
            <p className="text-xs text-readable mb-4">
              Connect to Supabase to start managing your accounts
            </p>
            <div className="bg-amber-50 rounded-lg p-3 text-left text-xs text-readable">
              <p className="font-medium mb-1 text-warning-light">To get started:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create a Supabase project</li>
                <li>Add your environment variables</li>
                <li>Run the database schema</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Database error state
  if (databaseError && databaseError !== 'database_not_configured') {
    return (
      <Card className="glass-card apple-hover border-red-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accounts Overview</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm font-medium text-error-light mb-1">Connection Error</p>
            <p className="text-xs text-error-light mb-4">
              Unable to connect to database
            </p>
            <p className="text-xs text-readable">
              {databaseError}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="glass-card apple-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accounts Overview</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="skeleton h-4 w-4" />
            <div className="skeleton h-8 w-8" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="skeleton h-8 w-24" />
              <div className="skeleton h-4 w-32" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-16 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="glass-card apple-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accounts Overview</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="h-8 w-8 p-0 hover:bg-muted/50"
            >
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              onClick={() => setAddMoneyModalOpen(true)}
              className="apple-button gradient-blue text-white border-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Total Balance */}
            <div className="space-y-2">
              <div className="text-2xl font-bold tracking-tight">
                {showBalance ? formatCurrency(totalBalance) : "••••••"}
              </div>
              <p className="text-xs text-muted-foreground">
                Total across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Account List */}
            <div className="space-y-3">
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Wallet className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{account.name}</p>
                        <p className="text-xs text-muted-foreground">{account.bank_name || 'Account'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {showBalance ? formatCurrency(account.balance) : "••••"}
                      </p>
                      <Badge 
                        variant={account.is_active ? 'default' : 'secondary'} 
                        className="text-xs h-5"
                      >
                        {account.is_active ? 'active' : 'inactive'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 px-4">
                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <Wallet className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">No accounts yet</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Add your first account to start tracking your finances
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setAddMoneyModalOpen(true)}
                    className="apple-button gradient-blue text-white border-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AddMoneyModal
        isOpen={addMoneyModalOpen}
        onClose={() => setAddMoneyModalOpen(false)}
        onAddMoney={handleAddMoney}
      />
    </>
  )
}