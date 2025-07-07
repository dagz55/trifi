'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'
import { db } from '@/lib/database'
import { ChatChannel, ChatMessage, ChatChannelMember } from '@/lib/database'
import { getSupabaseClient } from '@/lib/supabase'
import { useSettings } from './settings-context'
import { toast } from 'sonner'

interface ChatState {
  channels: ChatChannel[]
  currentChannel: ChatChannel | null
  messages: ChatMessage[]
  members: ChatChannelMember[]
  loading: boolean
  error: string | null
  unreadCounts: Record<string, number>
  typingUsers: Record<string, string[]>
  onlineUsers: string[]
}

interface ChatContextType {
  // State
  state: ChatState
  
  // Channel operations
  setCurrentChannel: (channel: ChatChannel | null) => void
  loadChannels: () => Promise<void>
  createChannel: (data: Partial<ChatChannel>) => Promise<void>
  updateChannel: (channelId: string, updates: Partial<ChatChannel>) => Promise<void>
  deleteChannel: (channelId: string) => Promise<void>
  
  // Message operations
  sendMessage: (content: string, messageType?: string, metadata?: any) => Promise<void>
  editMessage: (messageId: string, content: string) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
  loadMoreMessages: () => Promise<void>
  
  // Member operations
  addMember: (channelId: string, userId: string) => Promise<void>
  removeMember: (channelId: string, userId: string) => Promise<void>
  
  // Utility operations
  markAsRead: (channelId: string) => Promise<void>
  searchMessages: (query: string) => Promise<ChatMessage[]>
  
  // Typing indicators
  startTyping: (channelId: string) => void
  stopTyping: (channelId: string) => void
  
  // Reactions
  addReaction: (messageId: string, reaction: string) => Promise<void>
  removeReaction: (messageId: string, reaction: string) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

interface ChatProviderProps {
  children: ReactNode
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { user } = useUser()
  const { organizationData } = useSettings()
  
  const [state, setState] = useState<ChatState>({
    channels: [],
    currentChannel: null,
    messages: [],
    members: [],
    loading: false,
    error: null,
    unreadCounts: {},
    typingUsers: {},
    onlineUsers: []
  })

  const [userProfile, setUserProfile] = useState<any>(null)
  const [messagesOffset, setMessagesOffset] = useState(0)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)

