import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button, ButtonProps, buttonVariants } from "./button"

interface ButtonGroupContextValue {
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
}

const ButtonGroupContext = React.createContext<ButtonGroupContextValue | undefined>(undefined)

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  vertical?: boolean
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, variant = "default", size = "default", vertical = false, ...props }, ref) => {
    return (
      <ButtonGroupContext.Provider value={{ variant, size }}>
        <div
          className={cn(
            "inline-flex",
            vertical ? "flex-col" : "flex-row",
            vertical ? "[&>*:first-child]:rounded-b-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:last-child]:rounded-t-none" : 
                      "[&>*:first-child]:rounded-r-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:last-child]:rounded-l-none",
            vertical ? "[&>*:not(:last-child)]:border-b-0" : "[&>*:not(:last-child)]:border-r-0",
            className
          )}
          ref={ref}
          {...props}
        />
      </ButtonGroupContext.Provider>
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"

export interface ButtonGroupItemProps extends ButtonProps {
  to?: string;
  active?: boolean;
  icon?: React.ReactNode;
}

const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  ({ className, variant, size, to, active, icon, children, ...props }, ref) => {
    const context = React.useContext(ButtonGroupContext)
    
    // Determine the variant to use, considering the active state
    const variantToUse = active ? "default" : (variant || context?.variant || "default");
    
    // If the component should be a link (to is provided)
    if (to) {
      return (
        <Link
          to={to}
          className={cn(
            buttonVariants({ 
              variant: variantToUse,
              size: size || context?.size,
            }),
            "rounded-none",
            className
          )}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </Link>
      )
    }
    
    // If it's a regular button
    return (
      <Button
        className={cn("rounded-none", className)}
        variant={variantToUse}
        size={size || context?.size}
        ref={ref}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </Button>
    )
  }
)
ButtonGroupItem.displayName = "ButtonGroupItem"

export { ButtonGroup, ButtonGroupItem } 