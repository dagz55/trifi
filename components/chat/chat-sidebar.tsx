'use client'

import { useState } from 'react'
import { Plus, Hash, Lock, Users, Search, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatContext } from '@/contexts/chat-context'
import { CreateChannelModal } from './create-channel-modal'
import { ChatSettingsModal } from './chat-settings-modal'
import { ChatChannel } from '@/lib/database'
import { cn } from '@/lib/utils'

interface ChatSidebarProps {
  className?: string
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  const { state, setCurrentChannel } = useChatContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const filteredChannels = state.channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const publicChannels = filteredChannels.filter(channel => channel.type === 'public')
  const privateChannels = filteredChannels.filter(channel => channel.type === 'private')
  const directChannels = filteredChannels.filter(channel => channel.type === 'direct')

  const handleChannelClick = (channel: ChatChannel) => {
    setCurrentChannel(channel)
  }

  const getChannelIcon = (channel: ChatChannel) => {
    switch (channel.type) {
      case 'public':
        return <Hash className="h-4 w-4" />
      case 'private':
        return <Lock className="h-4 w-4" />
      case 'direct':
        return <Users className="h-4 w-4" />
      default:
        return <Hash className="h-4 w-4" />
    }
  }

  return (
    <div className={cn("flex flex-col h-full bg-background border-r", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chat</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCreateModal(true)}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Channel List */}
      <ScrollArea className="flex-1 p-2">
        {/* Public Channels */}
        {publicChannels.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between px-2 py-1 mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Public Channels
              </span>
              <Badge variant="secondary" className="text-xs">
                {publicChannels.length}
              </Badge>
            </div>
            <div className="space-y-1">
              {publicChannels.map(channel => (
                <ChannelItem
                  key={channel.id}
                  channel={channel}
                  isActive={state.currentChannel?.id === channel.id}
                  unreadCount={state.unreadCounts[channel.id] || 0}
                  onClick={() => handleChannelClick(channel)}
                  icon={getChannelIcon(channel)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Private Channels */}
        {privateChannels.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between px-2 py-1 mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Private Channels
              </span>
              <Badge variant="secondary" className="text-xs">
                {privateChannels.length}
              </Badge>
            </div>
            <div className="space-y-1">
              {privateChannels.map(channel => (
                <ChannelItem
                  key={channel.id}
                  channel={channel}
                  isActive={state.currentChannel?.id === channel.id}
                  unreadCount={state.unreadCounts[channel.id] || 0}
                  onClick={() => handleChannelClick(channel)}
                  icon={getChannelIcon(channel)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Direct Messages */}
        {directChannels.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between px-2 py-1 mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Direct Messages
              </span>
              <Badge variant="secondary" className="text-xs">
                {directChannels.length}
              </Badge>
            </div>
            <div className="space-y-1">
              {directChannels.map(channel => (
                <ChannelItem
                  key={channel.id}
                  channel={channel}
                  isActive={state.currentChannel?.id === channel.id}
                  unreadCount={state.unreadCounts[channel.id] || 0}
                  onClick={() => handleChannelClick(channel)}
                  icon={getChannelIcon(channel)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredChannels.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No channels found</p>
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start"
          onClick={() => setShowSettingsModal(true)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Chat Settings
        </Button>
      </div>

      {/* Modals */}
      <CreateChannelModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
      
      <ChatSettingsModal
        open={showSettingsModal}
        onOpenChange={setShowSettingsModal}
      />
    </div>
  )
}

interface ChannelItemProps {
  channel: ChatChannel
  isActive: boolean
  unreadCount: number
  onClick: () => void
  icon: React.ReactNode
}

function ChannelItem({ channel, isActive, unreadCount, onClick, icon }: ChannelItemProps) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start px-2 py-1.5 h-auto",
        isActive && "bg-accent"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 min-w-0">
          {icon}
          <span className="truncate text-sm">
            {channel.name}
          </span>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-xs h-5 min-w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </div>
    </Button>
  )
}