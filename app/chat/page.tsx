import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  MessagesSquare, 
  Send, 
  Plus,
  Search,
  Phone,
  Video,
  MoreHorizontal
} from "lucide-react"

const conversations = [
  {
    id: 1,
    name: "Maria Santos",
    lastMessage: "Let's schedule the quarterly review meeting",
    time: "2m ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Finance Team",
    lastMessage: "Budget approval documents are ready",
    time: "1h ago",
    unread: 0,
    online: false,
    isGroup: true,
  },
  {
    id: 3,
    name: "Carlos Reyes",
    lastMessage: "The new API integration is working perfectly",
    time: "3h ago",
    unread: 1,
    online: true,
  },
]

const messages = [
  {
    id: 1,
    sender: "Maria Santos",
    message: "Good morning! How's the progress on the mobile app?",
    time: "9:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    message: "Morning Maria! We're making great progress. The authentication module is complete and we're working on the dashboard now.",
    time: "9:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Maria Santos",
    message: "Excellent! When do you think we'll have a beta version ready for testing?",
    time: "9:35 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "You",
    message: "I estimate we'll have a working beta by next Friday. I'll keep you updated on our progress.",
    time: "9:37 AM",
    isOwn: true,
  },
]

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Chat</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessagesSquare className="h-5 w-5" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search conversations..." 
                  className="w-full pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div key={conversation.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {conversation.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{conversation.name}</p>
                        <span className="text-xs text-muted-foreground">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Maria Santos</p>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${message.isOwn ? 'order-1' : 'order-2'}`}>
                      <div className={`p-3 rounded-lg ${
                        message.isOwn 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-3">
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input 
                  placeholder="Type your message..." 
                  className="flex-1"
                />
                <Button>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 