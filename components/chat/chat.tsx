'use client'

import { ChatProvider } from '@/contexts/chat-context'
import { ChatSidebar } from './chat-sidebar'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'
import { cn } from '@/lib/utils'

interface ChatProps {
  className?: string
}

export function Chat({ className }: ChatProps) {
  return (
    <ChatProvider>
      <div className={cn("flex h-full", className)}>
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <ChatSidebar />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <MessageList className="flex-1" />
          <MessageInput />
        </div>
      </div>
    </ChatProvider>
  )
}