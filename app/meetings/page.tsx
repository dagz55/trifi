import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Video, 
  Calendar, 
  Clock,
  Users,
  Plus,
  MapPin,
  ExternalLink
} from "lucide-react"

const meetings = [
  {
    id: 1,
    title: "Quarterly Financial Review",
    date: "2024-01-25",
    time: "10:00 AM - 11:30 AM",
    type: "In-person",
    location: "Conference Room A",
    attendees: ["Maria Santos", "Carlos Reyes", "Ana Cruz"],
    status: "upcoming",
  },
  {
    id: 2,
    title: "Product Development Sync",
    date: "2024-01-25",
    time: "2:00 PM - 3:00 PM",
    type: "Video Call",
    location: "Zoom Meeting",
    attendees: ["Carlos Reyes", "Sofia Dela Cruz", "Luis Garcia"],
    status: "upcoming",
  },
  {
    id: 3,
    title: "Client Presentation - BPI Bank",
    date: "2024-01-26",
    time: "9:00 AM - 10:00 AM",
    type: "Video Call",
    location: "Microsoft Teams",
    attendees: ["Maria Santos", "Ana Cruz"],
    status: "upcoming",
  },
  {
    id: 4,
    title: "Weekly Team Standup",
    date: "2024-01-24",
    time: "9:00 AM - 9:30 AM",
    type: "Video Call",
    location: "Google Meet",
    attendees: ["Carlos Reyes", "Sofia Dela Cruz", "Diego Morales"],
    status: "completed",
  },
]

const meetingMetrics = [
  {
    title: "This Week",
    value: "8",
    change: "+2",
    icon: Calendar,
  },
  {
    title: "Today",
    value: "3",
    change: "+1",
    icon: Clock,
  },
  {
    title: "Participants",
    value: "24",
    change: "+5",
    icon: Users,
  },
  {
    title: "Video Calls",
    value: "6",
    change: "+3",
    icon: Video,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "Video Call":
      return "bg-purple-100 text-purple-800"
    case "In-person":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>

      {/* Meeting Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {meetingMetrics.map((metric) => (
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

      {/* Meetings List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetings.filter(m => m.status === 'upcoming').map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-full">
                    {meeting.type === "Video Call" ? (
                      <Video className="h-4 w-4 text-blue-600" />
                    ) : (
                      <MapPin className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{meeting.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{meeting.date}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{meeting.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {meeting.attendees.slice(0, 3).map((attendee, index) => (
                        <Avatar key={index} className="h-8 w-8 border-2 border-background">
                          <AvatarFallback className="text-xs">
                            {attendee.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {meeting.attendees.length > 3 && (
                        <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs font-medium">+{meeting.attendees.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge className={getTypeColor(meeting.type)}>
                      {meeting.type}
                    </Badge>
                    <Badge className={getStatusColor(meeting.status)}>
                      {meeting.status}
                    </Badge>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Meetings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetings.filter(m => m.status === 'completed').map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-full">
                    {meeting.type === "Video Call" ? (
                      <Video className="h-4 w-4 text-blue-600" />
                    ) : (
                      <MapPin className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{meeting.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{meeting.date}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{meeting.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(meeting.status)}>
                    {meeting.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Recording
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 