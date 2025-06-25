import { useState, useEffect, useCallback } from "react"

interface UseUnsavedChangesProps {
  initialData: any
  currentData: any
  onSave?: (data: any) => void | Promise<void>
  onReset?: () => void
}

export function useUnsavedChanges({
  initialData,
  currentData,
  onSave,
  onReset,
}: UseUnsavedChangesProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Deep comparison to detect changes
  const hasChanges = useCallback(() => {
    return JSON.stringify(initialData) !== JSON.stringify(currentData)
  }, [initialData, currentData])

  useEffect(() => {
    setHasUnsavedChanges(hasChanges())
  }, [hasChanges])

  const handleSave = useCallback(async () => {
    if (!onSave || !hasUnsavedChanges) return

    setIsSaving(true)
    try {
      await onSave(currentData)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error("Error saving changes:", error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [onSave, currentData, hasUnsavedChanges])

  const handleReset = useCallback(() => {
    if (onReset) {
      onReset()
    }
    setHasUnsavedChanges(false)
  }, [onReset])

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  return {
    hasUnsavedChanges,
    isSaving,
    handleSave,
    handleReset,
  }
} 