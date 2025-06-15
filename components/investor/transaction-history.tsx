"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download } from "lucide-react"

const transactions = [
  {
    id: "TXN001",
    date: "2023-07-20",
    type: "Buy",
    asset: "AAPL",
    assetName: "Apple Inc.",
    quantity: 50,
    price: 195.5,
    total: 9775.0,
    status: "Completed",
    fees: 9.95,
  },
  {
    id: "TXN002",
    date: "2023-07-18",
    type: "Sell",
    asset: "MSFT",
    assetName: "Microsoft Corp.",
    quantity: 25,
    price: 340.2,
    total: 8505.0,
    status: "Completed",
    fees: 9.95,
  },
  {
    id: "TXN003",
    date: "2023-07-15",
    type: "Buy",
    asset: "GOOGL",
    assetName: "Alphabet Inc.",
    quantity: 10,
    price: 125.8,
    total: 1258.0,
    status: "Completed",
    fees: 9.95,
  },
  {
    id: "TXN004",
    date: "2023-07-12",
    type: "Dividend",
    asset: "VTI",
    assetName: "Vanguard Total Stock Market ETF",
    quantity: 100,
    price: 2.45,
    total: 245.0,
    status: "Completed",
    fees: 0,
  },
  {
    id: "TXN005",
    date: "2023-07-10",
    type: "Buy",
    asset: "TSLA",
    assetName: "Tesla Inc.",
    quantity: 15,
    price: 280.75,
    total: 4211.25,
    status: "Pending",
    fees: 9.95,
  },
  {
    id: "TXN006",
    date: "2023-07-08",
    type: "Sell",
    asset: "AMZN",
    assetName: "Amazon.com Inc.",
    quantity: 8,
    price: 135.25,
    total: 1082.0,
    status: "Completed",
    fees: 9.95,
  },
  {
    id: "TXN007",
    date: "2023-07-05",
    type: "Buy",
    asset: "SPY",
    assetName: "SPDR S&P 500 ETF Trust",
    quantity: 20,
    price: 445.3,
    total: 8906.0,
    status: "Completed",
    fees: 9.95,
  },
  {
    id: "TXN008",
    date: "2023-07-03",
    type: "Dividend",
    asset: "JNJ",
    assetName: "Johnson & Johnson",
    quantity: 30,
    price: 1.13,
    total: 33.9,
    status: "Completed",
    fees: 0,
  },
]

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.assetName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || transaction.type.toLowerCase() === filterType.toLowerCase()
    const matchesStatus = filterStatus === "all" || transaction.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "buy":
        return "bg-green-100 text-green-800"
      case "sell":
        return "bg-red-100 text-red-800"
      case "dividend":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  const handleExport = () => {
    console.log("Exporting transaction history...")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by symbol or company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
                <SelectItem value="dividend">Dividend</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
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
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.date}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(transaction.type)}>{transaction.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{transaction.asset}</p>
                        <p className="text-sm text-muted-foreground">{transaction.assetName}</p>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>₱{transaction.price.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">₱{transaction.total.toFixed(2)}</TableCell>
                    <TableCell>₱{transaction.fees.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
