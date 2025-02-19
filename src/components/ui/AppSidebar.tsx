
import {
  LayoutDashboard,
  ListChecks,
  Plus,
  Settings,
  User2,
  Users,
} from "lucide-react"
import { Link } from "react-router-dom"

import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar() {
  const { state } = useSidebar()
  const isExpanded = state === "expanded"

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <LayoutDashboard className="h-6 w-6" />
          {isExpanded && <span>Dashboard</span>}
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <div className="space-y-1">
          <Link
            to="/jobs"
            className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-accent hover:text-accent-foreground text-sm"
          >
            <ListChecks className="h-4 w-4" />
            {isExpanded && <span>Jobs</span>}
          </Link>
          <Link
            to="/customers"
            className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-accent hover:text-accent-foreground text-sm"
          >
            <Users className="h-4 w-4" />
            {isExpanded && <span>Customers</span>}
          </Link>
          <Link
            to="/team"
            className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-accent hover:text-accent-foreground text-sm"
          >
            <User2 className="h-4 w-4" />
            {isExpanded && <span>Team</span>}
          </Link>
        </div>
        <hr className="border-gray-200 my-2" />
        {isExpanded && <div className="px-4 py-2 text-sm">Teams</div>}
        <div className="space-y-1">
          <Link 
            to="/team-red"
            className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 text-sm"
          >
            Red Team
          </Link>
          <Link 
            to="/team-blue"
            className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 text-sm"
          >
            Blue Team
          </Link>
          <Link 
            to="/team-green"
            className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-green-50 text-green-600 hover:text-green-700 text-sm"
          >
            Green Team
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex items-center gap-1.5 p-1.5 text-gray-600 hover:text-gray-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Team
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="font-bold">shadcn</span>
                  <span className="text-sm text-gray-500">@shadcn</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings <Settings className="ml-auto h-4 w-4" /></DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
