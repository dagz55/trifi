import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  UserCheck,
  UserX,
  Crown
} from "lucide-react"

const members = [
  {
    id: 1,
    name: "Maria Santos",
    email: "maria.santos@trifi.ph",
    phone: "+63 917 123 4567",
    role: "CEO",
    department: "Executive",
    status: "active",
    joinDate: "2019-01-15",
    location: "Makati City, PH",
    avatar: "/avatars/maria.jpg",
  },
  {
    id: 2,
    name: "Carlos Reyes",
    email: "carlos.reyes@trifi.ph",
    phone: "+63 917 234 5678",
    role: "CTO",
    department: "Technology",
    status: "active",
    joinDate: "2019-03-20",
    location: "Makati City, PH",
    avatar: "/avatars/carlos.jpg",
  },
  {
    id: 3,
    name: "Ana Cruz",
    email: "ana.cruz@trifi.ph",
    phone: "+63 917 345 6789",
    role: "Head of Operations",
    department: "Operations",
    status: "active",
    joinDate: "2020-06-10",
    location: "Cebu City, PH",
    avatar: "/avatars/ana.jpg",
  },
  {
    id: 4,
    name: "Luis Garcia",
    email: "luis.garcia@trifi.ph",
    phone: "+63 917 456 7890",
    role: "Sales Manager",
    department: "Sales",
    status: "active",
    joinDate: "2021-02-15",
    location: "Davao City, PH",
    avatar: "/avatars/luis.jpg",
  },
  {
    id: 5,
    name: "Sofia Dela Cruz",
    email: "sofia.delacruz@trifi.ph",
    phone: "+63 917 567 8901",
    role: "Senior Developer",
    department: "Technology",
    status: "inactive",
    joinDate: "2022-08-01",
    location: "Makati City, PH",
    avatar: "/avatars/sofia.jpg",
  },
]

const memberMetrics = [
  {
    title: "Total Members",
    value: "156",
    change: "+8",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Members",
    value: "142",
    change: "+5",
    icon: UserCheck,
    color: "text-green-600",
  },
  {
    title: "Inactive Members",
    value: "14",
    change: "+3",
    icon: UserX,
    color: "text-red-600",
  },
  {
    title: "Departments",
    value: "8",
    change: "+1",
    icon: Crown,
    color: "text-purple-600",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "inactive":
      return "bg-red-100 text-red-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getRoleColor = (role: string) => {
  if (role.toLowerCase().includes("ceo") || role.toLowerCase().includes("cto")) {
    return "bg-purple-100 text-purple-800"
  }
  if (role.toLowerCase().includes("head") || role.toLowerCase().includes("manager")) {
    return "bg-blue-100 text-blue-800"
  }
  return "bg-gray-100 text-gray-800"
}

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Member Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {memberMetrics.map((metric) => (
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

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search members..." 
                className="w-full pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <Badge className={getRoleColor(member.role)} variant="secondary">
                      {member.role}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{member.location}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{member.department}</p>
                    <p className="text-sm text-muted-foreground">
                      Joined {member.joinDate}
                    </p>
                  </div>
                  <Badge className={getStatusColor(member.status)}>
                    {member.status}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Message
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 