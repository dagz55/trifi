# Unsaved Changes System

This system provides a reusable way to detect unsaved changes in forms and show a notification bar with save/reset functionality.

## Components

### 1. `useUnsavedChanges` Hook

A custom hook that detects changes between initial and current form data.

```tsx
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"

const { hasUnsavedChanges, isSaving, handleSave, handleReset } = useUnsavedChanges({
  initialData: initialFormData,
  currentData: currentFormData,
  onSave: async (data) => {
    // Save logic here
    await saveToAPI(data)
  },
  onReset: () => {
    // Reset form to initial state
    setFormData(initialFormData)
  },
})
```

**Features:**
- Deep comparison of data to detect changes
- Automatic browser warning when leaving page with unsaved changes
- Loading state management during save operations
- Async save support

### 2. `UnsavedChangesBar` Component

A floating notification bar that appears when there are unsaved changes.

```tsx
import { UnsavedChangesBar } from "@/components/unsaved-changes-bar"

<UnsavedChangesBar
  show={hasUnsavedChanges}
  isSaving={isSaving}
  onSave={handleSave}
  onReset={handleReset}
/>
```

**Features:**
- Fixed positioning at bottom center of screen
- Dark theme with alert icon
- Disabled state during saving operations
- Smooth animations

### 3. `PasswordSettings` Component

Example implementation showing how to use the system with form data.

## Usage Example

```tsx
"use client"

import { useState } from "react"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"
import { UnsavedChangesBar } from "@/components/unsaved-changes-bar"

const initialData = { name: "", email: "" }

export function MyForm() {
  const [formData, setFormData] = useState(initialData)

  const handleSave = async (data: typeof formData) => {
    // Your save logic
    await fetch("/api/save", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  const handleReset = () => {
    setFormData(initialData)
  }

  const { hasUnsavedChanges, isSaving, handleSave: onSave, handleReset: onReset } = useUnsavedChanges({
    initialData,
    currentData: formData,
    onSave: handleSave,
    onReset: handleReset,
  })

  return (
    <>
      {/* Your form here */}
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      
      <UnsavedChangesBar
        show={hasUnsavedChanges}
        isSaving={isSaving}
        onSave={onSave}
        onReset={onReset}
      />
    </>
  )
}
```

## Key Benefits

1. **Reusable** - Works with any form data structure
2. **User-friendly** - Prevents accidental data loss
3. **Accessible** - Clear visual feedback and loading states
4. **Performant** - Efficient change detection
5. **Type-safe** - Full TypeScript support

## Customization

The `UnsavedChangesBar` accepts a `className` prop for custom styling:

```tsx
<UnsavedChangesBar
  show={hasUnsavedChanges}
  isSaving={isSaving}
  onSave={handleSave}
  onReset={handleReset}
  className="bottom-12 right-6 left-auto transform-none"  // Custom positioning
/>
``` 