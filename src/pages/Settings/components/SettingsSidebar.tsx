import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Settings,
  User,
  Building2,
  CreditCard,
  Bell,
  Lock,
  Palette,
  Mail,
  MessageSquare
} from "lucide-react";

const settingsLinks = [
  { to: "/settings/profile", icon: User, label: "Profile" },
  { to: "/settings/company", icon: Building2, label: "Company" },
  { to: "/settings/billing", icon: CreditCard, label: "Billing" },
  { to: "/settings/notifications", icon: Bell, label: "Notifications" },
  { to: "/settings/security", icon: Lock, label: "Security" },
  { to: "/settings/appearance", icon: Palette, label: "Appearance" },
  { to: "/settings/email", icon: Mail, label: "Email" },
  { to: "/settings/messaging", icon: MessageSquare, label: "Messaging" },
  { to: "/settings/general", icon: Settings, label: "General" },
];

export function SettingsSidebar() {
  return (
    <nav className="space-y-1">
      {settingsLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              "hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )
          }
        >
          <link.icon className="mr-3 h-4 w-4" />
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
} 