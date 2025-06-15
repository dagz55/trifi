import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download,
  Plus,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Smartphone,
  Building,
  Banknote
} from "lucide-react"

const payments = [
  {
    id: "PAY-2024-001",
    recipient: "Office Supplies Inc.",
    amount: 45000,
    method: "Bank Transfer",
    status: "completed",
    date: "2024-01-20",
    category: "Office Expenses",
    reference: "OS-INV-2024-15",
  },
  {
    id: "PAY-2024-002",
    recipient: "Software Licensing Co.",
    amount: 125000,
    method: "Credit Card",
    status: "completed",
    date: "2024-01-18",
    category: "Software & Tools",
    reference: "LIC-ANNUAL-2024",
  },
  {
    id: "PAY-2024-003",
    recipient: "Marketing Agency SA",
    amount: 85000,
    method: "Digital Wallet",
    status: "pending",
    date: "2024-01-22",
    category: "Marketing",
    reference: "MKT-CAM-Q1-2024",
  },
  {
    id: "PAY-2024-004",
    recipient: "Cloud Services Provider",
    amount: 32000,
    method: "Automatic Debit",
    status: "scheduled",
    date: "2024-01-25",
    category: "Infrastructure",
    reference: "CLOUD-SUB-JAN24",
  },
]

const paymentMethods = [
  {
    type: "Bank Transfer",
    account: "****1234",
    bank: "Banco Nacional",
    isDefault: true,
    icon: Building,
  },
  {
    type: "Credit Card",
    account: "****5678",
    bank: "Visa",
    isDefault: false,
    icon: CreditCard,
  },
  {
    type: "Digital Wallet",
    account: "wallet@trifi.mx",
    bank: "TriFi Wallet",
    isDefault: false,
    icon: Smartphone,
  },
]

const paymentMetrics = [
  {
    title: "Total Payments",
    value: "₱2,850,000",
    change: "+₱350K",
    icon: CreditCard,
    color: "text-blue-600",
  },
  {
    title: "Pending Payments",
    value: "₱185,000",
    change: "+₱25K",
    icon: Clock,
    color: "text-orange-600",
  },
  {
    title: "Completed",
    value: "₱2,665,000",
    change: "+₱325K",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Payment Methods",
    value: "5",
    change: "+1",
    icon: Banknote,
    color: "text-purple-600",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "scheduled":
      return "bg-blue-100 text-blue-800"
    case "failed":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "scheduled":
      return <Calendar className="h-4 w-4 text-blue-600" />
    case "failed":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <CreditCard className="h-4 w-4" />
  }
}

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Payment
          </Button>
        </div>
      </div>

      {/* Payment Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {paymentMetrics.map((metric) => (
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment Methods */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment Methods</CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Method
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        <method.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{method.type}</p>
                        <p className="text-xs text-muted-foreground">{method.account}</p>
                        <p className="text-xs text-muted-foreground">{method.bank}</p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search payments..." 
                    className="w-full pl-10"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-full">
                        {getStatusIcon(payment.status)}
                      </div>
                      <div>
                        <p className="font-medium">{payment.recipient}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{payment.method}</span>
                          <span>•</span>
                          <span>{payment.date}</span>
                          <span>•</span>
                          <span>{payment.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-lg">
                          ₱{payment.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.reference}
                        </p>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">All payment details are shown above</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Completed payments will be shown here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Pending payments will be shown here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Scheduled payments will be shown here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 