'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Smile, AtSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChatContext } from '@/contexts/chat-context'
import { cn } from '@/lib/utils'

interface MessageInputProps {
  className?: string
}

export function MessageInput({ className }: MessageInputProps) {
  const { state, sendMessage, startTyping, stopTyping } = useChatContext()
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || !state.currentChannel || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    try {
      await sendMessage(message.trim())
      setMessage('')
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }

    // Typing indicators
    if (state.currentChannel) {
      if (value.trim()) {
        startTyping(state.currentChannel.id)
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
        
        // Stop typing after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          stopTyping(state.currentChannel!.id)
        }, 3000)
      } else {
        stopTyping(state.currentChannel.id)
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
      }
    }
  }

  const handleFileUpload = () => {
    // TODO: Implement file upload
    console.log('File upload not implemented yet')
  }

  const handleEmojiPicker = () => {
    // TODO: Implement emoji picker
    console.log('Emoji picker not implemented yet')
  }

  const handleMentions = () => {
    // TODO: Implement mentions
    console.log('Mentions not implemented yet')
  }

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  if (!state.currentChannel) {
    return null
  }

  return (
    <div className={cn("border-t bg-background p-4", className)}>
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Typing Indicators */}
        {Object.entries(state.typingUsers).map(([channelId, users]) => {
          if (channelId === state.currentChannel?.id && users.length > 0) {
            return (
              <div key={channelId} className="text-sm text-muted-foreground italic">
                {users.length === 1 
                  ? `${users[0]} is typing...`
                  : users.length === 2
                  ? `${users[0]} and ${users[1]} are typing...`
                  : `${users[0]} and ${users.length - 1} others are typing...`
                }
              </div>
            )
          }
          return null
        })}

        {/* Input Area */}
        <div className="flex items-end space-x-2">
          {/* Action Buttons */}
          <div className="flex space-x-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleFileUpload}
              className="h-8 w-8"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleEmojiPicker}
              className="h-8 w-8"
            >
              <Smile className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleMentions}
              className="h-8 w-8"
            >
              <AtSign className="h-4 w-4" />
            </Button>
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${state.currentChannel.name}`}
              disabled={isSubmitting}
              className="min-h-[40px] max-h-[120px] resize-none pr-12"
              rows={1}
            />
            
            {/* Send Button */}
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || isSubmitting}
              className="absolute right-2 bottom-2 h-6 w-6"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Helper Text */}
        <div className="text-xs text-muted-foreground">
          Press <kbd className="px-1 py-0.5 bg-muted rounded">Enter</kbd> to send, 
          <kbd className="px-1 py-0.5 bg-muted rounded ml-1">Shift + Enter</kbd> for new line
        </div>
      </form>
    </div>
  )
}