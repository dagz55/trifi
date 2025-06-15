"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Download,
  Plus,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet
} from "lucide-react"
import { toast } from "sonner"

const transactions = [
  {
    id: "TXN001",
    type: "income",
    description: "Client Payment - TriFi App Development",
    amount: 150000,
    date: "2024-01-15",
    time: "14:30",
    status: "completed",
    category: "Revenue",
    account: "Business Checking",
    reference: "INV-2024-001",
  },
  {
    id: "TXN002",
    type: "expense",
    description: "Office Rent Payment",
    amount: 45000,
    date: "2024-01-12",
    time: "09:15",
    status: "completed",
    category: "Operating Expenses",
    account: "Business Checking",
    reference: "RENT-JAN-2024",
  },
  {
    id: "TXN003",
    type: "income",
    description: "Investment Return - Bonds",
    amount: 25000,
    date: "2024-01-10",
    time: "16:45",
    status: "completed",
    category: "Investment Income",
    account: "Investment",
    reference: "BOND-RET-001",
  },
  {
    id: "TXN004",
    type: "expense",
    description: "Software License - Adobe Creative Suite",
    amount: 12500,
    date: "2024-01-08",
    time: "11:20",
    status: "pending",
    category: "Software & Tools",
    account: "Business Checking",
    reference: "SUB-ADOBE-2024",
  },
  {
    id: "TXN005",
    type: "transfer",
    description: "Transfer to Savings Account",
    amount: 75000,
    date: "2024-01-05",
    time: "13:00",
    status: "completed",
    category: "Transfer",
    account: "Checking → Savings",
    reference: "TRF-SAV-001",
  },
]

const transactionMetrics = [
  {
    title: "Total Income",
    value: "₱2,450,000",
    change: "+12.5%",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    title: "Total Expenses",
    value: "₱1,850,000",
    change: "+8.2%",
    icon: TrendingDown,
    color: "text-red-600",
  },
  {
    title: "Net Income",
    value: "₱600,000",
    change: "+18.3%",
    icon: Wallet,
    color: "text-blue-600",
  },
  {
    title: "Transactions",
    value: "1,247",
    change: "+156",
    icon: ArrowUpRight,
    color: "text-purple-600",
  },
]

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
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleExportTransactions = () => {
    toast.success("Exporting transactions as CSV...")
    // Implement export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Type,Description,Amount,Date,Status,Category\n" +
      transactions.map(t => `${t.id},${t.type},${t.description},${t.amount},${t.date},${t.status},${t.category}`).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "transactions.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddTransaction = () => {
    toast.info("Opening add transaction form...")
    // Navigate to add transaction form or open modal
  }

  const handleDateRangeFilter = () => {
    toast.info("Opening date range picker...")
    // Open date range picker
  }

  const handleMoreFilters = () => {
    toast.info("Opening advanced filters...")
    // Open advanced filters modal
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

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
            <Button variant="outline" onClick={handleDateRangeFilter}>
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline" onClick={handleMoreFilters}>
              <Filter className="mr-2 h-4 w-4" />
              More Filters
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
                {filteredTransactions.map((transaction) => (
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
                ))}
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No transactions match your filters</p>
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
                {filteredTransactions.filter(t => t.type === "income").map((transaction) => (
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
                ))}
                {filteredTransactions.filter(t => t.type === "income").length === 0 && (
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
                {filteredTransactions.filter(t => t.type === "expense").map((transaction) => (
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
                ))}
                {filteredTransactions.filter(t => t.type === "expense").length === 0 && (
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
                {filteredTransactions.filter(t => t.type === "transfer").map((transaction) => (
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
                          ₱{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {filteredTransactions.filter(t => t.type === "transfer").length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No transfer transactions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 