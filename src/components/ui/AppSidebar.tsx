
import {
  Calendar,
  ClipboardList,
  FileText,
  Home,
  Settings,
  Users,
  Hammer,
  CheckSquare,
  Clock,
  MessageSquare,
  XSquare
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Jobs", icon: ClipboardList, url: "/jobs" },
  { title: "Schedule", icon: Calendar, url: "/schedule" },
  { title: "Customers", icon: Users, url: "/customers" },
  { title: "Quotes & Invoices", icon: FileText, url: "/quotes" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

const quoteStatuses = [
  { title: "Accepted Quotes", icon: CheckSquare, url: "/quotes/accepted", color: "#10B981" },
  { title: "Awaiting Acceptance", icon: Clock, url: "/quotes/pending", color: "#F59E0B" },
  { title: "Replied Quotes", icon: MessageSquare, url: "/quotes/replied", color: "#3B82F6" },
  { title: "Denied Quotes", icon: XSquare, url: "/quotes/denied", color: "#EF4444" },
];

const teamSettings = [
  { title: "Red Team", color: "#ea384c", url: "/settings/red-team" },
  { title: "Blue Team", color: "#0EA5E9", url: "/settings/blue-team" },
  { title: "Green Team", color: "#10B981", url: "/settings/green-team" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/147b0371-94bb-403e-a449-f6fc081c4d6c.png" 
            alt="Trade Ease Logo" 
            className="w-8 h-8"
          />
          <h2 className="text-2xl font-bold">Trade Ease</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-4 px-4 py-3 rounded-md hover:bg-gray-100 transition-all group"
                    >
                      <div className="transition-transform duration-200 group-hover:scale-110">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-lg font-medium ${
                        item.title === "Dashboard" ? "text-2xl font-bold" : ""
                      }`}>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Quote Status Section */}
              {quoteStatuses.map((quote) => (
                <SidebarMenuItem key={quote.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={quote.url}
                      className="flex items-center gap-4 px-4 py-3 pl-8 rounded-md hover:bg-gray-100 transition-all group"
                    >
                      <div className="transition-transform duration-200 group-hover:scale-110">
                        <quote.icon className="w-5 h-5" style={{ color: quote.color }} />
                      </div>
                      <span className="text-lg font-medium">{quote.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Team Settings listed separately */}
              {teamSettings.map((team) => (
                <SidebarMenuItem key={team.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={team.url}
                      className="flex items-center gap-4 px-4 py-3 pl-8 rounded-md hover:bg-gray-100 transition-all group"
                    >
                      <div className="transition-transform duration-200 group-hover:scale-110">
                        <Hammer className="w-5 h-5" style={{ color: team.color }} />
                      </div>
                      <span className="text-lg font-medium">{team.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
