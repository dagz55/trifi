import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-200 ease-apple focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Primary fintech badge
        default: "border-transparent bg-fintech-primary text-white shadow-sm hover:shadow-blue-glow/30",
        
        // Financial status badges
        success: "border-transparent bg-fintech-secondary text-white shadow-sm hover:shadow-green-glow/30",
        warning: "border-transparent bg-fintech-warning text-white shadow-sm hover:shadow-amber-500/30",
        danger: "border-transparent bg-fintech-danger text-white shadow-sm hover:shadow-red-500/30",
        info: "border-transparent bg-fintech-info text-white shadow-sm hover:shadow-blue-500/30",
        
        // Neutral variants
        secondary: "border-transparent bg-fintech-neutral-100 text-fintech-neutral-700 hover:bg-fintech-neutral-200 dark:bg-fintech-neutral-800 dark:text-fintech-neutral-300",
        outline: "border-fintech-neutral-300 text-fintech-neutral-700 bg-transparent hover:bg-fintech-neutral-50 dark:border-fintech-neutral-600 dark:text-fintech-neutral-300 dark:hover:bg-fintech-neutral-800",
        
        // Financial-specific status variants
        profit: "border-transparent bg-gradient-to-r from-fintech-secondary to-green-400 text-white shadow-sm",
        loss: "border-transparent bg-gradient-to-r from-fintech-danger to-red-400 text-white shadow-sm",
        pending: "border-transparent bg-gradient-to-r from-fintech-warning to-orange-400 text-white shadow-sm",
        completed: "border-transparent bg-gradient-to-r from-fintech-secondary to-emerald-400 text-white shadow-sm",
        
        // Investment status
        "bull-market": "border-transparent bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-sm animate-pulse-subtle",
        "bear-market": "border-transparent bg-gradient-to-r from-red-500 to-rose-400 text-white shadow-sm",
        
        // Premium/VIP
        premium: "border-transparent bg-gradient-to-r from-fintech-accent to-purple-500 text-white shadow-sm shadow-purple-glow/30",
        
        // Subtle glass effect
        glass: "border-fintech-neutral-200/30 bg-fintech-glass backdrop-blur-sm text-fintech-neutral-700 hover:bg-fintech-glass-dark dark:border-fintech-neutral-600/30 dark:text-fintech-neutral-300",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-sm",
        xl: "px-5 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
