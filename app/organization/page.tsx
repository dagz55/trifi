import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Edit,
  Plus,
  TrendingUp,
  DollarSign
} from "lucide-react"

const organizationData = {
  name: "TriFi Corporation",
  type: "Financial Technology",
  location: "Makati City, Philippines",
  phone: "+63 2 8123 4567",
  email: "info@trifi.ph",
  website: "https://trifi.ph",
  employees: 156,
  revenue: "₱45,000,000",
  founded: "2019",
}

const departments = [
  {
    name: "Finance",
    head: "Maria Santos",
    employees: 12,
    budget: "₱2,500,000",
    performance: 92,
  },
  {
    name: "Technology",
    head: "Carlos Reyes",
    employees: 35,
    budget: "₱8,000,000",
    performance: 88,
  },
  {
    name: "Operations",
    head: "Ana Cruz",
    employees: 28,
    budget: "₱3,200,000",
    performance: 85,
  },
  {
    name: "Sales",
    head: "Luis Garcia",
    employees: 22,
    budget: "₱4,100,000",
    performance: 90,
  },
]

const metrics = [
  {
    title: "Total Revenue",
    value: "₱45,000,000",
    change: "+12.5%",
    icon: DollarSign,
  },
  {
    title: "Total Employees",
    value: "156",
    change: "+8.2%",
    icon: Users,
  },
  {
    title: "Office Locations",
    value: "4",
    change: "+1",
    icon: Building2,
  },
  {
    title: "Growth Rate",
    value: "23.8%",
    change: "+2.1%",
    icon: TrendingUp,
  },
]

export default function OrganizationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit Details
        </Button>
      </div>

      {/* Organization Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-lg mb-4">{organizationData.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{organizationData.type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{organizationData.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{organizationData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{organizationData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>{organizationData.website}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric) => (
                <div key={metric.title} className="text-center p-4 bg-muted rounded-lg">
                  <metric.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.title}</div>
                  <Badge variant="secondary" className="mt-1">
                    {metric.change}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Departments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Departments</CardTitle>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {departments.map((dept) => (
              <Card key={dept.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{dept.name}</h4>
                    <Badge variant="outline">{dept.employees} employees</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {dept.head.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{dept.head}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Budget: </span>
                      <span className="font-medium">{dept.budget}</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Performance</span>
                        <span className="font-medium">{dept.performance}%</span>
                      </div>
                      <Progress value={dept.performance} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 