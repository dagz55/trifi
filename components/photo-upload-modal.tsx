"use client"

import { useState, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { X, Upload, Camera, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { isSupabaseConfigured } from "@/lib/supabase"
import { uploadPhoto, validateImageFile } from "@/lib/storage"

interface PhotoUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete: (url: string) => void
  currentPhotoUrl?: string
}

export function PhotoUploadModal({ isOpen, onClose, onUploadComplete, currentPhotoUrl }: PhotoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetModal = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadProgress(0)
    setError(null)
    setDragActive(false)
  }

  const handleClose = () => {
    if (!isUploading) {
      resetModal()
      onClose()
    }
  }

  const validateFile = (file: File): string | null => {
    const validation = validateImageFile(file)
    return validation.valid ? null : validation.error || "Invalid file"
  }

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setSelectedFile(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const uploadToSupabase = async (file: File): Promise<string> => {
    const result = await uploadPhoto(file, 'avatars')
    
    if (!result.success) {
      throw new Error(result.error || 'Upload failed')
    }

    return result.url || ''
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const photoUrl = await uploadToSupabase(selectedFile)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Wait a moment to show completion
      setTimeout(() => {
        onUploadComplete(photoUrl)
        toast.success("Photo uploaded successfully!")
        handleClose()
      }, 500)

    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed")
      toast.error("Failed to upload photo")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemovePhoto = () => {
    onUploadComplete("")
    toast.success("Photo removed")
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Upload Profile Photo</span>
          </DialogTitle>
          <DialogDescription>
            Choose a photo to upload as your profile picture. Max file size: 1MB
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isSupabaseConfigured() && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Supabase is not configured. Photos will be stored locally for demo purposes only.
              </AlertDescription>
            </Alert>
          )}

          {/* File Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <div className="relative mx-auto w-32 h-32">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-full border-4 border-background shadow-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewUrl(null)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedFile?.name} ({(selectedFile?.size || 0 / 1024).toFixed(1)} KB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Drop your photo here</p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse files
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  Select Photo
                </Button>
              </div>
            )}

            <Input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          {currentPhotoUrl && (
            <Button
              variant="outline"
              onClick={handleRemovePhoto}
              disabled={isUploading}
              className="text-destructive hover:text-destructive"
            >
              Remove Photo
            </Button>
          )}
          
          <div className="flex space-x-2 ml-auto">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex items-center space-x-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload Photo</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 