"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { format, isValid, parseISO } from "date-fns";
import { CalendarDays, Clock, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WheelPicker, WheelPickerWrapper } from "@/components/ui/wheel-picker";
import type { WheelPickerOption } from "@/components/ui/wheel-picker";

interface ModernDatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  showTime?: boolean;
  timeFormat?: "12" | "24";
  variant?: "default" | "minimal" | "floating";
}

interface DateTimeState {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  meridiem: string;
}

const createArray = (length: number, add = 0): WheelPickerOption[] =>
  Array.from({ length }, (_, i) => {
    const value = i + add;
    return {
      label: value.toString().padStart(2, "0"),
      value: value.toString(),
    };
  });

const monthOptions: WheelPickerOption[] = [
  { label: "January", value: "0" },
  { label: "February", value: "1" },
  { label: "March", value: "2" },
  { label: "April", value: "3" },
  { label: "May", value: "4" },
  { label: "June", value: "5" },
  { label: "July", value: "6" },
  { label: "August", value: "7" },
  { label: "September", value: "8" },
  { label: "October", value: "9" },
  { label: "November", value: "10" },
  { label: "December", value: "11" },
];

const meridiemOptions: WheelPickerOption[] = [
  { label: "AM", value: "AM" },
  { label: "PM", value: "PM" },
];

const getDaysInMonth = (year: number, month: number): WheelPickerOption[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return createArray(daysInMonth, 1);
};

const getYearOptions = (minYear = 1900, maxYear = 2100): WheelPickerOption[] => {
  const years = [];
  for (let year = maxYear; year >= minYear; year--) {
    years.push({
      label: year.toString(),
      value: year.toString(),
    });
  }
  return years;
};

