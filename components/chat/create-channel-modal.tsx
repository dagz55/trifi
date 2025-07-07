'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Hash, Lock, Users } from 'lucide-react'
import { useChatContext } from '@/contexts/chat-context'
import { toast } from 'sonner'

interface CreateChannelModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateChannelModal({ open, onOpenChange }: CreateChannelModalProps) {
  const { createChannel } = useChatContext()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'public' as 'public' | 'private' | 'group'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Channel name is required')
      return
    }

    setLoading(true)
    try {
      await createChannel({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type
      })
      
      // Reset form and close modal
      setFormData({ name: '', description: '', type: 'public' })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create channel:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', description: '', type: 'public' })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Create a new channel for your team to communicate.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input
              id="name"
              placeholder="general"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What's this channel about?"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Channel Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'public' | 'private' | 'group' }))}
              disabled={loading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="flex items-center space-x-2 cursor-pointer">
                  <Hash className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Public</div>
                    <div className="text-sm text-muted-foreground">
                      Anyone in the organization can join
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="flex items-center space-x-2 cursor-pointer">
                  <Lock className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Private</div>
                    <div className="text-sm text-muted-foreground">
                      Only invited members can join
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="group" id="group" />
                <Label htmlFor="group" className="flex items-center space-x-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Group</div>
                    <div className="text-sm text-muted-foreground">
                      Small group discussion
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? 'Creating...' : 'Create Channel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}