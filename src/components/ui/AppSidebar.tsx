
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  Menu,
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
          <div className="p-2">
            <h1 className="text-lg font-bold">Trade Ease</h1>
          </div>
          <nav className="flex-1 p-1 space-y-0.5">
            <Link
              to="/"
              className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <a
              href="/jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Jobs
            </a>
            <Link
              to="/customers"
              className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm"
            >
              <Users className="w-3.5 h-3.5" />
              Customers
            </Link>
            <Link
              to="/quotes"
              className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              Quotes
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
