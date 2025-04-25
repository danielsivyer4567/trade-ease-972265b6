import * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";
import { Badge } from "../../badge";
import { useSidebar } from "../SidebarProvider";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
  path: string;
  className?: string;
  title?: string;
  label?: string;
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
  const location = useLocation();

  const displayText = label || title;
  const isActive = active || path === location.pathname;
  const expanded = sidebarExpanded !== undefined ? sidebarExpanded : state === "expanded";
  
  return (
    <div className="relative my-[17px] px-[5px] py-0">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={path}
            className={cn(
              "group flex items-center gap-x-3 relative rounded-md px-3 py-2 text-sm font-medium transition-colors text-white",
              expanded ? "justify-start" : "justify-center",
              isActive && variant === "default" && "bg-white/20 text-white",
              isActive && variant === "destructive" && "bg-destructive text-destructive-foreground",
              disabled && "pointer-events-none opacity-50",
              variant === "default" && !isActive && "hover:bg-white/10 hover:text-white",
              variant === "destructive" && !isActive && "hover:bg-destructive hover:text-destructive-foreground",
              className
            )}
            {...props}
          >
            {Icon && <Icon className="text-white" />}
            {expanded && <span className="truncate">{displayText}</span>}
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