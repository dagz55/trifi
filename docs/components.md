# TriFi Component Library

This document provides comprehensive documentation for all UI components and patterns used in the TriFi application.

## 🎨 Design System

### **Color Palette**
TriFi uses a carefully crafted color system built on Tailwind CSS:

```css
/* Primary Colors */
--primary: 222.2 84% 4.9%        /* Almost black */
--primary-foreground: 210 40% 98% /* Off white */

/* Secondary Colors */
--secondary: 210 40% 96%         /* Light gray */
--secondary-foreground: 222.2 84% 4.9%

/* Accent Colors */
--accent: 210 40% 96%
--accent-foreground: 222.2 84% 4.9%

/* Status Colors */
--success: 142.1 76.2% 36.3%     /* Green */
--warning: 47.9 95.8% 53.1%      /* Yellow */
--destructive: 0 84.2% 60.2%     /* Red */
--info: 217.2 91.2% 59.8%        /* Blue */
```

### **Typography Scale**
```css
/* Font Sizes */
.text-xs    { font-size: 0.75rem; }   /* 12px */
.text-sm    { font-size: 0.875rem; }  /* 14px */
.text-base  { font-size: 1rem; }      /* 16px */
.text-lg    { font-size: 1.125rem; }  /* 18px */
.text-xl    { font-size: 1.25rem; }   /* 20px */
.text-2xl   { font-size: 1.5rem; }    /* 24px */
.text-3xl   { font-size: 1.875rem; }  /* 30px */
.text-4xl   { font-size: 2.25rem; }   /* 36px */
```

### **Spacing System**
Consistent spacing using Tailwind's scale:
```css
/* Common spacing values */
.p-1  { padding: 0.25rem; }    /* 4px */
.p-2  { padding: 0.5rem; }     /* 8px */
.p-4  { padding: 1rem; }       /* 16px */
.p-6  { padding: 1.5rem; }     /* 24px */
.p-8  { padding: 2rem; }       /* 32px */
```

## 🧩 Base Components

### **Button**
Versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui/button"

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>

// With Icons
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Item
</Button>
```

**Props:**
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- `disabled`: boolean
- `loading`: boolean
- `asChild`: boolean (renders as child element)

### **Card**
Container component for grouping related content.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### **Input**
Form input component with validation states.

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>

// With error state
<Input 
  className="border-red-500"
  placeholder="Error state"
/>

// Disabled
<Input disabled placeholder="Disabled input" />
```

### **Select**
Dropdown selection component.

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

### **Dialog**
Modal dialog component for overlays and forms.

```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description and instructions.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Dialog content */}
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## 📊 Data Display Components

### **Table**
Responsive table component for data display.

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell>
          <Badge variant="success">{item.status}</Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### **Badge**
Status indicator component.

```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>

// Custom colors
<Badge className="bg-green-100 text-green-800">Success</Badge>
<Badge className="bg-blue-100 text-blue-800">Info</Badge>
```

### **Progress**
Progress bar component for indicating completion.

```tsx
import { Progress } from "@/components/ui/progress"

<Progress value={75} className="w-full" />

// With label
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Progress</span>
    <span>75%</span>
  </div>
  <Progress value={75} />
</div>
```

## 🎛️ Form Components

### **Checkbox**
Checkbox input with label support.

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

<div className="flex items-center space-x-2">
  <Checkbox 
    id="terms" 
    checked={accepted}
    onCheckedChange={setAccepted}
  />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

### **Radio Group**
Radio button group component.

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

<RadioGroup value={value} onValueChange={setValue}>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="option2" />
    <Label htmlFor="option2">Option 2</Label>
  </div>
</RadioGroup>
```

### **Switch**
Toggle switch component.

```tsx
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

<div className="flex items-center space-x-2">
  <Switch 
    id="notifications" 
    checked={enabled}
    onCheckedChange={setEnabled}
  />
  <Label htmlFor="notifications">Enable notifications</Label>
</div>
```

### **Textarea**
Multi-line text input component.

```tsx
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="description">Description</Label>
  <Textarea
    id="description"
    placeholder="Enter description..."
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    rows={4}
  />
</div>
```

## 🚨 Feedback Components

### **Toast**
Notification toast system.

```tsx
import { toast } from "sonner"

// Success toast
toast.success("Settings saved successfully!")

// Error toast
toast.error("Failed to save settings")

// Info toast
toast.info("New feature available")

// Warning toast
toast.warning("Please review your changes")

// Custom toast with action
toast("Event created", {
  description: "Your event has been scheduled",
  action: {
    label: "View",
    onClick: () => console.log("View clicked"),
  },
})
```

### **Alert**
Alert component for important messages.

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

// Success Alert
<Alert className="border-green-200 bg-green-50">
  <CheckCircle className="h-4 w-4 text-green-600" />
  <AlertTitle className="text-green-800">Success</AlertTitle>
  <AlertDescription className="text-green-700">
    Your changes have been saved successfully.
  </AlertDescription>
