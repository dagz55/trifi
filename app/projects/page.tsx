import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Folder, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  Plus,
  Filter,
  Search,
  MoreHorizontal
} from "lucide-react"

const projects = [
  {
    id: 1,
    name: "Mobile Banking App",
    status: "In Progress",
    progress: 75,
    budget: "₱2,500,000",
    spent: "₱1,875,000",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    team: [
      { name: "Ana Cruz", role: "PM" },
      { name: "Carlos Reyes", role: "Dev" },
      { name: "Maria Santos", role: "Design" },
    ],
    priority: "High",
  },
  {
    id: 2,
    name: "Risk Management System",
    status: "Planning",
    progress: 25,
    budget: "₱3,200,000",
    spent: "₱800,000",
    startDate: "2024-03-01",
    endDate: "2024-09-15",
    team: [
      { name: "Luis Garcia", role: "PM" },
      { name: "Sofia Dela Cruz", role: "Dev" },
    ],
    priority: "Medium",
  },
  {
    id: 3,
    name: "Compliance Dashboard",
    status: "Completed",
    progress: 100,
    budget: "₱1,800,000",
    spent: "₱1,650,000",
    startDate: "2023-10-01",
    endDate: "2024-02-28",
    team: [
      { name: "Diego Santos", role: "PM" },
      { name: "Carmen Reyes", role: "Dev" },
      { name: "Roberto Cruz", role: "QA" },
    ],
    priority: "Low",
  },
]

const projectMetrics = [
  {
    title: "Active Projects",
    value: "8",
    change: "+2",
    icon: Folder,
  },
  {
    title: "Total Budget",
    value: "₱15,800,000",
    change: "+₱2.1M",
    icon: DollarSign,
  },
  {
    title: "Team Members",
    value: "24",
    change: "+3",
    icon: Users,
  },
  {
    title: "Completion Rate",
    value: "78%",
    change: "+5%",
    icon: TrendingUp,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800"
    case "In Progress":
      return "bg-blue-100 text-blue-800"
    case "Planning":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800"
    case "Medium":
      return "bg-orange-100 text-orange-800"
    case "Low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Project Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {projectMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <metric.icon className="h-8 w-8 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="mt-2">
                {metric.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <h4 className="font-medium mb-2">Progress</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{project.progress}% Complete</span>
                          <span className="text-muted-foreground">
                            {project.progress === 100 ? "Done" : "In Progress"}
                          </span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Budget</h4>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Total:</span>
                          <span className="font-medium">{project.budget}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Spent:</span>
                          <span className="text-muted-foreground">{project.spent}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Timeline</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{project.startDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{project.endDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Team</h4>
                    <div className="flex items-center gap-2">
                      {project.team.map((member, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium">{member.name}</p>
                            <p className="text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Active projects will be shown here</p>
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Completed projects will be shown here</p>
          </div>
        </TabsContent>

        <TabsContent value="planning">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Projects in planning phase will be shown here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 