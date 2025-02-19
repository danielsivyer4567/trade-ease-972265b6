import { Link } from "react-router-dom";
import { Home, Briefcase, Users, Settings, FileText, Bell, Zap } from "lucide-react";

export function AppSidebar() {
  return (
    <nav className="space-y-4">
      <Link
        to="/"
        className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm"
      >
        <Home className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        to="/jobs"
        className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm"
      >
        <Briefcase className="h-4 w-4" />
        Jobs
      </Link>
      <Link
        to="/clients"
        className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm"
      >
        <Users className="h-4 w-4" />
        Clients
      </Link>
      <Link
        to="/reports"
        className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm"
      >
        <FileText className="h-4 w-4" />
        Reports
      </Link>
      <Link
        to="/notifications"
        className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm"
      >
        <Bell className="h-4 w-4" />
        Notifications
      </Link>
      <Link
        to="/ai-features"
        className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm"
      >
        <Zap className="h-4 w-4" />
        AI Features
      </Link>
      <Link
        to="/settings"
        className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Link>
    </nav>
  );
}
