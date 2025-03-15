
import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps extends React.ComponentProps<"div"> {
  logoSrc?: string;
  title?: string;
}

export const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, logoSrc, title, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    >
      {logoSrc && (
        <div className="flex items-center gap-2 px-2">
          <img src={logoSrc} alt={title || "Logo"} className="h-8 w-8 object-contain" />
          {title && <span className="text-lg font-semibold">{title}</span>}
        </div>
      )}
      {!logoSrc && props.children}
    </div>
  )
);
SidebarHeader.displayName = "SidebarHeader";
