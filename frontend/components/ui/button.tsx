import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95 disabled:hover:scale-100",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary)] text-white shadow-md hover:bg-[var(--color-primary)]/90 hover:shadow-lg focus-visible:ring-[var(--color-primary)] transition-all duration-200",
        secondary:
          "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30 shadow-sm hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] hover:shadow-md focus-visible:ring-[var(--color-primary)] transition-all duration-200",
        outline:
          "border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white focus-visible:ring-[var(--color-primary)] transition-all duration-200",
        ghost:
          "text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] focus-visible:ring-[var(--color-primary)] transition-all duration-200",
        destructive:
          "bg-red-500 text-white shadow-md hover:bg-red-600 hover:shadow-lg focus-visible:ring-red-500 transition-all duration-200",
        bone:
          "bg-[var(--color-primary)] text-white shadow-md hover:bg-[var(--color-primary)]/90 hover:shadow-lg focus-visible:ring-[var(--color-primary)] transition-all duration-200 bone-button-shape relative overflow-hidden z-0 shadow-none hover:shadow-md",
      },
      size: {
        sm: "px-4 py-2 text-sm rounded-[var(--radius-md)]",
        md: "px-6 py-3 text-base rounded-[var(--radius-md)]",
        lg: "px-8 py-4 text-lg rounded-[var(--radius-md)]",
        icon: "h-10 w-10 p-0 rounded-[var(--radius-md)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
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

