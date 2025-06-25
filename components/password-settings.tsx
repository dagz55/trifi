"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"
import { UnsavedChangesBar } from "./unsaved-changes-bar"
import { toast } from "sonner"

interface PasswordRules {
  requireLowercase: boolean
  requireUppercase: boolean
  requireNumber: boolean
  requireSpecialChar: boolean
}

const initialPasswordRules: PasswordRules = {
  requireLowercase: false,
  requireUppercase: false,
  requireNumber: false,
  requireSpecialChar: false,
}

export function PasswordSettings() {
  const [passwordRules, setPasswordRules] = useState<PasswordRules>(initialPasswordRules)

  const handleSave = async (data: PasswordRules) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Here you would make your actual API call
    console.log("Saving password rules:", data)
    toast.success("Password rules saved successfully!")
  }

  const handleReset = () => {
    setPasswordRules(initialPasswordRules)
    toast.info("Changes reset")
  }

  const { hasUnsavedChanges, isSaving, handleSave: onSave, handleReset: onReset } = useUnsavedChanges({
    initialData: initialPasswordRules,
    currentData: passwordRules,
    onSave: handleSave,
    onReset: handleReset,
  })

  const updateRule = (field: keyof PasswordRules, value: boolean) => {
    setPasswordRules(prev => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Password rules</CardTitle>
            <Badge variant="secondary" className="bg-gray-800 text-white px-2 py-1 text-xs">
              Pro
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="lowercase"
                checked={passwordRules.requireLowercase}
                onCheckedChange={(checked) => updateRule("requireLowercase", !!checked)}
              />
              <Label htmlFor="lowercase" className="text-sm font-medium">
                Require at least 1 lowercase character
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="uppercase"
                checked={passwordRules.requireUppercase}
                onCheckedChange={(checked) => updateRule("requireUppercase", !!checked)}
              />
              <Label htmlFor="uppercase" className="text-sm font-medium">
                Require at least 1 uppercase character
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="number"
                checked={passwordRules.requireNumber}
                onCheckedChange={(checked) => updateRule("requireNumber", !!checked)}
              />
              <Label htmlFor="number" className="text-sm font-medium">
                Require at least 1 number
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="special"
                checked={passwordRules.requireSpecialChar}
                onCheckedChange={(checked) => updateRule("requireSpecialChar", !!checked)}
              />
              <Label htmlFor="special" className="text-sm font-medium">
                Require at least 1 special character
              </Label>
            </div>

            <div className="text-sm text-muted-foreground mt-2">
              Special characters include: !"#$%&'()*+,-./:{'<=>?@[]^_`{|}~'}
            </div>
          </div>
        </CardContent>
      </Card>

      <UnsavedChangesBar
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onSave={onSave}
        onReset={onReset}
      />
    </>
  )
} 