'use client'

import { useEffect, useRef, useState } from 'react'
import { format, isToday, isYesterday } from 'date-fns'
import { MoreHorizontal, Smile, Copy, Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useChatContext } from '@/contexts/chat-context'
import { ChatMessage } from '@/lib/database'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'

interface MessageListProps {
  className?: string
}

export function MessageList({ className }: MessageListProps) {
  const { state, loadMoreMessages, editMessage, deleteMessage, addReaction } = useChatContext()
  const { user } = useAuth()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [state.messages, autoScroll])

  // Check if user is at bottom of scroll area
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 100
    setAutoScroll(isAtBottom)
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) {
      return format(date, 'HH:mm')
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`
    } else {
      return format(date, 'MMM dd, HH:mm')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  if (!state.currentChannel) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Welcome to Chat</h3>
          <p className="text-muted-foreground">
            Select a channel to start messaging
          </p>
        </div>
      </div>
    )
  }

  if (state.loading) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Channel Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold"># {state.currentChannel.name}</h3>
          {state.currentChannel.description && (
            <span className="text-sm text-muted-foreground">
              - {state.currentChannel.description}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {state.members.length} member{state.members.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 p-4"
        onScrollCapture={handleScroll}
      >
        {/* Load More Button */}
        <div className="flex justify-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadMoreMessages}
            disabled={state.loading}
          >
            Load older messages
          </Button>
        </div>

        <div className="space-y-4">
          {state.messages.map((message, index) => {
            const isFirstInGroup = index === 0 || 
              state.messages[index - 1]?.user_id !== message.user_id ||
              new Date(message.created_at || '').getTime() - 
              new Date(state.messages[index - 1]?.created_at || '').getTime() > 300000 // 5 minutes

            return (
              <MessageItem
                key={message.id}
                message={message}
                isFirstInGroup={isFirstInGroup}
                isOwnMessage={message.user_profiles?.clerk_user_id === user?.id}
                onEdit={editMessage}
                onDelete={deleteMessage}
                onReaction={addReaction}
                onCopy={handleCopyMessage}
                formatTime={formatMessageTime}
                getInitials={getInitials}
              />
            )
          })}
        </div>

        <div ref={messagesEndRef} />
      </ScrollArea>
    </div>
  )
}

interface MessageItemProps {
  message: ChatMessage & { 
    user_profiles?: { full_name?: string; avatar_url?: string }; 
    chat_attachments?: { id: string; file_name: string; file_url: string }[]; 
    chat_message_reactions?: { id: string; reaction: string }[] 
  }
  isFirstInGroup: boolean
  isOwnMessage: boolean
  onEdit: (messageId: string, content: string) => void
  onDelete: (messageId: string) => void
  onReaction: (messageId: string, reaction: string) => void
  onCopy: (content: string) => void
  formatTime: (dateString: string) => string
  getInitials: (name: string) => string
}

function MessageItem({
  message,
  isFirstInGroup,
  isOwnMessage,
  onEdit,
  onDelete,
  onReaction,
  onCopy,
  formatTime,
  getInitials
}: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)

  const handleEditSubmit = () => {
    if (editContent.trim() !== message.content) {
      onEdit(message.id, editContent.trim())
    }
    setIsEditing(false)
  }

  const handleEditCancel = () => {
    setEditContent(message.content)
    setIsEditing(false)
  }

  if (message.is_deleted) {
    return (
      <div className="flex items-center space-x-2 text-muted-foreground text-sm italic">
        <span>Message deleted</span>
      </div>
    )
  }

  return (
    <div className={cn(
      "group relative",
      isFirstInGroup ? "mt-4" : "mt-1"
    )}>
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        {isFirstInGroup ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.user_profiles?.avatar_url} />
            <AvatarFallback className="text-xs">
              {getInitials(message.user_profiles?.full_name || 'User')}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
              {formatTime(message.created_at || '').split(' ')[1] || formatTime(message.created_at || '')}
            </span>
          </div>
        )}

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          {isFirstInGroup && (
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-sm">
                {message.user_profiles?.full_name || 'Unknown User'}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTime(message.created_at || '')}
              </span>
              {message.is_edited && (
                <Badge variant="secondary" className="text-xs">
                  edited
                </Badge>
              )}
            </div>
          )}

          {/* Message Body */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleEditSubmit}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleEditCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm break-words">
              {message.content}
            </div>
          )}

          {/* Attachments */}
          {message.chat_attachments && message.chat_attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.chat_attachments.map((attachment) => (
                <div key={attachment.id} className="border rounded p-2 text-sm">
                  <a
                    href={attachment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {attachment.file_name}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Reactions */}
          {message.chat_message_reactions && message.chat_message_reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.chat_message_reactions.map((reaction) => (
                <Badge
                  key={reaction.id}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-secondary/80"
                  onClick={() => onReaction(message.id, reaction.reaction)}
                >
                  {reaction.reaction}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onReaction(message.id, '👍')}>
                <Smile className="h-4 w-4 mr-2" />
                Add Reaction
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCopy(message.content)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isOwnMessage && (
                <>
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(message.id)}
                    className="text-destructive"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}