</Alert>

// Error Alert
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    There was an error processing your request.
  </AlertDescription>
</Alert>
```

## 🧭 Navigation Components

### **Tabs**
Tab navigation component.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <p>Overview content</p>
  </TabsContent>
  <TabsContent value="analytics">
    <p>Analytics content</p>
  </TabsContent>
  <TabsContent value="settings">
    <p>Settings content</p>
  </TabsContent>
</Tabs>
```

### **Breadcrumb**
Navigation breadcrumb component.

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/transactions">Transactions</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Details</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## 🎯 TriFi-Specific Components

### **UnsavedChangesBar**
Notification bar for unsaved form changes.

```tsx
import { UnsavedChangesBar } from "@/components/unsaved-changes-bar"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"

const { hasUnsavedChanges, isSaving, handleSave, handleReset } = useUnsavedChanges({
  initialData,
  currentData,
  onSave: async (data) => await saveData(data),
  onReset: () => resetForm(),
})

<UnsavedChangesBar
  show={hasUnsavedChanges}
  isSaving={isSaving}
  onSave={handleSave}
  onReset={handleReset}
/>
```

### **DateRangePicker**
Date range selection component.

```tsx
import { DateRangePicker } from "@/components/date-range-picker"
import { DateRange } from "react-day-picker"

const [dateRange, setDateRange] = useState<DateRange | undefined>()

<DateRangePicker
  dateRange={dateRange}
  onDateRangeChange={setDateRange}
  className="w-[280px]"
/>
```

### **AccountsOverview**
Dashboard component for account balance display.

```tsx
import { AccountsOverview } from "@/components/accounts-overview"

<AccountsOverview />
```

**Features:**
- Real-time balance updates
- Multiple account support
- Quick action buttons (Add, Send, Request, More)
- Modal integrations for money operations

### **RecentTransactions**
Transaction list component with filtering.

```tsx
import { RecentTransactions } from "@/components/recent-transactions"

<RecentTransactions />
```

**Features:**
- Transaction type indicators
- Empty state handling
- Navigation to full transaction list
- Amount formatting with currency

### **PasswordSettings**
Password rules configuration component.

```tsx
import { PasswordSettings } from "@/components/password-settings"

<PasswordSettings />
```

**Features:**
- Password complexity rules
- Unsaved changes detection
- Pro badge indicator
- Save/reset functionality

## 📱 Responsive Patterns

### **Mobile Navigation**
Adaptive sidebar for mobile devices.

```tsx
import { Sidebar } from "@/components/sidebar"

<Sidebar />
```

**Features:**
- Collapsible on mobile
- Touch-friendly navigation
- Active state indicators
- User profile integration

### **Mobile-First Cards**
Responsive card layouts.

```tsx
// Responsive grid
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>

// Stacked on mobile, side-by-side on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div className="md:w-1/2">...</div>
  <div className="md:w-1/2">...</div>
</div>
```

## 🎨 Theme Integration

### **Dark Mode Support**
All components support dark mode through CSS variables.

```tsx
// Theme provider setup
import { ThemeProvider } from "@/components/theme-provider"

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>

// Theme toggle
import { ModeToggle } from "@/components/mode-toggle"

<ModeToggle />
```

### **Color Utilities**
Helper utilities for consistent theming.

```tsx
// Status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}
```

## ♿ Accessibility Features

### **Keyboard Navigation**
All interactive components support keyboard navigation:
- Tab navigation through interactive elements
- Enter/Space activation for buttons
- Arrow key navigation for dropdowns
- Escape key to close modals

### **Screen Reader Support**
Components include proper ARIA attributes:
```tsx
// Example with proper labels
<Button aria-label="Delete transaction">
  <Trash2 className="h-4 w-4" />
</Button>

// Form field with description
<div>
  <Label htmlFor="amount">Amount</Label>
  <Input 
    id="amount"
    aria-describedby="amount-help"
  />
  <p id="amount-help" className="text-sm text-muted-foreground">
    Enter the transaction amount in PHP
  </p>
</div>
```

### **Focus Management**
Proper focus management for interactive elements:
```css
/* Focus styles */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px hsl(var(--ring));
}
```

## 🧪 Testing Components

### **Component Testing**
Example test setup for components:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### **Visual Testing**
Storybook integration for component documentation:

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
}
```

## 📖 Best Practices

### **Component Organization**
- Keep components small and focused
- Use TypeScript for prop definitions
- Include JSDoc comments for complex props
- Follow the single responsibility principle

### **Styling Guidelines**
- Use Tailwind utility classes
- Avoid custom CSS unless necessary
- Maintain consistent spacing and sizing
- Support both light and dark themes

### **Performance Tips**
- Use React.memo for expensive components
- Implement proper key props for lists
- Lazy load heavy components
- Optimize image assets

---

For API integration examples, see the [API Documentation](api.md). 