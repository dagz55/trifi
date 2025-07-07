import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-2xl transition-all duration-300 ease-apple transform",
  {
    variants: {
      variant: {
        // Modern financial card
        default: "bg-white border border-fintech-neutral-200 shadow-fintech hover:shadow-fintech-lg hover:-translate-y-1 hover:border-fintech-primary/30 dark:bg-fintech-neutral-900 dark:border-fintech-neutral-700 dark:hover:border-fintech-primary/50",
        
        // Glass morphism
        glass: "bg-fintech-glass backdrop-blur-md border border-fintech-neutral-200/20 shadow-glass hover:shadow-glass-lg hover:-translate-y-0.5 dark:bg-fintech-glass-dark dark:border-fintech-neutral-700/30",
        
        // Success/positive actions
        success: "bg-white border border-fintech-secondary/20 shadow-fintech hover:shadow-green-glow hover:border-fintech-secondary/50 hover:-translate-y-1 dark:bg-fintech-neutral-900 dark:border-fintech-secondary/30",
        
        // Primary actions
        primary: "bg-white border border-fintech-primary/20 shadow-fintech hover:shadow-blue-glow hover:border-fintech-primary/50 hover:-translate-y-1 dark:bg-fintech-neutral-900 dark:border-fintech-primary/30",
        
        // Accent/premium
        accent: "bg-white border border-fintech-accent/20 shadow-fintech hover:shadow-purple-glow hover:border-fintech-accent/50 hover:-translate-y-1 dark:bg-fintech-neutral-900 dark:border-fintech-accent/30",
        
        // Elevated for important content
        elevated: "bg-white border-0 shadow-fintech-xl hover:shadow-fintech-2xl hover:-translate-y-2 dark:bg-fintech-neutral-900",
        
        // Subtle for secondary content
        subtle: "bg-fintech-neutral-50 border border-fintech-neutral-100 shadow-sm hover:shadow-fintech hover:bg-white hover:-translate-y-0.5 dark:bg-fintech-neutral-800 dark:border-fintech-neutral-700 dark:hover:bg-fintech-neutral-900",
        
        // Interactive for clickable cards
        interactive: "bg-white border border-fintech-neutral-200 shadow-fintech hover:shadow-fintech-lg hover:-translate-y-1 hover:border-fintech-primary/50 cursor-pointer hover:bg-fintech-primary/5 dark:bg-fintech-neutral-900 dark:border-fintech-neutral-700 dark:hover:bg-fintech-primary/10",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-3 p-6 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-xl font-bold leading-tight tracking-tight text-fintech-neutral-900 dark:text-fintech-neutral-100",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-medium text-fintech-neutral-600 dark:text-fintech-neutral-400 leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("px-6 pb-4 text-fintech-neutral-700 dark:text-fintech-neutral-300", className)} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-6 pt-4 border-t border-fintech-neutral-200/50 dark:border-fintech-neutral-700/50", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
