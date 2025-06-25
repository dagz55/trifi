"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { 
  Video, 
  Calendar, 
  Clock,
  Users,
  Plus,
  MapPin,
  ExternalLink
} from "lucide-react"

const meetings: any[] = []

const meetingMetrics = [
  {
    title: "This Week",
    value: "0",
    change: "0",
    icon: Calendar,
  },
  {
    title: "Today",
    value: "0",
    change: "0",
    icon: Clock,
  },
  {
    title: "Participants",
    value: "0",
    change: "0",
    icon: Users,
  },
  {
    title: "Video Calls",
    value: "0",
    change: "0",
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
  const handleScheduleMeeting = () => {
    toast.info("Opening meeting scheduler...")
  }

  const handleJoinMeeting = (meetingTitle: string) => {
    toast.info(`Joining meeting: ${meetingTitle}`)
  }

  const handleViewRecording = (meetingTitle: string) => {
    toast.info(`Opening recording for: ${meetingTitle}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
        <Button onClick={handleScheduleMeeting}>
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
                      {meeting.attendees.slice(0, 3).map((attendee: string, index: number) => (
                        <Avatar key={index} className="h-8 w-8 border-2 border-background">
                          <AvatarFallback className="text-xs">
                            {attendee.split(' ').map((n: string) => n[0]).join('')}
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
                  
                  <Button variant="outline" size="sm" onClick={() => handleJoinMeeting(meeting.title)}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Join
                  </Button>
                </div>
              </div>
            ))}
            {meetings.filter(m => m.status === 'upcoming').length === 0 && (
              <div className="text-center py-8">
                <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No upcoming meetings</h3>
                <p className="text-muted-foreground mb-4">
                  Schedule your first meeting to get started
                </p>
                <Button onClick={handleScheduleMeeting}>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
              </div>
            )}
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
                  <Button variant="outline" size="sm" onClick={() => handleViewRecording(meeting.title)}>
                    View Recording
                  </Button>
                </div>
              </div>
            ))}
            {meetings.filter(m => m.status === 'completed').length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No completed meetings yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 