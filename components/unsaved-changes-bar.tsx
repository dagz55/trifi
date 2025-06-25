"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, Save, RotateCcw } from "lucide-react"

interface UnsavedChangesBarProps {
  hasUnsavedChanges: boolean
  onSave: () => void
  onReset: () => void
  isSaving?: boolean
}

export function UnsavedChangesBar({ 
  hasUnsavedChanges, 
  onSave, 
  onReset, 
  isSaving = false 
}: UnsavedChangesBarProps) {
  if (!hasUnsavedChanges) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800 p-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-300">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">You have unsaved changes</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={isSaving}
              className="flex items-center space-x-1"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
            <Button
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center space-x-1 bg-amber-600 hover:bg-amber-700"
            >
              {isSaving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
} 