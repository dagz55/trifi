"use client"

import { ModernDateRangePicker } from "@/components/ui/modern-date-picker"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"

interface DateRangePickerProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({ dateRange, onDateRangeChange, className }: DateRangePickerProps) {
  // Convert DateRange format to ModernDateRangePicker format
  const convertedValue = dateRange ? {
    from: dateRange.from,
    to: dateRange.to
  } : { from: undefined, to: undefined };

  const handleChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    onDateRangeChange(range.from || range.to ? {
      from: range.from,
      to: range.to
    } : undefined);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <ModernDateRangePicker
        value={convertedValue}
        onChange={handleChange}
        placeholder="Pick a date range"
        className="w-full"
      />
    </div>
  )
}