  // Initialize user profile and channels
  useEffect(() => {
    if (user && organizationData?.id) {
      initializeChat()
    }
  }, [user, organizationData])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user || !organizationData?.id) return

    const supabase = getSupabaseClient()
    const subscriptions: any[] = []

    // Subscribe to channel changes
    const channelSubscription = supabase
      .channel('chat_channels')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_channels',
        filter: `organization_id=eq.${organizationData.id}`
      }, handleChannelChange)
      .subscribe()

    // Subscribe to message changes
    const messageSubscription = supabase
      .channel('chat_messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_messages'
      }, handleMessageChange)
      .subscribe()

    // Subscribe to member changes
    const memberSubscription = supabase
      .channel('chat_channel_members')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_channel_members'
      }, handleMemberChange)
      .subscribe()

    subscriptions.push(channelSubscription, messageSubscription, memberSubscription)

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe())
    }
  }, [user, organizationData])

  // Subscribe to current channel messages
  useEffect(() => {
    if (!state.currentChannel || !user) return

    const supabase = getSupabaseClient()
    
    const subscription = supabase
      .channel(`messages_${state.currentChannel.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `channel_id=eq.${state.currentChannel.id}`
      }, handleNewMessage)
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [state.currentChannel, user])

  const initializeChat = async () => {
    console.log('🔄 Chat initialization starting...', {
      hasUser: !!user,
      userId: user?.id,
      hasOrgData: !!organizationData?.id,
      orgId: organizationData?.id
    })

    if (!user || !organizationData?.id) {
      console.log('❌ Chat initialization skipped - missing user or organization data:', { 
        hasUser: !!user, 
        hasOrgData: !!organizationData?.id 
      })
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      console.log('🔍 Getting user profile for:', user.id)
      // Get or create user profile
      let { data: profile, error: profileError } = await db.getUserProfile(user.id)
      
      console.log('👤 User profile result:', { profile, profileError })
      
      if (profileError || !profile) {
        console.log('🆕 User profile not found, creating new profile for user:', user.id)
        // Create user profile if it doesn't exist
        const { data: newProfile, error: createError } = await db.createUserProfile({
          clerk_user_id: user.id,
          full_name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
          email: user.primaryEmailAddress?.emailAddress,
          avatar_url: user.imageUrl
        })
        
        console.log('🆕 User profile creation result:', { newProfile, createError })
        
        if (createError) {
          throw new Error(`Failed to create user profile: ${createError}`)
        }
        profile = newProfile
      }

      setUserProfile(profile)

      if (profile) {
        // Load user channels
        const { data: userChannels, error: channelsError } = await db.getUserChannels(profile.id)
        
        if (channelsError) {
          console.error('Error loading user channels:', channelsError)
          setState(prev => ({ ...prev, channels: [] }))
        } else {
          const channels = userChannels?.map(uc => uc.chat_channels).filter(Boolean) || []
          setState(prev => ({ ...prev, channels }))

          // Load unread counts for all channels
          const unreadCounts: Record<string, number> = {}
          for (const channel of channels) {
            try {
              const { data: count } = await db.getUnreadMessageCount(profile.id, channel.id)
              unreadCounts[channel.id] = count || 0
            } catch (error) {
              console.error(`Error loading unread count for channel ${channel.id}:`, error)
              unreadCounts[channel.id] = 0
            }
          }
          setState(prev => ({ ...prev, unreadCounts }))
        }
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error)
      setState(prev => ({ ...prev, error: `Failed to initialize chat: ${error}` }))
      toast.error('Failed to initialize chat system')
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const setCurrentChannel = async (channel: ChatChannel | null) => {
    setState(prev => ({ ...prev, currentChannel: channel, messages: [], members: [] }))
    setMessagesOffset(0)
    setHasMoreMessages(true)

    if (!channel || !userProfile) return

    try {
      // Load channel messages
      const { data: messages } = await db.getChatMessages(channel.id, 50, 0)
      setState(prev => ({ ...prev, messages: messages?.reverse() || [] }))

      // Load channel members
      const { data: members } = await db.getChannelMembers(channel.id)
      setState(prev => ({ ...prev, members: members || [] }))

      // Mark channel as read
      await markAsRead(channel.id)
    } catch (error) {
      console.error('Failed to load channel data:', error)
      toast.error('Failed to load channel')
    }
  }

  const loadChannels = async () => {
    if (!user || !organizationData?.id || !userProfile) return

    try {
      // Load user channels
      const { data: userChannels } = await db.getUserChannels(userProfile.id)
      const channels = userChannels?.map(uc => uc.chat_channels).filter(Boolean) || []
      setState(prev => ({ ...prev, channels }))

      // Load unread counts for all channels
      const unreadCounts: Record<string, number> = {}
      for (const channel of channels) {
        const { data: count } = await db.getUnreadMessageCount(userProfile.id, channel.id)
        unreadCounts[channel.id] = count
      }
      setState(prev => ({ ...prev, unreadCounts }))
    } catch (error) {
      console.error('Failed to load channels:', error)
      toast.error('Failed to load channels')
    }
  }

  const createChannel = async (data: Partial<ChatChannel>) => {
    console.log('🏗️ Creating channel:', { data, organizationData: organizationData?.id, userProfile: userProfile?.id })
    
    if (!organizationData?.id || !userProfile) {
      console.log('❌ Cannot create channel - missing data:', {
        hasOrgData: !!organizationData?.id,
        hasUserProfile: !!userProfile
      })
      toast.error('Unable to create channel: missing organization or user data')
      return
    }

    try {
      const channelData = {
        ...data,
        organization_id: organizationData.id,
        created_by: userProfile.id
      }

      const { data: newChannel, error: createError } = await db.createChatChannel(channelData)
      
      if (createError) {
        throw new Error(`Failed to create channel: ${createError}`)
      }
      
      if (newChannel) {
        // Add creator as admin
        const { error: memberError } = await db.addChannelMember(newChannel.id, userProfile.id, 'admin')
        
        if (memberError) {
          console.error('Failed to add creator as admin:', memberError)
          // Channel was created but membership failed - still show success but warn
          toast.success('Channel created successfully (with membership issue)')
        } else {
          toast.success('Channel created successfully')
        }
        
        // Reload channels to show the new channel
        await loadChannels()
      }
    } catch (error) {
      console.error('Failed to create channel:', error)
      toast.error(`Failed to create channel: ${error}`)
    }
  }

  const updateChannel = async (channelId: string, updates: Partial<ChatChannel>) => {
    try {
      await db.updateChatChannel(channelId, updates)
      toast.success('Channel updated successfully')
    } catch (error) {
      console.error('Failed to update channel:', error)
      toast.error('Failed to update channel')
    }
  }

  const deleteChannel = async (channelId: string) => {
    try {
      await db.deleteChatChannel(channelId)
      if (state.currentChannel?.id === channelId) {
        setState(prev => ({ ...prev, currentChannel: null, messages: [], members: [] }))
      }
      toast.success('Channel deleted successfully')
    } catch (error) {
      console.error('Failed to delete channel:', error)
      toast.error('Failed to delete channel')
    }
  }

  const sendMessage = async (content: string, messageType: string = 'text', metadata: any = {}) => {
    if (!state.currentChannel || !userProfile || !content.trim()) {
      console.log('Cannot send message:', { 
        hasChannel: !!state.currentChannel, 
        hasProfile: !!userProfile, 
        hasContent: !!content.trim() 
      })
      return
    }

    try {
      const messageData = {
        channel_id: state.currentChannel.id,
        user_id: userProfile.id,
        content: content.trim(),
        message_type: messageType,
        metadata
      }

      const { data: newMessage, error: messageError } = await db.createChatMessage(messageData)
      
      if (messageError) {
        throw new Error(`Failed to send message: ${messageError}`)
      }
      
      // Stop typing indicator
      stopTyping(state.currentChannel.id)
      
      // Optionally add the message to local state immediately for better UX
      // Real-time subscription will also add it, but this provides instant feedback
      if (newMessage) {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, { ...newMessage, user_profiles: { 
            id: userProfile.id, 
            clerk_user_id: user?.id,
            full_name: userProfile.full_name,
            email: userProfile.email,
            avatar_url: userProfile.avatar_url
          }}]
        }))
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error(`Failed to send message: ${error}`)
    }
  }

  const editMessage = async (messageId: string, content: string) => {
    try {
      await db.updateChatMessage(messageId, { content })
      toast.success('Message updated')
    } catch (error) {
      console.error('Failed to edit message:', error)
      toast.error('Failed to edit message')
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      await db.deleteChatMessage(messageId)
      toast.success('Message deleted')
    } catch (error) {
      console.error('Failed to delete message:', error)
      toast.error('Failed to delete message')
    }
  }

  const loadMoreMessages = async () => {
    if (!state.currentChannel || !hasMoreMessages) return

    try {
      const newOffset = messagesOffset + 50
      const { data: olderMessages } = await db.getChatMessages(state.currentChannel.id, 50, newOffset)
      
      if (olderMessages && olderMessages.length > 0) {
        setState(prev => ({ 
          ...prev, 
          messages: [...olderMessages.reverse(), ...prev.messages]
        }))
        setMessagesOffset(newOffset)
      } else {
        setHasMoreMessages(false)
      }
    } catch (error) {
      console.error('Failed to load more messages:', error)
      toast.error('Failed to load more messages')
    }
  }

  const addMember = async (channelId: string, userId: string) => {
    try {
      await db.addChannelMember(channelId, userId)
      toast.success('Member added to channel')
    } catch (error) {
      console.error('Failed to add member:', error)
      toast.error('Failed to add member')
    }
  }

  const removeMember = async (channelId: string, userId: string) => {
    try {
      await db.removeChannelMember(channelId, userId)
      toast.success('Member removed from channel')
    } catch (error) {
      console.error('Failed to remove member:', error)
      toast.error('Failed to remove member')
    }
  }

  const markAsRead = async (channelId: string) => {
    if (!userProfile) return

    try {
      await db.updateLastReadTime(channelId, userProfile.id)
      setState(prev => ({
        ...prev,
        unreadCounts: { ...prev.unreadCounts, [channelId]: 0 }
      }))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const searchMessages = async (query: string): Promise<ChatMessage[]> => {
    try {
      const { data: results } = await db.searchMessages(query, state.currentChannel?.id)
      return results || []
    } catch (error) {
      console.error('Failed to search messages:', error)
      return []
    }
  }

  const startTyping = (channelId: string) => {
    // Implementation for typing indicators would go here
    // This could use Supabase presence or a separate real-time channel
  }

  const stopTyping = (channelId: string) => {
    // Implementation for stopping typing indicators would go here
  }

  const addReaction = async (messageId: string, reaction: string) => {
    if (!userProfile) return

    try {
      await db.addMessageReaction(messageId, userProfile.id, reaction)
    } catch (error) {
      console.error('Failed to add reaction:', error)
      toast.error('Failed to add reaction')
    }
  }

  const removeReaction = async (messageId: string, reaction: string) => {
    if (!userProfile) return

    try {
      await db.removeMessageReaction(messageId, userProfile.id, reaction)
    } catch (error) {
      console.error('Failed to remove reaction:', error)
      toast.error('Failed to remove reaction')
    }
  }

  // Real-time event handlers
  const handleChannelChange = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    setState(prev => {
      let newChannels = [...prev.channels]

      if (eventType === 'INSERT') {
        newChannels.push(newRecord)
      } else if (eventType === 'UPDATE') {
        const index = newChannels.findIndex(c => c.id === newRecord.id)
        if (index !== -1) {
          newChannels[index] = newRecord
        }
      } else if (eventType === 'DELETE') {
        newChannels = newChannels.filter(c => c.id !== oldRecord.id)
      }

      return { ...prev, channels: newChannels }
    })
  }

  const handleMessageChange = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    setState(prev => {
      let newMessages = [...prev.messages]

      if (eventType === 'INSERT' && newRecord.channel_id === prev.currentChannel?.id) {
        // Don't add if it's already in the list (avoid duplicates)
        const exists = newMessages.some(m => m.id === newRecord.id)
        if (!exists) {
          newMessages.push(newRecord)
        }
      } else if (eventType === 'UPDATE') {
        const index = newMessages.findIndex(m => m.id === newRecord.id)
        if (index !== -1) {
          newMessages[index] = newRecord
        }
      } else if (eventType === 'DELETE') {
        const index = newMessages.findIndex(m => m.id === oldRecord.id)
        if (index !== -1) {
          newMessages[index] = { ...newMessages[index], is_deleted: true, content: 'This message has been deleted' }
        }
      }

      return { ...prev, messages: newMessages }
    })
  }

  const handleMemberChange = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    setState(prev => {
      if (newRecord?.channel_id !== prev.currentChannel?.id) return prev

      let newMembers = [...prev.members]

      if (eventType === 'INSERT') {
        newMembers.push(newRecord)
      } else if (eventType === 'UPDATE') {
        const index = newMembers.findIndex(m => m.id === newRecord.id)
        if (index !== -1) {
          newMembers[index] = newRecord
        }
      } else if (eventType === 'DELETE') {
        newMembers = newMembers.filter(m => m.id !== oldRecord.id)
      }

      return { ...prev, members: newMembers }
    })
  }

  const handleNewMessage = (payload: any) => {
    const { new: newMessage } = payload
    
    // Update unread count for the channel if it's not the current channel
    if (newMessage.channel_id !== state.currentChannel?.id) {
      setState(prev => ({
        ...prev,
        unreadCounts: {
          ...prev.unreadCounts,
          [newMessage.channel_id]: (prev.unreadCounts[newMessage.channel_id] || 0) + 1
        }
      }))
    }
  }

  const contextValue: ChatContextType = {
    state,
    setCurrentChannel,
    loadChannels,
    createChannel,
    updateChannel,
    deleteChannel,
    sendMessage,
    editMessage,
    deleteMessage,
    loadMoreMessages,
    addMember,
    removeMember,
    markAsRead,
    searchMessages,
    startTyping,
    stopTyping,
    addReaction,
    removeReaction
  }

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  )
}