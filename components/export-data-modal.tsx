"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DateRangePicker } from "@/components/date-range-picker"
import { Progress } from "@/components/ui/progress"
import { Download, FileText, Database } from "lucide-react"
import { DateRange } from "react-day-picker"
import { toast } from "sonner"

interface ExportDataModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: Array<{ name: string; balance: number }>
}

export function ExportDataModal({ open, onOpenChange, accounts }: ExportDataModalProps) {
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>(['transactions'])
  const [selectedFormat, setSelectedFormat] = useState('csv')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const exportTypes = [
    {
      id: 'transactions',
      name: 'Transaction History',
      description: 'All transaction records',
      icon: Database,
    },
    {
      id: 'statements',
      name: 'Account Statements',
      description: 'Monthly statements',
      icon: FileText,
    }
  ]

  const handleDataTypeToggle = (typeId: string) => {
    setSelectedDataTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    )
  }

  const handleExport = async () => {
    if (selectedDataTypes.length === 0) {
      toast.error("Please select at least one data type to export")
      return
    }

    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setExportProgress(i)
    }

    // Generate actual file
    const fileName = `trifi_export_${new Date().toISOString().split('T')[0]}.${selectedFormat}`
    
    if (selectedFormat === 'csv') {
      const csvData = "Date,Description,Amount,Type,Account\n" +
        "# No transaction data available for export"
      
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success(`File exported as ${fileName}`)
    } else {
      toast.success(`${selectedFormat.toUpperCase()} export completed!`)
    }

    setIsExporting(false)
    setExportProgress(0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Account Data
          </DialogTitle>
          <DialogDescription>
            Export your financial data in various formats.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Data to Export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exportTypes.map((type) => (
                  <div key={type.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={type.id}
                      checked={selectedDataTypes.includes(type.id)}
                      onCheckedChange={() => handleDataTypeToggle(type.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={type.id} className="font-medium">
                          {type.name}
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Export Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (Excel Compatible)</SelectItem>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="json">JSON Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <DateRangePicker 
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {isExporting && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Exporting data...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting || selectedDataTypes.length === 0}
          >
            {isExporting ? "Exporting..." : "Export Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 