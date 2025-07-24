"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Download,
  Filter,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Wallet
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from '@/contexts/auth-context'
import { AddTransactionModal } from "@/components/add-transaction-modal"
import { DateRangePicker } from "@/components/date-range-picker"
import { AdvancedFiltersModal } from "@/components/advanced-filters-modal"
import { DateRange } from "react-day-picker"

// Transaction interface
interface Transaction {
  id: string
  type: "income" | "expense" | "transfer"
  description: string
  amount: number
  date: string
  time: string
  status: "completed" | "pending" | "failed"
  category: string
  account: string
  reference: string
}

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "income":
      return <ArrowDownLeft className="h-4 w-4 text-green-600" />
    case "expense":
      return <ArrowUpRight className="h-4 w-4 text-red-600" />
    case "transfer":
      return <ArrowUpRight className="h-4 w-4 text-blue-600" />
    default:
      return <ArrowUpRight className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "failed":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatAmount = (amount: number, type: string) => {
  const formatted = `₱${amount.toLocaleString()}`
  if (type === "expense") {
    return `-${formatted}`
  }
  return `+${formatted}`
}

export default function TransactionsPage() {
  const { userProfile, currentOrganization } = useAuth()
  
  // TODO: Replace with actual data from your database/API
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [advancedFilters, setAdvancedFilters] = useState({
    minAmount: "",
    maxAmount: "",
    accounts: [] as string[],
    categories: [] as string[],
    statuses: [] as string[],
    reference: "",
  })

  // Modal states
  const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false)
  const [advancedFiltersModalOpen, setAdvancedFiltersModalOpen] = useState(false)

  // Placeholder metrics - TODO: Calculate from actual transaction data
  const transactionMetrics = [
    {
      title: "Total Income",
      value: "₱0",
      change: "0%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Total Expenses",
      value: "₱0",
      change: "0%",
      icon: TrendingDown,
      color: "text-red-600",
    },
    {
      title: "Net Income",
      value: "₱0",
      change: "0%",
      icon: Wallet,
      color: "text-blue-600",
    },
    {
      title: "Transactions",
      value: transactions.length.toString(),
      change: "0",
      icon: ArrowUpRight,
      color: "text-purple-600",
    },
  ]

  const handleExportTransactions = () => {
    if (filteredTransactions.length === 0) {
      toast.error("No transactions to export")
      return
    }
    
    toast.success("Exporting transactions as CSV...")
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Type,Description,Amount,Date,Status,Category\n" +
      filteredTransactions.map(t => `${t.id},${t.type},${t.description},${t.amount},${t.date},${t.status},${t.category}`).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "transactions.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddTransaction = () => {
    setAddTransactionModalOpen(true)
  }

  const handleTransactionAdded = (newTransaction: any) => {
    setTransactions([newTransaction, ...transactions])
    toast.success("Transaction added successfully!")
  }

  const handleAdvancedFiltersApply = (filters: any) => {
    setAdvancedFilters(filters)
    toast.success("Advanced filters applied!")
  }

  const filteredTransactions = transactions.filter(transaction => {
    // Basic filters
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    // Date range filter
    let matchesDateRange = true
    if (dateRange?.from) {
      const transactionDate = new Date(transaction.date)
      matchesDateRange = transactionDate >= dateRange.from
      if (dateRange.to) {
        matchesDateRange = matchesDateRange && transactionDate <= dateRange.to
      }
    }

    // Advanced filters
    let matchesAdvanced = true
    
    // Amount range
    if (advancedFilters.minAmount) {
      const minAmount = parseFloat(advancedFilters.minAmount.replace(/,/g, ""))
      matchesAdvanced = matchesAdvanced && transaction.amount >= minAmount
    }
    if (advancedFilters.maxAmount) {
      const maxAmount = parseFloat(advancedFilters.maxAmount.replace(/,/g, ""))
      matchesAdvanced = matchesAdvanced && transaction.amount <= maxAmount
    }

    // Accounts filter
    if (advancedFilters.accounts.length > 0) {
      matchesAdvanced = matchesAdvanced && advancedFilters.accounts.includes(transaction.account)
    }

    // Categories filter
    if (advancedFilters.categories.length > 0) {
      matchesAdvanced = matchesAdvanced && advancedFilters.categories.includes(transaction.category)
    }

    // Statuses filter
    if (advancedFilters.statuses.length > 0) {
      matchesAdvanced = matchesAdvanced && advancedFilters.statuses.includes(transaction.status)
    }

    // Reference filter
    if (advancedFilters.reference) {
      matchesAdvanced = matchesAdvanced && transaction.reference.toLowerCase().includes(advancedFilters.reference.toLowerCase())
    }

    return matchesSearch && matchesType && matchesStatus && matchesDateRange && matchesAdvanced
  })

  const getActiveFiltersCount = () => {
    let count = 0
    if (searchTerm) count++
    if (typeFilter !== "all") count++
    if (statusFilter !== "all") count++
    if (dateRange?.from) count++
    if (advancedFilters.minAmount || advancedFilters.maxAmount) count++
    if (advancedFilters.accounts.length > 0) count++
    if (advancedFilters.categories.length > 0) count++
    if (advancedFilters.statuses.length > 0) count++
    if (advancedFilters.reference) count++
    return count
  }

  if (!userProfile) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportTransactions}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAddTransaction}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Transaction Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {transactionMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
              <Badge variant="secondary" className="mt-2">
                {metric.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search transactions..." 
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePicker 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              className="w-[280px]"
            />
            <Button 
              variant="outline" 
              onClick={() => setAdvancedFiltersModalOpen(true)}
              className="relative"
            >
              <Filter className="mr-2 h-4 w-4" />
              More Filters
              {getActiveFiltersCount() > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions ({filteredTransactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-full">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{transaction.date}</span>
                            <span>•</span>
                            <span>{transaction.time}</span>
                            <span>•</span>
                            <span>{transaction.account}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`font-medium ${
                            transaction.type === "expense" ? "text-red-600" : "text-green-600"
                          }`}>
                            {formatAmount(transaction.amount, transaction.type)}
                          </p>
                          <p className="text-sm text-muted-foreground">{transaction.category}</p>
                        </div>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Wallet className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Get started by adding your first transaction
                    </p>
                    <Button onClick={handleAddTransaction}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Transaction
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {filteredTransactions.filter(t => t.type === "income").length > 0 ? (
                  filteredTransactions.filter(t => t.type === "income").map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-full">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{transaction.date}</span>
                            <span>•</span>
                            <span>{transaction.account}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            {formatAmount(transaction.amount, transaction.type)}
                          </p>
                          <p className="text-sm text-muted-foreground">{transaction.category}</p>
                        </div>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No income transactions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {filteredTransactions.filter(t => t.type === "expense").length > 0 ? (
                  filteredTransactions.filter(t => t.type === "expense").map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-full">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{transaction.date}</span>
                            <span>•</span>
                            <span>{transaction.account}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-red-600">
                            {formatAmount(transaction.amount, transaction.type)}
                          </p>
                          <p className="text-sm text-muted-foreground">{transaction.category}</p>
                        </div>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No expense transactions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {filteredTransactions.filter(t => t.type === "transfer").length > 0 ? (
                  filteredTransactions.filter(t => t.type === "transfer").map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-full">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{transaction.date}</span>
                            <span>•</span>
                            <span>{transaction.account}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-blue-600">
                            {formatAmount(transaction.amount, transaction.type)}
                          </p>
                          <p className="text-sm text-muted-foreground">{transaction.category}</p>
                        </div>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No transfer transactions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddTransactionModal
        open={addTransactionModalOpen}
        onOpenChange={setAddTransactionModalOpen}
        onTransactionAdded={handleTransactionAdded}
      />

      <AdvancedFiltersModal
        open={advancedFiltersModalOpen}
        onOpenChange={setAdvancedFiltersModalOpen}
        onFiltersApply={handleAdvancedFiltersApply}
        currentFilters={advancedFilters}
      />
    </div>
  )
} 