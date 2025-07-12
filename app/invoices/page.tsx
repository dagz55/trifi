"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateInvoiceModal } from "@/components/create-invoice-modal"
import { useAuth } from "@/contexts/auth-context"
import { Invoice } from "@/lib/database"
import { toast } from "sonner"
import { 
  Receipt, 
  Search, 
  Filter, 
  Download,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Send
} from "lucide-react"

const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800"
    case "sent":
      return "bg-blue-100 text-blue-800"
    case "overdue":
      return "bg-red-100 text-red-800"
    case "draft":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "sent":
      return <Send className="h-4 w-4 text-blue-600" />
    case "overdue":
      return <XCircle className="h-4 w-4 text-red-600" />
    case "draft":
      return <Edit className="h-4 w-4 text-gray-600" />
    default:
      return <Receipt className="h-4 w-4" />
  }
}

const isOverdue = (dueDate: string, status: string) => {
  if (status === "paid") return false
  return new Date(dueDate) < new Date()
}

export default function InvoicesPage() {
  const { currentOrganization } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  const loadInvoices = async () => {
    if (!currentOrganization) return

    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        organizationId: currentOrganization.id
      })

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/invoices?${params}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to load invoices')
      }

      const { data } = await response.json()
      setInvoices(data || [])
    } catch (error) {
      console.error('Error loading invoices:', error)
      toast.error('Failed to load invoices')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInvoices()
  }, [currentOrganization, statusFilter])

  // Calculate metrics from actual data
  const invoiceMetrics = [
    {
      title: "Total Outstanding",
      value: `₱${invoices.filter((i: Invoice) => i.status !== 'paid').reduce((sum: number, i: Invoice) => sum + i.total_amount, 0).toLocaleString()}`,
      change: "₱0",
      icon: Receipt,
      color: "text-orange-600",
    },
    {
      title: "Paid This Month",
      value: `₱${invoices.filter((i: Invoice) => i.status === 'paid' && new Date(i.paid_date || '').getMonth() === new Date().getMonth()).reduce((sum: number, i: Invoice) => sum + i.total_amount, 0).toLocaleString()}`,
      change: "₱0",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Overdue",
      value: `₱${invoices.filter((i: Invoice) => isOverdue(i.due_date, i.status || 'draft')).reduce((sum: number, i: Invoice) => sum + i.total_amount, 0).toLocaleString()}`,
      change: "₱0",
      icon: XCircle,
      color: "text-red-600",
    },
    {
      title: "Average Payment Time",
      value: "0 days",
      change: "0 days",
      icon: Clock,
      color: "text-blue-600",
    },
  ]

  const handleExportInvoices = () => {
    if (invoices.length === 0) {
      toast.error("No invoices to export")
      return
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Client,Amount,Status,Issue Date,Due Date\n" +
      invoices.map(i => `${i.invoice_number},${i.client_name},${i.total_amount},${i.status},${i.issue_date},${i.due_date}`).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "invoices.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success("Invoices exported successfully!")
  }

  const handleDateRange = () => {
    toast.info("Date range picker functionality coming soon")
  }

  const handleMoreFilters = () => {
    toast.info("Advanced filters functionality coming soon")
  }

  const handleViewInvoice = (invoiceId: string) => {
    toast.info(`Viewing invoice: ${invoiceId}`)
  }

  const handleEditInvoice = (invoiceId: string) => {
    toast.info(`Editing invoice: ${invoiceId}`)
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice: ${invoiceId}`)
  }

  const handleInvoiceCreated = (newInvoice: Invoice) => {
    setInvoices([newInvoice, ...invoices])
    toast.success("Invoice created successfully!")
  }

  const filteredInvoices = invoices.filter(invoice => 
    invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!currentOrganization) {
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
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportInvoices}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <CreateInvoiceModal onInvoiceCreated={handleInvoiceCreated} />
        </div>
      </div>

      {/* Invoice Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {invoiceMetrics.map((metric) => (
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
                placeholder="Search invoices..." 
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleDateRange}>
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

      {/* Invoices Table */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-full">
                          {getStatusIcon(invoice.status || 'draft')}
                        </div>
                        <div>
                          <p className="font-medium">{invoice.invoice_number}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{invoice.client_name}</span>
                            <span>•</span>
                            <span>Issued: {new Date(invoice.issue_date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className={isOverdue(invoice.due_date, invoice.status || 'draft') ? "text-red-600 font-medium" : ""}>
                              Due: {new Date(invoice.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-lg">
                            ₱{invoice.total_amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.subtotal} + {invoice.tax_amount} tax
                          </p>
                        </div>
                        <Badge className={getStatusColor(invoice.status || 'draft')}>
                          {invoice.status || 'draft'}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(invoice.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditInvoice(invoice.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadInvoice(invoice.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Receipt className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first invoice to get started
                    </p>
                    <CreateInvoiceModal trigger={
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Invoice
                      </Button>
                    } onInvoiceCreated={handleInvoiceCreated} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Draft invoices will be shown here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Sent invoices will be shown here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Paid invoices will be shown here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Overdue invoices will be shown here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 