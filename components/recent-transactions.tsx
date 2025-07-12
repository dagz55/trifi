"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Plus, Receipt, AlertCircle, Database } from "lucide-react"
import { AddTransactionModal } from "@/components/add-transaction-modal"
import { useAuth } from "@/contexts/auth-context"
import { Transaction } from "@/lib/database"
import { toast } from "sonner"
import { isSupabaseConfigured } from "@/lib/supabase"

export function RecentTransactions() {
  const { currentOrganization, loading: authLoading, userProfile } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false)
  const [databaseError, setDatabaseError] = useState<string | null>(null)

  const loadTransactions = async () => {
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
      
      const response = await fetch(`/api/transactions?organizationId=${currentOrganization.id}&limit=5`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to load transactions')
      }
      
      const { data } = await response.json()
      setTransactions(data || [])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setDatabaseError(errorMessage)
      
      // Don't show toast for database not configured error
      if (errorMessage !== 'Database not configured') {
        toast.error('Failed to load transactions: ' + errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [currentOrganization, authLoading])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getCategoryIcon = (categoryName?: string) => {
    // Simple category icon mapping
    const iconMap: { [key: string]: string } = {
      salary: '💼',
      food: '🍽️',
      transport: '🚗',
      shopping: '🛍️',
      utilities: '⚡',
      entertainment: '🎬',
      healthcare: '🏥',
      education: '📚',
      investment: '📈',
      revenue: '💰',
      expenses: '💳',
      other: '📋'
    }
    return iconMap[categoryName?.toLowerCase() || 'other'] || '📋'
  }

  const handleTransactionAdded = (transaction: Transaction) => {
    // Add the new transaction to the beginning of the list
    setTransactions((prev: Transaction[]) => [transaction, ...prev.slice(0, 4)]) // Keep only 5 transactions
    toast.success('Transaction added successfully!')
  }

  const refreshTransactions = () => {
    loadTransactions()
  }

  // Database not configured state
  if (databaseError === 'database_not_configured' || databaseError === 'Database not configured') {
    return (
      <Card className="glass-card apple-hover border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
          <AlertCircle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <Database className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-sm font-medium text-warning-light mb-1">Database Setup Required</p>
            <p className="text-xs text-readable mb-4">
              Connect to Supabase to start tracking transactions
            </p>
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
          <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
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
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="glass-card apple-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
          <div className="skeleton h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="skeleton h-10 w-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <div className="skeleton h-4 w-24" />
                  <div className="skeleton h-3 w-16" />
                </div>
                <div className="skeleton h-4 w-16" />
              </div>
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
          <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
          <Button
            size="sm"
            onClick={() => setAddTransactionModalOpen(true)}
            className="apple-button"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-lg">
                      {getCategoryIcon('other')} {/* TODO: Get category from related data */}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{transaction.description || 'Transaction'}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-muted-foreground">Account</p> {/* TODO: Get account name from related data */}
                        <Badge variant="outline" className="text-xs h-4">
                          {transaction.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        transaction.type === 'income' ? 'status-green' : 'status-red'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.transaction_date)}
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowDownRight className="h-3 w-3" />
                      ) : (
                        <ArrowUpRight className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 px-4">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                  <Receipt className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">No transactions yet</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Start tracking your income and expenses
                </p>
                <Button
                  size="sm"
                  onClick={() => setAddTransactionModalOpen(true)}
                  className="apple-button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddTransactionModal
        open={addTransactionModalOpen}
        onOpenChange={setAddTransactionModalOpen}
        onTransactionAdded={handleTransactionAdded}
      />
    </>
  )
}
