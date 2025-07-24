"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModernDatePicker, ModernDateRangePicker } from "@/components/ui/modern-date-picker";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function ModernDatePickerDemo() {
  const [singleDate, setSingleDate] = useState<Date | undefined>();
  const [dateWithTime, setDateWithTime] = useState<Date | undefined>();
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [timeRangeWithTime, setTimeRangeWithTime] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-4">
            Modern Rolling Date Picker Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Experience the next-generation date picker with rolling wheel interface, smooth animations, and modern design.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Single Date Picker */}
          <Card className="glass-card bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Single Date
                </CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  Basic
                </Badge>
              </div>
              <CardDescription>
                Clean date selection with rolling wheel interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ModernDatePicker
                value={singleDate}
                onChange={setSingleDate}
                placeholder="Select a date"
              />
              
              {singleDate && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Selected: {format(singleDate, "EEEE, MMMM dd, yyyy")}
                  </div>
                </div>
              )}
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <h4 className="font-semibold text-gray-900 dark:text-white">Features:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Rolling wheel interface</li>
                  <li>• Month, day, year selection</li>
                  <li>• Smooth animations</li>
                  <li>• Date validation</li>
                  <li>• Mobile responsive</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Date + Time Picker */}
          <Card className="glass-card bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Date & Time
                </CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  Advanced
                </Badge>
              </div>
              <CardDescription>
                Full date and time selection with 12/24 hour format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ModernDatePicker
                value={dateWithTime}
                onChange={setDateWithTime}
                placeholder="Select date & time"
                showTime={true}
                timeFormat="12"
              />
              
              {dateWithTime && (
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-sm font-medium text-green-900 dark:text-green-100">
                    Selected: {format(dateWithTime, "EEEE, MMMM dd, yyyy 'at' h:mm a")}
                  </div>
                </div>
              )}
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <h4 className="font-semibold text-gray-900 dark:text-white">Features:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Date + time selection</li>
                  <li>• 12/24 hour format</li>
                  <li>• AM/PM selection</li>
                  <li>• Minute precision</li>
                  <li>• Live preview</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Date Range Picker */}
          <Card className="glass-card bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Date Range
                </CardTitle>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  Premium
                </Badge>
              </div>
              <CardDescription>
                Start and end date selection for ranges and periods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ModernDateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="Select date range"
              />
              
              {(dateRange.from || dateRange.to) && (
                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    From: {dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "Not selected"}
                  </div>
                  <div className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    To: {dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "Not selected"}
                  </div>
                </div>
              )}
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <h4 className="font-semibold text-gray-900 dark:text-white">Features:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Start/end date selection</li>
                  <li>• Visual range indicators</li>
                  <li>• Smart validation</li>
                  <li>• Easy switching</li>
                  <li>• Range preview</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Variant Showcase */}
        <Card className="glass-card bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Style Variants
            </CardTitle>
            <CardDescription>
              Different visual styles for various use cases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Default Variant */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Default</h4>
                <ModernDatePicker
                  placeholder="Default style"
                  variant="default"
                />
              </div>
              
              {/* Minimal Variant */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Minimal</h4>
                <ModernDatePicker
                  placeholder="Minimal style"
                  variant="minimal"
                />
              </div>
              
              {/* Floating Variant */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Floating</h4>
                <ModernDatePicker
                  placeholder="Floating style"
                  variant="floating"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card className="glass-card bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Technologies Used</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• <strong>@ncdai/react-wheel-picker:</strong> Rolling wheel interface</li>
                  <li>• <strong>Framer Motion:</strong> Smooth animations</li>
                  <li>• <strong>date-fns:</strong> Date formatting and manipulation</li>
                  <li>• <strong>@internationalized/date:</strong> Internationalization</li>
                  <li>• <strong>Radix UI:</strong> Accessible dialog components</li>
                  <li>• <strong>Tailwind CSS:</strong> Modern styling system</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Features</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Touch-friendly wheel interface</li>
                  <li>• Keyboard accessibility</li>
                  <li>• Date range validation</li>
                  <li>• Multiple time formats</li>
                  <li>• Responsive design</li>
                  <li>• Dark mode support</li>
                  <li>• TypeScript support</li>
                  <li>• Customizable variants</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                <strong>🎯 MCP Server Enhancement:</strong> This modern rolling date picker was created using the 21st.dev MCP server, 
                replacing traditional calendar interfaces with an intuitive wheel-based selection system. The component features 
                smooth animations, mobile-optimized gestures, and seamless integration with your existing date management workflow.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card className="glass-card bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Usage Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Basic Date Picker</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm">
                    <code className="text-gray-800 dark:text-gray-200">
                      {`<ModernDatePicker
  value={date}
  onChange={setDate}
  placeholder="Select date"
/>`}
                    </code>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Date & Time Picker</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm">
                    <code className="text-gray-800 dark:text-gray-200">
                      {`<ModernDatePicker
  value={datetime}
  onChange={setDatetime}
  showTime={true}
  timeFormat="12"
/>`}
                    </code>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Date Range Picker</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm">
                    <code className="text-gray-800 dark:text-gray-200">
                      {`<ModernDateRangePicker
  value={range}
  onChange={setRange}
  placeholder="Select range"
/>`}
                    </code>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">With Constraints</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm">
                    <code className="text-gray-800 dark:text-gray-200">
                      {`<ModernDatePicker
  value={date}
  onChange={setDate}
  minDate={new Date()}
  maxDate={futureDate}
  variant="floating"
/>`}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}