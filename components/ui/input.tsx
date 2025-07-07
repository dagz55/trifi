import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full font-medium transition-all duration-200 ease-apple file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-fintech-neutral-700 placeholder:text-fintech-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:file:text-fintech-neutral-300 dark:placeholder:text-fintech-neutral-500",
  {
    variants: {
      variant: {
        // Modern fintech input
        default: "rounded-xl border border-fintech-neutral-300 bg-white px-4 py-3 text-fintech-neutral-900 shadow-sm focus-visible:border-fintech-primary focus-visible:ring-2 focus-visible:ring-fintech-primary/20 focus-visible:shadow-fintech hover:border-fintech-neutral-400 dark:bg-fintech-neutral-900 dark:border-fintech-neutral-600 dark:text-fintech-neutral-100 dark:focus-visible:border-fintech-primary dark:hover:border-fintech-neutral-500",
        
        // Glass morphism input
        glass: "rounded-xl border border-fintech-neutral-200/30 bg-fintech-glass backdrop-blur-md px-4 py-3 text-fintech-neutral-900 shadow-glass focus-visible:border-fintech-primary/50 focus-visible:ring-2 focus-visible:ring-fintech-primary/10 focus-visible:bg-white dark:bg-fintech-glass-dark dark:border-fintech-neutral-600/30 dark:text-fintech-neutral-100",
        
        // Elevated input for important fields
        elevated: "rounded-xl border-0 bg-white px-4 py-3 text-fintech-neutral-900 shadow-fintech focus-visible:shadow-fintech-lg focus-visible:ring-2 focus-visible:ring-fintech-primary/20 hover:shadow-fintech-lg dark:bg-fintech-neutral-800 dark:text-fintech-neutral-100",
        
        // Subtle input for secondary fields
        subtle: "rounded-lg border border-fintech-neutral-200 bg-fintech-neutral-50 px-3 py-2.5 text-fintech-neutral-700 focus-visible:border-fintech-primary focus-visible:ring-1 focus-visible:ring-fintech-primary/30 focus-visible:bg-white hover:bg-white dark:bg-fintech-neutral-800 dark:border-fintech-neutral-700 dark:text-fintech-neutral-300 dark:focus-visible:bg-fintech-neutral-900",
        
        // Success state (for validated fields)
        success: "rounded-xl border border-fintech-secondary bg-white px-4 py-3 text-fintech-neutral-900 shadow-sm ring-2 ring-fintech-secondary/10 dark:bg-fintech-neutral-900 dark:text-fintech-neutral-100",
        
        // Error state
        error: "rounded-xl border border-fintech-danger bg-white px-4 py-3 text-fintech-neutral-900 shadow-sm ring-2 ring-fintech-danger/10 dark:bg-fintech-neutral-900 dark:text-fintech-neutral-100",
        
        // Search input with enhanced styling
        search: "rounded-full border border-fintech-neutral-300 bg-fintech-neutral-50 px-6 py-2.5 text-fintech-neutral-700 shadow-sm focus-visible:border-fintech-primary focus-visible:ring-2 focus-visible:ring-fintech-primary/20 focus-visible:bg-white hover:bg-white dark:bg-fintech-neutral-800 dark:border-fintech-neutral-600 dark:text-fintech-neutral-300",
      },
      inputSize: {
        sm: "h-9 text-sm",
        default: "h-11 text-sm",
        lg: "h-12 text-base",
        xl: "h-14 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type, icon, iconPosition = "left", ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          {iconPosition === "left" && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-fintech-neutral-400 dark:text-fintech-neutral-500">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant, inputSize }),
              icon && iconPosition === "left" && "pl-10",
              icon && iconPosition === "right" && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {iconPosition === "right" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-fintech-neutral-400 dark:text-fintech-neutral-500">
              {icon}
            </div>
          )}
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
