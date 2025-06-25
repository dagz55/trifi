"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  MessagesSquare, 
  Send, 
  Plus,
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Users,
  MessageCircle
} from "lucide-react"

// Empty arrays for clean state
const conversations: any[] = []
const messages: any[] = []

export default function ChatPage() {
  const [newMessage, setNewMessage] = useState("")

  const handleNewChat = () => {
    toast.info("Opening new chat dialog...")
  }

  const handleStartChatting = () => {
    toast.info("Starting new conversation...")
  }

  const handleVideoCall = () => {
    toast.info("Starting video call...")
  }

  const handleVoiceCall = () => {
    toast.info("Starting voice call...")
  }

  const handleChatOptions = () => {
    toast.info("Opening chat options...")
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      toast.success(`Message sent: ${newMessage}`)
      setNewMessage("")
    } else {
      toast.error("Please enter a message")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Chat</h1>
        <Button onClick={handleNewChat}>
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
              {conversations.length > 0 ? (
                <div className="space-y-2">
                  {conversations.map((conversation: any) => (
                    <div key={conversation.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {conversation.name.split(' ').map((n: string) => n[0]).join('')}
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
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-muted-foreground mb-2">No Conversations</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start a new conversation to connect with your team.
                  </p>
                  <Button size="sm" className="flex items-center gap-2" onClick={handleStartChatting}>
                    <Plus className="h-4 w-4" />
                    Start Chatting
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            {conversations.length > 0 ? (
              <>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>--</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Select a conversation</p>
                      <p className="text-sm text-muted-foreground">Choose a chat to view messages</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleVoiceCall}>
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleVideoCall}>
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleChatOptions}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                    {messages.map((message: any) => (
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
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="p-6 rounded-full bg-muted/50 mb-6">
                  <MessageCircle className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-muted-foreground mb-3">Welcome to Chat</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Connect with your team members, share ideas, and collaborate in real-time. Start your first conversation to get started.
                </p>
                <div className="space-y-3">
                  <Button className="flex items-center gap-2" onClick={handleStartChatting}>
                    <Plus className="h-4 w-4" />
                    Start Your First Chat
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    or invite team members to join your workspace
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
} 