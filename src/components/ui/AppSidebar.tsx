import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  Menu,
  Calendar,
  Network,
  Share,
  Bot,
  Mail,
  MessageSquare,
  Link as LinkIcon,
  Database,
  Hammer,
  Plus,
  BarChart
} from 'lucide-react';
import { useSidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { Button } from './button';

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-40 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu />
      </Button>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-40 bg-white border-r transition-transform lg:translate-x-0",
          state === "collapsed" && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-6">
              <img src="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png" alt="Trade Ease Logo" className="w-8 h-8" />
              <span className="font-medium text-gray-900">Trade Ease</span>
            </div>
          </div>
          <nav className="flex-1 p-1 space-y-0.5">
            <Link to="/" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm">
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <Link to="/statistics" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm">
              <BarChart className="w-3.5 h-3.5" />
              Statistics
            </Link>
            <Link to="/jobs" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm">
              <Briefcase className="w-3.5 h-3.5" />
              Jobs
            </Link>
            <Link to="/calendar" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm">
              <Calendar className="w-3.5 h-3.5" />
              Calendar
            </Link>
            <Link to="/customers" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm">
              <Users className="w-3.5 h-3.5" />
              Customers
            </Link>
            <Link to="/quotes" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm">
              <FileText className="w-3.5 h-3.5" />
              Quotes
            </Link>
            <Link to="/messaging" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm">
              <MessageSquare className="w-3.5 h-3.5" />
              Messaging
            </Link>
            <Link to="/email" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm">
              <Mail className="w-3.5 h-3.5" />
              Email
            </Link>
            <Link to="/ai-features" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm">
              <Bot className="w-3.5 h-3.5" />
              AI Features
            </Link>
            <Link to="/integrations" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm">
              <Network className="w-3.5 h-3.5" />
              Integrations
            </Link>
            <Link to="/social" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm">
              <Share className="w-3.5 h-3.5" />
              Social
            </Link>
            <Link to="/referrals" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm">
              <LinkIcon className="w-3.5 h-3.5" />
              Refer a Friend
            </Link>
            <Link to="/database" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm">
              <Database className="w-3.5 h-3.5" />
              Database
            </Link>
            <Link to="/settings" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm">
              <Settings className="w-3.5 h-3.5" />
              Settings
            </Link>

            {/* Teams Section */}
            <div className="pt-8">
              <div className="mb-1 text-sm font-bold text-black rounded-2xl my-0 py-[7px] px-px mx-1">Teams view</div>
              <Link
                to="/team-red"
                className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 text-sm"
              >
                <Hammer className="w-3.5 h-3.5" />
                Red Team
              </Link>
              <Link
                to="/team-blue"
                className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Hammer className="w-3.5 h-3.5" />
                Blue Team
              </Link>
              <Link
                to="/team-green"
                className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-green-50 text-green-600 hover:text-green-700 text-sm"
              >
                <Hammer className="w-3.5 h-3.5" />
                Green Team
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="w-full flex items-center gap-1.5 p-1.5 text-gray-600 hover:text-gray-700 hover:bg-gray-50 text-sm mt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Team
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
