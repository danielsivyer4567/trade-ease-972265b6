import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface RippleEffect {
  x: number
  y: number
  size: number
  key: number
}

interface ToggleProps extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {
  enableRipple?: boolean
  rippleColor?: string
  rippleDuration?: number
}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant, size, enableRipple = true, rippleColor, rippleDuration = 600, ...props }, ref) => {
  const [ripples, setRipples] = React.useState<RippleEffect[]>([])

  React.useEffect(() => {
    ripples.forEach((ripple) => {
      const timer = setTimeout(() => {
        setRipples(prev => prev.filter(r => r.key !== ripple.key))
      }, rippleDuration)
      return () => clearTimeout(timer)
    })
  }, [ripples, rippleDuration])

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!enableRipple) return
    
    const toggle = event.currentTarget
    const rect = toggle.getBoundingClientRect()
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

  // Get ripple color based on variant if not specified
  const getRippleColor = () => {
    if (rippleColor) return rippleColor
    
    // Light silver ripple for all toggles - elegant and consistent  
    return 'rgba(192, 192, 192, 0.4)'
  }

  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(toggleVariants({ variant, size, className }))}
      onMouseDown={createRipple}
      {...props}
    >
      {props.children}
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: getRippleColor(),
            animation: `ripple-effect ${rippleDuration}ms ease-out`,
            animationFillMode: 'forwards'
          }}
        />
      ))}
    </TogglePrimitive.Root>
  )
})

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
