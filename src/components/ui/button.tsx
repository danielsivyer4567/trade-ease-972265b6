"use client";

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
  enableRipple?: boolean
  rippleColor?: string
  rippleDuration?: number
}

interface RippleEffect {
  x: number
  y: number
  size: number
  key: number
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    enableRipple = true,
    rippleColor,
    rippleDuration = 600,
    onClick,
    children,
    ...props 
  }, ref) => {
    const [ripples, setRipples] = React.useState<RippleEffect[]>([])
    
    // Get ripple color based on variant if not specified
    const getRippleColor = () => {
      if (rippleColor) return rippleColor
      
      // Light silver ripple for all buttons - elegant and consistent
      return 'rgba(192, 192, 192, 0.4)'
    }

    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!enableRipple) return
      
      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2
      const x = event.clientX - rect.left - size / 2
      const y = event.clientY - rect.top - size / 2

      const newRipple: RippleEffect = {
        x,
        y,
        size,
        key: Date.now()
      }

      setRipples(prev => [...prev, newRipple])
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event)
      onClick?.(event)
    }

    React.useEffect(() => {
      if (ripples.length > 0) {
        const lastRipple = ripples[ripples.length - 1]
        const timeout = setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.key !== lastRipple.key))
        }, rippleDuration)
        return () => clearTimeout(timeout)
      }
    }, [ripples, rippleDuration])

    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center">
          {children}
        </span>
        {enableRipple && (
          <span className="absolute inset-0 pointer-events-none">
            {ripples.map((ripple) => (
              <span
                key={ripple.key}
                className="absolute rounded-full"
                style={{
                  width: `${ripple.size}px`,
                  height: `${ripple.size}px`,
                  top: `${ripple.y}px`,
                  left: `${ripple.x}px`,
                  backgroundColor: getRippleColor(),
                  transform: 'scale(0)',
                  opacity: 0.6,
                  animation: `ripple-effect ${rippleDuration}ms ease-out`,
                  animationFillMode: 'forwards',
                }}
              />
            ))}
          </span>
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
