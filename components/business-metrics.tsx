"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Users, Target, ArrowRight, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const metrics = [
  {
    id: 1,
    title: "Revenue Growth",
    subtitle: "Set your quarterly revenue target",
    icon: TrendingUp,
    status: "Not Set",
    progress: 0,
    current: 0,
    target: 0,
    unit: "₱",
    description: "Track your revenue progress against quarterly goals"
  },
  {
    id: 2,
    title: "Customer Acquisition",
    subtitle: "Set your customer acquisition goal",
    icon: Users,
    status: "Not Set",
    progress: 0,
    current: 0,
    target: 0,
    unit: "",
    description: "Monitor new customer growth month over month"
  },
  {
    id: 3,
    title: "Cost Reduction",
    subtitle: "Set your cost optimization target",
    icon: TrendingDown,
    status: "Not Set",
    progress: 0,
    current: 0,
    target: 0,
    unit: "₱",
    description: "Track operational cost savings and efficiency gains"
  },
  {
    id: 4,
    title: "Project Completion",
    subtitle: "Set your project delivery targets",
    icon: Target,
    status: "Not Set",
    progress: 0,
    current: 0,
    target: 0,
    unit: "",
    description: "Monitor project completion rates and deadlines"
  },
]

const statusColors: Record<string, string> = {
  "Not Set": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  "On Track": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Behind: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Ahead: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}

export function BusinessMetrics() {
  const router = useRouter()

  const handleViewDetails = () => {
    router.push("/analytics")
  }

  const handleSetTarget = (metricName: string) => {
    toast.info(`Setting up target for ${metricName}...`)
  }

  const handleSetUpMetrics = () => {
    toast.info("Opening metrics setup wizard...")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Business Metrics</h2>
        <Button variant="outline" size="sm" onClick={handleViewDetails}>
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-dashed">
        <div className="text-center space-y-2">
          <h3 className="font-medium text-muted-foreground">No Business Metrics Set</h3>
          <p className="text-sm text-muted-foreground">Start tracking your business performance by setting up your key metrics and targets.</p>
          <Button size="sm" className="mt-2" onClick={handleSetUpMetrics}>
            <Plus className="mr-2 h-4 w-4" />
            Set Up Metrics
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full ${statusColors[metric.status]}`}>{metric.status}</span>
                  <span className="text-muted-foreground">
                    {metric.unit}0 / {metric.unit}0
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div
                    className="bg-muted h-1.5 rounded-full"
                    style={{ width: "0%" }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-muted-foreground">
                    No target set
                  </span>
                  <span className="text-muted-foreground">0% complete</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-2">{metric.description}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => handleSetTarget(metric.title)}
                >
                  Set Target
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
