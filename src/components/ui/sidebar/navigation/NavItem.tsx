import * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";
import { Badge } from "../../badge";
import { useSidebar } from "../SidebarProvider";
import { useTabNavigation } from "@/hooks/useTabNavigation";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
  const { state } = useSidebar();
  const { openInTab } = useTabNavigation();
  const location = useLocation();
  const navigate = useNavigate();

  // Use label if provided, otherwise fall back to title
  const displayText = label || title;
  const isActive = active || path === location.pathname;
  const expanded = sidebarExpanded !== undefined ? sidebarExpanded : state === "expanded";
  
  const handleClick = (e: React.MouseEvent) => {
    console.log('NavItem clicked:', path, displayText);
    
    // Always prevent default link behavior to avoid page reload
    e.preventDefault();
    
    if (disabled) {
      return;
    }
    
    // Special logging for workflow
    if (path === '/workflow') {
      console.log('Workflow navigation triggered!');
    }
    
    // Navigate directly and handle tab management separately
    navigate(path);
    
    try {
      // Try to open in tab, but don't let failure prevent navigation
      openInTab(path, displayText || "");
    } catch (error) {
      console.error("Error opening tab:", error);
    }
  };
  
  return (
    <div className="relative my-[3px] px-[5px] py-0">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={path}
            onClick={handleClick}
            className={cn(
              "group flex items-center gap-x-1.5 relative rounded-md px-2 py-1 text-sm font-medium transition-colors text-white",
              expanded ? "justify-start" : "justify-center",
              isActive && variant === "default" && "bg-white/20 text-white border border-foreground/10",
              isActive && variant === "destructive" && "bg-destructive text-destructive-foreground border border-foreground/10",
              disabled && "pointer-events-none opacity-50",
              variant === "default" && !isActive && "hover:bg-white/10 hover:text-white border-b border-border",
              variant === "destructive" && !isActive && "hover:bg-destructive hover:text-destructive-foreground border-b border-border",
              className
            )}
            {...props}
          >
            {Icon && <Icon className="text-white h-4 w-4" />}
            {expanded && <span className="truncate text-xs">{displayText}</span>}
            {count !== undefined && (
              <Badge variant={countVariant} className={cn("ml-auto", !expanded && "hidden")}>
                {count}
              </Badge>
            )}
          </Link>
        </TooltipTrigger>
        {!expanded && (
          <TooltipContent side="right" className="flex items-center gap-4">
            {displayText}
            {count !== undefined && <Badge variant={countVariant}>{count}</Badge>}
          </TooltipContent>
        )}
      </Tooltip>
      {children}
    </div>
  );
}