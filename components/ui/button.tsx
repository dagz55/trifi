import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 ease-apple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transform active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Modern fintech primary
        default: "bg-fintech-primary text-white hover:bg-fintech-primary-hover shadow-fintech hover:shadow-fintech-lg rounded-xl font-semibold hover:-translate-y-0.5",
        
        // Financial success action
        success: "bg-fintech-secondary text-white hover:bg-fintech-secondary-hover shadow-green-glow/20 hover:shadow-green-glow/40 rounded-xl font-semibold hover:-translate-y-0.5",
        
        // Premium accent
        accent: "bg-fintech-accent text-white hover:bg-fintech-accent-hover shadow-purple-glow/20 hover:shadow-purple-glow/40 rounded-xl font-semibold hover:-translate-y-0.5",
        
        // Destructive/warning
        destructive: "bg-fintech-danger text-white hover:bg-fintech-danger/90 shadow-fintech hover:shadow-fintech-lg rounded-xl font-semibold hover:-translate-y-0.5",
        
        // Subtle secondary
        secondary: "bg-fintech-neutral-100 text-fintech-neutral-700 hover:bg-fintech-neutral-200 border border-fintech-neutral-300 rounded-xl font-medium hover:-translate-y-0.5 shadow-fintech",
        
        // Modern outline
        outline: "border-2 border-fintech-primary text-fintech-primary bg-transparent hover:bg-fintech-primary hover:text-white rounded-xl font-semibold hover:-translate-y-0.5 shadow-fintech",
        
        // Ghost for subtle actions
        ghost: "text-fintech-neutral-700 hover:bg-fintech-neutral-100 hover:text-fintech-primary rounded-xl font-medium",
        
        // Link style
        link: "text-fintech-primary underline-offset-4 hover:underline font-medium",
        
        // Glass morphism
        glass: "bg-fintech-glass backdrop-blur-md border border-fintech-neutral-200/20 text-fintech-neutral-700 hover:bg-fintech-glass-dark rounded-xl font-medium shadow-glass hover:shadow-glass-lg",
        
        // Neumorphism (updated)
        clay: "bg-fintech-neutral-100 shadow-neomorphism hover:shadow-neomorphism-inset text-fintech-neutral-700 font-semibold rounded-2xl border border-fintech-neutral-200/50",
        
        // Legacy green (for compatibility)
        green: "bg-green-500 text-white hover:bg-green-600 rounded-xl font-semibold hover:-translate-y-0.5 shadow-fintech",
        "outline-green": "border-2 border-green-500 text-green-600 bg-transparent hover:bg-green-500 hover:text-white rounded-xl font-semibold hover:-translate-y-0.5 shadow-fintech",
      },
      size: {
        xs: "h-8 px-3 text-xs rounded-lg",
        sm: "h-9 px-4 text-sm rounded-lg",
        default: "h-11 px-6 py-2.5",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
