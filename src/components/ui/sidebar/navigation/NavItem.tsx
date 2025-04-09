import * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";
import { Badge } from "../../badge";
import { useSidebar } from "../SidebarProvider";
import { useTabNavigation } from "@/hooks/useTabNavigation";
import { useLocation } from "react-router-dom";
interface NavItemProps {
  path: string;
  className?: string;
  title?: string;
  label?: string; // Added label prop
  icon?: React.ComponentType<{
    className?: string;
  }>;
  count?: number;
  countVariant?: "default" | "destructive" | "secondary" | "outline";
  active?: boolean;
  variant?: "default" | "destructive";
  disabled?: boolean;
  sidebarExpanded?: boolean;
  children?: React.ReactNode;
}
export function NavItem({
  path,
  title,
  label,
  // Added label prop
  icon: Icon,
  count,
  countVariant = "default",
  active,
  variant = "default",
  disabled = false,
  sidebarExpanded,
  className,
  children,
  ...props
}: NavItemProps) {
  const {
    state
  } = useSidebar();
  const {
    openInTab
  } = useTabNavigation();
  const location = useLocation();

  // Use label if provided, otherwise fall back to title
  const displayText = label || title;
  const isActive = active || path === location.pathname;
  const expanded = sidebarExpanded !== undefined ? sidebarExpanded : state === "expanded";
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      // Open the link in a new tab
      openInTab(path, displayText || "");
    }
  };
  return <li className="relative px-px py-0 my-0">
      <Tooltip>
        <TooltipTrigger asChild>
          <a href={path} onClick={handleClick} className={cn("group flex items-center gap-x-3 relative rounded-md px-3 py-2 text-sm font-medium transition-colors", expanded ? "justify-start" : "justify-center", isActive && variant === "default" && "bg-accent text-accent-foreground", isActive && variant === "destructive" && "bg-destructive text-destructive-foreground", disabled && "pointer-events-none opacity-50", variant === "default" && !isActive && "hover:bg-secondary/50 hover:text-primary", variant === "destructive" && !isActive && "hover:bg-destructive hover:text-destructive-foreground", className)} {...props}>
            {Icon && <Icon className={cn("h-5 w-5 flex-shrink-0", expanded && "mr-1")} />}
            {expanded && <span className="truncate">{displayText}</span>}
            {count !== undefined && <Badge variant={countVariant} className={cn("ml-auto", !expanded && "hidden")}>
                {count}
              </Badge>}
          </a>
        </TooltipTrigger>
        {!expanded && <TooltipContent side="right" className="flex items-center gap-4">
            {displayText}
            {count !== undefined && <Badge variant={countVariant}>{count}</Badge>}
          </TooltipContent>}
      </Tooltip>
      {children}
    </li>;
}