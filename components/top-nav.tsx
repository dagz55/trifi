"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useUser } from '@clerk/nextjs'
import { useClerk } from '@clerk/nextjs'
import { ModeToggle } from './mode-toggle'
import { Notifications } from './notifications'

interface TopNavProps {
  className?: string
}

export function TopNav({ className }: TopNavProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useUser()
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className={`bg-background border-b border-border px-6 py-4 flex items-center justify-between ${className || ''}`}>
      {/* Left Section - Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Section - User Actions */}
      <div className="flex items-center space-x-4">
        <Notifications />
        <ModeToggle />
        
        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {user?.fullName || user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-muted-foreground">{user?.emailAddresses?.[0]?.emailAddress}</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user?.imageUrl} 
              alt={user?.fullName || user?.emailAddresses?.[0]?.emailAddress || 'User'} 
            />
            <AvatarFallback>
              {(user?.fullName || user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'U')
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSignOut}
            className="ml-2"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
