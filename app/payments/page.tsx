"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { 
  CreditCard, 
  Search, 
  Download,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Banknote
} from "lucide-react"

const payments: any[] = []

const paymentMethods: any[] = []

const paymentMetrics = [
  {
    title: "Total Payments",
    value: "₱0",
    change: "₱0",
    icon: CreditCard,
    color: "text-blue-600",
  },
  {
    title: "Pending Payments",
    value: "₱0",
    change: "₱0",
    icon: Clock,
    color: "text-orange-600",
  },
  {
    title: "Completed",
    value: "₱0",
    change: "₱0",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Payment Methods",
    value: "0",
    change: "0",
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
  const handleExportPayments = () => {
    toast.info("Exporting payment data...")
  }

  const handleNewPayment = () => {
    toast.info("Opening new payment form...")
  }

  const handleAddPaymentMethod = () => {
    toast.info("Opening add payment method form...")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPayments}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleNewPayment}>
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
              <Button size="sm" variant="outline" onClick={handleAddPaymentMethod}>
                <Plus className="mr-2 h-4 w-4" />
                Add Method
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.length > 0 ? (
                  paymentMethods.map((method: any, index: number) => (
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
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">No payment methods added</p>
                    <p className="text-xs text-muted-foreground mt-1">Add a payment method to get started</p>
                  </div>
                )}
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
                {payments.length > 0 ? (
                  payments.map((payment: any) => (
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
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Banknote className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No payments yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first payment to get started
                    </p>
                    <Button onClick={handleNewPayment}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Payment
                    </Button>
                  </div>
                )}
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