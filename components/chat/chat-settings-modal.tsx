'use client'

import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Settings, 
  Users, 
  Hash, 
  Lock, 
  Trash2, 
  MoreHorizontal,
  Crown,
  Shield,
  Bell,
  Palette
} from 'lucide-react'
import { useChatContext } from '@/contexts/chat-context'
import { useSettings } from '@/contexts/settings-context'
import { db, ChatChannel } from '@/lib/database'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

interface ChatSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ChannelEditData {
  name: string
  description: string
  type: 'public' | 'private' | 'group'
}

export function ChatSettingsModal({ open, onOpenChange }: ChatSettingsModalProps) {
  const { state, loadChannels, setCurrentChannel } = useChatContext()
  const { userProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('channels')
  const [editingChannel, setEditingChannel] = useState<ChatChannel | null>(null)
  const [channelMembers, setChannelMembers] = useState<Array<{ 
    id: string; 
    user_id: string; 
    role: string; 
    user_profiles?: { 
      full_name?: string; 
      email?: string; 
      avatar_url?: string 
    } 
  }>>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [editData, setEditData] = useState<ChannelEditData>({
    name: '',
    description: '',
    type: 'public'
  })

  // User preferences state
  const [preferences, setPreferences] = useState({
    notifications: true,
    sounds: true,
    theme: 'system',
    fontSize: 'medium'
  })

  const loadChannelMembers = async (channelId: string) => {
    if (!channelId) return

    setLoadingMembers(true)
    try {
      const { data, error } = await db.getChannelMembers(channelId)
      if (error) {
        console.error('Error loading channel members:', error)
        toast.error('Failed to load channel members')
      } else {
        setChannelMembers(data || [])
      }
    } catch (error) {
      console.error('Error loading channel members:', error)
      toast.error('Failed to load channel members')
    } finally {
      setLoadingMembers(false)
    }
  }

  const handleEditChannel = (channel: ChatChannel) => {
    setEditingChannel(channel)
    setEditData({
      name: channel.name,
      description: channel.description || '',
      type: channel.type as 'public' | 'private' | 'group'
    })
    loadChannelMembers(channel.id)
  }

  const handleSaveChannel = async () => {
    if (!editingChannel) return

    try {
      const { error } = await db.updateChatChannel(editingChannel.id, {
        name: editData.name,
        description: editData.description,
        type: editData.type
      })

      if (error) {
        toast.error('Failed to update channel')
        console.error('Error updating channel:', error)
      } else {
        toast.success('Channel updated successfully')
        setEditingChannel(null)
        loadChannels()
      }
    } catch (error) {
      toast.error('Failed to update channel')
      console.error('Error updating channel:', error)
    }
  }

  const handleDeleteChannel = async (channel: ChatChannel) => {
    if (!confirm(`Are you sure you want to delete #${channel.name}? This action cannot be undone.`)) {
      return
    }

    try {
      const { error } = await db.deleteChatChannel(channel.id)
      if (error) {
        toast.error('Failed to delete channel')
        console.error('Error deleting channel:', error)
      } else {
        toast.success('Channel deleted successfully')
        // If we're currently in the deleted channel, clear it
        if (state.currentChannel?.id === channel.id) {
          setCurrentChannel(null)
        }
        loadChannels()
      }
    } catch (error) {
      toast.error('Failed to delete channel')
      console.error('Error deleting channel:', error)
    }
  }

  const handleRemoveMember = async (channelId: string, userId: string, memberName: string) => {
    try {
      const { error } = await db.removeChannelMember(channelId, userId)
      if (error) {
        toast.error('Failed to remove member')
        console.error('Error removing member:', error)
      } else {
        toast.success(`${memberName} removed from channel`)
        loadChannelMembers(channelId)
      }
    } catch (error) {
      toast.error('Failed to remove member')
      console.error('Error removing member:', error)
    }
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'public': return <Hash className="h-4 w-4" />
      case 'private': return <Lock className="h-4 w-4" />
      case 'group': return <Users className="h-4 w-4" />
      default: return <Hash className="h-4 w-4" />
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-3 w-3 text-yellow-600" />
      case 'moderator': return <Shield className="h-3 w-3 text-blue-600" />
      default: return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Chat Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-hidden">
            {/* Channels Management */}
            <TabsContent value="channels" className="space-y-4">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {state.channels.map((channel) => (
                    <Card key={channel.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getChannelIcon(channel.type)}
                            <div>
                              <h3 className="font-medium">{channel.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {channel.description || 'No description'}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {channel.type}
                                </Badge>
                                {channel.created_at && (
                                  <span className="text-xs text-muted-foreground">
                                    Created {new Date(channel.created_at).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditChannel(channel)}>
                                Edit Channel
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteChannel(channel)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Channel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {state.channels.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium mb-2">No channels yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Create your first channel to start chatting
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Members Management */}
            <TabsContent value="members" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Channel Members</h3>
                <Select 
                  value={editingChannel?.id || ''} 
                  onValueChange={(channelId) => {
                    const channel = state.channels.find(c => c.id === channelId)
                    if (channel) handleEditChannel(channel)
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select a channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.channels.map((channel) => (
                      <SelectItem key={channel.id} value={channel.id}>
                        <div className="flex items-center space-x-2">
                          {getChannelIcon(channel.type)}
                          <span>{channel.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[450px] pr-4">
                {editingChannel ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          {getChannelIcon(editingChannel.type)}
                          <span>#{editingChannel.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loadingMembers ? (
                          <div className="text-center py-8">
                            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">Loading members...</p>
                          </div>
                        ) : channelMembers.length > 0 ? (
                          <div className="space-y-3">
                            {channelMembers.map((member) => (
                              <div key={member.id} className="flex items-center justify-between p-2 rounded border">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={member.user_profiles?.avatar_url} />
                                    <AvatarFallback>
                                      {member.user_profiles?.full_name?.slice(0, 2).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium">
                                        {member.user_profiles?.full_name || 'Unknown User'}
                                      </span>
                                      {getRoleIcon(member.role)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {member.user_profiles?.email}
                                    </p>
                                  </div>
                                </div>
                                
                                {member.user_id !== userProfile?.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveMember(
                                      editingChannel.id, 
                                      member.user_id, 
                                      member.user_profiles?.full_name || 'User'
                                    )}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-medium mb-2">No members found</h3>
                            <p className="text-sm text-muted-foreground">
                              This channel doesn&apos;t have any members yet
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Select a channel</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose a channel above to view and manage its members
                      </p>
                    </CardContent>
                  </Card>
                )}
              </ScrollArea>
            </TabsContent>

            {/* User Preferences */}
            <TabsContent value="preferences" className="space-y-4">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {/* Notifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Bell className="h-5 w-5" />
                        <span>Notifications</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="notifications">Enable notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications for new messages
                          </p>
                        </div>
                        <Switch
                          id="notifications"
                          checked={preferences.notifications}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({ ...prev, notifications: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sounds">Sound alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Play sound when receiving messages
                          </p>
                        </div>
                        <Switch
                          id="sounds"
                          checked={preferences.sounds}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({ ...prev, sounds: checked }))
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Appearance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Palette className="h-5 w-5" />
                        <span>Appearance</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <Select 
                          value={preferences.theme} 
                          onValueChange={(value) => 
                            setPreferences(prev => ({ ...prev, theme: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Font size</Label>
                        <Select 
                          value={preferences.fontSize} 
                          onValueChange={(value) => 
                            setPreferences(prev => ({ ...prev, fontSize: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>

        {/* Edit Channel Modal */}
        {editingChannel && (
          <Dialog open={!!editingChannel} onOpenChange={() => setEditingChannel(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Channel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Channel Name</Label>
                  <Input
                    id="edit-name"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter channel name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter channel description"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Channel Type</Label>
                  <Select 
                    value={editData.type} 
                    onValueChange={(value: 'public' | 'private' | 'group') => setEditData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingChannel(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChannel}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}