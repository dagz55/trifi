import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Receipt, 
  Search, 
  Filter, 
  Download,
  Plus,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Send
} from "lucide-react"

const invoices = [
  {
    id: "INV-2024-001",
    client: "BPI Bank",
    clientEmail: "contracts@bpi.com.ph",
    amount: 250000,
    status: "paid",
    dueDate: "2024-01-30",
    issueDate: "2024-01-15",
    items: [
      { description: "Mobile App Development", quantity: 1, rate: 200000, amount: 200000 },
      { description: "API Integration", quantity: 1, rate: 50000, amount: 50000 },
    ],
  },
  {
    id: "INV-2024-002",
    client: "FinTech Solutions Inc",
    clientEmail: "billing@fintechsolutions.ph",
    amount: 180000,
    status: "sent",
    dueDate: "2024-02-15",
    issueDate: "2024-01-20",
    items: [
      { description: "Risk Assessment System", quantity: 1, rate: 180000, amount: 180000 },
    ],
  },
  {
    id: "INV-2024-003",
    client: "Manila Investments Corp",
    clientEmail: "admin@manilainvestments.ph",
    amount: 95000,
    status: "overdue",
    dueDate: "2024-01-10",
    issueDate: "2023-12-15",
    items: [
      { description: "Portfolio Analytics", quantity: 1, rate: 95000, amount: 95000 },
    ],
  },
  {
    id: "INV-2024-004",
    client: "Philippine Commercial Corp",
    clientEmail: "finance@philcommercial.com.ph",
    amount: 320000,
    status: "draft",
    dueDate: "2024-02-28",
    issueDate: "2024-01-25",
    items: [
      { description: "ERP Integration", quantity: 1, rate: 250000, amount: 250000 },
      { description: "Training & Support", quantity: 2, rate: 35000, amount: 70000 },
    ],
  },
]

const invoiceMetrics = [
  {
    title: "Total Outstanding",
    value: "₱845,000",
    change: "-₱125K",
    icon: Receipt,
    color: "text-orange-600",
  },
  {
    title: "Paid This Month",
    value: "₱1,250,000",
    change: "+₱200K",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Overdue",
    value: "₱95,000",
    change: "-₱50K",
    icon: XCircle,
    color: "text-red-600",
  },
  {
    title: "Average Payment Time",
    value: "18 days",
    change: "-2 days",
    icon: Clock,
    color: "text-blue-600",
  },
]

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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
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
              />
            </div>
            <Select defaultValue="all">
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
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline">
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
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-full">
                        {getStatusIcon(invoice.status)}
                      </div>
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{invoice.client}</span>
                          <span>•</span>
                          <span>Issued: {invoice.issueDate}</span>
                          <span>•</span>
                          <span className={isOverdue(invoice.dueDate, invoice.status) ? "text-red-600 font-medium" : ""}>
                            Due: {invoice.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-lg">
                          ₱{invoice.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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