export function ModernDatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
  minDate,
  maxDate,
  showTime = false,
  timeFormat = "12",
  variant = "default",
}: ModernDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateTime, setDateTime] = useState<DateTimeState>({
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
    meridiem: "AM",
  });

  const yearOptions = getYearOptions(
    minDate?.getFullYear() || 1900,
    maxDate?.getFullYear() || 2100
  );

  const hourOptions = timeFormat === "12" ? createArray(12, 1) : createArray(24);
  const minuteOptions = createArray(60);

  const [dayOptions, setDayOptions] = useState<WheelPickerOption[]>([]);

  // Initialize state from value
  useEffect(() => {
    if (value && isValid(value)) {
      const year = value.getFullYear();
      const month = value.getMonth();
      const day = value.getDate();
      const hour = value.getHours();
      const minute = value.getMinutes();

      setDateTime({
        year: year.toString(),
        month: month.toString(),
        day: day.toString(),
        hour: timeFormat === "12" ? 
          (hour === 0 ? "12" : hour > 12 ? (hour - 12).toString() : hour.toString()) :
          hour.toString(),
        minute: minute.toString(),
        meridiem: hour >= 12 ? "PM" : "AM",
      });
    } else {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentDay = now.getDate();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      setDateTime({
        year: currentYear.toString(),
        month: currentMonth.toString(),
        day: currentDay.toString(),
        hour: timeFormat === "12" ? 
          (currentHour === 0 ? "12" : currentHour > 12 ? (currentHour - 12).toString() : currentHour.toString()) :
          currentHour.toString(),
        minute: currentMinute.toString(),
        meridiem: currentHour >= 12 ? "PM" : "AM",
      });
    }
  }, [value, timeFormat]);

  // Update day options when year or month changes
  useEffect(() => {
    if (dateTime.year && dateTime.month) {
      const year = parseInt(dateTime.year);
      const month = parseInt(dateTime.month);
      const days = getDaysInMonth(year, month);
      setDayOptions(days);
      
      // If current day is invalid for the new month, reset to 1
      if (dateTime.day && parseInt(dateTime.day) > days.length) {
        setDateTime(prev => ({ ...prev, day: "1" }));
      }
    }
  }, [dateTime.year, dateTime.month]);

  const handleDateTimeChange = (key: keyof DateTimeState, value: string) => {
    setDateTime(prev => ({ ...prev, [key]: value }));
  };

  const constructDate = (): Date | undefined => {
    if (!dateTime.year || !dateTime.month || !dateTime.day) return undefined;

    const year = parseInt(dateTime.year);
    const month = parseInt(dateTime.month);
    const day = parseInt(dateTime.day);

    let hour = 0;
    let minute = 0;

    if (showTime) {
      hour = parseInt(dateTime.hour || "0");
      minute = parseInt(dateTime.minute || "0");

      if (timeFormat === "12") {
        if (dateTime.meridiem === "PM" && hour !== 12) {
          hour += 12;
        } else if (dateTime.meridiem === "AM" && hour === 12) {
          hour = 0;
        }
      }
    }

    return new Date(year, month, day, hour, minute);
  };

  const handleApply = () => {
    const date = constructDate();
    onChange?.(date);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange?.(undefined);
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    
    if (showTime) {
      return format(value, timeFormat === "12" ? "MMM dd, yyyy h:mm a" : "MMM dd, yyyy HH:mm");
    }
    return format(value, "MMM dd, yyyy");
  };

  const getButtonContent = () => {
    const displayValue = getDisplayValue();
    const Icon = showTime ? Clock : Calendar;
    
    return (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className={cn(
          "truncate",
          !value && "text-muted-foreground"
        )}>
          {displayValue}
        </span>
      </div>
    );
  };

  const renderTrigger = () => {
    switch (variant) {
      case "minimal":
        return (
          <Button
            variant="ghost"
            className={cn(
              "w-auto h-auto p-2 text-sm font-normal justify-start",
              className
            )}
            disabled={disabled}
          >
            {getButtonContent()}
          </Button>
        );
      
      case "floating":
        return (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200",
              className
            )}
            disabled={disabled}
          >
            {getButtonContent()}
          </motion.button>
        );
      
      default:
        return (
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            {getButtonContent()}
          </Button>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {renderTrigger()}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {showTime ? "Select Date & Time" : "Select Date"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Date</h3>
            <WheelPickerWrapper className="w-full">
              <WheelPicker
                options={monthOptions}
                value={dateTime.month}
                onChange={(value) => handleDateTimeChange("month", value)}
                placeholder="Month"
              />
              <WheelPicker
                options={dayOptions}
                value={dateTime.day}
                onChange={(value) => handleDateTimeChange("day", value)}
                placeholder="Day"
              />
              <WheelPicker
                options={yearOptions}
                value={dateTime.year}
                onChange={(value) => handleDateTimeChange("year", value)}
                placeholder="Year"
              />
            </WheelPickerWrapper>
          </div>

          {/* Time Selection */}
          <AnimatePresence>
            {showTime && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <h3 className="text-sm font-medium">Time</h3>
                <WheelPickerWrapper className="w-full">
                  <WheelPicker
                    options={hourOptions}
                    value={dateTime.hour}
                    onChange={(value) => handleDateTimeChange("hour", value)}
                    placeholder="Hour"
                    infinite
                  />
                  <WheelPicker
                    options={minuteOptions}
                    value={dateTime.minute}
                    onChange={(value) => handleDateTimeChange("minute", value)}
                    placeholder="Min"
                    infinite
                  />
                  {timeFormat === "12" && (
                    <WheelPicker
                      options={meridiemOptions}
                      value={dateTime.meridiem}
                      onChange={(value) => handleDateTimeChange("meridiem", value)}
                      placeholder="AM/PM"
                    />
                  )}
                </WheelPickerWrapper>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview */}
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <div className="text-sm text-muted-foreground">Selected:</div>
            <div className="text-lg font-medium">
              {constructDate() ? (
                showTime ? (
                  format(constructDate()!, timeFormat === "12" ? "EEEE, MMMM dd, yyyy 'at' h:mm a" : "EEEE, MMMM dd, yyyy 'at' HH:mm")
                ) : (
                  format(constructDate()!, "EEEE, MMMM dd, yyyy")
                )
              ) : (
                "No date selected"
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Range picker component
interface ModernDateRangePickerProps {
  value?: { from: Date | undefined; to: Date | undefined };
  onChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  showTime?: boolean;
  timeFormat?: "12" | "24";
  variant?: "default" | "minimal" | "floating";
}

export function ModernDateRangePicker({
  value,
  onChange,
  placeholder = "Select date range",
  className,
  disabled = false,
  minDate,
  maxDate,
  showTime = false,
  timeFormat = "12",
  variant = "default",
}: ModernDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeInput, setActiveInput] = useState<"from" | "to">("from");
  const [tempRange, setTempRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    if (value) {
      setTempRange(value);
    }
  }, [value]);

  const handleDateChange = (date: Date | undefined) => {
    if (activeInput === "from") {
      setTempRange(prev => ({ ...prev, from: date }));
      setActiveInput("to");
    } else {
      setTempRange(prev => ({ ...prev, to: date }));
    }
  };

  const handleApply = () => {
    onChange?.(tempRange);
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempRange({ from: undefined, to: undefined });
    onChange?.({ from: undefined, to: undefined });
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!value?.from && !value?.to) return placeholder;
    
    const formatString = showTime ? 
      (timeFormat === "12" ? "MMM dd, yyyy h:mm a" : "MMM dd, yyyy HH:mm") :
      "MMM dd, yyyy";
    
    const fromStr = value?.from ? format(value.from, formatString) : "Start date";
    const toStr = value?.to ? format(value.to, formatString) : "End date";
    
    return `${fromStr} - ${toStr}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            (!value?.from && !value?.to) && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{getDisplayValue()}</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Select Date Range
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Range Selection Tabs */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={activeInput === "from" ? "default" : "outline"}
              onClick={() => setActiveInput("from")}
              className="justify-start"
            >
              <div className="text-left">
                <div className="text-xs opacity-70">From</div>
                <div className="text-sm">
                  {tempRange.from ? format(tempRange.from, "MMM dd, yyyy") : "Start date"}
                </div>
              </div>
            </Button>
            <Button
              variant={activeInput === "to" ? "default" : "outline"}
              onClick={() => setActiveInput("to")}
              className="justify-start"
            >
              <div className="text-left">
                <div className="text-xs opacity-70">To</div>
                <div className="text-sm">
                  {tempRange.to ? format(tempRange.to, "MMM dd, yyyy") : "End date"}
                </div>
              </div>
            </Button>
          </div>

          {/* Date Picker */}
          <div className="border rounded-lg p-4">
            <ModernDatePicker
              value={activeInput === "from" ? tempRange.from : tempRange.to}
              onChange={handleDateChange}
              placeholder={`Select ${activeInput} date`}
              minDate={minDate}
              maxDate={maxDate}
              showTime={showTime}
              timeFormat={timeFormat}
              variant="minimal"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApply}>
                Apply Range
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}