"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddProjectModal } from "@/components/add-project-modal"
import { useAuth } from "@/contexts/auth-context"
import { Project } from "@/lib/database"
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


const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "active":
      return "bg-blue-100 text-blue-800"
    case "on_hold":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-orange-100 text-orange-800"
    case "low":
      return "bg-green-100 text-green-800"
    case "urgent":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ProjectsPage() {
  const { currentOrganization } = useAuth()
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadProjects = async () => {
    if (!currentOrganization) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/projects?organizationId=${currentOrganization.id}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to load projects')
      }

      const { data } = await response.json()
      setProjects(data || [])
    } catch (error) {
      console.error('Error loading projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [currentOrganization])

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update metrics based on actual projects
  const updatedProjectMetrics = [
    {
      title: "Active Projects",
      value: projects.filter((p: Project) => p.status === "active").length.toString(),
      change: projects.length.toString(),
      icon: Folder,
    },
    {
      title: "Total Budget",
      value: "₱" + projects.reduce((sum: number, p: Project) => {
        return sum + (p.budget || 0);
      }, 0).toLocaleString(),
      change: `₱${projects.length * 50000}`,
      icon: DollarSign,
    },
    {
      title: "Team Members",
      value: projects.length.toString(), // TODO: Get actual team member count
      change: projects.length.toString(),
      icon: Users,
    },
    {
      title: "Completion Rate",
      value: projects.length > 0 ? `${Math.round((projects.filter((p: Project) => p.status === "completed").length / projects.length) * 100)}%` : "0%",
      change: `${projects.filter((p: Project) => p.status === "completed").length}`,
      icon: TrendingUp,
    },
  ];

  const handleProjectAdded = (newProject: Project) => {
    setProjects([newProject, ...projects])
    toast.success("Project added successfully!")
  }

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
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-md px-2 py-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline" size="sm" onClick={() => setIsFilterVisible(!isFilterVisible)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Search functionality active")}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <AddProjectModal onProjectAdded={handleProjectAdded} />
        </div>
      </div>

      {isFilterVisible && (
        <div className="p-4 border rounded-md">
          <p>Filter Options</p>
          {/* Add filter options here */}
        </div>
      )}

      {/* Project Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {updatedProjectMetrics.map((metric) => (
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
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(project.status || 'active')}>
                          {project.status || 'active'}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority || 'medium')}>
                          {project.priority || 'medium'}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Project actions for ${project.name}`)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <h4 className="font-medium mb-2">Progress</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>0% Complete</span>
                          <span className="text-muted-foreground">
                            In Progress
                          </span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Budget</h4>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Total:</span>
                          <span className="font-medium">₱{(project.budget || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Spent:</span>
                          <span className="text-muted-foreground">₱{(project.spent || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Timeline</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {project.description && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
            ) : (
              <div className="text-center py-12">
                <Folder className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first project to get started
                </p>
                <AddProjectModal trigger={
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                } onProjectAdded={handleProjectAdded} />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {filteredProjects.filter(p => p.status === "active").map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(project.status || 'active')}>
                          {project.status || 'active'}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority || 'medium')}>
                          {project.priority || 'medium'}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Project actions for ${project.name}`)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>0% Complete</span>
                      <span className="text-muted-foreground">Budget: ₱{(project.budget || 0).toLocaleString()}</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredProjects.filter(p => p.status === "active").length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active projects found</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {filteredProjects.filter(p => p.status === "completed").map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(project.status || 'completed')}>
                          {project.status || 'completed'}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority || 'medium')}>
                          {project.priority || 'medium'}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Project actions for ${project.name}`)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>100% Complete</span>
                      <span className="text-muted-foreground">Budget: ₱{(project.budget || 0).toLocaleString()}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredProjects.filter(p => p.status === "completed").length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No completed projects found</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <div className="grid gap-4">
            {filteredProjects.filter(p => p.status === "on_hold").map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(project.status || 'on_hold')}>
                          {project.status || 'on_hold'}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority || 'medium')}>
                          {project.priority || 'medium'}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Project actions for ${project.name}`)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>0% Complete</span>
                      <span className="text-muted-foreground">Budget: ₱{(project.budget || 0).toLocaleString()}</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredProjects.filter(p => p.status === "on_hold").length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No projects in planning phase found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}