import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Receipt,
  DollarSign,
  BellRing,
  Settings,
  Zap,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

const navigationItems = [
  {
    to: "/",
    icon: <LayoutDashboard className="h-4 w-4" />,
    label: "Dashboard",
  },
  {
    to: "/customers",
    icon: <Users className="h-4 w-4" />,
    label: "Customers",
  },
  {
    to: "/jobs",
    icon: <Briefcase className="h-4 w-4" />,
    label: "Jobs",
  },
  {
    to: "/quotes",
    icon: <FileText className="h-4 w-4" />,
    label: "Quotes",
  },
  {
    to: "/invoices",
    icon: <Receipt className="h-4 w-4" />,
    label: "Invoices",
  },
  {
    to: "/payments",
    icon: <DollarSign className="h-4 w-4" />,
    label: "Payments",
  },
  {
    to: "/notifications",
    icon: <BellRing className="h-4 w-4" />,
    label: "Notifications",
  },
  {
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
    label: "Settings",
  },
  {
    to: "/ai-features",
    icon: <Zap className="h-4 w-4" />,
    label: "AI Features",
  },
];

export function AppSidebar() {
  const { state } = useSidebar();

  return (
    <React.Fragment>
      {navigationItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center space-x-2 rounded-md p-2 hover:bg-secondary ${
              isActive ? "bg-secondary font-medium text-muted-foreground" : ""
            }`
          }
        >
          {item.icon}
          {state === "expanded" && <span>{item.label}</span>}
        </NavLink>
      ))}
      <div className="mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex w-full items-center space-x-2 rounded-md p-2 hover:bg-secondary">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              {state === "expanded" && (
                <div className="flex flex-col space-y-0.5">
                  <span className="text-sm font-medium">Oscar Mike</span>
                  <span className="text-xs text-muted-foreground">
                    oscar@example.com
                  </span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </React.Fragment>
  );
}
